// Spezies-Baukasten · eigenes Bauskript (eigene Hauptseite). Aufruf: node scripts/spezies/eigene/metamorphen.mjs
// Baut die Seiten der Metamorphen (Ordner „Meta Morphen“) im Speziesstandard: Texte wörtlich aus Info_material (Dossier V4.1),
// Bilder aus dem Bildarchiv, Heimatwelt Karynth mit Planetendossier und Ysmeroth-System in der Sternenkarte verknüpft.
import fs from "node:fs";
import path from "node:path";
import { ROOT, FZ, esc, rel, write, exists, read, erstelle, medienEintragen } from "../bibliothek.mjs";
import { baueBasis } from "../basis.mjs";

const NAME = "Metamorphen", KLASSE = "metamorphen", P = "mm", R0 = "spezies-biological-18";
const S = "inhalte/spezies/Biologische Spezies/Meta Morphen";
const INFO = "Info_material/Alle_spezies_daten/Biologische Spezies/Meta Morphen";
const A = "assets/bilder/Alle Spezies+Übersicht/Biologische Spezies/Meta Morphen";
const PLANET = "inhalte/himmelskoerper/planeten/details/karynth/hauptseite/index.html";
const PLANETBILD = "assets/bilder/Himmelskörper/OzeanWelt/karynth/hauptseite/mineral-ozeanwelt-mit-kristallkusten-5a5c20de24.webp";
const KARTE = "Menüs/Sternenkarte/Sternenkarte.html", SYSTEM = "?system=karynth-stern";
const UEBERSICHT = "inhalte/spezies/Biologische Spezies/Übersichtsseite biologische spezies/Uebersicht.html";
for (const f of [PLANET, PLANETBILD, KARTE]) if (!exists(f)) throw new Error("Fehlt: " + f);

baueBasis({
    ordner: "Meta Morphen", praefix: P, klasse: KLASSE, name: NAME, design: "Meta Morphen/gesamtdarstellung/Purpurne Aporia-Metamorphe mit doppelter Mittelnaht-4.png", motto: "„Ein Bewusstsein, viele Körper“",
    farben: { bg: "#0b0709", glas: "#171014", glashell: "#1f161b", linie: "#d9667f", liniehell: "#ec8ca0", akzent: "#e07a8f", akzenthell: "#ffd6de", zweit: "#e8d3a8", text: "#f3ece8", leise: "#b5a8a8", tint: "#8a3a4a", glaslicht: "#24171c", glasdunkel: "#0b0709", glow1: "#a8324e", glow2: "#c9a96a", glow3: "#4a2a5a", rahmen: "#100a0c", knopf: "#22161b", reiter: "#150e11", flaeche: "#140d10", kachel: "#110b0d", herobg: "#0d080a", aktiv1: "#5a1f2c", aktiv2: "#2e1018", h1: "#fff4f1", intro: "#e4d8d4", zoombg: "#060404" },
});

