# Planetendossier – gemeinsames Design für alle Himmelskörper

Das Design ist nicht an die Erde gebunden. Es gilt für Planeten, Monde, Sterne, Kometen, Asteroiden, Zwergplaneten, Nebel, Schwarze Löcher und Sternensysteme. Unterstützt wird jede Art unter `inhalte/himmelskoerper/` mit einem Ordner `details/`.

## Gemeinsame Dateien

`inhalte/himmelskoerper/_gemeinsam/`:

- **`planetendossier.css` / `planetendossier.js`:** Design und Verhalten für Hauptseiten (`pd-haupt`) und Kapitelseiten (`pd-kapitel`).
- **`dossier-symbole.js`:** kleine Bildzeichen für die Abschnitte. Ein Abschnitt bekommt sein Symbol über Stichwörter im Titel.
  - Neue Stichwörter trägt man in `REGELN` ein, neue Zeichen in `ZEICHEN`.
  - Jedes Symbol hat eine Themenfarbe (himmel, luft, wasser, gestein, leben, kultur, daten).

Pro Himmelskörper gibt es nur eine Farbdatei:

- Erde: `hauptseite/erde-design.css`
- alle anderen: `hauptseite/dossier-farben.css`. Sie wird beim ersten Bau angelegt.

`erde.css` und `erde.js` laden alle Himmelskörper-Seiten. Sie bleiben unverändert.

## Ablauf für einen Himmelskörper

Aufruf jeweils mit `<slug>` oder eindeutig mit `<art>/<slug>`, z. B. `monde/abgerundeter-trummermond-im-schwarzen-all`.

1. **`node scripts/planeten/daten-auslesen.mjs <art>/<slug>`**
   - Liest die bestehende Hauptseite und die Kapitelseiten aus.
   - Schreibt `scripts/planeten/daten/<slug>.json` (Planeten) oder `scripts/planeten/daten/<art>/<slug>.json`.
   - Ein vorhandener `design`-Block bleibt erhalten.
2. **`design`-Block in der JSON pflegen** (optional):
   - `bildarchiv`: Ordner mit Bildkarten (Themenordner/Unterthemen)
   - `themenordner`: Kapitel → Ordnername, wenn die Namen abweichen
   - `motive`: Kapitel → Unterthema-Nummer, damit jedes Kapitel ein eigenes Foto bekommt
   - `farben`: Startwerte für `dossier-farben.css` (nacht, tiefe, akzent, sand, moos, ozean)
3. **`node scripts/planeten/planetendossier.mjs <art>/<slug>`**
   Baut `hauptseite/index.html` neu.
4. **`node scripts/planeten/kapitel-umstellen.mjs <art>/<slug>`**
   - Hängt die Kapitelseiten an das gemeinsame Design.
   - Die Inhalte bleiben unverändert, und der Schritt lässt sich beliebig wiederholen.
   - Nur Seiten im Dossier-Aufbau (`.earth-panel`) werden umgestellt. Platzhalterseiten im Atlas-Format werden übersprungen und aufgelistet.

## Neue Inhalte für einen Himmelskörper (z. B. Heimatwelten aus den Spezies-Dossiers)

Vorbild ist Kharuun (`scripts/planeten/daten/kharuun.inhalt.json`).

1. `daten-auslesen.mjs <slug>` einmal vor dem Umbau ausführen. Das liest die alte, generierte Seite: Bilder, Archiv-ID und Kapitelpfade.
2. `<slug>.inhalt.json` daneben anlegen. Sie hat Vorrang vor der ausgelesenen Datei und enthält:
   - `name`, `genitiv`, `klasse`, `intro`, `grunddaten`, `position`, `verknuepfungen`, `quellen`
   - `globusDaten` für den 3D-Globus
   - `design.farben` mit allen `--pd-*`-Tönen (auch glas, linie, text, leise)
   - `kapitel["<Titel>"]` mit intro, gruppe, icon, untertitel, kopfbild und `abschnitte`
   - Die Bausteine der Abschnitte sind im Kopf von `kapitel-bauen.mjs` beschrieben: text, daten, liste, karten, balken, schichten, skala, zeitleiste, bild, verweise.
