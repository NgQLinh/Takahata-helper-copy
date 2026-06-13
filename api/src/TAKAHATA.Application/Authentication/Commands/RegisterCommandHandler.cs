using ErrorOr;
using MediatR;
using Microsoft.AspNetCore.Identity;
using TAKAHATA.Contracts.Authentication;
using TAKAHATA.Domain.Common.Constant;
using TAKAHATA.Domain.Common.Errors;
using TAKAHATA.Domain.User;

namespace TAKAHATA.Application.Authentication.Commands
{
    public class RegisterCommandHandler : IRequestHandler<RegisterCommand, ErrorOr<RegisterResponse>>
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public RegisterCommandHandler(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task<ErrorOr<RegisterResponse>> Handle(RegisterCommand command, CancellationToken cancellationToken)
        {
            var existingUser =
                await _userManager.FindByNameAsync(command.UserName);

            if (existingUser != null)
                return Errors.Account.DuplicateUserName;

            var user = new ApplicationUser
            {
                UserName = command.UserName,
                Email = command.UserName,
                FullName = command.FullName,
            };

            var result = await _userManager.CreateAsync(
                user,
                command.Password);

            if (!result.Succeeded)
                return Errors.Account.CreateAccountFalse;

            if (!await _roleManager.RoleExistsAsync(command.Role))
                await _roleManager.CreateAsync(new IdentityRole(command.Role));

            await _userManager.AddToRoleAsync(user, command.Role);

            return new RegisterResponse();
        }
    }
}
