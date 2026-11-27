// Spezies-Baukasten · eigenes Bauskript (eigene Hauptseite). Aufruf: node scripts/spezies/eigene/oneiroiden.mjs
// Baut die Seiten der Oneiroiden (Arunai) im Speziesstandard: Texte wörtlich aus Info_material (Speziesdossier V1.0),
// Bilder aus dem Bildarchiv (gesamtdarstellung, entwicklungsstadien, heimatwelt), Heimatwelt Iravelle mit Planetendossier und Darynth-System.
// Unterseite „Technologien“ (Infoordner technologien) über TECHNIK_REITER/routenSetzen aus standard.mjs.
// Farbführung nach den Bildern: Nacht-Violett und Lila der Traumwelten, Bronze der Körper.
import fs from "node:fs";
import path from "node:path";
import { ROOT, FZ, esc, rel, write, exists, read, erstelle, medienEintragen, kapitel } from "../bibliothek.mjs";
import { baueBasis } from "../basis.mjs";
import { routenSetzen, TECHNIK_REITER } from "../standard.mjs";

const NAME = "Oneiroiden", KLASSE = "oneiroiden", P = "on", R0 = "spezies-mental-6";
const GRUPPE = { name: "Mentale Spezies", route: "spezies-mental", uebersicht: "inhalte/spezies/Mentale Spezies/Übersichtsseite Mentale Spezies/Uebersicht.html" };
const S = "inhalte/spezies/Mentale Spezies/Oneiroiden";
const INFO = "Info_material/Alle_spezies_daten/Mentale Spezies/Oneiroiden";
const A = "assets/bilder/Alle Spezies+Übersicht/Mentale Spezies/Oneiroiden";
const AUDIO = "assets/audio/Alle Spezies+Übersicht/Mentale Spezies/Oneiroiden";
const VIDEO = "assets/videos/Alle Spezies+Übersicht/Mentale Spezies/Oneiroiden";
const PLANET = "inhalte/himmelskoerper/planeten/details/iravelle/hauptseite/index.html";
const SYSTEMSEITE = "inhalte/himmelskoerper/sternensysteme/details/darynth-system/hauptseite/index.html";
const TECH_ARCHIV = "inhalte/Technologien/Übersichtsseite/index.html";
const KARTE = "Menüs/Sternenkarte/Sternenkarte.html", SYSTEM = "?system=iravelle-stern";
for (const f of [PLANET, SYSTEMSEITE, KARTE, TECH_ARCHIV]) if (!exists(f)) throw new Error("Fehlt: " + f);

baueBasis({
    ordner: "Oneiroiden", praefix: P, klasse: KLASSE, name: NAME, gruppe: GRUPPE.name, design: "Oneiroiden/gesamtdarstellung/OneiroidenA5.png", motto: "„Zwei Zustände“",
    farben: { bg: "#09070f", glas: "#120e1b", glashell: "#181322", linie: "#a888d6", liniehell: "#c8aef0", akzent: "#c39cf2", akzenthell: "#ede0ff", zweit: "#e3b07a", text: "#f1eef5", leise: "#ada6ba", tint: "#3e3058", glaslicht: "#1d1729", glasdunkel: "#09070f", glow1: "#8a62d0", glow2: "#c8884a", glow3: "#3a8aa8", rahmen: "#0c0913", knopf: "#1b1526", reiter: "#100c17", flaeche: "#0f0b16", kachel: "#0c0912", herobg: "#0a0811", aktiv1: "#3e2a62", aktiv2: "#211634", h1: "#faf6ff", intro: "#e2dcea", zoombg: "#050407" },
});

