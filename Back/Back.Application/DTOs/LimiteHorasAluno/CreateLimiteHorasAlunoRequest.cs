using System;
using System.ComponentModel.DataAnnotations;

namespace Back.Application.DTOs.LimiteHorasAluno;
public record CreateLimiteHorasAlunoRequest(
    [Required] int MaximoHorasComplementar,
    int? MaximoHorasExtensao,
    [Required] Guid CursoId
);