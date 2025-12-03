using Back.Domain.Entities.Atividade;
using FluentAssertions;

namespace Back.Domain.UnitTests;

public class AtividadeTests
{
    [Fact]
    public void Atividade_Valida_Deve_Passar()
    {
        var atividade = new AtividadeBuilder()
            .WithId(Guid.NewGuid())
            .WithNome("Atividade Teste")
            .WithCargaMaximaSemestral(10)
            .WithCargaMaximaCurso(40)
            .WithGrupo("GRUPO A")
            .WithTipo(TipoAtividade.EXTENSAO)
            .WithCategoria("Categoria X")
            .WithCategoriaKey("CAT-X")
            .WithCursoId(Guid.NewGuid())
            .Build();

        var results = ValidationHelper.ValidateObject(atividade);

        results.Should().BeEmpty();
    }

    [Fact]
    public void Atividade_Sem_Nome_Deve_Falhar()
    {
        var atividade = new AtividadeBuilder()
            .WithId(Guid.NewGuid())
            .WithCargaMaximaSemestral(10)
            .WithCargaMaximaCurso(40)
            .WithGrupo("Grupo")
            .WithTipo(TipoAtividade.COMPLEMENTAR)
            .WithCategoria("Categoria")
            .WithCategoriaKey("CAT")
            .WithCursoId(Guid.NewGuid())
            .Build();

        var results = ValidationHelper.ValidateObject(atividade);

        results.Should().Contain(r => r.MemberNames.Contains(nameof(Atividade.Nome)));
    }

    [Fact]
    public void Atividade_Sem_CursoId_Deve_Passar_Porque_Guid_Default_Eh_Valido()
    {
        var atividade = new AtividadeBuilder()
            .WithId(Guid.NewGuid())
            .WithNome("Atividade Teste")
            .WithCargaMaximaSemestral(10)
            .WithCargaMaximaCurso(40)
            .WithGrupo("Grupo")
            .WithTipo(TipoAtividade.COMPLEMENTAR)
            .WithCategoria("Cat")
            .WithCategoriaKey("Key")
            // Guide.Empty é permitido pelo DataAnnotations
            .Build();

        var results = ValidationHelper.ValidateObject(atividade);

        results.Should().BeEmpty();
    }
}
