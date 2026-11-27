// Spezies-Baukasten · eigenes Bauskript (Hauptseite nach Designtafel). Aufruf: node scripts/spezies/eigene/pyronoiden.mjs
// Baut die Pyronoiden-Seiten im Speziesstandard. Inhalte: Info_material (wenn ausgefüllt) + Designtafeln (wörtlich, als Quelle gekennzeichnet).
import fs from "node:fs";
import path from "node:path";
import { ROOT, FZ, esc, rel, write, exists, fakten, erstelle, medienEintragen, audioBlock } from "../bibliothek.mjs";
import { baueBasis } from "../basis.mjs";

const NAME = "Pyronoiden", KLASSE = "pyronoiden", P = "py", R0 = "spezies-biological-15";
const S = "inhalte/spezies/Biologische Spezies/Pyronoiden";
const INFO = "Info_material/Alle_spezies_daten/Biologische Spezies/Pyronoiden";
const A = "assets/bilder/Alle Spezies+Übersicht/Biologische Spezies/Pyronoiden";
const AUDIO = "assets/audio/Alle Spezies+Übersicht/Biologische Spezies/Pyronoiden";
const DES = A + "/Design/Dunkles Weltenarchiv_ Pyronoiden von Kharuun.png";
const RIT = A + "/gesamtdarstellung/Pyronoiden_ Ritualik aus Obsidian und Glut.png";
const QD = "Designtafel „Dunkles Weltenarchiv: Pyronoiden von Kharuun“";
const QR = "Designtafel „Pyronoiden: Ritualik aus Obsidian und Glut“";
for (const f of [DES, RIT]) if (!exists(f)) throw new Error("Bild fehlt: " + f);

baueBasis({
    ordner: "Pyronoiden", praefix: P, klasse: KLASSE, name: NAME, design: "Pyronoiden/Design/Dunkles Weltenarchiv_ Pyronoiden von Kharuun.png", motto: "„Obsidian & Glut“",
    farben: { bg: "#0d0908", glas: "#1a1210", glashell: "#24170f", linie: "#ff7a2a", liniehell: "#ff9a4d", akzent: "#ff7a2a", akzenthell: "#ffc58a", zweit: "#ffb347", text: "#f3e7dc", leise: "#b9a596", tint: "#c4561e", glaslicht: "#2a1a12", glasdunkel: "#0d0908", glow1: "#d2461e", glow2: "#ff9a3c", glow3: "#7a1e10", rahmen: "#140d0a", knopf: "#2a1a12", reiter: "#1c130e", flaeche: "#1a110c", kachel: "#140d0a", herobg: "#120b08", aktiv1: "#6a2a12", aktiv2: "#3a160a", h1: "#fff4ea", intro: "#e6d6c8", zoombg: "#080504" },
});

const PIRAT = fs.readdirSync(path.join(ROOT, A, "gesamtdarstellung")).filter((x) => /Pirat/.test(x)).sort((a, b) => Number((a.match(/\((\d+)\)/) ?? [0, 0])[1]) - Number((b.match(/\((\d+)\)/) ?? [0, 0])[1]))
    .map((x, i) => ({ datei: A + "/gesamtdarstellung/" + x, titel: `Piratenentwurf ${i + 1}`, kategorie: "Piratenentwürfe" }));
const TAFEL = { datei: DES, titel: "Pyronoiden von Kharuun", kategorie: "Designtafeln" };
const RITUAL = { datei: RIT, titel: "Ritualik aus Obsidian und Glut", kategorie: "Designtafeln" };
const ALLE = [TAFEL, RITUAL, ...PIRAT];
const rD = 941 / 1672, rR = 1024 / 1536;
const REGION = {
    banner: { bild: DES, r: rD, x: .40, y: .058, w: .60, h: .325 },
    sensor: { bild: DES, r: rD, x: .546, y: .708, w: .08, h: .09 },
    kharuun: { bild: DES, r: rD, x: .782, y: .50, w: .203, h: .30 },
    anatomie: { bild: DES, r: rD, x: .152, y: .846, w: .256, h: .10 },
    welt: { bild: DES, r: rD, x: .423, y: .846, w: .277, h: .10 },
    klang: { bild: DES, r: rD, x: .716, y: .846, w: .264, h: .10 },
    figur: { bild: RIT, r: rR, x: .14, y: .02, w: .195, h: .80 },
    lebensraum: { bild: RIT, r: rR, x: .813, y: .60, w: .172, h: .21 },
    varianten: { bild: RIT, r: rR, x: .337, y: .575, w: .285, h: .225 },
    runen: { bild: RIT, r: rR, x: .72, y: .395, w: .27, h: .15 },
    ganzkoerper: { bild: RIT, r: rR, x: .335, y: .04, w: .43, h: .30 },
};

