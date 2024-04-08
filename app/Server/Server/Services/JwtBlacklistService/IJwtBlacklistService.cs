namespace Server.Services.JwtBlacklistService;

public interface IJwtBlacklistService
{
    public Task<bool> IsTokenBlacklistedAsync(string token);

    public Task<bool> BlacklistTokenAsync(string token);
}