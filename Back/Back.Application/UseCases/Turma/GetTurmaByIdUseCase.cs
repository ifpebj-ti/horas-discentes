using Back.Application.DTOs.Turma;
using Back.Application.Interfaces.Repositories;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Back.Application.UseCases.Turma;

public class GetTurmaByIdUseCase
{
    private readonly ITurmaRepository _repo;

    public GetTurmaByIdUseCase(ITurmaRepository repo)
    {
        _repo = repo;
    }

    public async Task<TurmaResponse> ExecuteAsync(Guid id)
    {
        var turma = await _repo.GetByIdAsync(id);
        if (turma == null)
            throw new KeyNotFoundException("Turma não encontrada.");

        return new TurmaResponse(turma.Id, turma.Periodo!, turma.Turno!, turma.PossuiExtensao, turma.CursoId, turma.Curso?.Nome ?? "curso não encontrado");
    }
}
