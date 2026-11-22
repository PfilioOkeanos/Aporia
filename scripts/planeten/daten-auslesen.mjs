// Planetendossier · Daten auslesen
// Liest die Inhalte einer bestehenden Planetenseite (Hauptseite + Kapitel-Unterseiten) und speichert sie als
// scripts/planeten/daten/<slug>.json. Aus dieser Datei baut planetendossier.mjs die neue Hauptseite.
// Aufruf: node scripts/planeten/daten-auslesen.mjs <slug>   oder   <art>/<slug>  (z. B. monde/…)
import fs from "node:fs";
import path from "node:path";
import { ROOT, findeKoerper } from "./koerper.mjs";

const KOERPER = findeKoerper(process.argv[2]);
const { slug, art } = KOERPER;
const BASIS = KOERPER.basis;
const lies = (rel) => fs.readFileSync(ROOT + rel, "utf8");
const text = (html) => html.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
// relative Pfade einer Seite auf Projektpfade umrechnen (ohne Kodierung)
const zuProjekt = (vonDatei, href) => /^(https?:|#|mailto:)/.test(href) ? href : decodeURIComponent(path.posix.normalize(path.posix.join(path.posix.dirname(vonDatei), href.split("#")[0]))) + (href.includes("#") ? "#" + href.split("#")[1] : "");

const HAUPT = `${BASIS}/hauptseite/index.html`;
const h = lies(HAUPT);
const dl = (block) => [...block.matchAll(/<div><dt>([\s\S]*?)<\/dt><dd>([\s\S]*?)<\/dd><\/div>/g)].map(([, a, b]) => {
    const link = b.match(/<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/);
    return link ? [text(a), text(link[2]), zuProjekt(HAUPT, link[1])] : [text(a), text(b)];
});
const abschnitt = (klasse) => (h.match(new RegExp(`<section class="earth-panel ${klasse}"[\\s\\S]*?</section>`)) ?? [""])[0];
const daten = {
    slug,
    art,
    name: text((h.match(/<h1>([\s\S]*?)<\/h1>/) ?? [])[1] ?? ""),
    klasse: text((h.match(/<p class="earth-class">([\s\S]*?)<\/p>/) ?? [])[1] ?? ""),
    intro: text((h.match(/<div class="earth-title">[\s\S]*?<\/p>\s*<p>([\s\S]*?)<\/p>/) ?? [])[1] ?? ""),
    panorama: [...((h.match(/<div class="earth-panorama"[\s\S]*?<\/div>/) ?? [""])[0]).matchAll(/<img src="([^"]+)"/g)].map((m) => zuProjekt(HAUPT, m[1])),
    globus: zuProjekt(HAUPT, (h.match(/<div class="earth-player"[\s\S]*?<img src="([^"]+)"/) ?? [])[1] ?? ""),
    grunddaten: dl(abschnitt("earth-facts")),
    position: dl((h.match(/<h2>⌖ Position<\/h2>[\s\S]*?<\/dl>/) ?? [""])[0]),
    sternenkarte: zuProjekt(HAUPT, (h.match(/<a class="earth-map" href="([^"]+)"/) ?? [])[1] ?? ""),
    verknuepfungen: [...((h.match(/<ul class="earth-related">[\s\S]*?<\/ul>/) ?? [""])[0]).matchAll(/<a([^>]*)href="([^"]+)"[^>]*><b aria-hidden="true">([^<]*)<\/b><span>([^<]*)<\/span>([^<]*)<\/a>/g)]
        .map(([, attr, href, icon, art, titel]) => ({ icon, art: text(art), titel: text(titel), href: zuProjekt(HAUPT, href), route: (attr.match(/data-route="([^"]+)"/) ?? [])[1] ?? null })),
    quellen: [...((h.match(/<footer class="earth-sources">[\s\S]*?<\/footer>/) ?? [""])[0]).matchAll(/<a href="([^"]+)">([^<]+)<\/a>/g)].map(([, href, titel]) => ({ href, titel })),
    lebenSlug: (h.match(/data-planet-leben="([^"]+)"/) ?? [])[1] ?? null,
    kapitel: [],
};
// Gruppen und Symbole aus der Kapitelnavigation
const gruppen = {};
for (const [, gruppe, liste] of h.matchAll(/<details name="earth-chapters"><summary>([^<]+)<\/summary><ul>([\s\S]*?)<\/ul><\/details>/g)) {
    for (const [, href, icon, titel] of liste.matchAll(/<a href="([^"]+)"[^>]*><b aria-hidden="true">([^<]*)<\/b>([^<]+)<\/a>/g)) gruppen[text(titel)] = { gruppe: text(gruppe), icon, href: zuProjekt(HAUPT, href) };
}
// Kartenbilder der Schnellnavigation
const kartenbild = {};
for (const [, href, src] of abschnitt("earth-quick").matchAll(/<a href="([^"]+)"[^>]*><img src="([^"]+)"/g)) kartenbild[zuProjekt(HAUPT, href)] = zuProjekt(HAUPT, src);
// Kapitel-Unterseiten: Titel, Einleitung, Kopfbild
const ordner = fs.readdirSync(ROOT + BASIS + "/unterseiten", { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name).sort((a, b) => a.localeCompare(b, "de", { numeric: true }));
for (const o of ordner) {
    const datei = `${BASIS}/unterseiten/${o}/index.html`;
    const u = lies(datei);
    const titel = text((u.match(/<h1>([\s\S]*?)<\/h1>/) ?? [])[1] ?? o.replace(/^\d+ – /, ""));
    const kopf = (u.match(/<header class="earth-hero">[\s\S]*?<\/header>/) ?? [""])[0];
    const intro = text((kopf.match(/<\/h1>[\s\S]*?<p>([\s\S]*?)<\/p>/) ?? kopf.match(/<\/div>\s*<p>([\s\S]*?)<\/p>/) ?? [])[1] ?? "");
    const bild = (kopf.match(/<img src="([^"]+)"/) ?? [])[1];
    const g = gruppen[titel] ?? { gruppe: "Weitere", icon: "◆" };
    daten.kapitel.push({ nr: Number(o.slice(0, 2)), titel, ordner: o, datei, gruppe: g.gruppe, icon: g.icon, intro, bild: kartenbild[datei] ?? (bild ? zuProjekt(datei, bild) : null), kopfbild: bild ? zuProjekt(datei, bild) : null });
}
fs.mkdirSync(path.posix.dirname(ROOT + KOERPER.datenDatei), { recursive: true });
// Von Hand gepflegte Design-Optionen (Bildarchiv, Farben, Schichten) beim erneuten Auslesen behalten
const ziel = ROOT + KOERPER.datenDatei;
if (fs.existsSync(ziel)) { const alt = JSON.parse(fs.readFileSync(ziel, "utf8")); if (alt.design) daten.design = alt.design; }
fs.writeFileSync(ziel, JSON.stringify(daten, null, 2) + "\n");
console.log(`${daten.name}: ${daten.grunddaten.length} Grunddaten · ${daten.position.length} Positionsangaben · ${daten.verknuepfungen.length} Verknüpfungen · ${daten.kapitel.length} Kapitel (${daten.kapitel.filter((k) => k.intro).length} mit Einleitung, ${daten.kapitel.filter((k) => k.bild).length} mit Bild)`);