// ---------- Bilder ----------
const G = A + "/gesamtdarstellung/";
const alle = fs.readdirSync(path.join(ROOT, G)).filter((x) => /\.(png|jpe?g|webp)$/i.test(x)).sort((a, b) => a.localeCompare(b, "de", { numeric: true }));
const KORSAREN = /Korsar|Enterlotse|Reliquienschmuggler|Schleusenknacker|Sichelmeister|Sternendiamant|Sternenkorsarin|Freibeuterin|Weltraumpiratin|Ätherpirat/;
const titel = (x) => x.replace(/\.(png|jpe?g)$/i, "").replace(/-\d+$/, "").replace(/^APORIA[_ -]+/i, "").trim();
const KOERPER = alle.filter((x) => /-\d+\.png$/.test(x) && !KORSAREN.test(x)).map((x) => ({ datei: G + x, titel: titel(x), kategorie: "Körperformen" }));
const KORS = alle.filter((x) => KORSAREN.test(x)).map((x) => ({ datei: G + x, titel: titel(x), kategorie: "Außerplanetare Gemeinschaften" }));
const dnr = (x) => (x.match(/design(A\d)/) ?? [0, ""])[1] + String((x.match(/\((\d+)\)/) ?? [0, 0])[1]).padStart(2, "0");
const DESIGNS = alle.filter((x) => /Metamorphendesign/.test(x)).sort((a, b) => dnr(a).localeCompare(dnr(b))).map((x) => ({ datei: G + x, titel: `${/A4/.test(x) ? "Designtafel A4" : "Gestaltentwurf A3"} · ${Number((x.match(/\((\d+)\)/) ?? [0, 0])[1]) + 1}`, kategorie: /A4/.test(x) ? "Designtafeln" : "Gestaltentwürfe" }));
const REFS = alle.filter((x) => /\.jpe?g$/i.test(x)).map((x, i) => ({ datei: G + x, titel: `Stimmungsreferenz ${i + 1}`, kategorie: "Referenzen" }));
const ALLE = [...KOERPER, ...DESIGNS, ...KORS, ...REFS];
if (KOERPER.length < 15 || DESIGNS.length < 12) throw new Error("Bilder fehlen");
const B_ = (teil) => { const b = ALLE.find((x) => x.datei.includes(teil)); if (!b) throw new Error("Bild fehlt: " + teil); return b; };
const HERO = B_("Purpurne Aporia-Metamorphe"), D = (n) => DESIGNS[n];
const A4 = DESIGNS.filter((d) => d.kategorie === "Designtafeln"), A3 = DESIGNS.filter((d) => d.kategorie === "Gestaltentwürfe");

// ---------- Seiten ----------
const GESCHICHTE = ["Früheste intelligente Gemeinschaften", "Erste Hochgesellschaften", "Der Erste Fall", "Das Zeitalter der Kernhäuser", "Die Körperkriege", "Die dritte Hochphase", "Die Stille der Netze", "Die Ära der Verschlossenen Schwellen", "Entwicklung der Raumfahrt", "Interstellare Expansion", "Kontakte mit anderen intelligenten Spezies", "Entwicklung der modernen Zivilisation"];
const HW = S + "/Unterseiten/Heimatwelt/heimatwelt.html", FO = S + "/Forschung/forschung.html";
const karynthKarte = {
    titel: "Karynth im Planetenarchiv", quelle: "Planetenarchiv · Karynth · Ysmeroth-System (Sternenkarte)",
    html: `<p>Das vollständige Planetendossier von Karynth – mit Gezeitensystem, Kontinenten, Biosphäre, Städten und Ruinen – liegt im Planetenarchiv. Das Ysmeroth-System mit seinem roten Begleitstern ist in der Sternenkarte eingetragen.</p>
<p class="${P}-knopfreihe"><a class="${P}-knopf" href="${rel(HW, PLANET)}">Planetendossier Karynth öffnen ›</a><a class="${P}-knopf ${P}-knopf--leise" href="${rel(HW, KARTE)}${SYSTEM}">Ysmeroth-System in der Sternenkarte ›</a></p>`,
};
// Forschungsfelder 6.2–6.36 → vorhandene Forschungszweige
const ZWEIGE = [
    ["Spezialisierte und erweiterte Forschung/Bewusstseins- und neuronale Vernetzungsforschung", "Neurowissenschaft", "6.2–6.7, 6.15, 6.29"],
    ["Spezialisierte und erweiterte Forschung/Morphologie und Transformationsforschung", "Morphologie", "6.8–6.11"],
    ["Naturwissenschaften/Genetik und Biotechnologie", "Genetik & Biotechnologie", "6.12–6.14"],
    ["Naturwissenschaften/Medizin", "Medizin", "6.18–6.22"],
    ["Xenoforschung/Xenomedizin", "Xenomedizin", "6.16, 6.18"],
    ["Xenoforschung/Xenobiologie", "Xenobiologie", "6.17, 6.31"],
    ["Naturwissenschaften/Biologie", "Biologie", "6.10, 6.31, 6.34"],
    ["Technologie und Ingenieurwesen/Maschinenbau und Ingenieurwissenschaften", "Kernversorgungstechnik", "6.23, 6.24"],
    ["Technologie und Ingenieurwesen/Informatik und Informationstechnologie", "Informationssicherheit & Netze", "6.25–6.28"],
    ["Raum- und Planetensysteme/Planetologie und Geowissenschaften", "Planetologie", "6.33"],
    ["Umwelt, Leben und Ressourcen/Umwelt- und Ökosystemforschung", "Ökologie", "6.34"],
    ["Gesellschaft und Kultur/Geschichts- und Archäologieforschung", "Archäologie & Archäotechnologie", "6.32, 6.35, 6.36"],
    ["Gesellschaft und Kultur/Kultur- und Geisteswissenschaften", "Neuroethik", "6.30"],
];
for (const [z] of ZWEIGE) if (!exists(FZ + "/" + z + "/index.html")) throw new Error("Zweig fehlt: " + z);
const zweigKarte = {
    titel: "Einordnung in den Forschungsbaum", quelle: "Forschungsarchiv · Zuordnung der Forschungsfelder 6.2–6.36",
    html: `<p>Die Forschungsfelder rund um die Metamorphen gehören zu diesen vorhandenen Forschungszweigen:</p>
<ul class="${P}-zweig-liste">${ZWEIGE.map(([z, t, f]) => `<li><a href="${rel(FO, FZ + "/" + z + "/index.html")}"><strong>${esc(t)}</strong><span>${esc(f)}</span></a></li>`).join("")}</ul>`,
};

