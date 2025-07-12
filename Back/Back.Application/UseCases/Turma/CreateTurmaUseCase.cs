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

        // Recarrega com curso incluído
        var turmaCompleta = await _repo.GetByIdAsync(turma.Id);

        return new TurmaResponse(
            turmaCompleta!.Id,
            turmaCompleta.Periodo!,
            turmaCompleta.Turno!,
            turmaCompleta.PossuiExtensao,
            turmaCompleta.CursoId,
            turmaCompleta.Curso?.Nome ?? "Curso não encontrado",
            turmaCompleta.Alunos.Count
        );
    }

}
