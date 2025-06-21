using System.ComponentModel.DataAnnotations;

namespace Back.Domain.Entities.Admin;

public class Admin
{
    [Key]
    public Guid Id { get; set; }

    [Required(ErrorMessage = "O campo Email é obrigatório.")]
    [EmailAddress(ErrorMessage = "O campo Email deve ser um endereço de email válido.")]
    public string Email { get; set; }

    [Required(ErrorMessage = "O campo Senha é obrigatório.")]
    [MinLength(6, ErrorMessage = "A senha deve conter no mínimo 6 caracteres.")]
    public string Senha { get; set; }
}
