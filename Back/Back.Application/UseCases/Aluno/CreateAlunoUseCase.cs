using Back.Application.DTOs.Aluno;
using Back.Application.Interfaces.Identity;
using Back.Application.Interfaces.Repositories;
using Back.Domain.Entities.Aluno;
using System;
using System.Threading.Tasks;

namespace Back.Application.UseCases.Aluno;

public class CreateAlunoUseCase
{
    private readonly IAlunoRepository _alunoRepo;
    private readonly ITurmaRepository _turmaRepo;
    private readonly IIdentityService _identityService;

    public CreateAlunoUseCase(
        IAlunoRepository alunoRepo,
        ITurmaRepository turmaRepo,
        IIdentityService identityService)
    {
        _alunoRepo = alunoRepo;
        _turmaRepo = turmaRepo;
        _identityService = identityService;
    }

    public async Task<CreateAlunoResponse> ExecuteAsync(CreateAlunoRequest request)
    {
        var turmaExiste = await _turmaRepo.ExistsAsync(request.TurmaId);
        if (!turmaExiste)
            throw new InvalidOperationException("Turma não encontrada.");

        var (success, userId, errors) = await _identityService.CreateUserAsync(
            request.Email, request.Senha, "ALUNO");

        if (!success)
            throw new InvalidOperationException("Erro ao criar usuário: " + string.Join("; ", errors));

        var aluno = new AlunoBuilder()
            .WithId(Guid.NewGuid())
            .WithNome(request.Nome)
            .WithEmail(request.Email)
            .WithMatricula(request.Matricula)
            .WithTurmaId(request.TurmaId)
            .WithIdentityUserId(userId)
            .Build();

        await _alunoRepo.AddAsync(aluno);

        return new CreateAlunoResponse(aluno.Id, aluno.Nome, aluno.Email);
    }
}
