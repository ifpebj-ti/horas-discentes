using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Back.Application.Extensions;

public static class FileExtensions
{
    private const long MaxFileSizeBytes = 5 * 1024 * 1024; // 5MB

    private static readonly string[] AllowedMimeTypes =
    [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png"
    ];

    public static void ValidateAnexo(this IFormFile file)
    {
        if (file.Length > MaxFileSizeBytes)
            throw new ArgumentException("O arquivo excede o tamanho máximo permitido de 5MB.");

        if (!AllowedMimeTypes.Contains(file.ContentType.ToLowerInvariant()))
            throw new ArgumentException("Tipo de arquivo inválido. Apenas PDF, JPG, JPEG ou PNG são aceitos.");
    }

    /// <summary>
    /// Detecta o MIME type e extensão de um arquivo a partir dos seus magic bytes.
    /// Suporta PDF, JPEG e PNG. Retorna application/octet-stream para tipos desconhecidos.
    /// </summary>
    public static (string MimeType, string Extension) DetectMimeType(byte[] data)
    {
        if (data.Length >= 4 && data[0] == 0x25 && data[1] == 0x50 && data[2] == 0x44 && data[3] == 0x46)
            return ("application/pdf", ".pdf");

        if (data.Length >= 3 && data[0] == 0xFF && data[1] == 0xD8 && data[2] == 0xFF)
            return ("image/jpeg", ".jpg");

        if (data.Length >= 8 && data[0] == 0x89 && data[1] == 0x50 && data[2] == 0x4E && data[3] == 0x47
            && data[4] == 0x0D && data[5] == 0x0A && data[6] == 0x1A && data[7] == 0x0A)
            return ("image/png", ".png");

        return ("application/octet-stream", ".bin");
    }

    public static async Task<byte[]> ToByteArrayAsync(this IFormFile file)
    {
        using var ms = new MemoryStream();
        await file.CopyToAsync(ms);
        return ms.ToArray();
    }
}
