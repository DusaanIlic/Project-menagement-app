# Upustvo vezano za SQLite

## Instaliranje:
1. Preuzmite paket za instalaciju: Sa zvanične web stranice SQLite preuzmite odgovarajući paket za instalaciju za Vaš operativni sistem.
2. Instalirajte SQLite: Nakon što preuzmete paket, pratite upustva unutar prozora za instalaciju kako biste instalirali SQLite.

## Kreiranje SQLite baze podataka:
1. Pokrenite SQLite CLI: Nakon što uspešno instalirate SQLite, otvorite terminal (na Windowsu CommandPrompt) i pokrenite SQLite CLI naredbom 'sqlite3'.
2. Kreirajte novu bazu podataka: U okviru SQLite CLI, možete kreirati novu bazu podataka komandom 'CREATE DATABASE ime_baze', gde je 'ime_baze' željeni naziv vaše baze podataka.
3. Kreiranje tabela: U okviru baze moguće je kreirati tabele, naredbom 'CREATE TABLE ime_tabele (kolona1 TIP, kolona2 TIP, ...);', gde je 'ime_tabele' željeni naziv date tabele, i okviru koje definišete odgovarajuće kolone i njihove tipove.

## Korišćenje SQLite baze u .NET CORE:
1. Dodavanje potrebnih paketa: U vaš .NET CORE projekat dodajte paket 'Microsoft.EntityFrameworkCore.Sqlite', preko NuGet Package Manager-a.
2. Definisanje modela: Kreirajte klase koje će predstavljati tabele u vašoj bazi podataka. Ove klase će biti modeli koje Entity Framework Core koristi za mapiranje podataka u bazi.
3. Konfiguracija DbContext-a: Kreirajte klasu koja nasleđuje 'DbContext' i definišite svoje DbSet-ove (tabele) i povezivanja sa modelima.
4. Konfiguracija konekcije sa bazom: U 'appsettings.json' fajlu definišite konekcioni string sa vašom SQLite bazom podataka. Primer:
   "ConnectionStrings": { "DefaultConnection": "Data Source=nazivBaze.db"}.
5. Konfiguracija servisa u ConfigureServices metodi: U 'Startup.cs' fajlu konfigurišite DbContext kao servis u metodi 'ConfigureServices'.
