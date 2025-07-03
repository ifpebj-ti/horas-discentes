using System;
using Back.Domain.Entities.Certificado;

namespace Back.Application.DTOs.Certificado;

public record CreateCertificadoRequest(
    string TituloAtividade,
    string Instituicao,
    string Local,
    string Categoria,
    string Grupo,
    string PeriodoLetivo,
    int CargaHoraria,
    DateTime DataInicio,
    DateTime DataFim,
    int TotalPeriodos,
    string? Descricao,
    byte[] Anexo,
    Guid AlunoId,
    Guid AtividadeId,
    TipoCertificado Tipo
);
