// Spezies-Baukasten · eigenes Bauskript (eigene Hauptseite). Aufruf: node scripts/spezies/eigene/bioluminoiden.mjs
// Baut die Bioluminoiden-Seiten im Speziesstandard: Texte wörtlich aus Info_material (Dossierversion 2.2), Bilder aus dem Bildarchiv,
// Heimatwelt Nhalyss mit Planetendossier und Seyvar-System in der Sternenkarte verknüpft.
import fs from "node:fs";
import path from "node:path";
import { ROOT, FZ, esc, rel, write, exists, read, erstelle, medienEintragen } from "../bibliothek.mjs";
import { baueBasis } from "../basis.mjs";

const NAME = "Bioluminoiden", KLASSE = "bioluminoiden", P = "bl", R0 = "spezies-biological-17";
const S = "inhalte/spezies/Biologische Spezies/Bioluminoiden";
const INFO = "Info_material/Alle_spezies_daten/Biologische Spezies/Bioluminoiden";
const A = "assets/bilder/Alle Spezies+Übersicht/Biologische Spezies/Bioluminoiden";
const PLANET = "inhalte/himmelskoerper/planeten/details/nhalyss/hauptseite/index.html";
const PLANETBILD = "assets/bilder/Himmelskörper/Gesteinsplaneten/nhalyss/hauptseite/imposante-supererde-mit-dunklen-kontinenten-09729b2234.webp";
const KARTE = "Menüs/Sternenkarte/Sternenkarte.html", SYSTEM = "?system=nhalyss-stern";
const UEBERSICHT = "inhalte/spezies/Biologische Spezies/Übersichtsseite biologische spezies/Uebersicht.html";
for (const f of [PLANET, PLANETBILD, KARTE]) if (!exists(f)) throw new Error("Fehlt: " + f);

baueBasis({
    ordner: "Bioluminoiden", praefix: P, klasse: KLASSE, name: NAME, design: "Bioluminoiden/gesamtdarstellung/Bioluminoid im Zwielicht der Basaltwände-8.png", motto: "„Licht als Sprache“",
    farben: { bg: "#07080f", glas: "#101325", glashell: "#171b31", linie: "#3fcfbf", liniehell: "#6fe6d6", akzent: "#4fe3d0", akzenthell: "#c6fff6", zweit: "#ffb347", text: "#eef3f6", leise: "#a3adbf", tint: "#2a8c86", glaslicht: "#1a1f38", glasdunkel: "#07080f", glow1: "#1fbfae", glow2: "#7a5cff", glow3: "#c4781e", rahmen: "#0b0d18", knopf: "#161a30", reiter: "#0f1222", flaeche: "#0e1120", kachel: "#0b0d1a", herobg: "#090b14", aktiv1: "#12514c", aktiv2: "#0b2e2c", h1: "#f4fffd", intro: "#d6e2ea", zoombg: "#04050a" },
});

// ---------- Bilder ----------
const G = A + "/gesamtdarstellung/";
const alle = fs.readdirSync(path.join(ROOT, G)).filter((x) => /\.(png|jpe?g|webp)$/i.test(x));
const nr = (x) => Number((x.match(/-(\d+)\.png$/) ?? [0, 99])[1]);
const MOTIVE = alle.filter((x) => /-\d+\.png$/.test(x)).sort((a, b) => nr(a) - nr(b)).map((x) => ({ datei: G + x, titel: x.replace(/-\d+\.png$/, ""), kategorie: "Körperformen & Lebensräume" }));
const dnr = (x) => (x.match(/design(A\d)/) ?? [0, ""])[1] + String((x.match(/\((\d+)\)/) ?? [0, 0])[1]).padStart(2, "0");
const DESIGNS = alle.filter((x) => /designA\d/.test(x)).sort((a, b) => dnr(a).localeCompare(dnr(b))).map((x) => ({ datei: G + x, titel: `Entwurf ${/A2/.test(x) ? "A2" : "A3"} · ${Number((x.match(/\((\d+)\)/) ?? [0, 0])[1]) + 1}`, kategorie: "Designentwürfe" }));
const REFS = alle.filter((x) => /\.jpe?g$/i.test(x)).map((x, i) => ({ datei: G + x, titel: `Stimmungsreferenz ${i + 1}`, kategorie: "Referenzen" }));
const ALLE = [...MOTIVE, ...DESIGNS, ...REFS];
if (MOTIVE.length < 10 || DESIGNS.length < 10) throw new Error("Bilder fehlen");
const M = (teil) => { const b = MOTIVE.find((x) => x.datei.includes(teil)); if (!b) throw new Error("Bild fehlt: " + teil); return b; };
const HERO = M("Basaltwände"), D = (n) => DESIGNS[n];

