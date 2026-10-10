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
