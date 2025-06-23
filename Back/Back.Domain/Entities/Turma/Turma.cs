using System.ComponentModel.DataAnnotations;

namespace Back.Domain.Entities.Turma;

public class Turma
{
    [Key]
    public Guid Id { get; set; }

    [Required(ErrorMessage = "O campo Período é obrigatório.")]
    public string Periodo { get; set; }

    [Required(ErrorMessage = "O campo Turno é obrigatório.")]
    public string Turno { get; set; }

    public bool PossuiExtensao { get; set; }

    [Required(ErrorMessage = "O campo CursoId é obrigatório.")]
    public Guid CursoId { get; set; }

    public Curso.Curso Curso { get; private set; }

    public ICollection<Aluno.Aluno> Alunos { get; private set; }

    internal Turma()
    {
        Alunos = new List<Aluno.Aluno>();
    }

    internal Turma(Guid id, Guid cursoId)
    {
        Id = id;
        CursoId = cursoId;
        Alunos = new List<Aluno.Aluno>();
    }
}