// ---------- Seiten ----------
const QUELLEN_GESCHICHTE = ["Epoche", "Paläontologische Quellen", "Geologische Archive", "Archäologische Quellen", "Historische Lichtarchive", "Schriftliche Überlieferungen", "Wissenschaftliche Archive", "Interstellare Archive", "Historische Zuverlässigkeit"];
const HW = S + "/Unterseiten/Heimatwelt/heimatwelt.html", FO = S + "/Forschung/forschung.html";
const nhalyssKarte = {
    titel: "Nhalyss im Planetenarchiv", quelle: "Planetenarchiv · Nhalyss · Seyvar-System (Sternenkarte)",
    html: `<p>Das vollständige Planetendossier von Nhalyss – mit Astronomie, Geologie, Biosphäre, Städten und dem Scherbenkranz – liegt im Planetenarchiv. Das Seyvar-System ist in der Sternenkarte eingetragen.</p>
<p class="${P}-knopfreihe"><a class="${P}-knopf" href="${rel(HW, PLANET)}">Planetendossier Nhalyss öffnen ›</a><a class="${P}-knopf ${P}-knopf--leise" href="${rel(HW, KARTE)}${SYSTEM}">Seyvar-System in der Sternenkarte ›</a></p>`,
};
// Forschungsbaum (Info_material · Forschung · Teil F) → vorhandene Forschungszweige
const ZWEIGE = [
    ["Naturwissenschaften/Biologie", "Biologie", "F01, F02, F12, F17"],
    ["Naturwissenschaften/Chemie", "Chemie", "F01, F02"],
    ["Naturwissenschaften/Genetik und Biotechnologie", "Genetik & Biotechnologie", "F06–F10, F13"],
    ["Naturwissenschaften/Medizin", "Medizin", "F07, F11, F20"],
    ["Spezialisierte und erweiterte Forschung/Bewusstseins- und neuronale Vernetzungsforschung", "Neurobiologie", "F04, F12"],
    ["Xenoforschung/Xenobiologie", "Xenobiologie", "F05, F13, F17, F18"],
    ["Technologie und Ingenieurwesen/Material- und Werkstoffwissenschaften", "Physik und Werkstoffkunde", "F03"],
    ["Raum- und Planetensysteme/Astronomie und Kosmologie", "Astronomie & Astrophysik", "F14"],
    ["Raum- und Planetensysteme/Planetologie und Geowissenschaften", "Planetologie", "F15, F16"],
    ["Umwelt, Leben und Ressourcen/Umwelt- und Ökosystemforschung", "Ökologie", "F17, F18"],
    ["Technologie und Ingenieurwesen/Informatik und Informationstechnologie", "Informationssicherheit", "F19"],
    ["Gesellschaft und Kultur/Informations- und Medienwissenschaften", "Kommunikationsnetze", "F05, F19"],
    ["Gesellschaft und Kultur/Kultur- und Geisteswissenschaften", "Ethik", "F07, F10, F20"],
];
for (const [z] of ZWEIGE) if (!exists(FZ + "/" + z + "/index.html")) throw new Error("Zweig fehlt: " + z);
const zweigKarte = {
    titel: "Einordnung in den Forschungsbaum", quelle: "Info_material · Bioluminoiden · Forschung · Teil F",
    html: `<p>Die Forschungsprogramme F01–F20 sind den vorhandenen APORIA-Forschungszweigen zugeordnet:</p>
<ul class="${P}-zweig-liste">${ZWEIGE.map(([z, t, f]) => `<li><a href="${rel(FO, FZ + "/" + z + "/index.html")}"><strong>${esc(t)}</strong><span>${esc(f)}</span></a></li>`).join("")}</ul>`,
};

