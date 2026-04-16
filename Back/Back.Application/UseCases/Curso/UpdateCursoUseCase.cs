using Back.Application.DTOs.Curso;
using Back.Application.Interfaces.Repositories;
using Back.Domain.Entities.LimiteHorasAluno;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Back.Application.UseCases.Curso;

public class UpdateCursoUseCase
{
    private readonly ICursoRepository _cursoRepository;
    private readonly ILimiteHorasAlunoRepository _limiteHorasRepository;

    public UpdateCursoUseCase(
        ICursoRepository cursoRepository,
        ILimiteHorasAlunoRepository limiteHorasRepository)
    {
        _cursoRepository = cursoRepository;
        _limiteHorasRepository = limiteHorasRepository;
    }

    public async Task ExecuteAsync(Guid id, UpdateCursoComLimiteHorasRequest request)
    {
        var curso = await _cursoRepository.GetByIdToUpdateAsync(id);
        if (curso == null)
            throw new KeyNotFoundException("Curso não encontrado.");

        curso.Nome = request.NomeCurso;
        await _cursoRepository.UpdateAsync(curso);

        var limite = await _limiteHorasRepository.GetByCursoIdToUpdateAsync(id);
        if (limite == null)
        {
            var novoLimite = new LimiteHorasAlunoBuilder()
                .WithId(Guid.NewGuid())
                .WithCursoId(id)
                .WithMaximoHorasComplementar(request.MaximoHorasComplementar)
                .Build();
            await _limiteHorasRepository.AddAsync(novoLimite);
        }
        else
        {
            limite.MaximoHorasComplementar = request.MaximoHorasComplementar;
            await _limiteHorasRepository.UpdateAsync(limite);
        }
    }
}