3. `planetendossier.mjs <slug>` baut die Hauptseite und legt `hauptseite/dossier-farben.css` an. Diese Datei vorher löschen, wenn sich die Farben geändert haben.
4. `kapitel-bauen.mjs <slug>` baut die 18 Kapitelseiten im Erde-Aufbau.
5. Den Anzeigenamen in `inhalte/himmelskoerper/<art>/bildarchiv.json` anpassen (Feld `title`). Ordner, Slug und Archiv-ID bleiben gleich.

Alle gebauten Seiten tragen `data-custom-dossier`. Der Atlas-Generator (`build-celestial-dossiers.mjs`) überschreibt sie deshalb nicht.

## Sternsystem in der Sternenkarte

`node scripts/planeten/sternsystem-bauen.mjs <name> [--pruefen]` liest `scripts/planeten/systeme/<name>.json`. Die Datei beschreibt Stern, Planeten, Monde, Gürtel, Kometen und Lage in physikalischen Einheiten: AE, km, Erd- und Sonnenmassen, Lichtjahre.

- **Was das Skript tut:**
  - Es rechnet alles in den Kartenmaßstab um (1 AE = 100 Einheiten, μ = Masse × 295,9) und setzt die Startpositionen passend zur Bahnsimulation (`Bahnphysik.js`).
  - Es schreibt die Einträge in `Menüs/adapter/Sternenkarte/Kartendaten/objekte.json`. Nur Einträge mit dem Präfix des Systems werden ersetzt, alle anderen bleiben unverändert.
- **Was der Prüfbericht zeigt:**
  - Habitable Zone, Einstrahlung und Gleichgewichtstemperatur
  - die nötige Treibhauswirkung für die Zieltemperatur
  - Hill-Sphären der Monde und Abstände der Planeten in gegenseitigen Hill-Radien
  - Periodenverhältnisse (Resonanzen)
  - Entfernung und Einflusszone gegenüber allen anderen Sternsystemen der Karte
- Mit `--pruefen` wird nur gerechnet, nichts geschrieben.
- **Gürtel und Gebiete** (`ringeAE`) sind keine Kugeln. Sie werden als Feld einzelner unförmiger Brocken gezeichnet:
  - `anzahl`: Dichte, bis 600
  - `groesseKm`: größter Brocken
  - `mindestPx`: Mindestgröße auf dem Bildschirm, damit der Gürtel trotz echtem Maßstab sichtbar bleibt
- Dazu gehören diese Kartenfelder: `steinAnzahl`, `steingroesseKm`, `steinMindestPx` sowie `koerperfeld` für Gebiete, die keine Asteroidengürtel sind, etwa Kometengebiete. Ausgewertet werden sie in `Menüs/Sternenkarte/Sternsysteme/Asteroidenguertel.js`. Einträge ohne diese Felder sehen aus wie bisher.
- Vorlage ist `systeme/kharuun-system.json`.

## Kapitelseiten: Leseführung (automatisch)

`planetendossier.js` ordnet jede Kapitelseite beim Laden. Die Dateien selbst bleiben unverändert.

- **Abschnitte:** Jeder Block (`.earth-panel` mit `h2`) bekommt Symbol, Themenfarbe und Nummer.
  - Standardmäßig ist er **zugeklappt** und zeigt eine Vorschau: den ersten Satz und Marken wie „9 Werte“, „Grafik“ oder „16 Einträge“. Alles wird aus der Seite gezählt.
  - Ein Klick auf den Titel öffnet den Abschnitt. Oben gibt es „Alle aufklappen / Alle zuklappen“.
