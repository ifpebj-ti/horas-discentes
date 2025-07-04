﻿using System.ComponentModel.DataAnnotations;

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

    public bool JaBaixadoHoras { get; set; }

    [Required(ErrorMessage = "O campo TurmaId é obrigatório.")]
    public Guid TurmaId { get; set; }

    [Required]
    public string IdentityUserId { get; set; }
    public Turma.Turma Turma { get; private set; }

    internal Aluno() { }

    internal Aluno(Guid id, string nome, string email, string matricula, Guid turmaId, string identityUserId)
    {
        Id = id;
        Nome = nome;
        Email = email;
        Matricula = matricula;
        TurmaId = turmaId;
        IdentityUserId = identityUserId;
    }
}
