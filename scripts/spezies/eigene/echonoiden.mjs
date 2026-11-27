// Spezies-Baukasten · eigenes Bauskript (eigene Hauptseite). Aufruf: node scripts/spezies/eigene/echonoiden.mjs
// Baut die Seiten der Echonoiden (Esharin) im Speziesstandard: Texte wörtlich aus Info_material (Dossier V1.0),
// Bilder aus dem Bildarchiv (gesamtdarstellung, entwicklungsstadien, Heimatplanet), Heimatwelt Veyruna mit Planetendossier und Orelis-System.
// Neu: Unterseite „Technologien“ (Infoordner Technologien) – Route wird über routenSetzen aus standard.mjs ergänzt.
// Farbführung nach den Bildern: Tiefsee-Teal, Elfenbein und Cyan der durchscheinenden Körper, Violett der Dossiertafeln.
import fs from "node:fs";
import path from "node:path";
import { ROOT, FZ, esc, rel, write, exists, read, erstelle, medienEintragen, kapitel } from "../bibliothek.mjs";
import { baueBasis } from "../basis.mjs";
import { routenSetzen, TECHNIK_REITER } from "../standard.mjs";

const NAME = "Echonoiden", KLASSE = "echonoiden", P = "ec", R0 = "spezies-mental-5";
const GRUPPE = { name: "Mentale Spezies", route: "spezies-mental", uebersicht: "inhalte/spezies/Mentale Spezies/Übersichtsseite Mentale Spezies/Uebersicht.html" };
const S = "inhalte/spezies/Mentale Spezies/Echonoiden";
const INFO = "Info_material/Alle_spezies_daten/Mentale Spezies/Echonoiden";
const A = "assets/bilder/Alle Spezies+Übersicht/Mentale Spezies/Echonoiden";
const AUDIO = "assets/audio/Alle Spezies+Übersicht/Mentale Spezies/Echonoiden";
const VIDEO = "assets/videos/Alle Spezies+Übersicht/Mentale Spezies/Echonoiden";
const PLANET = "inhalte/himmelskoerper/planeten/details/veyruna/hauptseite/index.html";
const SYSTEMSEITE = "inhalte/himmelskoerper/sternensysteme/details/orelis-system/hauptseite/index.html";
const TECH_ARCHIV = "inhalte/Technologien/Übersichtsseite/index.html";
const KARTE = "Menüs/Sternenkarte/Sternenkarte.html", SYSTEM = "?system=veyruna-stern";
for (const f of [PLANET, SYSTEMSEITE, KARTE, TECH_ARCHIV]) if (!exists(f)) throw new Error("Fehlt: " + f);

baueBasis({
    ordner: "Echonoiden", praefix: P, klasse: KLASSE, name: NAME, gruppe: GRUPPE.name, design: "Echonoiden/entwicklungsstadien/Echonoid_ent_A5.png", motto: "„Schwingungsbild“",
    farben: { bg: "#060a0b", glas: "#0e1517", glashell: "#141d20", linie: "#5fc4bc", liniehell: "#8fe0d8", akzent: "#6fd6cc", akzenthell: "#d6f6f2", zweit: "#a88cf0", text: "#eef3f1", leise: "#a1b3b1", tint: "#24524f", glaslicht: "#172124", glasdunkel: "#060a0b", glow1: "#2f9f98", glow2: "#7a62c8", glow3: "#d8cfa8", rahmen: "#080d0e", knopf: "#162124", reiter: "#0b1214", flaeche: "#0b1214", kachel: "#091012", herobg: "#070c0d", aktiv1: "#1f4e4a", aktiv2: "#102826", h1: "#f4fbf9", intro: "#dbe5e3", zoombg: "#030506" },
});

// ---------- Bilder, Klänge, Videos ----------
const liste = (ordner) => exists(A + "/" + ordner) ? fs.readdirSync(path.join(ROOT, A, ordner)).filter((x) => /\.(png|jpe?g|webp)$/i.test(x)).sort((a, b) => a.localeCompare(b, "de", { numeric: true })).map((x) => A + "/" + ordner + "/" + x) : [];
const basis = (p) => path.posix.basename(p);
// Lebendbilder (durchscheinende Vierbeiner) – entsprechen dem Bauplan des Infomaterials
const LEBEND = [...liste("gesamtdarstellung").filter((p) => /\.jpe?g$/i.test(p)), ...liste("entwicklungsstadien").filter((p) => /_ent_A\d/.test(p))]
    .map((p, i) => ({ datei: p, titel: /\.jpe?g$/i.test(p) ? "Durchscheinender Echonoid" : ["Echonoid im Küstenwald", "Lauschender Echonoid", "Echonoid mit geöffneten Resonanzlappen", "Echonoid auf der Felskante", "Echonoid im Sprühregen"][Number(basis(p).match(/A(\d)/)[1]) - 1] ?? "Echonoid", kategorie: "Lebensbilder" }));
