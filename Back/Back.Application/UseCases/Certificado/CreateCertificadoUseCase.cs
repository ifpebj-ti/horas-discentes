using Back.Application.DTOs.Certificado;
using Back.Application.Extensions;
using Back.Application.Interfaces.Repositories;
using Back.Domain.Entities.Atividade;
using Back.Domain.Entities.Certificado;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Back.Application.UseCases.Certificado;

public class CreateCertificadoUseCase
{
    private readonly IAlunoAtividadeRepository _alunoAtividadeRepo;
    private readonly ICertificadoRepository _certificadoRepo;
    private readonly ILimiteHorasAlunoRepository _limiteRepo;

    public CreateCertificadoUseCase(
        IAlunoAtividadeRepository alunoAtividadeRepo,
        ICertificadoRepository certificadoRepo,
        ILimiteHorasAlunoRepository limiteRepo)
    {
        _alunoAtividadeRepo = alunoAtividadeRepo;
        _certificadoRepo = certificadoRepo;
        _limiteRepo = limiteRepo;
    }

    public async Task<Guid> ExecuteAsync(CreateCertificadoRequest request)
    {
        if (request.Anexo == null || request.Anexo.Length == 0)
            throw new InvalidOperationException("O anexo é obrigatório e deve conter conteúdo válido.");

        var alunoAtividade = await _alunoAtividadeRepo
            .GetByAlunoEAtividadeAsync(request.AlunoId, request.AtividadeId);

        if (alunoAtividade == null)
            throw new InvalidOperationException("A atividade não está vinculada ao aluno informado.");

        var certificadoId = Guid.NewGuid();
        var certificado = new CertificadoBuilder()
            .WithId(certificadoId)
            .WithTituloAtividade(request.TituloAtividade)
            .WithInstituicao(request.Instituicao)
            .WithLocal(request.Local)
            .WithCategoria(request.Categoria)
            .WithGrupo(request.Grupo)
            .WithPeriodoLetivo(request.PeriodoLetivo)
            .WithCargaHoraria(request.CargaHoraria)
            .WithDataInicio(request.DataInicio)
            .WithDataFim(request.DataFim)
            .WithTotalPeriodos(request.TotalPeriodos)
            .WithDescricao(request.Descricao)
            .WithAnexo(await request.Anexo.ToByteArrayAsync())
            .WithTipo(request.Tipo)
            .WithAlunoAtividadeId(alunoAtividade.Id)
            .Build();

        await _certificadoRepo.AddAsync(certificado);
        return certificado.Id;
    }
}