- **„Auf dieser Seite“ links:** dieselben Symbole, eine Leitlinie mit Lesefortschritt und der aktuelle Abschnitt markiert.
  - Ein Klick öffnet und springt.
  - Alle Kapitel liegen darunter zum Aufklappen.
- **Kopf:** „N Abschnitte · N Wissenseinträge · ca. N Min. Lesezeit“ und „Lesen beginnen“.
- **Wissensdatenbank:** Eine Sprungleiste führt zu den Einträgen, lange Karten haben „Weiterlesen“.
- Links mit `#abschnitt-…` öffnen den passenden Abschnitt direkt.

## Heimatwelten der Spezies

- Beschreibung: `heimatwelten/<name>.mjs` (Texte, Werte, Farben) + System: `systeme/<name>-system.json`.
- Bauen: `node scripts/planeten/heimatwelt-bauen.mjs <name> --bauen` (Inhaltsdatei, Hauptseite, Kapitel; Verweise auf Stern, Monde und Planeten des Systems).
- Danach aktualisiert das Skript automatisch `inhalte/spezies/_gemeinsam/heimatwelten.js` (über `heimatwelt-verweise.mjs`):
  daraus zeigt `_gemeinsam/heimatwelt-verweis.js` auf allen Speziesseiten den Kasten „Heimatwelt“ (Planetendossier + Sternenkarte).
  Eingebunden ist der Kasten in allen `<spezies>-basis.js`, in `_gemeinsam/spezies-navigation.js` und bei den Technoiden in `Hauptseite/Spezies.js`.
  Seiten, die schon selbst auf ihren Planeten verlinken, bleiben unverändert.
- Quelltexte vollständig übernehmen (z. B. Saelith III): `quelltext-kapitel.mjs` liest ein Markdown-Dossier mit Abschnitten „### HW01 – Titel“ und liefert Kapitelabschnitte (`const hw = quellAbschnitte("Info_material/…/heimatwelt-referenz.md")`, dann `abschnitte: hw("HW02", "HW13")`). Nicht zugeordnete Abschnitte meldet `hw.rest()`.
  `kapitelErgaenzen: true` legt fehlende Kapitel (z. B. „Sternensystem“) an; `doppelteWeglassen: true` streicht Datenzeilen, die das Kapitel schon berechnet zeigt (gleiche Zahl ±1 % mit gleicher Einheit oder verwandtem Namen). Die gestrichenen Zeilen stehen als `weggelasseneDoppel` in der Inhaltsdatei; `spezies/pruefen.mjs` sucht Zeilen aus `05_Heimatwelt/` und `Sternensystem/` dann auch im Planetendossier und erkennt diese Zeilen an.
- Kharuun (Pyronoiden) ist von Hand gepflegt (`daten/dammernder-vulkanplanet-mit-gluhenden-lavaseen.inhalt.json`) und hat keine Beschreibungsdatei.

## Alle übrigen Körper der Sternenkarte (Sterne, Planeten, Monde, Gürtel, Kometen, Asteroiden, Nebel)

`node scripts/planeten/koerper-bauen.mjs <system|alle> [--bauen] [--nur <objekt-id>]`

- Quelle ist die Sternenkarte (`objekte.json`), ergänzt durch die Systemdatei (Leuchtkraft, Albedo, Masse). Alle Zahlen werden berechnet.
- Das Dossier ist der Archiveintrag, den die Karte als Bild nutzt (`archivLink`). Er bekommt den Namen des Körpers (`anzeigename.mjs`).
- Die Kapitel richten sich nach der Art des Archivs (Planeten 18, Monde 13 mit Mutterplanet/Gezeiten, Kometen mit Kern/Koma/Schweif, Sterne mit Spektralklasse/Fusion …).
- Verknüpfungen: Sternenkarte (System + Objekt), Zentralstern, Mutterplanet, Monde, Heimatwelt des Systems und ihre Spezies.
- **Eigene Texte**: `scripts/planeten/koerper/<objekt-id>.mjs` anlegen, z. B.
  `export default { intro: "…", kapitel: { "Geologie": { abschnitte: [{ titel: "Vulkane", text: ["…"] }] } } }`
  Abschnitte werden angehängt; mit `ersetzen: true` ersetzen sie die berechneten. Danach das System mit `--bauen` neu bauen.