const SEITEN = [
    { key: "hauptseite", suffix: "", label: "Übersicht", file: S + "/hauptseite/Spezies.html", icon: "◎" },
    { key: "allgemeines", suffix: "-allgemeines", label: "Allgemeines", file: S + "/Unterseiten/Allgemeines/allgemeines.html", icon: "ⓘ", text: "Identität, Körpervielfalt, Lebensweise und Stellung in APORIA", titelbild: B_("Ockerner Aporia-Metamorph"),
        quellen: ["Allgemein/Allgemein", "01_Speziesdaten/speziesdaten.md"], galerie: KOERPER.slice(0, 6) },
    { key: "biologie", suffix: "-biologie", label: "Biologie", file: S + "/Unterseiten/Biologie/biologie.html", icon: "⟡", text: "Bewusstseinskern, Eigenkörper, Somakeime und Körperwechsel", titelbild: B_("Kugelkreatur"),
        quellen: ["Biologie/Biologie"], galerie: [...KOERPER.slice(6, 14), A4[0]] },
    { key: "entwicklung", suffix: "-entwicklung", label: "Entwicklung", file: S + "/Unterseiten/Entwicklung/entwicklung.html", icon: "⤳", text: "Modulare Vorfahren, Fremdkopplung und Genetik", titelbild: B_("Tunnelgräber"),
        quellen: [{ datei: "02_Geschichte_Entwicklung/entwicklung.md", ohne: GESCHICHTE, hinweis: "Biologische Entwicklung" }], galerie: KOERPER.slice(10, 16) },
    { key: "heimatwelt", suffix: "-heimatwelt", label: "Heimatwelt", file: HW, icon: "◍", text: "Karynth im Ysmeroth-System – Gezeiten, Nebel und Höhlen", titelbild: B_("Gezeitenmulde"),
        design: [karynthKarte], quellen: ["05_Heimatwelt/heimatwelt-referenz.md"], galerie: [B_("Gezeitenmulde"), B_("Möbius"), B_("Tunnelgräber"), B_("Stelzengänger"), B_("Keilwesen")] },
    { key: "gesellschaft", suffix: "-gesellschaft", label: "Gesellschaft", file: S + "/Unterseiten/Gesellschaft/gesellschaft.html", icon: "⁂", text: "Familien, Kernhäuser, Körpergärten und Kultur", titelbild: B_("Knotenrufer"),
        quellen: ["03_Gesellschaft_Kultur/gesellschaft.md", "03_Gesellschaft_Kultur/kultur.md"], galerie: [...A3, B_("Faltenleserin"), B_("Brunnengängerin")] },
    { key: "politik", suffix: "-politik", label: "Politik", file: S + "/Unterseiten/Politik/politik.html", icon: "⚖", text: "Rat der Schwellen, Großgemeinschaften und Außenbeziehungen", titelbild: A3[0],
        quellen: ["04_Politik_Fraktionsbeziehungen/politik.md", "04_Politik_Fraktionsbeziehungen/fraktionsbeziehungen.md"], galerie: [...KORS.slice(0, 6)] },
    { key: "geschichte", suffix: "-geschichte", label: "Geschichte", file: S + "/Unterseiten/Geschichte/geschichte.html", icon: "⧗", text: "Hochgesellschaften, Körperkriege und die Stille der Netze", titelbild: B_("Sichelmeister"),
        quellen: [{ datei: "02_Geschichte_Entwicklung/entwicklung.md", nur: GESCHICHTE, hinweis: "Historische Entwicklung" }, "02_Geschichte_Entwicklung/geschichte.md"], galerie: [B_("Sichelmeister"), B_("Purpurne"), ...KORS.slice(6)] },
    { key: "gameplay", suffix: "-gameplay", label: "Spielintegration", file: S + "/Gameplay/gameplay.html", icon: "◈", text: "Körperinventar, Körperwechsel und Fremdkopplung im Spiel", titelbild: A4[1],
        quellen: [{ datei: "Gameplay/.gitkeep", ohne: ["Forschungssystem"] }], galerie: A4.slice(0, 7) },
    { key: "forschung", suffix: "-forschung", label: "Forschung", file: FO, icon: "⚗", text: "Neurologie, Morphogenetik, Kernmedizin und Archäotechnologie", titelbild: A4[3],
        design: [zweigKarte], quellen: ["Forschung/.gitkeep", { datei: "Gameplay/.gitkeep", nur: ["Forschungssystem"], hinweis: "Spielintegration" }] },
    { key: "medien", suffix: "-medien", label: "Medien", file: S + "/Unterseiten/Medien/medien.html", icon: "▣", text: "Bildarchiv, Klänge, Bewegtbild und Modelle", titelbild: B_("Windgleiter"), quellen: [] },
];

