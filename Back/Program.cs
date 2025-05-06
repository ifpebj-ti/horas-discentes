using Back.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Testar conexão com o banco
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    try
    {
        Console.WriteLine("🔄 Testando conexão com o banco de dados...");
        db.Database.OpenConnection();
        db.Database.CloseConnection();
        Console.WriteLine("✅ Conectado ao banco de dados com sucesso!");
    }
    catch (Exception ex)
    {
        Console.WriteLine("❌ Falha ao conectar ao banco de dados:");
        Console.WriteLine(ex.Message);
        Environment.Exit(1); // Finaliza o app com erro
    }
}
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();
app.MapGet("/status", () => Results.Ok("Backend rodando e conectado ao banco!"));
app.Run();
