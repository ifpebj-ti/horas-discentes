﻿using Back.Application.Interfaces.Repositories;
using Back.Domain.Entities.Atividade;
using Back.Domain.Entities.Certificado;
using Back.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Back.Infrastructure.Persistence.Repositories;

public class CertificadoRepository : ICertificadoRepository
{
    private readonly ApplicationDbContext _context;

    public CertificadoRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Certificado certificado)
    {
        _context.Certificados.Add(certificado);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<Certificado>> GetAsync(StatusCertificado? status, Guid? alunoId)
    {
        var query = _context.Certificados
            .Include(c => c.AlunoAtividade)
                .ThenInclude(aa => aa!.Atividade)
            .AsQueryable();

        if (status.HasValue)
            query = query.Where(c => c.Status == status);

        if (alunoId.HasValue)
            query = query.Where(c => c.AlunoAtividade!.AlunoId == alunoId);

        return await query.AsNoTracking().ToListAsync();
    }

    public async Task<Certificado?> GetByIdAsync(Guid id)
    {
        return await _context.Certificados
            .Include(c => c.AlunoAtividade)
                .ThenInclude(aa => aa!.Atividade)
            .FirstOrDefaultAsync(c => c.Id == id);
    }



    public async Task UpdateAsync(Certificado certificado)
    {
        _context.Certificados.Update(certificado);
        await _context.SaveChangesAsync();
    }
    public async Task<IEnumerable<Certificado>> GetByAlunoAtividadeAsync(Guid alunoAtividadeId)
    {
        return await _context.Certificados
            .Where(c => c.AlunoAtividadeId == alunoAtividadeId)
            .AsNoTracking()
            .ToListAsync();
    }
    public async Task<Certificado?> GetByIdWithAlunoAtividadeAsync(Guid id)
    {
        return await _context.Certificados
            .Include(c => c.AlunoAtividade)
                .ThenInclude(aa => aa!.Atividade)
            .FirstOrDefaultAsync(c => c.Id == id);
    }
    public async Task<IEnumerable<Certificado>> GetAllWithAlunoAtividadeAsync()
    {
        return await _context.Certificados
            .Include(c => c.AlunoAtividade)
                .ThenInclude(aa => aa!.Aluno)
                    .ThenInclude(a => a!.Turma)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<byte[]?> GetAnexoByIdAsync(Guid certificadoId)
    {
        return await _context.Certificados
            .Where(c => c.Id == certificadoId)
            .Select(c => c.Anexo)
            .FirstOrDefaultAsync();
    }
    public async Task<IEnumerable<Certificado>> GetCertificadosAprovadosPorAlunoAsync(Guid alunoId)
    {
        return await _context.Certificados
            .Include(c => c.AlunoAtividade)
                .ThenInclude(aa => aa!.Atividade)
            .Where(c => c.AlunoAtividade!.AlunoId == alunoId && c.Status == StatusCertificado.APROVADO)
            .AsNoTracking()
            .ToListAsync();
    }
}
