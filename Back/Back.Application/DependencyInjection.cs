using Back.Application.UseCases.Aluno;
using Back.Application.UseCases.Atividade;
using Back.Application.UseCases.Auth;
using Back.Application.UseCases.Certificado;
using Back.Application.UseCases.Coordenador;
using Back.Application.UseCases.Curso;
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

        //Aluno
        services.AddScoped<CreateAlunoUseCase>();
        services.AddScoped<GetAlunoByIdUseCase>();

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

        return services;
    }
}