const TAFELTITEL = [[/Resonanzfarben/, "Dossiertafel in Resonanzfarben"], [/Resonanz-Spezies/, "Resonanz-Dossiertafel"], [/Resonanzreichen/, "Dossiertafel der Resonanzreichen"], [/Biologische Design/, "Biologische Designvarianten"], [/Designvarianten-2/, "Designvarianten"], [/Spezies-Dossier-5/, "Spezies-Dossier"], [/Humanoid/, "Futuristisches Designblatt"], [/Exosuit/, "Dossier und Exosuit-Studien"]];
const titelVon = (p) => (TAFELTITEL.find(([r]) => r.test(p)) ?? [0, basis(p).replace(/\.\w+$/, "")])[1];
const TAFELN = [...liste("gesamtdarstellung"), ...liste("entwicklungsstadien")].filter((p) => /\.png$/i.test(p) && !/_ent_A\d/.test(p))
    .map((p) => ({ datei: p, titel: titelVon(p), kategorie: /Humanoid|Exosuit/.test(p) ? "Exosuit- und Designstudien" : "Dossiertafeln" }));
const HW_TITEL = { 1: "Talarküste im Abendlicht", 2: "Küstenhöhlen der Mirael-Bögen", 3: "Vulkanische Inselbögen", 4: "Gezeitenbecken", 5: "Ihsarek-Spalten" };
const HEIMAT = liste("Heimatplanet").map((p) => ({ datei: p, titel: HW_TITEL[Number((basis(p).match(/A(\d+)/) ?? [0, 0])[1])] ?? basis(p), kategorie: "Veyruna" }));
const ALLE = [...LEBEND, ...HEIMAT, ...TAFELN.filter((t) => t.kategorie === "Dossiertafeln"), ...TAFELN.filter((t) => t.kategorie !== "Dossiertafeln")];
if (LEBEND.length < 4 || HEIMAT.length < 5) throw new Error("Bilder fehlen");
const B_ = (teil) => { const b = ALLE.find((x) => x.titel.includes(teil) || x.datei.includes(teil)); if (!b) throw new Error("Bild fehlt: " + teil); return b; };
const HERO = B_("geöffneten Resonanzlappen");
const walk = (d) => fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]) : [];
const KLAENGE = walk(path.join(ROOT, AUDIO)).filter((f) => /\.(mp3|ogg|wav|m4a)$/i.test(f));
const VIDEOS = walk(path.join(ROOT, VIDEO)).filter((f) => /\.(mp4|webm|mov)$/i.test(f)).map((f) => ({ title: path.basename(f).replace(/\.\w+$/, "").replace(/[_]+/g, " "), src: "../../" + path.relative(ROOT, f).replace(/\\/g, "/") }));