const SEITEN = [
    { key: "hauptseite", suffix: "", label: "Übersicht", file: S + "/hauptseite/Spezies.html", icon: "✦" },
    { key: "allgemeines", suffix: "-allgemeines", label: "Allgemeines", file: S + "/Unterseiten/Allgemeines/allgemeines.html", icon: "ⓘ", text: "Identität, Körperformen, Fortpflanzung und Stellung in APORIA", titelbild: M("fremden Zwielicht"),
        quellen: ["Allgemein/Allgemein.md", "01_Speziesdaten/speziesdaten.md"], galerie: MOTIVE.slice(0, 6) },
    { key: "biologie", suffix: "-biologie", label: "Biologie", file: S + "/Unterseiten/Biologie/biologie.html", icon: "⟡", text: "Körperbau, Lichtorgane, Sinne und Fortpflanzung", titelbild: M("Gezeitenbecken"),
        quellen: ["Biologie/Biologie.md"], galerie: [...MOTIVE.slice(4), D(0)] },
    { key: "entwicklung", suffix: "-entwicklung", label: "Entwicklung", file: S + "/Unterseiten/Entwicklung/entwicklung.html", icon: "⤳", text: "Evolution, Polyphenismus und Lebensphasen", titelbild: M("Dreibeiniger"),
        quellen: [{ datei: "02_Geschichte_Entwicklung/entwicklung.md", ohne: QUELLEN_GESCHICHTE, hinweis: "Teil A – Biologische Entwicklung" }], galerie: MOTIVE.slice(0, 5) },
    { key: "heimatwelt", suffix: "-heimatwelt", label: "Heimatwelt", file: HW, icon: "◍", text: "Nhalyss im Seyvar-System – Spaltenwelten und Scherbenkranz", titelbild: M("Mineralbrücke"),
        design: [nhalyssKarte], quellen: ["05_Heimatwelt/heimatwelt-referenz.md"], galerie: [M("Basaltwände"), M("Steinbogen"), M("Gezeitenbecken"), M("Kelchläufer"), M("Sechsläufer")] },
    { key: "gesellschaft", suffix: "-gesellschaft", label: "Gesellschaft", file: S + "/Unterseiten/Gesellschaft/gesellschaft.html", icon: "⁂", text: "Familien, Lichtsprache, Kunst und Recht auf Dunkelheit", titelbild: M("Kelchläufer"),
        quellen: ["03_Gesellschaft_Kultur/gesellschaft.md", "03_Gesellschaft_Kultur/kultur.md"], galerie: [D(0), D(3), D(5), D(9), D(11)] },
    { key: "politik", suffix: "-politik", label: "Politik", file: S + "/Unterseiten/Politik/politik.html", icon: "⚖", text: "Bund der Sichtlinien, Räte und Außenbeziehungen", titelbild: D(9),
        quellen: ["04_Politik_Fraktionsbeziehungen/politik.md", "04_Politik_Fraktionsbeziehungen/fraktionsbeziehungen.md"], galerie: DESIGNS.slice(9, 14) },
    { key: "geschichte", suffix: "-geschichte", label: "Geschichte", file: S + "/Unterseiten/Geschichte/geschichte.html", icon: "⧗", text: "Von den frühen Lichttieren bis zum Vertrag von Seyrath", titelbild: M("Bandwesen"),
        quellen: [{ datei: "02_Geschichte_Entwicklung/entwicklung.md", nur: QUELLEN_GESCHICHTE, hinweis: "Teil B und C – Historische Entwicklung und Quellen" }, "02_Geschichte_Entwicklung/geschichte.md"], galerie: MOTIVE.slice(5) },
    { key: "gameplay", suffix: "-gameplay", label: "Spielintegration", file: S + "/Gameplay/gameplay.html", icon: "◈", text: "Körpermodelle, Lichtkommunikation und Spielsysteme", titelbild: M("Lichtläufer"),
        quellen: [{ datei: "Gameplay/.gitkeep", ohne: ["Forschungssystem"] }], galerie: DESIGNS.slice(0, 6) },
    { key: "forschung", suffix: "-forschung", label: "Forschung", file: FO, icon: "⚗", text: "Biophotonik, Morphogenetik, Ringdynamik und Ethik", titelbild: M("Sechsläufer"),
        design: [zweigKarte], quellen: ["Forschung/.gitkeep", { datei: "Gameplay/.gitkeep", nur: ["Forschungssystem"], hinweis: "Spielintegration" }] },
    { key: "medien", suffix: "-medien", label: "Medien", file: S + "/Unterseiten/Medien/medien.html", icon: "▣", text: "Bildarchiv, Klänge, Bewegtbild und Modelle", titelbild: M("Steinbogen"), quellen: [] },
];

