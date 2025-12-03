using Back.Application.UseCases.Certificado;
using Back.Application.Interfaces.Repositories;
using Back.Domain.Entities.Certificado;
using Back.Domain.Entities.Atividade;
using Back.Domain.Entities.AlunoAtividade;
using Moq;
using FluentAssertions;

namespace Back.Application.UnitTests.UseCases.Certificados;

public class AtualizarStatusCertificadoUseCaseTests
{
    private readonly Mock<ICertificadoRepository> _certRepo = new();
    private readonly Mock<IAlunoAtividadeRepository> _alunoAtvRepo = new();
    private readonly Mock<ILimiteHorasAlunoRepository> _limiteRepo = new();

    private AtualizarStatusCertificadoUseCase CreateUseCase()
        => new(_certRepo.Object, _alunoAtvRepo.Object, _limiteRepo.Object);

    [Fact]
    public async Task Deve_Aprovar_Certificado_Sem_Acrescentar_Horas_Quando_Limite_Zerado()
    {
        // Arrange
        var id = Guid.NewGuid();

        var atividade = new Back.Domain.Entities.Atividade.Atividade
        {
            Id = Guid.NewGuid(),
            CargaMaximaCurso = 40,
            CargaMaximaSemestral = 10,
            Tipo = TipoAtividade.COMPLEMENTAR,
            CursoId = Guid.NewGuid()
        };

        var alunoAtv = new AlunoAtividade
        {
            Id = Guid.NewGuid(),
            AlunoId = Guid.NewGuid(),
            AtividadeId = atividade.Id,
            Atividade = atividade,
            HorasConcluidas = 40
        };

        var cert = new Certificado
        {
            Id = id,
            AlunoAtividadeId = alunoAtv.Id,
            AlunoAtividade = alunoAtv,
            Grupo = "G1",
            PeriodoLetivo = "2024.1",
            CargaHoraria = 10,
            TotalPeriodos = 1,
            Status = StatusCertificado.PENDENTE
        };

        _certRepo.Setup(r => r.GetByIdWithAlunoAtividadeAsync(id))
            .ReturnsAsync(cert);

        _limiteRepo.Setup(r => r.GetByCursoIdAsync(atividade.CursoId))
            .ReturnsAsync(new Back.Domain.Entities.LimiteHorasAluno.LimiteHorasAluno
            {
                CursoId = atividade.CursoId,
                MaximoHorasComplementar = 40
            });

        _alunoAtvRepo.Setup(r => r.GetTotalHorasConcluidasPorTipoAsync(alunoAtv.AlunoId, TipoAtividade.COMPLEMENTAR))
            .ReturnsAsync(40);

        var useCase = CreateUseCase();

        // Act
        var result = await useCase.ExecuteAsync(id, StatusCertificado.APROVADO);

        // Assert
        result.Should().BeTrue();
        alunoAtv.HorasConcluidas.Should().Be(40);

        _certRepo.Verify(r => r.UpdateAsync(It.IsAny<Certificado>()), Times.Once);
    }
}
