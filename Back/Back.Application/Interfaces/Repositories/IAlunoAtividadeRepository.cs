using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Back.Domain.Entities.AlunoAtividade;

namespace Back.Application.Interfaces.Repositories;

public interface IAlunoAtividadeRepository
{
    Task AddRangeAsync(IEnumerable<AlunoAtividade> alunoAtividades);
    Task<AlunoAtividade?> GetByAlunoEAtividadeAsync(Guid alunoId, Guid atividadeId);
    Task UpdateAsync(AlunoAtividade alunoAtividade);
}
