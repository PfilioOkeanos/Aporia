// Spezies-Baukasten · eigenes Bauskript (eigene Hauptseite). Aufruf: node scripts/spezies/eigene/chronoiden.mjs
// Baut die Seiten der Chronoiden (Eshari) im Speziesstandard: Texte wörtlich aus Info_material (Abschlussdossier V2.0),
// Bilder aus dem Bildarchiv (gesamtdarstellung + Heimatwelt), Heimatwelt Seyrath mit Planetendossier und Kelira-System verknüpft.
// Neue Bilder in den Ordnern werden beim nächsten Lauf automatisch übernommen.
import fs from "node:fs";
import path from "node:path";
import { ROOT, FZ, esc, rel, write, exists, read, erstelle, medienEintragen } from "../bibliothek.mjs";
import { baueBasis } from "../basis.mjs";

const NAME = "Chronoiden", KLASSE = "chronoiden", P = "cn", R0 = "spezies-mental-3";
const GRUPPE = { name: "Mentale Spezies", route: "spezies-mental", uebersicht: "inhalte/spezies/Mentale Spezies/Übersichtsseite Mentale Spezies/Uebersicht.html" };
const S = "inhalte/spezies/Mentale Spezies/Chronoiden";
const INFO = "Info_material/Alle_spezies_daten/Mentale Spezies/Chronoiden";
const A = "assets/bilder/Alle Spezies+Übersicht/Mentale Spezies/Chronoiden";
const PLANET = "inhalte/himmelskoerper/planeten/details/seyrath/hauptseite/index.html";
const PLANETBILD = "assets/bilder/Himmelskörper/OzeanWelt/seyrath/hauptseite/turkis-bernsteinfarbene-ozeanwelt-00065d4e52.webp";
const SYSTEMSEITE = "inhalte/himmelskoerper/sternensysteme/details/kelira-system/hauptseite/index.html";
const KARTE = "Menüs/Sternenkarte/Sternenkarte.html", SYSTEM = "?system=seyrath-stern";
for (const f of [PLANET, PLANETBILD, SYSTEMSEITE, KARTE]) if (!exists(f)) throw new Error("Fehlt: " + f);

baueBasis({
    ordner: "Chronoiden", praefix: P, klasse: KLASSE, name: NAME, gruppe: GRUPPE.name, design: "Chronoiden/gesamtdarstellung/Chronoid_design_A12.png", motto: "„Zeitringe“",
    farben: { bg: "#07090c", glas: "#0f1318", glashell: "#151b22", linie: "#c9954e", liniehell: "#e6b56c", akzent: "#e3a64a", akzenthell: "#f8dcae", zweit: "#5fd3cc", text: "#eef1f3", leise: "#a3adb6", tint: "#5a4220", glaslicht: "#1a2129", glasdunkel: "#07090c", glow1: "#b9802e", glow2: "#3aa7a2", glow3: "#4a3a72", rahmen: "#0a0d11", knopf: "#18202a", reiter: "#0d1116", flaeche: "#0c1015", kachel: "#0a0e13", herobg: "#080b0f", aktiv1: "#5a3c14", aktiv2: "#2a1c0a", h1: "#fff7ea", intro: "#dde3e8", zoombg: "#040507" },
});

// ---------- Bilder ----------
const liste = (ordner) => exists(A + "/" + ordner) ? fs.readdirSync(path.join(ROOT, A, ordner)).filter((x) => /\.(png|jpe?g|webp)$/i.test(x)).sort((a, b) => a.localeCompare(b, "de", { numeric: true })).map((x) => A + "/" + ordner + "/" + x) : [];
const nr = (p) => Number((path.posix.basename(p).match(/A_?(\d+)\./i) ?? [0, 0])[1]);
const GES = liste("gesamtdarstellung").sort((a, b) => nr(a) - nr(b));
// Designtafeln A1–A5 zeigen Lebensräume und Träger, A6 ff. sind Formstudien vor neutralem Grund
const TAFEL = { 1: ["Rissanker im Glutfeld", "Lebensräume"], 2: ["Küstenleiter über Mineralwasser", "Lebensräume"], 3: ["Hochlandcluster im Kristallhochland", "Lebensräume"], 4: ["Technischer Träger in der Station", "Träger und Anlagen"], 5: ["Resonanzkern im Archivsaal", "Träger und Anlagen"] };
const DESIGNS = GES.map((p) => ({ datei: p, titel: TAFEL[nr(p)]?.[0] ?? `Formstudie ${nr(p) - 5}`, kategorie: TAFEL[nr(p)]?.[1] ?? "Formstudien" }));
// Heimatwelt-Bilder: eigene Titel (Dateinamen der Referenzbilder sind Quellenangaben)
const HW_TITEL = [[/Ruinenstadt/, "Ruinenstadt unter zwei Monden"], [/Tal mit leuchtenden Ringportalen/, "Tal mit leuchtenden Ringportalen"], [/Kristalltal/, "Chronoid-Resonanz im Kristalltal"], [/Ringsturm/, "Chronoidenwelt unter dem Ringsturm"], [/Kosmische Ringportale/, "Kosmische Ringportale im türkisfarbenen Tal"],
    [/Galactic Mind/, "Resonanzstruktur in einer Kontaktzone"], [/Ethiopia/, "Hydrothermalfeld in Oshavar"], [/Explore Alien/, "Staubresistente Lebensformen in Eryd"], [/Metrinegaming/, "Leitende Adern an der Küste von Telyss"], [/Proxima/, "Polarlichter über einer Bruchebene"], [/Sci fi landscapes/, "Basaltrift in Oshavar"]];
