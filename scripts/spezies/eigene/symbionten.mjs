// Spezies-Baukasten · eigenes Bauskript (Hauptseite nach Designtafel). Aufruf: node scripts/spezies/eigene/symbionten.mjs
// Baut die Symbionten-Seiten im Speziesstandard. Inhalte: Info_material (wenn ausgefüllt) + Designtafel (wörtlich, als Quelle gekennzeichnet).
import fs from "node:fs";
import path from "node:path";
import { ROOT, FZ, esc, rel, write, exists, erstelle, medienEintragen, audioBlock } from "../bibliothek.mjs";
import { baueBasis } from "../basis.mjs";

const NAME = "Symbionten", KLASSE = "symbionten", P = "sy", R0 = "spezies-biological-12";
const S = "inhalte/spezies/Biologische Spezies/Symbionten";
const INFO = "Info_material/Alle_spezies_daten/Biologische Spezies/Symbionten";
const A = "assets/bilder/Alle Spezies+Übersicht/Biologische Spezies/Symbionten";
const AUDIO = "assets/audio/Alle Spezies+Übersicht/Biologische Spezies/Symbionten";
const DES = A + "/Design/Symbionten im Weltenarchiv.png";
const QD = "Designtafel „Symbionten im Weltenarchiv“";
if (!exists(DES)) throw new Error("Designtafel fehlt");

baueBasis({
    ordner: "Symbionten", praefix: P, klasse: KLASSE, name: NAME, design: "Symbionten/Design/Symbionten im Weltenarchiv.png", motto: "„Archiv der Wirtsverbindungen“",
    farben: { bg: "#0f0b10", glas: "#191319", glashell: "#221921", linie: "#c9a26b", liniehell: "#dbb98a", akzent: "#d9a86c", akzenthell: "#f3dcc0", zweit: "#e9b8dc", text: "#f2eae5", leise: "#b5a8aa", tint: "#9a6f4a", glaslicht: "#261c24", glasdunkel: "#0f0b10", glow1: "#6a3f7a", glow2: "#c98a5a", glow3: "#4a2f5a", rahmen: "#120d12", knopf: "#2a1f27", reiter: "#1a1319", flaeche: "#181217", kachel: "#140f14", herobg: "#110c11", aktiv1: "#5a3f2a", aktiv2: "#2e2016", h1: "#fbf3ea", intro: "#e2d6d0", zoombg: "#080609" },
});

// ---------- Bilder ----------
const roh = fs.readdirSync(path.join(ROOT, A, "gesamtdarstellung")).filter((x) => /\.png$/i.test(x)).sort((a, b) => Number((a.match(/-(\d+)\.png$/) ?? [0, 99])[1]) - Number((b.match(/-(\d+)\.png$/) ?? [0, 99])[1]));
const BILDER = roh.map((x) => ({ datei: A + "/gesamtdarstellung/" + x, titel: x.replace(/\.png$/i, "").replace(/-\d+$/, "").trim(), kategorie: "Symbionten & Wirte" }));
const TAFEL = { datei: DES, titel: "Symbionten im Weltenarchiv", kategorie: "Designtafel" };
const ALLE = [TAFEL, ...BILDER];
const B_ = (teil) => { const b = BILDER.find((x) => x.datei.includes(teil)); if (!b) throw new Error("Bild fehlt: " + teil); return b; };
const r = 941 / 1672;
const REGION = {
    hero: { bild: DES, r, x: .36, y: .33, w: .63, h: .6 },
    wirt: { bild: DES, r, x: .803, y: .622, w: .167, h: .17 },
    detail: { bild: DES, r, x: .64, y: .5, w: .17, h: .16 },
};

