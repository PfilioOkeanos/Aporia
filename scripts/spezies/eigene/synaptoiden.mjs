// Spezies-Baukasten · eigenes Bauskript (eigene Hauptseite). Aufruf: node scripts/spezies/eigene/synaptoiden.mjs
// Baut die Seiten der Synaptoiden (Tavari) im Speziesstandard: Texte wörtlich aus Info_material (Version 2.0, Terev-System 1.0),
// Bilder aus dem Bildarchiv (gesamtdarstellung, entwicklungsstadien, Heimatwelt), Heimatwelt Nerath mit Planetendossier und Terev-System verknüpft.
// Farbführung nach den Designtafeln: Moos-Schwarz, Bernstein (glühende Kontaktfächer), Lila (schillernde Lamellen).
// Neue Bilder in den Ordnern werden beim nächsten Lauf automatisch übernommen.
import fs from "node:fs";
import path from "node:path";
import { ROOT, FZ, esc, rel, write, exists, read, erstelle, medienEintragen } from "../bibliothek.mjs";
import { baueBasis } from "../basis.mjs";

const NAME = "Synaptoiden", KLASSE = "synaptoiden", P = "sy", R0 = "spezies-mental-4";
const GRUPPE = { name: "Mentale Spezies", route: "spezies-mental", uebersicht: "inhalte/spezies/Mentale Spezies/Übersichtsseite Mentale Spezies/Uebersicht.html" };
const S = "inhalte/spezies/Mentale Spezies/Synaptoiden";
const INFO = "Info_material/Alle_spezies_daten/Mentale Spezies/Synaptoiden";
const A = "assets/bilder/Alle Spezies+Übersicht/Mentale Spezies/Synaptoiden";
const PLANET = "inhalte/himmelskoerper/planeten/details/nerath/hauptseite/index.html";
const PLANETBILD = "assets/bilder/Himmelskörper/OzeanWelt/nerath/hauptseite/turkisfarbene-flachmeerwelt-im-all-2598a62508.webp";
const SYSTEMSEITE = "inhalte/himmelskoerper/sternensysteme/details/terev-system/hauptseite/index.html";
const KARTE = "Menüs/Sternenkarte/Sternenkarte.html", SYSTEM = "?system=nerath-stern";
for (const f of [PLANET, PLANETBILD, SYSTEMSEITE, KARTE]) if (!exists(f)) throw new Error("Fehlt: " + f);

baueBasis({
    ordner: "Synaptoiden", praefix: P, klasse: KLASSE, name: NAME, gruppe: GRUPPE.name, design: "Synaptoiden/gesamtdarstellung/SynaptoidA7.png", motto: "„Kontaktfächer“",
    farben: { bg: "#090b09", glas: "#121612", glashell: "#181e18", linie: "#c98f52", liniehell: "#e4ad72", akzent: "#e8a052", akzenthell: "#fbdcb4", zweit: "#b896ec", text: "#eef0ea", leise: "#a8b0a5", tint: "#5a4526", glaslicht: "#1c221c", glasdunkel: "#090b09", glow1: "#c27a34", glow2: "#8a6ac8", glow3: "#2f6f68", rahmen: "#0b0e0b", knopf: "#1b211b", reiter: "#0f130f", flaeche: "#0e120e", kachel: "#0b0f0b", herobg: "#090c09", aktiv1: "#5c3a16", aktiv2: "#2c1c0b", h1: "#fff6ea", intro: "#dfe2da", zoombg: "#050605" },
});

// ---------- Bilder ----------
const liste = (ordner) => exists(A + "/" + ordner) ? fs.readdirSync(path.join(ROOT, A, ordner)).filter((x) => /\.(png|jpe?g|webp)$/i.test(x)).sort((a, b) => a.localeCompare(b, "de", { numeric: true })).map((x) => A + "/" + ordner + "/" + x) : [];
const nr = (p) => Number((path.posix.basename(p).match(/A(\d+)\./) ?? [0, 0])[1]);
// Designtafeln A1–A15: Motive nach Bildinhalt
const TAFEL = { 1: ["Grundgestalt", "Gestalt"], 2: ["Grundgestalt mit offenen Fächern", "Gestalt"], 3: ["Wanderer in den Schalenmarschen", "Marschen"], 4: ["Arbeit am Kontaktpult", "Technik und Forschung"], 5: ["Im Archivsaal", "Technik und Forschung"],
    6: ["Am Ufer unter Ivera", "Marschen"], 7: ["Zwei Tavari im Kontakt", "Kontakt"], 8: ["Im Raumhafen", "Technik und Forschung"], 9: ["Im Neurolabor", "Technik und Forschung"], 10: ["In der Werkstatt", "Technik und Forschung"],
    11: ["Dossiertafel Feuchtgebiet", "Marschen"], 13: ["Dossiertafel Nebelmarsch", "Marschen"], 14: ["An der Brandungsküste", "Marschen"], 15: ["Heller Morgen im Nebel", "Marschen"] };
