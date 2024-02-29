using Pets.Api.Data;
using Pets.Api.Endpoints;

var builder = WebApplication.CreateBuilder(args);

var connString = builder.Configuration.GetConnectionString("PetsDb");
builder.Services.AddSqlite<PetsContext>(connString);

builder.Services.AddCors(options =>
{
    options.AddPolicy("corspolicy", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

var app = builder.Build();
app.UseCors("corspolicy");


app.MapPetsEndpoints();
app.MapAnimalEndpoints();

await app.MigrateDbAsync();

app.Run();