const HEIMAT = liste("Heimatwelt").map((p) => ({ datei: p, titel: (HW_TITEL.find(([r]) => r.test(p)) ?? [0, path.posix.basename(p).replace(/\.\w+$/, "").replace(/-\d+$/, "").replace(/^Aporia_\s*/i, "")])[1], kategorie: "Seyrath" }));
const ALLE = [...DESIGNS.filter((d) => d.kategorie !== "Formstudien"), ...HEIMAT, ...DESIGNS.filter((d) => d.kategorie === "Formstudien")];
if (DESIGNS.length < 10 || HEIMAT.length < 5) throw new Error("Bilder fehlen");
const B_ = (teil) => { const b = ALLE.find((x) => x.titel.includes(teil) || x.datei.includes(teil)); if (!b) throw new Error("Bild fehlt: " + teil); return b; };
const STUDIEN = DESIGNS.filter((d) => d.kategorie === "Formstudien");
const HERO = B_("Kristalltal");

// ---------- Seiten ----------
const GESCHICHTE = ["Historische Frühzeit", "Erste organisierte Gemeinschaften", "Große Resonanzzentren", "Beginn systematischer Archive", "Der Große Versatz", "Folgen des Großen Versatzes", "Wiederaufbau", "Die Stille Fuge", "Folgen der Stillen Fuge", "Raumfahrt", "Interstellarer Erstkontakt", "Historische Identität"];
const FORSCHUNG_GP = ["Forschungsgeräte", "Forschungsfortschritt"];
const HW = S + "/Unterseiten/Heimatwelt/heimatwelt.html", FO = S + "/Forschung/forschung.html";
const KETTE = [["Arun", "64,1 d"], ["Velth", "96,2 d"], ["Isaru", "144,2 d"], ["Seyrath", "216,3 d"], ["Doran", "324,4 d"], ["Ombrel", "432,6 d"], ["Halvek", "576,9 d"]];
const seyrathKarte = {
    titel: "Seyrath im Planetenarchiv", quelle: "Planetenarchiv · Seyrath · Kelira-System (Sternenkarte)",
    html: `<p>Das vollständige Planetendossier von Seyrath – mit Kontinenten, Resonanzsystemen, Klimaregionen, Biosphäre und Schutzgebieten – liegt im Planetenarchiv. Das Kelira-System ist in der Sternenkarte eingetragen: sieben Planeten in einer geschlossenen Bahnresonanz, Seyrath ist das vierte Glied.</p>
<ol class="${P}-kette">${KETTE.map(([n, t]) => `<li${n === "Seyrath" ? ` class="${P}-kette-heim"` : ""}><strong>${n}</strong><span>${t}</span></li>`).join("")}</ol>
<p class="${P}-knopfreihe"><a class="${P}-knopf" href="${rel(HW, PLANET)}">Planetendossier Seyrath öffnen ›</a><a class="${P}-knopf" href="${rel(HW, SYSTEMSEITE)}">Systemübersicht</a><a class="${P}-knopf ${P}-knopf--leise" href="${rel(HW, KARTE)}${SYSTEM}">Kelira-System in der Sternenkarte ›</a></p>`,
};
// Forschungsbereiche (Forschung 7.x) → vorhandene Forschungszweige
const ZWEIGE = [
    ["Mystik und Bewusstsein/Bewusstseinsforschung", "Xenophysik des Bewusstseins", "7.2, 7.3"],
    ["Naturwissenschaften/Physik", "Subjektivchronometrie", "7.4, 7.5"],
    ["Technologie und Ingenieurwesen/Energie- und Antriebsforschung", "Energie & Wärmeabfuhr", "7.6, 7.7"],
    ["Technologie und Ingenieurwesen/Material- und Werkstoffwissenschaften", "Resonanzträger", "7.8, 7.9"],
    ["Spezialisierte und erweiterte Forschung/Bewusstseins- und neuronale Vernetzungsforschung", "Kontinuität & Gedächtnis", "7.10, 7.11"],
    ["Xenoforschung/Xenomedizin", "Resonanzmedizin", "7.12, 7.13"],
    ["Raum- und Planetensysteme/Planetologie und Geowissenschaften", "Heimatwelt & Arel-Tor", "7.14–7.16"],
    ["Gesellschaft und Kultur/Sprach- und Kommunikationswissenschaften", "Kommunikation", "7.18, 7.19"],
    ["Technologie und Ingenieurwesen/Informatik und Informationstechnologie", "Prognoseforschung", "7.20"],
    ["Raum- und Planetensysteme/Raumfahrtwissenschaften", "Raumtransport", "7.21, 7.22"],
];
for (const [z] of ZWEIGE) if (!exists(FZ + "/" + z + "/index.html")) throw new Error("Zweig fehlt: " + z);
const zweigKarte = {
    titel: "Einordnung in den Forschungsbaum", quelle: "Info_material · Chronoiden · Forschung 7.x",
    html: `<p>Die wissenschaftlich bedeutenden Bereiche der Chronoiden gehören zu diesen vorhandenen Forschungszweigen:</p>
<ul class="${P}-zweig-liste">${ZWEIGE.map(([z, t, f]) => `<li><a href="${rel(FO, FZ + "/" + z + "/index.html")}"><strong>${esc(t)}</strong><span>${esc(f)}</span></a></li>`).join("")}</ul>`,
};
const T = (l, n, a = 0) => l.slice(a, a + n);

