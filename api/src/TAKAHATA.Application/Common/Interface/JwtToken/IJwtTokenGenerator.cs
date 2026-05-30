using TAKAHATA.Domain.User;

namespace TAKAHATA.Application.Common.Interface.JwtToken
{
    public interface IJwtTokenGenerator
    {
        string GenerateAccessToken(ApplicationUser user, IList<string> roles);
        string GenerateRefreshToken();
    }
}
