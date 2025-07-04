using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;
using Back.Application.Interfaces.Repositories;
using Back.Domain.Entities.Atividade;
using Back.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace Back.Infrastructure.Persistence.Repositories;

public class AtividadeRepository : IAtividadeRepository
{
    private readonly ApplicationDbContext _context;

    public AtividadeRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Atividade>> GetByCursoIdAsync(Guid cursoId)
    {
        return await _context.Atividades
            .AsNoTracking()
            .Where(a => a.CursoId == cursoId)
            .ToListAsync();
    }
}
