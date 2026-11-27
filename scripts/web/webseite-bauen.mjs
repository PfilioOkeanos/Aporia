// Webfassung bauen · erzeugt _site/ für GitHub Pages (Aufruf: node scripts/web/webseite-bauen.mjs)
// Das Repo bleibt unverändert; _site enthält eine verkleinerte, veröffentlichbare Kopie:
//   - PNG → WebP (max. 1.400 px, Transparenz bleibt), große JPG/WebP verkleinert
//   - WAV → MP3 (ffmpeg; ohne ffmpeg bleiben die WAV-Dateien erhalten)
//   - Verweise in HTML/CSS/JS/JSON werden auf die neuen Endungen umgeschrieben
//   - Prüft Gesamtgröße (GitHub-Pages-Grenze 1 GB) und alle lokalen Verweise (Groß-/Kleinschreibung)
// Benötigt: npm install --no-save sharp   (in der GitHub Action automatisch)
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const ZIEL = path.join(ROOT, "_site");
const MAX_PX = 1400, QUALITAET = 70, GRENZE = 1000 * 1024 * 1024;
const QUELLEN = ["index.html", "Menüs", "inhalte", "assets", "Info_material"];
const AUSSCHLUSS = [/^assets\/Modelle(\/|$)/, /\.(zip|fbx|blend|psd)$/i, /(^|\/)\.gitkeep$/, /(^|\/)desktop\.ini$/i, /(^|\/)Thumbs\.db$/i];
const TEXT = /\.(html?|css|js|mjs|json|txt|md|svg|webmanifest)$/i;

let sharp;
try { sharp = (await import("sharp")).default; } catch { console.error("sharp fehlt – bitte zuerst: npm install --no-save sharp"); process.exit(1); }
let ffmpeg = true;
try { execFileSync("ffmpeg", ["-version"], { stdio: "ignore" }); } catch { ffmpeg = false; console.warn("Hinweis: ffmpeg nicht gefunden – WAV-Dateien bleiben unverändert."); }

const walk = (d) => fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]) : [];
const relPfad = (p) => path.relative(ROOT, p).split(path.sep).join("/");

// ---------- 1. Dateien sammeln ----------
fs.rmSync(ZIEL, { recursive: true, force: true });
const dateien = QUELLEN.flatMap((q) => { const p = path.join(ROOT, q); return fs.statSync(p, { throwIfNoEntry: false })?.isFile() ? [p] : walk(p); })
    .map(relPfad).filter((r) => !AUSSCHLUSS.some((re) => re.test(r)));
console.log(`${dateien.length} Dateien werden übernommen`);

const ziel = (r) => path.join(ZIEL, ...r.split("/"));
const sicher = (p) => fs.mkdirSync(path.dirname(p), { recursive: true });

// ---------- 2. Kopieren und umwandeln ----------
const aufgaben = [];
let png = 0, jpg = 0, wav = 0;
for (const r of dateien) {
    const quelle = path.join(ROOT, ...r.split("/"));
    if (/\.png$/i.test(r)) {
        png++;
        aufgaben.push(async () => {
            const aus = ziel(r.replace(/\.png$/i, ".webp")); sicher(aus);
            try { await sharp(quelle, { limitInputPixels: false }).rotate().resize({ width: MAX_PX, height: MAX_PX, fit: "inside", withoutEnlargement: true }).webp({ quality: QUALITAET, effort: 4 }).toFile(aus); }
            catch (e) { console.warn("PNG nicht umwandelbar, Kopie:", r, e.message); fs.copyFileSync(quelle, ziel(r)); }
        });
    } else if (/\.webp$/i.test(r) && fs.statSync(quelle).size > 300 * 1024) {
        jpg++;
        aufgaben.push(async () => {
            const aus = ziel(r); sicher(aus);
            try { await sharp(quelle, { limitInputPixels: false }).resize({ width: MAX_PX, height: MAX_PX, fit: "inside", withoutEnlargement: true }).webp({ quality: QUALITAET + 2 }).toFile(aus); }
            catch { fs.copyFileSync(quelle, aus); }
        });
    } else if (/\.jpe?g$/i.test(r) && fs.statSync(quelle).size > 250 * 1024) {
        jpg++;
        aufgaben.push(async () => {
            const aus = ziel(r); sicher(aus);
            try { await sharp(quelle, { limitInputPixels: false }).rotate().resize({ width: MAX_PX, height: MAX_PX, fit: "inside", withoutEnlargement: true }).jpeg({ quality: 78, mozjpeg: true }).toFile(aus); }
            catch { fs.copyFileSync(quelle, aus); }
        });
    } else if (ffmpeg && /\.wav$/i.test(r)) {
        wav++;
        const aus = ziel(r.replace(/\.wav$/i, ".mp3")); sicher(aus);
        execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", quelle, "-codec:a", "libmp3lame", "-b:a", "128k", aus]);
    } else {
        const aus = ziel(r); sicher(aus); fs.copyFileSync(quelle, aus);
    }
}
// Bildumwandlung parallel
const parallel = Math.max(2, Math.min(8, (await import("node:os")).cpus().length));
let i = 0, fertig = 0;
await Promise.all(Array.from({ length: parallel }, async () => {
    while (i < aufgaben.length) { const a = aufgaben[i++]; await a(); if (++fertig % 250 === 0) console.log(`  ${fertig}/${aufgaben.length} Bilder`); }
}));
console.log(`Umgewandelt: ${png} PNG → WebP, ${jpg} JPG/WebP verkleinert, ${wav} WAV → MP3`);

