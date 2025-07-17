using Back.Application.DTOs.Aluno;
using Back.Application.DTOs.Turma;
using Back.Application.Interfaces.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Back.Application.UseCases.Turma;

public class GetAlunosByTurmaUseCase
{
    private readonly ITurmaRepository _turmaRepo;
    private readonly IAlunoRepository _alunoRepo;
    private readonly ILimiteHorasAlunoRepository _limiteRepo;

    public GetAlunosByTurmaUseCase(
        ITurmaRepository turmaRepo,
        IAlunoRepository alunoRepo,
        ILimiteHorasAlunoRepository limiteRepo)
    {
        _turmaRepo = turmaRepo;
        _alunoRepo = alunoRepo;
        _limiteRepo = limiteRepo;
    }

    public async Task<IEnumerable<AlunoPorTurmaDetalhadoResponse>> ExecuteAsync(Guid turmaId)
    {
        var alunos = await _turmaRepo.GetAlunosByTurmaAsync(turmaId);
        var turma = await _turmaRepo.GetByIdAsync(turmaId);
        var limite = await _limiteRepo.GetByCursoIdAsync(turma!.CursoId);

        var result = new List<AlunoPorTurmaDetalhadoResponse>();

        foreach (var aluno in alunos)
        {
            var atividades = await _alunoRepo.GetAtividadesByAlunoIdAsync(aluno.Id);

            var atividadesExtensao = atividades.Where(x => x.Atividade!.Tipo == Domain.Entities.Atividade.TipoAtividade.EXTENSAO);
            var atividadesComplementar = atividades.Where(x => x.Atividade!.Tipo == Domain.Entities.Atividade.TipoAtividade.COMPLEMENTAR);

            int totalHorasExtensao = atividadesExtensao.Sum(x => x.HorasConcluidas);
            int totalHorasComplementar = atividadesComplementar.Sum(x => x.HorasConcluidas);

            double porcentagem = 0;
            if (turma.PossuiExtensao)
            {
                var pExt = limite!.MaximoHorasExtensao > 0 ? ((double)totalHorasExtensao / limite.MaximoHorasExtensao) * 100 : 0;
                var pComp = limite!.MaximoHorasComplementar > 0 ? ((double)totalHorasComplementar / limite.MaximoHorasComplementar) * 100 : 0;
                porcentagem = (double)Math.Round((double)((pExt + pComp) / 2), 2);
            }
            else
            {
                porcentagem = limite!.MaximoHorasComplementar > 0
                    ? Math.Round((double)totalHorasComplementar / limite.MaximoHorasComplementar * 100, 2)
                    : 0;
            }

            result.Add(new AlunoPorTurmaDetalhadoResponse(
                aluno.Id,
                aluno.Nome!,
                aluno.Email!,
                aluno.Matricula!,
                aluno.IsAtivo,
                totalHorasExtensao,
                totalHorasComplementar,
                limite?.MaximoHorasExtensao ?? 0,
                limite?.MaximoHorasComplementar ?? 0,
                porcentagem
            ));
        }

        return result;
    }
}
