using System;

namespace Back.Application.DTOs.Atividade;

public record AtividadeResponse(Guid Id, string Nome, Guid CursoId, string Tipo, string Grupo, string Categoria);
