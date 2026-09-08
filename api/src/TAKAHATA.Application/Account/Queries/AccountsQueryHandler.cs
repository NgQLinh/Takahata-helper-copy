using ErrorOr;
using MediatR;
using Microsoft.AspNetCore.Identity;
using TAKAHATA.Application.Common.Interface.Repositories;
using TAKAHATA.Contracts.Account;
using TAKAHATA.Domain.User;

namespace TAKAHATA.Application.Account.Queries
{
    public class AccountsQueryHandler : IRequestHandler<AccountsQuery, ErrorOr<IEnumerable<AcountResponse>>>
    {
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IUserMachinePermissionRepository _userMachinePermissionRepository;
        private readonly IMachineRepository _machineRepository;

        public AccountsQueryHandler(
            RoleManager<IdentityRole> roleManager,
            UserManager<ApplicationUser> userManager,
            IUserMachinePermissionRepository userMachinePermissionRepository,
            IMachineRepository machineRepository)
        {
            _roleManager = roleManager;
            _userManager = userManager;
            _userMachinePermissionRepository = userMachinePermissionRepository;
            _machineRepository = machineRepository;
        }


        public async Task<ErrorOr<IEnumerable<AcountResponse>>> Handle(
            AccountsQuery request,
            CancellationToken cancellationToken)
        {
            var users = _userManager.Users.ToList();

            var accounts = new List<AcountResponse>();

            var userIds = users.Select(x => x.Id).ToList();
            var userMachinePermissions = await _userMachinePermissionRepository.GetByUserIdsAsync(userIds);
            var machines = await _machineRepository.GetAsync();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);

                var userPermissions = userMachinePermissions.Where(p => p.UserId == user.Id).ToList();

                var machineIds = userPermissions.Select(x => x.MachineId);

                var mcs = machines.Where(m => machineIds.Contains(m.Id)).ToList();

                accounts.Add(new AcountResponse(user, roles, userPermissions)
                {
                    Machines = mcs
                });
            }

            return accounts;
        }
    }
}
