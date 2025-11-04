using Back.Application.DTOs.Curso;
using Back.Application.Interfaces.Repositories;
using System;
using System.Collections.Generic; // Para KeyNotFoundException
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
        // Busca o curso (precisa ser rastreado para update)
        // --- CORREÇÃO AQUI ---
        var curso = await _cursoRepository.GetByIdToUpdateAsync(id);
        if (curso == null)
            throw new KeyNotFoundException("Curso não encontrado.");

        // Busca o limite de horas associado (precisa ser rastreado para update)
        var limite = await _limiteHorasRepository.GetByCursoIdToUpdateAsync(id);
        if (limite == null)
            throw new InvalidOperationException("Limite de horas para o curso não encontrado. Os dados estão inconsistentes.");

        // Atualiza as propriedades das duas entidades
        curso.Nome = request.NomeCurso;
        limite.MaximoHorasComplementar = request.MaximoHorasComplementar;
        limite.MaximoHorasExtensao = request.MaximoHorasExtensao;

        // Persiste as alterações
        await _cursoRepository.UpdateAsync(curso);
        await _limiteHorasRepository.UpdateAsync(limite);
    }
}