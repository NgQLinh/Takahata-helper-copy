namespace TAKAHATA.Contracts.Authentication
{
    public record LoginResponse(
        string AccessToken,
        string RefreshToken
    );
}
