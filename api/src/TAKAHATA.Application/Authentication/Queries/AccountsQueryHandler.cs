using ErrorOr;
using MediatR;
using Microsoft.AspNetCore.Identity;
using TAKAHATA.Contracts.Authentication;
using TAKAHATA.Domain.User;

namespace TAKAHATA.Application.Authentication.Queries
{
    public class AccountsQueryHandler : IRequestHandler<AccountsQuery, ErrorOr<IEnumerable<AcountResponse>>>
    {
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<ApplicationUser> _userManager;

        public AccountsQueryHandler(RoleManager<IdentityRole> roleManager, UserManager<ApplicationUser> userManager)
        {
            _roleManager = roleManager;
            _userManager = userManager;
        }


        public async Task<ErrorOr<IEnumerable<AcountResponse>>> Handle(
            AccountsQuery request,
            CancellationToken cancellationToken)
        {
            var users = _userManager.Users.ToList();

            var accounts = new List<AcountResponse>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);

                accounts.Add(new AcountResponse(user, roles));
            }

            return accounts;
        }
    }
}
