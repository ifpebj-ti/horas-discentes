using Back.Application.Interfaces;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Gmail.v1;
using Google.Apis.Gmail.v1.Data;
using Google.Apis.Services;
using Google.Apis.Util.Store;
using Microsoft.Extensions.Configuration;
using MimeKit;
using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace Back.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task EnviarEmailAsync(string destinatario, string assunto, string corpoHtml)
        {
            // Você pode continuar usando Email:Remetente do appsettings.json
            var remetente = _configuration["Email:Remetente"];
            if (string.IsNullOrWhiteSpace(remetente))
                throw new InvalidOperationException("Configure Email:Remetente no appsettings.json com o email do remetente (conta do Gmail).");

            var gmailService = await CreateGmailServiceAsync(remetente);

            var mimeMessage = new MimeMessage();
            mimeMessage.From.Add(MailboxAddress.Parse(remetente));
            mimeMessage.To.Add(MailboxAddress.Parse(destinatario));
            mimeMessage.Subject = assunto;

            var builder = new BodyBuilder
            {
                HtmlBody = corpoHtml
            };
            mimeMessage.Body = builder.ToMessageBody();

            var raw = Base64UrlEncode(mimeMessage);

            var gmailMessage = new Message
            {
                Raw = raw
            };

            // "me" usa o usuário autenticado (o mesmo do 'remetente')
            await gmailService.Users.Messages.Send(gmailMessage, "me").ExecuteAsync();
        }

        private async Task<GmailService> CreateGmailServiceAsync(string userEmail)
        {
            // Caminhos configuráveis (ou usa defaults na raiz do executável)
            var credentialsPath = _configuration["Gmail:CredentialsPath"]
                ?? Path.Combine(AppContext.BaseDirectory, "credentials.json");
            var tokenPath = _configuration["Gmail:TokenPath"]
                ?? Path.Combine(AppContext.BaseDirectory, "token.json");
            var applicationName = _configuration["Gmail:ApplicationName"] ?? "BackApp";

            if (!File.Exists(credentialsPath))
                throw new FileNotFoundException($"credentials.json não encontrado em: {credentialsPath}");

            using var stream = new FileStream(credentialsPath, FileMode.Open, FileAccess.Read);

            var secrets = GoogleClientSecrets.FromStream(stream).Secrets;

            // IMPORTANTE: na primeira execução em ambiente interativo, abrirá o browser para consentimento.
            // O token de atualização ficará salvo em token.json.
            var credential = await GoogleWebAuthorizationBroker.AuthorizeAsync(
                secrets,
                new[] { GmailService.Scope.GmailSend },
                userEmail, // identifica o "owner" do token (normalmente o remetente)
                CancellationToken.None,
                new FileDataStore(tokenPath, true)
            );

            return new GmailService(new BaseClientService.Initializer
            {
                HttpClientInitializer = credential,
                ApplicationName = applicationName
            });
        }

        private static string Base64UrlEncode(MimeMessage mimeMessage)
        {
            using (var memoryStream = new MemoryStream())
            {
                mimeMessage.WriteTo(memoryStream);
                var bytes = memoryStream.ToArray();
                return Convert.ToBase64String(bytes)
                    .TrimEnd('=')
                    .Replace('+', '-')
                    .Replace('/', '_');
            }
        }
    }
}