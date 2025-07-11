using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using Back.Application.DTOs.Atividade;
using Back.Application.Interfaces.Repositories;
using System.Linq;

namespace Back.Application.UseCases.Atividade;

public class GetAtividadesByCursoIdUseCase
{
    private readonly IAtividadeRepository _repo;

    public GetAtividadesByCursoIdUseCase(IAtividadeRepository repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<AtividadeResponse>> ExecuteAsync(Guid cursoId)
    {
        var atividades = await _repo.GetByCursoIdAsync(cursoId);

        return atividades.Select(a =>
            new AtividadeResponse(a.Id, a.Nome!, a.CursoId, a.Tipo.ToString(), a.Grupo!, a.Categoria!)
        );
    }
}