// ---------- Inhalte der Designtafeln (wörtlich) ----------
const UEBERBLICK = `<p>Die Pyronoiden sind eine hochentwickelte, intelligente Spezies, die in den extremen Hitzezonen von Kharuun beheimatet ist. Ihr Körper ist das Ergebnis eines einzigartigen Zusammenspiels aus mineralischen und biologischen Strukturen, das ihnen ermöglicht, in Temperaturen zu überleben, die für die meisten anderen Lebensformen tödlich wären.</p>
<p>Sie gelten als ruhige, beobachtende Wesen, die ihre Umwelt genau analysieren und vor allem in stabilen, langfristigen Strukturen denken. Die Pyronoiden sind keine Krieger, sondern Gestalter – sie formen ihre Umgebung, nutzen geothermische Energie und bauen komplexe Lebensräume in den vulkanischen Regionen ihres Heimatplaneten.</p>`;
const BESONDERHEITEN = `<p>Ihr Körper besteht aus einer Kombination aus mineralischem Gewebe und hitzeresistenten Organstrukturen. Die orange leuchtenden Fugen dienen der Energieverteilung und Temperaturregulation. Ihre Sinnesorgane sind auf das Erkennen von Wärme, chemischen Signalen und feinsten Schwingungen spezialisiert. Die vier stabilen Laufbeine ermöglichen ihnen eine kraftvolle Fortbewegung, während die zwei Manipulationsgliedmaßen für präzise Arbeiten und feine Interaktionen in ihrer Umgebung genutzt werden.</p>`;
const SENSOR = `<p>Erkennt Temperaturveränderungen, chemische Signale und Vibrationen.</p>`;
const STECKBRIEF = [["Körpergröße", "1,6 – 3,0 m"], ["Lebensdauer", "350 – 650 Jahre"], ["Heimat", "Kharuun"], ["Formgruppen", "4"]];
const CHIPS = ["Kharuun", "Mineralisch-thermoionisch", "500–800 °C"];
const RITUALIK = `<p>Eine hitzeadaptierte, ritualistisch geprägte Spezies aus der Aporia-Welt. Die Pyronoiden vereinen elementare Feuerkraft, alte Riten und ein tiefes mystisches Erbe zu einer imposanten, geheimnisvollen Erscheinung.</p>`;
const KERNMERKMALE = `<ul><li>Hitzeadaptierte Biologie (extreme Temperaturen)</li><li>Ritualistische Kultur &amp; Symbole</li><li>Schlanke, hohe, imposante Silhouette</li><li>Vulkanisch/obsidianische Ästhetik</li><li>Runen mit funktionaler &amp; spiritueller Bedeutung</li><li>Mystische, geheimnisvolle Ausstrahlung (Aporia-Stil)</li></ul>`;
const VARIANTEN = `<ul><li>Akolyth</li><li>Ritualist</li><li>Hoherzelant</li></ul>`;
const RUNEN = fakten([["Feuer", "Essenz"], ["Hitze", "Anpassung"], ["Erhalt", "Kreislauf"], ["Ritual", "Verbindung"]], P);
const SILHOUETTE = fakten([["Pyronoid", "ca. 3,0 – 3,5 m"], ["Mensch (Vergleich)", "ca. 1,8 m"]], P);
const KOPF = `<ul><li>Ruhig / beobachtend</li><li>Ritualzorn</li><li>Meditativ</li><li>Ritual (Beschwörung)</li></ul>`;

