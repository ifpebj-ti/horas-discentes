using Back.Application.DTOs.Coordenador;
using Back.Application.Interfaces;
using Back.Application.Interfaces.Repositories;
using Back.Domain.Entities.Convite;
using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace Back.Application.UseCases.Coordenador
{
    public class EnviarConviteUseCase
    {
        private readonly IConviteCoordenadorRepository _conviteRepo;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _config;
        public EnviarConviteUseCase(
            IConviteCoordenadorRepository conviteRepo,
            IEmailService emailService,
            IConfiguration config)
        {
            _conviteRepo = conviteRepo;
            _emailService = emailService;
            _config = config;
        }

        public async Task ExecuteAsync(ConviteCoordenadorRequest request)
        {
            var token = Guid.NewGuid().ToString();

            var convite = new ConviteCoordenadorBuilder()
                .WithId(Guid.NewGuid())
                .WithEmail(request.Email)
                .WithCursoId(request.CursoId)
                .WithToken(token)
                .WithExpiracao(DateTime.UtcNow.AddHours(2))
                .Build();

            await _conviteRepo.AddAsync(convite);

            var emailEncoded = Uri.EscapeDataString(request.Email);
            var baseUrl = _config["COORDENADOR_CONVITE_LINK"]
    ?? throw new Exception("Variável de ambiente COORDENADOR_CONVITE_LINK não configurada.");
            var link = $"{baseUrl}?token={token}&email={emailEncoded}";


            var mensagem = $@"
<!DOCTYPE html>
<html lang=""pt-br"">
<head>
    <meta charset=""UTF-8"">
    <title>Convite para Coordenador</title>
    <style>
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f4f4;
            padding: 30px;
        }}
        .container {{
            background-color: #ffffff;
            border-radius: 8px;
            padding: 40px;
            max-width: 600px;
            margin: auto;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }}
        h2 {{
            color: #333333;
        }}
        p {{
            font-size: 16px;
            color: #555555;
        }}
        .botao {{
            display: inline-block;
            margin-top: 20px;
            padding: 14px 24px;
            background-color: #4CAF50;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            transition: background-color 0.3s ease;
        }}
        .botao:hover {{
            background-color: #45a049;
        }}
        .footer {{
            margin-top: 40px;
            font-size: 13px;
            color: #999999;
            text-align: center;
        }}
    </style>
</head>
<body>
    <div class=""container"">
        <h2>🎓 Convite para Cadastro como Coordenador</h2>
        <p>Olá,</p>
        <p>Você foi convidado para se tornar um coordenador no sistema de horas discentes.</p>
        <p>Para prosseguir com seu cadastro, clique no botão abaixo. O link expira em 2 horas.</p>

        <a href=""{link}"" class=""botao"">Criar Conta de Coordenador</a>

        <div class=""footer"">
            Este é um e-mail automático. Por favor, não responda.
        </div>
    </div>
</body>
</html>";

            await _emailService.EnviarEmailAsync(
                request.Email,
                "Convite para cadastro de Coordenador",
                mensagem
            );
        }
    }
}
