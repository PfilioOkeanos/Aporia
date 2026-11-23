// Spezies-Baukasten · eigenes Bauskript (eigene Hauptseite). Aufruf: node scripts/spezies/eigene/regeneranten.mjs
// Baut die Seiten der Regeneranten (Narethi) im Speziesstandard: Texte wörtlich aus Info_material (Dossier 4.0),
// Bilder aus dem Bildarchiv (gesamtdarstellung + entwicklungsstadien), Heimatwelt Nalvyr mit Planetendossier und Saelon-System verknüpft.
// Neue Bilder in den Ordnern werden beim nächsten Lauf automatisch übernommen.
import fs from "node:fs";
import path from "node:path";
import { ROOT, FZ, esc, rel, write, exists, read, erstelle, medienEintragen } from "../bibliothek.mjs";
import { ladeKarte, dossierPfad } from "../../planeten/karten-verweise.mjs";
import { baueBasis } from "../basis.mjs";

const NAME = "Regeneranten", KLASSE = "regeneranten", P = "rg", R0 = "spezies-biological-19";
const S = "inhalte/spezies/Biologische Spezies/Regeneranten";
const INFO = "Info_material/Alle_spezies_daten/Biologische Spezies/Regeneranten";
const A = "assets/bilder/Alle Spezies+Übersicht/Biologische Spezies/Regeneranten";
const PLANET = "inhalte/himmelskoerper/planeten/details/nalvyr/hauptseite/index.html";
const PLANETBILD = "assets/bilder/Himmelskörper/OzeanWelt/nalvyr/hauptseite/turkisfarbener-planet-mit-unterwasser-schelfen-6daa5d6f0e.webp";
const KARTE = "Menüs/Sternenkarte/Sternenkarte.html", SYSTEM = "?system=nalvyr-stern";
const UEBERSICHT = "inhalte/spezies/Biologische Spezies/Übersichtsseite biologische spezies/Uebersicht.html";
for (const f of [PLANET, PLANETBILD, KARTE]) if (!exists(f)) throw new Error("Fehlt: " + f);

baueBasis({
    ordner: "Regeneranten", praefix: P, klasse: KLASSE, name: NAME, design: "Regeneranten/gesamtdarstellung/Sechsbeiniger Narethi im Kupferlicht-6.png", motto: "„Kupfernarbe“",
    farben: { bg: "#090b0a", glas: "#121614", glashell: "#18201c", linie: "#c98a5a", liniehell: "#dfa679", akzent: "#d98a4e", akzenthell: "#f7d2b2", zweit: "#9cc48c", text: "#eff1ec", leise: "#a9b2aa", tint: "#7a4a2a", glaslicht: "#1d2420", glasdunkel: "#090b0a", glow1: "#b8642e", glow2: "#6f9a62", glow3: "#3a4a5a", rahmen: "#0c0f0d", knopf: "#1c221e", reiter: "#101412", flaeche: "#0f1311", kachel: "#0c100e", herobg: "#0a0d0b", aktiv1: "#5a3218", aktiv2: "#2e1a0c", h1: "#fff6ee", intro: "#dfe2db", zoombg: "#050605" },
});

// ---------- Bilder ----------
const liste = (ordner) => exists(A + "/" + ordner) ? fs.readdirSync(path.join(ROOT, A, ordner)).filter((x) => /\.(png|jpe?g|webp)$/i.test(x)).sort((a, b) => a.localeCompare(b, "de", { numeric: true })).map((x) => A + "/" + ordner + "/" + x) : [];
const titel = (p) => path.posix.basename(p).replace(/\.(png|jpe?g|webp)$/i, "").replace(/-\d+$/, "").replace(/^Aporia_\s*/i, "").trim();
const GES = liste("gesamtdarstellung"), ENT = [...liste("entwicklungsstadien"), ...liste("biologie")];
const KRANZ = GES.filter((p) => !/RegenerantA\d/.test(p)).map((p) => ({ datei: p, titel: titel(p), kategorie: "Kranzhaltung" }));
const anr = (p) => Number((p.match(/\((\d+)\)/) ?? [0, 0])[1]);
const DESIGNS = GES.filter((p) => /RegenerantA\d/.test(p)).sort((a, b) => anr(a) - anr(b)).map((p) => ({ datei: p, titel: `Designtafel ${anr(p) + 1}`, kategorie: "Designtafeln" }));
const KUPPEL = ENT.filter((p) => /[Ss]echsbein|Glockenkuppel|sechs Greif/.test(p)).map((p) => ({ datei: p, titel: titel(p), kategorie: "Kuppelstand" }));
const DREI = ENT.filter((p) => !/[Ss]echsbein|Glockenkuppel|sechs Greif/.test(p)).map((p) => ({ datei: p, titel: titel(p), kategorie: "Dreibeinstand" }));
const ALLE = [...KRANZ, ...KUPPEL, ...DREI, ...DESIGNS];
if (KRANZ.length < 5 || KUPPEL.length < 5 || DREI.length < 5) throw new Error("Bilder fehlen");
const B_ = (teil) => { const b = ALLE.find((x) => x.datei.includes(teil)); if (!b) throw new Error("Bild fehlt: " + teil); return b; };
const HERO = B_("im Kupferlicht");

