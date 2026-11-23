// Systemübersicht · baut eine Übersichtsseite eines ausgedachten Sternsystems unter inhalte/himmelskoerper/sternensysteme/details/<ordner>/
// Aufruf: node scripts/planeten/systemseite-bauen.mjs <name>-system <ordner> [--heimatwelt <heimatwelten-name>]
// Quelle: systeme/<name>-system.json (Texte, Typen, Bahnen) + Sternenkarte (Dossier-Links). Seiten ohne die Kennung
// „data-systemseite-erzeugt“ (von Hand gepflegt, z. B. saelon-system) werden nie überschrieben.
import fs from "node:fs";
import { ROOT } from "./koerper.mjs";
import { ladeKarte, dossierPfad, kartenLink } from "./karten-verweise.mjs";

const [sysName, ordner] = process.argv.slice(2);
const hwName = process.argv.includes("--heimatwelt") ? process.argv[process.argv.indexOf("--heimatwelt") + 1] : null;
if (!sysName || !ordner) { console.log("Aufruf: systemseite-bauen.mjs <name>-system <ordner> [--heimatwelt <name>]"); process.exit(1); }
const sys = JSON.parse(fs.readFileSync(`${ROOT}scripts/planeten/systeme/${sysName}.json`, "utf8"));
const hw = hwName ? (await import(`./heimatwelten/${hwName}.mjs`)).default : null;
const karte = ladeKarte();
const objekte = Array.isArray(karte) ? karte : karte.objekte ?? Object.values(karte).find(Array.isArray);
const nachId = new Map(objekte.map((o) => [o.id, o]));

const ZIEL = `${ROOT}inhalte/himmelskoerper/sternensysteme/details/${ordner}/hauptseite/index.html`;
if (fs.existsSync(ZIEL) && !fs.readFileSync(ZIEL, "utf8").includes("data-systemseite-erzeugt")) { console.log(`${ordner}: von Hand gepflegt – nicht überschrieben`); process.exit(0); }

const UP = "../../../../../../";   // von …/details/<ordner>/hauptseite/ zum Projektwurzelverzeichnis
const url = (p) => UP + p.split("/").map((t) => encodeURIComponent(t).replace(/%3F/g, "?").replace(/%3D/g, "=").replace(/%26/g, "&")).join("/");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const f = (n, d = 2) => n.toLocaleString("de-DE", { maximumFractionDigits: d });
const link = (k) => dossierPfad(nachId.get(k.id)) ?? kartenLink(sys.stern.id, k.id);
const namen = new Map([[sys.stern.id, sys.stern.name], ...sys.koerper.map((k) => [k.id, k.name])]);

// Kopfbild: Archivbild der Heimatwelt (sonst des Sterns)
const kopfDossier = hw ? dossierPfad(nachId.get(hw.planetId)) : dossierPfad(nachId.get(sys.stern.id));
const kopfRoh = kopfDossier ? fs.readFileSync(ROOT + kopfDossier, "utf8").match(/assets\/bilder\/Himmelsk[^"')]+?\.webp/)?.[0] : null;
const kopfBild = kopfRoh ? decodeURIComponent(kopfRoh) : null;   // im Dossier bereits URL-kodiert

const karteZeile = (k, unter) => `<article><small>${esc(unter)}</small><h2><a href="${url(link(k))}">${esc(k.name)}</a></h2><p>${esc(k.beschreibung ?? "")}</p></article>`;
const zeilen = [karteZeile(sys.stern, sys.stern.typ), ...sys.koerper.map((k) => {
    const lage = k.ringeAE ? `${f(k.ringeAE[0], 1)}–${f(k.ringeAE.at(-1), 1)} AE` : k.aAE != null ? `${f(k.aAE)} AE` : k.periodeTage != null ? `Umlauf ${f(k.periodeTage, 1)} Tage` : "";
    return karteZeile(k, [k.typ, namen.get(k.um ?? k.ringUm), lage].filter(Boolean).join(" · "));
})];

const nav = [[`3D-Sternenkarte`, kartenLink(sys.stern.id)], ...(hw ? [[`Heimatwelt ${hw.name}`, dossierPfad(nachId.get(hw.planetId))], [hw.spezies.name, hw.spezies.seite]] : [])].filter(([, p]) => p);
const lead = sys.einleitung ?? (hw ? `${hw.name}, die Heimatwelt der ${hw.spezies.name}, umkreist den Stern ${sys.stern.name}. ${sys.stern.beschreibung.split(". ").slice(-1)[0]}` : sys.stern.beschreibung);
const art = sys.einzelstern === false ? "Doppelsternsystem" : "Sternsystem";

const html = `<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(sys.systemName)} · APORIA</title>
<link rel="stylesheet" href="${UP}Men%C3%BCs/TopBar/Top_bar.css"><link rel="stylesheet" href="${UP}Men%C3%BCs/Side_bar/Side_bar.css">
<style>
body{margin:0;background:#0a1113;color:#e9eded;font:1rem/1.6 system-ui}main{width:min(100%,76rem);min-width:0;margin:auto;padding:clamp(1rem,3vw,3rem);box-sizing:border-box}header.system{background:linear-gradient(90deg,#0a1215f5,#0a121570)${kopfBild ? `,url("${url(kopfBild)}") center/cover` : ""};padding:clamp(1.5rem,6vw,5rem);border-bottom:2px solid #d79a4e}h1{font-size:clamp(2.4rem,6vw,4.8rem);line-height:1.1;margin:.3em 0}main a{color:#f2c58c;text-underline-offset:.22em}main nav{display:flex;gap:1.5rem;flex-wrap:wrap}.bahnen{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,19rem),1fr));gap:1rem;margin-top:1rem}article{background:#132024;border:1px solid #304546;padding:1.3rem;min-width:0}article h2{margin:.35rem 0}article p{margin-bottom:0}small{color:#b3cbc6}
</style><script type="module" src="${UP}Men%C3%BCs/TopBar/Top_bar.js"></script><script type="module" src="${UP}Men%C3%BCs/Side_bar/side_bar.js"></script></head>
<body data-section="himmelskoerper" data-systemseite-erzeugt="systemseite-bauen"><div data-aporia-topbar></div><div class="aporia-page-frame"><div data-aporia-sidebar></div><main><header class="system"><small>Weltenarchiv · ${art}</small><h1>${esc(sys.systemName)}</h1><p>${esc(lead)}</p><nav aria-label="Verwandte Seiten">${nav.map(([t, p]) => `<a href="${url(p)}">${esc(t)}</a>`).join("")}</nav></header><section class="bahnen" aria-label="Systemkörper">${zeilen.join("\n")}</section></main></div></body></html>
`;
fs.mkdirSync(ZIEL.replace(/index\.html$/, ""), { recursive: true });
fs.writeFileSync(ZIEL, html);
console.log(`${ordner}: Systemübersicht gebaut (${zeilen.length} Körper)`);
