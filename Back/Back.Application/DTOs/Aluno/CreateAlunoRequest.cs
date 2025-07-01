using System;

namespace Back.Application.DTOs.Aluno;

public record CreateAlunoRequest(
    string Nome,
    string Email,
    string Matricula,
    string Senha,
    Guid TurmaId
);
