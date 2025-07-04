using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using Back.Domain.Entities.Atividade;
using Back.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace Back.Infrastructure.Seeders;

public static class AtividadeSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context, Guid cursoId)
    {
        if (await context.Atividades.AnyAsync())
            return; // Já existem atividades no banco, não faz nada

        var atividades = new List<Atividade>
        {
            // Complementares
            new Atividade { Id = Guid.NewGuid(), Nome = "Disciplinas cursadas em outros cursos de graduação", Grupo = "I", Categoria = "Categoria 1", CategoriaKey = "Ensino", CargaMaximaSemestral = 60, CargaMaximaCurso = 60, Tipo = TipoAtividade.COMPLEMENTAR, CursoId = cursoId },
            new Atividade { Id = Guid.NewGuid(), Nome = "Monitoria", Grupo = "I", Categoria = "Categoria 2", CategoriaKey = "Ensino", CargaMaximaSemestral = 40, CargaMaximaCurso = 80, Tipo = TipoAtividade.COMPLEMENTAR, CursoId = cursoId },
            new Atividade { Id = Guid.NewGuid(), Nome = "Cursos de idiomas realizados durante o curso, comunicação e expressão e informática", Grupo = "I", Categoria = "Categoria 3", CategoriaKey = "Ensino", CargaMaximaSemestral = 40, CargaMaximaCurso = 80, Tipo = TipoAtividade.COMPLEMENTAR, CursoId = cursoId },
            new Atividade { Id = Guid.NewGuid(), Nome = "Participação do programa institucional de bolsas de iniciação à docência", Grupo = "I", Categoria = "Categoria 4", CategoriaKey = "Ensino", CargaMaximaSemestral = 20, CargaMaximaCurso = 40, Tipo = TipoAtividade.COMPLEMENTAR, CursoId = cursoId },
            new Atividade { Id = Guid.NewGuid(), Nome = "Visita técnica em área afim ao curso e supervisionada pela instituição, mediante apresentação de relatório.", Grupo = "II", Categoria = "Categoria 5", CategoriaKey = "Estagio", CargaMaximaSemestral = 20, CargaMaximaCurso = 80, Tipo = TipoAtividade.COMPLEMENTAR, CursoId = cursoId },
            new Atividade { Id = Guid.NewGuid(), Nome = "Estágio Profissional não obrigatório", Grupo = "II", Categoria = "Categoria 6", CategoriaKey = "Estagio", CargaMaximaSemestral = 60, CargaMaximaCurso = 60, Tipo = TipoAtividade.COMPLEMENTAR, CursoId = cursoId },
            new Atividade { Id = Guid.NewGuid(), Nome = "Participação como ouvinte... em eventos científicos", Grupo = "III", Categoria = "Categoria 7", CategoriaKey = "Eventos", CargaMaximaSemestral = 10, CargaMaximaCurso = 80, Tipo = TipoAtividade.COMPLEMENTAR, CursoId = cursoId },
            new Atividade { Id = Guid.NewGuid(), Nome = "Participação em projetos de pesquisa", Grupo = "IV", Categoria = "Categoria 8", CategoriaKey = "Pesquisa", CargaMaximaSemestral = 20, CargaMaximaCurso = 80, Tipo = TipoAtividade.COMPLEMENTAR, CursoId = cursoId },
            new Atividade { Id = Guid.NewGuid(), Nome = "Publicações de textos acadêmicos", Grupo = "IV", Categoria = "Categoria 9", CategoriaKey = "Pesquisa", CargaMaximaSemestral = 10, CargaMaximaCurso = 40, Tipo = TipoAtividade.COMPLEMENTAR, CursoId = cursoId },
            new Atividade { Id = Guid.NewGuid(), Nome = "Grupos de estudos com produção intelectual", Grupo = "IV", Categoria = "Categoria 10", CategoriaKey = "Pesquisa", CargaMaximaSemestral = 10, CargaMaximaCurso = 20, Tipo = TipoAtividade.COMPLEMENTAR, CursoId = cursoId },
            new Atividade { Id = Guid.NewGuid(), Nome = "Trabalhos desenvolvidos sob orientação...", Grupo = "IV", Categoria = "Categoria 11", CategoriaKey = "Pesquisa", CargaMaximaSemestral = 10, CargaMaximaCurso = 40, Tipo = TipoAtividade.COMPLEMENTAR, CursoId = cursoId },
            new Atividade { Id = Guid.NewGuid(), Nome = "Participação em projetos de extensão", Grupo = "V", Categoria = "Categoria 12", CategoriaKey = "Curso", CargaMaximaSemestral = 20, CargaMaximaCurso = 80, Tipo = TipoAtividade.COMPLEMENTAR, CursoId = cursoId },
            new Atividade { Id = Guid.NewGuid(), Nome = "Participar na organização...", Grupo = "V", Categoria = "Categoria 13", CategoriaKey = "Curso", CargaMaximaSemestral = 10, CargaMaximaCurso = 40, Tipo = TipoAtividade.COMPLEMENTAR, CursoId = cursoId },
            new Atividade { Id = Guid.NewGuid(), Nome = "Trabalhar na organização de material informativo", Grupo = "V", Categoria = "Categoria 14", CategoriaKey = "Curso", CargaMaximaSemestral = 10, CargaMaximaCurso = 20, Tipo = TipoAtividade.COMPLEMENTAR, CursoId = cursoId },
            new Atividade { Id = Guid.NewGuid(), Nome = "Trabalhar em campanhas de voluntariado", Grupo = "V", Categoria = "Categoria 15", CategoriaKey = "Curso", CargaMaximaSemestral = 10, CargaMaximaCurso = 20, Tipo = TipoAtividade.COMPLEMENTAR, CursoId = cursoId },
            new Atividade { Id = Guid.NewGuid(), Nome = "Participação, como voluntário, em atividades compatíveis...", Grupo = "VI", Categoria = "Categoria 16", CategoriaKey = "Voluntariado", CargaMaximaSemestral = 10, CargaMaximaCurso = 40, Tipo = TipoAtividade.COMPLEMENTAR, CursoId = cursoId },

            // Extensão
            new Atividade { Id = Guid.NewGuid(), Nome = "Participação como Bolsista... em Projetos/Programas de Extensão", Grupo = "Extensao", Categoria = "Categoria 1", CategoriaKey = "Extensao", CargaMaximaSemestral = 80, CargaMaximaCurso = 160, Tipo = TipoAtividade.EXTENSAO, CursoId = cursoId },
            new Atividade { Id = Guid.NewGuid(), Nome = "Participação em Eventos voltados ao público externo...", Grupo = "Extensao", Categoria = "Categoria 2", CategoriaKey = "Extensao", CargaMaximaSemestral = 40, CargaMaximaCurso = 80, Tipo = TipoAtividade.EXTENSAO, CursoId = cursoId },
            new Atividade { Id = Guid.NewGuid(), Nome = "Participação da Comissão Organizadora...", Grupo = "Extensao", Categoria = "Categoria 3", CategoriaKey = "Extensao", CargaMaximaSemestral = 20, CargaMaximaCurso = 80, Tipo = TipoAtividade.EXTENSAO, CursoId = cursoId },
            new Atividade { Id = Guid.NewGuid(), Nome = "Prestação de serviços de caráter extensionista", Grupo = "Extensao", Categoria = "Categoria 4", CategoriaKey = "Extensao", CargaMaximaSemestral = 80, CargaMaximaCurso = 160, Tipo = TipoAtividade.EXTENSAO, CursoId = cursoId },
            new Atividade { Id = Guid.NewGuid(), Nome = "Atividades desenvolvidas por meio dos Núcleos Institucionais de Extensão", Grupo = "Extensao", Categoria = "Categoria 5", CategoriaKey = "Extensao", CargaMaximaSemestral = 20, CargaMaximaCurso = 80, Tipo = TipoAtividade.EXTENSAO, CursoId = cursoId },
            new Atividade { Id = Guid.NewGuid(), Nome = "Atividades de empreendedorismo em empresa júnior...", Grupo = "Extensao", Categoria = "Categoria 6", CategoriaKey = "Extensao", CargaMaximaSemestral = 80, CargaMaximaCurso = 160, Tipo = TipoAtividade.EXTENSAO, CursoId = cursoId }
        };

        context.Atividades.AddRange(atividades);
        await context.SaveChangesAsync();
    }
}
