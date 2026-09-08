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
    public class CreateAccountCommandHandler : IRequestHandler<CreateAccountCommand, ErrorOr<AcountResponse>>
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IUserMachinePermissionRepository _userMachinePermissionRepository;

        public CreateAccountCommandHandler(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IUserMachinePermissionRepository userMachinePermissionRepository)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _userMachinePermissionRepository = userMachinePermissionRepository;
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

            if (user.UserName == "admin")
                user.IsDefaultAccount = true;

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


            var userMachinePermissions = new List<UserMachinePermission>();
            if (command.MachineIds != null && command.MachineIds.Count != 0 && roles.Contains(Role.User))
            {
                foreach (var machineId in command.MachineIds)
                {
                    var userMachinePermission = new UserMachinePermission(newUser.Id, machineId);
                    userMachinePermissions.Add(userMachinePermission);
                }
                userMachinePermissions = await _userMachinePermissionRepository.AddRangeAsync(newUser.Id, userMachinePermissions);
            }

            return new AcountResponse(newUser, roles, userMachinePermissions);
        }
    }
}
