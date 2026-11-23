// Anzeigename eines Himmelskörpers im Bildarchiv ändern (Feld title). Slug, Ordner und Archiv-ID bleiben unverändert.
// Aufruf: node scripts/planeten/anzeigename.mjs <ordner> "<Neuer Name>"
import fs from "node:fs";
import { ROOT, findeKoerper } from "./koerper.mjs";

const [ordner, name] = process.argv.slice(2);
const K = findeKoerper(ordner);
const datei = `${ROOT}inhalte/himmelskoerper/${K.art}/bildarchiv.json`;
const roh = fs.readFileSync(datei, "utf8");
const archiv = JSON.parse(roh);
const eintrag = archiv.find((e) => e.slug === K.slug)
    ?? archiv.find((e) => e.slug.replace(/-[0-9a-f]{10,12}$/i, "") === K.slug);
if (!eintrag) throw new Error(`Kein Bildarchiv-Eintrag für ${K.slug}`);
const alt = eintrag.title;
eintrag.title = name;
fs.writeFileSync(datei, JSON.stringify(archiv, null, 2) + (roh.endsWith("\n") ? "\n" : ""));
console.log(`${K.art}/${K.slug}: „${alt}“ → „${name}“`);
