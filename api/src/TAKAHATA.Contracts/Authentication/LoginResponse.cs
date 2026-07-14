namespace TAKAHATA.Contracts.Authentication
{
    public record LoginResponse(
        string AccessToken,
        string RefreshToken,
        List<string> Roles
    );
}