// ---------- Seiten ----------
const GESCHICHTE_ENTW = ["Planetare Evolutionschronologie", "Entwicklung der Intelligenz", "Kulturelle Entwicklung"];
const HW = S + "/Unterseiten/Heimatwelt/heimatwelt.html", FO = S + "/Forschung/forschung.html";
const SYSTEMSEITE = "inhalte/himmelskoerper/sternensysteme/details/saelon-system/hauptseite/index.html";
const systemdaten = JSON.parse(read("scripts/planeten/systeme/nalvyr-system.json"));
const systemkarte = new Map(ladeKarte().map(objekt => [objekt.id, objekt]));
const koerper = [systemdaten.stern, ...systemdaten.koerper];
const systemKarten = koerper.map(objekt => {
    const archiv = dossierPfad(systemkarte.get(objekt.id));
    const mutter = systemkarte.get(objekt.um ?? objekt.ringUm);
    const ziel = archiv ? rel(SYSTEMSEITE, archiv) : rel(SYSTEMSEITE, KARTE) + SYSTEM + "&amp;objekt=" + objekt.id;
    const bahn = objekt.aAE ? objekt.aAE.toLocaleString("de-DE") + " AE" : "";
    return `<article><small>${esc([objekt.typ, mutter?.name, bahn].filter(Boolean).join(" · "))}</small><h2><a href="${ziel}">${esc(objekt.name)}</a></h2><p>${esc(objekt.beschreibung)}</p></article>`;
}).join("\n");
write(SYSTEMSEITE, `<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Saelon-System · APORIA</title>
<link rel="stylesheet" href="${rel(SYSTEMSEITE,"Menüs/TopBar/Top_bar.css")}"><link rel="stylesheet" href="${rel(SYSTEMSEITE,"Menüs/Side_bar/Side_bar.css")}">
<style>
body{margin:0;background:#0b1214;color:#e9eded;font:1rem/1.6 system-ui}main{width:min(100%,76rem);min-width:0;margin:auto;padding:clamp(1rem,3vw,3rem);box-sizing:border-box}header.saelon{background:linear-gradient(90deg,#0b151af5,#0b151a75),url("${rel(SYSTEMSEITE,PLANETBILD)}") center/cover;padding:clamp(1.5rem,6vw,5rem);border-bottom:2px solid #c58e67}h1{font-size:clamp(2.4rem,6vw,4.8rem);line-height:1.1;margin:.3em 0}main a{color:#f6c79f;text-underline-offset:.22em}main nav{display:flex;gap:1.5rem;flex-wrap:wrap}.bahnen{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,19rem),1fr));gap:1rem;margin-top:1rem}article{background:#142125;border:1px solid #334747;padding:1.3rem}article h2{margin:.35rem 0}article p{margin-bottom:0}small{color:#b7cfc9}
</style><script type="module" src="${rel(SYSTEMSEITE,"Menüs/TopBar/Top_bar.js")}"></script><script type="module" src="${rel(SYSTEMSEITE,"Menüs/Side_bar/side_bar.js")}"></script></head>
<body data-section="himmelskoerper"><div data-aporia-topbar></div><div class="aporia-page-frame"><div data-aporia-sidebar></div><main><header class="saelon"><small>Weltenarchiv · Doppelsternsystem</small><h1>Saelon-System</h1><p>Nalvyr und seine Monde Oris und Teshra umkreisen gemeinsam den orangefarbenen Hauptstern. Weit außerhalb der Planetenbahnen zieht der Weiße Zwerg Saelon B seine Bahn.</p><nav aria-label="Verwandte Seiten"><a href="${rel(SYSTEMSEITE,KARTE)}${SYSTEM}">3D-Sternenkarte</a><a href="${rel(SYSTEMSEITE,PLANET)}">Heimatwelt Nalvyr</a><a href="${rel(SYSTEMSEITE,S+"/hauptseite/Spezies.html")}">Regeneranten</a></nav></header><section class="bahnen" aria-label="Systemkörper">${systemKarten}</section></main></div></body></html>`);
const nalvyrKarte = {
    titel: "Nalvyr im Planetenarchiv", quelle: "Planetenarchiv · Nalvyr · Saelon-System (Sternenkarte)",
    html: `<p>Das vollständige Planetendossier von Nalvyr – mit Gezeiten, Kontinenten, Biosphäre, Städten und Schutzgebieten – liegt im Planetenarchiv. Das Saelon-System mit seinem Weißen Zwerg ist in der Sternenkarte eingetragen.</p>
<p class="${P}-knopfreihe"><a class="${P}-knopf" href="${rel(HW, PLANET)}">Planetendossier Nalvyr öffnen ›</a><a class="${P}-knopf" href="${rel(HW, SYSTEMSEITE)}">Systemübersicht</a><a class="${P}-knopf ${P}-knopf--leise" href="${rel(HW, KARTE)}${SYSTEM}">Saelon-System in der Sternenkarte ›</a></p>`,
};
// Forschungsbereiche (Allgemein 1.16, Forschung 8.x) → vorhandene Forschungszweige
const ZWEIGE = [
    ["Naturwissenschaften/Biologie", "Biologie & Zellforschung", "8.7, 8.25"],
    ["Naturwissenschaften/Medizin", "Medizin & Alterung", "8.12, 8.21, 8.23"],
    ["Naturwissenschaften/Genetik und Biotechnologie", "Genetik & Biotechnologie", "8.8, 8.9, 8.11"],
    ["Spezialisierte und erweiterte Forschung/Bewusstseins- und neuronale Vernetzungsforschung", "Neurobiologie", "8.18–8.20"],
    ["Spezialisierte und erweiterte Forschung/Morphologie und Transformationsforschung", "Morphologische Regeneration", "8.10"],
    ["Xenoforschung/Xenobiologie", "Xenobiologie", "8.27"],
    ["Xenoforschung/Xenomedizin", "Xenomedizin", "8.28, 8.39"],
    ["Umwelt, Leben und Ressourcen/Umwelt- und Ökosystemforschung", "Ökologische Regeneration", "8.26"],
    ["Gesellschaft und Kultur/Kultur- und Geisteswissenschaften", "Medizinische Ethik", "8.33, 8.34"],
];
for (const [z] of ZWEIGE) if (!exists(FZ + "/" + z + "/index.html")) throw new Error("Zweig fehlt: " + z);
const zweigKarte = {
    titel: "Einordnung in den Forschungsbaum", quelle: "Info_material · Regeneranten · Allgemein 1.16 · Forschung 8.x",
    html: `<p>Die wissenschaftlich bedeutenden Bereiche der Regeneranten gehören zu diesen vorhandenen Forschungszweigen:</p>
<ul class="${P}-zweig-liste">${ZWEIGE.map(([z, t, f]) => `<li><a href="${rel(FO, FZ + "/" + z + "/index.html")}"><strong>${esc(t)}</strong><span>${esc(f)}</span></a></li>`).join("")}</ul>`,
};
const T = (l, n, a = 0) => l.slice(a, a + n);

