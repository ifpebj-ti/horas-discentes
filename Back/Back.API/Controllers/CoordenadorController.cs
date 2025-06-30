using Back.Application.DTOs.Coordenador;
using Back.Application.UseCases.Coordenador;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Back.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CoordenadorController : ControllerBase
{
    private readonly EnviarConviteUseCase _enviarConvite;
    private readonly CriarCoordenadorUseCase _criarCoordenador;

    public CoordenadorController(
        EnviarConviteUseCase enviarConvite,
        CriarCoordenadorUseCase criarCoordenador)
    {
        _enviarConvite = enviarConvite;
        _criarCoordenador = criarCoordenador;
    }

    /// <summary>
    /// Envia um convite para coordenador (feito apenas por admin)
    /// </summary>
    [HttpPost("convite")]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> EnviarConvite([FromBody] ConviteCoordenadorRequest request)
    {
        await _enviarConvite.ExecuteAsync(request);
        return Ok(new { mensagem = "Convite enviado com sucesso." });
    }

    /// <summary>
    /// Cria a conta do coordenador a partir do token do convite
    /// </summary>
    [HttpPost("cadastrar")]
    public async Task<IActionResult> Cadastrar([FromBody] CadastroCoordenadorRequest request)
    {
        var result = await _criarCoordenador.ExecuteAsync(request);
        return Ok(result);
    }
}
