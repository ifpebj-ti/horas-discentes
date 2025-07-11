using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Back.Application.DTOs.Curso;
public class CreateCursoComLimiteHorasRequest
{
    public string? NomeCurso { get; set; }
    public int MaximoHorasComplementar { get; set; }
    public int MaximoHorasExtensao { get; set; }
}
