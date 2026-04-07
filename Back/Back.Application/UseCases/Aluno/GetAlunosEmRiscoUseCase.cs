using Back.Application.DTOs.Aluno;
using Back.Application.Interfaces.Repositories;
using Back.Domain.Entities.Atividade;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Back.Application.UseCases.Aluno;

public class GetAlunosEmRiscoUseCase
{
    private readonly IAlunoRepository _alunoRepo;
    private readonly ILimiteHorasAlunoRepository _limiteRepo;

    public GetAlunosEmRiscoUseCase(
        IAlunoRepository alunoRepo,
        ILimiteHorasAlunoRepository limiteRepo)
    {
        _alunoRepo = alunoRepo;
        _limiteRepo = limiteRepo;
    }

    public async Task<IEnumerable<AlunoEmRiscoResponse>> ExecuteAsync(double percentualMaximo = 100)
    {
        var alunos = await _alunoRepo.GetAllComTurmaEAtividadesAsync();
        var resultado = new List<AlunoEmRiscoResponse>();

        foreach (var aluno in alunos.Where(a => a.IsAtivo && a.Turma != null))
        {
            var limite = await _limiteRepo.GetByCursoIdAsync(aluno.Turma!.CursoId);
            if (limite == null) continue;

            var totalComplementar = aluno.Atividades
                .Where(x => x.Atividade?.Tipo == TipoAtividade.COMPLEMENTAR)
                .Sum(x => x.HorasConcluidas);

            var maximo = limite.MaximoHorasComplementar;
            if (maximo <= 0) continue;

            var porcentagem = Math.Round((double)totalComplementar / maximo * 100, 2);
            if (porcentagem > percentualMaximo) continue;

            var periodosDecorridos = CalcularPeriodosDecorridos(aluno.Turma.Periodo);
            var horasPorPeriodo = Math.Round((double)totalComplementar / periodosDecorridos, 2);

            resultado.Add(new AlunoEmRiscoResponse(
                aluno.Id,
                aluno.Nome!,
                aluno.Matricula!,
                aluno.Turma.Periodo!,
                aluno.Turma.Codigo!,
                aluno.Turma.Curso?.Nome ?? "",
                totalComplementar,
                maximo,
                porcentagem,
                periodosDecorridos,
                horasPorPeriodo
            ));
        }

        return resultado.OrderBy(a => a.HorasPorPeriodo);
    }

    /// <summary>
    /// Calcula quantos períodos letivos se passaram desde o início da turma.
    /// Período no formato "YYYY.S" onde S é 1 (jan–jun) ou 2 (jul–dez).
    /// Resultado mínimo: 1.
    /// </summary>
    private static int CalcularPeriodosDecorridos(string? periodo)
    {
        if (periodo == null) return 1;

        var partes = periodo.Split('.');
        if (partes.Length != 2
            || !int.TryParse(partes[0], out var anoInicio)
            || !int.TryParse(partes[1], out var semInicio))
            return 1;

        var hoje = DateTime.UtcNow;
        var anoAtual = hoje.Year;
        var semAtual = hoje.Month <= 6 ? 1 : 2;

        var periodos = (anoAtual - anoInicio) * 2 + (semAtual - semInicio) + 1;
        return Math.Max(1, periodos);
    }
}
