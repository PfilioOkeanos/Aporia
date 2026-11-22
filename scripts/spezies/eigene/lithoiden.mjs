// Spezies-Baukasten · eigenes Bauskript (ältere Einzelfassung). Aufruf: node scripts/spezies/eigene/lithoiden.mjs
// Baut die Lithoiden-Seiten nach dem Projektschema (hauptseite/, Unterseiten/<Thema>/, Gameplay/, Forschung/).
// Abgeleitet aus geo-build.mjs. Texte wörtlich aus Info_material; Seiten-CSS/-JS nur anlegen, wenn sie fehlen.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../../../", import.meta.url)).replace(/\\/g, "/").replace(/\/$/, "");
const S = "inhalte/spezies/Biologische Spezies/Lithoiden";
const INFO = "Info_material/Alle_spezies_daten/Biologische Spezies/Lithoiden";
const A = "assets/bilder/Alle Spezies+Übersicht/Biologische Spezies/Lithoiden/gesamtdarstellung";
const FZ = "inhalte/Forschung";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const enc = (p) => p.split("/").map((t) => (t === ".." || t === "." ? t : encodeURIComponent(t).replace(/[()']/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase()))).join("/");
const rel = (von, ziel) => enc(path.posix.relative(path.posix.dirname(von), ziel));
const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8").replace(/\r\n/g, "\n");
const write = (f, c) => { fs.mkdirSync(path.dirname(path.join(ROOT, f)), { recursive: true }); fs.writeFileSync(path.join(ROOT, f), c); };
const slug = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/ß/g, "ss").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const inline = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
const bild = (f) => A + "/" + f;
const name = (f) => path.posix.basename(f).replace(/\.(png|jpe?g|webp)$/i, "").replace(/_/g, " ").replace(/\s+/g, " ").trim();

// ---------- Markdown: Kapitel an ## (Unterüberschriften ###, Tabellen, Faktenzeilen, Listen) ----------
function kapitel(datei) {
    const out = [], kopf = [];
    let cur = null, liste = null, fakten = null, tabelle = null;
    const zu = () => { liste = fakten = tabelle = null; };
    for (const roh of read(datei).split("\n")) {
        const z = roh.trim();
        if (/^#\s/.test(z) || z === "---") { zu(); continue; }
        const h2 = z.match(/^##\s+(?:(\d+(?:\.\d+)?)\s+)?(.+)$/);
        if (h2) { cur = { nr: h2[1] ?? String(out.length + 1), titel: h2[2].trim(), html: [] }; out.push(cur); zu(); continue; }
        const ziel = cur ? cur.html : kopf;
        if (!z) { liste = null; tabelle = null; continue; }
        const h3 = z.match(/^###\s+(.+)$/);
        if (h3) { zu(); ziel.push(`<h3>${inline(h3[1])}</h3>`); continue; }
        if (/^\|/.test(z)) {
            const zellen = z.replace(/^\||\|$/g, "").split("|").map((x) => x.trim());
            if (zellen.every((x) => /^:?-+:?$/.test(x))) continue;
            if (!tabelle) { tabelle = { kopf: zellen, zeilen: [] }; ziel.push(tabelle); } else tabelle.zeilen.push(zellen);
            continue;
        }
        const fakt = z.match(/^[-*]?\s*\*\*(.+?):\*\*\s*(.+)$/);
        if (fakt) {
            if (!fakten) { fakten = []; ziel.push({ dl: fakten }); }
            fakten.push(`<div><dt>${inline(fakt[1])}</dt><dd>${inline(fakt[2].replace(/\s+$/, ""))}</dd></div>`); liste = null; continue;
        }
        const li = z.match(/^[-*]\s+(.+)$/);
        if (li) { if (!liste) { liste = []; ziel.push(liste); } liste.push(`<li>${inline(li[1])}</li>`); fakten = null; continue; }
        zu();
        ziel.push(`<p>${inline(z)}</p>`);
    }
    const render = (b) => Array.isArray(b) ? `<ul>${b.join("")}</ul>`
        : b.dl ? `<dl class="li-fakten">${b.dl.join("")}</dl>`
        : b.kopf ? `<div class="li-tabelle"><table><thead><tr>${b.kopf.map((x) => `<th>${inline(x)}</th>`).join("")}</tr></thead><tbody>${b.zeilen.map((r) => `<tr>${r.map((x) => `<td>${inline(x)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`
        : b;
    for (const k of out) {
        k.html = k.html.map(render).join("\n");
        k.id = "k-" + slug(k.nr + "-" + k.titel);
    }
    out.kopf = kopf.map(render).join("\n");
    return out;
}
const finde = (l, t) => { const k = l.find((x) => x.titel.startsWith(t)); if (!k) throw new Error("Kapitel fehlt: " + t); return k; };
const absaetze = (k, n = 99) => (k.html.match(/<p>[\s\S]*?<\/p>/g) ?? []).slice(0, n).join("\n");

// ---------- Seiten ----------
const SEITEN = [
    { key: "hauptseite", suffix: "", label: "Übersicht", file: S + "/hauptseite/Spezies.html", icon: "◆" },
    { key: "allgemeines", suffix: "-allgemeines", label: "Allgemeines", file: S + "/Unterseiten/Allgemeines/allgemeines.html", icon: "ⓘ", quelle: "Allgemeines/Allgemein.md", titelbild: "lithoiden_designA1.png", text: "Beschreibung, Erscheinung, Grunddaten und Abgrenzung" },
    { key: "biologie", suffix: "-biologie", label: "Biologie", file: S + "/Unterseiten/Biologie/biologie.html", icon: "⟡", quelle: "Biologie/Biologie.md", titelbild: "Lithoid_ Mineralische Lebensform-1.png", text: "Kristallverbände, Stoffwechsel, Sinne und Fortpflanzung" },
    { key: "entwicklung", suffix: "-entwicklung", label: "Entwicklung", file: S + "/Unterseiten/Entwicklung/entwicklung.html", icon: "⤳", quelle: "02_Geschichte_Entwicklung/entwicklung.md", titelbild: "lithoiden_designA3.png", text: "Evolution, Erbinformation und Populationen" },
    { key: "heimatwelt", suffix: "-heimatwelt", label: "Heimatwelt", file: S + "/Unterseiten/Heimatwelt/heimatwelt.html", icon: "◭", quelle: "05_Heimatwelt/heimatwelt-referenz.md", titelbild: "lithoiden_designA2.png", text: "Nhemara – Quellterrassen, Kristallhochland und Tiefenkammern" },
    { key: "gesellschaft", suffix: "-gesellschaft", label: "Gesellschaft", file: S + "/Unterseiten/Gesellschaft/gesellschaft.html", icon: "⁂", quelle: "03_Gesellschaft_Kultur/gesellschaft.md", titelbild: "Kristallbestie am Dampfbecken-2.png", text: "Lagenverbände, Städte, Kunst und Traditionen" },
    { key: "politik", suffix: "-politik", label: "Politik", file: S + "/Unterseiten/Politik/politik.html", icon: "⚖", quelle: "04_Politik_Fraktionsbeziehungen/politik.md", titelbild: "Kristallrat der steinernen Weisen.png", text: "Bund der Quellbecken und Beziehungen zu den Großmächten" },
    { key: "geschichte", suffix: "-geschichte", label: "Geschichte", file: S + "/Unterseiten/Geschichte/geschichte.html", icon: "⧗", quelle: "02_Geschichte_Entwicklung/geschichte.md", titelbild: "Kristallbestie im leuchtenden Höhlendom-4.png", text: "Von der mineralischen Biosphäre bis zur Gegenwart" },
    { key: "gameplay", suffix: "-gameplay", label: "Spielintegration", file: S + "/Gameplay/gameplay.html", icon: "◈", quelle: "Gameplay/.gitkeep", titelbild: "ChatGPT-Bild 21. Nov. 2026, 14_58_42-2.png", text: "Spielrolle, Missionen und Umweltmechaniken" },
    { key: "forschung", suffix: "-forschung", label: "Forschung", file: S + "/Forschung/forschung.html", icon: "⚗", titelbild: "Kristallbesetztes Lithoidenwesen-3.png", text: "Forschungsfelder zur mineralischen Lebensform" },
    { key: "medien", suffix: "-medien", label: "Medien", file: S + "/Unterseiten/Medien/medien.html", icon: "▣", quelle: "Medien/Medien.md", titelbild: "lithoiden_designA4.png", text: "Bilder, Bewegtbild, Audio und Modelle" },
];
const ROUTE = (s) => "spezies-biological-6" + s.suffix;
const S_ = Object.fromEntries(SEITEN.map((s) => [s.key, s]));
const HERO = "ChatGPT-Bild 21. Nov. 2026, 14_58_42-2.png";
const bilderIn = (ordner, praefix) => fs.readdirSync(path.join(ROOT, A, ordner)).filter((x) => /\.(png|jpe?g|webp)$/i.test(x)).sort((a, b) => a.localeCompare(b, "de", { numeric: true })).map((x) => praefix + x);
// Gesamtdarstellung + Entwicklungsstadien (Ordner assets/…/Lithoiden/entwicklungsstadien)
const STADIEN = bilderIn("../entwicklungsstadien", "../entwicklungsstadien/");
const ALLE = [...bilderIn(".", ""), ...STADIEN];
// Medienkategorien (Filter der Galerie)
const KATEGORIE = (f) => /entwicklungsstadien\//.test(f) ? "Entwicklungsstadien" : /design_?A1|Kristallbesetzt|Mineralische Lebensform/i.test(f) ? "Konzeptbilder" : /Höhlendom|designA3/i.test(f) ? "Lebensräume" : /Kristallrat/i.test(f) ? "Gesellschaft" : "Heimatwelt";
for (const s of SEITEN) if (s.titelbild && !ALLE.includes(s.titelbild)) throw new Error("Bild fehlt: " + s.titelbild);

const ZWEIGE = [
    ["Xenoforschung/Xenobiologie", "Xenobiologie", "Untersuchung der mineralischen Grundorganisation."],
    ["Naturwissenschaften/Genetik und Biotechnologie", "Genetik und Biotechnologie", "Erforschung nichtorganischer Erbinformation und der natürlichen Keimbildung."],
    ["Technologie und Ingenieurwesen/Material- und Werkstoffwissenschaften", "Werkstoffkunde", "Analyse lebender Kristallverbände und mechanochemischer Mineralstrukturen."],
    ["Naturwissenschaften/Chemie", "Elektrochemie", "Untersuchung der Energieversorgung und Signalverarbeitung."],
    ["Spezialisierte und erweiterte Forschung/Bewusstseins- und neuronale Vernetzungsforschung", "Neurobiologie und Bewusstseinsforschung", "Vergleich lithoidischer Informationssysteme mit organischen Nervensystemen."],
    ["Raum- und Planetensysteme/Planetologie und Geowissenschaften", "Planetologie", "Untersuchung der geologischen Stoffkreisläufe Nhemaras."],
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
    <meta name="theme-color" content="#0b0d14">
    <meta name="description" content="${esc(haupt ? "Lithoiden im APORIA-Weltenarchiv: intelligente, natürlich entstandene Lebensform aus lebenden Kristallverbänden von Nhemara." : s.label + " der Lithoiden im APORIA-Weltenarchiv.")}">
    <title>${esc(haupt ? "Lithoiden · APORIA Weltenarchiv" : s.label + " · Lithoiden · APORIA")}</title>
    <link rel="stylesheet" href="${rel(f, "Menüs/TopBar/Top_bar.css")}">
    <link rel="stylesheet" href="${rel(f, "Menüs/Side_bar/Side_bar.css")}">
${extraCss.map((c) => `    <link rel="stylesheet" href="${rel(f, c)}">\n`).join("")}    <link rel="stylesheet" href="${rel(f, S + "/lithoiden-basis.css")}">
    <link rel="stylesheet" href="${base}.css">
    <script type="module" src="${base}.js"></script>
</head>
<body class="lithoiden li-${s.key}" data-page="${ROUTE(s)}" data-section="spezies">
    <div data-aporia-topbar></div>
    <div class="aporia-page-frame li-frame">
        <div data-aporia-sidebar></div>
        <main class="li-dossier" id="inhalt">
`;
}
const fuss = () => `            <dialog class="li-zoom" aria-label="Bild in Großansicht"><div class="controls"><button class="control" type="button" data-step="-1" aria-label="Vorheriges Bild">←</button><output aria-live="polite"></output><button class="control" type="button" data-step="1" aria-label="Nächstes Bild">→</button></div><form method="dialog"><button class="control">Schließen</button></form><img alt=""></dialog>
        </main>
    </div>
</body>
</html>
`;
function pfad(s) {
    const f = s.file, haupt = s.key === "hauptseite";
    return `<nav class="li-pfad" aria-label="Archivpfad"><a data-route="spezies" href="${rel(f, "inhalte/spezies/Spezies_übersicht/Spezies.html")}">Spezies</a><span aria-hidden="true">›</span><a data-route="spezies-biological" href="${rel(f, "inhalte/spezies/Biologische Spezies/Übersichtsseite biologische spezies/Uebersicht.html")}">Biologische Spezies</a><span aria-hidden="true">›</span>${haupt ? '<span aria-current="page">Lithoiden</span>' : `<a data-route="spezies-biological-6" href="${rel(f, SEITEN[0].file)}">Lithoiden</a><span aria-hidden="true">›</span><span aria-current="page">${esc(s.label)}</span>`}</nav>`;
}
function reiter(s) {
    const f = s.file;
    return `            <nav class="li-reiter" aria-label="Hauptreiter der Lithoiden">
${SEITEN.map((t) => `                <a href="${rel(f, t.file)}" data-route="${ROUTE(t)}"${t.key === s.key ? ' aria-current="page"' : ""}><span aria-hidden="true">${t.icon}</span>${esc(t.label)}</a>`).join("\n")}
            </nav>
`;
}
const titel = (t, klein = "", icon = "") => `<h2 class="li-h2">${icon ? `<span class="li-icon" aria-hidden="true">${icon}</span>` : ""}${esc(t)}${klein ? ` <small>${esc(klein)}</small>` : ""}</h2>`;
function karte(k) {
    return `                    <details class="li-panel li-karte" id="${k.id}" open>
                        <summary><span class="li-nr">${esc(k.nr)}</span><h2>${esc(k.titel)}</h2><span class="li-chevron" aria-hidden="true"></span></summary>
                        <div class="li-text">
${k.html.split("\n").map((z) => "                            " + z).join("\n")}
                        </div>
                    </details>`;
}
function sprung(liste) {
    return `<nav class="li-panel li-sprung" data-li-sprung aria-label="Kapitel dieser Seite">
                    <p class="li-kicker">Kapitel</p>
${liste.map((k) => `                    <a href="#${k.id}"><span class="li-nr">${esc(k.nr)}</span>${esc(k.titel)}</a>`).join("\n")}
                </nav>`;
}
function galerie(s, liste, ueberschrift, id) {
    return `<section class="li-panel li-block li-galerie" id="${id}" data-li-galerie>
                    ${titel(ueberschrift, "Bildarchiv")}
                    <div class="li-galerie-raster">
${liste.map((b) => `                        <button type="button" class="li-kachel"><img src="${rel(s.file, bild(b))}" alt="${esc(name(b))}" loading="lazy" decoding="async"><span>${esc(name(b))}</span></button>`).join("\n")}
                    </div>
                </section>`;
}
function verknuepfungen(s) {
    const f = s.file;
    const links = [
        [rel(f, S_.forschung.file), "Forschung", "Forschungsfelder zu den Lithoiden", 'data-route="spezies-biological-6-forschung"'],
        [rel(f, FZ + "/" + ZWEIGE[0][0] + "/index.html"), "Xenobiologie", "Forschungszweig", ""],
        [rel(f, FZ + "/" + ZWEIGE[1][0] + "/index.html"), "Genetik und Biotechnologie", "Forschungszweig", ""],
        [rel(f, FZ + "/" + ZWEIGE[2][0] + "/index.html"), "Werkstoffkunde", "Forschungszweig", ""],
        [rel(f, "inhalte/Rohstoffe/Uebersicht/Rohstoffe.html"), "Rohstoffarchiv", "Mineralische Stoffe", 'data-route="rohstoffe"'],
        [rel(f, "inhalte/himmelskoerper/planeten/planeten.html"), "Planetenarchiv", "Nhemara ist noch kein Planetendossier", 'data-route="planeten"'],
    ];
    return `<aside class="li-panel li-block li-links" aria-label="Verknüpfungen">
                    ${titel("Verknüpfungen")}
                    <ul>
${links.map(([h, t, u, r]) => `                        <li><a href="${h}" ${r}><strong>${esc(t)}</strong><span>${esc(u)}</span></a></li>`).join("\n")}
                    </ul>
                </aside>`;
}
function blaettern(s) {
    const i = SEITEN.indexOf(s), vor = SEITEN[i - 1], nach = SEITEN[i + 1], f = s.file;
    return `<nav class="li-blaettern" aria-label="Hauptreiter blättern">${vor ? `<a href="${rel(f, vor.file)}" data-route="${ROUTE(vor)}">← ${esc(vor.label)}</a>` : "<span></span>"}${nach ? `<a href="${rel(f, nach.file)}" data-route="${ROUTE(nach)}">${esc(nach.label)} →</a>` : "<span></span>"}</nav>`;
}
const quelle = (q) => `<p class="li-quelle">Quelle: Info_material · Biologische Spezies · Lithoiden · ${esc(q)}</p>`;
function seitenDateien(s, css = "") {
    const base = s.file.replace(/\.html$/, "");
    if (!fs.existsSync(path.join(ROOT, base + ".js"))) write(base + ".js", `// Lithoiden – ${s.label}\n// Gemeinsame Funktionen (Topbar, Sidebar, Routen, Kapitel, Galerie) kommen aus der Basis.\nimport "${rel(s.file, S + "/lithoiden-basis.js")}";\n`);
    if (!fs.existsSync(path.join(ROOT, base + ".css"))) write(base + ".css", `/* Lithoiden – ${s.label}\n   Gemeinsames Design: lithoiden-basis.css · hier nur Anpassungen dieser Seite. */\n${css}`);
}
function hero(s, unterzeile, extra = "") {
    return `            <header class="li-hero li-hero--reiter">
                <img class="li-hero-bild" src="${rel(s.file, bild(s.titelbild))}" alt="" fetchpriority="high" decoding="async">
                <div class="li-hero-text">
                    ${pfad(s)}
                    <p class="li-kicker">Lithoiden · Hauptreiter</p>
                    <h1>${esc(s.label)}</h1>
                    <p class="li-unterzeile">${esc(unterzeile)}</p>
                    ${extra}
                </div>
            </header>
`;
}

const daten = {};
for (const s of SEITEN) if (s.quelle) daten[s.key] = kapitel(INFO + "/" + s.quelle);

// ---------- Hauptreiter ----------
function reiterSeite(s, { vorne = "", hinten = "", galerieBilder = [] } = {}) {
    const k = daten[s.key];
    const html = kopf(s) + hero(s, s.text) + reiter(s) +
        `            <div class="li-layout">
                <div class="li-inhalt">
${k.kopf ? `                    <section class="li-panel li-block li-kopfdaten">${titel("Dokument")}${k.kopf}</section>` : ""}
${vorne}
${k.map(karte).join("\n")}
${galerieBilder.length ? galerie(s, galerieBilder, "Bilder", "galerie") : ""}
${hinten}
                    ${verknuepfungen(s)}
                    ${quelle(s.quelle)}
                    ${blaettern(s)}
                </div>
                ${sprung(k)}
            </div>
` + fuss();
    write(s.file, html);
    seitenDateien(s);
}
reiterSeite(S_.allgemeines, { galerieBilder: ["lithoiden_designA1.png", "Kristallbesetztes Lithoidenwesen-3.png", "Lithoid_ Mineralische Lebensform-1.png"] });
reiterSeite(S_.biologie, { galerieBilder: ["Lithoid_ Mineralische Lebensform-1.png", "lithoiden_designA1.png", "Kristallbesetztes Lithoidenwesen-3.png"] });
reiterSeite(S_.entwicklung, { galerieBilder: [...STADIEN, "lithoiden_designA3.png", "Kristallbestie im leuchtenden Höhlendom-4.png"] });
reiterSeite(S_.heimatwelt, { galerieBilder: ["lithoiden_designA2.png", "Kristallbestie am Dampfbecken-2.png", "lithoiden_designA4.png", HERO] });
reiterSeite(S_.gesellschaft, { galerieBilder: ["Kristallbestie am Dampfbecken-2.png", "Kristallrat der steinernen Weisen.png"] });
reiterSeite(S_.politik, { galerieBilder: ["Kristallrat der steinernen Weisen.png"] });
reiterSeite(S_.geschichte, { galerieBilder: ["Kristallbestie im leuchtenden Höhlendom-4.png", "lithoiden_designA3.png"] });
reiterSeite(S_.gameplay, { galerieBilder: [HERO, "Kristallbestie am Dampfbecken-2.png", "lithoiden_designA4.png"] });

// ---------- Forschung ----------
{
    const s = S_.forschung, f = s.file, gp = daten.gameplay, en = daten.entwicklung, bi = daten.biologie;
    const teile = [[finde(gp, "Wissenschaft und Forschung"), "Spielintegration"], [finde(en, "Evolutionswissenschaft"), "Entwicklung"], [finde(en, "Technologische Eingriffe"), "Entwicklung"], [finde(bi, "Informationsverarbeitung und Bewusstsein"), "Biologie"]]
        .map(([k, q], i) => ({ ...k, nr: String(i + 2).padStart(2, "0"), id: "f-" + slug(k.titel), html: k.html + `\n<p class="li-quelle">Quelle: ${esc(q)} · ${esc(k.nr)}</p>` }));
    const liste = [{ id: "zweige", nr: "01", titel: "Forschungszweige" }, ...teile];
    const html = kopf(s) + hero(s, s.text) + reiter(s) +
        `            <div class="li-layout">
                <div class="li-inhalt">
                    <section class="li-panel li-block" id="zweige">
                        ${titel("Forschungszweige", "im Weltenarchiv", "⚗")}
                        <p class="li-offen">Ein eigenes Forschungsdossier der Lithoiden ist noch nicht ausgearbeitet. Die folgenden Forschungszweige entsprechen den Wissenschaftsfeldern aus der Spielintegration.</p>
                        <div class="li-zweige">
${ZWEIGE.map(([z, t, txt]) => `                            <a href="${rel(f, FZ + "/" + z + "/index.html")}"><strong>${esc(t)}</strong><span>${esc(txt)}</span></a>`).join("\n")}
                        </div>
                    </section>
${teile.map(karte).join("\n")}
                    ${verknuepfungen(s)}
                    ${blaettern(s)}
                </div>
                ${sprung(liste)}
            </div>
` + fuss();
    write(f, html);
    seitenDateien(s);
}

// ---------- Medien (Aufbau wie die übrigen Medienseiten, z. B. Thalassoiden/Dendroarchen) ----------
{
    const s = S_.medien, f = s.file;
    // Medienplan-Kapitel heißen „A – Bildmaterial“ usw.: Buchstabe als Kapitelnummer, Rest als Titel
    const md = daten.medien.map((k) => { const m = k.titel.match(/^([A-Z])\s+–\s+(.+)$/); return m ? { ...k, nr: m[1], titel: m[2] } : k; });
    const start = Math.max(0, ALLE.indexOf(HERO));
    const vorschau = [start, ...ALLE.map((_, i) => i).filter((i) => i !== start)].slice(0, 6);
    const KEY = "lithoiden";
    const liste = [["bilder", "01", "Bildgalerie"], ["bewegtbild", "02", "Animationen und Video"], ["audio", "03", "Audio"], ["ansicht", "04", "3D-Modelle und 360°-Ansicht"], ["assetverkauf", "05", "Digitale Assets"], ...md.map((k) => [k.id, k.nr, k.titel])].map(([id, nr, t]) => ({ id, nr, titel: t }));
    const html = kopf(s, ["inhalte/spezies/_gemeinsam/medien-player.css"]) + hero(s, s.text) + reiter(s) +
        `            <div class="li-layout">
                <div class="li-inhalt">
                    <section class="li-panel li-block li-medien-galerie" id="bilder" aria-labelledby="bilder-titel">
                        <h2 class="li-h2" id="bilder-titel">Bildgalerie <small>${ALLE.length} Bilder</small></h2>
                        <div class="li-medien-raster">
                            <figure class="li-medien-feature">
                                <button type="button" class="feature-open" aria-label="Motiv im Vollbild öffnen"><img src="${rel(f, bild(ALLE[start]))}" alt="${esc(name(ALLE[start]))}" decoding="async"></button>
                                <figcaption class="li-medien-steuerung"><button class="control" type="button" data-preview="-1" aria-label="Vorheriges Motiv">←</button><output aria-live="polite"></output><button class="control" type="button" data-preview="1" aria-label="Nächstes Motiv">→</button></figcaption>
                            </figure>
                            <div class="li-medien-seite">
                                <div class="li-medien-vorschau">
${vorschau.map((i) => `                                    <button type="button" data-gallery-index="${i}" aria-label="${esc(name(ALLE[i]))} auswählen"><img src="${rel(f, bild(ALLE[i]))}" alt="" loading="lazy" decoding="async"></button>`).join("\n")}
                                </div>
                                <label>Alle ${ALLE.length} Bilder
                                    <select data-gallery-select data-start="${start}">
${ALLE.map((x) => `                                        <option value="${rel(f, bild(x))}">${esc(name(x))}</option>`).join("\n")}
                                    </select>
                                </label>
                            </div>
                        </div>
                    </section>
                    <section class="li-panel li-block li-medien-bereich" id="bewegtbild"><h2 class="li-h2">Animationen und Video</h2>
                        <article class="li-panel media-player-card" data-kind="video" data-key="${KEY}.videos.animationen"><h3>Animationen</h3><p class="media-status" role="status">Medien werden geladen …</p></article>
                        <article class="li-panel media-player-card" data-kind="video" data-key="${KEY}.videos.videos"><h3>Videos</h3><p class="media-status" role="status">Medien werden geladen …</p></article>
                    </section>
                    <section class="li-panel li-block li-medien-bereich" id="audio"><h2 class="li-h2">Audio</h2>
                        <article class="li-panel media-player-card" data-kind="audio" data-key="${KEY}.audio.kommunikation"><h3>Kommunikation</h3><p class="media-status" role="status">Medien werden geladen …</p></article>
                        <article class="li-panel media-player-card" data-kind="audio" data-key="${KEY}.audio.koerpergeraeusche"><h3>Körpergeräusche</h3><p class="media-status" role="status">Medien werden geladen …</p></article>
                        <article class="li-panel media-player-card" data-kind="audio" data-key="${KEY}.audio.hintergrundmusik"><h3>Hintergrundmusik</h3><p class="media-status" role="status">Medien werden geladen …</p></article>
                    </section>
                    <section class="li-panel li-block li-medien-bereich" id="ansicht" data-turntable="${KEY}.rundum" data-model="${KEY}.modell"><h2 class="li-h2">3D-Modelle und 360°-Ansicht</h2>
                        <p class="media-status" role="status">Modellansicht in Vorbereitung.</p>
                        <img src="${rel(f, bild("lithoiden_designA1.png"))}" alt="Lithoid – Konzeptbild" loading="lazy" decoding="async">
                    </section>
                    <section class="li-panel li-block li-medien-bereich asset-catalog" id="assetverkauf" data-asset-catalog="${KEY}"><h2 class="li-h2">Digitale Assets</h2><p role="status">In Vorbereitung.</p></section>
                    <section class="li-panel li-block" id="medienplan">
                        ${titel("Geplante Medien", "Medienarchiv · Entwurf")}
                        <p class="li-offen">Die vorhandenen Bilder sind Konzeptbilder. Die folgenden Medien sind im Infomaterial geplant, aber noch nicht produziert.</p>
                        ${daten.medien.kopf}
                    </section>
${md.map(karte).join("\n")}
                    ${verknuepfungen(s)}
                    ${quelle(s.quelle)}
                    ${blaettern(s)}
                </div>
                ${sprung(liste)}
            </div>
` + fuss();
    write(f, html);
    seitenDateien(s);
}

// ---------- Hauptseite (nach der Designvorlage „APORIA Weltenarchiv: Lithoiden“) ----------
{
    const s = S_.hauptseite, f = s.file;
    const al = daten.allgemeines, bi = daten.biologie, en = daten.entwicklung, hw = daten.heimatwelt, ge = daten.gesellschaft, po = daten.politik, gs = daten.geschichte, gp = daten.gameplay;
    const kopfFakt = (label) => (al.kopf.match(new RegExp(`<dt>${label}</dt><dd>(.*?)</dd>`)) ?? [])[1] ?? "Noch nicht ausgearbeitet";
    const grund = finde(al, "Körperliche Grunddaten").html;
    const zeile = (label) => (grund.match(new RegExp(`<td>${label}</td><td>(.*?)</td>`)) ?? [])[1] ?? "Noch nicht ausgearbeitet";
    const erscheinung = finde(al, "Äußere Erscheinung");
    const phasen = [...finde(en, "Evolutionäre Hauptphasen").html.matchAll(/<h3>(.*?)<\/h3>/g)].map((m) => m[1]);
    const nhemara = finde(hw, "Planetare Identität").html.match(/<dl class="li-fakten">[\s\S]*?<\/dl>/)?.[0] ?? "";
    const regionen = [...finde(hw, "Geografische Hauptregionen").html.matchAll(/<h3>(.*?)<\/h3>/g)].map((m) => m[1]);
    const institutionen = [...finde(po, "Politische Institutionen").html.matchAll(/<h3>(.*?)<\/h3>/g)].map((m) => m[1]);
    const chrono = finde(gs, "Chronologischer Überblick");
    const missionen = gp.filter((k) => /^Missions+–/.test(k.titel)).map((k) => k.titel);
    const P = (k) => rel(f, S_[k].file);
    const karteH = (key, t, icon, bildDatei, inhalt, breit = false, extraKlasse = "") => `                    <article class="li-panel li-ueber${breit ? " li-ueber--breit" : ""} ${extraKlasse}">
                        <h3 class="li-ueber-titel"><span class="li-icon" aria-hidden="true">${icon}</span>${t}</h3>
                        <div class="li-ueber-inhalt">
                            ${bildDatei ? `<img src="${rel(f, bild(bildDatei))}" alt="" loading="lazy" decoding="async">` : ""}
                            <div class="li-ueber-text">${inhalt}</div>
                        </div>
                        <a class="li-mehr" href="${P(key)}" data-route="${ROUTE(S_[key])}">Zum Hauptreiter ${esc(S_[key].label)} →</a>
                    </article>`;
    const kurz = (k, n = 1) => absaetze(k, n);
    const html = kopf(s) +
        `            <header class="li-hero">
                <img class="li-hero-bild" src="${rel(f, bild(HERO))}" alt="Ein Lithoid an den Quellterrassen von Nhemara" fetchpriority="high" decoding="async">
                <span class="li-glanz" aria-hidden="true"></span>
                <div class="li-hero-text">
                    ${pfad(s)}
                    <h1>Lithoiden</h1>
                    <p class="li-unterzeile">${esc(kopfFakt("Klassifikation"))} – ${esc(kopfFakt("Lebensform"))}</p>
                    ${absaetze(finde(al, "Allgemeine Beschreibung"), 1).replace("<p>", '<p class="li-intro">')}
                </div>
                <dl class="li-chips">
                    <div><dt>Klassifikation</dt><dd>${kopfFakt("Klassifikation")}</dd></div>
                    <div><dt>Lebensform</dt><dd>${kopfFakt("Lebensform")}</dd></div>
                    <div><dt>Heimatwelt</dt><dd>${kopfFakt("Heimatwelt")}</dd></div>
                    <div><dt>Lebensdauer</dt><dd>${zeile("Lebensdauer")}</dd></div>
                </dl>
            </header>
` + reiter(s) +
        `            <div class="li-ueberblick-kopf">
                <h2 class="li-h2"><span class="li-icon" aria-hidden="true">◆</span>Überblick <small>Die Lithoiden im Weltenarchiv</small></h2>
                <a class="li-knopf" href="${P("allgemeines")}" data-route="spezies-biological-6-allgemeines">Spezies-Referenz</a>
            </div>
            <div class="li-ueber-raster">
${karteH("allgemeines", "Steckbrief", "ⓘ", "Lithoid_ Mineralische Lebensform-1.png", `<dl class="li-fakten"><div><dt>Bezeichnung</dt><dd>${kopfFakt("Spezies")}</dd></div><div><dt>Klassifikation</dt><dd>${kopfFakt("Klassifikation")}</dd></div><div><dt>Lebensform</dt><dd>${kopfFakt("Lebensform")}</dd></div><div><dt>Heimatwelt</dt><dd>${kopfFakt("Heimatwelt")}</dd></div><div><dt>Körperlänge</dt><dd>${zeile("Erwachsene Körperlänge")}</dd></div><div><dt>Körperhöhe</dt><dd>${zeile("Körperhöhe")}</dd></div><div><dt>Lebensdauer</dt><dd>${zeile("Lebensdauer")}</dd></div><div><dt>Geschlechter</dt><dd>${zeile("Geschlechter")}</dd></div></dl>`)}
${karteH("biologie", "Körperbau", "⟡", "lithoiden_designA1.png", `<ul>${(erscheinung.html.match(/<p>.*?<\/p>/g) ?? []).slice(0, 4).map((p) => "<li>" + p.replace(/<\/?p>/g, "") + "</li>").join("")}</ul>`)}
${karteH("biologie", "Stoffwechsel", "⟳", "Kristallbesetztes Lithoidenwesen-3.png", kurz(finde(bi, "Stoffwechsel"), 2))}
${karteH("entwicklung", "Entwicklung", "⤳", "", `${kurz(finde(en, "Grundlegende Evolution"), 1)}<ol class="li-phasen">${phasen.map((p) => `<li>${p}</li>`).join("")}</ol>`)}
${karteH("heimatwelt", "Heimatwelt Nhemara", "◭", "lithoiden_designA2.png", `${nhemara}<p class="li-regionen">${regionen.join(" · ")}</p>`)}
${karteH("gesellschaft", "Gesellschaft – Lagenverbände", "⁂", "Kristallbestie am Dampfbecken-2.png", kurz(finde(ge, "Familien und Lagenverbände"), 2))}
${karteH("politik", "Politik – Bund der Quellbecken", "⚖", "Kristallrat der steinernen Weisen.png", `${kurz(finde(po, "Der Bund der Quellbecken"), 1)}<ul class="li-tags">${institutionen.map((x) => `<li>${x}</li>`).join("")}</ul>`)}
${karteH("geschichte", "Geschichte – Quellkrisen", "⧗", "Kristallbestie im leuchtenden Höhlendom-4.png", `${kurz(finde(gs, "Die großen Quellkrisen"), 1)}<div class="li-chrono">${chrono.html}</div>`)}
${karteH("gameplay", "Spielintegration", "◈", HERO, `${kurz(finde(gp, "Grundlegende Spielrolle"), 2)}<p class="li-kicker">Missionen</p><ul>${missionen.map((m) => `<li>${esc(m)}</li>`).join("")}</ul>`, true)}
            </div>
            <section class="li-panel li-block li-medienleiste" id="medien" data-li-galerie>
                <div class="li-medienleiste-kopf">
                    ${titel("Medien", "", "▣")}
                    <div class="li-filter" role="group" aria-label="Medien filtern">
                        <button type="button" aria-pressed="true" data-filter="">Alle</button>
${[...new Set(ALLE.map(KATEGORIE))].map((k) => `                        <button type="button" aria-pressed="false" data-filter="${esc(k)}">${esc(k)}</button>`).join("\n")}
                    </div>
                </div>
                <div class="li-medienleiste-raster">
${ALLE.map((b) => `                    <button type="button" class="li-kachel" data-kategorie="${esc(KATEGORIE(b))}"><img src="${rel(f, bild(b))}" alt="${esc(name(b))}" loading="lazy" decoding="async"><span>${esc(KATEGORIE(b))} – ${esc(name(b))}</span></button>`).join("\n")}
                </div>
                <a class="li-mehr" href="${P("medien")}" data-route="spezies-biological-6-medien">Zum Medienarchiv →</a>
            </section>
            <div class="li-layout li-layout--fuss">
                <div class="li-inhalt">
                    <section class="li-panel li-block">${titel(finde(al, "Bedeutung innerhalb von APORIA").titel, "", "◆")}${finde(al, "Bedeutung innerhalb von APORIA").html}</section>
                    ${verknuepfungen(s)}
                    ${quelle("Allgemeines · Biologie · Entwicklung · Heimatwelt · Gesellschaft · Politik · Geschichte · Spielintegration")}
                </div>
            </div>
` + fuss();
    write(f, html);
}
console.log("fertig:", SEITEN.length, "Seiten");
