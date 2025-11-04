using Back.Application.DTOs.Turma;
using Back.Application.Interfaces.Repositories;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Back.Application.UseCases.Turma;

public class UpdateTurmaUseCase
{
    private readonly ITurmaRepository _repo;

    public UpdateTurmaUseCase(ITurmaRepository repo)
    {
        _repo = repo;
    }

    public async Task<TurmaResponse> ExecuteAsync(Guid id, UpdateTurmaRequest request)
    {
        // 1. Busca a turma (rastreada e com includes)
        var turma = await _repo.GetByIdTrackedAsync(id);
        if (turma == null)
            throw new KeyNotFoundException("Turma não encontrada.");

        // 2. Atualiza as propriedades
        turma.Periodo = request.Periodo;
        turma.Turno = request.Turno;
        turma.PossuiExtensao = request.PossuiExtensao;
        turma.CursoId = request.CursoId;

        // 3. Salva
        await _repo.UpdateAsync(turma);

        // 4. Retorna a resposta formatada
        return new TurmaResponse(
            turma.Id,
            turma.Periodo!,
            turma.Turno!,
            turma.PossuiExtensao,
            turma.CursoId,
            turma.Curso?.Nome ?? "Curso não encontrado",
            turma.Alunos.Count
        );
    }
}