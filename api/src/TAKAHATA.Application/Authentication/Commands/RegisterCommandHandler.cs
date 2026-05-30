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

        public async Task<ErrorOr<RegisterResponse>> Handle(RegisterCommand request, CancellationToken cancellationToken)
        {
            var existingUser =
                await _userManager.FindByEmailAsync(request.Email);

            if (existingUser != null)
                return Errors.Account.DuplicateEmployeeId;

            var user = new ApplicationUser
            {
                UserName = request.Email,
                Email = request.Email,
                FullName = request.FullName,
            };

            var result = await _userManager.CreateAsync(
                user,
                request.Password);

            if (!result.Succeeded)
                return Errors.Account.CreateAccountFalse;

            if (!await _roleManager.RoleExistsAsync(Role.Admin))
                await _roleManager.CreateAsync(new IdentityRole(Role.Admin));

            await _userManager.AddToRoleAsync(user, Role.Admin);

            return new RegisterResponse();
        }
    }
}