// ---------- Inhalte der Designtafel (wörtlich) ----------
const UNTERTITEL = "Kleine Lebewesen im Inneren eines Wirts.";
const designKarte = (titel, region) => ({ titel, quelle: QD, html: `<p><em>${esc(UNTERTITEL)}</em></p><span class="${P}-ausschnitt ${P}-design-bild" style="--x:${REGION[region].x};--y:${REGION[region].y};--w:${REGION[region].w};--h:${REGION[region].h};--r:${r}"><img src="§DES§" alt="${esc(titel)} – Ausschnitt aus der Designtafel" loading="lazy" decoding="async"></span>` });
const T = (n, a = 0) => BILDER.slice(a, a + n);

const SEITEN = [
    { key: "hauptseite", suffix: "", label: "Übersicht", file: S + "/hauptseite/Spezies.html", icon: "✧" },
    { key: "allgemeines", suffix: "-allgemeines", label: "Allgemeines", file: S + "/Unterseiten/Allgemeines/allgemeines.html", icon: "ⓘ", text: UNTERTITEL, titelbild: { region: "hero" },
        design: [designKarte("Speziesdossier", "detail")], quellen: ["Allgemein/allgemein", "01_Speziesdaten/speziesdaten.md"], galerie: [TAFEL, ...T(5)] },
    { key: "biologie", suffix: "-biologie", label: "Biologie", file: S + "/Unterseiten/Biologie/biologie.html", icon: "⟡", text: "Körperbau und Wirtsverbindung", titelbild: { region: "wirt" },
        design: [designKarte("Körperbau", "detail"), designKarte("Wirtsverbindung", "wirt")], quellen: ["Biologie/Biologie.md"], galerie: T(6, 5) },
    { key: "entwicklung", suffix: "-entwicklung", label: "Entwicklung", file: S + "/Unterseiten/Entwicklung/entwicklung.html", icon: "⤳", text: "Entwicklung der Symbionten", titelbild: B_("Nebelwiege"),
        quellen: ["02_Geschichte_Entwicklung/entwicklung.md"], galerie: T(5, 11) },
    { key: "heimatwelt", suffix: "-heimatwelt", label: "Heimatwelt", file: S + "/Unterseiten/Heimatwelt/heimatwelt.html", icon: "◍", text: "Herkunft und Lebensräume", titelbild: B_("Wolkenschild"),
        quellen: ["05_Heimatwelt/heimatwelt-referenz.md"], galerie: T(5, 16) },
    { key: "gesellschaft", suffix: "-gesellschaft", label: "Gesellschaft", file: S + "/Unterseiten/Gesellschaft/gesellschaft.html", icon: "⁂", text: "Zusammenleben mit dem Wirt", titelbild: B_("Archivarin"),
        quellen: ["03_Gesellschaft_Kultur/gesellschaft.md", "03_Gesellschaft_Kultur/kultur.md"], galerie: T(5, 21) },
    { key: "politik", suffix: "-politik", label: "Politik", file: S + "/Unterseiten/Politik/politik.html", icon: "⚖", text: "Ordnung und Fraktionsbeziehungen", titelbild: B_("Prozessionsfigur"),
        quellen: ["04_Politik_Fraktionsbeziehungen/politik.md", "04_Politik_Fraktionsbeziehungen/fraktionsbeziehungen.md"], galerie: T(4, 26) },
    { key: "geschichte", suffix: "-geschichte", label: "Geschichte", file: S + "/Unterseiten/Geschichte/geschichte.html", icon: "⧗", text: "Wichtige Entwicklungsphasen und Wendepunkte", titelbild: B_("mondhellen Ruinen"),
        quellen: ["02_Geschichte_Entwicklung/geschichte.md"], galerie: T(5, 0) },
    { key: "gameplay", suffix: "-gameplay", label: "Spielintegration", file: S + "/Gameplay/gameplay.html", icon: "◈", text: "Spielmechaniken und Interaktionsmöglichkeiten", titelbild: B_("Raumhelm"),
        quellen: [{"datei":"Gameplay/.gitkeep","ohne":["Forschungssystem"]}], galerie: T(5, 6) },
    { key: "forschung", suffix: "-forschung", label: "Forschung", file: S + "/Forschung/forschung.html", icon: "⚗", text: "Forschung an Symbionten und Wirtsverbindungen", titelbild: B_("Glasglocke"),
        design: [designKarte("Forschung", "wirt")], quellen: ["Forschung/.gitkeep", {"datei":"Gameplay/.gitkeep","nur":["Forschungssystem"],"hinweis":"Spielintegration"}] },
    { key: "medien", suffix: "-medien", label: "Medien", file: S + "/Unterseiten/Medien/medien.html", icon: "▣", text: "Bilder, Klangarchiv, Bewegtbild und Modelle", titelbild: B_("Spiegelmaske"), quellen: ["Medien/Medien"] },
];

