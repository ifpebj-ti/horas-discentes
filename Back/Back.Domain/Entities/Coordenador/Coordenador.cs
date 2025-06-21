using System.ComponentModel.DataAnnotations;

namespace Back.Domain.Entities.Coordenador;

public class Coordenador
{
    [Key]
    public Guid Id { get; set; }

    [Required(ErrorMessage = "O campo Nome é obrigatório.")]
    public string Nome { get; set; }

    [Required(ErrorMessage = "O campo Número da Portaria é obrigatório.")]
    public string NumeroPortaria { get; set; }

    [Required(ErrorMessage = "O campo DOU é obrigatório.")]
    public string DOU { get; set; }

    [Required(ErrorMessage = "O campo Email é obrigatório.")]
    [EmailAddress(ErrorMessage = "O campo Email deve ser um endereço de email válido.")]
    public string Email { get; set; }

    [Required(ErrorMessage = "O campo Senha é obrigatório.")]
    [MinLength(6, ErrorMessage = "A senha deve conter no mínimo 6 caracteres.")]
    public string Senha { get; set; }

    [Required(ErrorMessage = "O campo CursoId é obrigatório.")]
    public Guid CursoId { get; set; }
}
