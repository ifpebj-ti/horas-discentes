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
        var limites = (await _limiteRepo.GetAllAsync())
            .ToDictionary(l => l.CursoId);

        var resultado = new List<AlunoEmRiscoResponse>();

        foreach (var aluno in alunos)
        {
            if (!limites.TryGetValue(aluno.Turma!.CursoId, out var limite)) continue;

            var totalComplementar = aluno.Atividades
                .Where(x => x.Atividade?.Tipo == TipoAtividade.COMPLEMENTAR)
                .Sum(x => x.HorasConcluidas);

            var maximo = limite.MaximoHorasComplementar;
            if (maximo <= 0) continue;

            var porcentagem = Math.Round((double)totalComplementar / maximo * 100, 2);
            if (porcentagem > percentualMaximo) continue;

            if (!TryCalcularPeriodosDecorridos(aluno.Turma.Periodo, out var periodosDecorridos))
                continue; // período inválido — dado inconsistente, não expor o aluno

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
    /// Tenta calcular quantos períodos letivos se passaram desde o início da turma.
    /// Período no formato "YYYY.S" onde S é 1 (jan–jun) ou 2 (jul–dez).
    /// Retorna false se o período for nulo, mal formatado ou com semestre fora de [1,2].
    /// </summary>
    private static bool TryCalcularPeriodosDecorridos(string? periodo, out int periodosDecorridos)
    {
        periodosDecorridos = 0;

        if (string.IsNullOrWhiteSpace(periodo)) return false;

        var partes = periodo.Split('.');
        if (partes.Length != 2
            || !int.TryParse(partes[0], out var anoInicio)
            || !int.TryParse(partes[1], out var semInicio)
            || semInicio < 1 || semInicio > 2)
            return false;

        var hoje = DateTime.UtcNow;
        var anoAtual = hoje.Year;
        var semAtual = hoje.Month <= 6 ? 1 : 2;

        var periodos = (anoAtual - anoInicio) * 2 + (semAtual - semInicio) + 1;
        periodosDecorridos = Math.Max(1, periodos);
        return true;
    }
}
