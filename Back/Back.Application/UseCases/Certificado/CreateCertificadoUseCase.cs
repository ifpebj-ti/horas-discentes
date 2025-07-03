using Back.Application.DTOs.Certificado;
using Back.Application.Interfaces.Repositories;
using Back.Domain.Entities.Certificado;
using System;
using System.Threading.Tasks;

namespace Back.Application.UseCases.Certificado;

public class CreateCertificadoUseCase
{
    private readonly IAlunoAtividadeRepository _alunoAtividadeRepo;
    private readonly ICertificadoRepository _certificadoRepo;

    public CreateCertificadoUseCase(
        IAlunoAtividadeRepository alunoAtividadeRepo,
        ICertificadoRepository certificadoRepo)
    {
        _alunoAtividadeRepo = alunoAtividadeRepo;
        _certificadoRepo = certificadoRepo;
    }

    public async Task<Guid> ExecuteAsync(CreateCertificadoRequest request)
    {
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
            .WithAnexo(request.Anexo)
            .WithTipo(request.Tipo)
            .WithAlunoAtividadeId(alunoAtividade.Id)
            .Build();

        await _certificadoRepo.AddAsync(certificado);

        return certificado.Id;
    }
}
