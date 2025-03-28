TestreSzabva
Ez a projekt egy modern, személyre szabott étrend-tervező és egészségügyi monitorozó rendszer, amely segít az egészséges életmód kialakításában.

Nagyon Fontos Információk
Operációs rendszer:

    Windows 10/11 (a WPF alapú Admin Panel kizárólag Windows alatt fut).

Fejlesztési eszközök:

    Frontend: Visual Studio Code, Node.js, npm

    Backend: Visual Studio (ASP.NET Core Web API, .NET 9.0)

Admin Panel: WPF alkalmazás

Technológiák:

  Backend: ASP.NET Core Web API (9.0) csomagokkal, mint például Microsoft.AspNetCore.Authentication.JwtBearer, EntityFrameworkCore stb.

  Frontend: React + TypeScript, modulok: React, React-Router-Dom, React-Lucide, React-Chartjs-2

  Adatbázis: SQLite, normalizált adatmodell

Kapcsolat:

  Hibák, kérdések esetén vedd fel velünk a kapcsolatot a testreszabvaapp@gmail.com címen!

Telepítés és Elindítás
1. A Projekt Letöltése GitHubról
Nyisd meg a parancssort (CMD, Git Bash vagy terminál) és futtasd a következő parancsot:

     git clone https://github.com/szimaakos/TestreSzabva.git
Ezután lépj be a letöltött projekt mappájába.

2. Frontend Indítása
Visual Studio Code megnyitása:
Navigálj a Frontend mappába, majd nyisd meg azt Visual Studio Code-ban. Ehhez jobb klikk a mappára, majd válaszd a „Git Bash megnyitása” opciót, vagy indítsd el a VS Code-t és nyisd meg a mappát.

Node modulok telepítése:
A VS Code Terminaljában futtasd a következő parancsokat:

    npm install
    npm install react-router-dom
Fejlesztői szerver indítása:
Futtasd a parancsot:


    npm run dev
Ez elindítja a szervert, majd a böngésződben a megjelenő linkre kattintva (például http://localhost:5173) érheted el az alkalmazást.

3. Backend Indítása
Visual Studio használata:
Lépj a Backend mappába, majd keresd meg a backend.sln fájlt.

Megoldás megnyitása:
    Nyisd meg a backend.sln fájlt Visual Studio-ban.

Backend szerver elindítása:
A Visual Studio felső menüjében kattints az „HTTP” gombra a backend szerver indításához. Ezzel aktiválódik a regisztráció, bejelentkezés és egyéb felhasználói műveletek kezelése.

4. Admin Panel Indítása
WPF alkalmazás:
Az Admin Panel egy külön WPF alkalmazás, amely csak Windows alatt fut. Nyisd meg a megfelelő projektet Visual Studio-ban, majd indítsd el a WPF alkalmazást a szokásos módon.
