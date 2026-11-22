// Spezies-Baukasten · eigenes Bauskript (ältere Einzelfassung). Aufruf: node scripts/spezies/eigene/plasmoiden.mjs
// Baut die Plasmoiden-Seiten im Speziesstandard (Aufbau wie Lithoiden/Chitinoiden) mit Bildkarussells und Klappkapiteln.
// Texte wörtlich aus Info_material; Seiten-CSS/-JS nur anlegen, wenn sie fehlen (Hauptseite/Medien werden von Hand gepflegt).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../../../", import.meta.url)).replace(/\\/g, "/").replace(/\/$/, "");
const S = "inhalte/spezies/Biologische Spezies/Plasmoiden";
const INFO = "Info_material/Alle_spezies_daten/Biologische Spezies/Plasmoiden";
const A = "assets/bilder/Alle Spezies+Übersicht/Biologische Spezies/Plasmoiden";
const FZ = "inhalte/Forschung";
const NAME = "Plasmoiden";
const R0 = "spezies-biological-10";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const enc = (p) => p.split("/").map((t) => (t === ".." || t === "." ? t : encodeURIComponent(t).replace(/[()']/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase()))).join("/");
const rel = (von, ziel) => enc(path.posix.relative(path.posix.dirname(von), ziel));
const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8").replace(/\r\n/g, "\n");
const write = (f, c) => { fs.mkdirSync(path.dirname(path.join(ROOT, f)), { recursive: true }); fs.writeFileSync(path.join(ROOT, f), c); };
const slug = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/ß/g, "ss").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const inline = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

// ---------- Markdown: Kapitel an „## N. Titel“, Unterüberschriften „###“, nummerierte Listen, Fakten „**X:** y“ ----------
function kapitel(datei) {
    const out = [], kopf = [];
    let cur = null, liste = null, ol = null, fakten = null, tabelle = null;
    const zu = () => { liste = ol = fakten = tabelle = null; };
    for (const roh of read(datei).split("\n")) {
        const z = roh.trim();
        if (/^#\s/.test(z) || z === "---") { zu(); continue; }
        const h2 = z.match(/^##\s+(?:(\d+(?:\.\d+)*)\.?\s+)?(.+)$/);
        if (h2) { cur = { nr: h2[1] ?? String(out.length + 1), titel: h2[2].trim(), html: [] }; out.push(cur); zu(); continue; }
        const ziel = cur ? cur.html : kopf;
        if (!z) { liste = null; ol = null; tabelle = null; continue; }
        const h3 = z.match(/^###\s+(.+)$/);
        if (h3) { zu(); ziel.push(`<h3>${inline(h3[1])}</h3>`); continue; }
        const zwischen = z.match(/^\*\*([^*]+)\*\*$/);
        if (zwischen) { zu(); ziel.push(`<h3>${inline(zwischen[1])}</h3>`); continue; }
        if (/^\|/.test(z)) {
            const zellen = z.replace(/^\||\|$/g, "").split("|").map((x) => x.trim());
            if (zellen.every((x) => /^:?-+:?$/.test(x))) continue;
            if (!tabelle) { tabelle = { kopf: zellen, zeilen: [] }; ziel.push(tabelle); } else tabelle.zeilen.push(zellen);
            continue;
        }
        const fakt = z.match(/^[-*]?\s*\*\*(.+?):\*\*\s*(.+)$/);
        if (fakt) {
            if (!fakten) { fakten = []; ziel.push({ dl: fakten }); }
            fakten.push(`<div><dt>${inline(fakt[1])}</dt><dd>${inline(fakt[2])}</dd></div>`); liste = ol = null; continue;
        }
        const li = z.match(/^[-*]\s+(.+)$/);
        if (li) { if (!liste) { liste = []; ziel.push(liste); } liste.push(`<li>${inline(li[1])}</li>`); fakten = ol = null; continue; }
        const nr = z.match(/^\d+\.\s+(.+)$/);
        if (nr) { if (!ol) { ol = { ol: [] }; ziel.push(ol); } ol.ol.push(`<li>${inline(nr[1])}</li>`); fakten = liste = null; continue; }
        zu();
        ziel.push(`<p>${inline(z)}</p>`);
    }
    const render = (b) => Array.isArray(b) ? `<ul>${b.join("")}</ul>`
        : b.dl ? `<dl class="pl-fakten">${b.dl.join("")}</dl>`
        : b.ol ? `<ol>${b.ol.join("")}</ol>`
        : b.kopf ? `<div class="pl-tabelle"><table><thead><tr>${b.kopf.map((x) => `<th>${inline(x)}</th>`).join("")}</tr></thead><tbody>${b.zeilen.map((r) => `<tr>${r.map((x) => `<td>${inline(x)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`
        : b;
    for (const k of out) { k.html = k.html.map(render).join("\n"); k.id = "k-" + slug(k.nr + "-" + k.titel); }
    out.kopf = kopf.map(render).join("\n");
    return out;
}
const finde = (l, t) => { const k = l.find((x) => x.titel.startsWith(t)); if (!k) throw new Error("Kapitel fehlt: " + t); return k; };
const absaetze = (k, n = 99) => (k.html.match(/<p>[\s\S]*?<\/p>/g) ?? []).slice(0, n).join("\n");
const fakt = (k, label) => (k.html.match(new RegExp(`<dt>${label}</dt><dd>(.*?)</dd>`)) ?? [])[1] ?? "Noch nicht ausgearbeitet";
// Unterabschnitte eines Kapitels an <h3> trennen
const teile = (k) => k.html.split("<h3>").slice(1).map((t) => { const [kopfZ, ...rest] = t.split("</h3>"); return { titel: kopfZ, html: rest.join("</h3>").trim() }; });

// ---------- Bilder ----------
const DESIGN = "Designs/Plasmoiden – Form im Fluss.png";
const nrVon = (f) => Number((f.match(/\((\d+)\)/) ?? [0, 0])[1]);
const roh = fs.readdirSync(path.join(ROOT, A, "gesamtdarstellung")).filter((x) => /\.png$/i.test(x));
const KONZEPT = roh.filter((x) => !/Pirat/.test(x)).sort((a, b) => nrVon(a) - nrVon(b)).map((x, i) => ({ datei: "gesamtdarstellung/" + x, titel: `Konzepttafel ${i + 1}`, kategorie: "Konzepttafeln" }));
const PIRAT = roh.filter((x) => /Pirat/.test(x)).sort((a, b) => nrVon(a) - nrVon(b)).map((x, i) => ({ datei: "gesamtdarstellung/" + x, titel: `Piratenentwurf ${i + 1}`, kategorie: "Piratenentwürfe" }));
const TAFEL = { datei: DESIGN, titel: "Designtafel „Form im Fluss“", kategorie: "Designtafel" };
const ALLE = [TAFEL, ...KONZEPT, ...PIRAT];
if (KONZEPT.length < 6 || PIRAT.length < 2) throw new Error("Bilder fehlen");
const bild = (b) => A + "/" + (typeof b === "string" ? b : b.datei);
// Ausschnitte der Designtafel (Anteile der quadratischen Tafel)
const REGION = {
    kreatur: { x: 0, y: .33, w: .485, h: .6 },
    formen: { x: .5, y: .03, w: .49, h: .158 },
    struktur: { x: .49, y: .255, w: .5, h: .225 },
    kapsel: { x: .5, y: .512, w: .49, h: .152 },
    anpassung: { x: .01, y: .725, w: .505, h: .195 },
    hoehle: { x: .525, y: .71, w: .26, h: .21 },
};
function ausschnitt(f, region, klasse = "", alt = "", laden = "lazy") {
    const r = REGION[region];
    return `<span class="pl-ausschnitt ${klasse}" style="--x:${r.x};--y:${r.y};--w:${r.w};--h:${r.h}"${alt ? "" : ' aria-hidden="true"'}><img src="${rel(f, bild(DESIGN))}" alt="${esc(alt)}" ${laden === "eager" ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></span>`;
}

// ---------- Seiten ----------
const SEITEN = [
    { key: "hauptseite", suffix: "", label: "Übersicht", file: S + "/hauptseite/Spezies.html", icon: "◆" },
    { key: "allgemeines", suffix: "-allgemeines", label: "Allgemeines", file: S + "/Unterseiten/Allgemeines/allgemeines.html", icon: "ⓘ", quelle: "allgemien/Allgemein-md", titelbild: { region: "kreatur" }, text: "Klassifikation, Erscheinung, Fähigkeiten und Individualität", galerie: [TAFEL, ...KONZEPT.slice(0, 6)] },
    { key: "biologie", suffix: "-biologie", label: "Biologie", file: S + "/Unterseiten/Biologie/biologie.html", icon: "⟡", quelle: "Biologie/Biologie.md", titelbild: { region: "struktur" }, text: "Gelmatrix, Kontraktionsfasern, Sinne und Stoffwechsel", galerie: [TAFEL, ...KONZEPT] },
    { key: "entwicklung", suffix: "-entwicklung", label: "Entwicklung", file: S + "/Unterseiten/Entwicklung/entwicklung.html", icon: "⤳", quelle: "02_Geschichte_Entwicklung/entwicklung.md", titelbild: { region: "kapsel" }, text: "Evolution, Keimkapselbildung und ökologische Varianten", galerie: [TAFEL, ...KONZEPT.slice(6)] },
    { key: "heimatwelt", suffix: "-heimatwelt", label: "Heimatwelt", file: S + "/Unterseiten/Heimatwelt/heimatwelt.html", icon: "◍", quelle: "05_Heimatwelt/heimatwelt-referenz.md", titelbild: { region: "hoehle" }, text: "Lymara im Sternsystem Narev", galerie: [TAFEL, ...KONZEPT.slice(0, 4)] },
    { key: "gesellschaft", suffix: "-gesellschaft", label: "Gesellschaft", file: S + "/Unterseiten/Gesellschaft/gesellschaft.html", icon: "⁂", quelle: "03_Gesellschaft_Kultur/gesellschaft.md", titelbild: KONZEPT[2], text: "Familien, Sprache, Kunst und Wirtschaft", galerie: [...KONZEPT.slice(4, 10)] },
    { key: "politik", suffix: "-politik", label: "Politik", file: S + "/Unterseiten/Politik/politik.html", icon: "⚖", quelle: "04_Politik_Fraktionsbeziehungen/politik.md", titelbild: PIRAT[0], text: "Konfluenzrat, Wasserrecht und Außenbeziehungen", galerie: [...PIRAT, TAFEL] },
    { key: "geschichte", suffix: "-geschichte", label: "Geschichte", file: S + "/Unterseiten/Geschichte/geschichte.html", icon: "⧗", quelle: "02_Geschichte_Entwicklung/geschichte.md", titelbild: KONZEPT[4], text: "Von den ersten Siedlungen bis zum Konfluenzbund", galerie: [TAFEL, ...KONZEPT.slice(8)] },
    { key: "gameplay", suffix: "-gameplay", label: "Spielintegration", file: S + "/Gameplay/gameplay.html", icon: "◈", quelle: "Gameplay/.gitkeep", titelbild: PIRAT[1], text: "Rolle im Spiel, Körperzustände, Kampf und Missionen", galerie: [...PIRAT, ...KONZEPT.slice(0, 4)] },
    { key: "forschung", suffix: "-forschung", label: "Forschung", file: S + "/Forschung/forschung.html", icon: "⚗", titelbild: { region: "struktur" }, text: "Forschungsfelder rund um die Plasmoiden" },
    { key: "medien", suffix: "-medien", label: "Medien", file: S + "/Unterseiten/Medien/medien.html", icon: "▣", titelbild: { region: "formen" }, text: "Bilder, Klänge, Bewegtbild und Modelle" },
];
const ROUTE = (s) => R0 + s.suffix;
const S_ = Object.fromEntries(SEITEN.map((s) => [s.key, s]));

// Forschungsbereiche aus Spielintegration 8 → vorhandene Forschungszweige
const ZWEIGE = [
    ["Xenoforschung/Xenobiologie", "Xenobiologie"],
    ["Technologie und Ingenieurwesen/Material- und Werkstoffwissenschaften", "Adaptives Hydrogel"],
    ["Technologie und Ingenieurwesen/Maschinenbau und Ingenieurwissenschaften", "Gelbasierte Aktuatoren"],
    ["Technologie und Ingenieurwesen/Elektrotechnik und Elektronik", "Elektrochemische Sensorik"],
    ["Naturwissenschaften/Genetik und Biotechnologie", "Biologische Selbstreparatur"],
    ["Naturwissenschaften/Biologie", "Osmotische Regulation"],
    ["Technologie und Ingenieurwesen/Informatik und Informationstechnologie", "Biokompatible Kommunikationsschnittstellen"],
    ["Naturwissenschaften/Medizin", "Medizinische Gelmaterialien"],
];
for (const [z] of ZWEIGE) if (!fs.existsSync(path.join(ROOT, FZ, z, "index.html"))) throw new Error("Zweig fehlt: " + z);

// ---------- Bausteine ----------
function kopf(s, extraCss = []) {
    const f = s.file, base = path.posix.basename(f, ".html"), haupt = s.key === "hauptseite";
    return `<!doctype html>
<html lang="de">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#080f19">
    <meta name="description" content="${esc(haupt ? "Plasmoiden im APORIA-Weltenarchiv: intelligente biologische Hydrogel-Spezies mit formveränderlichem Gelkörper von Lymara." : s.label + " der Plasmoiden im APORIA-Weltenarchiv.")}">
    <title>${esc(haupt ? "Plasmoiden · APORIA Weltenarchiv" : s.label + " · Plasmoiden · APORIA")}</title>
    <link rel="stylesheet" href="${rel(f, "Menüs/TopBar/Top_bar.css")}">
    <link rel="stylesheet" href="${rel(f, "Menüs/Side_bar/Side_bar.css")}">
${extraCss.map((c) => `    <link rel="stylesheet" href="${rel(f, c)}">\n`).join("")}    <link rel="stylesheet" href="${rel(f, "inhalte/spezies/_gemeinsam/bilder-karussell.css")}">
    <link rel="stylesheet" href="${rel(f, S + "/plasmoiden-basis.css")}">
    <link rel="stylesheet" href="${base}.css">
    <script type="module" src="${base}.js"></script>
</head>
<body class="plasmoiden pl-${s.key}" data-page="${ROUTE(s)}" data-section="spezies">
    <div data-aporia-topbar></div>
    <div class="aporia-page-frame pl-frame">
        <div data-aporia-sidebar></div>
        <main class="pl-dossier" id="inhalt">
`;
}
const fuss = () => `            <dialog class="pl-zoom" aria-label="Bild in Großansicht"><div class="controls"><button class="control" type="button" data-step="-1" aria-label="Vorheriges Bild">←</button><output aria-live="polite"></output><button class="control" type="button" data-step="1" aria-label="Nächstes Bild">→</button></div><form method="dialog"><button class="control">Schließen</button></form><img alt=""></dialog>
        </main>
    </div>
</body>
</html>
`;
function pfad(s) {
    const f = s.file, haupt = s.key === "hauptseite";
    return `<nav class="pl-pfad" aria-label="Archivpfad"><a data-route="spezies" href="${rel(f, "inhalte/spezies/Spezies_übersicht/Spezies.html")}">Spezies</a><span aria-hidden="true">›</span><a data-route="spezies-biological" href="${rel(f, "inhalte/spezies/Biologische Spezies/Übersichtsseite biologische spezies/Uebersicht.html")}">Biologische Spezies</a><span aria-hidden="true">›</span>${haupt ? `<span aria-current="page">${NAME}</span>` : `<a data-route="${R0}" href="${rel(f, SEITEN[0].file)}">${NAME}</a><span aria-hidden="true">›</span><span aria-current="page">${esc(s.label)}</span>`}</nav>`;
}
function reiter(s) {
    const f = s.file;
    return `            <nav class="pl-reiter" aria-label="Hauptreiter der Plasmoiden">
${SEITEN.map((t) => `                <a href="${rel(f, t.file)}" data-route="${ROUTE(t)}"${t.key === s.key ? ' aria-current="page"' : ""}><span aria-hidden="true">${t.icon}</span>${esc(t.label)}</a>`).join("\n")}
            </nav>
`;
}
const titel = (t, klein = "", icon = "", id = "") => `<h2 class="pl-h2"${id ? ` id="${id}"` : ""}>${icon ? `<span class="pl-icon" aria-hidden="true">${icon}</span>` : ""}${esc(t)}${klein ? ` <small>${esc(klein)}</small>` : ""}</h2>`;
function karte(k, offen = false) {
    return `                    <details class="pl-panel pl-karte" id="${k.id}"${offen ? " open" : ""}>
                        <summary><span class="pl-nr">${esc(k.nr)}</span><h2>${esc(k.titel)}</h2><span class="pl-chevron" aria-hidden="true"></span></summary>
                        <div class="pl-text">
${k.html.split("\n").map((z) => "                            " + z).join("\n")}
                        </div>
                    </details>`;
}
function sprung(liste) {
    return `<nav class="pl-panel pl-sprung" data-pl-sprung aria-label="Kapitel dieser Seite">
                    <p class="pl-kicker">Kapitel</p>
                    <button type="button" class="pl-klappen" data-pl-klappen aria-pressed="false">Alle aufklappen</button>
${liste.map((k) => `                    <a href="#${k.id}"><span class="pl-nr">${esc(k.nr)}</span>${esc(k.titel)}</a>`).join("\n")}
                </nav>`;
}
// Bildkarussell (gemeinsamer Adapter _gemeinsam/bilder-karussell.js)
function karussell(f, liste, { buehne = false, filter = false, autoplay = 0, label = "Bildarchiv der Plasmoiden", texte = {} } = {}) {
    const kategorien = [...new Set(liste.map((b) => b.kategorie))];
    const folie = (b) => `                        <figure class="karussell-folie" data-kategorie="${esc(b.kategorie)}" aria-roledescription="Folie">
                            <button type="button" class="karussell-bild" aria-label="${esc(b.titel)} in Großansicht öffnen"><img src="${rel(f, bild(b))}" alt="${esc(b.titel)}" loading="lazy" decoding="async"></button>
                            <figcaption><strong>${esc(b.titel)}</strong><span>${esc(texte[b.kategorie] ?? b.kategorie)}</span></figcaption>
                        </figure>`;
    return `<div class="bilder-karussell${buehne ? " bilder-karussell--buehne" : ""}" data-karussell${autoplay ? ` data-autoplay="${autoplay}"` : ""} aria-roledescription="Karussell" aria-label="${esc(label)}">
${filter && kategorien.length > 1 ? `                    <div class="karussell-filter" role="group" aria-label="Bilder filtern"><button type="button" data-filter="" aria-pressed="true">Alle (${liste.length})</button>${kategorien.map((k) => `<button type="button" data-filter="${esc(k)}" aria-pressed="false">${esc(k)} (${liste.filter((b) => b.kategorie === k).length})</button>`).join("")}</div>\n` : ""}                    <div class="karussell-spur" tabindex="0" aria-label="Bilder – mit Pfeiltasten blättern">
${liste.map(folie).join("\n")}
                    </div>
                    <div class="karussell-steuerung">
                        <button type="button" data-karussell-schritt="-1" aria-label="Vorheriges Bild">‹</button>
                        <div class="karussell-punkte" role="group" aria-label="Bild wählen"></div>
                        <output class="karussell-zaehler" aria-live="polite"></output>
${autoplay ? `                        <button type="button" data-karussell-pause aria-pressed="false">❚❚ Pause</button>\n` : ""}                        <button type="button" data-karussell-schritt="1" aria-label="Nächstes Bild">›</button>
                    </div>
                </div>`;
}
function galerie(s, liste, ueberschrift = "Bilder", id = "galerie") {
    return `<section class="pl-panel pl-block pl-karussell-block" id="${id}" aria-label="${esc(ueberschrift)}">
                    ${titel(ueberschrift, liste.length + " Bilder · Bildarchiv")}
                    ${karussell(s.file, liste, { label: ueberschrift + " der Plasmoiden" })}
                </section>`;
}
function verknuepfungen(s) {
    const f = s.file;
    const z = (i) => rel(f, FZ + "/" + ZWEIGE[i][0] + "/index.html");
    const links = [
        [rel(f, S_.forschung.file), "Forschung", "Forschungsfelder zu den Plasmoiden", `data-route="${R0}-forschung"`],
        [z(0), "Xenobiologie", "Forschungszweig", ""],
        [z(1), "Material- und Werkstoffwissenschaften", "Forschungszweig · Adaptives Hydrogel", ""],
        [z(5), "Biologie", "Forschungszweig · Osmotische Regulation", ""],
        [rel(f, "inhalte/Rohstoffe/Uebersicht/Rohstoffe.html"), "Rohstoffarchiv", "Rohstoffe im Weltenarchiv", 'data-route="rohstoffe"'],
        [rel(f, "inhalte/himmelskoerper/planeten/planeten.html"), "Planetenarchiv", "Lymara ist noch kein Planetendossier", 'data-route="planeten"'],
    ];
    return `<aside class="pl-panel pl-block pl-links" aria-label="Verknüpfungen">
                    ${titel("Verknüpfungen")}
                    <ul>
${links.map(([h, t, u, r]) => `                        <li><a href="${h}" ${r}><strong>${esc(t)}</strong><span>${esc(u)}</span></a></li>`).join("\n")}
                    </ul>
                </aside>`;
}
function blaettern(s) {
    const i = SEITEN.indexOf(s), vor = SEITEN[i - 1], nach = SEITEN[i + 1], f = s.file;
    return `<nav class="pl-blaettern" aria-label="Hauptreiter blättern">${vor ? `<a href="${rel(f, vor.file)}" data-route="${ROUTE(vor)}">← ${esc(vor.label)}</a>` : "<span></span>"}${nach ? `<a href="${rel(f, nach.file)}" data-route="${ROUTE(nach)}">${esc(nach.label)} →</a>` : "<span></span>"}</nav>`;
}
const quelle = (q) => `<p class="pl-quelle">Quelle: Info_material · Biologische Spezies · Plasmoiden · ${esc(q)}</p>`;
function seitenDateien(s) {
    const base = s.file.replace(/\.html$/, "");
    if (!fs.existsSync(path.join(ROOT, base + ".js"))) write(base + ".js", `// Plasmoiden – ${s.label}\n// Gemeinsame Funktionen (Topbar, Sidebar, Routen, Klappkapitel, Bildkarussell) kommen aus der Basis.\nimport "${rel(s.file, S + "/plasmoiden-basis.js")}";\n`);
    if (!fs.existsSync(path.join(ROOT, base + ".css"))) write(base + ".css", `/* Plasmoiden – ${s.label}\n   Gemeinsames Design: plasmoiden-basis.css · hier nur Anpassungen dieser Seite. */\n`);
}
function heroBild(s) {
    const t = s.titelbild;
    if (t.region) return ausschnitt(s.file, t.region, "pl-hero-bild", "", "eager");
    return `<img class="pl-hero-bild" src="${rel(s.file, bild(t))}" alt="" fetchpriority="high" decoding="async">`;
}
function hero(s) {
    return `            <header class="pl-hero pl-hero--reiter">
                ${heroBild(s)}
                <span class="pl-glanz" aria-hidden="true"></span>
                <div class="pl-hero-text">
                    ${pfad(s)}
                    <p class="pl-kicker">Plasmoiden · Hauptreiter</p>
                    <h1>${esc(s.label)}</h1>
                    <p class="pl-unterzeile">${esc(s.text)}</p>
                </div>
            </header>
`;
}

const daten = {};
for (const s of SEITEN) if (s.quelle) daten[s.key] = kapitel(INFO + "/" + s.quelle);

// ---------- Hauptreiter ----------
function reiterSeite(s) {
    const k = daten[s.key];
    const html = kopf(s) + hero(s) + reiter(s) +
        `            <div class="pl-layout">
                <div class="pl-inhalt">
${k.map((x, i) => karte(x, i === 0)).join("\n")}
                    ${galerie(s, s.galerie)}
                    ${verknuepfungen(s)}
                    ${quelle(s.quelle)}
                    ${blaettern(s)}
                </div>
                ${sprung([...k, { id: "galerie", nr: "▣", titel: "Bilder" }])}
            </div>
` + fuss();
    write(s.file, html);
    seitenDateien(s);
}
for (const key of ["allgemeines", "biologie", "entwicklung", "heimatwelt", "gesellschaft", "politik", "geschichte", "gameplay"]) reiterSeite(S_[key]);

// ---------- Forschung ----------
{
    const s = S_.forschung, f = s.file, gp = daten.gameplay, en = daten.entwicklung;
    const forschung = finde(gp, "Forschungssystem");
    const kap = [[forschung, "Spielintegration"], [finde(gp, "Technologische Nutzung"), "Spielintegration"], [finde(en, "Genetischer Aufbau"), "Entwicklung"], [finde(en, "Anpassung an fremde Lebensräume"), "Entwicklung"]]
        .map(([k, q], i) => ({ ...k, nr: String(i + 2).padStart(2, "0"), id: "f-" + slug(k.titel), html: k.html + `\n<p class="pl-quelle">Quelle: ${esc(q)} · ${esc(k.nr)}</p>` }));
    const liste = [{ id: "zweige", nr: "01", titel: "Forschungszweige" }, ...kap];
    const html = kopf(s) + hero(s) + reiter(s) +
        `            <div class="pl-layout">
                <div class="pl-inhalt">
                    <section class="pl-panel pl-block" id="zweige">
                        ${titel("Forschungszweige", "im Weltenarchiv", "⚗")}
                        <p class="pl-offen">Ein eigenes Forschungsdossier der Plasmoiden ist noch nicht ausgearbeitet. Die Forschungsbereiche aus der Spielintegration führen zu den passenden Forschungszweigen.</p>
                        <div class="pl-zweige">
${ZWEIGE.map(([z, t]) => `                            <a href="${rel(f, FZ + "/" + z + "/index.html")}"><strong>${esc(t)}</strong><span>${esc(z.split("/")[1])}</span></a>`).join("\n")}
                        </div>
                    </section>
${kap.map((x, i) => karte(x, i === 0)).join("\n")}
                    ${verknuepfungen(s)}
                    ${blaettern(s)}
                </div>
                ${sprung(liste)}
            </div>
` + fuss();
    write(f, html);
    seitenDateien(s);
}

// ---------- Medien ----------
{
    const s = S_.medien, f = s.file, KEY = "plasmoiden";
    const liste = [["bilder", "01", "Bildgalerie"], ["audio", "02", "Audio"], ["bewegtbild", "03", "Animationen und Video"], ["ansicht", "04", "3D-Modelle und 360°-Ansicht"], ["assetverkauf", "05", "Digitale Assets"]].map(([id, nr, t]) => ({ id, nr, titel: t }));
    const audio = (k, t) => `                        <article class="pl-panel media-player-card" data-kind="audio" data-key="${KEY}.audio.${k}"><h3>${t}</h3><p class="media-status" role="status">Medien werden geladen …</p></article>`;
    const html = kopf(s, ["inhalte/spezies/_gemeinsam/medien-player.css"]) + hero(s) + reiter(s) +
        `            <div class="pl-layout">
                <div class="pl-inhalt">
                    <section class="pl-panel pl-block pl-karussell-block" id="bilder" aria-labelledby="bilder-titel">
                        ${titel("Bildgalerie", ALLE.length + " Bilder", "", "bilder-titel")}
                        ${karussell(f, ALLE, { buehne: true, filter: true, label: "Bildgalerie der Plasmoiden" })}
                    </section>
                    <section class="pl-panel pl-block pl-medien-bereich" id="audio"><h2 class="pl-h2">Audio</h2>
${audio("kommunikation", "Kommunikation")}
${audio("koerpergeraeusche", "Körpergeräusche")}
${audio("hintergrundmusik", "Hintergrundmusik")}
                    </section>
                    <section class="pl-panel pl-block pl-medien-bereich" id="bewegtbild"><h2 class="pl-h2">Animationen und Video</h2>
                        <article class="pl-panel media-player-card" data-kind="video" data-key="${KEY}.videos.animationen"><h3>Animationen</h3><p class="media-status" role="status">Medien werden geladen …</p></article>
                        <article class="pl-panel media-player-card" data-kind="video" data-key="${KEY}.videos.videos"><h3>Videos</h3><p class="media-status" role="status">Medien werden geladen …</p></article>
                    </section>
                    <section class="pl-panel pl-block pl-medien-bereich" id="ansicht" data-turntable="${KEY}.rundum" data-model="${KEY}.modell"><h2 class="pl-h2">3D-Modelle und 360°-Ansicht</h2>
                        <p class="media-status" role="status">Modellansicht in Vorbereitung.</p>
                        ${ausschnitt(f, "kreatur", "pl-medien-modell", "Plasmoid aus der Designtafel „Form im Fluss“")}
                    </section>
                    <section class="pl-panel pl-block pl-medien-bereich asset-catalog" id="assetverkauf" data-asset-catalog="${KEY}"><h2 class="pl-h2">Digitale Assets</h2><p role="status">In Vorbereitung.</p></section>
                    ${verknuepfungen(s)}
                    ${blaettern(s)}
                </div>
                ${sprung(liste)}
            </div>
` + fuss();
    write(f, html);
    seitenDateien(s);
}

// ---------- Hauptseite (nach der Designtafel „Plasmoiden – Form im Fluss“) ----------
{
    const s = S_.hauptseite, f = s.file;
    const al = daten.allgemeines, bi = daten.biologie, en = daten.entwicklung, hw = daten.heimatwelt, ge = daten.gesellschaft;
    const ident = finde(al, "Klassifikation"), beschreibung = finde(al, "Allgemeine Beschreibung"), erscheinung = finde(al, "Körperliche Erscheinung");
    const faehig = finde(al, "Charakteristische Fähigkeiten"), person = finde(al, "Persönlichkeit");
    const komponenten = teile(finde(bi, "Körperliche Hauptkomponenten")), form = finde(bi, "Körperform und Formveränderung");
    const fortpfl = finde(en, "Fortpflanzung"), embryo = finde(en, "Embryonalentwicklung"), phasen = finde(en, "Entwicklungsphasen");
    const varianten = teile(finde(en, "Genetische Variation")), welt = finde(hw, "Planetare Identität"), oberflaeche = finde(hw, "Planetare Oberfläche");
    const kunst = teile(finde(ge, "Kulturelle Ausdrucksformen"));
    const P = (k) => rel(f, S_[k].file);
    const R = (k) => ROUTE(S_[k]);
    const merkmal = (k, t) => (k.html.match(new RegExp(`<li>(${t}[^<]*)</li>`)) ?? [0, "Noch nicht ausgearbeitet"])[1];
    const klapp = (t, html, klein = "") => `<details class="pl-klapp"><summary><strong>${t}</strong>${klein ? `<small>${klein}</small>` : ""}<span class="pl-chevron" aria-hidden="true"></span></summary><div class="pl-klapp-inhalt">${html}</div></details>`;
    const ersterSatz = (html) => (html.match(/<p>(.*?)<\/p>/) ?? [0, ""])[1];
    const kachelBild = (b) => b.region ? ausschnitt(f, b.region, "pl-thema-bild") : `<img class="pl-thema-bild" src="${rel(f, bild(b))}" alt="" loading="lazy" decoding="async">`;
    const kachel = (key) => `                    <a class="pl-panel pl-thema" href="${P(key)}" data-route="${R(key)}">${kachelBild(S_[key].titelbild)}<span class="pl-thema-kopf"><span class="pl-icon" aria-hidden="true">${S_[key].icon}</span><strong>${esc(S_[key].label)}</strong></span><span class="pl-thema-text">${esc(S_[key].text)}</span><span class="pl-pfeil" aria-hidden="true">›</span></a>`;
    const html = kopf(s) +
        `            <header class="pl-hero">
                ${ausschnitt(f, "kreatur", "pl-hero-bild", "", "eager")}
                <span class="pl-glanz" aria-hidden="true"></span>
                <div class="pl-hero-text">
                    ${pfad(s)}
                    <p class="pl-kicker">Spezies · ${fakt(ident, "Arbeitskennung")}</p>
                    <h1>${NAME}</h1>
                    <p class="pl-unterzeile">${fakt(ident, "Lebensform")}</p>
                    ${absaetze(beschreibung, 2).replace(/<p>/g, '<p class="pl-intro">')}
                </div>
                <dl class="pl-chips">
                    <div><dt>Herkunft</dt><dd>${fakt(ident, "Herkunft")}</dd></div>
                    <div><dt>Lebensdauer</dt><dd>${fakt(ident, "Lebensdauer")}</dd></div>
                    <div><dt>Körpermasse</dt><dd>${merkmal(erscheinung, "Körpermasse").replace(/^Körpermasse /, "")}</dd></div>
                    <div><dt>Flüssigkeitsanteil</dt><dd>${merkmal(erscheinung, "Flüssigkeitsanteil").replace(/^Flüssigkeitsanteil von /, "")}</dd></div>
                </dl>
            </header>
` + reiter(s) +
        `            <div class="pl-start-raster">
                <section class="pl-panel pl-block pl-formen" aria-labelledby="formen-titel">
                    <h2 class="pl-h2 pl-h2--linie" id="formen-titel">Formveränderung</h2>
                    ${ausschnitt(f, "formen", "pl-formen-bild", "Formen eines Plasmoiden aus der Designtafel")}
                    <div class="pl-text pl-text--frei">
                        ${form.html.split("\n").slice(0, 2).join("\n                        ")}
                    </div>
                    ${klapp("Mehr zur Formveränderung", form.html.split("\n").slice(2).join(""), "Dauer und Grenzen")}
                    <a class="pl-mehr" href="${P("biologie")}#${form.id}" data-route="${R("biologie")}" data-route-fragment="${form.id}">Zur Biologie →</a>
                </section>
                <aside class="pl-panel pl-block pl-fakten-box" aria-labelledby="fakten-titel">
                    <h2 class="pl-h2 pl-h2--linie" id="fakten-titel">Steckbrief</h2>
                    ${ident.html}
                </aside>
            </div>
            <section class="pl-panel pl-block pl-band" aria-labelledby="struktur-titel">
                <h2 class="pl-h2 pl-h2--linie" id="struktur-titel">Innenstruktur – vernetzter Gelkörper</h2>
                <div class="pl-band-raster">
                    ${ausschnitt(f, "struktur", "pl-band-bild", "Innenstruktur eines Plasmoiden aus der Designtafel")}
                    <div class="pl-klapp-liste">
${komponenten.map((k, i) => `                        ${klapp(k.titel.replace(/^\d+(\.\d+)*\s+/, ""), k.html, ersterSatz(k.html).replace(/<[^>]+>/g, "").slice(0, 70) + (ersterSatz(k.html).length > 70 ? " …" : "")).replace("<details", i === 0 ? "<details open" : "<details")}`).join("\n")}
                    </div>
                </div>
            </section>
            <section class="pl-panel pl-block pl-band pl-band--gespiegelt" aria-labelledby="kapsel-titel">
                <h2 class="pl-h2 pl-h2--linie" id="kapsel-titel">Fortpflanzung – Keimkapselbildung</h2>
                <div class="pl-band-raster">
                    ${ausschnitt(f, "kapsel", "pl-band-bild", "Stadien der Keimkapselbildung aus der Designtafel")}
                    <div class="pl-klapp-liste">
                        ${klapp(esc(fortpfl.titel), fortpfl.html, "Austausch und Keimkapsel").replace("<details", "<details open")}
                        ${klapp(esc(embryo.titel), embryo.html, "Inhalt der Keimkapsel")}
                        ${klapp(esc(phasen.titel), phasen.html, "Keimphase bis späte Lebensphase")}
                    </div>
                </div>
            </section>
            <section class="pl-panel pl-block pl-band" aria-labelledby="varianten-titel">
                <h2 class="pl-h2 pl-h2--linie" id="varianten-titel">Verschiedene Formen und Anpassungen</h2>
                ${ausschnitt(f, "anpassung", "pl-varianten-bild", "Ökologische Körpervarianten aus der Designtafel")}
                <div class="pl-varianten">
${varianten.map((v) => `                    ${klapp(esc(v.titel.replace(/^\d+(\.\d+)*\s+/, "")), v.html, ersterSatz(v.html))}`).join("\n")}
                </div>
                <a class="pl-mehr" href="${P("entwicklung")}#${finde(en, "Genetische Variation").id}" data-route="${R("entwicklung")}" data-route-fragment="${finde(en, "Genetische Variation").id}">Zu den Varianten in der Entwicklung →</a>
            </section>
            <section class="pl-panel pl-block pl-karussell-block" id="bildarchiv" aria-labelledby="bildarchiv-titel">
                ${titel("Bildarchiv", ALLE.length + " Bilder", "▣", "bildarchiv-titel")}
                ${karussell(f, ALLE, { buehne: true, filter: true, autoplay: 7000, texte: { Designtafel: "Offizielle Designvorlage der Spezies", Konzepttafeln: "Konzepttafel aus dem Bildarchiv", "Piratenentwürfe": "Charakterentwurf aus dem Bildarchiv" } })}
            </section>
            <section class="pl-themen" aria-labelledby="themen-titel">
                <h2 class="pl-h2 pl-h2--linie" id="themen-titel">Themenbereiche: Plasmoiden im Überblick</h2>
                <div class="pl-themen-raster">
${["allgemeines", "biologie", "entwicklung", "heimatwelt", "gesellschaft", "politik", "geschichte", "gameplay"].map(kachel).join("\n")}
                </div>
            </section>
            <section class="pl-welt" aria-labelledby="welt-titel">
                ${ausschnitt(f, "hoehle", "pl-welt-bild")}
                <div class="pl-welt-text">
                    <p class="pl-kicker">Heimatwelt · System ${fakt(welt, "Sternsystem")}</p>
                    <h2 id="welt-titel">${fakt(welt, "Name")}</h2>
                    <p class="pl-welt-zeile">${fakt(welt, "Planetentyp")} · ${fakt(welt, "Gravitation")} · Wasserbedeckung ${fakt(welt, "Wasserbedeckung").replace(/^Als Entwurfswert /, "")}</p>
                    ${absaetze(oberflaeche, 2)}
                    <a class="pl-knopf" href="${P("heimatwelt")}" data-route="${R("heimatwelt")}">Zur Heimatwelt: ${fakt(welt, "Name")} ›</a>
                </div>
            </section>
            <div class="pl-fuss-raster">
                <section class="pl-panel pl-block" aria-labelledby="faehig-titel">
                    ${titel(faehig.titel, "", "◆", "faehig-titel")}
                    <div class="pl-text pl-text--frei">${faehig.html}</div>
                </section>
                <section class="pl-panel pl-block" aria-labelledby="kultur-titel">
                    ${titel("Kultur und Individualität", "", "⁂", "kultur-titel")}
                    <div class="pl-klapp-liste">
                        ${klapp(esc(person.titel), person.html, ersterSatz(person.html))}
${kunst.map((k) => `                        ${klapp(esc(k.titel), k.html, "Kulturelle Ausdrucksform")}`).join("\n")}
                    </div>
                    <a class="pl-mehr" href="${P("gesellschaft")}" data-route="${R("gesellschaft")}">Zur Gesellschaft →</a>
                </section>
            </div>
            <section class="pl-highlights" aria-labelledby="highlights-titel">
                <h2 class="pl-h2 pl-h2--linie" id="highlights-titel">Highlights &amp; Medien</h2>
                <div class="pl-highlights-raster">
                    <a class="pl-panel pl-highlight" href="${P("medien")}#audio" data-route="${R("medien")}" data-route-fragment="audio">${ausschnitt(f, "hoehle", "pl-highlight-bild")}<span><strong>Klänge von Lymara</strong><em>Kommunikation, Körpergeräusche und Hintergrundmusik</em></span></a>
                    <a class="pl-panel pl-highlight" href="${P("medien")}#bilder" data-route="${R("medien")}" data-route-fragment="bilder"><img class="pl-highlight-bild" src="${rel(f, bild(KONZEPT[0]))}" alt="" loading="lazy" decoding="async"><span><strong>Bildgalerie</strong><em>Designtafel, Konzepttafeln und Piratenentwürfe</em></span></a>
                    <a class="pl-panel pl-highlight" href="${P("forschung")}" data-route="${R("forschung")}">${ausschnitt(f, "struktur", "pl-highlight-bild")}<span><strong>Forschung</strong><em>Adaptives Hydrogel, Sensorik und Selbstreparatur</em></span></a>
                </div>
            </section>
            <div class="pl-layout pl-layout--fuss">
                <div class="pl-inhalt">
                    ${verknuepfungen(s)}
                    ${quelle("Allgemeines · Biologie · Entwicklung · Heimatwelt · Gesellschaft")}
                </div>
            </div>
` + fuss();
    write(f, html);
}
console.log("fertig:", SEITEN.length, "Seiten ·", ALLE.length, "Bilder");