// Seiten-CSS/-JS stammen noch von der Standardvorlage → durch eigene ersetzen (Sicherung liegt vor)
for (const s of SEITEN) for (const e of [".css", ".js"]) { const f = s.file.replace(/\.html$/, e); if (exists(f) && /Spezies-Baukasten \(scripts\/spezies\)/.test(read(f))) fs.unlinkSync(path.join(ROOT, f)); }

const B = erstelle({
    S, INFO, A, NAME, KLASSE, P, R0, THEME: "#07080f", SEITEN, REGION: {},
    BESCHREIBUNG: "Bioluminoiden (Selari) im APORIA-Weltenarchiv: intelligente Spezies mit biologischer Lichtsprache und vier Körperformen, Heimatwelt Nhalyss.",
    links: (f, S_, rel) => [
        [rel(f, PLANET), "Planetendossier Nhalyss", "Heimatwelt im Planetenarchiv"],
        [rel(f, KARTE) + SYSTEM, "Seyvar-System", "In der Sternenkarte ansehen"],
        [rel(f, S_.forschung.file), "Forschung", "Forschung an den Bioluminoiden", `data-route="${R0}-forschung"`],
        [rel(f, FZ + "/Xenoforschung/Xenobiologie/index.html"), "Xenobiologie", "Forschungszweig"],
        [rel(f, FZ + "/Übersicht/Forschung.html"), "Forschungsarchiv", "Alle Forschungszweige"],
    ],
});

medienEintragen(KLASSE, { videos: { animationen: { items: [] }, videos: { items: [] } }, audio: {} });
const ZUSATZ_CSS = `
/* Knöpfe und Forschungsbaum (Bioluminoiden) */
.${P}-knopfreihe { display: flex; flex-wrap: wrap; gap: .5rem; }
.${P}-knopf { display: inline-flex; padding: .5rem .95rem; border: 1px solid var(--${P}-violett); border-radius: 999px; background: color-mix(in srgb, var(--${P}-violett) 14%, transparent); color: var(--${P}-text) !important; font-weight: 600; text-decoration: none; }
.${P}-knopf:hover { box-shadow: 0 0 .9rem color-mix(in srgb, var(--${P}-violett) 45%, transparent); }
.${P}-knopf--leise { border-color: var(--${P}-linie-hell); background: transparent; }
.${P}-zweig-liste { display: grid !important; grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr)); gap: .45rem !important; padding: 0; list-style: none; }
.${P}-zweig-liste li { padding: 0 !important; }
.${P}-zweig-liste li::before { display: none !important; }
.${P}-zweig-liste a { display: grid; gap: .1rem; padding: .55rem .7rem; border: 1px solid var(--${P}-linie); border-radius: 10px; background: #0e1120b3; color: var(--${P}-text) !important; text-decoration: none; }
.${P}-zweig-liste a:hover { border-color: var(--${P}-violett); }
.${P}-zweig-liste strong { color: var(--${P}-violett-hell); }
.${P}-zweig-liste span { color: var(--${P}-cyan); font: 600 .74rem/1.2 ui-monospace, Consolas, monospace; }
`;
for (const key of ["allgemeines", "biologie", "entwicklung", "heimatwelt", "gesellschaft", "politik", "geschichte", "gameplay", "forschung"]) B.reiterSeite(B.S_[key]);
const TEXTE = { "Körperformen & Lebensräume": "Bildarchiv · Nhalyss", Designentwürfe: "Frühe Gestaltungsentwürfe", Referenzen: "Stimmungsreferenz" };
B.medienSeite(B.S_.medien, { bilder: ALLE, klang: [], modellRegion: null, texte: TEXTE });
fs.appendFileSync(path.join(ROOT, S, KLASSE + "-basis.css"), ZUSATZ_CSS);

