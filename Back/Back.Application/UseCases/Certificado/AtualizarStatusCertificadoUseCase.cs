using System;
using System.Linq;
using System.Threading.Tasks;
using Back.Application.Interfaces.Repositories;
using Back.Domain.Entities.Atividade;
using Back.Domain.Entities.Certificado;

namespace Back.Application.UseCases.Certificado;

public class AtualizarStatusCertificadoUseCase
{
    private readonly ICertificadoRepository _repo;
    private readonly IAlunoAtividadeRepository _alunoAtividadeRepo;
    private readonly ILimiteHorasAlunoRepository _limiteRepo;

    public AtualizarStatusCertificadoUseCase(
        ICertificadoRepository repo,
        IAlunoAtividadeRepository alunoAtividadeRepo,
        ILimiteHorasAlunoRepository limiteRepo)
    {
        _repo = repo;
        _alunoAtividadeRepo = alunoAtividadeRepo;
        _limiteRepo = limiteRepo;
    }

    public async Task<bool> ExecuteAsync(Guid id, StatusCertificado novoStatus)
    {
        var certificado = await _repo.GetByIdWithAlunoAtividadeAsync(id);
        if (certificado == null) return false;

        var alunoAtividade = certificado.AlunoAtividade!;
        var atividade = alunoAtividade.Atividade!;
        var limite = await _limiteRepo.GetByCursoIdAsync(atividade.CursoId);

        if (novoStatus == StatusCertificado.APROVADO)
        {
            var certificadosAprovados = await _repo.GetByAlunoAtividadeAsync(certificado.AlunoAtividadeId);
            certificadosAprovados = certificadosAprovados
                .Where(c => c.Status == StatusCertificado.APROVADO && c.Id != certificado.Id)
                .ToList();

            int maxTipo = atividade.Tipo == TipoAtividade.EXTENSAO
                ? limite?.MaximoHorasExtensao ?? int.MaxValue
                : limite?.MaximoHorasComplementar ?? int.MaxValue;

            int horasTipoConcluidas = certificadosAprovados
                .Where(c => c.Tipo == certificado.Tipo)
                .Sum(c => c.CargaHoraria);

            int horasCursoConcluidas = alunoAtividade.HorasConcluidas;

            int restanteTipo = maxTipo - horasTipoConcluidas;
            int restanteCurso = atividade.CargaMaximaCurso - horasCursoConcluidas;

            int horasPorPeriodo = certificado.CargaHoraria / certificado.TotalPeriodos;
            int totalPermitido = 0;

            for (int i = 0; i < certificado.TotalPeriodos; i++)
            {
                var horasMesmoPeriodo = certificadosAprovados
                    .Where(c => c.Grupo == certificado.Grupo && c.PeriodoLetivo == certificado.PeriodoLetivo)
                    .Sum(c => c.CargaHoraria);

                int restanteSemestre = atividade.CargaMaximaSemestral - horasMesmoPeriodo;

                int permitidoNestePeriodo = Math.Min(horasPorPeriodo,
                    Math.Min(restanteSemestre, Math.Min(restanteCurso, restanteTipo)));

                if (permitidoNestePeriodo <= 0)
                    break;

                totalPermitido += permitidoNestePeriodo;
                restanteCurso -= permitidoNestePeriodo;
                restanteTipo -= permitidoNestePeriodo;
            }

            alunoAtividade.HorasConcluidas += totalPermitido;
            await _alunoAtividadeRepo.UpdateAsync(alunoAtividade);
        }

        certificado.Status = novoStatus;
        await _repo.UpdateAsync(certificado);
        return true;
    }
}
