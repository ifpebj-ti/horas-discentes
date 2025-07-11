using System.ComponentModel.DataAnnotations;

namespace Back.Domain.Entities.Curso;

public class Curso
{
    [Key]
    public Guid Id { get; set; }

    [Required(ErrorMessage = "O campo Nome do curso é obrigatório.")]
    public string Nome { get; set; }
}
