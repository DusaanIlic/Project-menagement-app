using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Services.JwtBlacklistService;

namespace Server.Middlewares;

public class JwtBlacklistMiddleware
{
    private readonly RequestDelegate _next;

    public JwtBlacklistMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context, IJwtBlacklistService jwtBlacklistService)
    {
        var token = context.Request.Headers["Authorization"]
            .FirstOrDefault()?.Split(" ").Last();
        
        if (!string.IsNullOrEmpty(token)) {
            if (await jwtBlacklistService.IsTokenBlacklistedAsync(token))
            {
                context.Response.StatusCode = 401;
                return;
            }
        }

        await _next(context);
    }
}