// ---------- Seiten ----------
const FORSCHUNG_GP = ["Forschungssystem"];
const HW = S + "/Unterseiten/Heimatwelt/heimatwelt.html", FO = S + "/Forschung/forschung.html", TE = S + "/" + TECHNIK_REITER[2];
const TECHNIK = kapitel(INFO + "/Technologien/Technologien.md", P).filter((k) => /^Technologie E-T\d+/.test(k.titel)).map((k) => ({ ...k, kurz: k.titel.replace(/^Technologie /, "") }));
const veyrunaKarte = {
    titel: "Veyruna im Planetenarchiv", quelle: "Planetenarchiv · Veyruna · Orelis-System (Sternenkarte)",
    html: `<p>Das vollständige Planetendossier von Veyruna – mit Gezeiten, Inselbögen, akustischen Landschaften, Biosphäre und Naturereignissen – liegt im Planetenarchiv. Alle Körper des Orelis-Systems haben eigene Dossiers und sind in der Sternenkarte eingetragen.</p>
<p class="${P}-knopfreihe"><a class="${P}-knopf" href="${rel(HW, PLANET)}">Planetendossier Veyruna öffnen ›</a><a class="${P}-knopf" href="${rel(HW, SYSTEMSEITE)}">Orelis-System (Übersicht)</a><a class="${P}-knopf ${P}-knopf--leise" href="${rel(HW, KARTE)}${SYSTEM}">In der Sternenkarte ›</a></p>`,
};
const technikKarte = {
    titel: "Technologien der Echonoiden", quelle: "Info_material · Echonoiden · Technologien · Technologiearchiv des Weltenarchivs",
    html: `<p>Die Echonoiden sind eine fortgeschrittene industrielle und raumfahrtfähige Zivilisation. Ihre Spezialgebiete liegen in der präzisen Kontrolle mechanischer Signale und ihrer Interpretation. Die einzelnen Technologien sind unten beschrieben; das übergreifende Technologiearchiv sammelt Erfindungen, Maschinen, Geräte und technische Systeme aller Spezies.</p>
<ul class="${P}-technik-chips">${TECHNIK.map((k) => `<li><a href="#${k.id}"><b>${esc(k.kurz.split(" – ")[0])}</b><span>${esc(k.kurz.split(" – ")[1] ?? "")}</span></a></li>`).join("")}</ul>
<p class="${P}-knopfreihe"><a class="${P}-knopf ${P}-knopf--leise" href="${rel(TE, TECH_ARCHIV)}" data-route="inhalt-technologien">Technologiearchiv öffnen ›</a></p>`,
};
// Forschungsgruppen (Forschung 2.–10.) → vorhandene Forschungszweige
const ZWEIGE = [
    ["Naturwissenschaften/Physik", "Akustik & Schwingungsphysik", "I"],
    ["Naturwissenschaften/Biologie", "Mechanosensorische Biologie", "I"],
    ["Raum- und Planetensysteme/Planetologie und Geowissenschaften", "Raum & Planeten", "II"],
    ["Technologie und Ingenieurwesen/Material- und Werkstoffwissenschaften", "Energie & Materialien", "III"],
    ["Spezialisierte und erweiterte Forschung/Bewusstseins- und neuronale Vernetzungsforschung", "Leben & Bewusstsein", "IV"],
    ["Technologie und Ingenieurwesen/Elektrotechnik und Elektronik", "Technik & Infrastruktur", "V"],
    ["Gesellschaft und Kultur/Sprach- und Kommunikationswissenschaften", "Gesellschaft & Kultur", "VI"],
    ["Spezialisierte und erweiterte Forschung/Sicherheits- und Verteidigungsforschung", "Sicherheit & Konflikt", "VII"],
    ["Fundamentale und exotische Forschung/Anomalienforschung", "Mystik & Anomalien", "VIII"],
    ["Technologie und Ingenieurwesen/Informatik und Informationstechnologie", "Methoden & Daten", "IX"],
];
for (const [z] of ZWEIGE) if (!exists(FZ + "/" + z + "/index.html")) throw new Error("Zweig fehlt: " + z);
const zweigKarte = {
    titel: "Einordnung in den Forschungsbaum", quelle: "Info_material · Echonoiden · Forschung · Forschungsgruppen I–IX",
    html: `<p>Die neun Forschungsgruppen der Echonoiden-Forschung gehören zu diesen vorhandenen Forschungszweigen:</p>
<ul class="${P}-zweig-liste">${ZWEIGE.map(([z, t, f]) => `<li><a href="${rel(FO, FZ + "/" + z + "/index.html")}"><strong>${esc(t)}</strong><span>Gruppe ${esc(f)}</span></a></li>`).join("")}</ul>`,
};
const T = (l, n, a = 0) => l.slice(a, a + n);

