using Microsoft.AspNetCore.Identity;

namespace TAKAHATA.Domain.User
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; } = string.Empty;
    }
}