const SEITEN = [
    { key: "hauptseite", suffix: "", label: "Übersicht", file: S + "/hauptseite/Spezies.html", icon: "◆" },
    { key: "allgemeines", suffix: "-allgemeines", label: "Allgemeines", file: S + "/Unterseiten/Allgemeines/allgemeines.html", icon: "ⓘ", text: "Überblick, Steckbrief und Einordnung", titelbild: { region: "banner" },
        design: [{ titel: "Überblick", quelle: QD, html: UEBERBLICK }, { titel: "Steckbrief", quelle: QD, html: fakten(STECKBRIEF, P) + `<p class="${P}-chips-zeile">${CHIPS.map(esc).join(" · ")}</p>` }],
        quellen: ["Allgemeines/Allgemeines.md", "01_Speziesdaten/speziesdaten.md"], galerie: [TAFEL, RITUAL] },
    { key: "biologie", suffix: "-biologie", label: "Biologie", file: S + "/Unterseiten/Biologie/biologie.html", icon: "⟡", text: "Mineralisches Gewebe, Glutfugen und Sinnesorgane", titelbild: { region: "anatomie" },
        design: [{ titel: "Biologische Besonderheiten", quelle: QD, html: BESONDERHEITEN }, { titel: "Thermo-Sensororgan", quelle: QD, html: SENSOR }, { titel: "Silhouette & Proportion", quelle: QR, html: SILHOUETTE }],
        quellen: ["Biologie/Biologie.md"], galerie: [TAFEL, RITUAL, ...PIRAT.slice(0, 3)] },
    { key: "entwicklung", suffix: "-entwicklung", label: "Entwicklung", file: S + "/Unterseiten/Entwicklung/entwicklung.html", icon: "⤳", text: "Evolution und Formgruppen", titelbild: PIRAT[0],
        quellen: ["02_Geschichte_Entwicklung/entwicklung.md"], galerie: PIRAT },
    { key: "heimatwelt", suffix: "-heimatwelt", label: "Heimatwelt", file: S + "/Unterseiten/Heimatwelt/heimatwelt.html", icon: "◍", text: "Kharuun – vulkanische Welt", titelbild: { region: "welt" },
        design: [{ titel: "Kharuun", quelle: QD, html: fakten([["Heimat", "Kharuun"], ["Welttyp", "Vulkanische Welt"]], P) }],
        quellen: ["05_Heimatwelt/heimatwelt-referenz.md"], galerie: [TAFEL, RITUAL] },
    { key: "gesellschaft", suffix: "-gesellschaft", label: "Gesellschaft", file: S + "/Unterseiten/Gesellschaft/gesellschaft.html", icon: "⁂", text: "Ritualik, Ränge und Runen", titelbild: { region: "varianten" },
        design: [{ titel: "Charakterdesign – Ritualik", quelle: QR, html: RITUALIK }, { titel: "Varianten (Rang / Rolle)", quelle: QR, html: VARIANTEN }, { titel: "Runen – Bedeutungsbeispiele", quelle: QR, html: RUNEN }, { titel: "Kernmerkmale (Design)", quelle: QR, html: KERNMERKMALE }],
        quellen: ["03_Gesellschaft_Kultur/gesellschaft.md", "03_Gesellschaft_Kultur/kultur.md"], galerie: [RITUAL, ...PIRAT] },
    { key: "politik", suffix: "-politik", label: "Politik", file: S + "/Unterseiten/Politik/politik.html", icon: "⚖", text: "Ordnung und Fraktionsbeziehungen", titelbild: PIRAT[1],
        quellen: ["04_Politik_Fraktionsbeziehungen/politik.md", "04_Politik_Fraktionsbeziehungen/fraktionsbeziehungen.md"], galerie: PIRAT },
    { key: "geschichte", suffix: "-geschichte", label: "Geschichte", file: S + "/Unterseiten/Geschichte/geschichte.html", icon: "⧗", text: "Wichtige Entwicklungsphasen und Wendepunkte", titelbild: { region: "lebensraum" },
        quellen: ["02_Geschichte_Entwicklung/geschichte.md"], galerie: [RITUAL, TAFEL] },
    { key: "gameplay", suffix: "-gameplay", label: "Spielintegration", file: S + "/Gameplay/gameplay.html", icon: "◈", text: "Spielmechaniken und Interaktionsmöglichkeiten", titelbild: PIRAT[2],
        quellen: [{"datei":"Gameplay/.gitkeep","ohne":["Animation","Visuelle Effekte","Sounddesign","Medienintegration"]}], galerie: PIRAT },
    { key: "forschung", suffix: "-forschung", label: "Forschung", file: S + "/Forschung/forschung.html", icon: "⚗", text: "Forschungsfelder rund um die Pyronoiden", titelbild: { region: "ganzkoerper" },
        quellen: ["Forschung/.gitkeep", {"datei":"Gameplay/.gitkeep","nur":["Wissenschaftliche Forschung"],"hinweis":"Spielintegration"}, {"datei":"02_Geschichte_Entwicklung/entwicklung.md","nur":["Künstliche Veränderung","Offene wissenschaftliche"],"hinweis":"Entwicklung"}] },
    { key: "medien", suffix: "-medien", label: "Medien", file: S + "/Unterseiten/Medien/medien.html", icon: "▣", text: "Bilder, Klangarchiv, Bewegtbild und Modelle", titelbild: { region: "klang" }, quellen: [{"datei":"Gameplay/.gitkeep","nur":["Animation","Visuelle Effekte","Sounddesign","Medienintegration"],"hinweis":"Spielintegration"}] },
];