const B = erstelle({
    S, INFO, A, NAME, KLASSE, P, R0, THEME: "#0f0b10", SEITEN, REGION,
    BESCHREIBUNG: "Symbionten im APORIA-Weltenarchiv: kleine Lebewesen im Inneren eines Wirts.",
    links: (f, S_, rel) => [
        [rel(f, S_.forschung.file), "Forschung", "Forschung an den Symbionten", `data-route="${R0}-forschung"`],
        [rel(f, FZ + "/Umwelt, Leben und Ressourcen/Symbioseforschung/index.html"), "Symbioseforschung", "Forschungszweig"],
        [rel(f, FZ + "/Xenoforschung/Xenobiologie/index.html"), "Xenobiologie", "Forschungszweig"],
        [rel(f, FZ + "/Übersicht/Forschung.html"), "Forschungsarchiv", "Alle Forschungszweige"],
        [rel(f, "inhalte/himmelskoerper/planeten/planeten.html"), "Planetenarchiv", "Heimatwelt noch nicht ausgearbeitet", 'data-route="planeten"'],
    ],
});

// ---------- Audio → medien.json ----------
const KLANG = [
    { ordner: "02_Kommunikation", schluessel: "kommunikation", name: "Kommunikation" },
    { ordner: "01_Koerperbewegung", schluessel: "koerperbewegung", name: "Körperbewegung" },
    { ordner: "03_Symbiose_Prozesse", schluessel: "symbiose", name: "Symbiose-Prozesse" },
    { ordner: "04_Zustaende_Signale", schluessel: "zustaende", name: "Zustände & Signale" },
    { ordner: "05_Umgebungen", schluessel: "umgebungen", name: "Umgebungen" },
    { ordner: "06_Forschung_UI", schluessel: "forschung", name: "Forschung & Labor" },
];
const audio = audioBlock(AUDIO, KLANG);
medienEintragen(KLASSE, { videos: { animationen: { items: [] }, videos: { items: [] } }, audio });

for (const key of ["allgemeines", "biologie", "entwicklung", "heimatwelt", "gesellschaft", "politik", "geschichte", "gameplay", "forschung"]) {
    const s = B.S_[key];
    B.reiterSeite(s);
    const datei = path.join(ROOT, s.file), t = fs.readFileSync(datei, "utf8");
    if (t.includes("§DES§")) fs.writeFileSync(datei, t.replaceAll("§DES§", rel(s.file, DES)));
}
const TEXTE = { Designtafel: "Designvorlage der Spezies", "Symbionten & Wirte": "Symbiont und Wirt aus dem Bildarchiv" };
B.medienSeite(B.S_.medien, { bilder: ALLE, klang: KLANG, modellRegion: "wirt", texte: TEXTE });

