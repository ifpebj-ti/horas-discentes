﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Back.Domain.Entities.Atividade;

public class Atividade
{
    [Key]
    public Guid Id { get; set; }

    [Required(ErrorMessage = "O campo Nome da atividade é obrigatório.")]
    public string? Nome { get; set; }

    [Required(ErrorMessage = "O campo CargaMáximaSemestral é obrigatório.")]
    public int CargaMaximaSemestral { get; set; }

    [Required(ErrorMessage = "O campo CargaMáximaCurso é obrigatório.")]
    public int CargaMaximaCurso { get; set; }

    [Required(ErrorMessage = "O campo Grupo é obrigatório.")]
    public string? Grupo { get; set; }

    [Required(ErrorMessage = "O campo Tipo é obrigatório.")]
    public TipoAtividade Tipo { get; set; }
    [Required(ErrorMessage = "O campo Categoria é obrigatório.")]
    public string? Categoria { get; set; }

    [Required(ErrorMessage = "O campo CategoriaKey é obrigatório.")]

    public string? CategoriaKey { get; set; }

    [Required(ErrorMessage = "O campo CursoId é obrigatório.")]
    public Guid CursoId { get; set; }

    [ForeignKey(nameof(CursoId))]
    public Curso.Curso? Curso { get; set; }

    public ICollection<AlunoAtividade.AlunoAtividade> Alunos { get; set; } = new List<AlunoAtividade.AlunoAtividade>();
}

public enum TipoAtividade
{
    EXTENSAO,
    COMPLEMENTAR
}
