using Back.Application.DTOs.Atividade;
using Back.Application.UseCases.Atividade;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Back.API.Controllers;

/// <summary>
/// Controlador para operações relacionadas às atividades.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AtividadeController : ControllerBase
{
    private readonly GetAtividadesByCursoIdUseCase _getByCurso;
    private readonly CreateAtividadeUseCase _create;
    private readonly UpdateAtividadeUseCase _update; 
    private readonly DeleteAtividadeUseCase _delete;
    /// <summary>
    /// Inicializa o controlador de atividades com as dependências necessárias.
    /// </summary>
    /// <param name="getByCurso">Caso de uso para buscar atividades por curso.</param>
    /// <param name="create"></param>
    /// <param name="update"></param>
    /// <param name="delete"></param>
    public AtividadeController(
        GetAtividadesByCursoIdUseCase getByCurso,
        CreateAtividadeUseCase create,
        UpdateAtividadeUseCase update,  
        DeleteAtividadeUseCase delete) 
    {
        _getByCurso = getByCurso;
        _create = create;
        _update = update;
        _delete = delete; 
    }

    /// <summary>
    /// Lista todas as atividades associadas a um curso.
    /// </summary>
    /// <param name="cursoId">ID do curso.</param>
    /// <returns>Lista de atividades vinculadas ao curso.</returns>
    /// <response code="200">Retorna a lista de atividades.</response>
    [HttpGet("curso/{cursoId:guid}")]
    [ProducesResponseType(typeof(IEnumerable<AtividadeResponse>), 200)]
    public async Task<IActionResult> ListarPorCurso(Guid cursoId)
    {
        var atividades = await _getByCurso.ExecuteAsync(cursoId);
        return Ok(atividades);
    }
    [HttpPost]
    [Authorize(Roles = "ADMIN,COORDENADOR")]
    [ProducesResponseType(typeof(object), 201)]
    public async Task<IActionResult> Criar([FromBody] CreateAtividadeRequest request)
    {
        var id = await _create.ExecuteAsync(request);
        return CreatedAtAction(nameof(ListarPorCurso), new { cursoId = request.CursoId }, new { atividadeId = id });
    }

    /// <summary>
    /// Atualiza os dados de uma atividade.
    /// </summary>
    /// <remarks>
    /// Requer permissão de ADMIN ou COORDENADOR.
    /// Não é permitido alterar o curso de uma atividade existente.
    /// </remarks>
    /// <param name="id">ID da atividade a ser atualizada.</param>
    /// <param name="request">Novos dados da atividade.</param>
    /// <response code="204">Atividade atualizada com sucesso.</response>
    /// <response code="404">Atividade não encontrada.</response>
    [HttpPut("{id:guid}")]
    [Authorize(Roles = "ADMIN,COORDENADOR")]
    [ProducesResponseType(204)]
    public async Task<IActionResult> Atualizar(Guid id, [FromBody] UpdateAtividadeRequest request)
    {
        await _update.ExecuteAsync(id, request);
        return NoContent();
    }

    /// <summary>
    /// Remove uma atividade e todos os seus vínculos com alunos.
    /// </summary>
    /// <remarks>Requer permissão de ADMIN ou COORDENADOR. Esta ação é permanente.</remarks>
    /// <param name="id">ID da atividade a ser removida.</param>
    /// <response code="204">Atividade removida com sucesso.</response>
    /// <response code="404">Atividade não encontrada.</response>
    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "ADMIN,COORDENADOR")]
    [ProducesResponseType(204)]
    public async Task<IActionResult> Deletar(Guid id)
    {
        await _delete.ExecuteAsync(id);
        return NoContent();
    }

}
