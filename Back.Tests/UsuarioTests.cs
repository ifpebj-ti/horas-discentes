using Xunit;
using Back.Models;

namespace Back.Tests;

public class UsuarioTests
{
    [Fact]
    public void Usuario_Deve_Ser_Criado_Com_Nome()
    {
        // Arrange
        var usuario = new Usuario { Nome = "Admin" };

        // Act & Assert
        Assert.Equal("Admin", usuario.Nome);
    }
}
