# Uputstva vezana za Angular

## Build-ovanje Angular aplikacije(Linux i Windows)

1.  Neophodno je da instalirate Node.js i npm(Node Package Manager). Možete da ih preuzmete sa zvaničnog sajta Node.js-a.

2.  Kada ste instalirali Angular CLI, možete da kreirate aplikaciju koristeći komandu "ng new ime-aplikacije". Da bi pokrenuli aplikaciju, potrebno je da se komandom "cd ime-aplikacije" navigirate do direktorijuma gde je aplikacija smeštena. Nakon toga izvršite komandu "ng serve" koja Vam omogućava da pokrenete Vašu aplikaciju.

3.  Kada ste završili sa razvojem aplikacije, potrebno je da istu build-ujete koristeći komandu "ng build --prod". Ova komanda će kreirati izlazne fajlove za Vašu aplikaciju koje možete deploy-ovati na neki hosting server.

## Veza između Angular-a i .NET Core-a

1.	Prvo je potrebno kreirati API u .NET Core aplikaciji. Možete koristiti ASP.NET Core Web API ili neki drugi API, ukoliko je potrebno. API će implementirati logiku za obradu HTTP zahteva koji se šalju iz Angular aplikacije.

2.	Importujte “HttpClient” modul iz “@angular/common/http” u Vašu Angular aplikaciju. Nakon toga možete koristiti “HttpClient” modul kako bi slali HTTP zahteve ka Vašem API-ju koji ste implementirali u .NET Core-u.

3.	Definišite kontrolere kako bi omogućili .NET Core API-ju da vrati neke podatke nazad do Angular aplikacije kada se pogodi određenja ruta.

4.	Treba kreirati modele podataka koji se koriste i na frontend(Angular) i na backend(.NET Core) delu.

5.	Ukoliko želite, možete da koristite sigurnosne mehanizme na obe strane Vaše aplikacije kako bi obezbedili da podaci ostanu sigurni. Možete da koristite JWT, Oauth ili neki drugi vid autentikacije.




