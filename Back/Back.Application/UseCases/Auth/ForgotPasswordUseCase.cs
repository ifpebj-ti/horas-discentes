using Back.Application.DTOs.Auth;
using Back.Application.Interfaces;
using Back.Application.Interfaces.Identity;
using Back.Application.Interfaces.Repositories;
using Back.Domain.Entities.Auth;
using Microsoft.AspNetCore.Identity;
using System;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Back.Application.UseCases.Auth
{
    public class ForgotPasswordUseCase
    {
        private readonly IIdentityLookupService _identityLookup;
        private readonly IResetPasswordRepository _repo;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IEmailService _emailService;

        public ForgotPasswordUseCase(
            IIdentityLookupService identityLookup,
            IResetPasswordRepository repo,
            UserManager<IdentityUser> userManager,
            IEmailService emailService)
        {
            _identityLookup = identityLookup;
            _repo = repo;
            _userManager = userManager;
            _emailService = emailService;
        }

        public async Task<ForgotPasswordResponseDto> ExecuteAsync(ForgotPasswordRequestDto dto)
        {
            var user = await _identityLookup.GetByEmailAsync(dto.Email);
            if (user == null)
            {
                // Resposta idempotente: não revela existência do e-mail
                return new ForgotPasswordResponseDto();
            }

            // Invalida código ativo anterior (opcional: permitir reuso até expirar)
            var active = await _repo.GetActiveByUserAsync(user.Id);
            if (active != null)
            {
                active.Used = true;
                await _repo.UpdateAsync(active);
                await _repo.SaveChangesAsync();
            }

            var sixDigit = GenerateSixDigitCode();
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            var entity = new ResetPasswordCode
            {
                Id = Guid.NewGuid(),
                IdentityUserId = user.Id,
                Code = sixDigit,
                IdentityResetToken = token,
                ExpiresAtUtc = DateTime.UtcNow.AddMinutes(10)
            };

            await _repo.AddAsync(entity);
            await _repo.SaveChangesAsync();

            var subject = "Código de verificação - Redefinição de Senha";
            var body = BuildEmailHtml(user.UserName ?? dto.Email, sixDigit);

            await _emailService.EnviarEmailAsync(dto.Email, subject, body);

            return new ForgotPasswordResponseDto();
        }

        private static string GenerateSixDigitCode()
        {
            // 000000–999999 com randomness forte
            using var rng = RandomNumberGenerator.Create();
            var bytes = new byte[4];
            rng.GetBytes(bytes);
            var value = BitConverter.ToUInt32(bytes, 0) % 1_000_000;
            return value.ToString("D6");
        }

        private static string BuildEmailHtml(string name, string code)
        {
            var html = $@"
                <!DOCTYPE html>
                <html lang=""pt-br"">
                <head>
                  <meta charset=""UTF-8"">
                  <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
                  <meta http-equiv=""X-UA-Compatible"" content=""IE=edge"">
                  <title>Redefinição de Senha</title>

                  <!-- Resets essenciais para e-mail -->
                  <style>
                    /* Resets */
                    html, body {{ margin:0 !important; padding:0 !important; height:100% !important; width:100% !important; }}
                    * {{ -ms-text-size-adjust:100%; -webkit-text-size-adjust:100%; }}
                    table, td {{ mso-table-lspace:0pt !important; mso-table-rspace:0pt !important; }}
                    table {{ border-collapse:collapse !important; }}
                    img {{ -ms-interpolation-mode:bicubic; border:0; line-height:100%; outline:none; text-decoration:none; display:block; }}
                    a {{ text-decoration:none; }}
                    /* Layout base */
                    body {{
                      background:#0f172a;
                      background-image: radial-gradient(1200px 600px at 20% -10%, #1e293b 0%, rgba(15,23,42,0) 60%),
                                        radial-gradient(1000px 500px at 120% 10%, #0ea5e9 0%, rgba(14,165,233,0) 50%),
                                        radial-gradient(800px 400px at -10% 120%, #22d3ee 0%, rgba(34,211,238,0) 55%);
                      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                      color:#0b1220;
                    }}
                    .wrapper {{ padding:28px 16px; }}
                    .container {{
                      max-width:640px;
                      margin:0 auto;
                      background:#ffffff;
                      border-radius:14px;
                      overflow:hidden;
                      box-shadow:0 20px 60px rgba(2,6,23,0.35), inset 0 1px 0 rgba(255,255,255,0.25);
                    }}
                    .header {{
                      background:linear-gradient(135deg, #0ea5e9 0%, #22d3ee 50%, #38bdf8 100%);
                      padding:28px 28px 18px;
                      color:#00111a;
                      position:relative;
                    }}
                    .brand {{
                      font-size:14px;
                      font-weight:700;
                      letter-spacing:1.2px;
                      text-transform:uppercase;
                      background:rgba(255,255,255,0.85);
                      display:inline-block;
                      padding:6px 10px;
                      border-radius:8px;
                      box-shadow:0 6px 18px rgba(0,0,0,0.12);
                    }}
                    .title {{
                      margin:18px 0 6px;
                      font-size:24px;
                      line-height:1.2;
                      font-weight:800;
                      color:#00202e;
                      text-shadow:0 1px 0 rgba(255,255,255,0.35);
                    }}
                    .subtitle {{
                      margin:0;
                      color:#043042;
                      font-size:14px;
                      opacity:.9;
                    }}
                    .content {{ padding:28px; }}
                    .hello {{ font-size:16px; color:#0f172a; margin:0 0 14px; }}
                    .text  {{ font-size:15px; color:#334155; margin:0 0 18px; }}
                    .code-box {{
                      margin:22px 0;
                      background:linear-gradient(180deg, #0b1220 0%, #111827 100%);
                      border-radius:12px;
                      padding:20px;
                      text-align:center;
                      border:1px solid rgba(255,255,255,0.06);
                      box-shadow:0 10px 30px rgba(2,6,23,0.45), inset 0 0 0 1px rgba(255,255,255,0.06);
                    }}
                    .code-label {{
                      color:#94a3b8;
                      font-size:12px;
                      letter-spacing:1.8px;
                      text-transform:uppercase;
                    }}
                    .code {{
                      margin-top:10px;
                      display:inline-block;
                      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
                      font-size:28px;
                      letter-spacing:6px;
                      color:#e2f4ff;
                      padding:10px 16px;
                      border-radius:10px;
                      background:linear-gradient(180deg, rgba(14,165,233,.18), rgba(34,211,238,.18));
                      box-shadow: inset 0 0 0 1px rgba(56,189,248,.4), 0 8px 24px rgba(14,165,233,.25);
                    }}
                    .cta-wrap {{
                      text-align:center;
                      margin:24px 0 4px;
                    }}
                    .cta {{
                      display:inline-block;
                      background:#0ea5e9;
                      color:#00111a !important;
                      font-weight:800;
                      border-radius:10px;
                      padding:12px 22px;
                      border:1px solid rgba(255,255,255,0.6);
                      box-shadow:0 10px 24px rgba(14,165,233,0.35);
                    }}
                    .tips {{
                      margin-top:14px;
                      font-size:12px;
                      color:#64748b;
                      line-height:1.5;
                    }}
                    .divider {{
                      height:1px; background:linear-gradient(90deg, rgba(2,6,23,0), rgba(2,6,23,.12), rgba(2,6,23,0));
                      margin:10px 0 0;
                    }}
                    .footer {{
                      padding:18px 28px 26px;
                      background:#f8fafc;
                      color:#64748b;
                      font-size:12px;
                      text-align:center;
                    }}
                    .muted {{ color:#94a3b8; }}
                    .link {{ color:#0ea5e9; }}
                    /* Modo escuro para clients compatíveis */
                    @media (prefers-color-scheme: dark) {{
                      .container {{ background:#0b1220; }}
                      .content {{ background:transparent; }}
                      .hello, .text {{ color:#e5e7eb; }}
                      .footer {{ background:#0b1220; color:#94a3b8; }}
                      .divider {{ background:linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.12), rgba(255,255,255,0)); }}
                    }}
                    /* Responsivo */
                    @media screen and (max-width:560px) {{
                      .title {{ font-size:20px; }}
                      .content {{ padding:22px; }}
                      .code {{ font-size:24px; letter-spacing:5px; }}
                    }}
                  </style>
                  <!-- Fallback para Outlook -->
                  <!--[if mso]>
                    <style>
                      .code {{ letter-spacing:4px !important; }}
                    </style>
                  <![endif]-->
                </head>
                <body>
                  <div class=""wrapper"">
                    <table role=""presentation"" width=""100%"" cellspacing=""0"" cellpadding=""0"">
                      <tr>
                        <td>
                          <div class=""container"">
                            <!-- Cabeçalho com gradiente -->
                            <div class=""header"">
                              <span class=""brand"">Segurança da Conta</span>
                              <h1 class=""title"">Redefinição de senha</h1>
                              <p class=""subtitle"">Confirme a identidade para continuar</p>
                            </div>

                            <!-- Conteúdo -->
                            <div class=""content"">
                              <p class=""hello"">Olá, {System.Net.WebUtility.HtmlEncode(name)}!</p>
                              <p class=""text"">Foi solicitada a redefinição da senha da conta associada a este e-mail. Use o código abaixo para verificar a identidade e prosseguir com a alteração de senha.</p>

                              <div class=""code-box"">
                                <div class=""code-label"">Seu código de verificação</div>
                                <div class=""code"">{System.Net.WebUtility.HtmlEncode(code)}</div>
                              </div>

                              <div class=""cta-wrap"">
                                <span class=""tips"">O código expira em 10 minutos. Por motivos de segurança, não compartilhe este código com ninguém.</span>
                              </div>

                              <div class=""divider""></div>

                              <p class=""text"">Se a solicitação não foi feita por você, <span class=""muted"">nenhuma ação é necessária</span>. Recomendamos revisar as atividades recentes e habilitar autenticação em duas etapas quando disponível.</p>
                            </div>

                            <!-- Rodapé -->
                            <div class=""footer"">
                              Este é um e-mail automático; respostas não são monitoradas. Se precisar de ajuda, contate o suporte do sistema.<br/>
                              <span class=""muted"">© {DateTime.UtcNow.Year} — Todos os direitos reservados.</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </div>

                  <!-- Versão em texto simples para clients que não renderizam HTML -->
                  <div style=""display:none; white-space:pre; font-size:0; line-height:0; max-height:0; overflow:hidden;"">
                    Olá, {System.Net.WebUtility.HtmlEncode(name)}!
                    Código de verificação: {System.Net.WebUtility.HtmlEncode(code)}
                    O código expira em 10 minutos. Se não foi você, ignore este e-mail.
                  </div>
                </body>
                </html>";
            return html;
        }

    }
}