const GES = liste("gesamtdarstellung").sort((a, b) => nr(a) - nr(b)).map((p) => ({ datei: p, titel: TAFEL[nr(p)]?.[0] ?? `Designtafel ${nr(p)}`, kategorie: TAFEL[nr(p)]?.[1] ?? "Marschen" }));
const STUFE = [[/Embryonal/, "Embryonalstadium", 1], [/Schlüpfling/, "Schlüpfling", 2], [/Impulsphase/, "Impulsphase", 3], [/Entwicklungsdossier/, "Jugendentwicklung", 4], [/Fächerreife/, "Fächerreife", 5], [/Entwicklungsübersicht/, "Entwicklungsübersicht", 6]];
const ENT = [...liste("entwicklungsstadien"), ...liste("biologie")].map((p) => { const s = STUFE.find(([r]) => r.test(p)); return { datei: p, titel: s?.[1] ?? path.posix.basename(p).replace(/\.\w+$/, ""), kategorie: "Entwicklung", ord: s?.[2] ?? 9 }; }).sort((a, b) => a.ord - b.ord);
const HW_TITEL = { 1: "Schalenmarschen unter Ivera", 2: "Abend über dem Silven-Becken", 3: "Sturm über den Marschen", 4: "Varkal-Archipel", 5: "Nebelrücken" };
const HEIMAT = liste("Heimatwelt").map((p) => ({ datei: p, titel: HW_TITEL[nr(p)] ?? path.posix.basename(p).replace(/\.\w+$/, ""), kategorie: "Nerath" }));
const ALLE = [...GES.filter((b) => b.kategorie === "Kontakt"), ...GES.filter((b) => b.kategorie === "Gestalt"), ...GES.filter((b) => b.kategorie === "Marschen"), ...HEIMAT, ...GES.filter((b) => b.kategorie === "Technik und Forschung"), ...ENT];
if (GES.length < 10 || ENT.length < 5 || HEIMAT.length < 5) throw new Error("Bilder fehlen");
const B_ = (teil) => { const b = ALLE.find((x) => x.titel.includes(teil) || x.datei.includes(teil)); if (!b) throw new Error("Bild fehlt: " + teil); return b; };
const HERO = B_("im Kontakt");