- **Schutz**: Erzeugte Inhaltsdateien tragen `"_erzeugt": "koerper-bauen"`. Dateien ohne diese Kennung (von Hand gepflegt) überschreibt das Skript nie.
- Heimatwelt-Planeten und das Sonnensystem werden übersprungen; Körper ohne Archivbild (z. B. Kometengebiete) bekommen kein Dossier.
- Typen mit „Neptun“ im Namen (z. B. `Mini-Neptun`) zählen als Hüllenplaneten ohne feste Oberfläche (wie Eisriesen).
- Ablauf nach Änderungen an einem System: `sternsystem-bauen.mjs <name>-system` → `koerper-bauen.mjs <name>-system --bauen` → bei Heimatwelten `heimatwelt-bauen.mjs <name> --bauen`.

## Systemübersicht (eine Seite je System)

`node scripts/planeten/systemseite-bauen.mjs <name>-system <ordner> [--heimatwelt <name>]`

- Schreibt `inhalte/himmelskoerper/sternensysteme/details/<ordner>/hauptseite/index.html`: Stern und alle Körper als Karten mit Link auf ihr Dossier (sonst auf die Sternenkarte), oben Sternenkarte, Heimatwelt und Spezies.
- Texte kommen aus der Systemdatei (`beschreibung`, optional `einleitung`); das Kopfbild ist das Archivbild der Heimatwelt.
- Seiten ohne die Kennung `data-systemseite-erzeugt` werden nie überschrieben (z. B. `saelon-system`, das `scripts/spezies/eigene/regeneranten.mjs` selbst schreibt).
- In der Heimatwelt-Beschreibung verlinkt `systemseite: "<Pfad>"` die Übersicht als Verknüpfung.

## Stand

- **Erde:** komplett umgestellt (Hauptseite und 18 Kapitel).
- **Heimatwelten:** 21 Welten im Dossier-Aufbau, je mit Sternsystem in der Sternenkarte (zuletzt Seyrath / Kelira-System, Chronoiden).
- **Körper der ausgedachten Systeme:** alle mit Archivbild als eigenes Dossier gebaut (Stand 2026-11-22: 212).
- **Systemübersichten:** `kelira-system`, `terev-system`, `orelis-system` (erzeugt), `saelon-system` (von regeneranten.mjs geschrieben).
- **Sehr weite Gebiete** (z. B. die Terev-Fernwolke bei 1.500–8.000 AE): In der Systemdatei `ankerAE` setzen. Die Karte bemisst den Startausschnitt nach den Ankerpunkten; ohne `ankerAE` verschwinden die Planeten im Bild.
- **Eigene Texte für viele Körper eines Systems** lassen sich zentral pflegen: `koerper/nerath-texte.mjs` mit einer kleinen Datei `koerper/<id>.mjs` je Körper, die daraus importiert.
- **Archiveinträge aus dem alten Atlas:** `node scripts/planeten/atlas-migrieren.mjs` übernimmt bestehende Haupt- und Kapitelseiten in das Planetendossier-Design. Mit `--pruefen` lässt sich die Auswahl ohne Änderungen prüfen. Die bisherige Kennzeichnung von Entwürfen bleibt auf Haupt- und Kapitelseiten erhalten.

## Hinweise

- Die Bildkarten im Archiv zeigen links ein Foto (ca. 42 %) und rechts Text. Das CSS schneidet überall nur den Fototeil aus.
- Bei der Erde verteilen sich nur 19 verschiedene Fotos auf 276 Karten. Deshalb sind die Motive in `motive` fest zugeordnet.
