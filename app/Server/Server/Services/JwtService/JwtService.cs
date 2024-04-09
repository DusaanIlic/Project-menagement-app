using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Server.Data;
using Server.Models;

namespace Server.Services.JwtBlacklistService;

public class JwtService : IJwtService
{
    private readonly LogicTenacityDbContext _dbContext;
    private readonly IConfiguration _configuration;

    public JwtService(LogicTenacityDbContext dbContext, IConfiguration configuration)
    {
        _dbContext = dbContext;
        _configuration = configuration;
    }

    public async Task<string> GenerateToken(Member member)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["JwtSettings:Key"]);
        var expiresAt = DateTime.UtcNow.AddDays(7);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.Name, member.Email),
                new Claim(ClaimTypes.Role, member.Role.RoleName),
                new Claim("Id", member.Id.ToString())
            }),
            Expires = expiresAt, // Token expiration time
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            Audience = _configuration["JwtSettings:Audience"],
            Issuer = _configuration["JwtSettings:Issuer"]
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        var tokenString = tokenHandler.WriteToken(token);

        IssuedToken issuedToken = new IssuedToken
        {
            Token = BCrypt.Net.BCrypt.HashString(tokenString),
            ExpiresAt = expiresAt,
            MemberId = member.Id
        };

        _dbContext.IssuedTokens.Add(issuedToken);
        
        await _dbContext.SaveChangesAsync();
        
        return tokenString;
    }

    public async Task<bool> IsTokenBlacklistedAsync(string token)
    {
        if (string.IsNullOrEmpty(token))
        {
            return false;
        }

        var hashedToken = BCrypt.Net.BCrypt.HashString(token);
        var issuedToken = await _dbContext.IssuedTokens.Where(it => it.Token == hashedToken).FirstOrDefaultAsync();

        return issuedToken == null || issuedToken.IsBlacklisted;
    }

    public async Task<bool> BlacklistTokenAsync(string token)
    {
        if (string.IsNullOrEmpty(token))
        {
            return false;
        }
        
        var hashedToken = BCrypt.Net.BCrypt.HashString(token);
        var issuedToken = await _dbContext.IssuedTokens.Where(it => it.Token == hashedToken).FirstOrDefaultAsync();

        if (issuedToken == null)
        {
            return false;
        }

        issuedToken.IsBlacklisted = true;
       
        _dbContext.IssuedTokens.Add(issuedToken);
        await _dbContext.SaveChangesAsync();

        return true;
    }

    public async Task DisableAllUsersTokens(Member member)
    {
        var memberTokens = await _dbContext.IssuedTokens.Where(it => it.MemberId == member.Id).ToListAsync();
    
        foreach (var token in memberTokens)
        {
            token.IsBlacklisted = true;
        }

        await _dbContext.SaveChangesAsync();
    }

    public async Task DisableAllUsersTokensExceptLatest(Member member)
    {
        var memberTokens = await _dbContext.IssuedTokens
            .Where(it => it.MemberId == member.Id)
            .OrderByDescending(it => it.ExpiresAt)
            .ToListAsync();

        if (memberTokens.Count > 1)
        {
            for (var i = 1; i < memberTokens.Count; i++)
            {
                memberTokens[i].IsBlacklisted = true;
            }

            await _dbContext.SaveChangesAsync();
        }
    }

    public async Task DisableAllUsersTokensExceptSpecified(Member member, string token)
    {
        if (string.IsNullOrEmpty(token))
        {
            return;
        }

        var hashedToken = BCrypt.Net.BCrypt.HashString(token);
        
        var memberTokens = await _dbContext.IssuedTokens
            .Where(it => it.MemberId == member.Id && it.Token != token)
            .ToListAsync();

        foreach (var tokenToDisable in memberTokens)
        {
            tokenToDisable.IsBlacklisted = true;
        }

        await _dbContext.SaveChangesAsync();
    }

    public async Task ClearExpiredTokens()
    {
        var expiredTokens = await _dbContext.IssuedTokens
            .Where(t => t.ExpiresAt <= DateTime.UtcNow)
            .ToListAsync();

        _dbContext.IssuedTokens.RemoveRange(expiredTokens);
        await _dbContext.SaveChangesAsync();
    }
}