using Back.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// DbContext com PostgreSQL
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// CORS liberado (dev)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// ✅ Retry para conexão + migrations + seed
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var retries = 10;

    while (retries > 0)
    {
        try
        {
            Console.WriteLine("🔄 Testando conexão com o banco de dados...");
            db.Database.OpenConnection();
            db.Database.CloseConnection();
            Console.WriteLine("✅ Conectado ao banco de dados com sucesso!");

            Console.WriteLine("📦 Aplicando migrations e executando seed...");
            DbInitializer.Initialize(db);
            Console.WriteLine("✅ Migrations e seed executados com sucesso!");
            break;
        }
        catch (Exception ex)
        {
            Console.WriteLine("❌ Falha ao conectar ou inicializar o banco:");
            Console.WriteLine(ex.Message);
            retries--;
            Thread.Sleep(5000); // espera 5 segundos
        }
    }

    if (retries == 0)
    {
        Console.WriteLine("❌ Não foi possível conectar ao banco após várias tentativas. Finalizando aplicação.");
        Environment.Exit(1);
    }
}

// CORS
app.UseCors("AllowAll");

// Swagger apenas em dev
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
