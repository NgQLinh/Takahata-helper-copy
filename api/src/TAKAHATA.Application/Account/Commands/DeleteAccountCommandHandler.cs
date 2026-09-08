using ErrorOr;
using MediatR;
using Microsoft.AspNetCore.Identity;
using TAKAHATA.Application.Common.Interface.Repositories;
using TAKAHATA.Contracts.Account;
using TAKAHATA.Domain.Common.Errors;
using TAKAHATA.Domain.User;

namespace TAKAHATA.Application.Account.Commands
{
    public class DeleteAccountCommandHandler : IRequestHandler<DeleteAccountCommand, ErrorOr<AcountResponse>>
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IUserMachinePermissionRepository _userMachinePermissionRepository;

        public DeleteAccountCommandHandler(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IUserMachinePermissionRepository userMachinePermissionRepository)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _userMachinePermissionRepository = userMachinePermissionRepository;
        }

        public async Task<ErrorOr<AcountResponse>> Handle(
             DeleteAccountCommand command,
             CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByIdAsync(command.Id);

            if (user is null)
                return Errors.Account.NotFound;

            if(user.IsDefaultAccount)
                return Errors.Account.NotFound;

            var roles = await _userManager.GetRolesAsync(user);

            var result = await _userManager.DeleteAsync(user);


            if (!result.Succeeded)
                return Errors.Account.DeleteAccountFalse;

            await _userMachinePermissionRepository.DeleteRangeAsync(user.Id);

            return new AcountResponse(user, roles, []);
        }
    }
}
