// Spezies-Baukasten · eigenes Bauskript (Hauptseite nach Designtafel). Aufruf: node scripts/spezies/eigene/floranoiden.mjs
// Baut die Floranoiden-Seiten im Speziesstandard. Inhalte: Info_material (wenn ausgefüllt) + Designtafel (wörtlich, als Quelle gekennzeichnet).
import fs from "node:fs";
import path from "node:path";
import { ROOT, FZ, esc, rel, write, exists, fakten, erstelle, medienEintragen, audioBlock } from "../bibliothek.mjs";
import { baueBasis } from "../basis.mjs";

const NAME = "Floranoiden", KLASSE = "floranoiden", P = "fl", R0 = "spezies-biological-11";
const S = "inhalte/spezies/Biologische Spezies/Floranoiden";
const INFO = "Info_material/Alle_spezies_daten/Biologische Spezies/Floranoiden";
const A = "assets/bilder/Alle Spezies+Übersicht/Biologische Spezies/Floranoiden";
const AUDIO = "assets/audio/Alle Spezies+Übersicht/Biologische Spezies/Floranoiden";
const DES = A + "/Design/Floranoiden_ Biolumineszentes Weltarchiv.png";
const QD = "Designtafel „Floranoiden: Biolumineszentes Weltarchiv“";
if (!exists(DES)) throw new Error("Designtafel fehlt");

baueBasis({
    ordner: "Floranoiden", praefix: P, klasse: KLASSE, name: NAME, design: "Floranoiden/Design/Floranoiden_ Biolumineszentes Weltarchiv.png", motto: "„Biolumineszentes Weltarchiv“",
    farben: { bg: "#070d0c", glas: "#0e1916", glashell: "#14231e", linie: "#e3b86a", liniehell: "#f0cf8a", akzent: "#e3b86a", akzenthell: "#f6e2b5", zweit: "#5fe0c8", text: "#eeeadf", leise: "#a9b5ac", tint: "#b48a3c", glaslicht: "#17271f", glasdunkel: "#070d0c", glow1: "#7a4fd6", glow2: "#3fd0b0", glow3: "#c08a30", rahmen: "#09110f", knopf: "#1a2a22", reiter: "#0f1b17", flaeche: "#0e1814", kachel: "#0b1411", herobg: "#08100e", aktiv1: "#5a4420", aktiv2: "#2e2410", h1: "#fbf3df", intro: "#dcd8c8", zoombg: "#040807" },
});

// ---------- Bilder ----------
const roh = fs.readdirSync(path.join(ROOT, A, "gesamtdarstellung")).filter((x) => /\.png$/i.test(x)).sort((a, b) => Number((a.match(/-(\d+)\.png$/) ?? [0, 99])[1]) - Number((b.match(/-(\d+)\.png$/) ?? [0, 99])[1]) || a.localeCompare(b, "de", { numeric: true }));
const zaehler = {};
const BILDER = roh.map((x) => {
    const datei = A + "/gesamtdarstellung/" + x;
    const fraktion = x.match(/protektorat|Synaptorat/i)?.[0];
    if (fraktion) { const n = fraktion[0].toUpperCase() + fraktion.slice(1).toLowerCase(); zaehler[n] = (zaehler[n] ?? 0) + 1; return { datei, titel: `${n}-Entwurf ${zaehler[n]}`, kategorie: "Fraktionsentwürfe" }; }
    return { datei, titel: x.replace(/\.png$/i, "").replace(/-\d+$/, "").trim(), kategorie: "Lebensräume & Porträts" };
});
const TAFEL = { datei: DES, titel: "Biolumineszentes Weltarchiv", kategorie: "Designtafel" };
const PORTRAIT = BILDER.filter((b) => b.kategorie === "Lebensräume & Porträts"), FRAKTION = BILDER.filter((b) => b.kategorie === "Fraktionsentwürfe");
const ALLE = [TAFEL, ...PORTRAIT, ...FRAKTION];
const B_ = (teil) => { const b = BILDER.find((x) => x.datei.includes(teil)); if (!b) throw new Error("Bild fehlt: " + teil); return b; };
const r = 1055 / 1491;
const REGION = {
    hero: { bild: DES, r, x: .47, y: .065, w: .53, h: .345 },
    kern: { bild: DES, r, x: .188, y: .527, w: .2, h: .08 },
    welt: { bild: DES, r, x: .408, y: .527, w: .186, h: .118 },
    gesellschaft: { bild: DES, r, x: .615, y: .527, w: .187, h: .118 },
    notiz: { bild: DES, r, x: .826, y: .528, w: .161, h: .18 },
};

