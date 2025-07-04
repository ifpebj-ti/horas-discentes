using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Back.Application.Interfaces.Repositories;
using Back.Domain.Entities.AlunoAtividade;
using Back.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace Back.Infrastructure.Persistence.Repositories;

public class AlunoAtividadeRepository : IAlunoAtividadeRepository
{
    private readonly ApplicationDbContext _context;

    public AlunoAtividadeRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AddRangeAsync(IEnumerable<AlunoAtividade> alunoAtividades)
    {
        _context.AlunoAtividades.AddRange(alunoAtividades);
        await _context.SaveChangesAsync();
    }

    public async Task<AlunoAtividade?> GetByAlunoEAtividadeAsync(Guid alunoId, Guid atividadeId)
    {
        return await _context.AlunoAtividades
            .Include(aa => aa.Atividade) 
            .FirstOrDefaultAsync(aa => aa.AlunoId == alunoId && aa.AtividadeId == atividadeId);
    }
    public async Task UpdateAsync(AlunoAtividade alunoAtividade)
    {
        _context.AlunoAtividades.Update(alunoAtividade);
        await _context.SaveChangesAsync();
    }
}