// ---------- Bilder, Klänge, Videos ----------
const liste = (ordner) => exists(A + "/" + ordner) ? fs.readdirSync(path.join(ROOT, A, ordner)).filter((x) => /\.(png|jpe?g|webp)$/i.test(x)).sort((a, b) => a.localeCompare(b, "de", { numeric: true })).map((x) => A + "/" + ordner + "/" + x) : [];
const nr = (p) => Number((path.posix.basename(p).match(/a(\d+)\.\w+$/i) ?? [0, 0])[1]);
const TAFEL = { 1: "Grundgestalt mit Schlafkrone", 2: "Dossiertafel", 3: "Wanderer im Nebel", 4: "Anatomietafel", 5: "Leuchtende Schlafkrone", 6: "Dossiertafel der Varianten", 7: "Heller Oneiroid", 8: "Farbvarianten-Tafel", 9: "Dämmerung", 10: "Panzerungstafel" };
const GES = liste("gesamtdarstellung").filter((p) => /OneiroidenA\d/.test(p)).sort((a, b) => nr(a) - nr(b)).map((p) => ({ datei: p, titel: TAFEL[nr(p)] ?? `Gesamtdarstellung ${nr(p)}`, kategorie: "Gesamtdarstellung" }));
const VOLL = liste("gesamtdarstellung").filter((p) => /Vollentwickelt/.test(p)).sort((a, b) => nr(a) - nr(b)).map((p) => ({ datei: p, titel: `Vollentwickelt · Tafel ${nr(p)}`, kategorie: "Vollentwickelt" }));
const STUFEN = { 2: "Ei", 3: "Schlüpfling", 4: "Frühe Kindheit", 5: "Kindheit", 6: "Späte Kindheit", 7: "Jugend", 8: "Späte Jugend", 9: "Junges Erwachsenenalter", 10: "Erwachsenenalter", 11: "Voll ausgewachsen" };
const ENT = liste("entwicklungsstadien").sort((a, b) => nr(a) - nr(b)).map((p) => ({ datei: p, titel: STUFEN[nr(p)] ?? `Stadium ${nr(p)}`, kategorie: "Entwicklungsstadien" }));
const HW = liste("heimatwelt").map((p) => ({ datei: p, titel: path.posix.basename(p).replace(/\.\w+$/, "").replace(/-\d+$/, "").replace("Oneiroids", "Oneiroiden").replace("mit Dreamspire", "mit Traumturm"), kategorie: "Iravelle" }));
const ALLE = [...GES, ...HW, ...ENT, ...VOLL];
if (GES.length < 6 || ENT.length < 6 || HW.length < 5) throw new Error("Bilder fehlen");
const B_ = (teil) => { const b = ALLE.find((x) => x.titel.includes(teil) || x.datei.includes(teil)); if (!b) throw new Error("Bild fehlt: " + teil); return b; };
const HERO = B_("Leuchtende Schlafkrone");
const walk = (d) => fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]) : [];
const KLAENGE = walk(path.join(ROOT, AUDIO)).filter((f) => /\.(mp3|ogg|wav|m4a)$/i.test(f));
const VIDEOS = walk(path.join(ROOT, VIDEO)).filter((f) => /\.(mp4|webm|mov)$/i.test(f)).map((f) => ({ title: path.basename(f).replace(/\.\w+$/, "").replace(/[_]+/g, " "), src: "../../" + path.relative(ROOT, f).replace(/\\/g, "/") }));

// ---------- Seiten ----------
const FORSCHUNG_GP = ["Forschungsaufgaben"];
const HWS = S + "/Unterseiten/Heimatwelt/heimatwelt.html", FO = S + "/Forschung/forschung.html", TE = S + "/" + TECHNIK_REITER[2];
const TECHNIK = kapitel(INFO + "/technologien/technologien.md", P).filter((k) => !/Entwicklungsstand|Hauptbereiche|Entwicklungslinien|Grenzen|Gameplay|Identität/.test(k.titel));
const iravelleKarte = {
    titel: "Iravelle im Planetenarchiv", quelle: "Planetenarchiv · Iravelle · Darynth-System (Sternenkarte)",
    html: `<p>Das vollständige Planetendossier von Iravelle – mit Terrassensenken, Stillbecken, Klimazonen, Biosphäre und Naturereignissen – liegt im Planetenarchiv. Alle Körper des Darynth-Systems haben eigene Dossiers und sind in der Sternenkarte eingetragen.</p>
<p class="${P}-knopfreihe"><a class="${P}-knopf" href="${rel(HWS, PLANET)}">Planetendossier Iravelle öffnen ›</a><a class="${P}-knopf" href="${rel(HWS, SYSTEMSEITE)}">Darynth-System (Übersicht)</a><a class="${P}-knopf ${P}-knopf--leise" href="${rel(HWS, KARTE)}${SYSTEM}">In der Sternenkarte ›</a></p>`,
};
const technikKarte = {
    titel: "Technologien der Oneiroiden", quelle: "Info_material · Oneiroiden · technologien · Technologiearchiv des Weltenarchivs",
    html: `<p>Die Oneiroiden sind eine raumfahrtfähige, wissenschaftlich und technologisch fortgeschrittene Zivilisation. Ihre Spezialisierung liegt in Schlaf- und Traumtechnik: Messung, Schutz, Rekonstruktion und kontrollierte Koordination gemeinsamer Träume. Die einzelnen Technologien sind unten beschrieben; das übergreifende Technologiearchiv sammelt Erfindungen aller Spezies.</p>
<ul class="${P}-technik-chips">${TECHNIK.map((k) => `<li><a href="#${k.id}"><b>${esc(k.nr)}</b><span>${esc(k.titel)}</span></a></li>`).join("")}</ul>
<p class="${P}-knopfreihe"><a class="${P}-knopf ${P}-knopf--leise" href="${rel(TE, TECH_ARCHIV)}" data-route="inhalt-technologien">Technologiearchiv öffnen ›</a></p>`,
};
const ZWEIGE = [
    ["Spezialisierte und erweiterte Forschung/Bewusstseins- und neuronale Vernetzungsforschung", "Neurowissenschaften", "2., 3."],
    ["Naturwissenschaften/Chemie", "Chemische Forschung", "5."],
    ["Naturwissenschaften/Physik", "Akustische Forschung", "6."],
    ["Mystik und Bewusstsein/Bewusstseinsforschung", "Bewusstseinsforschung", "7."],
    ["Naturwissenschaften/Medizin", "Medizinische Forschung", "8."],
    ["Naturwissenschaften/Genetik und Biotechnologie", "Genetik & Entwicklung", "9., 10."],
    ["Gesellschaft und Kultur/Psychologie und Kognitionswissenschaften", "Psychologie & Sozialwissenschaften", "11."],
    ["Gesellschaft und Kultur/Geschichts- und Archäologieforschung", "Geschichtswissenschaft", "12."],
    ["Raum- und Planetensysteme/Astronomie und Kosmologie", "Astronomie & Astrophysik", "13."],
    ["Raum- und Planetensysteme/Planetologie und Geowissenschaften", "Planetologie Iravelles", "14."],
    ["Xenoforschung/Xenobiologie", "Xenobiologie", "15."],
];
for (const [z] of ZWEIGE) if (!exists(FZ + "/" + z + "/index.html")) throw new Error("Zweig fehlt: " + z);
const zweigKarte = {
    titel: "Einordnung in den Forschungsbaum", quelle: "Info_material · Oneiroiden · Forschung",
    html: `<p>Die wissenschaftlichen Bereiche der Oneiroiden-Forschung gehören zu diesen vorhandenen Forschungszweigen:</p>
<ul class="${P}-zweig-liste">${ZWEIGE.map(([z, t, f]) => `<li><a href="${rel(FO, FZ + "/" + z + "/index.html")}"><strong>${esc(t)}</strong><span>${esc(f)}</span></a></li>`).join("")}</ul>`,
};