const SEITEN = [
    { key: "hauptseite", suffix: "", label: "Übersicht", file: S + "/hauptseite/Spezies.html", icon: "✶" },
    { key: "allgemeines", suffix: "-allgemeines", label: "Allgemeines", file: S + "/Unterseiten/Allgemeines/allgemeines.html", icon: "ⓘ", text: "Schwingungsbild, Erscheinung, Eckdaten und Spezieskern", titelbild: B_("Durchscheinender"),
        quellen: ["Allgemein/Allgemein.md", "01_Speziesdaten/speziesdaten.md"], galerie: T(LEBEND, 6) },
    { key: "biologie", suffix: "-biologie", label: "Biologie", file: S + "/Unterseiten/Biologie/biologie.html", icon: "⟡", text: "Mechanosensorik, Resonanzgehirn, Signalerzeugung und Grenzen", titelbild: B_("Lauschender"),
        quellen: ["Biologie/biologie.md"], galerie: [B_("Lauschender"), B_("Biologische Design"), B_("Spezies-Dossier"), B_("Resonanz-Dossiertafel")] },
    { key: "entwicklung", suffix: "-entwicklung", label: "Entwicklung", file: S + "/Unterseiten/Entwicklung/entwicklung.html", icon: "⤳", text: "Fünf Evolutionsphasen von der Mechanorezeption zur sozialen Intelligenz", titelbild: B_("Designvarianten"),
        quellen: ["02_Geschichte_Entwicklung/entwicklung.md"], galerie: [B_("Designvarianten"), B_("Biologische Design"), B_("Küstenwald"), B_("Felskante")] },
    { key: "heimatwelt", suffix: "-heimatwelt", label: "Heimatwelt", file: HW, icon: "◍", text: "Veyruna im Orelis-System – Gezeiten, Höhlen und Schallräume", titelbild: B_("Talarküste"),
        design: [veyrunaKarte], quellen: ["05_Heimatwelt/heimatwelt-referenz.md", { datei: "Sternensystem/SternenSystem.md", hinweis: "Orelis-System" }], galerie: HEIMAT },
    { key: "gesellschaft", suffix: "-gesellschaft", label: "Gesellschaft", file: S + "/Unterseiten/Gesellschaft/gesellschaft.html", icon: "⁂", text: "Sprache, akustische Privatsphäre, Architektur, Kunst und Musik", titelbild: B_("Küstenhöhlen"),
        quellen: ["03_Gesellschaft_Kultur/gesellschaft.md", "03_Gesellschaft_Kultur/kultur.md"], galerie: [B_("Küstenhöhlen"), B_("Gezeitenbecken"), B_("Resonanzfarben"), B_("Resonanzreichen")] },
    { key: "politik", suffix: "-politik", label: "Politik", file: S + "/Unterseiten/Politik/politik.html", icon: "⚖", text: "Entscheidungsverfahren, akustischer Datenschutz und Fraktionen", titelbild: B_("Resonanzreichen"),
        quellen: ["04_Politik_Fraktionsbeziehungen/politik.md", "04_Politik_Fraktionsbeziehungen/fraktionsbeziehungen.md"], galerie: [B_("Resonanzreichen"), B_("Resonanzfarben"), B_("Exosuit")] },
    { key: "geschichte", suffix: "-geschichte", label: "Geschichte", file: S + "/Unterseiten/Geschichte/geschichte.html", icon: "⧗", text: "Hohlbogenstädte, Lautmaschinenkrise und der Weg ins All", titelbild: B_("Inselbögen"),
        quellen: ["02_Geschichte_Entwicklung/geschichte.md"], galerie: [B_("Inselbögen"), B_("Ihsarek"), B_("Küstenhöhlen"), B_("Futuristisches")] },
    { key: "gameplay", suffix: "-gameplay", label: "Spielintegration", file: S + "/Gameplay/gameplay.html", icon: "◈", text: "Resonanzmodus, Schleichen, Überlastung und Missionen", titelbild: B_("Sprühregen"),
        quellen: [{ datei: "Gameplay/.gitkeep", ohne: FORSCHUNG_GP }], galerie: [B_("Sprühregen"), B_("Felskante"), B_("Ihsarek"), B_("Exosuit")] },
    { key: "forschung", suffix: "-forschung", label: "Forschung", file: FO, icon: "⚗", text: "Neun Forschungsgruppen, Hypothesen und Grenzen", titelbild: B_("Spezies-Dossier"),
        design: [zweigKarte], quellen: ["Forschung/.gitkeep", { datei: "Gameplay/.gitkeep", nur: FORSCHUNG_GP, hinweis: "Spielintegration" }] },
    { key: "technologien", suffix: "-technologien", label: TECHNIK_REITER[1], file: TE, icon: TECHNIK_REITER[3], text: "Resonanzscanner, Schwingungsmembranen, Neurointerfaces und mehr", titelbild: B_("Exosuit"),
        design: [technikKarte], quellen: ["Technologien/Technologien.md"], galerie: [B_("Exosuit"), B_("Futuristisches"), B_("Spezies-Dossier")] },
    { key: "medien", suffix: "-medien", label: "Medien", file: S + "/Unterseiten/Medien/medien.html", icon: "▣", text: "Bildarchiv, Klänge, Bewegtbild und Modelle", titelbild: B_("Küstenwald"), quellen: [] },
];

for (const s of SEITEN) for (const e of [".css", ".js"]) { const f = s.file.replace(/\.html$/, e); if (exists(f) && /Spezies-Baukasten \(scripts\/spezies\)/.test(read(f))) fs.unlinkSync(path.join(ROOT, f)); }
routenSetzen(R0, S, [TECHNIK_REITER]);

