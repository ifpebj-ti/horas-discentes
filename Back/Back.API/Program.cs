using Back.API.Configurations;
using Back.Application;
using Back.Infrastructure;
using Back.Infrastructure.Persistence.Context;
using Back.Infrastructure.Seeders;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Threading;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerConfig();
builder.Services.AddCorsConfig();

// Identity + EF Core Context
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));


builder.Services
    .AddIdentity<IdentityUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// JWT Authentication
var jwtConfig = builder.Configuration.GetSection("Jwt");
var jwtKey = jwtConfig["Key"];
var jwtIssuer = jwtConfig["Issuer"];
var jwtAudience = jwtConfig["Audience"];

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = true;
    options.SaveToken = true;

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey!))
    };
});

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<ApplicationDbContext>();
    var maxRetries = 5;
    var retryCount = 0;
    var delay = TimeSpan.FromSeconds(5);

    while (retryCount < maxRetries)
    {
        try
        {
            // Tenta realizar a migração do banco de dados
            context.Database.Migrate();
            break; // Se a migração for bem-sucedida, sai do loop
        }
        catch (Exception ex)
        {
            retryCount++;
            if (retryCount == maxRetries)
            {
                // Se o número máximo de tentativas for atingido, lança a exceção
                throw new Exception("Erro ao conectar ao banco de dados após várias tentativas.", ex);
            }

            // Aguarda antes de tentar novamente
            Console.WriteLine($"Tentativa {retryCount} de conexão com o banco de dados falhou. Tentando novamente...");
            Thread.Sleep(delay);
        }
    }

    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

    var roles = new[] { "ALUNO", "COORDENADOR", "ADMIN" };

    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
            await roleManager.CreateAsync(new IdentityRole(role));
    }
}

app.UseCors("AllowAll");

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();


app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

//seedando os dados iniciais no banco de dados para Atividades
//using (var scope = app.Services.CreateScope())
//{
//    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

//    //  Substitua esse Guid pelo ID real do curso que voc� j� cadastrou
//    var cursoId = new Guid("c77b9418-8892-41c4-899b-e25d399c088b");

//    await AtividadeSeeder.SeedAsync(db, cursoId);

//    Console.WriteLine("Atividades seedadas com sucesso.");
//}

//para rodar usar (dotnet run --project Back.API -- --seed)
if (args.Contains("--seed"))
{
    await SeedDatabaseAsync(app);
    return;
}
app.Run();
async Task SeedDatabaseAsync(WebApplication app)
{
    using var scope = app.Services.CreateScope();

    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    var roles = new[] { "ALUNO", "COORDENADOR", "ADMIN" };

    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
            await roleManager.CreateAsync(new IdentityRole(role));
    }

    await Back.Infrastructure.Seeders.AdminSeeder.SeedAsync(context, userManager);

    Console.WriteLine("Seed executado com sucesso.");
}