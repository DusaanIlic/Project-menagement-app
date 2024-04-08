using Microsoft.EntityFrameworkCore;
using Server.Data;

namespace Server.Middlewares;

public class JwtBlacklistMiddleware
{
    private readonly RequestDelegate _next;
    private readonly LogicTenacityDbContext _dbContext;

    public JwtBlacklistMiddleware(RequestDelegate next, LogicTenacityDbContext dbContext)
    {
        _next = next;
        _dbContext = dbContext;
    }

    public async Task Invoke(HttpContext context)
    {
        var token = context.Request.Headers["Authorization"]
            .FirstOrDefault()?.Split(" ").Last();
        
        if (!string.IsNullOrEmpty(token)) {
            var blacklistedToken = await _dbContext.BlacklistedTokens.AnyAsync(t => t.Token == token);

            if (blacklistedToken)
            {
                context.Response.StatusCode = 401;
                return;
            }
        }

        await _next(context);
    }
}