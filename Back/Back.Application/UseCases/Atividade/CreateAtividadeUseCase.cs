using Back.Application.DTOs.Atividade;
using Back.Application.Interfaces.Repositories;
using Back.Domain.Entities.Atividade;
using Back.Domain.Entities.AlunoAtividade;
using System.Threading.Tasks;
using System;
using EntidadeAtividade = Back.Domain.Entities.Atividade.Atividade;
using System.Linq;

namespace Back.Application.UseCases.Atividade;

public class CreateAtividadeUseCase
{
    private readonly IAtividadeRepository _atividadeRepo;
    private readonly IAlunoRepository _alunoRepo;
    private readonly IAlunoAtividadeRepository _alunoAtividadeRepo;

    public CreateAtividadeUseCase(
        IAtividadeRepository atividadeRepo,
        IAlunoRepository alunoRepo,
        IAlunoAtividadeRepository alunoAtividadeRepo)
    {
        _atividadeRepo = atividadeRepo;
        _alunoRepo = alunoRepo;
        _alunoAtividadeRepo = alunoAtividadeRepo;
    }

    public async Task<Guid> ExecuteAsync(CreateAtividadeRequest request)
    {
        var atividade = new EntidadeAtividade
        {
            Id = Guid.NewGuid(),
            Nome = request.Nome,
            Grupo = request.Grupo,
            Categoria = request.Categoria,
            CategoriaKey = request.CategoriaKey,
            CargaMaximaSemestral = request.CargaMaximaSemestral,
            CargaMaximaCurso = request.CargaMaximaCurso,
            Tipo = request.Tipo,
            CursoId = request.CursoId
        };

        await _atividadeRepo.AddAsync(atividade);

        // Busca todos os alunos do curso
        var alunos = await _alunoRepo.GetByCursoIdAsync(request.CursoId);

        var alunoAtividades = alunos.Select(aluno => new AlunoAtividade
        {
            Id = Guid.NewGuid(),
            AlunoId = aluno.Id,
            AtividadeId = atividade.Id,
            HorasConcluidas = 0
        });

        await _alunoAtividadeRepo.AddRangeAsync(alunoAtividades);

        return atividade.Id;
    }
}