// Seiten-CSS/-JS der Standardvorlage durch eigene ersetzen (Sicherung liegt vor)
for (const s of SEITEN) for (const e of [".css", ".js"]) { const f = s.file.replace(/\.html$/, e); if (exists(f) && /Spezies-Baukasten \(scripts\/spezies\)/.test(read(f))) fs.unlinkSync(path.join(ROOT, f)); }

const B = erstelle({
    S, INFO, A, NAME, KLASSE, P, R0, THEME: "#0b0709", SEITEN, REGION: {},
    BESCHREIBUNG: "Metamorphen im APORIA-Weltenarchiv: intelligente multikorporale Spezies – ein Bewusstseinskern, viele Eigenkörper. Heimatwelt Karynth.",
    links: (f, S_, rel) => [
        [rel(f, PLANET), "Planetendossier Karynth", "Heimatwelt im Planetenarchiv"],
        [rel(f, KARTE) + SYSTEM, "Ysmeroth-System", "In der Sternenkarte ansehen"],
        [rel(f, S_.forschung.file), "Forschung", "Forschung an den Metamorphen", `data-route="${R0}-forschung"`],
        [rel(f, FZ + "/Spezialisierte und erweiterte Forschung/Morphologie und Transformationsforschung/index.html"), "Morphologie", "Forschungszweig"],
        [rel(f, FZ + "/Übersicht/Forschung.html"), "Forschungsarchiv", "Alle Forschungszweige"],
    ],
});

