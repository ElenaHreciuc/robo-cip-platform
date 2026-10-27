# Robo-Cip – Platformă educațională STEAM

Robo-Cip este o platformă educațională interactivă cu patru module: Algoritmi și Emoții, Hărți și Sateliți, Orașe și Poduri 3D, Sunete și Animații.

**Autor și titular al proiectului:** Elena M. Hreciuc.

## Codul aplicației
Aplicația completă trebuie încărcată în rădăcina acestui repository din arhiva **Robo-Cip_copie_separata_GitHub_Railway.zip**: extrageți arhiva, intrați în directorul `robo-cip-app` și încărcați **conținutul** directorului, nu arhiva ZIP și nici directorul exterior.

La rădăcina repository-ului trebuie să fie `package.json`, `package-lock.json`, `public/` și `src/`.

## Rulare locală
```bash
npm ci
npm start
```

## Railway
Se folosește un proiect Railway separat, conectat la acest repository, ramura `main`. Build: `npm ci`; start: `npm start`. Serverul folosește portul furnizat de platformă prin `process.env.PORT` (de verificat în aplicație înainte de deploy).

**Notă de audit:** o parte dintre misiuni sunt încă marcate ca indisponibile; nu trebuie prezentate drept lecții finalizate. Progresul se salvează local în browser, nu într-un cont centralizat. Nu introduceți date personale ale elevilor în mediul public până la verificarea fluxurilor de confidențialitate.

## Prototipul Robo Mentor 3D

Demonstrația este disponibilă la `/robo-mentor-demo.html`. Mentorul nu este inserat automat în activitățile existente. Modelul decorativ rămâne static; explicațiile și indiciile funcționează și fără WebGL2, model sau voce.

`robo-voice.js` coordonează vocile mentorului, paginii de start, Clinicii de mesaje și Constructorului de povești. Oprirea unei componente afectează numai explicația pe care o deține. Vârsta mentorului urmărește selecția curentă a activității, inclusiv când URL-ul conține valoarea inițială.

Demonstrația și aliasul său `/resources/robo-mentor-demo.html` primesc CSP explicit. Biblioteca model-viewer 4.1.0 este fixată prin URL și SRI SHA-384, cu CORS anonim și fără trimiterea refererului. CSP permite compilarea WebAssembly folosită de bibliotecă prin `wasm-unsafe-eval`, fără a permite evaluarea arbitrară JavaScript. La schimbarea bibliotecii trebuie actualizate împreună URL-ul, hashul SRI și CSP.

## Verificări automate

```bash
npm ci
npm test
npx playwright install chromium --only-shell
npm run test:mentor:browser
```

Testele Node verifică progresul, portofoliile și proprietatea redării vocale. Testele browser verifică modelul original, SRI/CSP, ecrane portret și peisaj, tastatura, erorile 3D, accesul blocat la stocare și vocile simulate. Pentru un browser deja instalat se poate seta `ROBO_TEST_BROWSER`; pentru rulare cu o copie locală, nemodificată, a bibliotecii CDN se poate seta `ROBO_TEST_MODEL_VIEWER`.

Serverul de test pornește fără credențiale de bază de date sau e-mail. Testele în Chromium și vocile simulate trebuie completate prin verificări manuale pe dispozitive Android și iOS pentru redarea audio și randarea GPU reale.
