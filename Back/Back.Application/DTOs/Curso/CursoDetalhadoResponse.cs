using System;

namespace Back.Application.DTOs.Curso;

public record CursoDetalhadoResponse(
    Guid Id,
    string Nome,
    int MaximoHorasComplementar,
    int MaximoHorasExtensao
);
