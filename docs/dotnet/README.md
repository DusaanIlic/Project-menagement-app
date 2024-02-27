# Uputstva vezana za dotnet

## Instaliranje

1. U search baru potražite: Visual Studio Installer. Kada pronađete željenu verziju, kliknite na dugme "Modify".
2. Otvoriće se novi prozor u kojem treba da označite "ASP.NET and web development", zatim kliknite "Modify". Nakon nekoliko minuta, bićete preusmereni na početnu stranicu.
3. Konačno, kliknite "Launch" kako biste pokrenuli Visual Studio.

## Kreiranje .NET CORE projekta

1. Nakon pokretanja Visual Studija, izaberite "Create a new Project".
2. U search baru, unesite: ASP.NET CORE Web API.
3. Unesite ime projekta i izaberite folder u kojem će biti smešten.
4. Izaberite verziju .NET framework-a.

## Konekcija sa bazom, modeli i migracije

1. U NuGet Package Manager-u, instalirajte sledeće pakete: Microsoft.EntityFrameworkCore.Sqlite, Microsoft.EntityFrameworkCore, kao i Microsoft.EntityFrameworkCore.Tools.
2. U fajlu appsettings.json postavite konekcionu string: `"ConnectionStrings": { "DefaultConnection": "Data Source=nazivBaze.db"}`.
3. Napravite folder "models" u kojem ćete definisati entitete koji predstavljaju tabele u bazi podataka.
4. Takođe, napravite folder "data" u kojem će se nalaziti fajl koji nasleđuje klasu DbContext. Taj fajl će služiti za komunikaciju sa bazom.
5. Dodajte sledeće linije koda u program.cs:
   ```csharp
   builder.Services.AddDbContext<AppDbContext>(Options =>
   {
       Options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
   });
6. Na kraju, izvršite migraciju, odnosno postavite početnu šemu baze podataka na osnovu definisanih entiteta. U Package Manager Console-u unesite sledeću liniju koda: Add-Migration InitialCreate.