// ---------- Seiten ----------
const BIO = ["Nervensystem", "Neuronale Kontaktfähigkeit", "Verbindungsformen", "Kommunikation", "Ernährung und Stoffwechsel", "Sinne", "Persönlichkeit und Individualität", "Grundlegende biologische Grenzen"];
const FORSCHUNG_GP = ["Forschung und Freischaltungen"];
const HW = S + "/Unterseiten/Heimatwelt/heimatwelt.html", FO = S + "/Forschung/forschung.html";
const nerathKarte = {
    titel: "Nerath im Planetenarchiv", quelle: "Planetenarchiv · Nerath · Terev-System (Sternenkarte)",
    html: `<p>Das vollständige Planetendossier von Nerath – mit Gezeiten, Binnenmeeren, Klimazonen, Biosphäre und Naturereignissen – liegt im Planetenarchiv. Alle Körper des Terev-Systems, von Vaskir bis zur Terev-Fernwolke, haben eigene Dossiers und sind in der Sternenkarte eingetragen.</p>
<p class="${P}-knopfreihe"><a class="${P}-knopf" href="${rel(HW, PLANET)}">Planetendossier Nerath öffnen ›</a><a class="${P}-knopf" href="${rel(HW, SYSTEMSEITE)}">Terev-System (Übersicht)</a><a class="${P}-knopf ${P}-knopf--leise" href="${rel(HW, KARTE)}${SYSTEM}">In der Sternenkarte ›</a></p>`,
};
// Forschungsbereiche (Forschung 1.–36.) → vorhandene Forschungszweige
const ZWEIGE = [
    ["Spezialisierte und erweiterte Forschung/Bewusstseins- und neuronale Vernetzungsforschung", "Kontaktbiologie & Signale", "3.–9."],
    ["Naturwissenschaften/Medizin", "Neurodiagnostik & Regeneration", "18.–22."],
    ["Naturwissenschaften/Genetik und Biotechnologie", "Genetik & Biotechnologie", "23."],
    ["Technologie und Ingenieurwesen/Informatik und Informationstechnologie", "Neuroinformatik", "24."],
    ["Technologie und Ingenieurwesen/Künstliche Intelligenz und Robotik", "Künstliche Intelligenz", "25."],
    ["Spezialisierte und erweiterte Forschung/Sicherheits- und Verteidigungsforschung", "Neurosicherheit", "26."],
    ["Gesellschaft und Kultur/Kultur- und Geisteswissenschaften", "Neuroethik", "27."],
    ["Gesellschaft und Kultur/Psychologie und Kognitionswissenschaften", "Kognitive Forschung", "28."],
    ["Mystik und Bewusstsein/Bewusstseinsforschung", "Vergleichende Bewusstseinsforschung", "29."],
    ["Xenoforschung/Xenomedizin", "Interspezifische Neurointerfaces", "14., 15."],
    ["Raum- und Planetensysteme/Planetologie und Geowissenschaften", "Planetare Biologie & Umwelt", "30., 31."],
    ["Raum- und Planetensysteme/Astronomie und Kosmologie", "Astronomie & Planetologie", "32."],
    ["Raum- und Planetensysteme/Raumfahrtwissenschaften", "Raumfahrtwissenschaft", "33."],
];
for (const [z] of ZWEIGE) if (!exists(FZ + "/" + z + "/index.html")) throw new Error("Zweig fehlt: " + z);
const zweigKarte = {
    titel: "Einordnung in den Forschungsbaum", quelle: "Info_material · Synaptoiden · Forschung 1.–36.",
    html: `<p>Die wissenschaftlich bedeutenden Bereiche der Synaptoiden gehören zu diesen vorhandenen Forschungszweigen:</p>
<ul class="${P}-zweig-liste">${ZWEIGE.map(([z, t, f]) => `<li><a href="${rel(FO, FZ + "/" + z + "/index.html")}"><strong>${esc(t)}</strong><span>${esc(f)}</span></a></li>`).join("")}</ul>`,
};
const MARSCH = GES.filter((b) => b.kategorie === "Marschen"), TECHNIK = GES.filter((b) => b.kategorie === "Technik und Forschung");

