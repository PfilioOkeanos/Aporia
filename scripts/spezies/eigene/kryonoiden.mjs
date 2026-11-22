// Spezies-Baukasten · eigenes Bauskript (Hauptseite nach Designtafel). Aufruf: node scripts/spezies/eigene/kryonoiden.mjs
// Baut die Kryonoiden-Seiten im Speziesstandard; Reiter nach der Designtafel „Kryonoiden – Archiv des Eisplaneten“.
// Inhalte: Info_material (wenn ausgefüllt) + Designtafel (wörtlich, als Quelle gekennzeichnet). Seitenklänge: kryonoiden-klang.js.
import fs from "node:fs";
import path from "node:path";
import { ROOT, FZ, esc, rel, write, exists, fakten, erstelle, medienEintragen, audioBlock } from "../bibliothek.mjs";
import { baueBasis } from "../basis.mjs";

const NAME = "Kryonoiden", KLASSE = "kryonoiden", P = "kr", R0 = "spezies-biological-14";
const S = "inhalte/spezies/Biologische Spezies/Kryonoiden";
const INFO = "Info_material/Alle_spezies_daten/Biologische Spezies/Kryonoiden";
const A = "assets/bilder/Alle Spezies+Übersicht/Biologische Spezies/Kryonoiden";
const AUDIO = "assets/audio/Alle Spezies+Übersicht/Biologische Spezies/Kryonoiden/APORIA_Kryonoiden_SFX_48kHz";
const DES = A + "/Design/Kryonoiden – Archiv des Eisplaneten.png";
const QD = "Designtafel „Kryonoiden – Archiv des Eisplaneten“";
if (!exists(DES)) throw new Error("Designtafel fehlt");

baueBasis({
    ordner: "Kryonoiden", praefix: P, klasse: KLASSE, name: NAME, design: "Kryonoiden/Design/Kryonoiden – Archiv des Eisplaneten.png", motto: "„Archiv des Eisplaneten“",
    farben: { bg: "#060b14", glas: "#0d1626", glashell: "#13203a", linie: "#8fc8ff", liniehell: "#a8d8ff", akzent: "#7fc4ff", akzenthell: "#d3ebff", zweit: "#9ff3ff", text: "#e8f2fb", leise: "#9fb3c8", tint: "#4f8fd0", glaslicht: "#16243c", glasdunkel: "#060b14", glow1: "#2f6fd6", glow2: "#5fd8f0", glow3: "#9ab8ff", rahmen: "#08101c", knopf: "#152640", reiter: "#0d1828", flaeche: "#0c1626", kachel: "#0a1320", herobg: "#070d18", aktiv1: "#1f4f86", aktiv2: "#112c50", h1: "#f2f9ff", intro: "#d2e2f2", zoombg: "#03070d" },
});

// ---------- Bilder ----------
const roh = fs.readdirSync(path.join(ROOT, A, "gesamtdarstellung")).filter((x) => /\.png$/i.test(x)).sort((a, b) => a.localeCompare(b, "de", { numeric: true }));
let nrEntwurf = 0;
const BILDER = roh.map((x) => {
    const datei = A + "/gesamtdarstellung/" + x;
    if (/designi_character/i.test(x)) return { datei, titel: `Charakterentwurf ${++nrEntwurf}`, kategorie: "Charakterentwürfe" };
    const titel = x.replace(/\.png$/i, "").replace(/-\d+$/, "").replace(/_ /g, ": ").replace(/_/g, " ").trim();
    return { datei, titel, kategorie: /Dossier|Datenblatt|Enzyklop|Spezieskonzept|Speziesprofil|Studie|Kryonoid_A\d/i.test(x) ? "Dossiertafeln" : "Szenen & Porträts" };
});
const TAFEL = { datei: DES, titel: "Kryonoiden – Archiv des Eisplaneten", kategorie: "Designtafel" };
const ALLE = [TAFEL, ...BILDER.filter((b) => b.kategorie === "Szenen & Porträts"), ...BILDER.filter((b) => b.kategorie === "Dossiertafeln"), ...BILDER.filter((b) => b.kategorie === "Charakterentwürfe")];
const B_ = (teil) => { const b = BILDER.find((x) => x.datei.includes(teil)); if (!b) throw new Error("Bild fehlt: " + teil); return b; };
const SZENEN = BILDER.filter((b) => b.kategorie === "Szenen & Porträts"), DOSSIER = BILDER.filter((b) => b.kategorie === "Dossiertafeln"), ENTWURF = BILDER.filter((b) => b.kategorie === "Charakterentwürfe");
const r = 941 / 1672;
const REGION = {
    figur: { bild: DES, r, x: .29, y: .06, w: .30, h: .70 },
    anatomie: { bild: DES, r, x: .588, y: .425, w: .165, h: .25 },
    kammer: { bild: DES, r, x: .775, y: .02, w: .225, h: .96 },
    t_welt: { bild: DES, r, x: .139, y: .772, w: .148, h: .14 },
    t_kultur: { bild: DES, r, x: .299, y: .772, w: .147, h: .14 },
    t_bio: { bild: DES, r, x: .457, y: .772, w: .143, h: .14 },
    t_tech: { bild: DES, r, x: .613, y: .772, w: .139, h: .14 },
};