// three.js für die Sternenkarte: lokal liefert der Server /_aporia/three/ aus node_modules, online liegt es in _site/_aporia/three/
const THREE = path.join(ROOT, "node_modules", "three");
if (fs.existsSync(THREE)) {
    for (const t of ["build", "examples/jsm"]) fs.cpSync(path.join(THREE, ...t.split("/")), path.join(ZIEL, "_aporia", "three", ...t.split("/")), { recursive: true });
    console.log("three.js für die Sternenkarte übernommen");
} else console.warn("Hinweis: node_modules/three fehlt (npm install) – die Sternenkarte funktioniert online sonst nicht.");

// ---------- 3. Verweise umschreiben ----------
const umschreiben = (text) => {
    let t = text.replace(/([^\s"'`()<>]*?)\.png\b/gi, (m, vor) => /^(https?:)?\/\//i.test(vor) ? m : `${vor}.webp`);
    if (ffmpeg) t = t.replace(/([^\s"'`()<>]*?)\.wav\b/gi, (m, vor) => /^(https?:)?\/\//i.test(vor) ? m : `${vor}.mp3`);
    return t;
};
const alle = walk(ZIEL);
let geaendert = 0;
for (const p of alle) {
    if (!TEXT.test(p)) continue;
    const alt = fs.readFileSync(p, "utf8");
    let neu = umschreiben(alt);
    // Import-Map: Server-Pfad /_aporia/three/ → relativer Pfad (die Website liegt online in einem Unterordner)
    if (neu.includes("\"/_aporia/three/")) {
        const vor = path.posix.relative(path.posix.dirname(path.relative(ZIEL, p).split(path.sep).join("/")), "_aporia/three") + "/";
        neu = neu.split("\"/_aporia/three/").join("\"" + (vor.startsWith(".") ? vor : "./" + vor));
    }
    if (neu !== alt) { fs.writeFileSync(p, neu); geaendert++; }
}
console.log(`${geaendert} Textdateien mit umgeschriebenen Verweisen`);

// ---------- 4. Zusatzdateien ----------
fs.writeFileSync(path.join(ZIEL, ".nojekyll"), "");
fs.writeFileSync(path.join(ZIEL, "robots.txt"), "User-agent: *\nDisallow: /\n");

// ---------- 5. Größe prüfen ----------
const liste = walk(ZIEL);
const groesse = liste.reduce((s, p) => s + fs.statSync(p).size, 0);
const nachOrdner = {};
for (const p of liste) { const k = relPfad(p).replace(/^_site\//, "").split("/").slice(0, 2).join("/"); nachOrdner[k] = (nachOrdner[k] ?? 0) + fs.statSync(p).size; }
console.log(`Webfassung: ${liste.length} Dateien, ${(groesse / 1048576).toFixed(0)} MB`);
for (const [k, v] of Object.entries(nachOrdner).sort((a, b) => b[1] - a[1]).slice(0, 8)) console.log(`  ${(v / 1048576).toFixed(0).padStart(5)} MB  ${k}`);

// ---------- 6. Verweise prüfen (exakte Schreibweise) ----------
const vorhanden = new Set(liste.map((p) => path.relative(ZIEL, p).split(path.sep).join("/").normalize("NFC")));
const ordner = new Set();
for (const v of vorhanden) { const teile = v.split("/"); for (let n = 1; n < teile.length; n++) ordner.add(teile.slice(0, n).join("/")); }
const muster = [/(?:href|src|poster|data-src)\s*=\s*"([^"]+)"/g, /url\(\s*['"]?([^'")]+)['"]?\s*\)/g, /(?:from|import)\s*\(?\s*["']([^"']+)["']/g];
const defekt = new Map();
for (const p of liste) {
    if (!/\.(html?|css|js)$/i.test(p)) continue;
    const rel = path.relative(ZIEL, p).split(path.sep).join("/");
    if (rel.startsWith("_aporia/")) continue;   // Bibliotheken (three.js) nicht prüfen
    const text = fs.readFileSync(p, "utf8");
    for (const re of muster) for (const m of text.matchAll(re)) {
        let u = m[1].trim();
        if (!u || /^(https?:|\/\/|data:|mailto:|tel:|javascript:|#|\$\{|blob:)/i.test(u) || u.includes("${") || u.includes("' +") || u.includes("\" +")) continue;
        if (/^three(\/|$)/.test(u)) continue;   // über die Import-Map aufgelöst
        u = u.split(/[?#]/)[0];
        if (!u) continue;
        let ziel;
        try { ziel = path.posix.normalize(path.posix.join(path.posix.dirname(rel), decodeURIComponent(u))).normalize("NFC"); } catch { continue; }
        if (u.startsWith("/")) ziel = u.slice(1);
        if (ziel.startsWith("..")) { defekt.set(rel + " → " + u, true); continue; }
        if (!vorhanden.has(ziel) && !ordner.has(ziel.replace(/\/$/, ""))) defekt.set(rel + " → " + u, true);
    }
}
if (defekt.size) {
    console.warn(`\nWarnung: ${defekt.size} Verweise ohne Ziel (Auszug):`);
    for (const d of [...defekt.keys()].slice(0, 40)) console.warn("  " + d);
} else console.log("Alle lokalen Verweise gefunden.");

if (groesse > GRENZE) { console.error(`\nFEHLER: Webfassung ist ${(groesse / 1048576).toFixed(0)} MB groß – GitHub Pages erlaubt höchstens 1 GB.`); process.exit(1); }
console.log("\nFertig: _site/ ist bereit für GitHub Pages.");