const SEITEN = [
    { key: "hauptseite", suffix: "", label: "Übersicht", file: S + "/hauptseite/Spezies.html", icon: "✶" },
    { key: "allgemeines", suffix: "-allgemeines", label: "Allgemeines", file: S + "/Unterseiten/Allgemeines/allgemeines.html", icon: "ⓘ", text: "Arunai, Erscheinung, Fähigkeiten und ihre Grenzen", titelbild: B_("Grundgestalt"),
        quellen: ["allgemein/allgemein.md", "01_Speziesdaten/speziesdaten.md"], galerie: GES.slice(0, 6) },
    { key: "biologie", suffix: "-biologie", label: "Biologie", file: S + "/Unterseiten/Biologie/biologie.html", icon: "⟡", text: "Schlafkrone, Nervensystem und die Biologie des gemeinsamen Träumens", titelbild: B_("Anatomietafel"),
        quellen: ["Biologie/biologie.md"], galerie: [B_("Anatomietafel"), B_("Panzerungstafel"), B_("Farbvarianten"), B_("Leuchtende Schlafkrone")] },
    { key: "entwicklung", suffix: "-entwicklung", label: "Entwicklung", file: S + "/Unterseiten/Entwicklung/entwicklung.html", icon: "⤳", text: "Evolution der Schlafkoordination, Ei, Kindheit und Alter", titelbild: B_("Schlüpfling"),
        quellen: ["02_Geschichte_Entwicklung/entwicklung.md"], galerie: ENT },
    { key: "heimatwelt", suffix: "-heimatwelt", label: "Heimatwelt", file: HWS, icon: "◍", text: "Iravelle im Darynth-System – Terrassen, Stillbecken und zwei Monde", titelbild: B_("Lebensbaum"),
        design: [iravelleKarte], quellen: ["05_Heimatwelt/heimatwelt-referenz.md", { datei: "sternensystem/sternensystem.md", hinweis: "Darynth-System" }], galerie: HW },
    { key: "gesellschaft", suffix: "-gesellschaft", label: "Gesellschaft", file: S + "/Unterseiten/Gesellschaft/gesellschaft.html", icon: "⁂", text: "Haushalte, Traumdramaturgie, Duftkomposition und Traumtheater", titelbild: B_("Stadt der Oneiroiden"),
        quellen: ["03_Gesellschaft_Kultur/gesellschaft.md", "03_Gesellschaft_Kultur/kultur.md"], galerie: [B_("Stadt der Oneiroiden"), B_("Traumheiligtum"), VOLL[0], VOLL[1]].filter(Boolean) },
    { key: "politik", suffix: "-politik", label: "Politik", file: S + "/Unterseiten/Politik/politik.html", icon: "⚖", text: "Konvent der Zwei Zustände, Traumrecht und regionale Modelle", titelbild: VOLL[3] ?? B_("Dossiertafel"),
        quellen: ["04_Politik_Fraktionsbeziehungen/politik.md", "04_Politik_Fraktionsbeziehungen/fraktionsbeziehungen.md"], galerie: VOLL.slice(2, 6) },
    { key: "geschichte", suffix: "-geschichte", label: "Geschichte", file: S + "/Unterseiten/Geschichte/geschichte.html", icon: "⧗", text: "Großer Sturmwinter, Doppelte Chronik und Raumfahrt", titelbild: B_("Traumheiligtum"),
        quellen: ["02_Geschichte_Entwicklung/geschichte.md"], galerie: [B_("Traumheiligtum"), B_("fremden Monden"), B_("Dämmerung"), B_("Wanderer")] },
    { key: "gameplay", suffix: "-gameplay", label: "Spielintegration", file: S + "/Gameplay/gameplay.html", icon: "◈", text: "Traumteilnahme, Rekonstruktionsansicht und Erinnerungsvergleich", titelbild: B_("Neonlicht"),
        quellen: [{ datei: "Gameplay/.gitkeep", ohne: FORSCHUNG_GP }], galerie: [B_("Neonlicht"), B_("leuchtenden Ringe"), B_("Traumturm"), B_("Wanderer")] },
    { key: "forschung", suffix: "-forschung", label: "Forschung", file: FO, icon: "⚗", text: "Traumkoordination im Labor, Chemie, Akustik und Bewusstsein", titelbild: B_("Dossiertafel der Varianten"),
        design: [zweigKarte], quellen: ["Forschung/.gitkeep", { datei: "Gameplay/.gitkeep", nur: FORSCHUNG_GP, hinweis: "Spielintegration" }] },
    { key: "technologien", suffix: "-technologien", label: TECHNIK_REITER[1], file: TE, icon: TECHNIK_REITER[3], text: "Somnokartograph, Ankeremitter, Kooperationskapseln und Schlafschutz", titelbild: VOLL[6] ?? B_("Traumturm"),
        design: [technikKarte], quellen: ["technologien/technologien.md"], galerie: VOLL.slice(6, 10) },
    { key: "medien", suffix: "-medien", label: "Medien", file: S + "/Unterseiten/Medien/medien.html", icon: "▣", text: "Bildarchiv, Klänge, Bewegtbild und Modelle", titelbild: B_("Heller Oneiroid"), quellen: [] },
];

