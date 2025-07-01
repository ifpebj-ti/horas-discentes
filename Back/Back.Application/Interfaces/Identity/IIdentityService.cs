using System.Threading.Tasks;

namespace Back.Application.Interfaces.Identity;

public interface IIdentityService
{
    Task<(bool Success, string UserId, string[] Errors)> CreateUserAsync(string email, string password, string role);
}