// ---------- Hauptseite (nach der Designtafel) ----------
{
    const s = B.S_.hauptseite, f = s.file, S_ = B.S_;
    const L = (k) => `href="${rel(f, S_[k].file)}" data-route="${B.ROUTE(S_[k])}"`;
    const bildVon = (b, klasse) => b.region ? B.ausschnitt(f, b.region, klasse) : `<img class="${klasse}" src="${rel(f, b.datei)}" alt="" loading="lazy" decoding="async">`;
    const kachel = (key) => `                    <a class="${P}-panel ${P}-thema" ${L(key)}>${bildVon(S_[key].titelbild, `${P}-thema-bild`)}<span class="${P}-thema-kopf"><span class="${P}-icon" aria-hidden="true">${S_[key].icon}</span><strong>${esc(S_[key].label)}</strong></span><span class="${P}-thema-text">${esc(S_[key].text)}</span></a>`;
    const klangAnzahl = KLANG.reduce((n, k) => n + k.anzahl, 0);
    const html = B.kopf(s) +
        `            <header class="${P}-hero">
                ${B.ausschnitt(f, "hero", `${P}-hero-bild`, "", "eager")}
                <span class="${P}-glanz" aria-hidden="true"></span>
                <div class="${P}-hero-text">
                    ${B.pfad(s)}
                    <p class="${P}-kicker ${P}-kicker--linie">Speziesdossier</p>
                    <h1>${NAME}</h1>
                    <p class="${P}-unterzeile"><em>${esc(UNTERTITEL)}</em></p>
                    <p class="${P}-hero-links"><a ${L("biologie")}>Biologie ansehen ›</a><a ${L("forschung")}>Forschung öffnen ›</a></p>
                </div>
                <a class="${P}-wirt" ${L("biologie")}>${B.ausschnitt(f, "wirt", "", "Wirtsverbindung – Ausschnitt aus der Designtafel")}<span>Wirtsverbindung</span></a>
            </header>
` + B.reiter(s) +
        `            <nav class="${P}-panel ${P}-schnell" aria-label="Schnellzugriff">
                <a ${L("biologie")}>Körperbau</a>
                <a ${L("biologie")}>Wirtsverbindung</a>
                <a ${L("forschung")}>Forschung</a>
            </nav>
            <section class="${P}-panel ${P}-block ${P}-karussell-block" id="bildarchiv" aria-labelledby="bildarchiv-titel">
                ${B.titel("Bildarchiv: Symbionten und ihre Wirte", BILDER.length + " Motive", "▣", "bildarchiv-titel")}
                ${B.karussell(f, ALLE, { buehne: true, filter: true, autoplay: 7000, texte: TEXTE })}
            </section>
            ${B.dossierSteckbrief(s, { datei: "Allgemein/allgemein", steckbrief: ["Identifikation"], beschreibung: ["Grundbeschreibung"], mehr: "allgemeines" })}
            <section class="${P}-themen" aria-labelledby="themen-titel">
                <h2 class="${P}-h2 ${P}-h2--linie" id="themen-titel">Themenbereiche</h2>
                <div class="${P}-themen-raster">
${["allgemeines", "biologie", "entwicklung", "heimatwelt", "gesellschaft", "politik", "geschichte", "gameplay"].map(kachel).join("\n")}
                </div>
            </section>
            <div class="${P}-fuss-raster ${P}-fuss-raster--eins">
                <section class="${P}-panel ${P}-block ${P}-klangleiste" aria-labelledby="klang-titel">
                    ${B.titel("Klangarchiv", klangAnzahl + " Klänge", "♪", "klang-titel")}
                    <div class="${P}-klang-chips">
${KLANG.map((k) => `                        <a href="${rel(f, S_.medien.file)}#klang-${k.schluessel}" data-route="${R0}-medien" data-route-fragment="klang-${k.schluessel}">${esc(k.name)} <b>${k.anzahl}</b></a>`).join("\n")}
                    </div>
                </section>
            </div>
            <div class="${P}-layout ${P}-layout--fuss">
                <div class="${P}-inhalt">
                    ${B.verknuepfungen(s)}
                    ${B.quelle(QD)}
                </div>
            </div>
` + B.fuss();
    write(f, html);
}
console.log("Symbionten fertig:", SEITEN.length, "Seiten ·", ALLE.length, "Bilder ·", KLANG.reduce((n, k) => n + k.anzahl, 0), "Klänge");
