using Back.Application.DTOs.Curso;
using Back.Application.Interfaces.Repositories;
using Back.Domain.Entities.Curso;
using System;
using System.Threading.Tasks;

namespace Back.Application.UseCases.Curso;

public class CreateCursoUseCase
{
    private readonly ICursoRepository _repository;

    public CreateCursoUseCase(ICursoRepository repository)
    {
        _repository = repository;
    }

    public async Task<CursoResponse> ExecuteAsync(CreateCursoRequest request)
    {
        var curso = new CursoBuilder()
            .WithId(Guid.NewGuid())
            .WithNome(request.Nome)
            .Build();

        await _repository.AddAsync(curso);

        return new CursoResponse(curso.Id, curso.Nome);
    }
}
