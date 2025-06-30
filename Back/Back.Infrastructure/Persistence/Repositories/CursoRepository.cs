using Back.Application.Interfaces.Repositories;
using Back.Domain.Entities.Curso;
using Back.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Back.Infrastructure.Persistence.Repositories;

public class CursoRepository : ICursoRepository
{
    private readonly ApplicationDbContext _context;

    public CursoRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Curso curso)
    {
        _context.Cursos.Add(curso);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<Curso>> GetAllAsync()
    {
        return await _context.Cursos.AsNoTracking().ToListAsync();
    }

    public async Task<Curso?> GetByIdAsync(Guid id)
    {
        return await _context.Cursos.AsNoTracking().FirstOrDefaultAsync(c => c.Id == id);
    }
}
