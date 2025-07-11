using Back.Application.UseCases.Aluno;
using Back.Application.UseCases.Atividade;
using Back.Application.UseCases.Auth;
using Back.Application.UseCases.Certificado;
using Back.Application.UseCases.Coordenador;
using Back.Application.UseCases.Curso;
using Back.Application.UseCases.LimiteHorasAluno;
using Back.Application.UseCases.Turma;
using Microsoft.Extensions.DependencyInjection;

namespace Back.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {

        //curso
        services.AddScoped<CreateCursoUseCase>();
        services.AddScoped<GetAllCursosUseCase>();
        services.AddScoped<GetCursoByIdUseCase>();

        //turma
        services.AddScoped<CreateTurmaUseCase>();
        services.AddScoped<GetAllTurmasUseCase>();
        services.AddScoped<GetTurmaByIdUseCase>();
        services.AddScoped<VerificarTurmaExisteUseCase>();
        services.AddScoped<GetAlunosByTurmaUseCase>();
        services.AddScoped<GetTurmasByCursoIdUseCase>();

        //Aluno
        services.AddScoped<CreateAlunoUseCase>();
        services.AddScoped<GetAlunoByIdUseCase>();
        services.AddScoped<DeleteAlunoUseCase>();
        services.AddScoped<ToggleAlunoStatusUseCase>();
        services.AddScoped<GetAlunoDetalhadoUseCase>();
        services.AddScoped<GetResumoHorasUseCase>();
        services.AddScoped<GetAlunoFromTokenUseCase>();

        //auth
        services.AddScoped<LoginUseCase>();

        //coordenador
        services.AddScoped<EnviarConviteUseCase>();
        services.AddScoped<CriarCoordenadorUseCase>();
        services.AddScoped<GetAtividadesByCursoIdUseCase>();

        //certificado
        services.AddScoped<CreateCertificadoUseCase>();
        services.AddScoped<GetCertificadosUseCase>();
        services.AddScoped<GetCertificadosDoAlunoAutenticadoUseCase>();
        services.AddScoped<AtualizarStatusCertificadoUseCase>();
        services.AddScoped<GetCertificadoByIdUseCase>();

        //Limitehoras
        services.AddScoped<CreateLimiteHorasAlunoUseCase>();
        return services;
    }
}