// ---------- Inhalte der Designtafel (wörtlich) ----------
const MOTTO = ["Leben im Extrem.", "Denken in Zyklen.", "Existieren im Eis."];
const BESCHREIBUNG = `<p>Die Kryonoiden sind eine hochspezialisierte, intelligente Spezies, die sich über Jahrmillionen an die extremen Bedingungen ihrer Heimatwelt angepasst hat. Sie vereinen außergewöhnliche physiologische Widerstandskraft mit einer tief verwurzelten, zyklischen Kultur, die auf Stabilität, Speicher und Kontinuität ausgerichtet ist.</p>`;
const DATEN = [["Körpergröße", "2,6 – 3,8 m"], ["Körpermasse", "420 – 780 kg"], ["Lebenserwartung", "400 – 650 Jahre"], ["Umgebungstoleranz", "bis −230 °C"], ["Sozialstruktur", "Klan-Zyklen"], ["Bewusstseinsform", "kollektiv-individuell"]];
const WELT = [["Typ", "Eisplanet (Klasse K)"], ["Ø Temperatur", "−184 °C"], ["Atmosphäre", "dünn, stabil"], ["Schwerkraft", "0,98 g"]];
const D = (keys) => fakten(DATEN.filter(([k]) => keys.includes(k)), P);

