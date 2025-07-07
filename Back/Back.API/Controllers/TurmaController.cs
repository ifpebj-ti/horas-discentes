using Back.Application.DTOs.Turma;
using Back.Application.UseCases.Turma;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

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
    private readonly GetTurmasByCursoIdUseCase _getByCurso;

    public TurmaController(
        CreateTurmaUseCase create,
        GetAllTurmasUseCase getAll,
        GetTurmaByIdUseCase getById,
        VerificarTurmaExisteUseCase verifica,
        GetAlunosByTurmaUseCase getAlunos,
        GetTurmasByCursoIdUseCase getByCurso)
    {
        _create = create;
        _getAll = getAll;
        _getById = getById;
        _verifica = verifica;
        _getAlunos = getAlunos;
        _getByCurso = getByCurso;
    }

    /// <summary>
    /// Cria uma nova turma.
    /// </summary>
    [HttpPost]
    [SwaggerOperation(Summary = "Cria uma nova turma", Tags = new[] { "Turmas" })]
    [ProducesResponseType(typeof(TurmaResponse), StatusCodes.Status201Created)]
    public async Task<IActionResult> Criar([FromBody] CreateTurmaRequest request)
    {
        var turma = await _create.ExecuteAsync(request);
        return CreatedAtAction(nameof(ObterPorId), new { id = turma.Id }, turma);
    }

    /// <summary>
    /// Lista todas as turmas cadastradas.
    /// </summary>
    [HttpGet]
    [SwaggerOperation(Summary = "Lista todas as turmas", Tags = new[] { "Turmas" })]
    [ProducesResponseType(typeof(IEnumerable<TurmaResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ListarTodas()
    {
        var turmas = await _getAll.ExecuteAsync();
        return Ok(turmas);
    }

    /// <summary>
    /// Retorna os dados de uma turma pelo ID.
    /// </summary>
    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    [SwaggerOperation(Summary = "Busca turma por ID", Tags = new[] { "Turmas" })]
    [ProducesResponseType(typeof(TurmaResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
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

    /// <summary>
    /// Verifica se uma turma existe.
    /// </summary>
    [HttpGet("verificar/{id:guid}")]
    [AllowAnonymous]
    [SwaggerOperation(Summary = "Verifica se uma turma existe", Tags = new[] { "Turmas" })]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    public async Task<IActionResult> Verificar(Guid id)
    {
        var existe = await _verifica.ExecuteAsync(id);
        return Ok(new { turmaExiste = existe });
    }

    /// <summary>
    /// Lista os alunos de uma turma específica.
    /// </summary>
    [HttpGet("{id:guid}/alunos")]
    [SwaggerOperation(Summary = "Lista os alunos de uma turma", Tags = new[] { "Turmas" })]
    [ProducesResponseType(typeof(IEnumerable<TurmaAlunoResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ListarAlunos(Guid id)
    {
        var alunos = await _getAlunos.ExecuteAsync(id);
        return Ok(alunos);
    }

    /// <summary>
    /// Retorna todas as turmas vinculadas a um curso.
    /// </summary>
    [HttpGet("curso/{cursoId:guid}")]
    [SwaggerOperation(Summary = "Lista turmas por ID do curso", Tags = new[] { "Turmas" })]
    [ProducesResponseType(typeof(IEnumerable<TurmaResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ObterPorCurso(Guid cursoId)
    {
        var turmas = await _getByCurso.ExecuteAsync(cursoId);
        return Ok(turmas);
    }
}
