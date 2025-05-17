using Microsoft.EntityFrameworkCore;
using Back.Models;

namespace Back.Data
{
    public static class DbInitializer
    {
        public static void Initialize(ApplicationDbContext context)
        {
            context.Database.Migrate(); // Aplica migrations automaticamente

            if (context.Usuarios.Any()) return; // Já possui dados? Sai

            context.Usuarios.AddRange(
                new Usuario { Nome = "Admin" },
                new Usuario { Nome = "Aluno" }
            );

            context.SaveChanges();
        }
    }
}