// ---------- Hauptseite ----------
const FORMEN = [
    { name: "Thaleri", rolle: "Kronensegler", bild: M("Steinbogen"), laenge: "1,1–1,8 m", masse: "15–55 kg", glieder: "Sechs", raum: "Hohe Wälder und Spaltenterrassen", text: "Schlanke, flexible Körper mit ausspannbaren Gleitmembranen – angepasst an dreidimensionale Waldlandschaften und Kletterbewegungen." },
    { name: "Vorali", rolle: "Tiefenkriecher", bild: M("Sechsläufer"), laenge: "0,8–1,5 m", masse: "12–45 kg", glieder: "Acht", raum: "Höhlen, Karst und felsiger Untergrund", text: "Flacher, breiter Körper mit niedrigem Schwerpunkt; Wahrnehmung stark auf mechanische Reize und schwache Lichtsignale spezialisiert." },
    { name: "Nemerai", rolle: "Deltaschwimmer", bild: M("Gezeitenbecken"), laenge: "1,5–2,8 m", masse: "30–110 kg", glieder: "Sechs", raum: "Flussdeltas, Küsten und Sümpfe", text: "Langgestreckter, amphibischer Körper mit paddelartigen Bewegungsorganen und kräftigem Schwanz; luftatmend mit langen Tauchphasen." },
    { name: "Serrathi", rolle: "Hochlandläufer", bild: M("Kelchläufer"), laenge: "1,2–2,1 m", masse: "22–85 kg", glieder: "Sechs", raum: "Hochländer und offene Ebenen", text: "Lange Laufgliedmaßen, widerstandsfähige Körperplatten und teilweise aufgerichtete, gerichtete Lichtorgane für offene Landschaften." },
];
const EBENEN = [["Räumlich", "Verteilung der Lichtfelder"], ["Spektral", "Kombination verschiedener Farben"], ["Zeitlich", "Dauer und Abfolge der Signale"], ["Intensität", "Helligkeitsunterschiede"], ["Bewegung", "Räumlicher Verlauf der Muster"], ["Kontext", "Bedeutung in der sozialen Situation"]];
{
    const s = B.S_.hauptseite, f = s.file, S_ = B.S_;
    const L = (k) => `href="${rel(f, S_[k].file)}" data-route="${B.ROUTE(S_[k])}"`;
    const img = (b, klasse, alt = "", laden = "lazy") => `<img class="${klasse}" src="${rel(f, b.datei ?? b)}" alt="${esc(alt)}" ${laden === "eager" ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
    const kachel = (key) => `                    <a class="${P}-panel ${P}-thema" ${L(key)}>${img(S_[key].titelbild, `${P}-thema-bild`)}<span class="${P}-thema-kopf"><span class="${P}-icon" aria-hidden="true">${S_[key].icon}</span><strong>${esc(S_[key].label)}</strong></span><span class="${P}-thema-text">${esc(S_[key].text)}</span></a>`;
    const form = (x) => `                    <article class="${P}-panel ${P}-form">
                        <figure class="${P}-form-bild">${img(x.bild, "", x.name + " – " + x.rolle)}</figure>
                        <div class="${P}-form-text">
                            <h3>${x.name} <small>${x.rolle}</small></h3>
                            <p>${esc(x.text)}</p>
                            <dl class="${P}-mini"><div><dt>Länge</dt><dd>${x.laenge}</dd></div><div><dt>Masse</dt><dd>${x.masse}</dd></div><div><dt>Gliedmaßen</dt><dd>${x.glieder}</dd></div><div><dt>Ursprung</dt><dd>${esc(x.raum)}</dd></div></dl>
                        </div>
                    </article>`;
    const html = B.kopf(s) +
        `            <header class="${P}-hero">
                ${img(HERO, `${P}-hero-bild`, "", "eager")}
                <span class="${P}-glanz" aria-hidden="true"></span>
                <span class="${P}-funken" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>
                <div class="${P}-hero-text">
                    ${B.pfad(s)}
                    <p class="${P}-kicker ${P}-kicker--linie">Speziesdossier · Biologische Spezies</p>
                    <h1>${NAME}</h1>
                    <p class="${P}-unterzeile">Eigenbezeichnung <em>Selari</em> · Licht als Sprache</p>
                    <p class="${P}-intro">Eine intelligente Spezies, die selbstständig Licht erzeugt und damit eine hochentwickelte visuelle Sprache spricht – in vier dauerhaft verschiedenen Körperformen mit einem gemeinsamen Genpool.</p>
                    <p class="${P}-hero-links"><a ${L("biologie")}>Biologie ansehen ›</a><a href="${rel(f, PLANET)}">Heimatwelt Nhalyss ›</a></p>
                </div>
            </header>
` + B.reiter(s) +
        `            <dl class="${P}-panel ${P}-kennzahlen" aria-label="Kennzahlen">
                <div><dt>Heimatwelt</dt><dd><a href="${rel(f, PLANET)}">Nhalyss</a></dd><span>Seyvar-System</span></div>
                <div><dt>Körperformen</dt><dd>4</dd><span>ein gemeinsamer Genpool</span></div>
                <div><dt>Lebensdauer</dt><dd>90–125</dd><span>Erdjahre</span></div>
                <div><dt>Bevölkerung</dt><dd>≈ 1,6 Mrd.</dd><span>auf Nhalyss</span></div>
                <div><dt>Lichtspektrum</dt><dd>480–590</dd><span>Nanometer</span></div>
            </dl>
            <section class="${P}-abschnitt" aria-labelledby="formen-titel">
                <h2 class="${P}-h2 ${P}-h2--linie" id="formen-titel">Vier Körperformen, eine Spezies</h2>
                <p class="${P}-lead">Die vier Formen unterscheiden sich in Anatomie, Gliedmaßenzahl, Fortbewegung und Sinnen, sind aber reproduktiv kompatibel. Die Form wird in der frühen Embryonalentwicklung festgelegt – keine Form ist einer anderen über- oder untergeordnet.</p>
                <div class="${P}-formen">
${FORMEN.map(form).join("\n")}
                </div>
            </section>
            <section class="${P}-panel ${P}-block ${P}-licht" aria-labelledby="licht-titel">
                ${B.titel("Die Lichtsprache", "Farbe · Intensität · Rhythmus · Muster · Bewegung", "✦", "licht-titel")}
                <div class="${P}-licht-raster">
                    <div>
                        <p>Licht entsteht in spezialisierten Photocyten durch enzymatisch kontrollierte Oxidation Luciferin-ähnlicher Stoffe. Die Sprache besitzt Grammatik und regionale Dialekte; einfache Warnsignale sind angeboren, komplexe Bedeutungen werden erlernt.</p>
                        <figure class="${P}-spektrum" aria-label="Emissionsbereich 480 bis 590 Nanometer">
                            <div class="${P}-spektrum-band"><span class="${P}-signal" aria-hidden="true"></span></div>
                            <figcaption><span>480 nm<br><b>Cyan · Blaugrün</b></span><span><b>Grün</b></span><span>590 nm<br><b>Gelb · Bernstein</b></span></figcaption>
                        </figure>
                    </div>
                    <ol class="${P}-ebenen">
${EBENEN.map(([t, d]) => `                        <li><strong>${t}</strong><span>${d}</span></li>`).join("\n")}
                    </ol>
                </div>
                <p class="${P}-quelle">Quelle: Info_material · ${NAME} · Biologie 2.9–2.13 · Gesellschaft 4.7 · <a ${L("gesellschaft")}>Mehr unter Gesellschaft →</a></p>
            </section>
            <div class="${P}-zwei">
                ${B.dossierSteckbrief(s, { datei: "Allgemein/Allgemein.md", steckbrief: ["Speziesidentität"], beschreibung: ["Grunddefinition"], mehr: "allgemeines" })}
                <aside class="${P}-panel ${P}-welt" aria-labelledby="welt-titel">
                    <a class="${P}-welt-bild" href="${rel(f, PLANET)}">${img(PLANETBILD, "", "Nhalyss aus dem All")}</a>
                    <div class="${P}-block">
                        ${B.titel("Heimatwelt Nhalyss", "Seyvar-System", "◍", "welt-titel")}
                        <p>Geologisch aktive Welt mit Ozeanen, vier Kontinenten und bis zu fünf Kilometer tiefen Spaltenlandschaften – überspannt vom Scherbenkranz, den Trümmern eines vor 73.000 Jahren zerbrochenen Mondes.</p>
                        <dl class="${P}-mini"><div><dt>Stern</dt><dd>Seyvar, K2 V</dd></div><div><dt>Abstand</dt><dd>0,72 AE</dd></div><div><dt>Jahr</dt><dd>246 Erdtage</dd></div><div><dt>Tag</dt><dd>27 h</dd></div><div><dt>Mond</dt><dd>Ireth</dd></div><div><dt>Ring</dt><dd>Scherbenkranz</dd></div></dl>
                        <p class="${P}-knopfreihe"><a class="${P}-knopf" href="${rel(f, PLANET)}">Planetendossier ›</a><a class="${P}-knopf ${P}-knopf--leise" href="${rel(f, KARTE)}${SYSTEM}">Sternenkarte ›</a><a class="${P}-knopf ${P}-knopf--leise" ${L("heimatwelt")}>Heimatwelt-Kapitel ›</a></p>
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
                    ${B.quelle("Info_material · Bioluminoiden · Dossierversion 2.2")}
                </div>
            </div>
` + B.fuss();
    write(f, html);
    write(f.replace(/\.html$/, ".js"), `// Bioluminoiden – Hauptseite · erzeugt von scripts/spezies/eigene/bioluminoiden.mjs\n// Gemeinsame Funktionen (Topbar, Sidebar, Routen, Klappbereiche, Bildkarussell mit Großansicht) kommen aus der Basis.\nimport "../bioluminoiden-basis.js";\n`);
    write(f.replace(/\.html$/, ".css"), fs.readFileSync(path.join(ROOT, "scripts/spezies/eigene/bioluminoiden-hauptseite.css"), "utf8"));
}

