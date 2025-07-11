using System.Security.Claims;
using Back.Application.DTOs.Certificado;
using Back.Application.UseCases.Certificado;
using Back.Domain.Entities.Certificado;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace Back.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CertificadoController : ControllerBase
    {
        private readonly CreateCertificadoUseCase _create;
        private readonly GetCertificadosUseCase _get;
        private readonly AtualizarStatusCertificadoUseCase _atualizar;
        private readonly GetCertificadoByIdUseCase _getById;

        public CertificadoController(
            CreateCertificadoUseCase create,
            GetCertificadosUseCase get,
            AtualizarStatusCertificadoUseCase atualizar,
            GetCertificadoByIdUseCase getById)
        {
            _create = create;
            _get = get;
            _atualizar = atualizar;
            _getById = getById;
        }

        [HttpPost]
        [Authorize(Roles = "ALUNO")]
        [SwaggerOperation(Summary = "Envia um novo certificado para validação.", Tags = new[] { "Certificados" })]
        [ProducesResponseType(typeof(object), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Enviar([FromForm] CreateCertificadoRequest request)
        {
            if (request.Anexo == null || request.Anexo.Length == 0)
                return BadRequest(new { erro = "O anexo é obrigatório e deve conter conteúdo válido." });

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
        [SwaggerOperation(Summary = "Lista os certificados com filtros por status e aluno.", Tags = new[] { "Certificados" })]
        [ProducesResponseType(typeof(IEnumerable<CertificadoResponse>), StatusCodes.Status200OK)]
        public async Task<IActionResult> Listar([FromQuery] StatusCertificado? status, [FromQuery] Guid? alunoId)
        {
            var certificados = await _get.ExecuteAsync(status, alunoId);
            return Ok(certificados);
        }

        [HttpGet("{id}")]
        [Authorize]
        [SwaggerOperation(Summary = "Obtém detalhes de um certificado pelo ID.", Tags = new[] { "Certificados" })]
        [ProducesResponseType(typeof(CertificadoDetalhadoResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(object), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> ObterPorId(Guid id, [FromServices] GetCertificadoByIdUseCase useCase)
        {
            try
            {
                var certificado = await useCase.ExecuteAsync(id);
                return Ok(certificado);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { erro = ex.Message });
            }
        }


        [HttpPatch("{id}/aprovar")]
        [Authorize(Roles = "ADMIN,COORDENADOR")]
        [SwaggerOperation(Summary = "Aprova um certificado enviado pelo aluno.", Tags = new[] { "Certificados" })]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(object), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Aprovar(Guid id)
        {
            var ok = await _atualizar.ExecuteAsync(id, StatusCertificado.APROVADO);
            if (!ok)
                return NotFound(new { erro = "Certificado não encontrado." });

            return NoContent();
        }

        [HttpPatch("{id}/reprovar")]
        [Authorize(Roles = "ADMIN,COORDENADOR")]
        [SwaggerOperation(Summary = "Reprova um certificado enviado pelo aluno.", Tags = new[] { "Certificados" })]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(object), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Reprovar(Guid id)
        {
            var ok = await _atualizar.ExecuteAsync(id, StatusCertificado.REPROVADO);
            if (!ok)
                return NotFound(new { erro = "Certificado não encontrado." });

            return NoContent();
        }

        [HttpGet("me")]
        [Authorize(Roles = "ALUNO")]
        [SwaggerOperation(Summary = "Retorna os certificados do aluno autenticado.", Tags = new[] { "Certificados" })]
        [ProducesResponseType(typeof(IEnumerable<CertificadoResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> MeusCertificados([FromServices] GetCertificadosDoAlunoAutenticadoUseCase useCase)
        {
            var identityUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(identityUserId))
                return Unauthorized();

            try
            {
                var certificados = await useCase.ExecuteAsync(identityUserId);
                return Ok(certificados);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { erro = ex.Message });
            }
        }
    }
}
