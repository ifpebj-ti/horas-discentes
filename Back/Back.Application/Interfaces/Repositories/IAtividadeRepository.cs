using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using Back.Domain.Entities.Atividade;

namespace Back.Application.Interfaces.Repositories;

public interface IAtividadeRepository
{
    Task<List<Atividade>> GetByCursoIdAsync(Guid cursoId);
    Task AddAsync(Atividade atividade);

}
