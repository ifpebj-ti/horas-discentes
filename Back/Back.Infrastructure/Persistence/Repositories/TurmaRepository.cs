using Back.Application.Interfaces.Repositories;
using Back.Domain.Entities.Aluno;
using Back.Domain.Entities.Turma;
using Back.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Back.Infrastructure.Persistence.Repositories;

public class TurmaRepository : ITurmaRepository
{
    private readonly ApplicationDbContext _context;

    public TurmaRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Turma turma)
    {
        _context.Turmas.Add(turma);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<Turma>> GetAllAsync()
    {
        return await _context.Turmas
            .Include(t => t.Curso)
            .Include(t => t.Alunos)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Turma?> GetByIdAsync(Guid id)
    {
        return await _context.Turmas
            .Include(t => t.Curso)
            .Include(t => t.Alunos)
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.Turmas.AnyAsync(t => t.Id == id);
    }

    public async Task<IEnumerable<Aluno>> GetAlunosByTurmaAsync(Guid turmaId)
    {
        return await _context.Alunos
            .AsNoTracking()
            .Where(a => a.TurmaId == turmaId)
            .ToListAsync();
    }
    public async Task<IEnumerable<Turma>> GetByCursoIdAsync(Guid cursoId)
    {
        return await _context.Turmas
            .Include(t => t.Curso)
            .Include(t=> t.Alunos)
            .AsNoTracking()
            .Where(t => t.CursoId == cursoId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Turma>> GetByCursoIdTrackedAsync(Guid cursoId)
    {
        return await _context.Turmas
            .Where(t => t.CursoId == cursoId)
            .ToListAsync();
    }

    public async Task RemoveRangeAsync(IEnumerable<Turma> turmas)
    {
        if (!turmas.Any()) return;
        _context.Turmas.RemoveRange(turmas);
        await _context.SaveChangesAsync();
    }
    public async Task<Turma?> GetByIdTrackedAsync(Guid id)
    {
        return await _context.Turmas
            .Include(t => t.Curso)
            .Include(t => t.Alunos)
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task UpdateAsync(Turma turma)
    {
        _context.Turmas.Update(turma);
        await _context.SaveChangesAsync();
    }
    public async Task DeleteAsync(Turma turma)
    {
        _context.Turmas.Remove(turma);
        await _context.SaveChangesAsync();
    }
}
