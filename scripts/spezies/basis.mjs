// Spezies-Baukasten · Basis: leitet <spezies>-basis.css/js aus dem Lithoiden-Standard ab (li- → <p>-) mit eigener Farbwelt
// und ergänzt Karussell-, Klapp-, Ausschnitt- und Klangarchiv-Bausteine. Überschreibt nur die Basisdateien.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const SPEZIES = fileURLToPath(new URL("../../inhalte/spezies/", import.meta.url)).replace(/\\/g, "/");
const B = SPEZIES + "Biologische Spezies/";

// Rollen der Lithoiden-Farben → Werte je Spezies
const ROLLEN = {
    "#0b0d14": "bg", "#151827": "glas", "#1c2033": "glashell", "#a98cff": "linie", "#b99dff": "liniehell",
    "#b48cff": "akzent", "#d9c6ff": "akzenthell", "#6fe3ff": "zweit", "#ece8f6": "text", "#a9a4bf": "leise",
    "#8c6fe0": "tint", "#20243a": "glaslicht", "#0c0e17": "glasdunkel", "#7a4fd6": "glow1", "#4fbfe0": "glow2",
    "#a35a2a": "glow3", "#10121c": "rahmen", "#1f2338": "knopf", "#141728": "reiter", "#121523": "flaeche",
    "#141729": "reiter", "#111422": "kachel", "#0d0f18": "herobg", "#3a2d63": "aktiv1", "#22193d": "aktiv2",
    "#f6f2ff": "h1", "#dcd7ea": "intro", "#07080d": "zoombg",
};

