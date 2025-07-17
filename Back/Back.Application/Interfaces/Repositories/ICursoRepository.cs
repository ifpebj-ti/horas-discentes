using Back.Application.DTOs.Curso;
using Back.Domain.Entities.Curso;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Back.Application.Interfaces.Repositories;

public interface ICursoRepository
{
    Task AddAsync(Curso curso);
    Task<Curso?> GetByIdAsync(Guid id);
    Task<IEnumerable<Curso>> GetAllAsync();
    Task<IEnumerable<CursoResumoResponse>> GetResumoCursosAsync();

}
