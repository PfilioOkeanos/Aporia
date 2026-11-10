# APORIA Worldbuilding-Board

Astro und die aktuelle offizielle TinaCMS-Astro-Integration (`@tinacms/astro`) lesen die vorhandenen Dateien in `inhalte/spezies/`. Die Waldfeen-Seite verwendet direkt `inhalte/spezies/waldfeen.json` und das vorhandene Bild `assets/bilder/spiezes2.png`. Es wird keine zweite Waldfeen-Datenkopie geführt. `.pages.yml` bleibt unverändert.

## Lokal starten

Voraussetzung: Node.js 22.22+ und pnpm.

```powershell
pnpm install
pnpm dev
```

Dann die von Astro ausgegebene Adresse öffnen. Die lokale Vorschau liegt unter `/spezies/waldfeen`; der Editor unter `/admin/index.html`. TinaCMS startet im Local Mode und schreibt Bearbeitungen in die vorhandenen Dateien. Die sieben langen Dossierfelder sind Markdown-Textfelder, damit Pages CMS dieselben Inhalte weiter lesen und bearbeiten kann. Auf der Vorschauseite lassen sich die Felder per Klick fokussieren. Titelbild und Galerie nutzen den Tina-Bildmanager mit Upload und Leeren.

## Private Online-Vorschau vorbereiten

Das Repository ist privat. Eine spätere Website muss zusätzlich beim Hosting-Anbieter mit Anmeldung/Access-Schutz versehen werden; ein privates GitHub-Repository macht die Website selbst nicht automatisch privat. TinaCloud-Zugangsdaten (`PUBLIC_TINA_CLIENT_ID`, `TINA_TOKEN`) und die Hosting-Freigabe werden erst nach Auswahl des privaten Hostings in `.env` beziehungsweise dessen Secret-Verwaltung gesetzt. Nichts wurde veröffentlicht.

## Inhalte und Theme

Die Theme-Zuordnung liegt in `src/lib/themes.ts`. Ein unbekannter Spezies- oder Fraktionsschlüssel erhält ein neutrales Aporia-Theme. Die Fraktionskomponente kann später dieselbe Theme-Zuordnung verwenden, ohne Fraktionsinhalte vorwegzunehmen. Bilder in bestehenden Markdown-Texten werden als Markdown-Bilder gerendert; rohes HTML ist deaktiviert.

Die Bild-URL `/assets/bilder/...` wird durch eine eng begrenzte Astro-Route aus dem vorhandenen Repository-Ordner ausgeliefert. Damit bleiben gespeicherte Bildpfade und Tina-Uploads am bestehenden Speicherort erhalten.

## Pages CMS

`.pages.yml` und alle bestehenden Feldnamen bleiben unverändert. Tina ergänzt keine separate Datenbank. Bitte Änderungen an Tina- und Pages-CMS-Definitionen gemeinsam abstimmen, wenn Feldtypen oder Dateipfade erweitert werden.