medienEintragen(KLASSE, { videos: { animationen: { items: [] }, videos: { items: [] } }, audio: {} });
const ZUSATZ_CSS = `
/* Knöpfe und Forschungsbaum (Metamorphen) */
.${P}-knopfreihe { display: flex; flex-wrap: wrap; gap: .5rem; }
.${P}-knopf { display: inline-flex; padding: .5rem .95rem; border: 1px solid var(--${P}-violett); border-radius: 999px; background: color-mix(in srgb, var(--${P}-violett) 14%, transparent); color: var(--${P}-text) !important; font-weight: 600; text-decoration: none; }
.${P}-knopf:hover { box-shadow: 0 0 .9rem color-mix(in srgb, var(--${P}-violett) 45%, transparent); }
.${P}-knopf--leise { border-color: var(--${P}-linie-hell); background: transparent; }
.${P}-zweig-liste { display: grid !important; grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr)); gap: .45rem !important; padding: 0; list-style: none; }
.${P}-zweig-liste li { padding: 0 !important; }
.${P}-zweig-liste li::before { display: none !important; }
.${P}-zweig-liste a { display: grid; gap: .1rem; padding: .55rem .7rem; border: 1px solid var(--${P}-linie); border-radius: 10px; background: #140d10b3; color: var(--${P}-text) !important; text-decoration: none; }
.${P}-zweig-liste a:hover { border-color: var(--${P}-violett); }
.${P}-zweig-liste strong { color: var(--${P}-violett-hell); }
.${P}-zweig-liste span { color: var(--${P}-cyan); font: 600 .74rem/1.2 ui-monospace, Consolas, monospace; }
`;
for (const key of ["allgemeines", "biologie", "entwicklung", "heimatwelt", "gesellschaft", "politik", "geschichte", "gameplay", "forschung"]) B.reiterSeite(B.S_[key]);
const TEXTE = { "Körperformen": "Körperstudie · Bildarchiv", Designtafeln: "Designtafel", "Gestaltentwürfe": "Gruppenentwurf", "Außerplanetare Gemeinschaften": "Freibeuter und Wanderverbände", Referenzen: "Stimmungsreferenz" };
B.medienSeite(B.S_.medien, { bilder: ALLE, klang: [], modellRegion: null, texte: TEXTE });
fs.appendFileSync(path.join(ROOT, S, KLASSE + "-basis.css"), ZUSATZ_CSS);