const SEITEN = [
    { key: "hauptseite", suffix: "", label: "Übersicht", file: S + "/hauptseite/Spezies.html", icon: "✶" },
    { key: "allgemeines", suffix: "-allgemeines", label: "Allgemeines", file: S + "/Unterseiten/Allgemeines/allgemeines.html", icon: "ⓘ", text: "Speziesdefinition, Körpermerkmale, Sinne und Kommunikation", titelbild: B_("Sechs Glieder, eine Kupfernarbe"),
        quellen: ["Allgemein/Allgemein", "01_Speziesdaten/speziesdaten.md"], galerie: T(KRANZ, 6) },
    { key: "biologie", suffix: "-biologie", label: "Biologie", file: S + "/Unterseiten/Biologie/biologie.html", icon: "⟡", text: "Zellnischen, sechs Regenerationsphasen und ihre Grenzen", titelbild: B_("nachwachsender sechster"),
        quellen: ["Biologie/Biologie"], galerie: [...T(KUPPEL, 6), DESIGNS[0]] },
    { key: "entwicklung", suffix: "-entwicklung", label: "Entwicklung", file: S + "/Unterseiten/Entwicklung/entwicklung.html", icon: "⤳", text: "Sechsstrahlige Herkunft, Fortpflanzung und Lebensdauer", titelbild: B_("Junger Narethi"),
        quellen: [{ datei: "02_Geschichte_Entwicklung/entwicklung.md", ohne: GESCHICHTE_ENTW, hinweis: "Biologische Entwicklung" }], galerie: T(DREI, 6) },
    { key: "heimatwelt", suffix: "-heimatwelt", label: "Heimatwelt", file: HW, icon: "◍", text: "Nalvyr im Saelon-System – Deltas, Gezeiten und Archipel", titelbild: B_("Salzdünen"),
        design: [nalvyrKarte], quellen: ["05_Heimatwelt/heimatwelt-referenz.md"], galerie: [B_("Salzdünen"), B_("Kartograf"), B_("Farnnebel-4"), B_("über der Felsspalte"), B_("über schwarzem Wasser")] },
    { key: "gesellschaft", suffix: "-gesellschaft", label: "Gesellschaft", file: S + "/Unterseiten/Gesellschaft/gesellschaft.html", icon: "⁂", text: "Familienverbände, Narben, Erinnerungsarchive und Kunst", titelbild: B_("Keramikschale"),
        quellen: ["03_Gesellschaft_Kultur/gesellschaft.md", "03_Gesellschaft_Kultur/kultur.md"], galerie: [B_("Keramikschale"), B_("Musikerin"), B_("Blattarchivarin"), B_("Glaskugel"), B_("Kartenarchiv")] },
    { key: "politik", suffix: "-politik", label: "Politik", file: S + "/Unterseiten/Politik/politik.html", icon: "⚖", text: "Nalvyr-Konvent, Charta der Unversehrtheit und Geweberechte", titelbild: B_("Gesandter"),
        quellen: ["04_Politik_Fraktionsbeziehungen/politik.md", "04_Politik_Fraktionsbeziehungen/fraktionsbeziehungen.md"], galerie: [B_("Gesandter"), B_("Bote"), B_("Schieferblaue"), B_("Pflegestube")] },
    { key: "geschichte", suffix: "-geschichte", label: "Geschichte", file: S + "/Unterseiten/Geschichte/geschichte.html", icon: "⧗", text: "Evolution, Gewebekrise und der Weg zur Charta", titelbild: B_("Herbstlaub"),
        quellen: [{ datei: "02_Geschichte_Entwicklung/entwicklung.md", nur: GESCHICHTE_ENTW, hinweis: "Evolution und kulturelle Entwicklung" }, "02_Geschichte_Entwicklung/geschichte.md"], galerie: [B_("Herbstlaub"), B_("Schattenarchiv"), B_("Kartograf"), B_("weinrotem Himmel")] },
    { key: "gameplay", suffix: "-gameplay", label: "Spielintegration", file: S + "/Gameplay/gameplay.html", icon: "◈", text: "Körperzonen, Regenerationsressourcen und Quests", titelbild: DESIGNS[1] ?? KRANZ[0],
        quellen: [{ datei: "Gameplay/.gitkeep", ohne: ["Forschungsfortschritt", "Forschungsabhängigkeiten"] }], galerie: T(DESIGNS, 6) },
    { key: "forschung", suffix: "-forschung", label: "Forschung", file: FO, icon: "⚗", text: "Gewebekartierung, Neuroregeneration und Xenomedizin", titelbild: B_("Kartenarchiv"),
        design: [zweigKarte], quellen: ["Forschung/.gitkeep", { datei: "Gameplay/.gitkeep", nur: ["Forschungsfortschritt", "Forschungsabhängigkeiten"], hinweis: "Spielintegration" }] },
    { key: "medien", suffix: "-medien", label: "Medien", file: S + "/Unterseiten/Medien/medien.html", icon: "▣", text: "Bildarchiv, Klänge, Bewegtbild und Modelle", titelbild: B_("Felswand"), quellen: [] },
];

