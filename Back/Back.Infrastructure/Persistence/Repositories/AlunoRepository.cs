using Back.Application.Interfaces.Repositories;
using Back.Domain.Entities.Aluno;
using Back.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace Back.Infrastructure.Persistence.Repositories;

public class AlunoRepository : IAlunoRepository
{
    private readonly ApplicationDbContext _context;

    public AlunoRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Aluno aluno)
    {
        _context.Alunos.Add(aluno);
        await _context.SaveChangesAsync();
    }

    public async Task<Aluno?> GetByIdAsync(Guid id)
    {
        return await _context.Alunos
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id == id);
    }
}
