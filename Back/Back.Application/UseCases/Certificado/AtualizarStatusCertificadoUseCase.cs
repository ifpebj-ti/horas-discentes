using System.Threading.Tasks;
using System;
using Back.Application.Interfaces.Repositories;
using Back.Domain.Entities.Certificado;

namespace Back.Application.UseCases.Certificado;

public class AtualizarStatusCertificadoUseCase
{
    private readonly ICertificadoRepository _repo;

    public AtualizarStatusCertificadoUseCase(ICertificadoRepository repo)
    {
        _repo = repo;
    }

    public async Task<bool> ExecuteAsync(Guid id, StatusCertificado novoStatus)
    {
        var certificado = await _repo.GetByIdAsync(id);
        if (certificado == null)
            return false;

        certificado.Status = novoStatus;
        await _repo.UpdateAsync(certificado);
        return true;
    }
}
