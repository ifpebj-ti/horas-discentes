using Back.Application.Interfaces.Repositories;
using Back.Application.UseCases.Atividade;
using FluentAssertions;
using Moq;

using DomainAtividade = Back.Domain.Entities.Atividade.Atividade;
using TipoAtividade = Back.Domain.Entities.Atividade.TipoAtividade;

namespace Back.Application.UnitTests.UseCases.Atividade;

public class GetAtividadesByCursoIdUseCaseTests
{
    [Fact]
    public async Task Deve_Retornar_Atividades_Do_Curso()
    {
        var repo = new Mock<IAtividadeRepository>();
        var cursoId = Guid.NewGuid();

        repo.Setup(r => r.GetByCursoIdAsync(cursoId))
            .ReturnsAsync(new List<DomainAtividade>
            {
                new DomainAtividade
                {
                    Id = Guid.NewGuid(),
                    Nome = "A1",
                    Grupo = "G1",
                    Categoria = "CAT",
                    CategoriaKey = "CK",
                    CargaMaximaCurso = 40,
                    CargaMaximaSemestral = 10,
                    CursoId = cursoId,
                    Tipo = TipoAtividade.EXTENSAO
                }
            });

        var useCase = new GetAtividadesByCursoIdUseCase(repo.Object);

        var result = (await useCase.ExecuteAsync(cursoId)).ToList();

        result.Should().HaveCount(1);
        result[0].Nome.Should().Be("A1");
        result[0].CursoId.Should().Be(cursoId);
    }
}
