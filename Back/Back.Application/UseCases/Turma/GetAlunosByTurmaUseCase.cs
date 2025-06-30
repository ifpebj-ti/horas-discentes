using Back.Application.DTOs.Turma;
using Back.Application.Interfaces.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Back.Application.UseCases.Turma;

public class GetAlunosByTurmaUseCase
{
    private readonly ITurmaRepository _repo;

    public GetAlunosByTurmaUseCase(ITurmaRepository repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<AlunoPorTurmaResponse>> ExecuteAsync(Guid turmaId)
    {
        var alunos = await _repo.GetAlunosByTurmaAsync(turmaId);

        return alunos.Select(a =>
            new AlunoPorTurmaResponse(a.Id, a.Nome, a.Email, a.Matricula));
    }
}
