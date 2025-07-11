using Back.Application.DTOs.Curso;
using Back.Application.UseCases.Curso;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace Back.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "ADMIN")]
public class CursoController : ControllerBase
{
    private readonly CreateCursoUseCase _create;
    private readonly GetAllCursosUseCase _getAll;
    private readonly GetCursoByIdUseCase _getById;

    public CursoController(CreateCursoUseCase create, GetAllCursosUseCase getAll, GetCursoByIdUseCase getById)
    {
        _create = create;
        _getAll = getAll;
        _getById = getById;
    }

    /// <summary>
    /// Cria um novo curso.
    /// </summary>
    /// <remarks>Requer perfil ADMIN.</remarks>
    /// <param name="request">Dados do novo curso</param>
    /// <returns>Curso criado</returns>
    [HttpPost]
    [SwaggerOperation(
        Summary = "Cria um novo curso.",
        Description = "Somente usuários com perfil ADMIN podem cadastrar um novo curso.",
        Tags = new[] { "Cursos" })]
    [ProducesResponseType(typeof(CursoResponse), StatusCodes.Status201Created)]
    public async Task<IActionResult> Criar([FromBody] CreateCursoComLimiteHorasRequest request)
    {
        var curso = await _create.ExecuteAsync(request);
        return CreatedAtAction(nameof(ObterPorId), new { id = curso.Id }, curso);
    }

    /// <summary>
    /// Lista todos os cursos.
    /// </summary>
    /// <remarks>Requer perfil ADMIN.</remarks>
    /// <returns>Lista de cursos</returns>
    [HttpGet]
    [SwaggerOperation(
        Summary = "Lista todos os cursos cadastrados.",
        Tags = new[] { "Cursos" })]
    [ProducesResponseType(typeof(IEnumerable<CursoResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ListarTodos()
    {
        var cursos = await _getAll.ExecuteAsync();
        return Ok(cursos);
    }

    /// <summary>
    /// Obtém os detalhes de um curso pelo ID.
    /// </summary>
    /// <remarks>Requer perfil ADMIN.</remarks>
    /// <param name="id">ID do curso</param>
    /// <returns>Curso encontrado</returns>
    [HttpGet("{id:guid}")]
    [SwaggerOperation(
        Summary = "Busca um curso pelo ID.",
        Tags = new[] { "Cursos" })]
    [ProducesResponseType(typeof(CursoResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(object), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ObterPorId(Guid id)
    {
        try
        {
            var curso = await _getById.ExecuteAsync(id);
            return Ok(curso);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { erro = ex.Message });
        }
    }
}
