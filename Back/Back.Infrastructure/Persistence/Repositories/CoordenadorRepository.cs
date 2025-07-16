using Back.Application.Interfaces.Repositories;
using Back.Domain.Entities.Coordenador;
using Back.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Back.Infrastructure.Persistence.Repositories;

public class CoordenadorRepository : ICoordenadorRepository
{
    private readonly ApplicationDbContext _context;

    public CoordenadorRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Coordenador coordenador)
    {
        _context.Coordenadores.Add(coordenador);
        await _context.SaveChangesAsync();
    }
    public async Task<Coordenador?> GetByIdentityUserIdWithCursoAsync(string identityUserId)
    {
        return await _context.Coordenadores
            .Include(c => c.Curso)
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.IdentityUserId == identityUserId);
    }
}