const SEITEN = [
    { key: "hauptseite", suffix: "", label: "Übersicht", file: S + "/hauptseite/Spezies.html", icon: "✶" },
    { key: "allgemeines", suffix: "-allgemeines", label: "Allgemeines", file: S + "/Unterseiten/Allgemeines/allgemeines.html", icon: "ⓘ", text: "Eshari, Erscheinungsform, Formgruppen und Verletzlichkeit", titelbild: STUDIEN[7] ?? STUDIEN[0],
        quellen: ["Allgemeines/Allgemeines.md", "01_Speziesdaten/speziesdaten.md"], galerie: [B_("Rissanker"), B_("Küstenleiter"), B_("Hochlandcluster"), ...T(STUDIEN, 3)] },
    { key: "biologie", suffix: "-biologie", label: "Bewusstsein", file: S + "/Unterseiten/Biologie/biologie.html", icon: "⧗", text: "Subjektive Zeit, Verarbeitungsraten, Tiefenruhe und Desynchronisation", titelbild: STUDIEN[1] ?? STUDIEN[0],
        quellen: ["Bewusstsein/Bewusstsein.md"], galerie: T(STUDIEN, 6, 1) },
    { key: "entwicklung", suffix: "-entwicklung", label: "Entwicklung", file: S + "/Unterseiten/Entwicklung/entwicklung.html", icon: "⤳", text: "Von Informationsnetzwerken zum Bewusstsein – Abspaltung, Reife, Tod", titelbild: STUDIEN[2] ?? STUDIEN[0],
        quellen: ["02_Geschichte_Entwicklung/entwicklung.md"], galerie: T(STUDIEN, 5, 4) },
    { key: "heimatwelt", suffix: "-heimatwelt", label: "Heimatwelt", file: HW, icon: "◍", text: "Seyrath im Kelira-System – Kristall, Wasser und Resonanz", titelbild: B_("Ringportale im türkis"),
        design: [seyrathKarte], quellen: ["05_Heimatwelt/heimatwelt-referenz.md"], galerie: HEIMAT },
    { key: "gesellschaft", suffix: "-gesellschaft", label: "Gesellschaft", file: S + "/Unterseiten/Gesellschaft/gesellschaft.html", icon: "⁂", text: "Persönliche Zeit, Gemeinschaften, Sprache, Kunst und Rituale", titelbild: B_("Archivsaal"),
        quellen: [{ datei: "03_Gesellschaft_Kultur/gesellschaft.md", ohne: GESCHICHTE, hinweis: "Gesellschaft und Kultur" }, "03_Gesellschaft_Kultur/kultur.md"], galerie: [B_("Archivsaal"), B_("Ruinenstadt"), B_("Technischer Träger"), STUDIEN[4] ?? STUDIEN[0]] },
    { key: "politik", suffix: "-politik", label: "Politik", file: S + "/Unterseiten/Politik/politik.html", icon: "⚖", text: "Ankerräte, Intervallversammlung und Synchronisationsrechte", titelbild: STUDIEN[3] ?? STUDIEN[0],
        quellen: ["04_Politik_Fraktionsbeziehungen/politik.md", "04_Politik_Fraktionsbeziehungen/fraktionsbeziehungen.md"], galerie: [STUDIEN[3], STUDIEN[6], STUDIEN[8], B_("Archivsaal")].filter(Boolean) },
    { key: "geschichte", suffix: "-geschichte", label: "Geschichte", file: S + "/Unterseiten/Geschichte/geschichte.html", icon: "⌛", text: "Großer Versatz, Stille Fuge und der Weg ins All", titelbild: B_("Ruinenstadt"),
        quellen: [{ datei: "03_Gesellschaft_Kultur/gesellschaft.md", nur: GESCHICHTE, hinweis: "Geschichte" }, "02_Geschichte_Entwicklung/geschichte.md"], galerie: [B_("Ruinenstadt"), B_("Ringsturm"), B_("Resonanzstruktur"), B_("Basaltrift")] },
    { key: "gameplay", suffix: "-gameplay", label: "Spielintegration", file: S + "/Gameplay/gameplay.html", icon: "◈", text: "Begegnung, Kommunikationsmechanik, Missionen und Seyrath als Spielgebiet", titelbild: B_("Tal mit leuchtenden"),
        quellen: [{ datei: "Gameplay/.gitkeep", ohne: FORSCHUNG_GP }], galerie: T(STUDIEN, 6, 4) },
    { key: "forschung", suffix: "-forschung", label: "Forschung", file: FO, icon: "⚗", text: "Subjektivchronometrie, Resonanzträger und Bewusstseinskontinuität", titelbild: B_("Technischer Träger"),
        design: [zweigKarte], quellen: ["Forschung/.gitkeep", { datei: "Gameplay/.gitkeep", nur: FORSCHUNG_GP, hinweis: "Spielintegration" }] },
    { key: "medien", suffix: "-medien", label: "Medien", file: S + "/Unterseiten/Medien/medien.html", icon: "▣", text: "Bildarchiv, Klänge, Bewegtbild und Modelle", titelbild: STUDIEN[6] ?? STUDIEN[0], quellen: [] },
];

