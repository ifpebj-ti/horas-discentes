using Back.Application.DTOs.Curso;
using Back.Application.UseCases.Curso;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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

    [HttpPost]
    public async Task<IActionResult> Criar([FromBody] CreateCursoRequest request)
    {
        var curso = await _create.ExecuteAsync(request);
        return CreatedAtAction(nameof(ObterPorId), new { id = curso.Id }, curso);
    }

    [HttpGet]
    public async Task<IActionResult> ListarTodos()
    {
        var cursos = await _getAll.ExecuteAsync();
        return Ok(cursos);
    }

    [HttpGet("{id:guid}")]
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
