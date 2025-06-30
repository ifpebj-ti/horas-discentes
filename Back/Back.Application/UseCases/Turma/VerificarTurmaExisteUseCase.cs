using Back.Application.Interfaces.Repositories;
using System;
using System.Threading.Tasks;

namespace Back.Application.UseCases.Turma;

public class VerificarTurmaExisteUseCase
{
    private readonly ITurmaRepository _repo;

    public VerificarTurmaExisteUseCase(ITurmaRepository repo)
    {
        _repo = repo;
    }

    public async Task<bool> ExecuteAsync(Guid turmaId)
    {
        return await _repo.ExistsAsync(turmaId);
    }
}