for (const s of SEITEN) for (const e of [".css", ".js"]) { const f = s.file.replace(/\.html$/, e); if (exists(f) && /Spezies-Baukasten \(scripts\/spezies\)/.test(read(f))) fs.unlinkSync(path.join(ROOT, f)); }

const B = erstelle({
    S, INFO, A, NAME, KLASSE, P, R0, THEME: "#090b0a", SEITEN, REGION: {},
    BESCHREIBUNG: "Regeneranten (Narethi) im APORIA-Weltenarchiv: langlebige, sechsstrahlige Spezies mit außergewöhnlicher natürlicher Regeneration. Heimatwelt Nalvyr.",
    links: (f, S_, rel) => [
        [rel(f, PLANET), "Planetendossier Nalvyr", "Heimatwelt im Planetenarchiv"],
        [rel(f, KARTE) + SYSTEM, "Saelon-System", "In der Sternenkarte ansehen"],
        [rel(f, S_.forschung.file), "Forschung", "Forschung an den Regeneranten", `data-route="${R0}-forschung"`],
        [rel(f, FZ + "/Naturwissenschaften/Medizin/index.html"), "Medizin", "Forschungszweig"],
        [rel(f, FZ + "/Übersicht/Forschung.html"), "Forschungsarchiv", "Alle Forschungszweige"],
    ],
});

