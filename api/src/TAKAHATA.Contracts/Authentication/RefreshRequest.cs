namespace TAKAHATA.Contracts.Authentication
{
    public record RefreshRequest(string RefreshToken, string AccessToken);
}
