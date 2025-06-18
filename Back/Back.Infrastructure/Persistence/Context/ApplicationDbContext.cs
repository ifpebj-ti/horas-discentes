namespace Back.Data;
using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }
    // DbSets para suas entidades
    
    // public DbSet<Entidade> Entidades { get; set; }
}