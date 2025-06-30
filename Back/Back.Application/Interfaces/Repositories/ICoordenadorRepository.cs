using Back.Domain.Entities.Coordenador;
using System.Threading.Tasks;

namespace Back.Application.Interfaces.Repositories;

public interface ICoordenadorRepository
{
    Task AddAsync(Coordenador coordenador);
}