const SEITEN = [
    { key: "hauptseite", suffix: "", label: "Übersicht", file: S + "/hauptseite/Spezies.html", icon: "❄" },
    { key: "biologie", suffix: "-biologie", label: "Biologie", file: S + "/Unterseiten/Biologie/biologie.html", icon: "⟡", text: "Biologie & Adaption", titelbild: { region: "t_bio" },
        design: [{ titel: "Speziesdaten", quelle: QD, html: D(["Körpergröße", "Körpermasse", "Lebenserwartung", "Umgebungstoleranz"]) }, { titel: "Anatomie (Schema)", quelle: QD, html: `<span class="kr-ausschnitt kr-anatomie" style="--x:${REGION.anatomie.x};--y:${REGION.anatomie.y};--w:${REGION.anatomie.w};--h:${REGION.anatomie.h};--r:${r}"><img src="§ANATOMIE§" alt="Anatomie-Schema der Kryonoiden" loading="lazy" decoding="async"></span>` }],
        quellen: [{"datei":"Allgemein/Allgemeines","ohne":["Intelligenz"]}, "01_Speziesdaten/speziesdaten.md", {"datei":"02_Geschichte_Entwicklung/entwicklung.md","ohne":["Evolution der Wahrnehmung","Evolution des Nervensystems","Entstehung der Intelligenz","Evolutionsbiologische Forschungsfragen"]}], galerie: [TAFEL, ...DOSSIER.filter((b) => /Kryonoid_A\d|Datenblatt|Studie/.test(b.datei))] },
    { key: "psyche", suffix: "-psyche", label: "Psyche", file: S + "/Unterseiten/Psyche/psyche.html", icon: "◌", text: "Denken in Zyklen – Bewusstsein und Wahrnehmung", titelbild: B_("leuchtenden Augen"),
        design: [{ titel: "Bewusstsein", quelle: QD, html: D(["Bewusstseinsform"]) + `<p><em>${MOTTO.join(" ")}</em></p>` }],
        quellen: [{"datei":"Allgemein/Allgemeines","nur":["Intelligenz"],"hinweis":"Allgemeines"}, {"datei":"02_Geschichte_Entwicklung/entwicklung.md","nur":["Evolution der Wahrnehmung","Evolution des Nervensystems","Entstehung der Intelligenz"],"hinweis":"Entwicklung"}, {"datei":"03_Gesellschaft_Kultur/gesellschaft.md","nur":["Philosophie und Weltanschauungen","Religion"],"hinweis":"Gesellschaft"}], galerie: SZENEN.slice(0, 6) },
    { key: "kultur", suffix: "-kultur", label: "Kultur", file: S + "/Unterseiten/Kultur/kultur.html", icon: "⁂", text: "Kultur & Siedlungen", titelbild: { region: "t_kultur" },
        design: [{ titel: "Kultur & Sozialstruktur", quelle: QD, html: D(["Sozialstruktur"]) + BESCHREIBUNG }],
        quellen: [{"datei":"03_Gesellschaft_Kultur/gesellschaft.md","ohne":["Philosophie und Weltanschauungen","Religion"]}, "03_Gesellschaft_Kultur/kultur.md", "04_Politik_Fraktionsbeziehungen/politik.md", "04_Politik_Fraktionsbeziehungen/fraktionsbeziehungen.md"], galerie: [TAFEL, ...SZENEN.slice(6)] },
    { key: "technologie", suffix: "-technologie", label: "Technologie", file: S + "/Unterseiten/Technologie/technologie.html", icon: "⚙", text: "Technologie der Kryonoiden", titelbild: { region: "t_tech" },
        quellen: [{"datei":"Gameplay/.gitkeep","nur":["Technologie und Forschung","Ausrüstung","Siedlungsbau"],"hinweis":"Spielintegration"}, {"datei":"02_Geschichte_Entwicklung/geschichte.md","nur":["Die Entdeckung großräumiger Energiegewinnung","Die Industrialisierung","Technologische Hochphase","Beginn der Raumfahrt","Erschließung weiterer Himmelskörper"],"hinweis":"Auszug aus der Historie"}], galerie: [TAFEL, ...ENTWURF] },
    { key: "heimatwelt", suffix: "-heimatwelt", label: "Heimatwelt", file: S + "/Unterseiten/Heimatwelt/heimatwelt.html", icon: "◍", text: "Nivareth – Eisplanet der Klasse K", titelbild: { region: "t_welt" },
        design: [{ titel: "Nivareth", quelle: QD, html: fakten(WELT, P) }],
        quellen: ["05_Heimatwelt/heimatwelt-referenz.md"], galerie: [TAFEL, ...SZENEN.filter((b) => /Wildnis|ewigen Eis|Eishöhle|Eisnebel/.test(b.datei))] },
    { key: "historie", suffix: "-historie", label: "Historie", file: S + "/Unterseiten/Historie/historie.html", icon: "⧗", text: "Geschichte und Zyklen der Kryonoiden", titelbild: B_("Wächter in eisiger Wildnis"),
        quellen: [{"datei":"02_Geschichte_Entwicklung/geschichte.md","ohne":["Historische Forschungsfragen"]}], galerie: DOSSIER.slice(0, 6) },
    { key: "gameplay", suffix: "-gameplay", label: "Spielintegration", file: S + "/Gameplay/gameplay.html", icon: "◈", text: "Spielmechaniken und Interaktionsmöglichkeiten", titelbild: B_("Eishöhle"),
        quellen: [{"datei":"Gameplay/.gitkeep","ohne":["Animationen","Sounddesign","Musik","Medienmaterial","Technologie und Forschung","Ausrüstung","Siedlungsbau"]}], galerie: ENTWURF },
    { key: "forschung", suffix: "-forschung", label: "Forschung", file: S + "/Forschung/forschung.html", icon: "⚗", text: "Forschungsfelder rund um die Kryonoiden", titelbild: { region: "anatomie" },
        quellen: ["Forschung/.gitkeep", {"datei":"02_Geschichte_Entwicklung/entwicklung.md","nur":["Evolutionsbiologische Forschungsfragen"],"hinweis":"Entwicklung"}, {"datei":"02_Geschichte_Entwicklung/geschichte.md","nur":["Historische Forschungsfragen"],"hinweis":"Historie"}] },
    { key: "medien", suffix: "-medien", label: "Archiv", file: S + "/Unterseiten/Medien/medien.html", icon: "▣", text: "Bildarchiv, Klangarchiv, Bewegtbild und Modelle", titelbild: { region: "kammer" }, quellen: [{"datei":"Gameplay/.gitkeep","nur":["Animationen","Sounddesign","Musik","Medienmaterial"],"hinweis":"Spielintegration"}] },
];