const B = erstelle({
    S, INFO, A, NAME, KLASSE, P, R0, THEME: "#060a0b", SEITEN, REGION: {}, GRUPPE,
    BESCHREIBUNG: "Echonoiden (Esharin) im APORIA-Weltenarchiv: intelligente biologische Spezies, die ihre Umgebung als „Schwingungsbild“ aus mechanischen Schwingungen rekonstruiert. Heimatwelt Veyruna im Orelis-System.",
    links: (f, S_, rel) => [
        [rel(f, PLANET), "Planetendossier Veyruna", "Heimatwelt im Planetenarchiv"],
        [rel(f, SYSTEMSEITE), "Orelis-System", "Systemübersicht"],
        [rel(f, KARTE) + SYSTEM, "Sternenkarte", "Orelis-System in der Karte ansehen"],
        [rel(f, S_.technologien.file), "Technologien", "Technologien der Echonoiden", `data-route="${R0}-technologien"`],
        [rel(f, TECH_ARCHIV), "Technologiearchiv", "Erfindungen, Maschinen und Geräte", 'data-route="inhalt-technologien"'],
        [rel(f, S_.forschung.file), "Forschung", "Forschung an den Echonoiden", `data-route="${R0}-forschung"`],
        [rel(f, FZ + "/Übersicht/Forschung.html"), "Forschungsarchiv", "Alle Forschungszweige"],
    ],
});

medienEintragen(KLASSE, { videos: { animationen: { items: [] }, videos: { items: VIDEOS } }, audio: {} });
const ZUSATZ_CSS = `
/* Knöpfe, Technologie-Übersicht und Forschungsbaum (Echonoiden) */
.${P}-knopfreihe { display: flex; flex-wrap: wrap; gap: .5rem; }
.${P}-knopf { display: inline-flex; padding: .5rem .95rem; border: 1px solid var(--${P}-violett); border-radius: 999px; background: color-mix(in srgb, var(--${P}-violett) 14%, transparent); color: var(--${P}-text) !important; font-weight: 600; text-decoration: none; }
.${P}-knopf:hover { box-shadow: 0 0 .9rem color-mix(in srgb, var(--${P}-violett) 45%, transparent); }
.${P}-knopf--leise { border-color: var(--${P}-linie-hell); background: transparent; }
.${P}-technik-chips, .${P}-zweig-liste { display: grid !important; grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr)); gap: .45rem !important; padding: 0; list-style: none; }
.${P}-technik-chips li, .${P}-zweig-liste li { padding: 0 !important; }
.${P}-technik-chips li::before, .${P}-zweig-liste li::before { display: none !important; }
.${P}-technik-chips a, .${P}-zweig-liste a { display: grid; gap: .1rem; height: 100%; padding: .55rem .7rem; border: 1px solid var(--${P}-linie); border-radius: 10px; background: #0b1214b3; color: var(--${P}-text) !important; text-decoration: none; }
.${P}-technik-chips a:hover, .${P}-zweig-liste a:hover { border-color: var(--${P}-cyan); }
.${P}-technik-chips b { color: var(--${P}-cyan); font: 700 .74rem/1.2 ui-monospace, Consolas, monospace; }
.${P}-technik-chips span, .${P}-zweig-liste strong { color: var(--${P}-violett-hell); font-size: .9rem; }
.${P}-zweig-liste span { color: var(--${P}-cyan); font: 600 .74rem/1.2 ui-monospace, Consolas, monospace; }
`;
for (const key of ["allgemeines", "biologie", "entwicklung", "heimatwelt", "gesellschaft", "politik", "geschichte", "gameplay", "forschung", "technologien"]) B.reiterSeite(B.S_[key]);
const TEXTE = { "Lebensbilder": "Natürlicher Bauplan", "Veyruna": "Heimatwelt", "Dossiertafeln": "Dossiertafel", "Exosuit- und Designstudien": "Technische Designstudie" };
B.medienSeite(B.S_.medien, { bilder: ALLE, klang: [], modellRegion: null, texte: TEXTE });
fs.appendFileSync(path.join(ROOT, S, KLASSE + "-basis.css"), ZUSATZ_CSS);

