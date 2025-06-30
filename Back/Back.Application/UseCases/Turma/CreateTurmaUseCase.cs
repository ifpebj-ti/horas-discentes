using Back.Application.DTOs.Turma;
using Back.Application.Interfaces.Repositories;
using Back.Domain.Entities.Turma;
using System;
using System.Threading.Tasks;

namespace Back.Application.UseCases.Turma;

public class CreateTurmaUseCase
{
    private readonly ITurmaRepository _repo;

    public CreateTurmaUseCase(ITurmaRepository repo)
    {
        _repo = repo;
    }

    public async Task<TurmaResponse> ExecuteAsync(CreateTurmaRequest request)
    {
        var turma = new TurmaBuilder()
            .WithId(Guid.NewGuid())
            .WithPeriodo(request.Periodo)
            .WithTurno(request.Turno)
            .WithPossuiExtensao(request.PossuiExtensao)
            .WithCursoId(request.CursoId)
            .Build();

        await _repo.AddAsync(turma);

        return new TurmaResponse(
            turma.Id, turma.Periodo, turma.Turno, turma.PossuiExtensao, turma.CursoId);
    }
}
