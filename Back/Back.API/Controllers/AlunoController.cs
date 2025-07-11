using Back.Application.DTOs.Aluno;
using Back.Application.UseCases.Aluno;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Back.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AlunoController : ControllerBase
{
    private readonly CreateAlunoUseCase _createAluno;
    private readonly GetAlunoByIdUseCase _getAlunoById;

    public AlunoController(CreateAlunoUseCase createAluno, GetAlunoByIdUseCase getAlunoById)
    {
        _createAluno = createAluno;
        _getAlunoById = getAlunoById;
    }

    /// <summary>
    /// Cadastra um novo aluno.
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CriarAluno([FromBody] CreateAlunoRequest request)
    {
        try
        {
            var result = await _createAluno.ExecuteAsync(request);
            return CreatedAtAction(nameof(ObterAlunoPorId), new { id = result.Id }, result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Obtém os dados de um aluno por ID.
    /// </summary>
    [HttpGet("{id:guid}")]
    [Authorize(Roles = "ADMIN,COORDENADOR")]
    public async Task<IActionResult> ObterAlunoPorId(Guid id)
    {
        try
        {
            var aluno = await _getAlunoById.ExecuteAsync(id);
            return Ok(aluno);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Aluno não encontrado." });
        }
    }
}