for (const s of SEITEN) for (const e of [".css", ".js"]) { const f = s.file.replace(/\.html$/, e); if (exists(f) && /Spezies-Baukasten \(scripts\/spezies\)/.test(read(f))) fs.unlinkSync(path.join(ROOT, f)); }

const B = erstelle({
    S, INFO, A, NAME, KLASSE, P, R0, THEME: "#07090c", SEITEN, REGION: {}, GRUPPE,
    BESCHREIBUNG: "Chronoiden (Eshari) im APORIA-Weltenarchiv: mentale, nichtbiologische Resonanz- und Informationssysteme mit extrem veränderlicher subjektiver Zeitwahrnehmung. Heimatwelt Seyrath.",
    links: (f, S_, rel) => [
        [rel(f, PLANET), "Planetendossier Seyrath", "Heimatwelt im Planetenarchiv"],
        [rel(f, SYSTEMSEITE), "Kelira-System", "Systemübersicht"],
        [rel(f, KARTE) + SYSTEM, "Sternenkarte", "Kelira-System in der Karte ansehen"],
        [rel(f, S_.forschung.file), "Forschung", "Forschung an den Chronoiden", `data-route="${R0}-forschung"`],
        [rel(f, FZ + "/Mystik und Bewusstsein/Bewusstseinsforschung/index.html"), "Bewusstseinsforschung", "Forschungszweig"],
        [rel(f, FZ + "/Übersicht/Forschung.html"), "Forschungsarchiv", "Alle Forschungszweige"],
    ],
});

