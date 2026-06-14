using ErrorOr;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using TAKAHATA.Application.Common.Interface.JwtToken;
using TAKAHATA.Contracts.Authentication;
using TAKAHATA.Domain.Common.Errors;
using TAKAHATA.Domain.User;

namespace TAKAHATA.Application.Authentication.Commands
{
    public class RefreshCommandHandler : IRequestHandler<RefreshCommand, ErrorOr<LoginResponse>>
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;

        public RefreshCommandHandler(
            UserManager<ApplicationUser> userManager,
            IJwtTokenGenerator jwtTokenGenerator)
        {
            _userManager = userManager;
            _jwtTokenGenerator = jwtTokenGenerator;
        }

        public async Task<ErrorOr<LoginResponse>> Handle(RefreshCommand command, CancellationToken cancellationToken)
        {
            var principal = _jwtTokenGenerator.GetPrincipalFromExpiredToken(command.AccessToken);
            if (principal is null)
                return Errors.Account.InvalidCredentials;

            var userId = principal.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Errors.Account.InvalidCredentials;

            if (string.IsNullOrWhiteSpace(userId))
                return Errors.Account.InvalidCredentials;

            var user = await _userManager.FindByIdAsync(userId);

            if (user is null)
                return Errors.Account.InvalidCredentials;

            if (user.RefreshToken != command.RefreshToken)
                return Errors.Account.InvalidCredentials;

            if (user.RefreshTokenExpiryTime <= DateTime.Now)
                return Errors.Account.InvalidCredentials;

            var roles = await _userManager.GetRolesAsync(user);

            var newAccessToken = _jwtTokenGenerator.GenerateAccessToken(user, roles);
            var newRefreshToken = _jwtTokenGenerator.GenerateRefreshToken();

            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiryTime = DateTime.Now.AddDays(7);

            var updateResult = await _userManager.UpdateAsync(user);

            if (!updateResult.Succeeded)
                return Errors.Account.InvalidCredentials;

            return new LoginResponse(
                newAccessToken,
                newRefreshToken);
        }
    }
}
