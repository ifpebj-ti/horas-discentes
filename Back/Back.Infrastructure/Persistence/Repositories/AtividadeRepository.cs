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
    public async Task AddAsync(Atividade atividade)
    {
        _context.Atividades.Add(atividade);
        await _context.SaveChangesAsync();
    }

    public async Task<Atividade?> GetByIdAsync(Guid id)
    {
        // Usamos FindAsync para chaves primárias, é mais otimizado.
        return await _context.Atividades.FindAsync(id);
    }

    public async Task UpdateAsync(Atividade atividade)
    {
        _context.Atividades.Update(atividade);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Atividade atividade)
    {
        _context.Atividades.Remove(atividade);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<Atividade>> GetByCursoIdTrackedAsync(Guid cursoId)
    {
        // Sem AsNoTracking() para permitir a exclusão
        return await _context.Atividades
            .Where(a => a.CursoId == cursoId)
            .ToListAsync();
    }

    public async Task RemoveRangeAsync(IEnumerable<Atividade> atividades)
    {
        if (!atividades.Any()) return;
        _context.Atividades.RemoveRange(atividades);
        await _context.SaveChangesAsync();
    }

}
