using ErrorOr;
using MediatR;
using Microsoft.AspNetCore.Identity;
using TAKAHATA.Application.Common.Interface.Repositories;
using TAKAHATA.Contracts.Authentication;
using TAKAHATA.Domain.Common.Errors;
using TAKAHATA.Domain.User;

namespace TAKAHATA.Application.Authentication.Commands
{
    public class LoginCommandHandler
        : IRequestHandler<LoginCommand, ErrorOr<LoginResponse>>
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;

        public LoginCommandHandler(
            UserManager<ApplicationUser> userManager,
            IJwtTokenGenerator jwtTokenGenerator)
        {
            _userManager = userManager;
            _jwtTokenGenerator = jwtTokenGenerator;
        }

        public async Task<ErrorOr<LoginResponse>> Handle(
            LoginCommand command,
            CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByNameAsync(command.UserName);

            if (user is null)
                return Errors.Account.InvalidCredentials;

            var isPasswordValid = await _userManager.CheckPasswordAsync(
                user,
                command.Password);

            if (!isPasswordValid)
                return Errors.Account.InvalidCredentials;

            var roles = await _userManager.GetRolesAsync(user);

            var accessToken = _jwtTokenGenerator.GenerateAccessToken(user, roles);
            var refreshToken = _jwtTokenGenerator.GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.Now.AddDays(7);

            await _userManager.UpdateAsync(user);

            return new LoginResponse(
                accessToken,
                refreshToken,
                roles != null ? [.. roles] : []);
        }
    }
}
