using Back.Application.UseCases.Certificado;
using Back.Application.Interfaces.Repositories;
using Back.Application.DTOs.Certificado;
using Back.Domain.Entities.Certificado;
using FluentAssertions;
using Moq;

namespace Back.Application.UnitTests.UseCases.Certificados;

public class UpdateCertificadoUseCaseTests
{
    private readonly Mock<ICertificadoRepository> _repo = new();

    private UpdateCertificadoUseCase CreateUseCase()
        => new(_repo.Object);

    [Fact]
    public async Task Deve_Atualizar_Certificado_Quando_Pendente()
    {
        var cert = new Certificado
        {
            Id = Guid.NewGuid(),
            Status = StatusCertificado.PENDENTE,
            TituloAtividade = "Old"
        };

        _repo.Setup(r => r.GetByIdAsync(cert.Id))
            .ReturnsAsync(cert);

        var req = new UpdateCertificadoRequest
        {
            TituloAtividade = "New",
            Instituicao = "IFPE",
            Local = "Campus",
            Categoria = "Cat",
            Grupo = "G",
            PeriodoLetivo = "2024.1",
            CargaHoraria = 10,
            DataInicio = DateTime.Today,
            DataFim = DateTime.Today,
            TotalPeriodos = 1,
            Tipo = Back.Domain.Entities.Atividade.TipoAtividade.COMPLEMENTAR
        };

        var useCase = CreateUseCase();

        await useCase.ExecuteAsync(cert.Id, req);

        cert.TituloAtividade.Should().Be("New");
        _repo.Verify(r => r.UpdateAsync(cert), Times.Once);
    }

    [Fact]
    public async Task Nao_Deve_Atualizar_Certificado_Aprovado()
    {
        var cert = new Certificado
        {
            Id = Guid.NewGuid(),
            Status = StatusCertificado.APROVADO
        };

        _repo.Setup(r => r.GetByIdAsync(cert.Id))
            .ReturnsAsync(cert);

        var req = new UpdateCertificadoRequest
        {
            TituloAtividade = "X",
            Instituicao = "Y",
            Local = "Z",
            Categoria = "C",
            Grupo = "G",
            PeriodoLetivo = "2024.1",
            CargaHoraria = 10,
            DataInicio = DateTime.Today,
            DataFim = DateTime.Today,
            TotalPeriodos = 1,
            Tipo = Back.Domain.Entities.Atividade.TipoAtividade.COMPLEMENTAR
        };

        var useCase = CreateUseCase();

        var act = async () => await useCase.ExecuteAsync(cert.Id, req);

        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("Não é possível alterar um certificado que já foi APROVADO.");
    }
}