// ---------- Inhalte der Designtafel (wörtlich) ----------
const INTRO = `<p>Die Floranoiden sind intelligente, photo-mixotrophe Lebensformen vom Planeten Osselyr. Sie vereinen pflanzliche und tierische Eigenschaften, bewegen sich auf biohydraulischen Gliedmaßen, kommunizieren über komplexe bioelektrische und chemische Signale und pflegen eine tiefe, symbiotische Beziehung zu ihrer ökologischen Umwelt.</p>`;
const KERN = `<ul><li>Photo-mixotropher Stoffwechsel (Photosynthese + organische Aufnahme)</li><li>Zentraler Organkern mit verteilten Nerven- und Signalsystemen</li><li>Biohydraulische, flexible Gliedmaßen für Fortbewegung und Feinmanipulation</li><li>Aufklappbare Photosynthesekronen zur Energieaufnahme, Kommunikation und Umweltwahrnehmung</li></ul>`;
const WELT = `<p>Die Floranoiden stammen von Osselyr, einem feucht-warmen, biolumineszenten Planeten mit dichten, mehrschichtigen Pflanzenökosystemen. Die hohe Artenvielfalt, die nährstoffreichen Böden und das stabile Klima haben hier einzigartige, mobile Pflanzenintelligenzen hervorgebracht.</p>`;
const WELT_TAGS = ["Osselyr", "tropisch-feucht", "biolumineszent"];
const GESELLSCHAFT = `<p>Floranoiden leben in gewachsenen Kollektiven, den sogenannten Blütenverbünden. Diese Kollektive sind keine starren Herrschaftssysteme, sondern dynamische, organische Netzwerke, in denen Wissen, Ressourcen und Erfahrungen zirkulieren. Entscheidungen entstehen durch langsame, konsensuale Resonanzprozesse – einen vielschichtigen Austausch aus elektrischen, chemischen und rhythmischen Signalen.</p>`;
const NOTIZ = `<blockquote class="${P}-zitat"><p>„Die Floranoiden stellen keine bloße Form des Pflanzenlebens dar, sondern eine eigene Evolutionslinie von Intelligenz – verwurzelt in Licht, Stoffwechsel und Symbiose.“</p><footer>— Feldnotiz 7.3, Osselyr-Expedition</footer></blockquote>`;
const STATUS = [["Status", "Intelligente Spezies"], ["Fraktionskontakte", "Diplomatisch, kooperativ"], ["Lebensraum", "Osselyr (heimisch), vereinzelte Kolonien"], ["Lebensdauer", "ca. 200 – 500 Jahre (je nach Umwelt und Kollektiv)"]];
const tags = (l) => `<p class="${P}-tags">${l.map((t) => `<span>${esc(t)}</span>`).join("")}</p>`;