// ---------- Hauptseite ----------
const GRUNDLAGEN = [["Passive Schwingungserfassung", "Geräusche, Bewegungen, Bodenschwingungen und Strömungen liefern fortlaufend Informationen."], ["Aktive Resonanzabtastung", "Gezielte kurze Signale – ihre Rückkehr wird analysiert."], ["Materialbezogene Auswertung", "Körper und Oberflächen verändern Schwingungen charakteristisch."], ["Zeitliche Mustererkennung", "Aktuelle Signale werden mit vergangenen Beobachtungen verglichen."], ["Mentale Rekonstruktion", "Einzelne Messungen verschmelzen zu einem bewussten Raum- und Ereignismodell."]];
const KERN = ["Echonoiden sind biologische Individuen.", "Ihre Wahrnehmung beruht auf mechanischen Schwingungen.", "Ihr Bewusstsein ist körpergebunden.", "Sie können Informationen über Schall austauschen, jedoch keine Gedanken unmittelbar übertragen.", "Schwingungen benötigen ein Medium und unterliegen physikalischen Grenzen."];
const ECKDATEN = [["Körperlänge", "0,9–1,5 m"], ["Breite mit Lappen", "1–1,7 m"], ["Körperhöhe", "0,55–0,85 m"], ["Gewicht", "ca. 20–55 kg"], ["Laufextremitäten", "4"], ["Feinmanipulatoren", "3"]];
// Sonar: ein Impuls läuft aus, trifft drei Hindernisse und kehrt als Echo zurück
function sonar() {
    const ziele = [[78, 52, "Fels"], [262, 70, "Wasser"], [214, 196, "Beute"]];
    return `<svg class="${P}-sonar" viewBox="0 0 340 250" role="img" aria-label="Schwingungsbild: ausgesandte Impulse, Echos von Fels, Wasser und Beute">
                        ${[0, 1, 2, 3].map((i) => `<circle class="${P}-s-welle" cx="170" cy="130" r="20" style="--i:${i}"/>`).join("")}
                        ${ziele.map(([x, y, t], i) => `<g class="${P}-s-ziel" style="--i:${i}"><circle cx="${x}" cy="${y}" r="9"/><circle class="${P}-s-echo" cx="${x}" cy="${y}" r="9"/><text x="${x}" y="${y + 26}">${t}</text></g>`).join("")}
                        <circle class="${P}-s-kern" cx="170" cy="130" r="11"/><text class="${P}-s-ich" x="170" y="160">Echonoid</text>
                    </svg>`;
}
{
    const s = B.S_.hauptseite, f = s.file, S_ = B.S_;
    const L = (k) => `href="${rel(f, S_[k].file)}" data-route="${B.ROUTE(S_[k])}"`;
    const img = (b, klasse, alt = "", laden = "lazy") => `<img class="${klasse}" src="${rel(f, b.datei ?? b)}" alt="${esc(alt)}" ${laden === "eager" ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
    const kachel = (key) => `                    <a class="${P}-panel ${P}-thema" ${L(key)}>${img(S_[key].titelbild, `${P}-thema-bild`)}<span class="${P}-thema-kopf"><span class="${P}-icon" aria-hidden="true">${S_[key].icon}</span><strong>${esc(S_[key].label)}</strong></span><span class="${P}-thema-text">${esc(S_[key].text)}</span></a>`;
    const html = B.kopf(s) +
        `            <header class="${P}-hero">
                ${img(HERO, `${P}-hero-bild`, "", "eager")}
                <span class="${P}-glanz" aria-hidden="true"></span>
                <span class="${P}-wellen" aria-hidden="true"><i></i><i></i><i></i></span>
                <div class="${P}-hero-text">
                    ${B.pfad(s)}
                    <p class="${P}-kicker ${P}-kicker--linie">Speziesdossier · Mentale Spezies</p>
                    <h1>${NAME}</h1>
                    <p class="${P}-unterzeile">Eigenbezeichnung <em>Esharin</em> · <i>Resonantia veyrunensis</i></p>
                    <p class="${P}-intro">Intelligente, vielzellige Lebewesen, deren Sinnes- und Nervensysteme einen großen Teil der bewussten Wirklichkeit aus mechanischen Schwingungen rekonstruieren – ohne Telepathie, ohne körperlosen Bewusstseinskern.</p>
                    <p class="${P}-hero-links"><a ${L("biologie")}>Biologie ›</a><a ${L("technologien")}>Technologien ›</a><a href="${rel(f, PLANET)}">Heimatwelt Veyruna ›</a></p>
                </div>
            </header>
` + B.reiter(s) +
        `            <dl class="${P}-panel ${P}-kennzahlen" aria-label="Kennzahlen">
                <div><dt>Heimatwelt</dt><dd><a href="${rel(f, PLANET)}">Veyruna</a></dd><span>Orelis-System</span></div>
                <div><dt>Körperlänge</dt><dd>0,9–1,5 m</dd><span>20–55 kg</span></div>
                <div><dt>Lebenserwartung</dt><dd>80–130</dd><span>Erdenjahre</span></div>
                <div><dt>Körperbau</dt><dd>4 · 3 · 3</dd><span>Beine · Greifer · Resonanzlappen</span></div>
                <div><dt>Technologien</dt><dd><a ${L("technologien")}>${TECHNIK.length}</a></dd><span>E-T01 bis E-T${String(TECHNIK.length).padStart(2, "0")}</span></div>
            </dl>
            <section class="${P}-panel ${P}-block ${P}-bild" aria-labelledby="bild-titel">
                ${B.titel("Das Schwingungsbild", "Fünf Grundlagen der echonoidischen Wahrnehmung", "◎", "bild-titel")}
                <div class="${P}-bild-raster">
                    <div class="${P}-bild-grafik">${sonar()}</div>
                    <ol class="${P}-kette">
${GRUNDLAGEN.map(([t, d], i) => `                        <li style="--i:${i}"><strong>${t}</strong><span>${esc(d)}</span></li>`).join("\n")}
                    </ol>
                </div>
                <p class="${P}-hinweis">Ein Mensch ordnet einen Raum vorwiegend durch Licht, Form und Farbe. Ein Echonoid kann denselben Raum primär durch Oberflächenantworten, Entfernungen, Bewegungsmuster und Reflexionen ordnen.</p>
                <p class="${P}-quelle">Quelle: Info_material · ${NAME} · Allgemeines 1., 2., 5. · <a ${L("allgemeines")}>Mehr unter Allgemeines →</a></p>
            </section>
            <section class="${P}-panel ${P}-block ${P}-bau ${P}-abschnitt" aria-labelledby="bau-titel">
                <figure class="${P}-bau-bild">${img(B_("Durchscheinender"), "", "Durchscheinender Echonoid")}</figure>
                <div class="${P}-bau-text">
                    ${B.titel("Ein Körper aus Resonanzflächen", "Vier Laufextremitäten · drei Greiffortsätze · drei Resonanzlappen", "✶", "bau-titel")}
                    <p>Der Körper ist <strong>flach und breit</strong>. Drei unterschiedlich ausgebildete <strong>Resonanzlappen</strong> bilden bewegliche seitliche und hintere Sinnesflächen; die elastische Körperhülle ist teilweise durchscheinend, ihre Muster entstehen durch darunterliegende Faserstrukturen. Ein menschliches Gesicht, große Augen oder ein humanoider Oberkörper gehören nicht zum natürlichen Bauplan.</p>
                    <dl class="${P}-mini">${ECKDATEN.map(([t, w]) => `<div><dt>${t}</dt><dd>${w}</dd></div>`).join("")}</dl>
                    <p class="${P}-quelle">Quelle: Info_material · ${NAME} · Allgemeines 3., 4. · <a ${L("biologie")}>Mehr unter Biologie →</a></p>
                </div>
            </section>
            <section class="${P}-panel ${P}-block ${P}-technik ${P}-abschnitt" aria-labelledby="technik-titel">
                ${B.titel("Technologien", "Präzise Kontrolle mechanischer Signale", "⚙", "technik-titel")}
                <p>Die Echonoiden verwenden gewöhnliche Energieversorgung, Rechenanlagen, Produktion und Raumfahrt – ihre charakteristischen Spezialgebiete liegen in Sensorik, Signalverarbeitung, adaptiven Materialien und kontrollierten Schwingungsumgebungen.</p>
                <ul class="${P}-technik-raster">
${TECHNIK.map((k, i) => `                    <li style="--i:${i}"><a href="${rel(f, TE)}#${k.id}" data-route="${R0}-technologien"><b>${esc(k.kurz.split(" – ")[0])}</b><span>${esc(k.kurz.split(" – ")[1] ?? k.kurz)}</span></a></li>`).join("\n")}
                </ul>
                <p class="${P}-quelle">Quelle: Info_material · ${NAME} · Technologien · <a ${L("technologien")}>Alle Technologien →</a></p>
            </section>
            <section class="${P}-abschnitt" aria-labelledby="kern-titel">
                <h2 class="${P}-h2 ${P}-h2--linie" id="kern-titel">Unveränderlicher Spezieskern</h2>
                <ol class="${P}-kern">
${KERN.map((k, i) => `                    <li style="--i:${i}">${esc(k)}</li>`).join("\n")}
                </ol>
            </section>
            <div class="${P}-zwei">
                ${B.dossierSteckbrief(s, { datei: "Allgemein/Allgemein.md", steckbrief: ["Körperliche Eckdaten"], beschreibung: ["Grunddefinition"], mehr: "allgemeines" })}
                <aside class="${P}-panel ${P}-welt" aria-labelledby="welt-titel">
                    <a class="${P}-welt-bild" href="${rel(f, PLANET)}">${img(HEIMAT[0], "", "Talarküste im Abendlicht")}</a>
                    <div class="${P}-block">
                        ${B.titel("Heimatwelt Veyruna", "Orelis-System", "◍", "welt-titel")}
                        <p>Felsiger, wasserreicher Planet mit dichter Atmosphäre, gezeitengeprägten Küsten, vulkanischen Inselbögen und Höhlenlandschaften. Die Monde Talar und Sivem prägen wechselnde Gezeiten.</p>
                        <dl class="${P}-mini"><div><dt>Stern</dt><dd>Orelis, K1 V</dd></div><div><dt>Abstand</dt><dd>0,68 AE</dd></div><div><dt>Jahr</dt><dd>229 Erdtage</dd></div><div><dt>Tag</dt><dd>30,5 h</dd></div><div><dt>Monde</dt><dd>Talar, Sivem</dd></div><div><dt>Wasser</dt><dd>62 %</dd></div></dl>
                        <p class="${P}-knopfreihe"><a class="${P}-knopf" href="${rel(f, PLANET)}">Planetendossier ›</a><a class="${P}-knopf" href="${rel(f, SYSTEMSEITE)}">Orelis-System</a><a class="${P}-knopf ${P}-knopf--leise" href="${rel(f, KARTE)}${SYSTEM}">Sternenkarte ›</a><a class="${P}-knopf ${P}-knopf--leise" ${L("heimatwelt")}>Heimatwelt-Kapitel ›</a></p>
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
                    ${B.quelle("Info_material · Echonoiden · Dossier V1.0")}
                </div>
            </div>
` + B.fuss();
    write(f, html);
    write(f.replace(/\.html$/, ".js"), `// Echonoiden – Hauptseite · erzeugt von scripts/spezies/eigene/echonoiden.mjs\n// Gemeinsame Funktionen (Topbar, Sidebar, Routen, Klappbereiche, Bildkarussell mit Großansicht) kommen aus der Basis.\nimport "../echonoiden-basis.js";\n`);
    write(f.replace(/\.html$/, ".css"), fs.readFileSync(path.join(ROOT, "scripts/spezies/eigene/echonoiden-hauptseite.css"), "utf8"));
}

