namespace Back.Domain.Entities.Admin;

public class AdminBuilder
{
    private readonly Admin _admin = new();

    public AdminBuilder WithId(Guid id)
    {
        _admin.Id = id;
        return this;
    }

    public AdminBuilder WithEmail(string email)
    {
        _admin.Email = email;
        return this;
    }

    public AdminBuilder WithSenha(string senha)
    {
        _admin.Senha = senha;
        return this;
    }

    public Admin Build() => _admin;
}