for (const s of SEITEN) for (const e of [".css", ".js"]) { const f = s.file.replace(/\.html$/, e); if (exists(f) && /Spezies-Baukasten \(scripts\/spezies\)/.test(read(f))) fs.unlinkSync(path.join(ROOT, f)); }
routenSetzen(R0, S, [TECHNIK_REITER]);

const B = erstelle({
    S, INFO, A, NAME, KLASSE, P, R0, THEME: "#09070f", SEITEN, REGION: {}, GRUPPE,
    BESCHREIBUNG: "Oneiroiden (Arunai) im APORIA-Weltenarchiv: sechsbeinige, nicht humanoide Spezies, die im Schlaf Erinnerungs- und Vorstellungsmuster mit anderen abstimmt – kooperative Traumkoordination ohne Schwarmbewusstsein. Heimatwelt Iravelle im Darynth-System.",
    links: (f, S_, rel) => [
        [rel(f, PLANET), "Planetendossier Iravelle", "Heimatwelt im Planetenarchiv"],
        [rel(f, SYSTEMSEITE), "Darynth-System", "Systemübersicht"],
        [rel(f, KARTE) + SYSTEM, "Sternenkarte", "Darynth-System in der Karte ansehen"],
        [rel(f, S_.technologien.file), "Technologien", "Schlaf- und Traumtechnik", `data-route="${R0}-technologien"`],
        [rel(f, TECH_ARCHIV), "Technologiearchiv", "Erfindungen, Maschinen und Geräte", 'data-route="inhalt-technologien"'],
        [rel(f, S_.forschung.file), "Forschung", "Forschung an den Oneiroiden", `data-route="${R0}-forschung"`],
        [rel(f, FZ + "/Übersicht/Forschung.html"), "Forschungsarchiv", "Alle Forschungszweige"],
    ],
});