export function baueBasis({ ordner, praefix, klasse, name, design, motto, farben, schrift, gruppe = "Biologische Spezies" }) {
    const ZIEL = SPEZIES + gruppe + "/";
    const um = (t) => t
        .replace(/li-/g, praefix + "-").replace(/\.lithoiden/g, "." + klasse).replace(/lithoiden-basis/g, klasse + "-basis").replace(/Lithoiden/g, name)
        .replace(/#([0-9a-f]{6})([0-9a-f]{2})?\b/gi, (m, h, a = "") => { const r = ROLLEN["#" + h.toLowerCase()]; if (r && !farben[r]) throw new Error("Farbe fehlt: " + r); return (r ? farben[r] : "#" + h) + a; });
    let css = um(fs.readFileSync(B + "Lithoiden/lithoiden-basis.css", "utf8"))
        .replace(/„Kristall & Quellstein“/, motto)
        .replace(/Designvorlage assets\/…\/[^\n]*?\.png/, "Designvorlage assets/…/" + design)
        .replace("Kristallglanz wandert", "Glanz wandert");
    if (schrift) css = css.replace(/--(\w+)-serif: [^;]+;/, `--$1-serif: ${schrift};`);
    css = css.replace("    margin: 0;\n    background: var(--" + praefix + "-bg);", `    --karussell-akzent: var(--${praefix}-zweit, var(--${praefix}-cyan));
    --karussell-linie: var(--${praefix}-linie);
    --karussell-flaeche: ${farben.kachel};
    --karussell-text: var(--${praefix}-text);
    --karussell-leise: var(--${praefix}-leise);
    margin: 0;
    background: var(--${praefix}-bg);`);
    const p = praefix;
    const extra = `/* ---------- Ausschnitte aus Designtafeln (Region als Anteil von Breite x/w und Höhe y/h; --r = Bildhöhe / Bildbreite) ---------- */
.${p}-ausschnitt { position: relative; display: block; overflow: hidden; aspect-ratio: calc(var(--w) / (var(--h) * var(--r, 1))); background: ${farben.zoombg}; }
.${p}-ausschnitt.${p}-hero-bild { position: absolute; aspect-ratio: auto; }
.${p}-ausschnitt > img { position: absolute; top: 0; left: calc(var(--x) / var(--w) * -100%); width: calc(100% / var(--w)) !important; max-width: none !important; height: auto; margin-top: calc(var(--y) * var(--r, 1) / var(--w) * -100%); }

/* ---------- Klappbereiche ---------- */
.${p}-klappen { display: inline-flex; align-items: center; gap: .4rem; margin: 0 0 .45rem .4rem; padding: .3rem .7rem; border: 1px solid var(--${p}-linie-hell); border-radius: 999px; background: ${farben.knopf}; color: var(--${p}-text); font: 600 .74rem/1.2 "Segoe UI", system-ui, sans-serif; cursor: pointer; justify-self: start; }
.${p}-klappen:hover { border-color: var(--${p}-cyan); }
.${p}-klappen::before { content: "▾"; color: var(--${p}-cyan); transition: transform .25s; }
.${p}-klappen[aria-pressed="true"]::before { transform: rotate(180deg); }
.${p}-karte[open] > .${p}-text, .${p}-klapp[open] > .${p}-klapp-inhalt { animation: ${p}-auf .35s ease; }
@keyframes ${p}-auf { from { opacity: 0; transform: translateY(-.35rem); } to { opacity: 1; transform: none; } }
.${p}-karte:not([open]) summary:hover { background: linear-gradient(90deg, color-mix(in srgb, var(--${p}-violett) 14%, transparent), transparent); border-radius: 14px; }
.${p}-klapp { border: 1px solid var(--${p}-linie); border-radius: 12px; background: ${farben.flaeche}b3; }
.${p}-klapp summary { display: flex; align-items: center; gap: .55rem; padding: .6rem .8rem; cursor: pointer; list-style: none; }
.${p}-klapp summary::-webkit-details-marker { display: none; }
.${p}-klapp summary strong { flex: 1; color: var(--${p}-violett-hell); font: 600 1rem/1.3 var(--${p}-serif); }
.${p}-klapp summary small { color: var(--${p}-leise); font-size: .76rem; }
.${p}-klapp[open] .${p}-chevron { transform: rotate(45deg); }
.${p}-klapp-inhalt { display: grid; gap: .45rem; padding: 0 .8rem .8rem; font-size: .9rem; }
.${p}-klapp-inhalt ul, .${p}-text ol { display: grid; gap: .25rem; padding: 0; list-style: none; }
.${p}-klapp-inhalt ul li { position: relative; padding-left: 1.05rem; }
.${p}-klapp-inhalt ul li::before { content: ""; position: absolute; left: .1rem; top: .6em; width: .42rem; height: .42rem; border-radius: 50%; background: var(--${p}-cyan); box-shadow: 0 0 .4rem var(--${p}-cyan); }
.${p}-text ol { counter-reset: schritt; }
.${p}-text ol li { counter-increment: schritt; position: relative; padding-left: 1.9rem; }
.${p}-text ol li::before { content: counter(schritt); position: absolute; left: 0; top: .1em; display: grid; place-items: center; width: 1.35rem; height: 1.35rem; border: 1px solid var(--${p}-linie-hell); border-radius: 50%; color: var(--${p}-cyan); font: 600 .7rem/1 ui-monospace, Consolas, monospace; }
.${p}-text--frei { margin: 0 0 .7rem; padding: 0; border: 0; max-width: none; }
.${p}-text > .${p}-ausschnitt { width: min(100%, 26rem); border: 1px solid var(--${p}-linie); border-radius: 10px; }
.${p}-quelle-design { color: var(--${p}-cyan) !important; }

/* Lange Begriffe in Steckbriefen umbrechen statt überlappen */
.${p}-fakten dt, .${p}-fakten dd { min-width: 0; overflow-wrap: anywhere; hyphens: auto; }

/* Steckbrief aus dem Dossier (Hauptseiten) */
.${p}-dossier-steckbrief { margin-top: var(--${p}-raum); }
.${p}-dossier-raster { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr); gap: var(--${p}-raum); align-items: start; }
.${p}-dossier-raster .${p}-fakten > div { grid-template-columns: minmax(8rem, .7fr) minmax(0, 1.3fr); }
@container (max-width: 820px) { .${p}-dossier-raster { grid-template-columns: minmax(0, 1fr); } }

/* Karussell: Tafeln vollständig zeigen */
.${p}-karussell-block .${p}-h2 { margin-bottom: .6rem !important; }
.${p}-dossier .karussell-bild img { object-fit: contain; background: ${farben.zoombg}; }
.${p}-dossier .bilder-karussell--buehne .karussell-bild { background: ${farben.zoombg}; }

/* Überschrift mit Leuchtlinie */
.${p}-h2--linie { text-transform: uppercase; letter-spacing: .12em; font-size: clamp(1rem, 1.7cqi, 1.22rem) !important; }
.${p}-h2--linie::after { content: ""; flex: 1 1 4rem; align-self: center; height: 1px; background: linear-gradient(90deg, var(--${p}-violett), transparent); box-shadow: 0 0 .5rem var(--${p}-violett); }

/* Medienseite: Schnellnavigation */
.${p}-medien-nav { display: flex; flex-wrap: wrap; gap: .4rem; }
.${p}-medien-nav a { display: inline-flex; align-items: center; gap: .45rem; padding: .45rem .8rem; border: 1px solid var(--${p}-linie); border-radius: 10px; background: ${farben.reiter}cc; color: var(--${p}-text) !important; font-size: .86rem; text-decoration: none; }
.${p}-medien-nav a:hover { border-color: var(--${p}-violett); }
.${p}-medien-nav b { color: var(--${p}-cyan); font: 600 .74rem/1 ui-monospace, Consolas, monospace; }
.${p}-medien-bereich { display: grid; gap: .6rem; }
.${p}-dossier .media-player-card { padding: .75rem .85rem; }
.${p}-dossier .media-player-card h3 { margin-bottom: .4rem; font: 600 1rem/1.3 var(--${p}-serif); }
.${p}-dossier .media-status, .${p}-dossier .asset-catalog [role="status"] { color: var(--${p}-leise); font-style: italic; font-size: .88rem; }
.${p}-dossier .media-player-card :is(select, button) { border: 1px solid var(--${p}-linie-hell); border-radius: 9px; background: ${farben.knopf}; color: var(--${p}-text); }
.${p}-dossier :is(video, audio) { width: 100%; }
.${p}-medien-zwei { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .6rem; }
@container (max-width: 640px) { .${p}-medien-zwei { grid-template-columns: minmax(0, 1fr); } }

`;
    const responsiv = css.indexOf("/* ---------- Responsiv ---------- */");
    css = css.slice(0, responsiv) + extra + css.slice(responsiv);
    // Variablennamen der Lithoiden-Basis: violett → Akzent, cyan → Zweitfarbe (Namen bleiben für den Standard gleich)
    css = css.replace(`--karussell-akzent: var(--${p}-zweit, var(--${p}-cyan));`, `--karussell-akzent: var(--${p}-cyan);`);
    fs.writeFileSync(ZIEL + ordner + "/" + klasse + "-basis.css", css);

    // JS: Plasmoiden-Basis als Vorlage (Klappen, Karussell, Großansicht)
    const js = fs.readFileSync(B + "Plasmoiden/plasmoiden-basis.js", "utf8")
        .replace(/pl-/g, p + "-").replace(/data-pl-/g, "data-" + p + "-").replace(/Plasmoiden/g, name);
    fs.writeFileSync(ZIEL + ordner + "/" + klasse + "-basis.js", js);
    const rest = (css + js).match(/\bli-|\bpl-|lithoid|plasmoid/gi) ?? [];
    console.log(name, "Basis:", css.length, js.length, "Reste:", rest.length);
}
