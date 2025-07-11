using Back.Application.DTOs.Curso;
using Back.Application.Interfaces.Repositories;
using Back.Domain.Entities.Curso;
using Back.Domain.Entities.LimiteHorasAluno;
using System;
using System.Threading.Tasks;

namespace Back.Application.UseCases.Curso;

public class CreateCursoUseCase
{
    private readonly ICursoRepository _cursoRepository;
    private readonly ILimiteHorasAlunoRepository _limiteHorasAlunoRepository;

    public CreateCursoUseCase(
        ICursoRepository cursoRepository,
        ILimiteHorasAlunoRepository limiteHorasAlunoRepository)
    {
        _cursoRepository = cursoRepository;
        _limiteHorasAlunoRepository = limiteHorasAlunoRepository;
    }

    public async Task<CursoResponse> ExecuteAsync(CreateCursoComLimiteHorasRequest request)
    {
        var curso = new CursoBuilder()
            .WithId(Guid.NewGuid())
            .WithNome(request.NomeCurso!)
            .Build();

        await _cursoRepository.AddAsync(curso);

        var limite = new LimiteHorasAlunoBuilder()
            .WithId(Guid.NewGuid())
            .WithMaximoHorasComplementar(request.MaximoHorasComplementar)
            .WithMaximoHorasExtensao(request.MaximoHorasExtensao)
            .WithCursoId(curso.Id)
            .Build();

        await _limiteHorasAlunoRepository.AddAsync(limite);

        return new CursoResponse(curso.Id, curso.Nome!);
    }
}