const SEITEN = [
    { key: "hauptseite", suffix: "", label: "Übersicht", file: S + "/hauptseite/Spezies.html", icon: "❦" },
    { key: "allgemeines", suffix: "-allgemeines", label: "Allgemeines", file: S + "/Unterseiten/Allgemeines/allgemeines.html", icon: "ⓘ", text: "Pflanzenartige Intelligenzen – Überblick und Status", titelbild: { region: "hero" },
        design: [{ titel: "Überblick", quelle: QD, html: INTRO }, { titel: "Status", quelle: QD, html: fakten(STATUS, P) }],
        quellen: ["allgemein/allgemein.md", "01_Speziesdaten/speziesdaten.md"], galerie: [TAFEL, ...PORTRAIT.slice(0, 5)] },
    { key: "biologie", suffix: "-biologie", label: "Biologie", file: S + "/Unterseiten/Biologie/biologie.html", icon: "⟡", text: "Photo-mixotropher Stoffwechsel und biohydraulische Gliedmaßen", titelbild: { region: "kern" },
        design: [{ titel: "Biologische Kernmerkmale", quelle: QD, html: KERN }],
        quellen: ["Biologie/Biologie"], galerie: PORTRAIT.filter((b) => /Keimling|Achtbeiniger|Dreistieliger|Epiphytischer|klettert|Kriechende/.test(b.datei)) },
    { key: "entwicklung", suffix: "-entwicklung", label: "Entwicklung", file: S + "/Unterseiten/Entwicklung/entwicklung.html", icon: "⤳", text: "Vom Keimling zum alten Floranoiden", titelbild: B_("Keimling"),
        quellen: ["02_Geschichte_Entwicklung/entwicklung.md"], galerie: PORTRAIT.filter((b) => /Keimling|Junger|Alter|Uralter|Neuaustrieb|Fruchthüllen/.test(b.datei)) },
    { key: "heimatwelt", suffix: "-heimatwelt", label: "Heimatwelt", file: S + "/Unterseiten/Heimatwelt/heimatwelt.html", icon: "◍", text: "Osselyr – feucht-warm und biolumineszent", titelbild: { region: "welt" },
        design: [{ titel: "Heimatwelt: Osselyr", quelle: QD, html: WELT + tags(WELT_TAGS) }],
        quellen: ["05_Heimatwelt/heimatwelt-referenz.md"], galerie: PORTRAIT.filter((b) => /Moor|Bach|Seerosen|Farnravin|Lavendelgras|Klippenrosette|Eiswind|Grasrippe|Flussbett|Erosionshang/.test(b.datei)) },
    { key: "gesellschaft", suffix: "-gesellschaft", label: "Gesellschaft", file: S + "/Unterseiten/Gesellschaft/gesellschaft.html", icon: "⁂", text: "Blütenverbünde und Resonanzprozesse", titelbild: { region: "gesellschaft" },
        design: [{ titel: "Gesellschaft", quelle: QD, html: GESELLSCHAFT }],
        quellen: ["03_Gesellschaft_Kultur/gesellschaft.md", "03_Gesellschaft_Kultur/kultur.md"], galerie: [TAFEL, ...PORTRAIT.slice(10, 15)] },
    { key: "politik", suffix: "-politik", label: "Politik", file: S + "/Unterseiten/Politik/politik.html", icon: "⚖", text: "Fraktionskontakte: diplomatisch, kooperativ", titelbild: FRAKTION[0],
        design: [{ titel: "Fraktionskontakte", quelle: QD, html: fakten([STATUS[1]], P) }],
        quellen: ["04_Politik_Fraktionsbeziehungen/politik.md", "04_Politik_Fraktionsbeziehungen/fraktionsbeziehungen.md"], galerie: FRAKTION },
    { key: "geschichte", suffix: "-geschichte", label: "Geschichte", file: S + "/Unterseiten/Geschichte/geschichte.html", icon: "⧗", text: "Wichtige Entwicklungsphasen und Wendepunkte", titelbild: B_("Uralter Korkholzring"),
        quellen: ["02_Geschichte_Entwicklung/geschichte.md"], galerie: PORTRAIT.slice(15) },
    { key: "gameplay", suffix: "-gameplay", label: "Spielintegration", file: S + "/Gameplay/gameplay.html", icon: "◈", text: "Spielmechaniken und Interaktionsmöglichkeiten", titelbild: B_("Windgleitender"),
        quellen: [{"datei":"Gameplay/.gitkeep","ohne":["Forschung und Freischaltungen"]}], galerie: [...FRAKTION, ...PORTRAIT.slice(0, 3)] },
    { key: "forschung", suffix: "-forschung", label: "Forschung", file: S + "/Forschung/forschung.html", icon: "⚗", text: "Forschungsnotizen zu den Floranoiden", titelbild: { region: "notiz" },
        design: [{ titel: "Forschungsnotizen", quelle: QD, html: NOTIZ }],
        quellen: ["Forschung/.gitkeep", {"datei":"Gameplay/.gitkeep","nur":["Forschung und Freischaltungen"],"hinweis":"Spielintegration"}] },
    { key: "medien", suffix: "-medien", label: "Medien", file: S + "/Unterseiten/Medien/medien.html", icon: "▣", text: "Bilder, Klangarchiv, Bewegtbild und Modelle", titelbild: B_("Lavendelgras") },
];

