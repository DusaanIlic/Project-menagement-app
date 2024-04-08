using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;

namespace Server.Services.JwtBlacklistService;

public class JwtBlacklistService : IJwtBlacklistService
{
    private readonly LogicTenacityDbContext _dbContext;

    public JwtBlacklistService(LogicTenacityDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<bool> IsTokenBlacklistedAsync(string token)
    {
        if (string.IsNullOrEmpty(token))
        {
            return false;
        }

        return await _dbContext.BlacklistedTokens.AnyAsync(t => t.Token == token);
    }

    public async Task<bool> BlacklistTokenAsync(string token)
    {
        if (string.IsNullOrEmpty(token))
        {
            return false;
        }
        
        if (await IsTokenBlacklistedAsync(token))
        {
            return false;
        }

        var blacklistedToken = new BlacklistedToken { Token = token };
       
        _dbContext.BlacklistedTokens.Add(blacklistedToken);
        await _dbContext.SaveChangesAsync();

        return true;
    }
}