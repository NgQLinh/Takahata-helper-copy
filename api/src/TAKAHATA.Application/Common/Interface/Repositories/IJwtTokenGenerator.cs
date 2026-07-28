using System.Security.Claims;
using TAKAHATA.Domain.User;

namespace TAKAHATA.Application.Common.Interface.Repositories
{
    public interface IJwtTokenGenerator
    {
        ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
        string GenerateAccessToken(ApplicationUser user, IList<string> roles);
        string GenerateRefreshToken();
    }
}