// ---------- Übersichtskarte der Gruppe ----------
{
    const datei = path.join(ROOT, UEBERSICHT);
    let t = fs.readFileSync(datei, "utf8");
    const start = t.indexOf('<section class="species-category" id="kategorie-17"');
    const ende = t.indexOf("</section>", start) + "</section>".length;
    if (start < 0 || !t.slice(start, ende).includes("<h2>Bioluminoiden</h2>")) throw new Error("Übersichtskarte nicht gefunden");
    const karte = `<section class="species-category" id="kategorie-17" data-world="Nhalyss" data-habitat="Wälder, Höhlen, Deltas und Hochländer">
        <img src="${rel(UEBERSICHT, HERO.datei)}" alt="" loading="lazy">
        <div><h2>Bioluminoiden</h2><div class="species-card-columns">
          <dl><div><dt>Heimatwelt</dt><dd>Nhalyss</dd></div><div><dt>Körpergröße</dt><dd>0,8–2,8 m (vier Körperformen)</dd></div><div><dt>Lebensdauer</dt><dd>90–125 Erdjahre</dd></div><div><dt>Lebensraum</dt><dd>Wälder, Höhlen, Deltas und Hochländer</dd></div></dl>
          <div class="species-card-copy"><p>Kommunikation durch biologisches Licht</p><a href="../Bioluminoiden/hauptseite/Spezies.html" data-route="${R0}">Dossier öffnen →</a></div>
        </div></div>
      </section>`;
    fs.writeFileSync(datei, t.slice(0, start) + karte + t.slice(ende));
}
console.log(`${NAME} fertig: ${SEITEN.length} Seiten · ${ALLE.length} Bilder`);
