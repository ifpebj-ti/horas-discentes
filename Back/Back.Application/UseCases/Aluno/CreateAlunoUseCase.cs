using Back.Application.DTOs.Aluno;
using Back.Application.Interfaces.Identity;
using Back.Application.Interfaces.Repositories;
using Back.Domain.Entities.Aluno;
using Back.Domain.Entities.AlunoAtividade;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Back.Application.UseCases.Aluno;

public class CreateAlunoUseCase
{
    private readonly IAlunoRepository _alunoRepo;
    private readonly ITurmaRepository _turmaRepo;
    private readonly IAtividadeRepository _atividadeRepo;
    private readonly IAlunoAtividadeRepository _alunoAtividadeRepo;
    private readonly IIdentityService _identityService;

    public CreateAlunoUseCase(
        IAlunoRepository alunoRepo,
        ITurmaRepository turmaRepo,
        IAtividadeRepository atividadeRepo,
        IAlunoAtividadeRepository alunoAtividadeRepo,
        IIdentityService identityService)
    {
        _alunoRepo = alunoRepo;
        _turmaRepo = turmaRepo;
        _atividadeRepo = atividadeRepo;
        _alunoAtividadeRepo = alunoAtividadeRepo;
        _identityService = identityService;
    }

    public async Task<CreateAlunoResponse> ExecuteAsync(CreateAlunoRequest request)
    {
        // Verifica se a turma existe e carrega seus dados
        var turma = await _turmaRepo.GetByIdAsync(request.TurmaId);
        if (turma == null)
            throw new InvalidOperationException("Turma não encontrada.");

        // Criação do usuário no Identity
        var (success, userId, errors) = await _identityService.CreateUserAsync(
            request.Email, request.Senha, "ALUNO");

        if (!success)
            throw new InvalidOperationException("Erro ao criar usuário: " + string.Join("; ", errors));

        var alunoId = Guid.NewGuid();

        // Criação do aluno com IsAtivo = true (via builder)
        var aluno = new AlunoBuilder()
            .WithId(alunoId)
            .WithNome(request.Nome)
            .WithEmail(request.Email)
            .WithMatricula(request.Matricula)
            .WithTurmaId(request.TurmaId)
            .WithIdentityUserId(userId)
            .Build();

        await _alunoRepo.AddAsync(aluno);

        // Pega as atividades do mesmo curso da turma
        var atividades = await _atividadeRepo.GetByCursoIdAsync(turma.CursoId);

        var alunoAtividades = atividades.Select(atividade =>
            new AlunoAtividadeBuilder()
                .WithId(Guid.NewGuid())
                .WithAlunoId(alunoId)
                .WithAtividadeId(atividade.Id)
                .WithHorasConcluidas(0)
                .Build()
        ).ToList();

        await _alunoAtividadeRepo.AddRangeAsync(alunoAtividades);

        return new CreateAlunoResponse(aluno.Id, aluno.Nome!, aluno.Email!);
    }
}