medienEintragen(KLASSE, { videos: { animationen: { items: [] }, videos: { items: [] } }, audio: {} });
const ZUSATZ_CSS = `
/* Knöpfe, Resonanzkette und Forschungsbaum (Chronoiden) */
.${P}-knopfreihe { display: flex; flex-wrap: wrap; gap: .5rem; }
.${P}-knopf { display: inline-flex; padding: .5rem .95rem; border: 1px solid var(--${P}-violett); border-radius: 999px; background: color-mix(in srgb, var(--${P}-violett) 14%, transparent); color: var(--${P}-text) !important; font-weight: 600; text-decoration: none; }
.${P}-knopf:hover { box-shadow: 0 0 .9rem color-mix(in srgb, var(--${P}-violett) 45%, transparent); }
.${P}-knopf--leise { border-color: var(--${P}-linie-hell); background: transparent; }
.${P}-kette { display: grid !important; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: .35rem !important; margin: .2rem 0 .9rem !important; padding: 0 !important; list-style: none; }
.${P}-kette li { display: grid; gap: .1rem; padding: .45rem .3rem !important; border: 1px solid var(--${P}-linie); border-radius: 10px; background: #0c1015b3; text-align: center; }
.${P}-kette li::before { display: none !important; }
.${P}-kette strong { color: var(--${P}-text); font-size: .86rem; }
.${P}-kette span { color: var(--${P}-leise); font: 600 .7rem/1.2 ui-monospace, Consolas, monospace; }
.${P}-kette .${P}-kette-heim { border-color: var(--${P}-cyan); box-shadow: 0 0 .8rem color-mix(in srgb, var(--${P}-cyan) 35%, transparent); }
.${P}-kette .${P}-kette-heim strong { color: var(--${P}-cyan); }
@container (max-width: 640px) { .${P}-kette { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
.${P}-zweig-liste { display: grid !important; grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr)); gap: .45rem !important; padding: 0; list-style: none; }
.${P}-zweig-liste li { padding: 0 !important; }
.${P}-zweig-liste li::before { display: none !important; }
.${P}-zweig-liste a { display: grid; gap: .1rem; padding: .55rem .7rem; border: 1px solid var(--${P}-linie); border-radius: 10px; background: #0c1015b3; color: var(--${P}-text) !important; text-decoration: none; }
.${P}-zweig-liste a:hover { border-color: var(--${P}-violett); }
.${P}-zweig-liste strong { color: var(--${P}-violett-hell); }
.${P}-zweig-liste span { color: var(--${P}-cyan); font: 600 .74rem/1.2 ui-monospace, Consolas, monospace; }
`;
for (const key of ["allgemeines", "biologie", "entwicklung", "heimatwelt", "gesellschaft", "politik", "geschichte", "gameplay", "forschung"]) B.reiterSeite(B.S_[key]);
const TEXTE = { "Lebensräume": "Natürliche Formgruppen", "Träger und Anlagen": "Technische Träger", "Seyrath": "Heimatwelt", "Formstudien": "Designtafel" };
B.medienSeite(B.S_.medien, { bilder: ALLE, klang: [], modellRegion: null, texte: TEXTE });
fs.appendFileSync(path.join(ROOT, S, KLASSE + "-basis.css"), ZUSATZ_CSS);

