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
}
