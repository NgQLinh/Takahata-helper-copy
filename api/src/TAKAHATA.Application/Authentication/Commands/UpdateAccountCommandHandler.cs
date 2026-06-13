using ErrorOr;
using MediatR;
using Microsoft.AspNetCore.Identity;
using TAKAHATA.Contracts.Authentication;
using TAKAHATA.Domain.Common.Errors;
using TAKAHATA.Domain.User;

namespace TAKAHATA.Application.Authentication.Commands
{
    public class UpdateAccountCommandHandler : IRequestHandler<UpdateAccountCommand, ErrorOr<AcountResponse>>
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public UpdateAccountCommandHandler(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task<ErrorOr<AcountResponse>> Handle(
           UpdateAccountCommand command,
           CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByIdAsync(command.Id);
            if (user is null)
                return Errors.Account.NotFound;

            var roleExists = await _roleManager.RoleExistsAsync(command.Role);
            if (!roleExists)
                await _roleManager.CreateAsync(new IdentityRole(command.Role));

            user.UserName = command.UserName;
            user.Email = command.UserName;
            user.FullName = command.FullName;

            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
            {
                return updateResult.Errors
                    .Select(error => Error.Validation(
                        code: error.Code,
                        description: error.Description))
                    .ToList();
            }

            if (!string.IsNullOrWhiteSpace(command.Password))
            {
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);

                var passwordResult = await _userManager.ResetPasswordAsync(
                    user,
                    token,
                    command.Password);

                if (!passwordResult.Succeeded)
                {
                    return passwordResult.Errors
                        .Select(error => Error.Validation(
                            code: error.Code,
                            description: error.Description))
                        .ToList();
                }
            }

            var currentRoles = await _userManager.GetRolesAsync(user);

            if (currentRoles.Any())
            {
                var removeRoleResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);

                if (!removeRoleResult.Succeeded)
                {
                    return removeRoleResult.Errors
                        .Select(error => Error.Validation(
                            code: error.Code,
                            description: error.Description))
                        .ToList();
                }
            }

            var addRoleResult = await _userManager.AddToRoleAsync(user, command.Role);

            if (!addRoleResult.Succeeded)
            {
                return addRoleResult.Errors
                    .Select(error => Error.Validation(
                        code: error.Code,
                        description: error.Description))
                    .ToList();
            }

            var roles = await _userManager.GetRolesAsync(user);

            return new AcountResponse(user, roles);
        }
    }
}
