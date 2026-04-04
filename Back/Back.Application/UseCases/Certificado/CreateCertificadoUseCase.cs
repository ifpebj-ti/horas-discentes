using Back.Application.DTOs.Certificado;
using Back.Application.Extensions;
using Back.Application.Interfaces.Repositories;
using Back.Application.Interfaces.Services;
using Back.Domain.Entities.Certificado;
using System;
using System.Threading.Tasks;

namespace Back.Application.UseCases.Certificado;

public class CreateCertificadoUseCase
{
    private readonly IAlunoAtividadeRepository _alunoAtividadeRepo;
    private readonly ICertificadoRepository _certificadoRepo;
    private readonly ILimiteHorasAlunoRepository _limiteRepo;
    private readonly IFileStorageService _storage;

    public CreateCertificadoUseCase(
        IAlunoAtividadeRepository alunoAtividadeRepo,
        ICertificadoRepository certificadoRepo,
        ILimiteHorasAlunoRepository limiteRepo,
        IFileStorageService storage)
    {
        _alunoAtividadeRepo = alunoAtividadeRepo;
        _certificadoRepo = certificadoRepo;
        _limiteRepo = limiteRepo;
        _storage = storage;
    }

    public async Task<Guid> ExecuteAsync(CreateCertificadoRequest request)
    {
        if (request.Anexo == null || request.Anexo.Length == 0)
            throw new InvalidOperationException("O anexo é obrigatório e deve conter conteúdo válido.");

        request.Anexo.ValidateAnexo();

        var alunoAtividade = await _alunoAtividadeRepo
            .GetByAlunoEAtividadeAsync(request.AlunoId, request.AtividadeId);

        if (alunoAtividade == null)
            throw new InvalidOperationException("A atividade não está vinculada ao aluno informado.");

        var certificadoId = Guid.NewGuid();
        var extension = request.Anexo.ContentType.ToLowerInvariant() switch
        {
            "image/jpeg" or "image/jpg" => ".jpg",
            "image/png"                 => ".png",
            _                           => ".pdf"
        };
        var storageKey = $"certificados/{certificadoId}{extension}";
        await _storage.UploadAsync(request.Anexo, storageKey);

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
            .WithAnexoStorageKey(storageKey)
            .WithTipo(request.Tipo)
            .WithAlunoAtividadeId(alunoAtividade.Id)
            .Build();

        await _certificadoRepo.AddAsync(certificado);
        return certificado.Id;
    }
}
