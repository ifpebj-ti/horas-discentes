using Back.Application.UseCases.Atividade;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Back.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "ADMIN,COORDENADOR")]
public class AtividadeController : ControllerBase
{
    private readonly GetAtividadesByCursoIdUseCase _getByCurso;

    public AtividadeController(GetAtividadesByCursoIdUseCase getByCurso)
    {
        _getByCurso = getByCurso;
    }

    [HttpGet("curso/{cursoId:guid}")]
    public async Task<IActionResult> ListarPorCurso(Guid cursoId)
    {
        var atividades = await _getByCurso.ExecuteAsync(cursoId);
        return Ok(atividades);
    }
}
