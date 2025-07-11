using Back.Application.DTOs.Auth;
using Back.Application.Interfaces.Identity;
using Back.Domain.Entities.Admin;
using Back.Domain.Entities.Aluno;
using Back.Domain.Entities.Coordenador;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Back.Infrastructure.Identity;

public class AuthService : IAuthService
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly IConfiguration _config;
    private readonly DbContext _context; // seu contexto que inclui Aluno, Coordenador, Admin

    public AuthService(
        UserManager<IdentityUser> userManager,
        IConfiguration config,
        DbContext context)
    {
        _userManager = userManager;
        _config = config;
        _context = context;
    }

    public async Task<LoginResponseDto> LoginAsync(LoginRequestDto dto)
    {
        var identityUser = await _userManager.FindByEmailAsync(dto.Email);
        if (identityUser == null || !await _userManager.CheckPasswordAsync(identityUser, dto.Senha))
            throw new UnauthorizedAccessException("Email ou senha inválidos.");

        var roles = await _userManager.GetRolesAsync(identityUser);
        var role = roles.FirstOrDefault();
        if (string.IsNullOrWhiteSpace(role))
            throw new UnauthorizedAccessException("Usuário não possui perfil vinculado.");

        // Buscar o nome real conforme a role
        string nome;
        switch (role.ToUpper())
        {
            case "ALUNO":
                var aluno = await _context.Set<Aluno>()
                    .AsNoTracking()
                    .FirstOrDefaultAsync(a => a.IdentityUserId == identityUser.Id);
                nome = aluno?.Nome ?? throw new UnauthorizedAccessException("Aluno não encontrado.");
                break;

            case "COORDENADOR":
                var coordenador = await _context.Set<Coordenador>()
                    .AsNoTracking()
                    .FirstOrDefaultAsync(c => c.IdentityUserId == identityUser.Id);
                nome = coordenador?.Nome ?? throw new UnauthorizedAccessException("Coordenador não encontrado.");
                break;

            case "ADMIN":
                var admin = await _context.Set<Admin>()
                    .AsNoTracking()
                    .FirstOrDefaultAsync(a => a.IdentityUserId == identityUser.Id);
                nome = admin?.Email ?? throw new UnauthorizedAccessException("Admin não encontrado.");
                break;

            default:
                throw new UnauthorizedAccessException("Perfil inválido.");
        }

        var token = GenerateJwtToken(identityUser, role);

        return new LoginResponseDto(
            Nome: nome,
            Email: identityUser.Email!,
            Role: role,
            Token: token
        );
    }

    private string GenerateJwtToken(IdentityUser user, string role)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Email, user.Email!),
            new Claim(ClaimTypes.Role, role)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(4),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