const B = erstelle({
    S, INFO, A, NAME, KLASSE, P, R0, THEME: "#0d0908", SEITEN, REGION,
    BESCHREIBUNG: "Pyronoiden im APORIA-Weltenarchiv: intelligente Lebensformen der vulkanischen Tiefen von Kharuun.",
    links: (f, S_, rel) => [
        [rel(f, S_.forschung.file), "Forschung", "Forschungsfelder zu den Pyronoiden", `data-route="${R0}-forschung"`],
        [rel(f, FZ + "/Xenoforschung/Xenobiologie/index.html"), "Xenobiologie", "Forschungszweig"],
        [rel(f, FZ + "/Übersicht/Forschung.html"), "Forschungsarchiv", "Alle Forschungszweige"],
        [rel(f, "inhalte/Rohstoffe/Uebersicht/Rohstoffe.html"), "Rohstoffarchiv", "Rohstoffe im Weltenarchiv", 'data-route="rohstoffe"'],
        [rel(f, "inhalte/himmelskoerper/planeten/planeten.html"), "Planetenarchiv", "Kharuun ist noch kein Planetendossier", 'data-route="planeten"'],
    ],
});

// ---------- Audio → medien.json ----------
const KLANG = [
    { ordner: "kommunikation", schluessel: "kommunikation", name: "Sprachrufe" },
    { ordner: "koerpergeraeusche", schluessel: "koerpergeraeusche", name: "Körpergeräusche" },
    { ordner: "musik/hintergrundmusik", schluessel: "hintergrundmusik", name: "Hintergrundmusik" },
    { ordner: "01_Koerper_Panzer", schluessel: "koerper_panzer", name: "Körper & Panzer" },
    { ordner: "02_Bewegung_Schritte", schluessel: "bewegung", name: "Bewegung & Schritte" },
    { ordner: "03_Kommunikation", schluessel: "sprache", name: "Kommunikation" },
    { ordner: "04_Emotionen_Rufe", schluessel: "emotionen", name: "Emotionen & Rufe" },
    { ordner: "05_Flusskern_Stoffwechsel", schluessel: "flusskern", name: "Flusskern & Stoffwechsel" },
    { ordner: "06_Thermik_Hitze", schluessel: "thermik", name: "Thermik & Hitze" },
    { ordner: "07_Umwelt_Vulkan", schluessel: "umwelt", name: "Umwelt & Vulkan" },
    { ordner: "08_Interaktion_Handwerk", schluessel: "handwerk", name: "Interaktion & Handwerk" },
    { ordner: "09_Schaden_Regeneration", schluessel: "schaden", name: "Schaden & Regeneration" },
    { ordner: "10_Signale_Rituale", schluessel: "rituale", name: "Signale & Rituale" },
];
const audio = audioBlock(AUDIO, KLANG);
medienEintragen(KLASSE, { videos: { animationen: { items: [] }, videos: { items: [] } }, audio });

