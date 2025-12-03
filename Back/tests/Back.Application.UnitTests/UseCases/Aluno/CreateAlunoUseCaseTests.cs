using Back.Application.DTOs.Aluno;
using Back.Application.Interfaces.Identity;
using Back.Application.Interfaces.Repositories;
using Back.Application.UseCases.Aluno;
using Back.Domain.Entities.Turma;
using FluentAssertions;
using Moq;

using DomainAtividade = Back.Domain.Entities.Atividade.Atividade;

namespace Back.Application.UnitTests.UseCases.Aluno;

public class CreateAlunoUseCaseTests
{
    private readonly Mock<IAlunoRepository> _alunoRepo = new();
    private readonly Mock<ITurmaRepository> _turmaRepo = new();
    private readonly Mock<IAtividadeRepository> _atividadeRepo = new();
    private readonly Mock<IAlunoAtividadeRepository> _alunoAtividadeRepo = new();
    private readonly Mock<IIdentityService> _identityService = new();

    private CreateAlunoUseCase CreateUseCase()
        => new CreateAlunoUseCase(
            _alunoRepo.Object,
            _turmaRepo.Object,
            _atividadeRepo.Object,
            _alunoAtividadeRepo.Object,
            _identityService.Object
        );

    [Fact]
    public async Task Deve_Criar_Aluno_Com_Sucesso()
    {
        // Arrange
        var turma = new TurmaBuilder()
            .WithId(Guid.NewGuid())
            .WithPeriodo("2024.1")
            .WithTurno("Noite")
            .WithCursoId(Guid.NewGuid())
            .Build();

        _turmaRepo.Setup(r => r.GetByIdAsync(turma.Id))
            .ReturnsAsync(turma);

        _identityService.Setup(r => r.CreateUserAsync("a@b.com", "123", "ALUNO"))
            .ReturnsAsync((true, "identity-1", Array.Empty<string>()));

        _atividadeRepo.Setup(r => r.GetByCursoIdAsync(turma.CursoId))
            .ReturnsAsync(new List<DomainAtividade>());

        var request = new CreateAlunoRequest(
            Nome: "Aluno",
            Email: "a@b.com",
            Matricula: "0001",
            Senha: "123",
            TurmaId: turma.Id
        );

        var useCase = CreateUseCase();

        // Act
        var result = await useCase.ExecuteAsync(request);

        // Assert
        result.Should().NotBeNull();
        result.Email.Should().Be("a@b.com");

        _alunoRepo.Verify(r => r.AddAsync(It.IsAny<Back.Domain.Entities.Aluno.Aluno>()), Times.Once);
    }
}
