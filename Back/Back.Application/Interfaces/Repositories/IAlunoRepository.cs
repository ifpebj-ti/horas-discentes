using Back.Domain.Entities.Aluno;
using System;
using System.Threading.Tasks;

namespace Back.Application.Interfaces.Repositories;

public interface IAlunoRepository
{
    Task AddAsync(Aluno aluno);
    Task<Aluno?> GetByIdAsync(Guid id);
}