// ---------- Unterseiten ----------
for (const key of ["allgemeines", "biologie", "entwicklung", "heimatwelt", "gesellschaft", "politik", "geschichte", "gameplay", "forschung"]) B.reiterSeite(B.S_[key]);
B.medienSeite(B.S_.medien, { bilder: ALLE, klang: KLANG, modellRegion: "figur", texte: { Designtafeln: "Designvorlage der Spezies", "Piratenentwürfe": "Charakterentwurf aus dem Bildarchiv" } });

// ---------- Hauptseite (nach der Designtafel) ----------
{
    const s = B.S_.hauptseite, f = s.file, S_ = B.S_;
    const L = (k) => `href="${rel(f, S_[k].file)}" data-route="${B.ROUTE(S_[k])}"`;
    const klapp = (t, html, klein = "", offen = false) => `<details class="${P}-klapp"${offen ? " open" : ""}><summary><strong>${t}</strong>${klein ? `<small>${klein}</small>` : ""}<span class="${P}-chevron" aria-hidden="true"></span></summary><div class="${P}-klapp-inhalt">${html}</div></details>`;
    const ICON = { "Körpergröße": "♙", "Lebensdauer": "⧗", "Heimat": "◍", "Formgruppen": "✣" };
    const kachelBild = (b) => b.region ? B.ausschnitt(f, b.region, `${P}-thema-bild`) : `<img class="${P}-thema-bild" src="${rel(f, b.datei)}" alt="" loading="lazy" decoding="async">`;
    const kachel = (key) => `                    <a class="${P}-panel ${P}-thema" ${L(key)}>${kachelBild(S_[key].titelbild)}<span class="${P}-thema-kopf"><span class="${P}-icon" aria-hidden="true">${S_[key].icon}</span><strong>${esc(S_[key].label)}</strong></span><span class="${P}-thema-text">${esc(S_[key].text)}</span><span class="${P}-pfeil" aria-hidden="true">›</span></a>`;
    const html = B.kopf(s) +
        `            <header class="${P}-hero">
                ${B.ausschnitt(f, "banner", `${P}-hero-bild`, "", "eager")}
                <span class="${P}-glanz" aria-hidden="true"></span>
                <div class="${P}-hero-text">
                    ${B.pfad(s)}
                    <h1>${NAME}</h1>
                    <p class="${P}-unterzeile">Intelligente Lebensformen der vulkanischen Tiefen</p>
                </div>
                <ul class="${P}-hero-chips" aria-label="Kennzeichen">
${CHIPS.map((c, i) => `                    <li><span aria-hidden="true">${["◍", "✦", "🜂"][i]}</span>${esc(c)}</li>`).join("\n")}
                </ul>
            </header>
` + B.reiter(s) +
        `            <div class="${P}-start">
                <section class="${P}-panel ${P}-block ${P}-ueberblick" aria-labelledby="ueberblick-titel">
                    ${B.titel("Überblick", "", "✦", "ueberblick-titel")}
                    <div class="${P}-text ${P}-text--frei">${UEBERBLICK}</div>
                    ${B.titel("Biologische Besonderheiten", "", "✦")}
                    <div class="${P}-text ${P}-text--frei">${BESONDERHEITEN}</div>
                    <a class="${P}-mehr" ${L("allgemeines")}>Mehr unter Allgemeines →</a>
                </section>
                <aside class="${P}-steckbrief" aria-label="Steckbrief">
${STECKBRIEF.map(([a, b]) => `                    <div class="${P}-panel ${P}-wert"><span class="${P}-wert-icon" aria-hidden="true">${ICON[a]}</span><span><small>${esc(a)}</small><strong>${esc(b)}</strong></span></div>`).join("\n")}
                    <a class="${P}-panel ${P}-sensor" ${L("biologie")}>${B.ausschnitt(f, "sensor", `${P}-sensor-bild`)}<span><strong>Thermo-Sensororgan</strong>${SENSOR.replace(/<\/?p>/g, "")}</span></a>
                </aside>
                <a class="${P}-panel ${P}-welt" ${L("heimatwelt")}>
                    ${B.ausschnitt(f, "kharuun", `${P}-welt-bild`, "Kharuun aus der Designtafel")}
                    <span class="${P}-welt-text"><strong>Kharuun</strong><small>Vulkanische Welt</small></span>
                    <span class="${P}-pfeil" aria-hidden="true">›</span>
                </a>
            </div>
            <section class="${P}-panel ${P}-block ${P}-ritualik" aria-labelledby="ritualik-titel">
                <h2 class="${P}-h2 ${P}-h2--linie" id="ritualik-titel">Charakterdesign – Ritualik</h2>
                <div class="${P}-ritualik-raster">
                    ${B.ausschnitt(f, "figur", `${P}-ritualik-bild`, "Pyronoid im Ritualgewand aus der Designtafel")}
                    <div class="${P}-ritualik-text">
                        <div class="${P}-text ${P}-text--frei">${RITUALIK}</div>
                        ${B.ausschnitt(f, "ganzkoerper", `${P}-ganz-bild`, "Ganzkörper-Ansichten: Front, Seite, Rücken")}
                        <div class="${P}-klapp-liste">
                            ${klapp("Kernmerkmale (Design)", KERNMERKMALE, "6 Merkmale", true)}
                            ${klapp("Varianten (Rang / Rolle)", B.ausschnitt(f, "varianten", "", "Varianten: Akolyth, Ritualist, Hoherzelant") + VARIANTEN, "Akolyth · Ritualist · Hoherzelant")}
                            ${klapp("Runen – Bedeutungsbeispiele", B.ausschnitt(f, "runen", "", "Runen: Feuer, Hitze, Erhalt, Ritual") + RUNEN, "Feuer · Hitze · Erhalt · Ritual")}
                            ${klapp("Kopf – Ausdrücke", KOPF, "4 Ausdrücke")}
                            ${klapp("Silhouette &amp; Proportion", SILHOUETTE, "ca. 3,0 – 3,5 m")}
                        </div>
                        <p class="${P}-quelle">Quelle: ${esc(QR)}</p>
                    </div>
                </div>
            </section>
            ${B.dossierSteckbrief(s, { datei: "Allgemeines/Allgemeines.md", steckbrief: ["Speziesidentität"], beschreibung: ["Allgemeine Beschreibung"], mehr: "allgemeines" })}
            <!-- Themenbereiche entfallen: dieselben Ziele stehen in der Reiter-Leiste (zweite Leiste) -->
            <section class="${P}-panel ${P}-block ${P}-karussell-block" id="bildarchiv" aria-labelledby="bildarchiv-titel">
                ${B.titel("Bildarchiv", ALLE.length + " Bilder", "▣", "bildarchiv-titel")}
                ${B.karussell(f, ALLE, { buehne: true, filter: true, autoplay: 7000, texte: { Designtafeln: "Designvorlage der Spezies", "Piratenentwürfe": "Charakterentwurf aus dem Bildarchiv" } })}
            </section>
            <section class="${P}-medienleiste" aria-labelledby="medien-titel">
                <h2 class="${P}-h2 ${P}-h2--linie" id="medien-titel">Medien</h2>
                <div class="${P}-medien-raster">
                    <a class="${P}-panel ${P}-medium" ${L("biologie")}>${B.ausschnitt(f, "anatomie", `${P}-medium-bild`)}<span>→ Anatomie</span></a>
                    <a class="${P}-panel ${P}-medium" ${L("heimatwelt")}>${B.ausschnitt(f, "welt", `${P}-medium-bild`)}<span>→ Heimatwelt</span></a>
                    <a class="${P}-panel ${P}-medium" href="${rel(f, S_.medien.file)}#klangarchiv" data-route="${R0}-medien" data-route-fragment="klangarchiv">${B.ausschnitt(f, "klang", `${P}-medium-bild`)}<span>→ Klangarchiv <small>${KLANG.reduce((n, k) => n + k.anzahl, 0)} Klänge</small></span></a>
                </div>
            </section>
            <div class="${P}-layout ${P}-layout--fuss">
                <div class="${P}-inhalt">
                    ${B.verknuepfungen(s)}
                    ${B.quelle(QD + " · " + QR)}
                </div>
            </div>
` + B.fuss();
    write(f, html);
}
console.log("Pyronoiden fertig:", SEITEN.length, "Seiten ·", ALLE.length, "Bilder ·", KLANG.reduce((n, k) => n + k.anzahl, 0), "Klänge");