const SEITEN = [
    { key: "hauptseite", suffix: "", label: "Übersicht", file: S + "/hauptseite/Spezies.html", icon: "✶" },
    { key: "allgemeines", suffix: "-allgemeines", label: "Allgemeines", file: S + "/Unterseiten/Allgemeines/allgemeines.html", icon: "ⓘ", text: "Tavari, Erscheinungsbild, Körperwerte und Stellung im Universum", titelbild: B_("Grundgestalt mit"),
        quellen: [{ datei: "Allgemeines/Allgemeines.md", ohne: BIO }, "01_Speziesdaten/speziesdaten.md"], galerie: [...GES.filter((b) => b.kategorie === "Gestalt"), B_("Wanderer"), B_("Brandungsküste")] },
    { key: "biologie", suffix: "-biologie", label: "Kontaktbiologie", file: S + "/Unterseiten/Biologie/biologie.html", icon: "⟡", text: "Nervensystem, Kontaktfächer, Verbindungsformen und Sinne", titelbild: HERO,
        quellen: [{ datei: "Allgemeines/Allgemeines.md", nur: BIO, hinweis: "Nervensystem und Kontaktfähigkeit" }], galerie: [HERO, B_("Grundgestalt"), B_("Neurolabor"), B_("Fächerreife")] },
    { key: "entwicklung", suffix: "-entwicklung", label: "Entwicklung", file: S + "/Unterseiten/Entwicklung/entwicklung.html", icon: "⤳", text: "Evolution, Ei, Schlüpfling, Fächerreife und Alter", titelbild: B_("Schlüpfling"),
        quellen: ["02_Geschichte_Entwicklung/entwicklung.md"], galerie: ENT },
    { key: "heimatwelt", suffix: "-heimatwelt", label: "Heimatwelt", file: HW, icon: "◍", text: "Nerath im Terev-System – Gezeiten, Binnenmeere und Marschen", titelbild: B_("Schalenmarschen unter"),
        design: [nerathKarte], quellen: ["05_Heimatwelt/heimatwelt-referenz.md", { datei: "SternenSystem/SternenSystem.md", hinweis: "Terev-System" }], galerie: [...HEIMAT, B_("Am Ufer"), B_("Brandungsküste")] },
    { key: "gesellschaft", suffix: "-gesellschaft", label: "Gesellschaft", file: S + "/Unterseiten/Gesellschaft/gesellschaft.html", icon: "⁂", text: "Kontaktverbünde, Kontaktetikette, Privatsphäre, Kunst und Städte", titelbild: B_("Archivsaal"),
        quellen: ["03_Gesellschaft_Kultur/gesellschaft.md", "03_Gesellschaft_Kultur/kultur.md"], galerie: [B_("Archivsaal"), B_("Werkstatt"), B_("Kontaktpult"), HEIMAT[0]] },
    { key: "politik", suffix: "-politik", label: "Politik", file: S + "/Unterseiten/Politik/politik.html", icon: "⚖", text: "Rat der Becken, geistige Selbstbestimmung und Neurorecht", titelbild: B_("Kontaktpult"),
        quellen: ["04_Politik_Fraktionsbeziehungen/politik.md", "04_Politik_Fraktionsbeziehungen/fraktionsbeziehungen.md"], galerie: [B_("Kontaktpult"), B_("Archivsaal"), B_("Raumhafen")] },
    { key: "geschichte", suffix: "-geschichte", label: "Geschichte", file: S + "/Unterseiten/Geschichte/geschichte.html", icon: "⧗", text: "Wasserbau, Bindekriege, Autonomiecharta und Raumfahrt", titelbild: B_("Abend über"),
        quellen: ["02_Geschichte_Entwicklung/geschichte.md"], galerie: [B_("Abend über"), B_("Sturm über"), B_("Varkal"), B_("Raumhafen")] },
    { key: "gameplay", suffix: "-gameplay", label: "Spielintegration", file: S + "/Gameplay/gameplay.html", icon: "◈", text: "Kontaktverbindungen, Belastungssystem, Gezeiten und Quests", titelbild: B_("Nebelrücken"),
        quellen: [{ datei: "Gameplay/.gitkeep", ohne: FORSCHUNG_GP }], galerie: [B_("Nebelrücken"), B_("Sturm über"), ...MARSCH.slice(0, 4)] },
    { key: "forschung", suffix: "-forschung", label: "Forschung", file: FO, icon: "⚗", text: "Kontaktbiologie, Neurointerfaces, Neurosicherheit und Neuroethik", titelbild: B_("Neurolabor"),
        design: [zweigKarte], quellen: ["Forschung/.gitkeep", { datei: "Gameplay/.gitkeep", nur: FORSCHUNG_GP, hinweis: "Spielintegration" }] },
    { key: "medien", suffix: "-medien", label: "Medien", file: S + "/Unterseiten/Medien/medien.html", icon: "▣", text: "Bildarchiv, Klänge, Bewegtbild und Modelle", titelbild: B_("Heller Morgen"), quellen: [] },
];

for (const s of SEITEN) for (const e of [".css", ".js"]) { const f = s.file.replace(/\.html$/, e); if (exists(f) && /Spezies-Baukasten \(scripts\/spezies\)/.test(read(f))) fs.unlinkSync(path.join(ROOT, f)); }

const B = erstelle({
    S, INFO, A, NAME, KLASSE, P, R0, THEME: "#090b09", SEITEN, REGION: {}, GRUPPE,
    BESCHREIBUNG: "Synaptoiden (Tavari) im APORIA-Weltenarchiv: biologische, nicht humanoide Spezies, die Teile ihrer Nervensysteme reversibel verbinden kann – ohne Schwarmbewusstsein. Heimatwelt Nerath im Terev-System.",
    links: (f, S_, rel) => [
        [rel(f, PLANET), "Planetendossier Nerath", "Heimatwelt im Planetenarchiv"],
        [rel(f, SYSTEMSEITE), "Terev-System", "Systemübersicht"],
        [rel(f, KARTE) + SYSTEM, "Sternenkarte", "Terev-System in der Karte ansehen"],
        [rel(f, S_.forschung.file), "Forschung", "Forschung an den Synaptoiden", `data-route="${R0}-forschung"`],
        [rel(f, FZ + "/Spezialisierte und erweiterte Forschung/Bewusstseins- und neuronale Vernetzungsforschung/index.html"), "Neuronale Vernetzung", "Forschungszweig"],
        [rel(f, FZ + "/Übersicht/Forschung.html"), "Forschungsarchiv", "Alle Forschungszweige"],
    ],
});

