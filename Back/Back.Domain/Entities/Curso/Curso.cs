using System.ComponentModel.DataAnnotations;

namespace Back.Domain.Entities.Curso;

public class Curso
{
    [Key]
    public Guid Id { get; set; }

    [Required(ErrorMessage = "O campo Nome do curso é obrigatório.")]
    public string? Nome { get; set; }

    public ICollection<Atividade.Atividade> Atividades { get; set; } = new List<Atividade.Atividade>();

    public ICollection<Turma.Turma> Turmas { get; set; } = new List<Turma.Turma>();

    public ICollection<Coordenador.Coordenador> Coordenadores { get; set; } = new List<Coordenador.Coordenador>();
}
