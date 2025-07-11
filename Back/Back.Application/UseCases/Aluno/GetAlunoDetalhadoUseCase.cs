using Back.Application.DTOs.Aluno;
using Back.Application.Interfaces.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Back.Application.UseCases.Aluno;

public class GetAlunoDetalhadoUseCase
{
    private readonly IAlunoRepository _alunoRepo;
    private readonly IAlunoAtividadeRepository _atividadeRepo;
    private readonly ILimiteHorasAlunoRepository _limiteRepo;

    public GetAlunoDetalhadoUseCase(
        IAlunoRepository alunoRepo,
        IAlunoAtividadeRepository atividadeRepo,
        ILimiteHorasAlunoRepository limiteRepo)
    {
        _alunoRepo = alunoRepo;
        _atividadeRepo = atividadeRepo;
        _limiteRepo = limiteRepo;
    }

    public async Task<AlunoDetalhadoResponse> ExecuteAsync(Guid alunoId)
    {
        var aluno = await _alunoRepo.GetByIdWithAtividadesAsync(alunoId);
        if (aluno == null)
            throw new KeyNotFoundException("Aluno não encontrado");

        var atividades = aluno.Atividades.Select(a => new AtividadeAlunoResumo(
            a.AtividadeId,
            a.Atividade!.Nome!,
            a.Atividade.Grupo!,
            a.Atividade.Categoria!,
            a.Atividade.CategoriaKey!,
            a.Atividade.CargaMaximaSemestral,
            a.Atividade.CargaMaximaCurso,
            a.HorasConcluidas,
            a.Atividade.Tipo.ToString()
        ));

        var limite = await _limiteRepo.GetByCursoIdAsync(aluno.Turma!.CursoId);

        var totalHorasExtensao = aluno.Atividades
            .Where(x => x.Atividade!.Tipo == Domain.Entities.Atividade.TipoAtividade.EXTENSAO)
            .Sum(x => x.HorasConcluidas);

        var totalHorasComplementar = aluno.Atividades
            .Where(x => x.Atividade!.Tipo == Domain.Entities.Atividade.TipoAtividade.COMPLEMENTAR)
            .Sum(x => x.HorasConcluidas);

        return new AlunoDetalhadoResponse(
            aluno.Id,
            aluno.Nome!,
            aluno.Email!,
            aluno.Matricula!,
            aluno.IsAtivo,
            aluno.TurmaId,
            atividades,
            totalHorasExtensao,
            limite?.MaximoHorasExtensao ?? 0,
            totalHorasComplementar,
            limite?.MaximoHorasComplementar ?? 0
        );
    }
}