medienEintragen(KLASSE, { videos: { animationen: { items: [] }, videos: { items: [] } }, audio: {} });
const ZUSATZ_CSS = `
/* Knöpfe und Forschungsbaum (Synaptoiden) */
.${P}-knopfreihe { display: flex; flex-wrap: wrap; gap: .5rem; }
.${P}-knopf { display: inline-flex; padding: .5rem .95rem; border: 1px solid var(--${P}-violett); border-radius: 999px; background: color-mix(in srgb, var(--${P}-violett) 14%, transparent); color: var(--${P}-text) !important; font-weight: 600; text-decoration: none; }
.${P}-knopf:hover { box-shadow: 0 0 .9rem color-mix(in srgb, var(--${P}-violett) 45%, transparent); }
.${P}-knopf--leise { border-color: var(--${P}-linie-hell); background: transparent; }
.${P}-zweig-liste { display: grid !important; grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr)); gap: .45rem !important; padding: 0; list-style: none; }
.${P}-zweig-liste li { padding: 0 !important; }
.${P}-zweig-liste li::before { display: none !important; }
.${P}-zweig-liste a { display: grid; gap: .1rem; padding: .55rem .7rem; border: 1px solid var(--${P}-linie); border-radius: 10px; background: #0e120eb3; color: var(--${P}-text) !important; text-decoration: none; }
.${P}-zweig-liste a:hover { border-color: var(--${P}-violett); }
.${P}-zweig-liste strong { color: var(--${P}-violett-hell); }
.${P}-zweig-liste span { color: var(--${P}-cyan); font: 600 .74rem/1.2 ui-monospace, Consolas, monospace; }
`;
for (const key of ["allgemeines", "biologie", "entwicklung", "heimatwelt", "gesellschaft", "politik", "geschichte", "gameplay", "forschung"]) B.reiterSeite(B.S_[key]);
const TEXTE = { "Kontakt": "Neuronale Verbindung", "Gestalt": "Körperbau", "Marschen": "Lebensraum Nerath", "Nerath": "Heimatwelt", "Technik und Forschung": "Zivilisation", "Entwicklung": "Entwicklungsstadium" };
B.medienSeite(B.S_.medien, { bilder: ALLE, klang: [], modellRegion: null, texte: TEXTE });
fs.appendFileSync(path.join(ROOT, S, KLASSE + "-basis.css"), ZUSATZ_CSS);

