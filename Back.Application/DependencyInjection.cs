using AutoMapper;
using Back.Application.Mappings;
using Microsoft.Extensions.DependencyInjection;

namespace Back.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddAutoMapper(typeof(ApplicationMappingProfile).Assembly);

        // Registrar casos de uso futuramente aqui
        // services.AddScoped<CreateUserUseCase>();

        return services;
    }
}