medienEintragen(KLASSE, { videos: { animationen: { items: [] }, videos: { items: VIDEOS } }, audio: {} });
const ZUSATZ_CSS = `
/* Knöpfe, Technologie-Übersicht und Forschungsbaum (Oneiroiden) */
.${P}-knopfreihe { display: flex; flex-wrap: wrap; gap: .5rem; }
.${P}-knopf { display: inline-flex; padding: .5rem .95rem; border: 1px solid var(--${P}-violett); border-radius: 999px; background: color-mix(in srgb, var(--${P}-violett) 14%, transparent); color: var(--${P}-text) !important; font-weight: 600; text-decoration: none; }
.${P}-knopf:hover { box-shadow: 0 0 .9rem color-mix(in srgb, var(--${P}-violett) 45%, transparent); }
.${P}-knopf--leise { border-color: var(--${P}-linie-hell); background: transparent; }
.${P}-technik-chips, .${P}-zweig-liste { display: grid !important; grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr)); gap: .45rem !important; padding: 0; list-style: none; }
.${P}-technik-chips li, .${P}-zweig-liste li { padding: 0 !important; }
.${P}-technik-chips li::before, .${P}-zweig-liste li::before { display: none !important; }
.${P}-technik-chips a, .${P}-zweig-liste a { display: grid; gap: .1rem; height: 100%; padding: .55rem .7rem; border: 1px solid var(--${P}-linie); border-radius: 10px; background: #0f0b16b3; color: var(--${P}-text) !important; text-decoration: none; }
.${P}-technik-chips a:hover, .${P}-zweig-liste a:hover { border-color: var(--${P}-cyan); }
.${P}-technik-chips b { color: var(--${P}-cyan); font: 700 .74rem/1.2 ui-monospace, Consolas, monospace; }
.${P}-technik-chips span, .${P}-zweig-liste strong { color: var(--${P}-violett-hell); font-size: .9rem; }
.${P}-zweig-liste span { color: var(--${P}-cyan); font: 600 .74rem/1.2 ui-monospace, Consolas, monospace; }
`;
for (const key of ["allgemeines", "biologie", "entwicklung", "heimatwelt", "gesellschaft", "politik", "geschichte", "gameplay", "forschung", "technologien"]) B.reiterSeite(B.S_[key]);
const TEXTE = { "Gesamtdarstellung": "Natürlicher Bauplan", "Iravelle": "Heimatwelt", "Entwicklungsstadien": "Entwicklungsstadium", "Vollentwickelt": "Designtafel" };
B.medienSeite(B.S_.medien, { bilder: ALLE, klang: [], modellRegion: null, texte: TEXTE });
fs.appendFileSync(path.join(ROOT, S, KLASSE + "-basis.css"), ZUSATZ_CSS);

