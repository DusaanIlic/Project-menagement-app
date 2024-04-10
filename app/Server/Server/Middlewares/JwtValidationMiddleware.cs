using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Server.Data;

namespace Server.Middlewares;

public class JwtBlacklistMiddleware
{
    private readonly RequestDelegate _next;

    public JwtBlacklistMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context, LogicTenacityDbContext dbContext)
    {
        // var token = context.Request.Headers["Authorization"]
        //     .FirstOrDefault()?.Split(" ").Last();
        //
        // if (!string.IsNullOrEmpty(token)) {
        //     try
        //     {
        //         var tokenHandler = new JwtSecurityTokenHandler();
        //         var jwtToken = tokenHandler.ReadJwtToken(token);
        //
        //         // Extract claims from the token payload
        //         var claims = jwtToken.Claims;
        //
        //         var emailClaim = claims.FirstOrDefault(c => c.Type == "Email");
        //         var roleClaim = claims.FirstOrDefault(c => c.Type == "RoleId");
        //         var idClaim = claims.FirstOrDefault(c => c.Type == "Id");
        //
        //         if (emailClaim == null || roleClaim == null || idClaim == null)
        //         {
        //             Console.WriteLine("JWT MIDDLEWARE ERROR: CLAIMS MISSING");
        //             context.Response.StatusCode = 401;
        //             return;
        //         }
        //
        //         var memberId = int.Parse(idClaim.Value);
        //         var member = await dbContext.Members.FirstOrDefaultAsync(m => memberId == m.Id);
        //
        //         if (member == null || member.Email != emailClaim.Value || member.RoleId != int.Parse(roleClaim.Value))
        //         {
        //             Console.WriteLine("JWT MIDDLEWARE ERROR: CLAIMS MISS-MATCH");
        //             context.Response.StatusCode = 401;
        //             return;
        //         }
        //     }
        //     catch (Exception ex)
        //     {
        //         Console.WriteLine($"JWT MIDDLEWARE ERROR: {ex.Message}");
        //         context.Response.StatusCode = 401;
        //         return;
        //     }
        // }

        await _next(context);
    }
}