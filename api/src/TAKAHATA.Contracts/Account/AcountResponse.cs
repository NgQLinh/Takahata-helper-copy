using TAKAHATA.Domain.User;

namespace TAKAHATA.Contracts.Account
{
    public class AcountResponse
    {
        public AcountResponse(ApplicationUser newUser, IList<string> roles)
        {
            Id = newUser.Id;
            UserName = newUser.UserName ?? string.Empty;
            FullName = newUser.FullName;
            Role = roles.FirstOrDefault() ?? string.Empty;
        }

        public string Id { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }
}