// ---------- Hauptseite ----------
// Verbindungsformen (Allgemeines 7.) – jede Form ein Signalkanal zwischen zwei Kontaktfächern
const FORMEN = [["Zustandskontakt", "Einfache sensorische, physiologische oder emotionale Zustandsmuster."], ["Wahrnehmungskontakt", "Ausgewählte Sinneseindrücke und räumliche Orientierung."], ["Koordinationskontakt", "Gemeinsame Bewegungen und synchronisierte Arbeitsabläufe."], ["Analytischer Kontakt", "Gelernte abstrakte Signalfolgen für gemeinsame Aufgaben."], ["Medizinischer Kontakt", "Kontrollierte Untersuchung neuronaler Zustände unter Schutz."]];
function faecher() {
    const kanal = FORMEN.map((_, i) => { const y = 46 + i * 22; return `<path class="${P}-f-kanal" d="M118 ${y} C 160 ${y - 14}, 200 ${y + 14}, 242 ${y}" style="--i:${i}"/><circle class="${P}-f-puls" r="3.4" style="--i:${i}"><animateMotion dur="${2.4 + i * 0.35}s" repeatCount="indefinite" path="M118 ${y} C 160 ${y - 14}, 200 ${y + 14}, 242 ${y}"/></circle>`; }).join("");
    const fach = (x, s) => Array.from({ length: 9 }, (_, i) => { const w = (-60 + i * 15) * Math.PI / 180; return `<line class="${P}-f-lamelle" x1="${x}" y1="90" x2="${(x + s * Math.cos(w) * 70).toFixed(1)}" y2="${(90 + Math.sin(w) * 70).toFixed(1)}" style="--i:${i}"/>`; }).join("");
    return `<svg class="${P}-faecher" viewBox="0 0 360 180" role="img" aria-label="Zwei Kontaktfächer, verbunden über fünf Signalkanäle">
                        ${fach(60, 1)}${fach(300, -1)}<circle class="${P}-f-kern" cx="60" cy="90" r="16"/><circle class="${P}-f-kern" cx="300" cy="90" r="16"/>${kanal}
                        <text class="${P}-f-text" x="60" y="172">Individuum A</text><text class="${P}-f-text" x="300" y="172">Individuum B</text>
                    </svg>`;
}
const NICHT = [["Kein Schwarm", "Alle Beteiligten bleiben eigenständige Persönlichkeiten."], ["Keine Verschmelzung", "Nervenzellen, Blutkreisläufe und Organe bleiben getrennt."], ["Keine Telepathie", "Biologischer, elektrochemischer Austausch – nur bei direktem Kontakt."]];
const WERTE = [["Rumpflänge", "1,4–2,1 m"], ["Körperbreite", "0,8–1,3 m"], ["Körperhöhe", "0,7–1,2 m"], ["Körpermasse", "50–110 kg"], ["Tragende Gliedmaßen", "4"], ["Manipulatoren", "2"], ["Kontaktfächer", "2"], ["Reife", "18–22 lokale Jahre"], ["Fortpflanzung", "Eiablage"]];
const RECHTE = ["Kontrolle über den eigenen neuronalen Informationsaustausch", "Kein Zwang zur Weitergabe persönlicher Informationen", "Zustimmung vor jeder bewussten Verbindung", "Zustimmung auf einzelne Kanäle beschränkbar", "Recht, eine Verbindung jederzeit zu beenden", "Technik muss sicher entkoppeln können"];
{
    const s = B.S_.hauptseite, f = s.file, S_ = B.S_;
    const L = (k) => `href="${rel(f, S_[k].file)}" data-route="${B.ROUTE(S_[k])}"`;
    const img = (b, klasse, alt = "", laden = "lazy") => `<img class="${klasse}" src="${rel(f, b.datei ?? b)}" alt="${esc(alt)}" ${laden === "eager" ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
    const kachel = (key) => `                    <a class="${P}-panel ${P}-thema" ${L(key)}>${img(S_[key].titelbild, `${P}-thema-bild`)}<span class="${P}-thema-kopf"><span class="${P}-icon" aria-hidden="true">${S_[key].icon}</span><strong>${esc(S_[key].label)}</strong></span><span class="${P}-thema-text">${esc(S_[key].text)}</span></a>`;
    const html = B.kopf(s) +
        `            <header class="${P}-hero">
                ${img(HERO, `${P}-hero-bild`, "", "eager")}
                <span class="${P}-glanz" aria-hidden="true"></span>
                <span class="${P}-impuls" aria-hidden="true"></span>
                <div class="${P}-hero-text">
                    ${B.pfad(s)}
                    <p class="${P}-kicker ${P}-kicker--linie">Speziesdossier · Mentale Spezies</p>
                    <h1>${NAME}</h1>
                    <p class="${P}-unterzeile">Eigenbezeichnung <em>Tavari</em> · Heimatwelt Nerath im Terev-System</p>
                    <p class="${P}-intro">Eine natürlich entstandene, nicht humanoide Spezies, die mit spezialisierten Kontaktfächern ausgewählte Teile ihrer Nervensysteme unmittelbar verbinden kann. Jedes Individuum bleibt dabei eine eigenständige Persönlichkeit – es entsteht kein gemeinsames Bewusstsein.</p>
                    <p class="${P}-hero-links"><a ${L("biologie")}>Kontaktbiologie ›</a><a href="${rel(f, PLANET)}">Heimatwelt Nerath ›</a></p>
                </div>
            </header>
` + B.reiter(s) +
        `            <dl class="${P}-panel ${P}-kennzahlen" aria-label="Kennzahlen">
                <div><dt>Heimatwelt</dt><dd><a href="${rel(f, PLANET)}">Nerath</a></dd><span>Terev-System</span></div>
                <div><dt>Rumpflänge</dt><dd>1,4–2,1 m</dd><span>50–110 kg</span></div>
                <div><dt>Lebenserwartung</dt><dd>75–110</dd><span>lokale Jahre</span></div>
                <div><dt>Kontaktverbund</dt><dd>2–4</dd><span>Individuen, 10–60 Min.</span></div>
                <div><dt>Körperbau</dt><dd>4 + 2</dd><span>Laufglieder + Manipulatoren</span></div>
            </dl>
            <section class="${P}-panel ${P}-block ${P}-kontakt" aria-labelledby="kontakt-titel">
                ${B.titel("Fünf Verbindungsformen", "Kontaktlamellen · elektrochemische Signale", "⟡", "kontakt-titel")}
                <div class="${P}-kontakt-raster">
                    <div class="${P}-kontakt-grafik">${faecher()}</div>
                    <ol class="${P}-formen-liste">
${FORMEN.map(([t, d], i) => `                        <li style="--i:${i}"><strong>${t}</strong><span>${esc(d)}</span></li>`).join("\n")}
                    </ol>
                </div>
                <div class="${P}-nicht">
${NICHT.map(([t, d]) => `                    <div><strong>${t}</strong><span>${esc(d)}</span></div>`).join("\n")}
                </div>
                <p class="${P}-quelle">Quelle: Info_material · ${NAME} · Allgemeines 2., 6., 7. · <a ${L("biologie")}>Mehr unter Kontaktbiologie →</a></p>
            </section>
            <section class="${P}-panel ${P}-block ${P}-bau ${P}-abschnitt" aria-labelledby="bau-titel">
                <figure class="${P}-bau-bild">${img(B_("Grundgestalt mit"), "", "Synaptoid mit geöffneten Kontaktfächern")}</figure>
                <div class="${P}-bau-text">
                    ${B.titel("Ein sichelförmiger Körper", "Vier Laufgliedmaßen · zwei Manipulatoren · zwei Kontaktfächer", "✶", "bau-titel")}
                    <p>Synaptoiden besitzen einen breiten, flachen und <strong>sichelförmig gebogenen Körper</strong>. Der Kopf ist nicht deutlich abgesetzt; die Sinnesfelder liegen entlang der vorderen Rumpfregion, das Gehirn geschützt im Körperinneren. An beiden Seiten sitzen die <strong>Kontaktfächer</strong> – in Ruhe eingeklappt, für eine Verbindung mit zahlreichen feinen Lamellen entfaltet.</p>
                    <dl class="${P}-mini">${WERTE.map(([t, w]) => `<div><dt>${t}</dt><dd>${w}</dd></div>`).join("")}</dl>
                    <p class="${P}-quelle">Quelle: Info_material · ${NAME} · Allgemeines 3., 4. · <a ${L("allgemeines")}>Mehr unter Allgemeines →</a></p>
                </div>
            </section>
            <section class="${P}-abschnitt" aria-labelledby="stufen-titel">
                <h2 class="${P}-h2 ${P}-h2--linie" id="stufen-titel">Vom Ei zur Fächerreife</h2>
                <p class="${P}-lead">Beim Schlüpfen sind die Kontaktorgane angelegt, aber noch nicht funktionstüchtig. Kinder lernen, eigene Wahrnehmungen von fremden Signalmustern zu unterscheiden; die biologische Reife wird zwischen dem 18. und 22. lokalen Lebensjahr erreicht.</p>
                <div class="${P}-stufen">
${ENT.filter((b) => b.ord < 6).map((b, i) => `                    <a class="${P}-panel ${P}-stufe" ${L("entwicklung")} style="--i:${i}"><figure>${img(b, "", b.titel)}</figure><span><b>${i + 1}</b>${esc(b.titel)}</span></a>`).join("\n")}
                </div>
            </section>
            <section class="${P}-panel ${P}-block ${P}-recht ${P}-abschnitt" aria-labelledby="recht-titel">
                ${B.titel("Geistige Selbstbestimmung", "Rat der Becken · Autonomiecharta", "⚖", "recht-titel")}
                <p>Eines der wichtigsten politischen Grundrechte ist die Kontrolle über den eigenen neuronalen Informationsaustausch – eine Lehre aus den historischen <strong>Bindekriegen</strong>. Der <strong>Rat der Becken</strong> behandelt Fragen, die mehrere Staaten oder den ganzen Planeten betreffen, ist aber keine unbegrenzt mächtige Zentralregierung.</p>
                <ol class="${P}-rechte">
${RECHTE.map((r) => `                    <li>${esc(r)}</li>`).join("\n")}
                </ol>
                <p class="${P}-quelle">Quelle: Info_material · ${NAME} · Politik 3., 6., 7. · <a ${L("politik")}>Mehr unter Politik →</a></p>
            </section>
            <div class="${P}-zwei">
                ${B.dossierSteckbrief(s, { datei: "Allgemeines/Allgemeines.md", steckbrief: ["Speziesidentität"], beschreibung: ["Grundbeschreibung"], mehr: "allgemeines" })}
                <aside class="${P}-panel ${P}-welt" aria-labelledby="welt-titel">
                    <a class="${P}-welt-bild" href="${rel(f, PLANET)}">${img(HEIMAT[0], "", "Schalenmarschen unter Ivera")}</a>
                    <div class="${P}-block">
                        ${B.titel("Heimatwelt Nerath", "Terev-System", "◍", "welt-titel")}
                        <p>Gezeitengeprägte Binnenmeer-, Flachwasser- und Feuchtgebietswelt mit den Kontinenten Eshar und Varethis. Der große Mond Ivera erzeugt rund 2,7-mal so starke Gezeitenkräfte wie der Erdmond.</p>
                        <dl class="${P}-mini"><div><dt>Stern</dt><dd>Terev, K0 V</dd></div><div><dt>Abstand</dt><dd>0,93 AE</dd></div><div><dt>Jahr</dt><dd>352 Erdtage</dd></div><div><dt>Tag</dt><dd>27 h</dd></div><div><dt>Mond</dt><dd>Ivera</dd></div><div><dt>Wasser</dt><dd>58 %</dd></div></dl>
                        <p class="${P}-knopfreihe"><a class="${P}-knopf" href="${rel(f, PLANET)}">Planetendossier ›</a><a class="${P}-knopf" href="${rel(f, SYSTEMSEITE)}">Terev-System</a><a class="${P}-knopf ${P}-knopf--leise" href="${rel(f, KARTE)}${SYSTEM}">Sternenkarte ›</a><a class="${P}-knopf ${P}-knopf--leise" ${L("heimatwelt")}>Heimatwelt-Kapitel ›</a></p>
                    </div>
                </aside>
            </div>
            <!-- Themenbereiche entfallen: dieselben Ziele stehen in der Reiter-Leiste (zweite Leiste) -->
            <section class="${P}-panel ${P}-block ${P}-karussell-block ${P}-abschnitt" id="bildarchiv" aria-labelledby="bildarchiv-titel">
                ${B.titel("Bildarchiv", ALLE.length + " Motive", "▣", "bildarchiv-titel")}
                ${B.karussell(f, ALLE, { buehne: true, filter: true, autoplay: 7000, texte: TEXTE })}
            </section>
            <div class="${P}-layout ${P}-layout--fuss">
                <div class="${P}-inhalt">
                    ${B.verknuepfungen(s)}
                    ${B.quelle("Info_material · Synaptoiden · Speziesdossier Version 2.0 · Terev-System 1.0")}
                </div>
            </div>
` + B.fuss();
    write(f, html);
    write(f.replace(/\.html$/, ".js"), `// Synaptoiden – Hauptseite · erzeugt von scripts/spezies/eigene/synaptoiden.mjs\n// Gemeinsame Funktionen (Topbar, Sidebar, Routen, Klappbereiche, Bildkarussell mit Großansicht) kommen aus der Basis.\nimport "../synaptoiden-basis.js";\n`);
    write(f.replace(/\.html$/, ".css"), fs.readFileSync(path.join(ROOT, "scripts/spezies/eigene/synaptoiden-hauptseite.css"), "utf8"));
}