// ---------- Hauptseite ----------
const SIGNALE = [["Grundmechanismus", "Ähnliche Schlafzustände, gemeinsame Erfahrungen und erlernte Traumanker."], ["Chemische Signale", "Die Schlafkrone verteilt flüchtige Moleküle – Ruhebereitschaft, Erregung, Themenanker."], ["Akustische Signale", "Wiederkehrende Atemklangmuster dienen als zusätzlicher Hinweis."], ["Neuronale Verarbeitung", "Jedes Gehirn verknüpft die Reize mit eigenen Vorstellungen – die Traumwelten bleiben individuell."]];
const FAEHIG = [["Traumkoordination", "Ähnliche Traumthemen und -abläufe in mehreren Individuen."], ["Bewusstes Träumen", "Eigene Traumhandlungen erkennen und beeinflussen."], ["Gedächtnisverarbeitung", "Erfahrungen im Schlaf neu verbinden und bewerten."], ["Soziale Simulation", "Geplante Handlungen als innere Vorstellung durchspielen."], ["Schlafkommunikation", "Duftstoffe und Atemlaute stimmen Ruhephasen ab."], ["Traumgestaltung", "Komplexe Traumszenarien gezielt vorbereiten."]];
const NICHT = ["Keine unbegrenzte Telepathie", "Keine Fernwahrnehmung durch Träumen", "Keine Veränderung physischer Materie", "Keine zuverlässigen Zukunftsvisionen", "Keine garantiert identischen Erinnerungen"];
const RECHT = ["Erzwungene Traumteilnahme", "Unerlaubte Verabreichung schlafbeeinflussender Stoffe", "Manipulation von Zeugenerinnerungen", "Missbrauch medizinischer Traumtechnik", "Unbefugte Speicherung sensibler Schlafdaten", "Vorsätzliche Störung lebenswichtiger Schlafsysteme"];
const MASSE = [["Körperlänge", "1,2–1,8 m"], ["Körperhöhe", "0,5–0,9 m"], ["Körpermasse", "45–95 kg"], ["Laufbeine", "6"], ["Greifpalpen", "2"], ["Augen", "4, dämmerungstauglich"]];
// Traumkreise: drei Schlafende, deren Traumräume sich überlappen, aber getrennt bleiben
function traum() {
    const p = [[120, 92], [200, 92], [160, 160]];
    return `<svg class="${P}-traum" viewBox="0 0 320 250" role="img" aria-label="Drei Schlafende, deren Traumräume sich überlappen, aber getrennt bleiben">
                        ${p.map(([x, y], i) => `<circle class="${P}-t-raum" cx="${x}" cy="${y}" r="62" style="--i:${i}"/>`).join("")}
                        <circle class="${P}-t-mitte" cx="160" cy="115" r="16"/>
                        ${p.map(([x, y], i) => { const sx = x + (x - 160) * 0.62, sy = y + (y - 115) * 0.62; return `<g class="${P}-t-schlaefer" style="--i:${i}"><circle cx="${sx.toFixed(0)}" cy="${sy.toFixed(0)}" r="8"/><path d="M${(sx - 10).toFixed(0)} ${(sy - 12).toFixed(0)} q10 -10 20 0"/></g>`; }).join("")}
                        <text x="160" y="119">Anker</text>
                    </svg>`;
}
// 30-Stunden-Tag: 20 h aktiv, 10 h Ruhe – drei zeitversetzte Schichten
const SCHICHT = [[0, "Gruppe A"], [10, "Gruppe B"], [20, "Gruppe C"]];
{
    const s = B.S_.hauptseite, f = s.file, S_ = B.S_;
    const L = (k) => `href="${rel(f, S_[k].file)}" data-route="${B.ROUTE(S_[k])}"`;
    const img = (b, klasse, alt = "", laden = "lazy") => `<img class="${klasse}" src="${rel(f, b.datei ?? b)}" alt="${esc(alt)}" ${laden === "eager" ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
    const kachel = (key) => `                    <a class="${P}-panel ${P}-thema" ${L(key)}>${img(S_[key].titelbild, `${P}-thema-bild`)}<span class="${P}-thema-kopf"><span class="${P}-icon" aria-hidden="true">${S_[key].icon}</span><strong>${esc(S_[key].label)}</strong></span><span class="${P}-thema-text">${esc(S_[key].text)}</span></a>`;
    const stufenAuswahl = [2, 3, 5, 7, 9, 11].map((n) => ENT.find((b) => nr(b.datei) === n)).filter(Boolean);
    const html = B.kopf(s) +
        `            <header class="${P}-hero">
                ${img(HERO, `${P}-hero-bild`, "", "eager")}
                <span class="${P}-glanz" aria-hidden="true"></span>
                <span class="${P}-sterne" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></span>
                <div class="${P}-hero-text">
                    ${B.pfad(s)}
                    <p class="${P}-kicker ${P}-kicker--linie">Speziesdossier · Mentale Spezies</p>
                    <h1>${NAME}</h1>
                    <p class="${P}-unterzeile">Eigenbezeichnung <em>Arunai</em> · Heimatwelt Iravelle im Darynth-System</p>
                    <p class="${P}-intro">Eine sechsbeinige, nicht humanoide Spezies, die im Schlaf Erinnerungs- und Vorstellungsmuster mit anderen abstimmen kann. So entstehen gemeinsame Träume – ohne übergeordnetes Bewusstsein, ohne Telepathie, ohne Traumdimension: getrennte, aber koordinierte Vorgänge in einzelnen Gehirnen.</p>
                    <p class="${P}-hero-links"><a ${L("biologie")}>Biologie des Träumens ›</a><a ${L("technologien")}>Technologien ›</a><a href="${rel(f, PLANET)}">Heimatwelt Iravelle ›</a></p>
                </div>
            </header>
` + B.reiter(s) +
        `            <dl class="${P}-panel ${P}-kennzahlen" aria-label="Kennzahlen">
                <div><dt>Heimatwelt</dt><dd><a href="${rel(f, PLANET)}">Iravelle</a></dd><span>Darynth-System</span></div>
                <div><dt>Körperlänge</dt><dd>1,2–1,8 m</dd><span>45–95 kg</span></div>
                <div><dt>Lebenserwartung</dt><dd>100–140</dd><span>Erdjahre</span></div>
                <div><dt>Tag auf Iravelle</dt><dd>30 h</dd><span>20 h wach · 10 h Ruhe</span></div>
                <div><dt>Technologien</dt><dd><a ${L("technologien")}>${TECHNIK.length}</a></dd><span>Schlaf- und Traumtechnik</span></div>
            </dl>
            <section class="${P}-panel ${P}-block ${P}-traumblock" aria-labelledby="traum-titel">
                ${B.titel("Gemeinsam träumen, getrennt bleiben", "Biologie des gemeinsamen Träumens", "☾", "traum-titel")}
                <div class="${P}-traum-raster">
                    <div class="${P}-traum-grafik">${traum()}</div>
                    <ol class="${P}-signale">
${SIGNALE.map(([t, d], i) => `                        <li style="--i:${i}"><strong>${t}</strong><span>${esc(d)}</span></li>`).join("\n")}
                    </ol>
                </div>
                <p class="${P}-hinweis">Natürliche Synchronisation funktioniert besonders gut in kleinen, vertrauten Gruppen. Starker Wind, unterschiedliche Schlafphasen, Krankheit oder ungeeignete Signale verringern die Zuverlässigkeit.</p>
                <p class="${P}-quelle">Quelle: Info_material · ${NAME} · Biologie 7.1–7.5 · <a ${L("biologie")}>Mehr unter Biologie →</a></p>
            </section>
            <section class="${P}-abschnitt" aria-labelledby="faehig-titel">
                <h2 class="${P}-h2 ${P}-h2--linie" id="faehig-titel">Fähigkeiten und ihre Grenzen</h2>
                <div class="${P}-faehig">
                    <ul class="${P}-faehig-liste">
${FAEHIG.map(([t, d], i) => `                        <li class="${P}-panel" style="--i:${i}"><strong>${t}</strong><span>${esc(d)}</span></li>`).join("\n")}
                    </ul>
                    <aside class="${P}-panel ${P}-grenzen"><h3>Was sie nicht können</h3><ul>${NICHT.map((n) => `<li>${esc(n)}</li>`).join("")}</ul></aside>
                </div>
            </section>
            <section class="${P}-panel ${P}-block ${P}-tag ${P}-abschnitt" aria-labelledby="tag-titel">
                <div class="${P}-tag-grafik">
                    <div class="${P}-tagring" role="img" aria-label="30-Stunden-Tag: 20 Stunden aktiv, 10 Stunden Ruhe"><span><b>30 h</b>ein Tag</span></div>
                    <ul class="${P}-legende"><li><i class="${P}-l-wach"></i>20 h aktiv</li><li><i class="${P}-l-ruhe"></i>10 h Ruhe und Schlaf</li></ul>
                </div>
                <div class="${P}-tag-text">
                    ${B.titel("Ein Tag auf Iravelle", "Zeitversetzte Gemeinschaften", "◐", "tag-titel")}
                    <p>Ein vollständiger Tag dauert ungefähr <strong>30 Erdstunden</strong>. Eine erwachsene Person verbringt davon etwa 20 Stunden aktiv und 10 Stunden in Ruhe- und Schlafphasen. Gemeinschaften organisieren ihre Tätigkeiten <strong>zeitversetzt</strong>, damit Landwirtschaft, Versorgung, medizinische Betreuung und Sicherheit dauerhaft aufrechterhalten werden.</p>
                    <div class="${P}-schichten">
${SCHICHT.map(([start, t]) => `                        <div><span>${t}</span><i style="--s:${start};"></i></div>`).join("\n")}
                        <div class="${P}-skala" aria-hidden="true"><span>0 h</span><span>10 h</span><span>20 h</span><span>30 h</span></div>
                    </div>
                    <p class="${P}-quelle">Quelle: Info_material · ${NAME} · Allgemeines 7. · <a ${L("gesellschaft")}>Mehr unter Gesellschaft →</a></p>
                </div>
            </section>
            <section class="${P}-panel ${P}-block ${P}-bau ${P}-abschnitt" aria-labelledby="bau-titel">
                <figure class="${P}-bau-bild">${img(B_("Grundgestalt"), "", "Oneiroid mit Schlafkrone")}</figure>
                <div class="${P}-bau-text">
                    ${B.titel("Ein Körper mit Schlafkrone", "Sechs Laufbeine · zwei Greifpalpen · vier Augen", "✶", "bau-titel")}
                    <p>Der Körper ist <strong>breit und flachoval</strong>, teilweise weich gepanzert, in Schieferblau, Braun, Grau, Umbra oder Ocker. Auf dem Rücken liegt die <strong>Schlafkrone</strong> aus beweglichen Membranlamellen, Duftdrüsen und Luftkanälen – sie verteilt chemische Schlafsignale. Sie ist kein Flügel, kein elektrischer Sender und kein eigenständiges Denkorgan.</p>
                    <dl class="${P}-mini">${MASSE.map(([t, w]) => `<div><dt>${t}</dt><dd>${w}</dd></div>`).join("")}</dl>
                    <p class="${P}-quelle">Quelle: Info_material · ${NAME} · Allgemeines 3. · Biologie 2.–3. · <a ${L("biologie")}>Mehr unter Biologie →</a></p>
                </div>
            </section>
            <section class="${P}-abschnitt" aria-labelledby="stufen-titel">
                <h2 class="${P}-h2 ${P}-h2--linie" id="stufen-titel">Vom Ei zur Schlafkrone</h2>
                <div class="${P}-stufen">
${stufenAuswahl.map((b, i) => `                    <a class="${P}-panel ${P}-stufe" ${L("entwicklung")} style="--i:${i}"><figure>${img(b, "", b.titel)}</figure><span><b>${i + 1}</b>${esc(b.titel)}</span></a>`).join("\n")}
                </div>
            </section>
            <section class="${P}-panel ${P}-block ${P}-recht ${P}-abschnitt" aria-labelledby="recht-titel">
                ${B.titel("Traumrecht", "Konvent der Zwei Zustände", "⚖", "recht-titel")}
                <p>Das Traumrecht behandelt die besondere Verletzlichkeit schlafender Personen. Der <strong>Konvent der Zwei Zustände</strong> – die wichtigste überregionale Institution – schützt unter anderem die Schlafautonomie. Ein gemeinsam geträumter Verdacht ist <strong>kein ausreichender Schuldnachweis</strong>.</p>
                <ol class="${P}-rechte">
${RECHT.map((r) => `                    <li>${esc(r)}</li>`).join("\n")}
                </ol>
                <p class="${P}-quelle">Quelle: Info_material · ${NAME} · Politik 2., 6. · <a ${L("politik")}>Mehr unter Politik →</a></p>
            </section>
            <section class="${P}-panel ${P}-block ${P}-technik ${P}-abschnitt" aria-labelledby="technik-titel">
                ${B.titel("Technologien", "Schlaf- und Traumtechnik", "⚙", "technik-titel")}
                <ul class="${P}-technik-raster">
${TECHNIK.map((k, i) => `                    <li style="--i:${i}"><a href="${rel(f, TE)}#${k.id}" data-route="${R0}-technologien"><b>${esc(k.nr)}</b><span>${esc(k.titel)}</span></a></li>`).join("\n")}
                </ul>
                <p class="${P}-quelle">Quelle: Info_material · ${NAME} · Technologien · <a ${L("technologien")}>Alle Technologien →</a></p>
            </section>
            <div class="${P}-zwei">
                ${B.dossierSteckbrief(s, { datei: "allgemein/allgemein.md", steckbrief: ["Identität und Einordnung"], beschreibung: ["Grundlegende Beschreibung"], mehr: "allgemeines" })}
                <aside class="${P}-panel ${P}-welt" aria-labelledby="welt-titel">
                    <a class="${P}-welt-bild" href="${rel(f, PLANET)}">${img(B_("fremden Monden"), "", "Biolumineszente Stadt unter fremden Monden")}</a>
                    <div class="${P}-block">
                        ${B.titel("Heimatwelt Iravelle", "Darynth-System", "◍", "welt-titel")}
                        <p>Terrestrischer Gesteinsplanet mit fünf Landmassen, Terrassensenken und nebelreichen Stillbecken. Die Monde Nethis und Ruva erzeugen kombinierte Gezeiten.</p>
                        <dl class="${P}-mini"><div><dt>Stern</dt><dd>Darynth, K3 V</dd></div><div><dt>Abstand</dt><dd>0,65 AE</dd></div><div><dt>Jahr</dt><dd>216,7 Erdtage</dd></div><div><dt>Tag</dt><dd>30 h</dd></div><div><dt>Monde</dt><dd>Nethis, Ruva</dd></div><div><dt>Wasser</dt><dd>54 %</dd></div></dl>
                        <p class="${P}-knopfreihe"><a class="${P}-knopf" href="${rel(f, PLANET)}">Planetendossier ›</a><a class="${P}-knopf" href="${rel(f, SYSTEMSEITE)}">Darynth-System</a><a class="${P}-knopf ${P}-knopf--leise" href="${rel(f, KARTE)}${SYSTEM}">Sternenkarte ›</a><a class="${P}-knopf ${P}-knopf--leise" ${L("heimatwelt")}>Heimatwelt-Kapitel ›</a></p>
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
                    ${B.quelle("Info_material · Oneiroiden · Speziesdossier V1.0")}
                </div>
            </div>
` + B.fuss();
    write(f, html);
    write(f.replace(/\.html$/, ".js"), `// Oneiroiden – Hauptseite · erzeugt von scripts/spezies/eigene/oneiroiden.mjs\n// Gemeinsame Funktionen (Topbar, Sidebar, Routen, Klappbereiche, Bildkarussell mit Großansicht) kommen aus der Basis.\nimport "../oneiroiden-basis.js";\n`);
    write(f.replace(/\.html$/, ".css"), fs.readFileSync(path.join(ROOT, "scripts/spezies/eigene/oneiroiden-hauptseite.css"), "utf8"));
}

