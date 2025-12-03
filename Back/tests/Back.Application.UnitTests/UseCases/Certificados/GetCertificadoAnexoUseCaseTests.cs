using Back.Application.UseCases.Certificado;
using Back.Application.Interfaces.Repositories;
using FluentAssertions;
using Moq;

namespace Back.Application.UnitTests.UseCases.Certificados;

public class GetCertificadoAnexoUseCaseTests
{
    private readonly Mock<ICertificadoRepository> _repo = new();

    private GetCertificadoAnexoUseCase CreateUseCase()
        => new(_repo.Object);

    [Fact]
    public async Task Deve_Retornar_Anexo_Com_Sucesso()
    {
        var id = Guid.NewGuid();
        var anexo = new byte[] { 1, 2, 3 };

        _repo.Setup(r => r.GetAnexoByIdAsync(id))
            .ReturnsAsync(anexo);

        var useCase = CreateUseCase();

        var result = await useCase.ExecuteAsync(id);

        result.anexo.Should().BeEquivalentTo(anexo);
        result.nomeArquivo.Should().Be($"certificado_{id}.pdf");
    }

    [Fact]
    public async Task Deve_Lancar_Erro_Quando_Anexo_Inexistente()
    {
        var id = Guid.NewGuid();

        _repo.Setup(r => r.GetAnexoByIdAsync(id))
            .ReturnsAsync((byte[]?)null);

        var useCase = CreateUseCase();

        var act = async () => await useCase.ExecuteAsync(id);

        await act.Should().ThrowAsync<KeyNotFoundException>()
            .WithMessage("Anexo não encontrado para este certificado.");
    }
}