const B = erstelle({
    S, INFO, A, NAME, KLASSE, P, R0, THEME: "#070d0c", SEITEN, REGION,
    BESCHREIBUNG: "Floranoiden im APORIA-Weltenarchiv: pflanzenartige Intelligenzen vom biolumineszenten Planeten Osselyr.",
    links: (f, S_, rel) => [
        [rel(f, S_.forschung.file), "Forschung", "Forschungsnotizen zu den Floranoiden", `data-route="${R0}-forschung"`],
        [rel(f, FZ + "/Xenoforschung/Xenobiologie/index.html"), "Xenobiologie", "Forschungszweig"],
        [rel(f, FZ + "/Umwelt, Leben und Ressourcen/Symbioseforschung/index.html"), "Symbioseforschung", "Forschungszweig"],
        [rel(f, "inhalte/Rohstoffe/Uebersicht/Rohstoffe.html"), "Rohstoffarchiv", "Rohstoffe im Weltenarchiv", 'data-route="rohstoffe"'],
        [rel(f, "inhalte/himmelskoerper/planeten/planeten.html"), "Planetenarchiv", "Osselyr ist noch kein Planetendossier", 'data-route="planeten"'],
    ],
});
if (!exists(FZ + "/Umwelt, Leben und Ressourcen/Symbioseforschung/index.html")) throw new Error("Zweig Symbioseforschung fehlt");

// ---------- Audio → medien.json ----------
const KLANG = [
    { ordner: "02_Kommunikation", schluessel: "kommunikation", name: "Kommunikation" },
    { ordner: "01_Koerper", schluessel: "koerper", name: "Körper & Bewegung" },
    { ordner: "03_Musiksignale", schluessel: "musiksignale", name: "Musiksignale" },
];
const audio = audioBlock(AUDIO, KLANG);
medienEintragen(KLASSE, { videos: { animationen: { items: [] }, videos: { items: [] } }, audio });

for (const key of ["allgemeines", "biologie", "entwicklung", "heimatwelt", "gesellschaft", "politik", "geschichte", "gameplay", "forschung"]) B.reiterSeite(B.S_[key]);
const TEXTE = { Designtafel: "Designvorlage der Spezies", "Lebensräume & Porträts": "Motiv aus dem Bildarchiv", "Fraktionsentwürfe": "Fraktionsentwurf aus dem Bildarchiv" };
B.medienSeite(B.S_.medien, { bilder: ALLE, klang: KLANG, modellRegion: "hero", texte: TEXTE });