// ---------- Übersichtskarte der Gruppe ----------
{
    const datei = path.join(ROOT, GRUPPE.uebersicht);
    const t = fs.readFileSync(datei, "utf8");
    const kopf = t.indexOf("<h2>Oneiroiden</h2>");
    const start = t.lastIndexOf('<section class="species-category"', kopf);
    const ende = t.indexOf("</section>", kopf) + "</section>".length;
    if (kopf < 0 || start < 0) throw new Error("Übersichtskarte nicht gefunden");
    const id = (t.slice(start, kopf).match(/id="([^"]+)"/) ?? [0, "kategorie-6"])[1];
    const karte = `<section class="species-category" id="${id}" data-world="Iravelle" data-habitat="Terrassenlandschaften und Feuchtgebiete">
        <img src="${rel(GRUPPE.uebersicht, HERO.datei)}" alt="" loading="lazy">
        <div><h2>Oneiroiden</h2><div class="species-card-columns">
          <dl><div><dt>Heimatwelt</dt><dd>Iravelle</dd></div><div><dt>Körpergröße</dt><dd>1,2–1,8 m Körperlänge</dd></div><div><dt>Lebensdauer</dt><dd>100–140 Erdjahre</dd></div><div><dt>Lebensraum</dt><dd>Terrassenlandschaften und Feuchtgebiete</dd></div></dl>
          <div class="species-card-copy"><p>Kooperative Traumkoordination</p><a href="../Oneiroiden/hauptseite/Spezies.html" data-route="${R0}">Dossier öffnen →</a></div>
        </div></div>
      </section>`;
    fs.writeFileSync(datei, t.slice(0, start) + karte + t.slice(ende));
}
console.log(`${NAME} fertig: ${SEITEN.length} Seiten · ${ALLE.length} Bilder · ${TECHNIK.length} Technologien · ${KLAENGE.length} Klänge · ${VIDEOS.length} Videos`);
