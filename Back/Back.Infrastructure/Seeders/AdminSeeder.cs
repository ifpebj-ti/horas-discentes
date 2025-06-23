using Back.Domain.Entities.Admin;
using Back.Infrastructure.Persistence.Context;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Back.Infrastructure.Seeders;

public class AdminSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context, UserManager<IdentityUser> userManager)
    {
        var email = "erison7596e@gmail.com";
        var senha = "Senha@123";

        // Se já existe, não cria novamente
        var existingUser = await userManager.FindByEmailAsync(email);
        if (existingUser != null) return;

        // Criar IdentityUser
        var identityUser = new IdentityUser
        {
            UserName = email,
            Email = email,
            EmailConfirmed = true
        };

        var result = await userManager.CreateAsync(identityUser, senha);
        if (!result.Succeeded)
        {
            throw new Exception("Erro ao criar usuário admin: " +
                string.Join("; ", result.Errors.Select(e => e.Description)));
        }

        // Adicionar Role
        await userManager.AddToRoleAsync(identityUser, "ADMIN");

        // Criar na tabela Admin (domínio)
        var admin = new AdminBuilder()
            .WithId(Guid.NewGuid())
            .WithEmail(email)
            .WithIdentityUserId(identityUser.Id)
            .Build();

        context.Admins.Add(admin);
        await context.SaveChangesAsync();
    }
}
