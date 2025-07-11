using Back.Application.Interfaces;
using Back.Application.Interfaces.Identity;
using Back.Application.Interfaces.Repositories;
using Back.Infrastructure.Persistence.Repositories;
using Back.Infrastructure.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Back.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // curso
        services.AddScoped<ICursoRepository, CursoRepository>();

        // turma
        services.AddScoped<ITurmaRepository, TurmaRepository>();

        //aluno

        services.AddScoped<IAlunoRepository, AlunoRepository>();
        services.AddScoped<IIdentityService, IdentityService>();
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<IConviteCoordenadorRepository, ConviteCoordenadorRepository>();
        services.AddScoped<ICoordenadorRepository, CoordenadorRepository>();
        services.AddScoped<IAuthService, AuthService>();


        return services;
    }
}
