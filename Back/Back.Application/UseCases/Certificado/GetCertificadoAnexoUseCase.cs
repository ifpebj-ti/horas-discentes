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

    public async Task<(byte[] anexo, string nomeArquivo)> ExecuteAsync(Guid certificadoId)
    {
        var anexo = await _repo.GetAnexoByIdAsync(certificadoId);

        if (anexo == null || anexo.Length == 0)
            throw new KeyNotFoundException("Anexo não encontrado para este certificado.");

        // Nome do arquivo baseado no ID (ou outro campo se desejar)
        var nomeArquivo = $"certificado_{certificadoId}.pdf";

        return (anexo, nomeArquivo);
    }
}
