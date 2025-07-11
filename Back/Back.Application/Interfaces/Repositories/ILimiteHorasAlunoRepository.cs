using Back.Domain.Entities.LimiteHorasAluno;
using System;
using System.Threading.Tasks;

namespace Back.Application.Interfaces.Repositories;

public interface ILimiteHorasAlunoRepository
{
    Task<LimiteHorasAluno?> GetByCursoIdAsync(Guid cursoId);
    Task AddAsync(LimiteHorasAluno limite);
}
