# Nymans Däck – Pitstoppet (designförslag)

En racing-inspirerad förhandsvisning av en ny nymansdack.se, med
tävlingsspelet **Pitstoppet** inbyggt. Använder de riktiga Nymans/Däck Team-
loggorna och Titillium Web (en tjock, lätt kursiv racing-typsnitt) som
rubriktypsnitt.

⚠️ Det här är ett designförslag/mockup, inte den riktiga, publicerade sajten.

## Köra lokalt

```bash
npm install
npm run dev
```

## Publicera på GitHub Pages

**Steg 1 — skapa repot**
Skapa ett tomt repo på github.com som heter t.ex. `nymans-pitstoppet` under
ditt konto (CyberbobSweden).

**Steg 2 — kontrollera `base` i `vite.config.js`**
Filen har redan `base: "/nymans-pitstoppet/"`. Om du döper repot till något
annat måste du ändra den raden till `"/DITT-REPO-NAMN/"`.

**Steg 3 — pusha koden**
```bash
git init
git add -A
git commit -m "Pitstoppet: racing-mockup för Nymans Däck"
git branch -M main
git remote add origin https://github.com/CyberbobSweden/nymans-pitstoppet.git
git push -u origin main
```

**Steg 4 — slå på GitHub Pages**
I repot på GitHub: Settings → Pages → under "Build and deployment", välj
**Source: GitHub Actions**. Workflow-filen (`.github/workflows/deploy.yml`)
finns redan med och bygger + publicerar sidan automatiskt varje gång du
pushar till `main`.

Efter några minuter är sidan live på:
`https://CyberbobSweden.github.io/nymans-pitstoppet/`

## Struktur

- `src/App.jsx` – hela sidan (navbar, hero, tjänster, tävling/spel, stationer, footer)
- `src/assets/` – de riktiga Nymans/Däck Team-loggorna
- `.github/workflows/deploy.yml` – automatisk publicering till GitHub Pages

## Topplistan

Sparas i webbläsarens `localStorage` just nu, alltså lokalt per besökare/
enhet. Vill ni ha en gemensam topplista för alla besökare på riktiga sajten
behövs en liten backend (t.ex. Supabase) istället.
