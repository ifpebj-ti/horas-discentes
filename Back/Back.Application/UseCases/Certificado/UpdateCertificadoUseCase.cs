using Back.Application.DTOs.Certificado;
using Back.Application.Extensions;
using Back.Application.Interfaces.Repositories;
using Back.Domain.Entities.Certificado;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Back.Application.UseCases.Certificado
{
    /// <summary>
    /// Caso de uso para atualizar um certificado.
    /// </summary>
    public class UpdateCertificadoUseCase
    {
        private readonly ICertificadoRepository _certificadoRepo;

        public UpdateCertificadoUseCase(ICertificadoRepository certificadoRepo)
        {
            _certificadoRepo = certificadoRepo;
        }

        /// <summary>
        /// Executa a atualização de um certificado.
        /// </summary>
        /// <param name="id">O ID do certificado a ser atualizado.</param>
        /// <param name="request">Os novos dados do certificado.</param>
        /// <exception cref="KeyNotFoundException">Lançado se o certificado não for encontrado.</exception>
        /// <exception cref="InvalidOperationException">Lançado se o certificado já estiver APROVADO.</exception>
        public async Task ExecuteAsync(Guid id, UpdateCertificadoRequest request)
        {
            // 1. Busca o certificado
            var certificado = await _certificadoRepo.GetByIdAsync(id);

            if (certificado == null)
                throw new KeyNotFoundException("Certificado não encontrado.");

            // 2. REGRA DE NEGÓCIO: Verifica se está APROVADO
            // Não permite a alteração de certificados que já foram APROVADOS.
            if (certificado.Status == StatusCertificado.APROVADO)
            {
                throw new InvalidOperationException("Não é possível alterar um certificado que já foi APROVADO.");
            }

            // 3. Atualiza os campos do certificado
            certificado.TituloAtividade = request.TituloAtividade;
            certificado.Instituicao = request.Instituicao;
            certificado.Local = request.Local;
            certificado.Categoria = request.Categoria;
            certificado.Grupo = request.Grupo;
            certificado.PeriodoLetivo = request.PeriodoLetivo;
            certificado.CargaHoraria = request.CargaHoraria; // Carga horária solicitada
            certificado.DataInicio = request.DataInicio;
            certificado.DataFim = request.DataFim;
            certificado.TotalPeriodos = request.TotalPeriodos;
            certificado.Descricao = request.Descricao;
            certificado.Tipo = (TipoCertificado)request.Tipo;

            // 4. Se o certificado estava REPROVADO, ele volta a ficar PENDENTE
            //    para ser reavaliado.
            if (certificado.Status == StatusCertificado.REPROVADO)
            {
                certificado.Status = StatusCertificado.PENDENTE;
            }


            // 5. Atualiza o anexo apenas se um novo foi enviado
            if (request.Anexo != null && request.Anexo.Length > 0)
            {
                certificado.Anexo = await request.Anexo.ToByteArrayAsync();
            }

            // 6. Salva as mudanças
            await _certificadoRepo.UpdateAsync(certificado);
        }
    }
}