const KLANGJS = (f) => `import "${rel(f, S + "/kryonoiden-klang.js")}";\n`;
const B = erstelle({
    S, INFO, A, NAME, KLASSE, P, R0, THEME: "#060b14", SEITEN, REGION,
    BESCHREIBUNG: "Kryonoiden im APORIA-Weltenarchiv: eisadaptierte, intelligente Spezies von Nivareth.",
    links: (f, S_, rel) => [
        [rel(f, S_.forschung.file), "Forschung", "Forschungsfelder zu den Kryonoiden", `data-route="${R0}-forschung"`],
        [rel(f, FZ + "/Xenoforschung/Xenobiologie/index.html"), "Xenobiologie", "Forschungszweig"],
        [rel(f, FZ + "/Übersicht/Forschung.html"), "Forschungsarchiv", "Alle Forschungszweige"],
        [rel(f, "inhalte/Rohstoffe/Uebersicht/Rohstoffe.html"), "Rohstoffarchiv", "Rohstoffe im Weltenarchiv", 'data-route="rohstoffe"'],
        [rel(f, "inhalte/himmelskoerper/planeten/planeten.html"), "Planetenarchiv", "Nivareth ist noch kein Planetendossier", 'data-route="planeten"'],
    ],
});

// ---------- Audio → medien.json (inkl. Seitenklänge) ----------
const KLANG = [
    { ordner: "01_Kommunikation", schluessel: "kommunikation", name: "Kommunikation" },
    { ordner: "02_Koerper", schluessel: "koerper", name: "Körper" },
    { ordner: "03_Bewegung", schluessel: "bewegung", name: "Bewegung" },
    { ordner: "04_WarnungEmotion", schluessel: "warnung", name: "Warnung & Emotion" },
    { ordner: "05_TechnikInteraktion", schluessel: "technik", name: "Technik & Interaktion" },
    { ordner: "06_Atmosphaere", schluessel: "atmosphaere", name: "Atmosphäre" },
    { ordner: "07_Kurzsignale", schluessel: "kurzsignale", name: "Kurzsignale" },
];
const audio = audioBlock(AUDIO, KLANG);
for (const d of ["07_Kurzsignale/KRY_STG_001_Entdeckung.wav", "02_Koerper/KRY_BODY_012_FrostKnistern.wav"]) if (!exists(AUDIO + "/" + d)) throw new Error("Klang fehlt: " + d);
medienEintragen(KLASSE, {
    videos: { animationen: { items: [] }, videos: { items: [] } },
    audio,
    ui: {
        eintritt: { title: "Entdeckung (Eintrittsklang der Hauptseite)", src: "../../" + AUDIO + "/07_Kurzsignale/KRY_STG_001_Entdeckung.wav" },
        reiterwechsel: { title: "Frost Knistern (Reiterwechsel)", src: "../../" + AUDIO + "/02_Koerper/KRY_BODY_012_FrostKnistern.wav" },
    },
});

// ---------- Unterseiten ----------
for (const key of ["biologie", "psyche", "kultur", "technologie", "heimatwelt", "historie", "gameplay", "forschung"]) {
    const s = B.S_[key];
    B.reiterSeite(s, { jsZusatz: KLANGJS(s.file) });
    // Bildpfad im Anatomie-Ausschnitt relativ zur Seite setzen
    const datei = path.join(ROOT, s.file);
    const t = fs.readFileSync(datei, "utf8");
    if (t.includes("§ANATOMIE§")) fs.writeFileSync(datei, t.replace("§ANATOMIE§", rel(s.file, DES)));
}
B.medienSeite(B.S_.medien, { bilder: ALLE, klang: KLANG, modellRegion: "figur", jsZusatz: KLANGJS(B.S_.medien.file), texte: { Designtafel: "Designvorlage der Spezies", Dossiertafeln: "Dossiertafel aus dem Bildarchiv", "Szenen & Porträts": "Szene aus dem Bildarchiv", "Charakterentwürfe": "Charakterentwurf aus dem Bildarchiv" } });