// ---------- Übersichtskarte der Gruppe ----------
{
    const datei = path.join(ROOT, GRUPPE.uebersicht);
    const t = fs.readFileSync(datei, "utf8");
    const kopf = t.indexOf("<h2>Echonoiden</h2>");
    const start = t.lastIndexOf('<section class="species-category"', kopf);
    const ende = t.indexOf("</section>", kopf) + "</section>".length;
    if (kopf < 0 || start < 0) throw new Error("Übersichtskarte nicht gefunden");
    const id = (t.slice(start, kopf).match(/id="([^"]+)"/) ?? [0, "kategorie-5"])[1];
    const karte = `<section class="species-category" id="${id}" data-world="Veyruna" data-habitat="Feuchte terrestrische und küstennahe Regionen">
        <img src="${rel(GRUPPE.uebersicht, HERO.datei)}" alt="" loading="lazy">
        <div><h2>Echonoiden</h2><div class="species-card-columns">
          <dl><div><dt>Heimatwelt</dt><dd>Veyruna</dd></div><div><dt>Körpergröße</dt><dd>0,9–1,5 m Körperlänge</dd></div><div><dt>Lebensdauer</dt><dd>80–130 Erdenjahre</dd></div><div><dt>Lebensraum</dt><dd>Feuchte terrestrische und küstennahe Regionen</dd></div></dl>
          <div class="species-card-copy"><p>Wahrnehmung aus mechanischen Schwingungen</p><a href="../Echonoiden/hauptseite/Spezies.html" data-route="${R0}">Dossier öffnen →</a></div>
        </div></div>
      </section>`;
    fs.writeFileSync(datei, t.slice(0, start) + karte + t.slice(ende));
}
console.log(`${NAME} fertig: ${SEITEN.length} Seiten · ${ALLE.length} Bilder · ${TECHNIK.length} Technologien · ${KLAENGE.length} Klänge · ${VIDEOS.length} Videos`);
