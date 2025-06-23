using System;

namespace Back.Application.DTOs.Turma;

public record AlunoPorTurmaResponse(
    Guid Id,
    string Nome,
    string Email,
    string Matricula
);
