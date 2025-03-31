TestreSzabva
A TestreSzabva projekt célja, hogy megkönnyítse az egészséges és fenntartható életmód kialakítását azok számára, akik tudatosan szeretnék követni étrendjüket. A rendszer heti bontású étkezési tervezést, személyre szabott étrendi ajánlásokat és részletes önellenőrzést kínál, így segítve a felhasználókat céljaik elérésében.

Fontos Információk
Operációs rendszer:

Windows 10/11 (a WPF alapú Admin Panel kizárólag Windows alatt fut)

A rendszer Linuxon is futtatható, amennyiben kompatibilis környezetet biztosítanak.

Fejlesztési eszközök:

Frontend: Visual Studio Code, Node.js, npm

Backend: Visual Studio (ASP.NET Core Web API, .NET 9.0)

Admin Panel: WPF alkalmazás

Technológiák:

Backend: ASP.NET Core Web API (9.0) – használva többek között a Microsoft.AspNetCore.Authentication.JwtBearer, EntityFrameworkCore stb. csomagokat

Frontend: React + TypeScript (React, React-Router-Dom, React-Lucide, React-Chartjs-2 modulok)

Adatbázis: SQLite, normalizált adatmodell

Kapcsolat:
Hibák, kérdések esetén kérjük, vedd fel velünk a kapcsolatot a testreszabvaapp@gmail.com címen!

Dokumentáció
A teljes projekt dokumentációja elérhető a repoban található dokumentacio mappán belül a testreszabva.pdf fájlban. Itt megtalálható a fejlesztői dokumentáció, az adatmodell, a tesztelési leírás, valamint további részletek a rendszer működéséről és bővítési lehetőségeiről.

Forráskód
A projekt forráskódja a repóban érhető el az alábbi mappákban:

frontend – a kliensoldali alkalmazás React és TypeScript alapokon

backend – ASP.NET Core Web API a szerveroldali logikához

wpf – Windowsos Admin Panel (WPF alkalmazás)

demo_data – demo adatok, amelyek előre betöltött ételeket tartalmaznak

Előkészületek a Kipróbáláshoz
A projekt demo adatai már be vannak töltve, így a rendszer kipróbálható a betöltött tesztadatokkal. Ha szükséges, az admin felületen lehetőség van a demo adatok módosítására, törlésére, illetve új adatok bulk importálására.

Telepítés és Elindítás
1. A projekt letöltése GitHubról
Nyisd meg a parancssort (CMD, Git Bash vagy terminál) és futtasd a következő parancsot:

bash
Másolás
git clone https://github.com/szimaakos/TestreSzabva.git
Ezután lépj be a letöltött projekt mappájába.

2. Frontend Indítása
Visual Studio Code használatával:

Navigálj a frontend mappába, majd nyisd meg azt Visual Studio Code-ban (jobb klikk a mappára és válaszd a „Git Bash megnyitása”, vagy indítsd el közvetlenül a VS Code-t).

Node modulok telepítése:

A VS Code Terminaljában futtasd az alábbi parancsokat:

bash
Másolás
npm install
npm install react-router-dom
Fejlesztői szerver indítása:

Indítsd el a szervert az alábbi paranccsal:

bash
Másolás
npm run dev
Ezután a böngésződben a megjelenő linkre (pl. http://localhost:5173) kattintva érheted el az alkalmazást.

3. Backend Indítása
Visual Studio használata:

Navigálj a backend mappába, majd keresd meg a backend.sln (solution) fájlt.

Nyisd meg a backend.sln fájlt Visual Studio-ban.

A Visual Studio felső menüjében kattints az „HTTP” gombra a backend szerver elindításához. Ezzel aktiválódik a regisztráció, bejelentkezés és egyéb felhasználói műveletek kezelése.

4. Admin Panel Indítása
WPF alkalmazás (csak Windows alatt):

Nyisd meg a wpf mappában található projektet Visual Studio-ban.

Indítsd el a WPF alkalmazást a megszokott módon.

Tesztadatok
A projektben már be vannak töltve a demo adatok, melyek előre beállított ételeket tartalmaznak.

A rendszer kipróbálható ezekkel az adatokkal; további funkciók elérése esetén a szoftver az előre betöltött tesztadatokkal is működik.

Ha szükséges, az admin felületen lehetőség van az adatok módosítására, törlésére, illetve új adatok importálására.

Unit Tesztek
A unit tesztek részletes dokumentációja szintén elérhető a testreszabva.pdf fájlban, a fejlesztői dokumentáció részben. Ezek biztosítják a kód megbízhatóságát és a funkcionális követelmények teljesítését.

Összegzés
A TestreSzabva projekt egy komplex rendszer, amely az egészséges életmód támogatását célozza meg heti bontású étkezési tervezéssel, személyre szabott ajánlásokkal és részletes önellenőrzéssel. A rendszer modern technológiákat alkalmaz, és könnyen testreszabható, karbantartható megoldást kínál a felhasználók számára.

Bármilyen kérdés vagy probléma esetén kérjük, vedd fel velünk a kapcsolatot a testreszabvaapp@gmail.com címen!
