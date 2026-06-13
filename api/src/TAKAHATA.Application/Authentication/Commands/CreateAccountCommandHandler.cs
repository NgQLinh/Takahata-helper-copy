using ErrorOr;
using MediatR;
using Microsoft.AspNetCore.Identity;
using TAKAHATA.Contracts.Authentication;
using TAKAHATA.Domain.Common.Errors;
using TAKAHATA.Domain.User;

namespace TAKAHATA.Application.Authentication.Commands
{
    public class CreateAccountCommandHandler : IRequestHandler<CreateAccountCommand, ErrorOr<AcountResponse>>
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public CreateAccountCommandHandler(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task<ErrorOr<AcountResponse>> Handle(CreateAccountCommand command, CancellationToken cancellationToken)
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

            var newUser = await _userManager.FindByNameAsync(command.UserName);

            if (newUser is null)
                return Errors.Account.CreateAccountFalse;

            var roles = await _userManager.GetRolesAsync(newUser);

            return new AcountResponse(newUser, roles);
        }
    }
}
