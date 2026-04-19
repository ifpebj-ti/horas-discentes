using Back.Domain.Entities.Campus;

namespace Back.Application.Interfaces.Repositories;

public interface ICampusRepository
{
    Task AddAsync(Campus campus);
    Task<IEnumerable<Campus>> GetAllAsync();
    Task<Campus?> GetByIdAsync(Guid id);
}
