using Server.Models;

namespace Server.Services.JwtBlacklistService;

public interface IJwtService
{
    public Task<string> GenerateToken(Member member);
    
    public Task<bool> IsTokenBlacklistedAsync(string token);

    public Task<bool> BlacklistTokenAsync(string token);

    public Task DisableAllUsersTokens(Member member);
    
    public Task DisableAllUsersTokensExceptLatest(Member member);
    
    public Task DisableAllUsersTokensExceptSpecified(Member member, string token);
    
    public Task ClearExpiredTokens();
}