// ---------- Hauptseite ----------
// Relative Verarbeitungsraten (Bewusstsein 2.3) auf logarithmischer Skala 10^-4 … 10^4
const RATEN = [["Tiefe Ruhe", 0.0001, 0.01, "0,0001–0,01×"], ["Reduzierte Aktivität", 0.01, 0.5, "0,01–0,5×"], ["Referenzbetrieb", 1, 1, "1×"], ["Beschleunigung", 10, 100, "10–100×"], ["Hochgeschwindigkeit", 100, 1000, "100–1.000×"], ["Extremer Hochleistungszustand", 1000, 10000, "1.000–10.000×"]];
const pos = (v) => ((Math.log10(v) + 4) / 8 * 100).toFixed(2);
// Zifferblätter: derselbe äußere Takt, unterschiedlich schnelle innere Verarbeitung (nur Sinnbild)
const UHREN = [["Tiefe Ruhe", "0,01×", 240], ["Referenzbetrieb", "1×", 12], ["Beschleunigung", "100×", 1.2]];
const uhr = ([t, r, d]) => `<figure class="${P}-uhr" style="--dauer:${d}s"><svg viewBox="0 0 120 120" aria-hidden="true"><circle class="${P}-uhr-rand" cx="60" cy="60" r="54"/>${Array.from({ length: 12 }, (_, i) => `<line class="${P}-uhr-strich" x1="60" y1="9" x2="60" y2="${i % 3 ? 15 : 19}" transform="rotate(${i * 30} 60 60)"/>`).join("")}<circle class="${P}-uhr-takt" cx="60" cy="60" r="42"/><line class="${P}-uhr-zeiger" x1="60" y1="60" x2="60" y2="20"/><circle class="${P}-uhr-mitte" cx="60" cy="60" r="4"/></svg><figcaption><strong>${r}</strong><span>${t}</span></figcaption></figure>`;
const FORMEN = [
    { name: "Rissanker", bild: B_("Rissanker"), ort: "Oshavar · geothermisch", text: "Tief gelegene geothermische Resonanzindividuen, häufig eng mit hydrothermalen und tektonischen Strukturen verbunden." },
    { name: "Küstenleiter", bild: B_("Küstenleiter"), ort: "Telyss · ionisch", text: "Individuen aus salzhaltigen Sedimenten und Grundwassersystemen, geprägt von ionischer Leitung und mineralischer Chemie." },
    { name: "Hochlandcluster", bild: B_("Hochlandcluster"), ort: "Eryd · kristallin", text: "Individuen aus stabilen kristallinen Gesteinsformationen mit Anpassungen an trockene und thermisch wechselnde Umgebungen." },
];
const ANKER = ["Lokale Energieversorgung", "Trägerinfrastruktur", "Schutz natürlicher Resonanzregionen", "Regionale Forschungseinrichtungen", "Archive und Kommunikationsnetze", "Sicherheit und Notfallmaßnahmen", "Betreuung junger Individuen", "Verwaltung gemeinschaftlicher Ressourcen"];
// Zeitachse (Heimatwelt 4.26–4.27, Gesellschaft 5.16–5.26) – logarithmisch nach „Jahre vor heute“
const ZEIT = [[1400000, "1,4 Mio.", "Vorläufer mineralischer Informationsnetzwerke"], [420000, "420.000", "Erste bewusste Chronoiden"], [96000, "96.000", "Dauerhafte Gemeinschaften"], [40000, "40.000", "Große Resonanzzentren"], [25000, "25.000", "Älteste erhaltene Archive"], [8600, "8.600", "Der Große Versatz"], [3200, "3.200", "Die Stille Fuge"], [1300, "1.300", "Orbitalraumfahrt"], [480, "480", "Interstellarer Erstkontakt"]];
const zpos = (j) => ((Math.log10(1400000) - Math.log10(j)) / (Math.log10(1400000) - Math.log10(480)) * 100).toFixed(2);
{
    const s = B.S_.hauptseite, f = s.file, S_ = B.S_;
    const L = (k) => `href="${rel(f, S_[k].file)}" data-route="${B.ROUTE(S_[k])}"`;
    const img = (b, klasse, alt = "", laden = "lazy") => `<img class="${klasse}" src="${rel(f, b.datei ?? b)}" alt="${esc(alt)}" ${laden === "eager" ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
    const kachel = (key) => `                    <a class="${P}-panel ${P}-thema" ${L(key)}>${img(S_[key].titelbild, `${P}-thema-bild`)}<span class="${P}-thema-kopf"><span class="${P}-icon" aria-hidden="true">${S_[key].icon}</span><strong>${esc(S_[key].label)}</strong></span><span class="${P}-thema-text">${esc(S_[key].text)}</span></a>`;
    const html = B.kopf(s) +
        `            <header class="${P}-hero">
                ${img(HERO, `${P}-hero-bild`, "", "eager")}
                <span class="${P}-glanz" aria-hidden="true"></span>
                <span class="${P}-ringe" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
                <div class="${P}-hero-text">
                    ${B.pfad(s)}
                    <p class="${P}-kicker ${P}-kicker--linie">Speziesdossier · Mentale Spezies</p>
                    <h1>${NAME}</h1>
                    <p class="${P}-unterzeile">Eigenbezeichnung <em>Eshari</em> · materiell gebundene Resonanz- und Informationssysteme</p>
                    <p class="${P}-intro">Natürlich entstandene, nichtbiologische Intelligenzen von Seyrath. Ihre Hauptbesonderheit ist eine extrem veränderliche subjektive Zeitwahrnehmung – eine äußere Sekunde kann sich für sie wie Stunden anfühlen. Die physikalische Zeit selbst verändern sie nicht.</p>
                    <p class="${P}-hero-links"><a ${L("biologie")}>Bewusstsein & Zeit ›</a><a href="${rel(f, PLANET)}">Heimatwelt Seyrath ›</a></p>
                </div>
            </header>
` + B.reiter(s) +
        `            <dl class="${P}-panel ${P}-kennzahlen" aria-label="Kennzahlen">
                <div><dt>Heimatwelt</dt><dd><a href="${rel(f, PLANET)}">Seyrath</a></dd><span>Kelira-System</span></div>
                <div><dt>Kernabmessung</dt><dd>0,5–5 m</dd><span>Netzwerke deutlich größer</span></div>
                <div><dt>Lebensdauer</dt><dd>∞</dd><span>keine feste biologische Grenze</span></div>
                <div><dt>Bevölkerung</dt><dd>≈ 4,8 Mio.</dd><span>auf Seyrath, + ca. 300.000</span></div>
                <div><dt>Verarbeitung</dt><dd>10⁻⁴–10⁴×</dd><span>relative Rate</span></div>
            </dl>
            <section class="${P}-panel ${P}-block ${P}-zeit" aria-labelledby="zeit-titel">
                ${B.titel("Ein Takt, viele Zeiten", "Objektive Referenzzeit · subjektive Verarbeitungszeit", "⧗", "zeit-titel")}
                <p>Chronoiden unterscheiden die durch physikalische Uhren gemessene <strong>objektive Referenzzeit</strong> von der <strong>subjektiven Verarbeitungszeit</strong> – der Menge interner Verarbeitung innerhalb derselben äußeren Dauer. Zwischen tiefer Ruhe und extremem Hochleistungszustand liegen acht Größenordnungen.</p>
                <div class="${P}-zeit-raster">
                    <div class="${P}-uhren">${UHREN.map(uhr).join("")}</div>
                    <div class="${P}-skala" role="list" aria-label="Relative Verarbeitungsraten">
${RATEN.map(([t, a, b, w], i) => `                        <div class="${P}-rate" role="listitem" style="--l:${pos(a)}%;--b:${Math.max(Number(pos(b)) - Number(pos(a)), 1.4).toFixed(2)}%;--i:${i}"><span>${t}</span><i></i><b>${w}</b></div>`).join("\n")}
                        <div class="${P}-achse" aria-hidden="true">${["0,0001×", "0,01×", "1×", "100×", "10.000×"].map((t) => `<span>${t}</span>`).join("")}</div>
                    </div>
                </div>
                <p class="${P}-beispiel"><strong>10.000×</strong> – eine äußere Sekunde entspricht idealisiert rund <strong>2 Stunden 47 Minuten</strong> subjektiver Verarbeitung, eine äußere Minute rund <strong>166 Stunden</strong>. Informationen aus der Zukunft erhält ein Chronoid dadurch nicht.</p>
                <p class="${P}-quelle">Quelle: Info_material · ${NAME} · Bewusstsein 2.2–2.4, 2.21 · <a ${L("biologie")}>Mehr unter Bewusstsein →</a></p>
            </section>
            <section class="${P}-abschnitt" aria-labelledby="formen-titel">
                <h2 class="${P}-h2 ${P}-h2--linie" id="formen-titel">Drei natürliche Formgruppen</h2>
                <p class="${P}-lead">Die ursprünglichen Lebensräume Seyraths begünstigten drei bedeutende Formgruppen. Sie sind keine getrennten Spezies, sondern beschreiben ökologische und strukturelle Unterschiede – mit technischen Trägern können Individuen auch andere Formen annehmen.</p>
                <div class="${P}-formen">
${FORMEN.map((h) => `                    <article class="${P}-panel ${P}-form"><figure>${img(h.bild, "", h.name)}</figure><div><small>${esc(h.ort)}</small><h3>${h.name}</h3><p>${esc(h.text)}</p></div></article>`).join("\n")}
                </div>
            </section>
            <section class="${P}-panel ${P}-block ${P}-sync ${P}-abschnitt" aria-labelledby="sync-titel">
                ${B.titel("Synchronisationsrechte", "Ankerräte · Intervallversammlung", "⚖", "sync-titel")}
                <div class="${P}-sync-raster">
                    <div>
                        <p>Eine zentrale Aufgabe der politischen Ordnung ist die gerechte Beteiligung von Individuen mit unterschiedlichen subjektiven Verarbeitungsgeschwindigkeiten. Gemeinsame <strong>Synchronisationsfenster</strong> ermöglichen Debatten zwischen verschiedenen Verarbeitungsgruppen; Abstimmungen verwenden vereinbarte äußere Zeitreferenzen.</p>
                        <blockquote class="${P}-zitat">Ein Chronoid erhält keine zusätzlichen politischen Rechte, nur weil er schneller denken kann.</blockquote>
                        <p>Die <strong>Intervallversammlung</strong> koordiniert interstellare Beziehungen, planetare Schutzstandards, überregionale Infrastruktur, wissenschaftliche Sicherheitsregeln und grundlegende Personenrechte.</p>
                    </div>
                    <div>
                        <h3>Aufgaben der Ankerräte</h3>
                        <ol class="${P}-anker">
${ANKER.map((a) => `                            <li>${esc(a)}</li>`).join("\n")}
                        </ol>
                    </div>
                </div>
                <p class="${P}-quelle">Quelle: Info_material · ${NAME} · Politik 6.1–6.5 · <a ${L("politik")}>Mehr unter Politik →</a></p>
            </section>
            <section class="${P}-panel ${P}-block ${P}-zeitachse ${P}-abschnitt" aria-labelledby="achse-titel">
                ${B.titel("420.000 Jahre im Zeitraffer", "logarithmische Zeitachse · Jahre vor heute", "⌛", "achse-titel")}
                <ol class="${P}-achse-liste">
${ZEIT.map(([j, t, d], i) => `                    <li style="--x:${zpos(j)}%;--i:${i}"${/Versatz|Fuge/.test(d) ? ` class="${P}-krise"` : ""}><b>${t}</b><span>${esc(d)}</span></li>`).join("\n")}
                </ol>
                <p class="${P}-quelle">Quelle: Info_material · ${NAME} · Heimatwelt 4.26–4.27 · Gesellschaft 5.16–5.26 · <a ${L("geschichte")}>Mehr unter Geschichte →</a></p>
            </section>
            <div class="${P}-zwei">
                ${B.dossierSteckbrief(s, { datei: "Allgemeines/Allgemeines.md", steckbrief: ["Speziesidentität"], beschreibung: ["Grundlegende Beschreibung"], mehr: "allgemeines" })}
                <aside class="${P}-panel ${P}-welt" aria-labelledby="welt-titel">
                    <a class="${P}-welt-bild" href="${rel(f, PLANET)}">${img(PLANETBILD, "", "Seyrath aus dem All")}</a>
                    <div class="${P}-block">
                        ${B.titel("Heimatwelt Seyrath", "Kelira-System", "◍", "welt-titel")}
                        <p>Wasserführender, geologisch aktiver Gesteinsplanet mit den Kontinenten Varenn, Oshavar, Telyss und Eryd. Mineralische Resonanzsysteme in Regionen wie Arel-Tor brachten die Chronoiden hervor; am Himmel steht der Mond Vesh.</p>
                        <dl class="${P}-mini"><div><dt>Stern</dt><dd>Kelira, K3 V</dd></div><div><dt>Abstand</dt><dd>0,66 AE</dd></div><div><dt>Jahr</dt><dd>216,3 Erdtage</dd></div><div><dt>Tag</dt><dd>29,16 h</dd></div><div><dt>Mond</dt><dd>Vesh</dd></div><div><dt>Wasser</dt><dd>42 %</dd></div></dl>
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
                    ${B.quelle("Info_material · Chronoiden · Abschlussdossier V2.0")}
                </div>
            </div>
` + B.fuss();
    write(f, html);
    write(f.replace(/\.html$/, ".js"), `// Chronoiden – Hauptseite · erzeugt von scripts/spezies/eigene/chronoiden.mjs\n// Gemeinsame Funktionen (Topbar, Sidebar, Routen, Klappbereiche, Bildkarussell mit Großansicht) kommen aus der Basis.\nimport "../chronoiden-basis.js";\n`);
    write(f.replace(/\.html$/, ".css"), fs.readFileSync(path.join(ROOT, "scripts/spezies/eigene/chronoiden-hauptseite.css"), "utf8"));
}

