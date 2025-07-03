using System.Collections.Generic;
using System;
using System.Threading.Tasks;
using Back.Domain.Entities.Certificado;

namespace Back.Application.Interfaces.Repositories;

public interface ICertificadoRepository
{
    Task AddAsync(Certificado certificado);
    Task<IEnumerable<Certificado>> GetAsync(StatusCertificado? status, Guid? alunoId);
    Task<Certificado?> GetByIdAsync(Guid id);
    Task UpdateAsync(Certificado certificado);
}
