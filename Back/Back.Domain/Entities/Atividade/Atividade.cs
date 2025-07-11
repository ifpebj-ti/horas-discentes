using System.ComponentModel.DataAnnotations;

namespace Back.Domain.Entities.Atividade;

public class Atividade
{
    [Key]
    public Guid Id { get; set; }

    [Required(ErrorMessage = "O campo Nome da atividade é obrigatório.")]
    public string Nome { get; set; }

    [Required(ErrorMessage = "O campo CargaMáximaSemestral é obrigatório.")]
    public int CargaMaximaSemestral { get; set; }

    [Required(ErrorMessage = "O campo CargaMáximaCurso é obrigatório.")]
    public int CargaMaximaCurso { get; set; }

    [Required(ErrorMessage = "O campo Grupo é obrigatório.")]
    public string Grupo { get; set; }

    [Required(ErrorMessage = "O campo Tipo é obrigatório.")]
    public TipoAtividade Tipo { get; set; }
}

public enum TipoAtividade
{
    EXTENSAO,
    COMPLEMENTAR
}
