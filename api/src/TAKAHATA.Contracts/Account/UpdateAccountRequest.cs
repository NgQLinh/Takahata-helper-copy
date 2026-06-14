namespace TAKAHATA.Contracts.Account
{
    public record UpdateAccountRequest(string Id, string UserName, string Password, string FullName, string Role);
}