// ---------- Übersichtskarte der Gruppe ----------
{
    const datei = path.join(ROOT, GRUPPE.uebersicht);
    const t = fs.readFileSync(datei, "utf8");
    const kopf = t.indexOf("<h2>Chronoiden</h2>");
    const start = t.lastIndexOf('<section class="species-category"', kopf);
    const ende = t.indexOf("</section>", kopf) + "</section>".length;
    if (kopf < 0 || start < 0) throw new Error("Übersichtskarte nicht gefunden");
    const id = (t.slice(start, kopf).match(/id="([^"]+)"/) ?? [0, "kategorie-3"])[1];
    const karte = `<section class="species-category" id="${id}" data-world="Seyrath" data-habitat="Mineralische Resonanzregionen">
        <img src="${rel(GRUPPE.uebersicht, (STUDIEN[6] ?? STUDIEN[0]).datei)}" alt="" loading="lazy">
        <div><h2>Chronoiden</h2><div class="species-card-columns">
          <dl><div><dt>Heimatwelt</dt><dd>Seyrath</dd></div><div><dt>Körpergröße</dt><dd>Kern 0,5–5 m</dd></div><div><dt>Lebensdauer</dt><dd>Keine feste Grenze</dd></div><div><dt>Lebensraum</dt><dd>Mineralische Resonanzregionen</dd></div></dl>
          <div class="species-card-copy"><p>Extrem abweichende Zeitwahrnehmung</p><a href="../Chronoiden/hauptseite/Spezies.html" data-route="${R0}">Dossier öffnen →</a></div>
        </div></div>
      </section>`;
    fs.writeFileSync(datei, t.slice(0, start) + karte + t.slice(ende));
}
console.log(`${NAME} fertig: ${SEITEN.length} Seiten · ${ALLE.length} Bilder`);
