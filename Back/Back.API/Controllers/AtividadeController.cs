using Back.Application.DTOs.Atividade;
using Back.Application.UseCases.Atividade;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Back.API.Controllers;

/// <summary>
/// Controlador para operações relacionadas às atividades.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AtividadeController : ControllerBase
{
    private readonly GetAtividadesByCursoIdUseCase _getByCurso;

    /// <summary>
    /// Inicializa o controlador de atividades com as dependências necessárias.
    /// </summary>
    /// <param name="getByCurso">Caso de uso para buscar atividades por curso.</param>
    public AtividadeController(GetAtividadesByCursoIdUseCase getByCurso)
    {
        _getByCurso = getByCurso;
    }

    /// <summary>
    /// Lista todas as atividades associadas a um curso.
    /// </summary>
    /// <param name="cursoId">ID do curso.</param>
    /// <returns>Lista de atividades vinculadas ao curso.</returns>
    /// <response code="200">Retorna a lista de atividades.</response>
    [HttpGet("curso/{cursoId:guid}")]
    [ProducesResponseType(typeof(IEnumerable<AtividadeResponse>), 200)]
    public async Task<IActionResult> ListarPorCurso(Guid cursoId)
    {
        var atividades = await _getByCurso.ExecuteAsync(cursoId);
        return Ok(atividades);
    }
}