// ---------- Hauptseite ----------
const GRUPPEN = [
    { name: "Bewegungsformen", bild: B_("Schrittwechsel"), mass: "ca. 0,8–4 m", text: "Allgemein verwendbare Körper mit vielseitigen Bewegungsorganen – zwei-, vier-, sechs- oder vielgliedrig." },
    { name: "Panzerformen", bild: B_("Kugelkreatur"), mass: "schwer, mehrgliedrig", text: "Massive Eigenkörper mit verstärkten Schutzgeweben für schwere Belastungen und gefährliche Umgebungen." },
    { name: "Radialformen", bild: B_("heller Doppelnaht"), mass: "zentraler Rumpf", text: "Greif-, Bewegungs- und Sinnesorgane rund um einen zentralen Abschnitt – für komplexe räumliche Arbeiten." },
    { name: "Langgliedformen", bild: B_("Stelzengänger"), mass: "hoch aufragend", text: "Verlängerte Gliedmaßen und erhöhte Sinnesorgane für Wälder, Felsregionen und vertikale Bewegung." },
    { name: "Aquatische Formen", bild: B_("Gezeitenmulde"), mass: "bis sehr lang", text: "Flossen, Strömungsorgane und passende Atmungsstrukturen – vollständig aquatisch oder amphibisch." },
    { name: "Klein- und Sensorformen", bild: B_("Keilwesen"), mass: "wenige Dezimeter", text: "Kompakte Körper mit spezialisiertem Wahrnehmungsapparat für Erkundung, Forschung und enge Räume." },
];
const BUENDE = [
    ["Kernkonvente", "Aus Kernhäusern und medizinischen Verbänden entstanden; Schutz von Identität und Selbstbestimmung."],
    ["Gezeitenbünde", "Küsten und Feuchtgebiete; Gewässerverwaltung und Schutz der Neurokontaktfauna."],
    ["Hochlandverbände", "Felsige Regionen, große Bauwerke und schwere Körperformen; lange Selbstständigkeit."],
    ["Tiefengemeinschaften", "Unterirdische Lebensräume mit gemeinsam verwalteter Luft, Wasser und Energie."],
    ["Wanderverbände", "Mobile Gemeinschaften mit mobiler Kernversorgung; wichtig für den Handel."],
];
{
    const s = B.S_.hauptseite, f = s.file, S_ = B.S_;
    const L = (k) => `href="${rel(f, S_[k].file)}" data-route="${B.ROUTE(S_[k])}"`;
    const img = (b, klasse, alt = "", laden = "lazy") => `<img class="${klasse}" src="${rel(f, b.datei ?? b)}" alt="${esc(alt)}" ${laden === "eager" ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
    const kachel = (key) => `                    <a class="${P}-panel ${P}-thema" ${L(key)}>${img(S_[key].titelbild, `${P}-thema-bild`)}<span class="${P}-thema-kopf"><span class="${P}-icon" aria-hidden="true">${S_[key].icon}</span><strong>${esc(S_[key].label)}</strong></span><span class="${P}-thema-text">${esc(S_[key].text)}</span></a>`;
    const gruppe = (g, i) => `                    <article class="${P}-panel ${P}-gruppe">
                        <figure class="${P}-gruppe-bild">${img(g.bild, "", g.name)}<span class="${P}-gruppe-nr">${String(i + 1).padStart(2, "0")}</span></figure>
                        <div class="${P}-gruppe-text"><h3>${g.name}</h3><p>${esc(g.text)}</p><span class="${P}-gruppe-mass">${esc(g.mass)}</span></div>
                    </article>`;
    const html = B.kopf(s) +
        `            <header class="${P}-hero">
                ${img(HERO, `${P}-hero-bild`, "", "eager")}
                <span class="${P}-glanz" aria-hidden="true"></span>
                <span class="${P}-naht" aria-hidden="true"><i></i><i></i></span>
                <div class="${P}-hero-text">
                    ${B.pfad(s)}
                    <p class="${P}-kicker ${P}-kicker--linie">Speziesdossier · Biologische Spezies</p>
                    <h1>${NAME}</h1>
                    <p class="${P}-unterzeile">Ein Bewusstsein · viele Körper</p>
                    <p class="${P}-intro">Eine hochintelligente Spezies, deren Persönlichkeit in einem zentralen Bewusstseinskern lebt – und die mehrere sehr unterschiedliche, oft monströs wirkende Eigenkörper besitzt und wechselt.</p>
                    <p class="${P}-hero-links"><a ${L("biologie")}>Biologie ansehen ›</a><a href="${rel(f, PLANET)}">Heimatwelt Karynth ›</a></p>
                </div>
            </header>
` + B.reiter(s) +
        `            <dl class="${P}-panel ${P}-kennzahlen" aria-label="Kennzahlen">
                <div><dt>Heimatwelt</dt><dd><a href="${rel(f, PLANET)}">Karynth</a></dd><span>Ysmeroth-System</span></div>
                <div><dt>Lebensspanne</dt><dd>180–450</dd><span>Erdjahre</span></div>
                <div><dt>Bevölkerung</dt><dd>≈ 2 Mrd.</dd><span>Bewusstseinskerne</span></div>
                <div><dt>Körpergruppen</dt><dd>6</dd><span>anatomische Hauptgruppen</span></div>
                <div><dt>Großgemeinschaften</dt><dd>5</dd><span>und der Rat der Schwellen</span></div>
            </dl>
            <section class="${P}-panel ${P}-block ${P}-kern" aria-labelledby="kern-titel">
                <div class="${P}-kern-grafik" aria-hidden="true">
                    <span class="${P}-kern-mitte">Bewusst&shy;seins&shy;kern</span>
${GRUPPEN.map((g, i) => `                    <span class="${P}-kern-koerper" style="--i:${i}">${esc(g.name.replace(/formen$/, ""))}</span>`).join("\n")}
                </div>
                <div class="${P}-kern-text">
                    ${B.titel("Ein Bewusstsein, viele Körper", "Kernkapsel · Eigenkörper · Kopplung", "◎", "kern-titel")}
                    <p>Persönlichkeit, Erinnerungen und Entscheidungen liegen im <strong>Bewusstseinskern</strong>, geschützt in einer Kernkapsel. Über neurologische Schnittstellen steuert er wechselnde <strong>Eigenkörper</strong>, die aus Somakeimen heranwachsen – gebunden an die genetischen Körperprogramme des Individuums.</p>
                    <ul class="${P}-fakten-liste">
                        <li><b>Dieselbe Person</b>Ein Metamorph bleibt er selbst, gleich welchen Körper er benutzt.</li>
                        <li><b>Keine freie Verwandlung</b>Nicht jede Gestalt ist möglich – nur vorhandene Körperprogramme.</li>
                        <li><b>Begrenzte Fremdkopplung</b>Fremde Organismen nur bei biologischer Kompatibilität; bewusste Wirte behalten ihre Rechte.</li>
                    </ul>
                    <p class="${P}-quelle">Quelle: Info_material · ${NAME} · Allgemein 1.2–1.5 · Biologie 2.2–2.19 · <a ${L("biologie")}>Mehr unter Biologie →</a></p>
                </div>
            </section>
            <section class="${P}-abschnitt" aria-labelledby="gruppen-titel">
                <h2 class="${P}-h2 ${P}-h2--linie" id="gruppen-titel">Die sechs anatomischen Hauptgruppen</h2>
                <p class="${P}-lead">Funktionale Kategorien, keine getrennten Spezies: Große, gepanzerte, vieläugige Körper können friedlichen Wissenschaftlern, Eltern oder Händlern gehören – Körperform sagt nichts über Rang oder Gefährlichkeit.</p>
                <div class="${P}-gruppen">
${GRUPPEN.map(gruppe).join("\n")}
                </div>
            </section>
            <section class="${P}-panel ${P}-block ${P}-buende ${P}-abschnitt" aria-labelledby="buende-titel">
                ${B.titel("Großgemeinschaften Karynths", "Rat der Schwellen · Sitz Thal-Keryn", "⚖", "buende-titel")}
                <div class="${P}-buende-raster">
                    <article class="${P}-rat"><strong>Rat der Schwellen</strong><p>Wichtigste überregionale Institution – zuständig für planetare Sicherheit, gemeinsame Forschung, Schutz der Ursprungsgebiete und ausgewählte interstellare Beziehungen. Keine Weltregierung.</p></article>
${BUENDE.map(([n, t]) => `                    <article class="${P}-bund"><strong>${n}</strong><p>${esc(t)}</p></article>`).join("\n")}
                </div>
                <p class="${P}-quelle">Quelle: Info_material · ${NAME} · Politik 5.2–5.10 · <a ${L("politik")}>Mehr unter Politik →</a></p>
            </section>
            <div class="${P}-zwei">
                ${B.dossierSteckbrief(s, { datei: "Allgemein/Allgemein", steckbrief: ["Speziesübersicht"], beschreibung: ["Allgemeine Speziesbeschreibung"], mehr: "allgemeines" })}
                <aside class="${P}-panel ${P}-welt" aria-labelledby="welt-titel">
                    <a class="${P}-welt-bild" href="${rel(f, PLANET)}">${img(PLANETBILD, "", "Karynth aus dem All")}</a>
                    <div class="${P}-block">
                        ${B.titel("Heimatwelt Karynth", "Ysmeroth-System", "◍", "welt-titel")}
                        <p>Alte, wasserreiche Gesteinswelt mit drei Kontinenten, nebelreichen Gezeitenlandschaften und gewaltigen Höhlen. Über ihr zwei Monde – und der rote Begleitstern Ysmeroth B.</p>
                        <dl class="${P}-mini"><div><dt>Stern</dt><dd>Ysmeroth, K2 V</dd></div><div><dt>Abstand</dt><dd>0,72 AE</dd></div><div><dt>Jahr</dt><dd>249,5 Erdtage</dd></div><div><dt>Tag</dt><dd>29 h</dd></div><div><dt>Monde</dt><dd>Veyr, Orun</dd></div><div><dt>Wasser</dt><dd>65 %</dd></div></dl>
                        <p class="${P}-knopfreihe"><a class="${P}-knopf" href="${rel(f, PLANET)}">Planetendossier ›</a><a class="${P}-knopf ${P}-knopf--leise" href="${rel(f, KARTE)}${SYSTEM}">Sternenkarte ›</a><a class="${P}-knopf ${P}-knopf--leise" ${L("heimatwelt")}>Heimatwelt-Kapitel ›</a></p>
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
                    ${B.quelle("Info_material · Metamorphen · Speziesdossier V4.1")}
                </div>
            </div>
` + B.fuss();
    write(f, html);
    write(f.replace(/\.html$/, ".js"), `// Metamorphen – Hauptseite · erzeugt von scripts/spezies/eigene/metamorphen.mjs\n// Gemeinsame Funktionen (Topbar, Sidebar, Routen, Klappbereiche, Bildkarussell mit Großansicht) kommen aus der Basis.\nimport "../metamorphen-basis.js";\n`);
    write(f.replace(/\.html$/, ".css"), fs.readFileSync(path.join(ROOT, "scripts/spezies/eigene/metamorphen-hauptseite.css"), "utf8"));
}

