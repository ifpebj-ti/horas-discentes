namespace Back.Application.Interfaces;

public interface IEmailTemplateService
{
    string RenderConviteCoordenador(string link);
    string RenderResetSenha(string nome, string codigo);
}
