using Back.Application.DTOs.Certificado;
using Back.Application.Interfaces.Repositories;
using Back.Application.UseCases.Certificado;
using Back.Domain.Entities.AlunoAtividade;
using Back.Domain.Entities.Certificado;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Internal;
using Moq;
using System.Text;

namespace Back.Application.UnitTests.UseCases.Certificados;

public class CreateCertificadoUseCaseTests
{
    private readonly Mock<IAlunoAtividadeRepository> _alunoAtvRepo = new();
    private readonly Mock<ICertificadoRepository> _certRepo = new();
    private readonly Mock<ILimiteHorasAlunoRepository> _limiteRepo = new();

    private CreateCertificadoUseCase CreateUseCase()
        => new(_alunoAtvRepo.Object, _certRepo.Object, _limiteRepo.Object);

    [Fact]
    public async Task Deve_Criar_Certificado_Com_Sucesso()
    {
        // Arrange
        var alunoAtv = new AlunoAtividade { Id = Guid.NewGuid() };
        _alunoAtvRepo.Setup(r => r.GetByAlunoEAtividadeAsync(It.IsAny<Guid>(), It.IsAny<Guid>()))
            .ReturnsAsync(alunoAtv);

        var file = new FormFile(
            baseStream: new MemoryStream(Encoding.UTF8.GetBytes("PDF")),
            baseStreamOffset: 0,
            length: 3,
            name: "file",
            fileName: "file.pdf"
        );

        var req = new CreateCertificadoRequest
        {
            TituloAtividade = "Curso X",
            Instituicao = "IFPE",
            Local = "Campus",
            Categoria = "Cat",
            Grupo = "G1",
            PeriodoLetivo = "2024.1",
            CargaHoraria = 20,
            DataInicio = DateTime.Today,
            DataFim = DateTime.Today,
            TotalPeriodos = 1,
            Anexo = file,
            Tipo = Back.Domain.Entities.Certificado.TipoCertificado.COMPLEMENTAR,
            AlunoId = Guid.NewGuid(),
            AtividadeId = Guid.NewGuid()
        };

        var useCase = CreateUseCase();

        // Act
        var id = await useCase.ExecuteAsync(req);

        // Assert
        id.Should().NotBeEmpty();
        _certRepo.Verify(r => r.AddAsync(It.IsAny<Certificado>()), Times.Once);
    }
}
