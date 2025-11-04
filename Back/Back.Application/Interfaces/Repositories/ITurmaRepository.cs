using Back.Domain.Entities.Aluno;
using Back.Domain.Entities.Turma;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Back.Application.Interfaces.Repositories;

public interface ITurmaRepository
{
    Task AddAsync(Turma turma);
    Task<IEnumerable<Turma>> GetAllAsync();
    Task<Turma?> GetByIdAsync(Guid id);
    Task<bool> ExistsAsync(Guid id);
    Task<IEnumerable<Aluno>> GetAlunosByTurmaAsync(Guid turmaId);
    Task<IEnumerable<Turma>> GetByCursoIdAsync(Guid cursoId);
    Task<IEnumerable<Turma>> GetByCursoIdTrackedAsync(Guid cursoId);
    Task RemoveRangeAsync(IEnumerable<Turma> turmas);
    Task<Turma?> GetByIdTrackedAsync(Guid id);
    Task UpdateAsync(Turma turma);
    Task DeleteAsync(Turma turma);
}
