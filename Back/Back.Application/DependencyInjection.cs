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
    public static object AddApplication(this IServiceCollection services)
    {

        //curso
        services.AddScoped<CreateCursoUseCase>();
        services.AddScoped<GetAllCursosUseCase>();
        services.AddScoped<GetCursoByIdUseCase>();
        services.AddScoped<GetResumoCursosUseCase>();
        services.AddScoped<DeleteCursoUseCase>();
        services.AddScoped<UpdateCursoUseCase>();

        //turma
        services.AddScoped<CreateTurmaUseCase>();
        services.AddScoped<GetAllTurmasUseCase>();
        services.AddScoped<GetTurmaByIdUseCase>();
        services.AddScoped<VerificarTurmaExisteUseCase>();
        services.AddScoped<GetAlunosByTurmaUseCase>();
        services.AddScoped<GetTurmasByCursoIdUseCase>();
        services.AddScoped<DeleteTurmaUseCase>();
        services.AddScoped<UpdateTurmaUseCase>();

        //Aluno
        services.AddScoped<CreateAlunoUseCase>();
        services.AddScoped<GetAlunoByIdUseCase>();
        services.AddScoped<DeleteAlunoUseCase>();
        services.AddScoped<ToggleAlunoStatusUseCase>();
        services.AddScoped<GetAlunoDetalhadoUseCase>();
        services.AddScoped<GetResumoHorasUseCase>();
        services.AddScoped<GetAlunoFromTokenUseCase>();
        services.AddScoped<GetAlunosComHorasConcluidasUseCase>();
        services.AddScoped<ContarPendenciasDownloadUseCase>();
        services.AddScoped<MarcarDownloadRelatorioUseCase>();
        services.AddScoped<DeleteAlunoUseCase>();
        services.AddScoped<UpdateAlunoUseCase>();
        //auth
        services.AddScoped<LoginUseCase>();
        services.AddScoped<ForgotPasswordUseCase>();
        services.AddScoped<ValidateResetCodeUseCase>();
        services.AddScoped<ResetPasswordUseCase>();

        //coordenador
        services.AddScoped<EnviarConviteUseCase>();
        services.AddScoped<CriarCoordenadorUseCase>();
        services.AddScoped<GetAtividadesByCursoIdUseCase>();
        services.AddScoped<GetCoordenadorFromTokenUseCase>();
        services.AddScoped<GetCoordenadorByCursoIdUseCase>();
        services.AddScoped<DeleteCoordenadorUseCase>();
        services.AddScoped<UpdateCoordenadorAdminUseCase>();
        services.AddScoped<UpdateCoordenadorSelfUseCase>();
        //certificado
        services.AddScoped<CreateCertificadoUseCase>();
        services.AddScoped<GetCertificadosUseCase>();
        services.AddScoped<GetCertificadosDoAlunoAutenticadoUseCase>();
        services.AddScoped<AtualizarStatusCertificadoUseCase>();
        services.AddScoped<GetCertificadoByIdUseCase>();
        services.AddScoped<GetCertificadosByCursoIdUseCase>();
        services.AddScoped<GetCertificadoAnexoUseCase>();
        //Limitehoras
        services.AddScoped<CreateLimiteHorasAlunoUseCase>();
        //atividade
        services.AddScoped<CreateAtividadeUseCase>();
        services.AddScoped<DeleteAtividadeUseCase>();
        services.AddScoped<UpdateAtividadeUseCase>();
        return services;
    }
}
