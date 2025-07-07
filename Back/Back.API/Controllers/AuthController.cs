using Back.Application.DTOs.Auth;
using Back.Application.UseCases.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace Back.API.Controllers;

[ApiController]
[AllowAnonymous]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly LoginUseCase _loginUseCase;

    public AuthController(LoginUseCase loginUseCase)
    {
        _loginUseCase = loginUseCase;
    }

    /// <summary>
    /// Autentica um usuário e retorna o token JWT.
    /// </summary>
    /// <param name="dto">Dados de login (e-mail e senha).</param>
    /// <returns>Token JWT para autenticação</returns>
    /// <response code="200">Login realizado com sucesso.</response>
    /// <response code="400">Credenciais inválidas.</response>
    [HttpPost("login")]
    [ProducesResponseType(typeof(LoginResponseDto), 200)]
    [ProducesResponseType(400)]
    [SwaggerOperation(
        Summary = "Autenticar usuário",
        Description = "Realiza o login de um usuário com base nas credenciais informadas."
    )]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
    {
        try
        {
            var result = await _loginUseCase.ExecuteAsync(dto);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
