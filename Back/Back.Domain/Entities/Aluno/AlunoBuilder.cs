namespace Back.Domain.Entities.Aluno;

public class AlunoBuilder
{
    private readonly Aluno _aluno = new();

    public AlunoBuilder()
    {
        _aluno.JaBaixadoHoras = false;
    }

    public AlunoBuilder WithId(Guid id)
    {
        _aluno.Id = id;
        return this;
    }

    public AlunoBuilder WithNome(string nome)
    {
        _aluno.Nome = nome;
        return this;
    }

    public AlunoBuilder WithEmail(string email)
    {
        _aluno.Email = email;
        return this;
    }

    public AlunoBuilder WithMatricula(string matricula)
    {
        _aluno.Matricula = matricula;
        return this;
    }

    public AlunoBuilder WithTurmaId(Guid turmaId)
    {
        _aluno.TurmaId = turmaId;
        return this;
    }

    public AlunoBuilder WithIdentityUserId(string identityUserId)
    {
        _aluno.IdentityUserId = identityUserId;
        return this;
    }

    public Aluno Build() => _aluno;
}
