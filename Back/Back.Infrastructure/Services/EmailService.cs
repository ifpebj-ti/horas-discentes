using Back.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace Back.Infrastructure.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task EnviarEmailAsync(string destinatario, string assunto, string corpoHtml)
    {
        var emailConfig = _configuration.GetSection("Email");

        var remetente = emailConfig["Remetente"];
        var senha = emailConfig["Senha"];
        var smtp = emailConfig["Smtp"];
        var porta = int.Parse(emailConfig["Porta"]);

        var mensagem = new MailMessage(remetente, destinatario, assunto, corpoHtml)
        {
            IsBodyHtml = true
        };

        using var smtpClient = new SmtpClient(smtp, porta)
        {
            Credentials = new NetworkCredential(remetente, senha),
            EnableSsl = true
        };

        await smtpClient.SendMailAsync(mensagem);
    }
}
