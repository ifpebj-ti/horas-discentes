﻿using Back.Domain.Entities.Atividade;
using System;

namespace Back.Application.DTOs.Atividade;

public class CreateAtividadeRequest
{
    public string? Nome { get; set; }
    public string? Grupo { get; set; }
    public string? Categoria { get; set; }
    public string? CategoriaKey { get; set; }
    public int CargaMaximaSemestral { get; set; }
    public int CargaMaximaCurso { get; set; }
    public TipoAtividade Tipo { get; set; }
    public Guid CursoId { get; set; }
}
