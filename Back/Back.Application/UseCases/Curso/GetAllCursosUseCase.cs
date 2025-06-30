using Back.Application.DTOs.Curso;
using Back.Application.Interfaces.Repositories;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Back.Application.UseCases.Curso;

public class GetAllCursosUseCase
{
    private readonly ICursoRepository _repository;

    public GetAllCursosUseCase(ICursoRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<CursoResponse>> ExecuteAsync()
    {
        var cursos = await _repository.GetAllAsync();
        return cursos.Select(c => new CursoResponse(c.Id, c.Nome));
    }
}
