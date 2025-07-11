using Back.Application.DTOs.Aluno;
using Back.Application.UseCases.Aluno;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Back.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AlunoController : ControllerBase
{
    private readonly CreateAlunoUseCase _create;
    private readonly GetAlunoByIdUseCase _getById;
    private readonly DeleteAlunoUseCase _delete;
    private readonly ToggleAlunoStatusUseCase _toggle;
    private readonly GetAlunoDetalhadoUseCase _getDetalhado;
    private readonly GetResumoHorasUseCase _getResumo;
    private readonly GetAlunoFromTokenUseCase _getMeFromToken;

    public AlunoController(
        CreateAlunoUseCase create,
        GetAlunoByIdUseCase getById,
        DeleteAlunoUseCase delete,
        ToggleAlunoStatusUseCase toggle,
        GetAlunoDetalhadoUseCase getDetalhado,
        GetResumoHorasUseCase getResumo,
        GetAlunoFromTokenUseCase getMeFromToken)
    {
        _create = create;
        _getById = getById;
        _delete = delete;
        _toggle = toggle;
        _getDetalhado = getDetalhado;
        _getResumo = getResumo;
        _getMeFromToken = getMeFromToken;
    }

    /// <summary>
    /// Cadastra um novo aluno.
    /// </summary>
    /// <remarks>Requer permissão de ADMIN ou COORDENADOR.</remarks>
    /// <param name="request">Dados do aluno a ser criado.</param>
    /// <response code="201">Aluno criado com sucesso.</response>
    /// <response code="400">Dados inválidos ou erro de validação.</response>
    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> Criar([FromBody] CreateAlunoRequest request)
    {
        var result = await _create.ExecuteAsync(request);
        return CreatedAtAction(nameof(ObterPorId), new { id = result.Id }, result);
    }

    /// <summary>
    /// Obtém os dados de um aluno pelo ID.
    /// </summary>
    /// <remarks>Requer permissão de ADMIN ou COORDENADOR.</remarks>
    /// <param name="id">ID do aluno.</param>
    /// <response code="200">Dados do aluno retornados com sucesso.</response>
    /// <response code="404">Aluno não encontrado.</response>
    [HttpGet("{id:guid}")]
    [Authorize(Roles = "ADMIN,COORDENADOR")]
    public async Task<IActionResult> ObterPorId(Guid id)
    {
        var aluno = await _getById.ExecuteAsync(id);
        return Ok(aluno);
    }

    /// <summary>
    /// Remove um aluno do sistema (remoção permanente).
    /// </summary>
    /// <remarks>Requer permissão de ADMIN ou COORDENADOR.</remarks>
    /// <param name="id">ID do aluno a ser excluído.</param>
    /// <response code="204">Aluno removido com sucesso.</response>
    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "ADMIN,COORDENADOR")]
    public async Task<IActionResult> Deletar(Guid id)
    {
        await _delete.ExecuteAsync(id);
        return NoContent();
    }

    /// <summary>
    /// Ativa ou desativa o status de um aluno.
    /// </summary>
    /// <remarks>Requer permissão de ADMIN ou COORDENADOR.</remarks>
    /// <param name="id">ID do aluno.</param>
    /// <response code="204">Status alterado com sucesso.</response>
    [HttpPatch("{id:guid}/toggle-status")]
    [Authorize(Roles = "ADMIN,COORDENADOR")]
    public async Task<IActionResult> AtivarDesativar(Guid id)
    {
        await _toggle.ExecuteAsync(id);
        return NoContent();
    }

    /// <summary>
    /// Obtém os dados detalhados de um aluno, incluindo atividades e horas concluídas.
    /// </summary>
    /// <remarks>Requer permissão de ADMIN ou COORDENADOR.</remarks>
    /// <param name="id">ID do aluno.</param>
    /// <response code="200">Dados detalhados do aluno retornados com sucesso.</response>
    [HttpGet("{id:guid}/detalhado")]
    [Authorize(Roles = "ADMIN,COORDENADOR")]
    public async Task<IActionResult> ObterDetalhado(Guid id)
    {
        var aluno = await _getDetalhado.ExecuteAsync(id);
        return Ok(aluno);
    }

    /// <summary>
    /// Lista todos os alunos com resumo das horas concluídas em atividades de extensão e complementar.
    /// </summary>
    /// <remarks>Requer permissão de ADMIN ou COORDENADOR.</remarks>
    /// <response code="200">Resumo de horas retornado com sucesso.</response>
    [HttpGet("resumo-horas")]
    [Authorize(Roles = "ADMIN,COORDENADOR")]
    public async Task<IActionResult> ListarResumo()
    {
        var result = await _getResumo.ExecuteAsync();
        return Ok(result);
    }

    /// <summary>
    /// Obtém os dados detalhados do aluno autenticado.
    /// </summary>
    /// <remarks>Requer permissão de ALUNO autenticado.</remarks>
    /// <response code="200">Dados do aluno retornados com sucesso.</response>
    /// <response code="401">Usuário não autenticado.</response>
    [HttpGet("meu-detalhado")]
    [Authorize(Roles = "ALUNO")]
    public async Task<IActionResult> ObterMeusDados()
    {
        var result = await _getMeFromToken.ExecuteAsync(User);
        return Ok(result);
    }
}
