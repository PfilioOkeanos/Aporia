# Spezies-Baukasten

Erzeugt die Dossierseiten der Spezies aus dem, was im Projekt liegt. Wer Texte, Bilder oder Klänge ergänzt, baut die Seiten einfach neu – es muss nichts von Hand eingetragen werden.

## Befehle

| Befehl | Wirkung |
|---|---|
| `npm run spezies` | alle Spezies aus `spezies.json` mit der Standardvorlage neu bauen |
| `npm run spezies -- Kolonialwesen Elektrozoiden` | nur die genannten Spezies (Ordnernamen) |
| `npm run spezies:pruefen` | prüfen, ob jede Zeile der Info-Dateien auf den Seiten steht |
| `node scripts/spezies/eigene/pyronoiden.mjs` | ausgearbeitete Spezies mit eigener Hauptseite neu bauen (ebenso kryonoiden, floranoiden, symbionten, lithoiden, plasmoiden) |
| `node scripts/spezies/ergaenzen.mjs` | auf älteren, von Hand gebauten Seiten fehlende Info-Kapitel als Bereich „Aus dem Infomaterial“ einfügen |

## Woher die Inhalte kommen

| Inhalt | Ordner | Verwendung |
|---|---|---|
| Infotexte | `Info_material/Alle_spezies_daten/<Gruppe>/<Spezies>/` | automatisch den Reitern zugeordnet (Ordnernamen wie `Biologie`, `02_Geschichte_Entwicklung/geschichte.md`, `Gameplay`, `Forschung`, `Medien`) |
| Bilder | `assets/bilder/Alle Spezies+Übersicht/<Gruppe>/<Spezies>/` | Kopfbilder, Themenkacheln, Bildkarussell (Unterordner = Filterkategorie) |
| Klänge | `assets/audio/Alle Spezies+Übersicht/<Gruppe>/<Spezies>/<Kategorie>/` | Eintrag in `inhalte/medien/medien.json` → Klangarchiv auf der Medienseite |
| Videos | `assets/videos/Alle Spezies+Übersicht/<Gruppe>/<Spezies>/` | Eintrag in `medien.json` → Videoplayer |
| Kurzprofil | Karte auf der Übersichtsseite der Gruppe | Untertitel, Steckbriefwerte, Route |

**Unterseite „Technologien“:** Spezies, die Technologien herstellen, bekommen einen zusätzlichen Reiter `Unterseiten/Technologien/technologien.html`, sobald im Infomaterial ein Ordner `Technologien` liegt (sonst entfällt er). Die Standardvorlage erledigt das automatisch; eigene Bauskripte nutzen `TECHNIK_REITER` und `routenSetzen()` aus `standard.mjs` (Beispiel: `eigene/echonoiden.mjs`). Von Hand gebaute Seiten (WaldFeen) haben die Seite in ihrem eigenen Aufbau.

**Sternsystem im Infomaterial:** Ein Ordner `Sternensystem`/`SternenSystem` fließt in die Heimatwelt-Seite der Spezies ein und ist Grundlage für `scripts/planeten/systeme/<name>-system.json`. Bestehende Namen im Archiv haben Vorrang: Doppelte Namen werden zuerst im Infomaterial umbenannt.

Markdown-Regeln: Kapitel mit `##` (oder `###`, wenn `##` nur der Dateititel ist); Nummern wie `3.1` oder Kürzel wie `A01 –` werden zur Kapitelnummer; `**Begriff:** Wert` und `Begriff: Wert` werden zu Steckbriefzeilen.

## Neue Spezies auf die Standardvorlage setzen

In `spezies.json` unter `standard` eine Zeile ergänzen: `{ "gruppe": "…", "ordner": "…" }`. Optional `farbton` (0–360) für die Farbwelt, `quellen` für eine abweichende Zuordnung der Info-Dateien und `forschungszweige` für Verweise ins Forschungsarchiv.

## Was der Baukasten schreibt

Seiten (HTML/CSS/JS) und `<spezies>-basis.css/js` der Spezies, fehlende Unterseiten-Routen in `Menüs/adapter/aporia-routes.js`, den Klang-/Videoblock in `medien.json` (nur Blöcke mit `"_baukasten": true`, von Hand gepflegte bleiben unverändert) und auf der Übersichtskarte Link, eigenes Bild und „Offen“-Werte aus dem Steckbrief.