// ---------- Hauptseite (nach der Designtafel) ----------
{
    const s = B.S_.hauptseite, f = s.file, S_ = B.S_;
    const L = (k) => `href="${rel(f, S_[k].file)}" data-route="${B.ROUTE(S_[k])}"`;
    const ICON = { Status: "∿", Fraktionskontakte: "⁂", Lebensraum: "❦", Lebensdauer: "∞" };
    const bildVon = (b, klasse) => b.region ? B.ausschnitt(f, b.region, klasse) : `<img class="${klasse}" src="${rel(f, b.datei)}" alt="" loading="lazy" decoding="async">`;
    const kachel = (key) => `                    <a class="${P}-panel ${P}-thema" ${L(key)}>${bildVon(S_[key].titelbild, `${P}-thema-bild`)}<span class="${P}-thema-kopf"><span class="${P}-icon" aria-hidden="true">${S_[key].icon}</span><strong>${esc(S_[key].label)}</strong></span><span class="${P}-thema-text">${esc(S_[key].text)}</span></a>`;
    const karte = (key, titel, icon, region, inhalt) => `                <article class="${P}-panel ${P}-karte4">
                    <h2 class="${P}-h2"><span class="${P}-icon" aria-hidden="true">${icon}</span>${esc(titel)}</h2>
                    ${B.ausschnitt(f, region, `${P}-karte4-bild`)}
                    <div class="${P}-karte4-text">${inhalt}</div>
                    <a class="${P}-mehr" ${L(key)}>Mehr dazu →</a>
                </article>`;
    const klangAnzahl = KLANG.reduce((n, k) => n + k.anzahl, 0);
    const html = B.kopf(s) +
        `            <header class="${P}-hero">
                ${B.ausschnitt(f, "hero", `${P}-hero-bild`, "", "eager")}
                <span class="${P}-glanz" aria-hidden="true"></span>
                <div class="${P}-hero-text">
                    ${B.pfad(s)}
                    <h1>${NAME}</h1>
                    <p class="${P}-unterzeile">Pflanzenartige Intelligenzen</p>
                    ${INTRO.replace("<p>", `<p class="${P}-intro">`)}
                </div>
            </header>
` + B.reiter(s) +
        `            <div class="${P}-karten4">
${karte("biologie", "Biologische Kernmerkmale", "⧖", "kern", KERN)}
${karte("heimatwelt", "Heimatwelt: Osselyr", "◍", "welt", WELT + tags(WELT_TAGS))}
${karte("gesellschaft", "Gesellschaft", "⁂", "gesellschaft", GESELLSCHAFT)}
${karte("forschung", "Forschungsnotizen", "❧", "notiz", NOTIZ)}
            </div>
            <section class="${P}-panel ${P}-statusleiste" aria-label="Status">
${STATUS.map(([a, b]) => `                <div><span class="${P}-status-kopf"><span aria-hidden="true">${ICON[a]}</span>${esc(a)}</span><span class="${P}-status-wert">${esc(b)}</span></div>`).join("\n")}
            </section>
            ${B.dossierSteckbrief(s, { datei: "allgemein/allgemein.md", steckbrief: ["Speziesidentität"], beschreibung: ["Allgemeine Beschreibung"], mehr: "allgemeines" })}
            <section class="${P}-themen" aria-labelledby="themen-titel">
                <h2 class="${P}-h2 ${P}-h2--linie" id="themen-titel">Themenbereiche</h2>
                <div class="${P}-themen-raster">
${["allgemeines", "biologie", "entwicklung", "heimatwelt", "gesellschaft", "politik", "geschichte", "gameplay"].map(kachel).join("\n")}
                </div>
            </section>
            <section class="${P}-panel ${P}-block ${P}-karussell-block" id="bildarchiv" aria-labelledby="bildarchiv-titel">
                ${B.titel("Bildarchiv", ALLE.length + " Bilder", "▣", "bildarchiv-titel")}
                ${B.karussell(f, ALLE, { buehne: true, filter: true, autoplay: 7000, texte: TEXTE })}
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
    write(f, html);
}
console.log("Floranoiden fertig:", SEITEN.length, "Seiten ·", ALLE.length, "Bilder ·", KLANG.reduce((n, k) => n + k.anzahl, 0), "Klänge");