medienEintragen(KLASSE, { videos: { animationen: { items: [] }, videos: { items: [] } }, audio: {} });
const ZUSATZ_CSS = `
/* Knöpfe und Forschungsbaum (Regeneranten) */
.${P}-knopfreihe { display: flex; flex-wrap: wrap; gap: .5rem; }
.${P}-knopf { display: inline-flex; padding: .5rem .95rem; border: 1px solid var(--${P}-violett); border-radius: 999px; background: color-mix(in srgb, var(--${P}-violett) 14%, transparent); color: var(--${P}-text) !important; font-weight: 600; text-decoration: none; }
.${P}-knopf:hover { box-shadow: 0 0 .9rem color-mix(in srgb, var(--${P}-violett) 45%, transparent); }
.${P}-knopf--leise { border-color: var(--${P}-linie-hell); background: transparent; }
.${P}-zweig-liste { display: grid !important; grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr)); gap: .45rem !important; padding: 0; list-style: none; }
.${P}-zweig-liste li { padding: 0 !important; }
.${P}-zweig-liste li::before { display: none !important; }
.${P}-zweig-liste a { display: grid; gap: .1rem; padding: .55rem .7rem; border: 1px solid var(--${P}-linie); border-radius: 10px; background: #0f1311b3; color: var(--${P}-text) !important; text-decoration: none; }
.${P}-zweig-liste a:hover { border-color: var(--${P}-violett); }
.${P}-zweig-liste strong { color: var(--${P}-violett-hell); }
.${P}-zweig-liste span { color: var(--${P}-cyan); font: 600 .74rem/1.2 ui-monospace, Consolas, monospace; }
`;
for (const key of ["allgemeines", "biologie", "entwicklung", "heimatwelt", "gesellschaft", "politik", "geschichte", "gameplay", "forschung"]) B.reiterSeite(B.S_[key]);
const TEXTE = { Kranzhaltung: "Flache Ruhe- und Arbeitshaltung", Kuppelstand: "Aufgerichtet auf sechs Gliedern", Dreibeinstand: "Drei Glieder stützen, drei greifen", Designtafeln: "Designtafel" };
B.medienSeite(B.S_.medien, { bilder: ALLE, klang: [], modellRegion: null, texte: TEXTE });
fs.appendFileSync(path.join(ROOT, S, KLASSE + "-basis.css"), ZUSATZ_CSS);