// ---------- Übersichtskarte der Gruppe ----------
{
    const datei = path.join(ROOT, UEBERSICHT);
    const t = fs.readFileSync(datei, "utf8");
    const start = t.indexOf('<section class="species-category" id="kategorie-18"');
    const ende = t.indexOf("</section>", start) + "</section>".length;
    if (start < 0 || !t.slice(start, ende).includes("<h2>Meta Morphen</h2>")) throw new Error("Übersichtskarte nicht gefunden");
    const karte = `<section class="species-category" id="kategorie-18" data-world="Karynth" data-habitat="Küsten, Höhlen, Hochländer und Kernstädte">
        <img src="${rel(UEBERSICHT, HERO.datei)}" alt="" loading="lazy">
        <div><h2>Meta Morphen</h2><div class="species-card-columns">
          <dl><div><dt>Heimatwelt</dt><dd>Karynth</dd></div><div><dt>Körpergröße</dt><dd>Wenige Dezimeter bis große Spezialkörper</dd></div><div><dt>Lebensdauer</dt><dd>ca. 180–450 Erdjahre</dd></div><div><dt>Lebensraum</dt><dd>Küsten, Höhlen, Hochländer und Kernstädte</dd></div></dl>
          <div class="species-card-copy"><p>Wechseln zwischen Körperformen</p><a href="../Meta%20Morphen/hauptseite/Spezies.html" data-route="${R0}">Dossier öffnen →</a></div>
        </div></div>
      </section>`;
    fs.writeFileSync(datei, t.slice(0, start) + karte + t.slice(ende));
}
console.log(`${NAME} fertig: ${SEITEN.length} Seiten · ${ALLE.length} Bilder`);