Gemeinsame Bausteine: `inhalte/spezies/_gemeinsam/` (`spezies-standard.css`, `bilder-karussell.*`, `klangarchiv.*`, `medien-player.*`, `galerie-zoom.js`).

## Website online (GitHub Pages)

Die Website ist unter **https://pfiliookeanos.github.io/Aporia/** erreichbar (z. B. am Handy).

- Bei jedem Push auf `main` baut die GitHub Action `.github/workflows/pages.yml` mit `scripts/web/webseite-bauen.mjs` eine verkleinerte Webfassung (`_site/`) und veröffentlicht sie. Das Repo selbst bleibt unverändert.
- Webfassung: PNG → WebP (max. 1.400 px), große JPG und WebP verkleinert, WAV → MP3; Verweise werden automatisch umgeschrieben. Grenze von GitHub Pages: 1 GB.
- Lokaler Probelauf: `npm install --no-save sharp` und `node scripts/web/webseite-bauen.mjs` (ohne ffmpeg bleiben WAV-Dateien erhalten).
- Online nicht verfügbar: Funktionen des lokalen Servers (z. B. 3D-Modelle hochladen) und die FBX-Modelle aus Git LFS. Suchmaschinen sind über `robots.txt` ausgesperrt.
- Bildpfade in CSS-Variablen (`style="--art:url('…')"`) schreibt das Bauskript online auf feste Pfade ab `/Aporia/` um.

## Handy-Schicht (gilt automatisch für alle Seiten)

Es gibt **eine** Website für PC und Handy. Die Handy-Anpassungen hängen zentral an der Topbar – jede Seite mit `<div data-aporia-topbar></div>` und `Top_bar.js` bekommt sie ohne Zusatzarbeit:

- `Menüs/adapter/aporia-handy.js` – Steuerung: stellt jedes Stylesheet beim Laden um (siehe unten), aktiviert Hover-Effekte per Touch und hält Endlos-Animationen außerhalb des Bildschirms an.
- `Menüs/adapter/aporia-bewegung.js` – Schalter „Animationen“ (Seitenleiste → Darstellung). CSS schreibt weiter `@media (prefers-reduced-motion: reduce) { … }`; das wird automatisch auf den Schalter umgestellt. Die Geräteeinstellung gilt nur beim ersten Besuch als Vorschlag.
  JavaScript fragt **nicht** `matchMedia("(prefers-reduced-motion…)")`, sondern `import { bewegungReduziert } from ".../Menüs/adapter/aporia-bewegung.js"` (gleiche Form: `.matches`, `"change"`).
- **Hover am Handy:** Jede `:hover`-Regel bekommt auf Touch-Geräten eine Zwillingsregel mit `.ist-aktiv`. Ein Element im Inhalt erhält `.ist-aktiv`, wenn es angetippt wird (bis zum nächsten Tippen woanders). Ausnahme setzen: `data-ohne-touch-aktiv`. Am PC testen: `?touch-test` an die Adresse hängen.
- **Hover in JavaScript** (z. B. animierte Logos): `import { istTouch, beobachteMitte } from ".../Menüs/adapter/aporia-handy.js"` – `beobachteMitte(karte, aktiv => …)` meldet am Handy, ob die Karte in der Bildschirmmitte steht.
- Topbar am Handy: eine Zeile mit Menü-Knopf; Seitenleiste als ausklappbares Seitenmenü. Wann die Handy-Ansicht gilt, steht in `HANDY_MEDIA` (aporia-handy.js) und gleichlautend in `Top_bar.css`/`Side_bar.css`: schmal, Touch bis 1024 px oder Handy quer.
- Inhalts-Übersichten (`inhalte/Archivansicht.css`): am Handy passt die Szene in die Bildschirmbreite und steht mittig; darüber und darunter erscheint das Szenenbild gespiegelt als Hintergrund. Weitere Seitentyp-Skripte fürs Handy können über die Liste `ERWEITERUNGEN` in aporia-handy.js automatisch geladen werden.
- Prüfen: `node scripts/web/handy-pruefen.mjs` meldet Seiten ohne Topbar, direkte Abfragen von „Bewegung reduzieren“ und Skripte, die nur auf Mausbewegung reagieren.
