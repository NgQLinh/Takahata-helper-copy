namespace TAKAHATA.Contracts.Account
{
    public record CreateAccountRequest(string UserName, string Password, string FullName, string Role);
}
