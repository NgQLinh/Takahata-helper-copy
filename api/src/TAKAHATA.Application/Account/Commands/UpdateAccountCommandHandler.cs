using ErrorOr;
using MediatR;
using Microsoft.AspNetCore.Identity;
using TAKAHATA.Application.Common.Interface.Repositories;
using TAKAHATA.Contracts.Account;
using TAKAHATA.Domain.Common.Constant;
using TAKAHATA.Domain.Common.Errors;
using TAKAHATA.Domain.User;

namespace TAKAHATA.Application.Account.Commands
{
    public class UpdateAccountCommandHandler : IRequestHandler<UpdateAccountCommand, ErrorOr<AcountResponse>>
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IUserMachinePermissionRepository _userMachinePermissionRepository;

        public UpdateAccountCommandHandler(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IUserMachinePermissionRepository userMachinePermissionRepository)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _userMachinePermissionRepository = userMachinePermissionRepository;
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

            var userMachinePermissions = new List<UserMachinePermission>();
            if (command.MachineIds != null && command.MachineIds.Count != 0 && roles.Contains(Role.User))
            {
                foreach (var machineId in command.MachineIds)
                {
                    var userMachinePermission = new UserMachinePermission(user.Id, machineId);
                    userMachinePermissions.Add(userMachinePermission);
                }
                userMachinePermissions = await _userMachinePermissionRepository.AddRangeAsync(user.Id, userMachinePermissions);
            }

            return new AcountResponse(user, roles, userMachinePermissions);
        }
    }
}
