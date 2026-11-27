// Handy-Prüfung · meldet Stellen, an denen die zentrale Handy-Schicht (Menüs/adapter/aporia-handy.js) nicht greift.
// Aufruf: node scripts/web/handy-pruefen.mjs        (nur lesen, ändert nichts)
//
// Geprüft wird:
//   1. Seiten ohne Topbar-Platzhalter  (data-aporia-topbar)  → dort fehlen Handy-Menü, Animationen-Schalter, Touch-Ersatz
//   2. Skripte, die die Geräteeinstellung direkt abfragen  matchMedia("(prefers-reduced-motion…)")
//      → stattdessen  import { bewegungReduziert } from ".../Menüs/adapter/aporia-bewegung.js"
//   3. Skripte, die Animationen nur bei Mausbewegung starten (mouseenter/pointerenter ohne Touch-Gegenstück)
//      → am Handy gibt es kein Überfahren; .ist-aktiv nutzen oder auf Sichtbarkeit reagieren
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const BEREICHE = ["inhalte", "Menüs"];
const rel = (p) => path.relative(ROOT, p).split(path.sep).join("/");
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(d, e.name);
    return e.isDirectory() ? (e.name === "node_modules" || e.name.startsWith(".") ? [] : walk(p)) : [p];
});

const dateien = BEREICHE.flatMap((b) => walk(path.join(ROOT, b)));
const html = dateien.filter((p) => /\.html?$/i.test(p));
const js = dateien.filter((p) => /\.m?js$/i.test(p));

// 1. Seiten ohne Topbar (Bausteine/Weiterleitungen ausgenommen)
const ohneTopbar = [];
for (const p of html) {
    const t = fs.readFileSync(p, "utf8");
    if (t.includes("data-aporia-topbar")) continue;
    if (!/<body/i.test(t)) continue;                                   // HTML-Baustein (Top_bar.html, Side_bar.html …)
    if (/http-equiv=["']refresh|location\.(replace|href)\s*=/i.test(t)) continue;   // Weiterleitung
    ohneTopbar.push(rel(p));
}

// 2. Direkte Abfrage der Geräteeinstellung
const direkt = js.filter((p) => !p.endsWith("aporia-bewegung.js") && /matchMedia\(\s*["'`]\(\s*prefers-reduced-motion/.test(fs.readFileSync(p, "utf8"))).map(rel);

// 3. Nur-Maus-Auslöser
const nurMaus = [];
for (const p of js) {
    const t = fs.readFileSync(p, "utf8");
    if (!/["'](mouseenter|mouseover|pointerenter)["']/.test(t)) continue;
    if (/ist-aktiv|IntersectionObserver|["'](touchstart|pointerdown|click)["']/.test(t)) continue;
    nurMaus.push(rel(p));
}

const abschnitt = (titel, liste, tipp) => {
    console.log(`\n${liste.length ? "⚠" : "✓"} ${titel}: ${liste.length}`);
    for (const e of liste.slice(0, 30)) console.log("   " + e);
    if (liste.length > 30) console.log(`   … und ${liste.length - 30} weitere`);
    if (liste.length && tipp) console.log("   → " + tipp);
};

console.log(`Handy-Prüfung: ${html.length} Seiten, ${js.length} Skripte`);
abschnitt("Seiten ohne Topbar (keine Handy-Schicht)", ohneTopbar, 'Topbar einbinden: <div data-aporia-topbar></div> und Top_bar.js importieren');
abschnitt("Skripte mit direkter Abfrage von „Bewegung reduzieren“", direkt, 'bewegungReduziert aus Menüs/adapter/aporia-bewegung.js verwenden');
abschnitt("Skripte, die nur auf Mausbewegung reagieren", nurMaus, "am Handy zusätzlich auf .ist-aktiv, Antippen oder Sichtbarkeit reagieren");
process.exitCode = direkt.length ? 1 : 0;
