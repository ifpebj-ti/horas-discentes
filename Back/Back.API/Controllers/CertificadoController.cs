using Back.Application.DTOs.Certificado;
using Back.Application.UseCases.Certificado;
using Back.Domain.Entities.Certificado;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Back.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CertificadoController : ControllerBase
{
    private readonly CreateCertificadoUseCase _create;
    private readonly GetCertificadosUseCase _get;
    private readonly AtualizarStatusCertificadoUseCase _atualizar;

    public CertificadoController(
        CreateCertificadoUseCase create,
        GetCertificadosUseCase get,
        AtualizarStatusCertificadoUseCase atualizar)
    {
        _create = create;
        _get = get;
        _atualizar = atualizar;
    }

    [HttpPost]
    [Authorize(Roles = "ALUNO")]
    public async Task<IActionResult> Enviar([FromForm] CreateCertificadoRequest request)
    {
        try
        {
            var id = await _create.ExecuteAsync(request);
            return CreatedAtAction(nameof(ObterPorId), new { id }, new { certificadoId = id });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { erro = ex.Message });
        }
    }

    [HttpGet]
    [Authorize(Roles = "ADMIN,COORDENADOR")]
    public async Task<IActionResult> Listar([FromQuery] StatusCertificado? status, [FromQuery] Guid? alunoId)
    {
        var certificados = await _get.ExecuteAsync(status, alunoId);
        return Ok(certificados);
    }

    [HttpGet("{id}")]
    [Authorize]
    public IActionResult ObterPorId(Guid id)
    {
        return Ok();
    }

    [HttpPatch("{id}/aprovar")]
    [Authorize(Roles = "ADMIN,COORDENADOR")]
    public async Task<IActionResult> Aprovar(Guid id)
    {
        var ok = await _atualizar.ExecuteAsync(id, StatusCertificado.APROVADO);
        if (!ok)
            return NotFound(new { erro = "Certificado não encontrado." });

        return NoContent();
    }

    [HttpPatch("{id}/reprovar")]
    [Authorize(Roles = "ADMIN,COORDENADOR")]
    public async Task<IActionResult> Reprovar(Guid id)
    {
        var ok = await _atualizar.ExecuteAsync(id, StatusCertificado.REPROVADO);
        if (!ok)
            return NotFound(new { erro = "Certificado não encontrado." });

        return NoContent();
    }

    [HttpGet("/api/me/certificados")]
    [Authorize(Roles = "ALUNO")]
    public async Task<IActionResult> MeusCertificados([FromServices] GetCertificadosDoAlunoAutenticadoUseCase useCase)
    {
        var userId = User.Identity?.Name;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        try
        {
            var certificados = await useCase.ExecuteAsync(userId);
            return Ok(certificados);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { erro = ex.Message });
        }
    }

}
