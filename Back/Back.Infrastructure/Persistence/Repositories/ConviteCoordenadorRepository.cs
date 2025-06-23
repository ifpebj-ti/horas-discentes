using Back.Application.Interfaces.Repositories;
using Back.Domain.Entities.Convite;
using Back.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace Back.Infrastructure.Persistence.Repositories;

public class ConviteCoordenadorRepository : IConviteCoordenadorRepository
{
    private readonly ApplicationDbContext _context;

    public ConviteCoordenadorRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(ConviteCoordenador convite)
    {
        _context.Convites.Add(convite);
        await _context.SaveChangesAsync();
    }

    public async Task<ConviteCoordenador?> GetValidByTokenAsync(string token)
    {
        return await _context.Convites
            .FirstOrDefaultAsync(c =>
                c.Token == token &&
                !c.Usado &&
                c.ExpiraEm > DateTime.UtcNow);
    }

    public async Task MarcarComoUsadoAsync(ConviteCoordenador convite)
    {
        convite.Usado = true;
        await _context.SaveChangesAsync();
    }
}
