using System.ComponentModel.DataAnnotations;

namespace Back.Domain.Entities.Aluno;

public class Aluno
{
    [Key]
    public Guid Id { get; set; }

    [Required(ErrorMessage = "O campo Nome é obrigatório.")]
    public string Nome { get; set; }

    [Required(ErrorMessage = "O campo Email é obrigatório.")]
    [EmailAddress(ErrorMessage = "Email inválido.")]
    public string Email { get; set; }

    [Required(ErrorMessage = "O campo Matrícula é obrigatório.")]
    public string Matricula { get; set; }

    [Required(ErrorMessage = "O campo Senha é obrigatório.")]
    [MinLength(6, ErrorMessage = "A senha deve conter no mínimo 6 caracteres.")]
    public string Senha { get; set; }

    public bool JaBaixadoHoras { get; set; }

    [Required(ErrorMessage = "O campo TurmaId é obrigatório.")]
    public Guid TurmaId { get; set; }
}