// ---------- Hauptseite ----------
// Körperkarte: sechs Strahlen, Gehirnring, sechs Nervenknoten, zwölf optische Sinnesfelder
function koerperkarte() {
    const c = 120, arme = [], knoten = [], augen = [];
    for (let i = 0; i < 6; i++) {
        const w = (i * 60 - 90) * Math.PI / 180, x = (r) => (c + Math.cos(w) * r).toFixed(1), y = (r) => (c + Math.sin(w) * r).toFixed(1);
        const q = (w + 0.32), x2 = (c + Math.cos(q) * 78).toFixed(1), y2 = (c + Math.sin(q) * 78).toFixed(1);
        arme.push(`<path class="${P}-k-arm" d="M${x(34)} ${y(34)} Q${x2} ${y2} ${x(108)} ${y(108)}" style="--i:${i}"/>`);
        knoten.push(`<circle class="${P}-k-knoten" cx="${x(58)}" cy="${y(58)}" r="4.2"/>`);
    }
    for (let i = 0; i < 12; i++) { const w = (i * 30 - 75) * Math.PI / 180; augen.push(`<circle class="${P}-k-auge" cx="${(c + Math.cos(w) * 40).toFixed(1)}" cy="${(c + Math.sin(w) * 40).toFixed(1)}" r="2.6" style="--i:${i}"/>`); }
    return `<svg class="${P}-koerperkarte" viewBox="0 0 240 240" role="img" aria-label="Körperkarte: sechs Extremitäten, ringförmiges Gehirn, sechs Nervenknoten, zwölf optische Sinnesfelder">
                        <circle class="${P}-k-rumpf" cx="${c}" cy="${c}" r="46"/>${arme.join("")}<circle class="${P}-k-ring" cx="${c}" cy="${c}" r="22"/>${knoten.join("")}${augen.join("")}
                    </svg>`;
}
const PHASEN = [["Notfallstabilisierung", "Blutstillung, Flüssigkeit halten, lebensfähiges Gewebe schützen."], ["Wundverschluss", "Schutzgewebe entsteht, Immunzellen räumen auf."], ["Zellaktivierung", "Regenerative Zellnischen erwachen – Energie, Wasser, Baustoffe werden gebraucht."], ["Anatomischer Wiederaufbau", "Muskeln, Gefäße, Haut, Schutzplatten und Nerven wachsen nach."], ["Funktionelle Integration", "Anschluss an Kreislauf und Nervensystem."], ["Nachreifung", "Volle Belastbarkeit und Koordination – oft länger als der sichtbare Aufbau."]];
const ZEITEN = [["Kleine Wunden", "Minuten bis Stunden", 8], ["Größere Gewebeschäden", "Stunden bis Tage", 26], ["Komplexe Organschäden", "Tage bis Wochen", 48], ["Vollständige Gliedmaßen", "Wochen bis Monate", 72], ["Schwere neuronale Schäden", "Monate oder länger", 100]];
const HALTUNGEN = [
    { name: "Kranzhaltung", bild: B_("Sechs Glieder, eine Kupfernarbe"), text: "Der flache, radialsymmetrische Kranzkörper liegt eng am Boden – ohne feste Vorderseite, alle Richtungen gleich erreichbar." },
    { name: "Kuppelstand", bild: B_("vor weinrotem Himmel"), text: "Aufgerichtet auf sechs Gliedern, mit abwechselnden Stützdreiecken – stabil auf schwierigem Gelände." },
    { name: "Dreibeinstand", bild: B_("Dreibeinstand"), text: "Drei Glieder tragen, drei greifen: Gangart für gleichzeitigen Werkzeuggebrauch." },
];
const CHARTA = ["Körperliche Selbstbestimmung", "Medizinische Einwilligung", "Schutz biologischer Gewebe", "Verbot erzwungener regenerativer Experimente", "Wissenschaftliche Verantwortlichkeit", "Unabhängige Prüfung risikoreicher Verfahren", "Dokumentationspflichten", "Rechtlicher Umgang mit medizinischem Missbrauch"];
{
    const s = B.S_.hauptseite, f = s.file, S_ = B.S_;
    const L = (k) => `href="${rel(f, S_[k].file)}" data-route="${B.ROUTE(S_[k])}"`;
    const img = (b, klasse, alt = "", laden = "lazy") => `<img class="${klasse}" src="${rel(f, b.datei ?? b)}" alt="${esc(alt)}" ${laden === "eager" ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
    const kachel = (key) => `                    <a class="${P}-panel ${P}-thema" ${L(key)}>${img(S_[key].titelbild, `${P}-thema-bild`)}<span class="${P}-thema-kopf"><span class="${P}-icon" aria-hidden="true">${S_[key].icon}</span><strong>${esc(S_[key].label)}</strong></span><span class="${P}-thema-text">${esc(S_[key].text)}</span></a>`;
    const html = B.kopf(s) +
        `            <header class="${P}-hero">
                ${img(HERO, `${P}-hero-bild`, "", "eager")}
                <span class="${P}-glanz" aria-hidden="true"></span>
                <span class="${P}-narbe" aria-hidden="true"></span>
                <div class="${P}-hero-text">
                    ${B.pfad(s)}
                    <p class="${P}-kicker ${P}-kicker--linie">Speziesdossier · Biologische Spezies</p>
                    <h1>${NAME}</h1>
                    <p class="${P}-unterzeile">Eigenbezeichnung <em>Narethi</em> · <i>Hexaradialis renovans</i></p>
                    <p class="${P}-intro">Eine langlebige, sechsstrahlige Spezies, die selbst Gliedmaßen, Organe und Teile des Nervensystems wiederherstellen kann – nicht unsterblich, sondern begrenzt durch Zeit, Energie, Wasser und Baustoffe.</p>
                    <p class="${P}-hero-links"><a ${L("biologie")}>Biologie ansehen ›</a><a href="${rel(f, PLANET)}">Heimatwelt Nalvyr ›</a></p>
                </div>
            </header>
` + B.reiter(s) +
        `            <dl class="${P}-panel ${P}-kennzahlen" aria-label="Kennzahlen">
                <div><dt>Heimatwelt</dt><dd><a href="${rel(f, PLANET)}">Nalvyr</a></dd><span>Saelon-System</span></div>
                <div><dt>Lebensdauer</dt><dd>Jahrhunderte</dd><span>selten über 1.000 Jahre</span></div>
                <div><dt>Bevölkerung</dt><dd>≈ 1,2 Mrd.</dd><span>auf Nalvyr</span></div>
                <div><dt>Extremitäten</dt><dd>6</dd><span>je 4 Greifsegmente</span></div>
                <div><dt>Sinnesfelder</dt><dd>12</dd><span>optisch, rundum</span></div>
            </dl>
            <section class="${P}-panel ${P}-block ${P}-bau" aria-labelledby="bau-titel">
                <div class="${P}-bau-grafik">${koerperkarte()}
                    <ul class="${P}-legende"><li><i class="${P}-l-arm"></i>Extremität</li><li><i class="${P}-l-ring"></i>Gehirnring</li><li><i class="${P}-l-knoten"></i>Nervenknoten</li><li><i class="${P}-l-auge"></i>Sinnesfeld</li></ul>
                </div>
                <div class="${P}-bau-text">
                    ${B.titel("Ein Körper ohne Vorderseite", "Kranzkörper · Gehirnring · Rundumsicht", "✶", "bau-titel")}
                    <p>Der flache, radialsymmetrische <strong>Kranzkörper</strong> misst mit Extremitäten 1,5–2,5 m und wiegt 70–200 kg. Sechs Extremitäten mit je drei Gelenkkomplexen und vier beweglichen Endsegmenten können stützen und greifen. Ein <strong>ringförmiges Gehirn</strong> verbindet sechs Nervenknoten und zwölf optische Sinnesfelder zu einer Rundumwahrnehmung.</p>
                    <dl class="${P}-mini"><div><dt>Körperdurchmesser</dt><dd>1,5–2,5 m</dd></div><div><dt>Körpergewicht</dt><dd>70–200 kg</dd></div><div><dt>Reife</dt><dd>30–50 Erdjahre</dd></div><div><dt>Ernährung</dt><dd>Omnivor</dd></div><div><dt>Fortpflanzung</dt><dd>Simultane Zwitter</dd></div><div><dt>Nachwuchs</dt><dd>1–3 große Eier</dd></div></dl>
                    <p class="${P}-quelle">Quelle: Info_material · ${NAME} · Allgemein 1.3–1.7 · <a ${L("allgemeines")}>Mehr unter Allgemeines →</a></p>
                </div>
            </section>
            <section class="${P}-panel ${P}-block ${P}-phasen ${P}-abschnitt" aria-labelledby="phasen-titel">
                ${B.titel("Sechs Phasen der Regeneration", "Biologie 2.13–2.19", "⟡", "phasen-titel")}
                <ol class="${P}-phasen-liste">
${PHASEN.map(([t, d], i) => `                    <li style="--i:${i}"><span class="${P}-phase-nr">${i + 1}</span><strong>${t}</strong><p>${esc(d)}</p></li>`).join("\n")}
                </ol>
                <div class="${P}-zeiten">
                    <h3>Typische Regenerationszeiten bei guter Versorgung</h3>
${ZEITEN.map(([v, z, w]) => `                    <div class="${P}-zeit"><span>${v}</span><i style="--w:${w}%"></i><b>${z}</b></div>`).join("\n")}
                </div>
                <p class="${P}-quelle">Quelle: Info_material · ${NAME} · Biologie 2.13–2.19 · <a ${L("biologie")}>Mehr unter Biologie →</a></p>
            </section>
            <section class="${P}-abschnitt" aria-labelledby="haltung-titel">
                <h2 class="${P}-h2 ${P}-h2--linie" id="haltung-titel">Drei Haltungen, ein Körper</h2>
                <p class="${P}-lead">Regeneranten können Bewegungen in jede Richtung beginnen. Je nach Aufgabe wechseln sie zwischen flacher Kranzhaltung, aufgerichtetem Kuppelstand und dem Dreibeinstand mit freien Greifgliedern.</p>
                <div class="${P}-haltungen">
${HALTUNGEN.map((h) => `                    <article class="${P}-panel ${P}-haltung"><figure>${img(h.bild, "", h.name)}</figure><div><h3>${h.name}</h3><p>${esc(h.text)}</p></div></article>`).join("\n")}
                </div>
            </section>
            <section class="${P}-panel ${P}-block ${P}-charta ${P}-abschnitt" aria-labelledby="charta-titel">
                ${B.titel("Charta der Unversehrtheit", "seit rund 2.310 Jahren · Nalvyr-Konvent", "⚖", "charta-titel")}
                <p>Als Antwort auf die Gewebekrise schützt die Charta grundlegende medizinische und körperliche Rechte. Der Nalvyr-Konvent koordiniert überregionale Aufgaben zwischen regionalen Staaten und autonomen Gemeinschaften.</p>
                <ol class="${P}-charta-liste">
${CHARTA.map((c) => `                    <li>${esc(c)}</li>`).join("\n")}
                </ol>
                <p class="${P}-quelle">Quelle: Info_material · ${NAME} · Politik 5.9 · <a ${L("politik")}>Mehr unter Politik →</a></p>
            </section>
            <div class="${P}-zwei">
                ${B.dossierSteckbrief(s, { datei: "Allgemein/Allgemein", steckbrief: ["Steckbrief"], beschreibung: ["Speziesdefinition"], mehr: "allgemeines" })}
                <aside class="${P}-panel ${P}-welt" aria-labelledby="welt-titel">
                    <a class="${P}-welt-bild" href="${rel(f, PLANET)}">${img(PLANETBILD, "", "Nalvyr aus dem All")}</a>
                    <div class="${P}-block">
                        ${B.titel("Heimatwelt Nalvyr", "Saelon-System", "◍", "welt-titel")}
                        <p>Alte, biologisch vielfältige Welt mit den Kontinenten Vaelor und Ishkar, dem Tessal-Archipel und starken Gezeiten. Am Himmel: der Mond Oris und der Weiße Zwerg Saelon B.</p>
                        <dl class="${P}-mini"><div><dt>Stern</dt><dd>Saelon, K2 V</dd></div><div><dt>Abstand</dt><dd>0,76 AE</dd></div><div><dt>Jahr</dt><dd>267,2 Erdtage</dd></div><div><dt>Tag</dt><dd>26 h</dd></div><div><dt>Mond</dt><dd>Oris</dd></div><div><dt>Wasser</dt><dd>57 %</dd></div></dl>
                        <p class="${P}-knopfreihe"><a class="${P}-knopf" href="${rel(f, PLANET)}">Planetendossier ›</a><a class="${P}-knopf" href="${rel(f, SYSTEMSEITE)}">Systemübersicht</a><a class="${P}-knopf ${P}-knopf--leise" href="${rel(f, KARTE)}${SYSTEM}">Sternenkarte ›</a><a class="${P}-knopf ${P}-knopf--leise" ${L("heimatwelt")}>Heimatwelt-Kapitel ›</a></p>
                    </div>
                </aside>
            </div>
            <section class="${P}-themen ${P}-abschnitt" aria-labelledby="themen-titel">
                <h2 class="${P}-h2 ${P}-h2--linie" id="themen-titel">Themenbereiche</h2>
                <div class="${P}-themen-raster">
${["allgemeines", "biologie", "entwicklung", "heimatwelt", "gesellschaft", "politik", "geschichte", "gameplay"].map(kachel).join("\n")}
                </div>
            </section>
            <section class="${P}-panel ${P}-block ${P}-karussell-block ${P}-abschnitt" id="bildarchiv" aria-labelledby="bildarchiv-titel">
                ${B.titel("Bildarchiv", ALLE.length + " Motive", "▣", "bildarchiv-titel")}
                ${B.karussell(f, ALLE, { buehne: true, filter: true, autoplay: 7000, texte: TEXTE })}
            </section>
            <div class="${P}-layout ${P}-layout--fuss">
                <div class="${P}-inhalt">
                    ${B.verknuepfungen(s)}
                    ${B.quelle("Info_material · Regeneranten · Speziesdossier 4.0")}
                </div>
            </div>
` + B.fuss();
    write(f, html);
    write(f.replace(/\.html$/, ".js"), `// Regeneranten – Hauptseite · erzeugt von scripts/spezies/eigene/regeneranten.mjs\n// Gemeinsame Funktionen (Topbar, Sidebar, Routen, Klappbereiche, Bildkarussell mit Großansicht) kommen aus der Basis.\nimport "../regeneranten-basis.js";\n`);
    write(f.replace(/\.html$/, ".css"), fs.readFileSync(path.join(ROOT, "scripts/spezies/eigene/regeneranten-hauptseite.css"), "utf8"));
}

