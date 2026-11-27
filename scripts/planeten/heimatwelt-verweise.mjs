// Heimatwelt-Verweise · schreibt inhalte/spezies/_gemeinsam/heimatwelten.js: welche Spezies welche Heimatwelt hat
// (Planetendossier, Planetenbild, Sternsystem). Daraus zeigt _gemeinsam/heimatwelt-verweis.js auf allen Speziesseiten
// den Weg zum Planeten – das Gegenstück zum Speziesverweis im Planetendossier.
// Quellen: scripts/planeten/heimatwelten/*.mjs + systeme/*-system.json, dazu EXTRA (Welten ohne Beschreibungsdatei).
// Aufruf: node scripts/planeten/heimatwelt-verweise.mjs   (heimatwelt-bauen.mjs ruft es nach jedem Bau selbst auf)
// Optional: Speziespfad als Argument aktualisiert nur diesen Eintrag.
import fs from "node:fs";
import { pathToFileURL } from "node:url";
import { ROOT } from "./koerper.mjs";

const P = "inhalte/himmelskoerper/planeten/details/";
const EXTRA = [
    { welt: "Vask", spezies: "Technologische Lebensformen/Autokonstrukte", ordner: "vask", systemDatei: "esvar-system", objekt: "esvar-vask" },
    { welt: "Kavren", spezies: "Technologische Lebensformen/Technosymbionten", ordner: "kavren", systemDatei: "iravelle-system", objekt: "iravelle-kavren" },
    { welt: "Titan", spezies: "Technologische Lebensformen/Digitaliden", ordner: "titan", dossier: "inhalte/himmelskoerper/monde/details/titan/hauptseite/index.html", system: "Kugel 1", systemName: "Sonnensystem", stern: "Sonne", objekt: "titan" },
    { welt: "Venyra", spezies: "Technologische Lebensformen/Nanomorphen", ordner: "venyra", systemDatei: "elaris-system", objekt: "elaris-venyra" },
    { welt: "Erde", spezies: "Biologische Spezies/Humanoide", ordner: "erde", system: "Kugel 1", systemName: "Sonnensystem", stern: "Sonne" },
    { welt: "Kharuun", spezies: "Biologische Spezies/Pyronoiden", ordner: "kharuun", systemDatei: "kharuun-system" },
];
const bildVon = (dossier) => {
    const html = fs.readFileSync(ROOT + dossier, "utf8");
    const src = html.match(/assets\/bilder\/[^"]+\.(?:png|jpe?g|webp)/i)?.[0];
    return src ? decodeURIComponent(src) : null;
};
const eintraege = [];
for (const f of fs.readdirSync(`${ROOT}scripts/planeten/heimatwelten`).filter((x) => x.endsWith(".mjs")).sort()) {
    const s = (await import(pathToFileURL(`${ROOT}scripts/planeten/heimatwelten/${f}`).href)).default;
    const sys = JSON.parse(fs.readFileSync(`${ROOT}scripts/planeten/systeme/${s.system}.json`, "utf8"));
    // Ordner als <art>/<slug> (z. B. monde/rhaum) zeigt auf ein Dossier außerhalb der Planeten
    const [artO, slugO] = s.ordner.includes("/") ? s.ordner.split("/") : ["planeten", s.ordner];
    eintraege.push({ welt: s.name, spezies: `${s.spezies.gruppe}/${s.spezies.ordner}`, ordner: slugO, ...(artO !== "planeten" ? { dossier: `inhalte/himmelskoerper/${artO}/details/${slugO}/hauptseite/index.html` } : {}), objekt: s.planetId, system: sys.stern.id, systemName: sys.systemName, stern: sys.stern.name });
}
for (const x of EXTRA) {
    if (eintraege.some((e) => e.spezies === x.spezies)) continue;
    if (x.systemDatei) { const sys = JSON.parse(fs.readFileSync(`${ROOT}scripts/planeten/systeme/${x.systemDatei}.json`, "utf8")); Object.assign(x, { system: sys.stern.id, systemName: sys.systemName, stern: sys.stern.name }); delete x.systemDatei; }
    eintraege.push(x);
}
const ziel = `${ROOT}inhalte/spezies/_gemeinsam/heimatwelten.js`;
const wahl = process.argv[2];
const auswahl = wahl ? eintraege.filter((e) => e.spezies === wahl) : eintraege;
if (!auswahl.length) throw new Error("Keine Heimatwelt für " + wahl);
const daten = wahl && fs.existsSync(ziel) ? (await import(pathToFileURL(ziel).href)).HEIMATWELTEN : {};
for (const e of auswahl) {
    const dossier = e.dossier ?? `${P}${e.ordner}/hauptseite/index.html`;
    if (!fs.existsSync(ROOT + dossier)) throw new Error("Planetendossier fehlt: " + e.ordner);
    if (!fs.existsSync(`${ROOT}inhalte/spezies/${e.spezies}`)) throw new Error("Speziesordner fehlt: " + e.spezies);
    daten[e.spezies] = { welt: e.welt, ordner: e.ordner, dossier, bild: bildVon(dossier), system: e.system, systemName: e.systemName, stern: e.stern, ...(e.objekt ? { objekt: e.objekt } : {}) };
}
fs.writeFileSync(ziel, `// Spezies → Heimatwelt · erzeugt von scripts/planeten/heimatwelt-verweise.mjs – nicht von Hand ändern.\n// Pfade relativ zum Projektordner. Verwendet von heimatwelt-verweis.js.\nexport const HEIMATWELTEN = ${JSON.stringify(daten, null, 4)};\n`);
console.log(`heimatwelten.js: ${Object.keys(daten).length} Spezies mit Heimatwelt`);
