using Back.Application.Interfaces;
using System;
using System.IO;
using System.Net;
using System.Reflection;

namespace Back.Infrastructure.Services;

public class EmailTemplateService : IEmailTemplateService
{
    private static readonly Assembly _assembly = typeof(EmailTemplateService).Assembly;

    public string RenderConviteCoordenador(string link)
    {
        var template = LoadTemplate("convite-coordenador.html");
        return template
            .Replace("{{LINK}}", WebUtility.HtmlEncode(link))
            .Replace("{{ANO}}", DateTime.UtcNow.Year.ToString());
    }

    public string RenderResetSenha(string nome, string codigo)
    {
        var template = LoadTemplate("reset-senha.html");
        return template
            .Replace("{{NOME}}", WebUtility.HtmlEncode(nome))
            .Replace("{{CODIGO}}", WebUtility.HtmlEncode(codigo))
            .Replace("{{ANO}}", DateTime.UtcNow.Year.ToString());
    }

    private static string LoadTemplate(string fileName)
    {
        var resourceName = $"Back.Infrastructure.Templates.{fileName}";
        using var stream = _assembly.GetManifestResourceStream(resourceName)
            ?? throw new InvalidOperationException($"Template de e-mail não encontrado: '{resourceName}'. Verifique se o arquivo está marcado como EmbeddedResource.");
        using var reader = new StreamReader(stream);
        return reader.ReadToEnd();
    }
}
