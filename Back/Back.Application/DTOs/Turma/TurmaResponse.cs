using System;

namespace Back.Application.DTOs.Turma;

public record TurmaResponse(
    Guid Id,
    string Periodo,
    string Turno,
    bool PossuiExtensao,
    Guid CursoId,
    string CursoNome
);
