// Spezies-Baukasten · Aufruf
//   npm run spezies                      → alle Spezies aus spezies.json neu bauen
//   npm run spezies -- Kolonialwesen     → nur die genannten (Ordnernamen, mehrere möglich)
// Ausgearbeitete Spezies mit eigener Hauptseite haben eigene Skripte unter scripts/spezies/eigene/.
import fs from "node:fs";
import { baueStandard } from "./standard.mjs";

const liste = JSON.parse(fs.readFileSync(new URL("./spezies.json", import.meta.url), "utf8")).standard;
const wahl = process.argv.slice(2).map((x) => x.toLowerCase());
const auswahl = wahl.length ? liste.filter((s) => wahl.includes(s.ordner.toLowerCase())) : liste;
if (wahl.length && auswahl.length !== wahl.length) console.warn("Nicht in spezies.json:", wahl.filter((w) => !liste.some((s) => s.ordner.toLowerCase() === w)).join(", "));
const fehler = [];
for (const s of auswahl) {
    try {
        if (s.bauskript) {
            await import(new URL("./eigene/" + s.bauskript, import.meta.url));
            continue;
        }
        const r = baueStandard(s);
        console.log(`${r.NAME.padEnd(18)} ${String(r.seiten).padStart(2)} Seiten · ${String(r.kapitel).padStart(3)} Kapitel aus ${r.info} Dateien · ${r.bilder} Bilder · ${r.klaenge} Klänge · ${r.videos} Videos`);
    } catch (e) {
        fehler.push(s.ordner + ": " + e.message);
        console.error("FEHLER", s.ordner, e.message);
    }
}
console.log(`\n${auswahl.length - fehler.length} von ${auswahl.length} Spezies gebaut.`);
if (fehler.length) process.exitCode = 1;
