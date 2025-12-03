using Back.Application.DTOs.Atividade;
using Back.Application.Interfaces.Repositories;
using Back.Application.UseCases.Atividade;
using FluentAssertions;
using Moq;

// Alias para evitar conflito com namespace Atividade
using DomainAtividade = Back.Domain.Entities.Atividade.Atividade;
using DomainAlunoAtividade = Back.Domain.Entities.AlunoAtividade.AlunoAtividade;
using DomainAluno = Back.Domain.Entities.Aluno.Aluno;
using TipoAtividade = Back.Domain.Entities.Atividade.TipoAtividade;
using Back.Domain.Entities.Aluno;

namespace Back.Application.UnitTests.UseCases.Atividade;

public class CreateAtividadeUseCaseTests
{
    [Fact]
    public async Task Deve_Criar_Atividade_E_Gerar_AlunoAtividade()
    {
        var atividadeRepo = new Mock<IAtividadeRepository>();
        var alunoRepo = new Mock<IAlunoRepository>();
        var alunoAtividadeRepo = new Mock<IAlunoAtividadeRepository>();

        var cursoId = Guid.NewGuid();

        var alunos = new List<DomainAluno>
        {
            new AlunoBuilder()
                .WithId(Guid.NewGuid())
                .WithNome("Aluno 1")
                .WithEmail("a1@ifpe.edu.br")
                .WithMatricula("123")
                .WithTurmaId(Guid.NewGuid())
                .WithIdentityUserId("ID1")
                .Build()
        };

        alunoRepo.Setup(r => r.GetByCursoIdAsync(cursoId)).ReturnsAsync(alunos);

        var request = new CreateAtividadeRequest
        {
            Nome = "Atividade Teste",
            Grupo = "G1",
            Categoria = "CAT",
            CategoriaKey = "CK",
            CursoId = cursoId,
            CargaMaximaCurso = 40,
            CargaMaximaSemestral = 10,
            Tipo = TipoAtividade.COMPLEMENTAR
        };

        var useCase = new CreateAtividadeUseCase(
            atividadeRepo.Object,
            alunoRepo.Object,
            alunoAtividadeRepo.Object
        );

        var result = await useCase.ExecuteAsync(request);

        result.Should().NotBe(Guid.Empty);

        atividadeRepo.Verify(repo => repo.AddAsync(It.IsAny<DomainAtividade>()), Times.Once);
        alunoAtividadeRepo.Verify(repo => repo.AddRangeAsync(It.IsAny<IEnumerable<DomainAlunoAtividade>>()), Times.Once);
    }
}
