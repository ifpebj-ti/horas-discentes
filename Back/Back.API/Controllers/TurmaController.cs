using Back.Application.DTOs.Turma;
using Back.Application.UseCases.Turma;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Back.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "ADMIN,COORDENADOR")]
public class TurmaController : ControllerBase
{
    private readonly CreateTurmaUseCase _create;
    private readonly GetAllTurmasUseCase _getAll;
    private readonly GetTurmaByIdUseCase _getById;
    private readonly VerificarTurmaExisteUseCase _verifica;
    private readonly GetAlunosByTurmaUseCase _getAlunos;

    public TurmaController(
        CreateTurmaUseCase create,
        GetAllTurmasUseCase getAll,
        GetTurmaByIdUseCase getById,
        VerificarTurmaExisteUseCase verifica,
        GetAlunosByTurmaUseCase getAlunos)
    {
        _create = create;
        _getAll = getAll;
        _getById = getById;
        _verifica = verifica;
        _getAlunos = getAlunos;
    }

    [HttpPost]
    public async Task<IActionResult> Criar([FromBody] CreateTurmaRequest request)
    {
        var turma = await _create.ExecuteAsync(request);
        return CreatedAtAction(nameof(ObterPorId), new { id = turma.Id }, turma);
    }

    [HttpGet]
    public async Task<IActionResult> ListarTodas()
    {
        var turmas = await _getAll.ExecuteAsync();
        return Ok(turmas);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> ObterPorId(Guid id)
    {
        try
        {
            var turma = await _getById.ExecuteAsync(id);
            return Ok(turma);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { erro = ex.Message });
        }
    }

    [HttpGet("verificar/{id:guid}")]
    public async Task<IActionResult> Verificar(Guid id)
    {
        var existe = await _verifica.ExecuteAsync(id);
        return Ok(new { turmaExiste = existe });
    }

    [HttpGet("{id:guid}/alunos")]
    public async Task<IActionResult> ListarAlunos(Guid id)
    {
        var alunos = await _getAlunos.ExecuteAsync(id);
        return Ok(alunos);
    }
}