// ---------- Hauptseite (nach der Designtafel) ----------
{
    const s = B.S_.hauptseite, f = s.file, S_ = B.S_;
    const L = (k) => `href="${rel(f, S_[k].file)}" data-route="${B.ROUTE(S_[k])}"`;
    const ICON = { "Körpergröße": "♙", "Körpermasse": "⚖", "Lebenserwartung": "∞", "Umgebungstoleranz": "❄", "Sozialstruktur": "⁂", "Bewusstseinsform": "◌" };
    const bildVon = (b, klasse) => b.region ? B.ausschnitt(f, b.region, klasse) : `<img class="${klasse}" src="${rel(f, b.datei)}" alt="" loading="lazy" decoding="async">`;
    const kachel = (key, titel) => `                    <a class="${P}-panel ${P}-thema" ${L(key)}>${bildVon(S_[key].titelbild, `${P}-thema-bild`)}<span class="${P}-thema-kopf"><strong>${esc(titel ?? S_[key].label)}</strong></span>${titel && titel === S_[key].text ? "" : `<span class="${P}-thema-text">${esc(S_[key].text)}</span>`}</a>`;
    const klangAnzahl = KLANG.reduce((n, k) => n + k.anzahl, 0);
    let html = B.kopf(s) +
        `            <header class="${P}-hero">
                ${B.ausschnitt(f, "figur", `${P}-hero-bild`, "", "eager")}
                ${B.ausschnitt(f, "kammer", `${P}-kammer`)}
                <span class="${P}-glanz" aria-hidden="true"></span>
                <div class="${P}-hero-text">
                    ${B.pfad(s)}
                    <h1>${NAME}</h1>
                    <p class="${P}-unterzeile">Eisadaptierte Spezies</p>
                    <p class="${P}-motto">${MOTTO.map(esc).join("<br>")}</p>
                    ${BESCHREIBUNG.replace("<p>", `<p class="${P}-intro">`)}
                </div>
            </header>
` + B.reiter(s) +
        `            <div class="${P}-start">
                <section class="${P}-panel ${P}-block ${P}-daten" aria-labelledby="daten-titel">
                    <h2 class="${P}-h2 ${P}-h2--linie" id="daten-titel">Speziesdaten</h2>
                    <dl class="${P}-datenliste">
${DATEN.map(([a, b]) => `                        <div><dt><span aria-hidden="true">${ICON[a]}</span>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join("\n")}
                    </dl>
                </section>
                <a class="${P}-panel ${P}-block ${P}-anatomie-karte" ${L("biologie")}>
                    <h2 class="${P}-h2 ${P}-h2--linie">Anatomie (Schema)</h2>
                    ${B.ausschnitt(f, "anatomie", "", "Anatomie-Schema der Kryonoiden")}
                    <span class="${P}-mehr">Zur Biologie →</span>
                </a>
                <a class="${P}-panel ${P}-block ${P}-welt" ${L("heimatwelt")}>
                    <p class="${P}-kicker">Heimatwelt</p>
                    <h2>Nivareth</h2>
                    ${fakten(WELT, P)}
                    <span class="${P}-mehr">Zur Heimatwelt →</span>
                </a>
            </div>
            ${B.dossierSteckbrief(s, { datei: "Allgemein/Allgemeines", steckbrief: ["Steckbrief"], beschreibung: ["Grundbeschreibung"], mehr: "biologie" })}
            <section class="${P}-themen" aria-labelledby="themen-titel">
                <h2 class="${P}-h2 ${P}-h2--linie" id="themen-titel">Archivbereiche</h2>
                <div class="${P}-themen-raster">
${kachel("heimatwelt", "Heimatwelt: Nivareth")}
${kachel("kultur", "Kultur & Siedlungen")}
${kachel("biologie", "Biologie & Adaption")}
${kachel("technologie")}
${kachel("psyche")}
${kachel("historie")}
${kachel("gameplay")}
${kachel("medien")}
                </div>
            </section>
            <section class="${P}-panel ${P}-block ${P}-karussell-block" id="bildarchiv" aria-labelledby="bildarchiv-titel">
                ${B.titel("Bildarchiv", ALLE.length + " Bilder", "▣", "bildarchiv-titel")}
                ${B.karussell(f, ALLE, { buehne: true, filter: true, autoplay: 7000, texte: { Designtafel: "Designvorlage der Spezies", Dossiertafeln: "Dossiertafel aus dem Bildarchiv", "Szenen & Porträts": "Szene aus dem Bildarchiv", "Charakterentwürfe": "Charakterentwurf aus dem Bildarchiv" } })}
            </section>
            <section class="${P}-panel ${P}-block ${P}-klangleiste" aria-labelledby="klang-titel">
                ${B.titel("Klangarchiv", klangAnzahl + " Klänge", "♪", "klang-titel")}
                <div class="${P}-klang-chips">
${KLANG.map((k) => `                    <a href="${rel(f, S_.medien.file)}#klang-${k.schluessel}" data-route="${R0}-medien" data-route-fragment="klang-${k.schluessel}">${esc(k.name)} <b>${k.anzahl}</b></a>`).join("\n")}
                </div>
            </section>
            <div class="${P}-layout ${P}-layout--fuss">
                <div class="${P}-inhalt">
                    ${B.verknuepfungen(s)}
                    ${B.quelle(QD)}
                </div>
            </div>
` + B.fuss();
    html = html.replace(`<body class="${KLASSE} ${P}-hauptseite"`, `<body class="${KLASSE} ${P}-hauptseite" data-kr-eintritt`);
    write(f, html);
}
console.log("Kryonoiden fertig:", SEITEN.length, "Seiten ·", ALLE.length, "Bilder ·", KLANG.reduce((n, k) => n + k.anzahl, 0), "Klänge");
