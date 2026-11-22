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

Markdown-Regeln: Kapitel mit `##` (oder `###`, wenn `##` nur der Dateititel ist); Nummern wie `3.1` oder Kürzel wie `A01 –` werden zur Kapitelnummer; `**Begriff:** Wert` und `Begriff: Wert` werden zu Steckbriefzeilen.

## Neue Spezies auf die Standardvorlage setzen

In `spezies.json` unter `standard` eine Zeile ergänzen: `{ "gruppe": "…", "ordner": "…" }`. Optional `farbton` (0–360) für die Farbwelt, `quellen` für eine abweichende Zuordnung der Info-Dateien und `forschungszweige` für Verweise ins Forschungsarchiv.

## Was der Baukasten schreibt

Seiten (HTML/CSS/JS) und `<spezies>-basis.css/js` der Spezies, fehlende Unterseiten-Routen in `Menüs/adapter/aporia-routes.js`, den Klang-/Videoblock in `medien.json` (nur Blöcke mit `"_baukasten": true`, von Hand gepflegte bleiben unverändert) und auf der Übersichtskarte Link, eigenes Bild und „Offen“-Werte aus dem Steckbrief.

Gemeinsame Bausteine: `inhalte/spezies/_gemeinsam/` (`spezies-standard.css`, `bilder-karussell.*`, `klangarchiv.*`, `medien-player.*`, `galerie-zoom.js`).
