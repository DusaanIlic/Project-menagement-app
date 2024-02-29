using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using TeamManager.API.Models;

namespace TeamManager.API;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddControllers();
        builder.Services.AddDbContext<TeamManagerContext>(opt =>
            opt.UseInMemoryDatabase("TeamManager"));
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowOrigin",
                builder => builder.WithOrigins("http://localhost:4200"));
        });

        var app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseAuthorization();
        app.UseHttpsRedirection();
        app.UseCors(options => {
            options.WithOrigins("http://localhost:4200").AllowAnyMethod().AllowAnyHeader();
        });
        app.MapControllers();
        
        app.Run();
    }
}