// ---------- Übersichtskarte der Gruppe ----------
{
    const datei = path.join(ROOT, GRUPPE.uebersicht);
    const t = fs.readFileSync(datei, "utf8");
    const kopf = t.indexOf("<h2>Synaptoiden</h2>");
    const start = t.lastIndexOf('<section class="species-category"', kopf);
    const ende = t.indexOf("</section>", kopf) + "</section>".length;
    if (kopf < 0 || start < 0) throw new Error("Übersichtskarte nicht gefunden");
    const id = (t.slice(start, kopf).match(/id="([^"]+)"/) ?? [0, "kategorie-4"])[1];
    const karte = `<section class="species-category" id="${id}" data-world="Nerath" data-habitat="Gezeitenmarschen und Binnenmeerküsten">
        <img src="${rel(GRUPPE.uebersicht, HERO.datei)}" alt="" loading="lazy">
        <div><h2>Synaptoiden</h2><div class="species-card-columns">
          <dl><div><dt>Heimatwelt</dt><dd>Nerath</dd></div><div><dt>Körpergröße</dt><dd>1,4–2,1 m Rumpflänge</dd></div><div><dt>Lebensdauer</dt><dd>75–110 lokale Jahre</dd></div><div><dt>Lebensraum</dt><dd>Gezeitenmarschen und Binnenmeerküsten</dd></div></dl>
          <div class="species-card-copy"><p>Reversible neuronale Verbindung</p><a href="../Synaptoiden/hauptseite/Spezies.html" data-route="${R0}">Dossier öffnen →</a></div>
        </div></div>
      </section>`;
    fs.writeFileSync(datei, t.slice(0, start) + karte + t.slice(ende));
}
console.log(`${NAME} fertig: ${SEITEN.length} Seiten · ${ALLE.length} Bilder`);