// ---------- Übersichtskarte der Gruppe ----------
{
    const datei = path.join(ROOT, UEBERSICHT);
    const t = fs.readFileSync(datei, "utf8");
    const kopf = t.indexOf("<h2>Regeneranten</h2>");
    const start = t.lastIndexOf('<section class="species-category"', kopf);
    const ende = t.indexOf("</section>", kopf) + "</section>".length;
    if (kopf < 0 || start < 0) throw new Error("Übersichtskarte nicht gefunden");
    const id = (t.slice(start, kopf).match(/id="([^"]+)"/) ?? [0, "kategorie-19"])[1];
    const karte = `<section class="species-category" id="${id}" data-world="Nalvyr" data-habitat="Flussdeltas, Küsten, Wälder und Hochländer">
        <img src="${rel(UEBERSICHT, HERO.datei)}" alt="" loading="lazy">
        <div><h2>Regeneranten</h2><div class="species-card-columns">
          <dl><div><dt>Heimatwelt</dt><dd>Nalvyr</dd></div><div><dt>Körpergröße</dt><dd>1,5–2,5 m Durchmesser</dd></div><div><dt>Lebensdauer</dt><dd>Mehrere Jahrhunderte</dd></div><div><dt>Lebensraum</dt><dd>Flussdeltas, Küsten, Wälder und Hochländer</dd></div></dl>
          <div class="species-card-copy"><p>Außergewöhnliche Regeneration</p><a href="../Regeneranten/hauptseite/Spezies.html" data-route="${R0}">Dossier öffnen →</a></div>
        </div></div>
      </section>`;
    fs.writeFileSync(datei, t.slice(0, start) + karte + t.slice(ende));
}
console.log(`${NAME} fertig: ${SEITEN.length} Seiten · ${ALLE.length} Bilder`);
