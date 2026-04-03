using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Back.Application.Interfaces.Repositories;

namespace Back.Application.UseCases.Certificado;

public class GetCertificadoAnexoUseCase
{
    private readonly ICertificadoRepository _repo;

    public GetCertificadoAnexoUseCase(ICertificadoRepository repo)
    {
        _repo = repo;
    }

    public async Task<(byte[] Anexo, string NomeArquivo, string ContentType)> ExecuteAsync(Guid certificadoId)
    {
        var (anexo, contentType) = await _repo.GetAnexoByIdAsync(certificadoId);

        if (anexo == null || anexo.Length == 0)
            throw new KeyNotFoundException("Anexo não encontrado para este certificado.");

        var mimeType = string.IsNullOrEmpty(contentType) ? "application/pdf" : contentType;
        var extension = mimeType switch
        {
            "image/jpeg" or "image/jpg" => ".jpg",
            "image/png"                 => ".png",
            _                           => ".pdf"
        };

        var nomeArquivo = $"certificado_{certificadoId}{extension}";

        return (anexo, nomeArquivo, mimeType);
    }
}
