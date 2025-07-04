using Microsoft.EntityFrameworkCore;
using Back.Domain.Entities.Curso;
using Back.Domain.Entities.Turma;
using Back.Domain.Entities.Aluno;
using Back.Domain.Entities.Admin;
using Back.Domain.Entities.Coordenador;
using Back.Domain.Entities.Certificado;
using Back.Domain.Entities.Atividade;
using Back.Domain.Entities.LimiteHorasAluno;
using Back.Domain.Entities.Convite;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Back.Domain.Entities.AlunoAtividade;

namespace Back.Infrastructure.Persistence.Context;

public class ApplicationDbContext : IdentityDbContext<IdentityUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    // DbSets para entidades principais
    public DbSet<Curso> Cursos { get; set; }
    public DbSet<Turma> Turmas { get; set; }
    public DbSet<Aluno> Alunos { get; set; }
    public DbSet<Admin> Admins { get; set; }
    public DbSet<Coordenador> Coordenadores { get; set; }
    public DbSet<Certificado> Certificados { get; set; }
    public DbSet<Atividade> Atividades { get; set; }
    public DbSet<LimiteHorasAluno> LimitesHoras { get; set; }
    public DbSet<ConviteCoordenador> Convites { get; set; }
    public DbSet<AlunoAtividade> AlunoAtividades { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Aluno>()
        .HasOne(a => a.Turma)
        .WithMany(t => t.Alunos)
        .HasForeignKey(a => a.TurmaId);

        // Turma -> Curso
        modelBuilder.Entity<Turma>()
            .HasOne(t => t.Curso)
            .WithMany(c => c.Turmas)
            .HasForeignKey(t => t.CursoId);


        // Coordenador -> Curso
        modelBuilder.Entity<Coordenador>()
            .HasOne(c => c.Curso)
            .WithMany(curso => curso.Coordenadores)
            .HasForeignKey(c => c.CursoId);

        // Certificado -> AlunoAtividade
        modelBuilder.Entity<Certificado>()
            .HasOne(c => c.AlunoAtividade)
            .WithMany() // ou WithOne() se for 1:1
            .HasForeignKey(c => c.AlunoAtividadeId);

        modelBuilder.Entity<Certificado>()
            .Property(c => c.Anexo)
            .HasColumnType("bytea");



    }
}
