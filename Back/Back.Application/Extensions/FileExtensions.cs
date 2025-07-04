using Microsoft.AspNetCore.Http;
using System.IO;
using System.Threading.Tasks;

namespace Back.Application.Extensions;

public static class FileExtensions
{
    public static async Task<byte[]> ToByteArrayAsync(this IFormFile file)
    {
        using var ms = new MemoryStream();
        await file.CopyToAsync(ms);
        return ms.ToArray();
    }
}
