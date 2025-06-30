using Back.Application.DTOs.Curso;
using Back.Application.Interfaces.Repositories;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Back.Application.UseCases.Curso;

public class GetCursoByIdUseCase
{
    private readonly ICursoRepository _repository;

    public GetCursoByIdUseCase(ICursoRepository repository)
    {
        _repository = repository;
    }

    public async Task<CursoResponse> ExecuteAsync(Guid id)
    {
        var curso = await _repository.GetByIdAsync(id);
        if (curso == null)
            throw new KeyNotFoundException("Curso não encontrado.");

        return new CursoResponse(curso.Id, curso.Nome);
    }
}
