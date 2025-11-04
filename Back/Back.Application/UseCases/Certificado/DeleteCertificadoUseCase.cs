using Back.Application.Interfaces.Repositories;
using Back.Domain.Entities.Certificado; 
using System;
using System.Collections.Generic; 
using System.Threading.Tasks;

namespace Back.Application.UseCases.Certificado
{
    public class DeleteCertificadoUseCase
    {
        private readonly ICertificadoRepository _certRepo;

        public DeleteCertificadoUseCase(ICertificadoRepository certRepo)
        {
            _certRepo = certRepo;
        }

        public async Task ExecuteAsync(Guid id)
        {
            // Busca o certificado simples, sem includes
            var certificado = await _certRepo.GetByIdAsync(id);

            if (certificado == null)
                throw new KeyNotFoundException("Certificado não encontrado.");

            // Verifica o status antes de deletar
            if (certificado.Status == StatusCertificado.APROVADO)
            {
                throw new InvalidOperationException("Não é possível excluir um certificado que já foi APROVADO.");
            }

            // Se estiver PENDENTE ou REPROVADO, permite a exclusão.
            await _certRepo.DeleteAsync(certificado);

        }
    }
}