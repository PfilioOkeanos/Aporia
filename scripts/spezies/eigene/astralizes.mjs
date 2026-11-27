// Spezies-Baukasten · eigenes Bauskript: Astralizes – „Das Haus der Unergründlichen“
// Jede Seite ist ein eigener Ausstellungssaal mit eigener Gestaltung (eigene HTML/CSS/JS je Seite, gemeinsame Basis).
// Texte wörtlich aus Info_material/…/Astralizes (Saaltexte), Werke aus assets/…/Astralizes:
//   vorschau/   – verkleinerte JPEGs (Galerie, Hintergründe, Animationen)
//   gestaltung/ – aus den Werken geschnittene Gestaltungselemente (Emblem, Krone, Iris, Horizont …)
//   gesamtdarstellung/, hauptseite/ – unveränderte Originale (Großansicht, Saal XI · Archiv)
// Neue Bilder: Vorschau anlegen (siehe README im Spezies-Baukasten) und Skript erneut ausführen.
// Aufruf: node scripts/spezies/eigene/astralizes.mjs   (oder npm run spezies -- Astralizes)
import fs from "node:fs";
import path from "node:path";
import { ROOT, esc, rel, write } from "../bibliothek.mjs";

const S = "inhalte/spezies/Biologische Spezies/Astralizes";
const INFO = "Info_material/Alle_spezies_daten/Biologische Spezies/Astralizes";
const A = "assets/bilder/Alle Spezies+Übersicht/Biologische Spezies/Astralizes";
const R0 = "spezies-biological-4";
const UEBERSICHT = "inhalte/spezies/Biologische Spezies/Übersichtsseite biologische spezies";

// ---------- Werke ----------
const jpegMasse = (datei) => {
    const b = fs.readFileSync(datei);
    for (let i = 2; i < b.length;) {
        if (b[i] !== 0xff) { i++; continue; }
        const m = b[i + 1], len = b.readUInt16BE(i + 2);
        if (m >= 0xc0 && m <= 0xc3) return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
        i += 2 + len;
    }
    return { w: 16, h: 9 };
};
const titelVon = (n) => n.replace(/-\d+$/, "").replace(/_ /g, ": ").replace(/_/g, " ").trim();
const VOR = path.join(ROOT, A, "vorschau");
const WERKE = fs.readdirSync(VOR).filter((f) => f.endsWith(".jpg")).sort((a, b) => titelVon(a).localeCompare(titelVon(b), "de"))
    .map((f, i) => {
        const n = f.replace(/\.jpg$/, "");
        const orig = ["gesamtdarstellung", "hauptseite"].map((o) => `${A}/${o}/${n}.png`).find((p) => fs.existsSync(path.join(ROOT, p)));
        return { n, titel: titelVon(n), inv: "AST-" + String(i + 1).padStart(3, "0"), vor: `${A}/vorschau/${f}`, orig: orig ?? `${A}/vorschau/${f}`, ...jpegMasse(path.join(VOR, f)) };
    });
const G = (d) => `${A}/gestaltung/${d}`;
const werk = (teil) => WERKE.find((w) => w.n.startsWith(teil)) ?? WERKE[0];

// ---------- Säle ----------
const SAELE = [
    { key: "foyer", nr: "0", titel: "Die Schwelle", unter: "Foyer", datei: "hauptseite/Spezies.html", route: R0 },
    { key: "allgemeines", nr: "I", titel: "Die wandernde Verzerrung", unter: "Allgemeines", datei: "Unterseiten/Allgemeines/allgemeines.html", route: R0 + "-allgemeines", info: "Allgemeines/Allgemeines.md", regel: /Raumzeit|Grenze|Saum|Rand des/, motiv: "Astralwesen an der Raumzeitgrenze-1" },
    { key: "biologie", nr: "II", titel: "Lichtbrechung", unter: "Biologie", datei: "Unterseiten/Biologie/biologie.html", route: R0 + "-biologie", info: "Biologie/Biologie.md", regel: /Schale|Membran|Transluz|Transparent|Schicht|Seide|Mantel|Tuch|Eis|Kristall|Tropfen|Rochen/, motiv: "Astraler Rochen" },
    { key: "entwicklung", nr: "III", titel: "Verzweigung", unter: "Entwicklung", datei: "Unterseiten/Entwicklung/entwicklung.html", route: R0 + "-entwicklung", info: "02_Geschichte_Entwicklung/entwicklung.md", regel: /Lebensalter|Samen|Spiral|Wirbelsäule|Knochen|Sichel|Feder|Holz|Wurzel|Wald/, motiv: "Vier Lebensalter" },
    { key: "heimatwelt", nr: "IV", titel: "Dämmerung", unter: "Heimatwelt", datei: "Unterseiten/Heimatwelt/heimatwelt.html", route: R0 + "-heimatwelt", info: "05_Heimatwelt/heimatwelt-referenz.md", regel: /Wüste|Salz|Horizont|Himmel|Sonnenaufgang|Landschaft|Basalt|Meer|Archipel|Gezeiten|Skyline|Wasserfall|Finsternis/, motiv: "Das Auge der wandernden Finsternis" },
    { key: "gesellschaft", nr: "V", titel: "Der gemeinsame Blickwinkel", unter: "Gesellschaft", datei: "Unterseiten/Gesellschaft/gesellschaft.html", route: R0 + "-gesellschaft", info: "03_Gesellschaft_Kultur/gesellschaft.md", regel: /Auge|Blick|Gesicht|Profil|Orakel|Zeuge|Ohren/, motiv: "Das Universum zwischen sechs Händen" },
    { key: "politik", nr: "VI", titel: "Zwei Zeugen", unter: "Politik", datei: "Unterseiten/Politik/politik.html", route: R0 + "-politik", info: "04_Politik_Fraktionsbeziehungen/politik.md", regel: /zwei|Zwei|Doppel|Hälften|Scharnier|Dreifach|Gegen|Spiegel|Doppelgänger/, motiv: "Zwischen den Hälften des Universums" },
    { key: "geschichte", nr: "VII", titel: "Bildpaare", unter: "Geschichte", datei: "Unterseiten/Geschichte/geschichte.html", route: R0 + "-geschichte", info: "02_Geschichte_Entwicklung/geschichte.md", regel: /Aporia|Königin|Wächter|Riese|Koloss|Palast|Labyrinth|Observatorium|Zeit|Augenblick/, motiv: "Aporia, die Delle" },
    { key: "gameplay", nr: "VIII", titel: "Zwei Aussichtsplattformen", unter: "Spielintegration", datei: "Gameplay/gameplay.html", route: R0 + "-gameplay", info: "Gameplay/Gameplay.md", regel: /Bühne|Zug|Fenster|Begegnung|Spur|Fuß|Schwarzes Dreieck|Wanderer|Läufer/, motiv: "Schwarzes Dreieck" },
    { key: "forschung", nr: "IX", titel: "Parallaxe", unter: "Forschung", datei: "Forschung/forschung.html", route: R0 + "-forschung", info: "Forschung/Forschung.md", regel: /Linse|Licht|Schatten|Silhouette|Bogen|gekrümmt|gefaltet|Falte|Sonnenspiegel/, motiv: "Das Auge jenseits des Universums" },
    { key: "technologien", nr: "X", titel: "Beobachtungsstationen", unter: "Technologien", datei: "Unterseiten/Technologien/technologien.html", route: R0 + "-technologien", info: "technologien/Technologien.md", regel: /Bronze|Stahl|Orgel|Keramik|Metall|Kiefer|Klaue|Hand|Faust|Handgelenk|Maschine/, motiv: "Bronzene Intelligenz" },
    { key: "medien", nr: "XI", titel: "Das Archiv", unter: "Medien", datei: "Unterseiten/Medien/medien.html", route: R0 + "-medien", motiv: "Das Gesicht hinter dem Himmelsladen" },
];
const SAAL = Object.fromEntries(SAELE.map((s) => [s.key, s]));
const VERTEIL = SAELE.filter((s) => s.regel);
const MAX = Math.ceil(WERKE.length / VERTEIL.length) + 2;
for (const s of VERTEIL) s.werke = [];
for (const w of WERKE) {
    const s = VERTEIL.find((x) => x.regel.test(w.titel) && x.werke.length < MAX) ?? [...VERTEIL].sort((a, b) => a.werke.length - b.werke.length)[0];
    s.werke.push(w); w.saal = s;
}
// Leitmotiv jedes Saals an den Anfang
for (const s of VERTEIL) { const m = s.werke.find((w) => w.n.startsWith(s.motiv)); if (m) s.werke = [m, ...s.werke.filter((w) => w !== m)]; }
for (const s of SAELE) s.bild = (s.werke?.[0] ?? werk(s.motiv ?? "Das Universum")).vor;

// ---------- Saaltexte (wörtlich aus dem Infomaterial) ----------
const md = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
function saaltext(datei) {
    if (!datei) return "";
    const zeilen = fs.readFileSync(path.join(ROOT, INFO, datei), "utf8").replace(/\r/g, "").split("\n");
    const out = [];
    for (const z of zeilen) {
        const l = z.trim();
        if (!l || /^#\s/.test(l)) continue;
        const h = l.match(/^#{2,}\s+(.+)$/);
        out.push(h ? `<h3>${md(h[1])}</h3>` : `<p>${md(l)}</p>`);
    }
    return out.join("\n");
}

// ---------- Bausteine ----------
const bild = (von, p) => rel(von, p);
const werkHtml = (w, von, extra = "", stil = "", attr = "") => `<figure class="az-werk ${extra}" style="${stil}--ar:${w.w}/${w.h};--bild:url('${bild(von, w.vor)}')"${attr}>
<button type="button" class="az-werk-bild" data-gross="${bild(von, w.orig)}" data-titel="${esc(w.titel)}" data-inv="${w.inv}" aria-label="${esc(w.titel)} in Großansicht öffnen"><img src="${bild(von, w.vor)}" alt="${esc(w.titel)}" width="${w.w}" height="${w.h}" loading="lazy" decoding="async"></button>
<figcaption class="az-schild"><span class="az-inv">${w.inv}</span><strong>${esc(w.titel)}</strong><span>Saal ${w.saal?.nr ?? "–"} · ${esc(w.saal?.titel ?? "")}</span></figcaption></figure>`;

function saalplan(von, aktiv) {
    return `<nav class="az-saalplan" aria-label="Saalplan der Ausstellung"><a class="az-saalplan-titel" href="${rel(von, `${S}/hauptseite/Spezies.html`)}" data-route="${R0}"><img src="${bild(von, G("emblem-sphaere.jpg"))}" alt="" width="40" height="40"><span>Astralizes</span></a>
<ol>${SAELE.map((s) => `<li><a href="${rel(von, `${S}/${s.datei}`)}" data-route="${s.route}"${s.key === aktiv ? ' aria-current="page"' : ""} style="--saalbild:url('${bild(von, s.bild)}')"><b>${s.nr}</b><span>${esc(s.unter)}</span></a></li>`).join("")}</ol></nav>`;
}

function durchgang(von, s) {
    const i = SAELE.indexOf(s), n = SAELE[(i + 1) % SAELE.length];
    return `<a class="az-durchgang" href="${rel(von, `${S}/${n.datei}`)}" data-route="${n.route}" style="--saalbild:url('${bild(von, n.bild)}')"><span class="az-kicker">Weiter · Saal ${n.nr}</span><strong>${esc(n.titel)}</strong><span>${esc(n.unter)} →</span></a>`;
}

const wandtext = (s) => s.info ? `<section class="az-wandtext" aria-label="Saaltext"><p class="az-kicker">Saaltext · Saal ${s.nr}</p>${saaltext(s.info)}<p class="az-quelle">Quelle: Info_material · Astralizes · ${esc(s.info)}</p></section>` : "";

function seite(s, koerper) {
    const von = `${S}/${s.datei}`;
    const basis = (d) => rel(von, `${S}/${d}`);
    const dateiname = path.posix.basename(s.datei).replace(/\.html$/, "");
    return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#000000">
<meta name="description" content="Astralizes · Saal ${s.nr} · ${esc(s.titel)} – Ausstellung „Das Haus der Unergründlichen“ im APORIA-Weltenarchiv.">
<title>${s.key === "foyer" ? "Astralizes · Das Haus der Unergründlichen" : `Saal ${s.nr} · ${s.titel} · Astralizes`} · APORIA</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,500;1,300&family=Space+Grotesk:wght@300;500&display=swap">
<link rel="stylesheet" href="${rel(von, "Menüs/TopBar/Top_bar.css")}">
<link rel="stylesheet" href="${basis("astralizes-basis.css")}">
<link rel="stylesheet" href="${dateiname}.css">
<script type="module" src="${dateiname}.js"></script>
</head>
<body class="az az-saal-${s.key}" data-section="spezies" data-page="${s.route}">
<div data-aporia-topbar></div>
<main class="az-main" id="inhalt">
${saalplan(von, s.key)}
${koerper(von)}
${s.key !== "medien" ? durchgang(von, s) : ""}
<dialog class="az-gross" aria-label="Werk in Großansicht"><figure><img alt=""><figcaption><span class="az-inv"></span><strong></strong><a target="_blank" rel="noopener">Original öffnen ↗</a></figcaption></figure><form method="dialog"><button class="az-zu" aria-label="Schließen">×</button></form><button type="button" class="az-blaettern" data-schritt="-1" aria-label="Vorheriges Werk">←</button><button type="button" class="az-blaettern" data-schritt="1" aria-label="Nächstes Werk">→</button></dialog>
</main>
</body>
</html>
`;
}

// ---------- Säle: Inhalt ----------
const kopf = (s, extra = "") => `<p class="az-kicker">Saal ${s.nr} · ${esc(s.unter)}</p><h1>${esc(s.titel)}</h1>${extra}`;
const W = (s, n) => s.werke.slice(0, n);

const INHALT = {
    foyer: (von) => {
        const s = SAAL.foyer;
        const reigen = [werk("Das Universum zwischen"), werk("Aporia, die Delle"), werk("Astraler Rochen"), werk("Das Auge jenseits"), werk("Schwarzes Dreieck"), werk("Aporias sieben Ohren")];
        const prozession = WERKE.filter((_, i) => i % 5 === 0);
        return `<header class="az-foyer">
<div class="az-reigen" aria-hidden="true">${reigen.map((w, i) => `<span style="--bild:url('${bild(von, w.vor)}');--i:${i}"></span>`).join("")}</div>
<div class="az-linse" aria-hidden="true"></div>
<div class="az-foyer-mitte">
  <div class="az-emblem" aria-hidden="true"><img class="az-krone" src="${bild(von, G("krone.jpg"))}" alt=""><img class="az-sphaere" src="${bild(von, G("emblem-sphaere.jpg"))}" alt=""></div>
  <p class="az-kicker">APORIA · Biologische Spezies · eine Ausstellung in zwölf Sälen</p>
  <h1 class="az-titel" style="--bild:url('${bild(von, G("delle.jpg"))}')">Astralizes</h1>
  <p class="az-motto">Das Haus der Unergründlichen</p>
  <p class="az-foyer-text">Kein Dossier beschreibt die Astralizes vollständig. Diese Ausstellung zeigt, was Beobachter festhalten konnten: Konturen, Verdopplungen, wandernde Lichtsäume – ${WERKE.length} Werke in elf Sälen.</p>
  <a class="az-eintritt" href="${rel(von, `${S}/${SAAL.allgemeines.datei}`)}" data-route="${SAAL.allgemeines.route}">Ausstellung betreten</a>
</div>
</header>
<section class="az-plan" aria-labelledby="az-plan-t"><h2 id="az-plan-t" class="az-kicker">Saalplan</h2>
<div class="az-plan-raster">${SAELE.slice(1).map((x, i) => `<a class="az-plan-saal" href="${rel(von, `${S}/${x.datei}`)}" data-route="${x.route}" style="--saalbild:url('${bild(von, x.bild)}');--i:${i}"><b>${x.nr}</b><strong>${esc(x.titel)}</strong><span>${esc(x.unter)}${x.werke ? ` · ${x.werke.length} Werke` : ` · ${WERKE.length} Originale`}</span></a>`).join("")}</div></section>
<section class="az-prozession" aria-label="Prozession der Werke"><div class="az-prozession-band">${[...prozession, ...prozession].map((w, i) => `<button type="button" class="az-werk-bild" data-gross="${bild(von, w.orig)}" data-titel="${esc(w.titel)}" data-inv="${w.inv}" ${i >= prozession.length ? 'tabindex="-1" aria-hidden="true"' : `aria-label="${esc(w.titel)} in Großansicht öffnen"`}><img src="${bild(von, w.vor)}" alt="" loading="lazy" decoding="async"></button>`).join("")}</div></section>`;
    },
    allgemeines: (von) => { const s = SAAL.allgemeines; return `<header class="az-kopf az-weiss-kopf">${kopf(s)}<p class="az-wort" style="--bild:url('${bild(von, s.bild)}')" aria-hidden="true"><span>VERZERRUNG</span><span>VERZERRUNG</span></p></header>
${wandtext(s)}<section class="az-wand" aria-label="Werke im Saal">${s.werke.map((w, i) => werkHtml(w, von, i % 3 === 0 ? "az-gross-werk" : "")).join("\n")}</section>`; },
    biologie: (von) => { const s = SAAL.biologie; return `<header class="az-kopf az-prisma-kopf" style="--bild:url('${bild(von, G("rochen.jpg"))}')"><div class="az-prisma" aria-hidden="true"><i></i><i></i><i></i></div><div class="az-kopf-text">${kopf(s)}</div></header>
${wandtext(s)}<section class="az-facetten" aria-label="Werke im Saal">${s.werke.map((w) => werkHtml(w, von)).join("\n")}</section>`; },
    entwicklung: (von) => { const s = SAAL.entwicklung; return `<header class="az-kopf az-zweig-kopf" style="--bild:url('${bild(von, G("filament.jpg"))}')">${kopf(s)}</header>
${wandtext(s)}<section class="az-stamm" aria-label="Werke im Saal">${s.werke.map((w, i) => werkHtml(w, von, "az-ast", `--stufe:${i};`)).join("\n")}</section>`; },
    heimatwelt: (von) => { const s = SAAL.heimatwelt; return `<header class="az-kopf az-daemmer-kopf" style="--bild:url('${bild(von, G("lichtsaum.jpg"))}')">${kopf(s)}<span class="az-saum" aria-hidden="true"></span></header>
${wandtext(s)}<p class="az-kicker az-panorama-hinweis" aria-hidden="true">← Panorama · waagerecht blättern →</p><section class="az-panorama" aria-label="Werke im Saal – waagerecht scrollen" tabindex="0"><div class="az-panorama-band">${s.werke.map((w) => werkHtml(w, von)).join("\n")}</div></section>
<div class="az-silhouette" style="--bild:url('${bild(von, G("horizont.jpg"))}')" aria-hidden="true"></div>`; },
    gesellschaft: (von) => { const s = SAAL.gesellschaft; return `<header class="az-kopf az-hell-kopf">${kopf(s)}<div class="az-zeichen" aria-hidden="true">${Array.from({ length: 28 }, (_, i) => `<i style="--i:${i}"></i>`).join("")}</div></header>
${wandtext(s)}<section class="az-kreis" aria-label="Werke im Saal"><div class="az-kreis-mitte" style="--bild:url('${bild(von, G("emblem-sphaere.jpg"))}')" aria-hidden="true"></div>${s.werke.map((w) => werkHtml(w, von)).join("\n")}</section>`; },
    politik: (von) => { const s = SAAL.politik; const paare = []; for (let i = 0; i < s.werke.length; i += 2) paare.push(s.werke.slice(i, i + 2)); return `<header class="az-kopf az-naht-kopf" style="--bild:url('${bild(von, G("ohren.jpg"))}')"><div class="az-haelfte" aria-hidden="true"></div><div class="az-haelfte az-haelfte--b" aria-hidden="true"></div><div class="az-kopf-text">${kopf(s)}</div></header>
${wandtext(s)}<section class="az-diptychen" aria-label="Werke im Saal">${paare.map((p, i) => `<div class="az-diptychon"><p class="az-kicker">Vereinbarung ${String(i + 1).padStart(2, "0")}</p><div class="az-zeugen">${p.map((w, j) => `<div class="az-zeuge"><span class="az-zeuge-name">Zeuge ${j ? "B" : "A"}</span>${werkHtml(w, von)}</div>`).join("")}</div></div>`).join("\n")}</section>`; },
    geschichte: (von) => { const s = SAAL.geschichte; const paare = []; for (let i = 0; i < s.werke.length; i += 2) paare.push(s.werke.slice(i, i + 2)); return `<header class="az-kopf az-platten-kopf" style="--bild:url('${bild(von, s.bild)}')">${kopf(s, `<button type="button" class="az-blink-knopf" aria-pressed="true">Blinkvergleich läuft</button>`)}</header>
${wandtext(s)}<section class="az-platten" aria-label="Werke im Saal">${paare.map((p, i) => `<div class="az-platte${p.length < 2 ? " az-platte--einzeln" : ""}"><p class="az-plattennr">Platte ${String(i + 1).padStart(2, "0")} · ${p.map((w) => w.inv).join(" / ")}</p><div class="az-blink">${p.map((w) => werkHtml(w, von)).join("")}</div></div>`).join("\n")}</section>`; },
    gameplay: (von) => { const s = SAAL.gameplay; return `<header class="az-kopf az-hud-kopf" style="--bild:url('${bild(von, s.bild)}')"><svg class="az-peilung" aria-hidden="true"><line class="az-peil-a"/><line class="az-peil-b"/><circle class="az-peil-ziel" r="18"/></svg><span class="az-plattform az-plattform--a" aria-hidden="true">Plattform A</span><span class="az-plattform az-plattform--b" aria-hidden="true">Plattform B</span><div class="az-kopf-text">${kopf(s)}<output class="az-koordinate" aria-live="off">—</output></div></header>
${wandtext(s)}<section class="az-ziele" aria-label="Werke im Saal">${s.werke.map((w) => werkHtml(w, von)).join("\n")}</section>`; },
    forschung: (von) => { const s = SAAL.forschung; return `<header class="az-kopf az-labor-kopf" style="--bild:url('${bild(von, G("iris.jpg"))}')"><span class="az-scan" aria-hidden="true"></span><div class="az-kopf-text">${kopf(s)}</div></header>
${wandtext(s)}<section class="az-stereo" aria-label="Werke im Saal">${s.werke.map((w) => werkHtml(w, von)).join("\n")}</section>`; },
    technologien: (von) => { const s = SAAL.technologien; return `<header class="az-kopf az-blau-kopf" style="--bild:url('${bild(von, G("haende.jpg"))}')"><div class="az-kopf-text">${kopf(s)}</div></header>
${wandtext(s)}<section class="az-protokolle" aria-label="Werke im Saal">${s.werke.map((w) => `<div class="az-protokoll">${werkHtml(w, von)}<dl><div><dt>Inventar</dt><dd>${w.inv}</dd></div><div><dt>Blickrichtung</dt><dd>nicht erfasst</dd></div><div><dt>Zeitpunkt</dt><dd>nicht erfasst</dd></div><div><dt>Format</dt><dd>${w.w > w.h * 1.15 ? "Querformat" : w.h > w.w * 1.15 ? "Hochformat" : "Quadrat"}</dd></div></dl></div>`).join("\n")}</section>`; },
    medien: (von) => { const s = SAAL.medien; return `<header class="az-kopf az-salon-kopf">${kopf(s, `<p class="az-unterzeile">Alle ${WERKE.length} Werke der Ausstellung in voller Auflösung – unverändert, so wie sie aufgenommen wurden.</p>`)}</header>
<div class="az-filter" role="group" aria-label="Nach Saal filtern"><button type="button" data-saal="" aria-pressed="true">Alle <small>${WERKE.length}</small></button>${VERTEIL.map((x) => `<button type="button" data-saal="${x.key}" aria-pressed="false">${x.nr} · ${esc(x.unter)} <small>${x.werke.length}</small></button>`).join("")}</div>
<section class="az-salon" aria-label="Alle Werke">${WERKE.map((w) => werkHtml(w, von, "az-salon-werk", "", ` data-saal="${w.saal.key}"`)).join("\n")}</section>`; },
};

// ---------- gemeinsame Gestaltung ----------
const BASIS_CSS = `/* Astralizes · Das Haus der Unergründlichen – gemeinsame Basis (erzeugt von scripts/spezies/eigene/astralizes.mjs) */
.az { --az-schwarz: #030304; --az-tief: #0b0a0f; --az-perl: #ece6dc; --az-gold: #d9b878; --az-blut: #9b1d2a; --az-violett: #6c4aa8; --az-leise: #9a93a3; --az-serif: "Cormorant Garamond", Georgia, serif; --az-grotesk: "Space Grotesk", system-ui, sans-serif;
  margin: 0; background: var(--az-schwarz); color: var(--az-perl); font-family: var(--az-grotesk); font-weight: 300; letter-spacing: .01em; }
.az * { box-sizing: border-box; }
.az-main { min-width: 0; overflow-x: clip; position: relative; }
.az h1, .az h2, .az h3 { font-family: var(--az-serif); font-weight: 300; margin: 0; }
.az a { color: inherit; }
.az-kicker { font: 500 .72rem/1.4 var(--az-grotesk); letter-spacing: .32em; text-transform: uppercase; color: var(--az-gold); margin: 0 0 .8rem; }
.az-quelle { font-size: .72rem; letter-spacing: .08em; color: var(--az-leise); margin-top: 2rem !important; }
.az-kopf { position: relative; min-height: 62vh; display: grid; align-content: end; padding: clamp(1.5rem, 5vw, 5rem); overflow: hidden; isolation: isolate; }
.az-kopf h1 { font-size: clamp(2.6rem, 7.4vw, 7.6rem); line-height: .95; letter-spacing: -.01em; max-width: 16ch; overflow-wrap: break-word; hyphens: auto; }
.az-kopf-text { position: relative; z-index: 2; }

/* Saalplan */
.az-saalplan { position: sticky; top: var(--aporia-topbar-height, 78px); z-index: 40; display: flex; align-items: center; gap: 1rem; padding: .55rem clamp(1rem, 3vw, 2rem); background: color-mix(in srgb, var(--az-schwarz) 82%, transparent); backdrop-filter: blur(14px) saturate(1.4); border-bottom: 1px solid #ffffff14; }
.az-saalplan-titel { display: flex; align-items: center; gap: .6rem; text-decoration: none; font: 300 1.25rem/1 var(--az-serif); letter-spacing: .18em; text-transform: uppercase; white-space: nowrap; }
.az-saalplan-titel img { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; animation: az-drehen 40s linear infinite; box-shadow: 0 0 18px #d9b87866; }
.az-saalplan ol { display: flex; flex: 1 1 auto; min-width: 0; gap: .15rem; list-style: none; margin: 0; padding: 0; overflow-x: auto; scrollbar-width: thin; scrollbar-color: #d9b87855 transparent; }
.az-saalplan li a { position: relative; display: grid; justify-items: center; white-space: nowrap; padding: .35rem .6rem; border-radius: .5rem; text-decoration: none; overflow: hidden; isolation: isolate; }
.az-saalplan li a::before { content: ""; position: absolute; inset: 0; z-index: -1; background: var(--saalbild) center/cover; opacity: 0; filter: saturate(1.3); transition: opacity .35s; }
.az-saalplan li a:is(:hover, :focus-visible, [aria-current])::before { opacity: .55; }
.az-saalplan li a[aria-current] { box-shadow: inset 0 -2px var(--az-gold); }
.az-saalplan b { font: 500 .95rem/1 var(--az-serif); letter-spacing: .1em; }
.az-saalplan span { font-size: .6rem; letter-spacing: .14em; text-transform: uppercase; color: var(--az-leise); }
.az-saalplan li a:is(:hover, [aria-current]) span { color: var(--az-perl); }

/* Werk + Schild */
.az-werk { margin: 0; position: relative; }
.az-werk-bild { display: block; width: 100%; padding: 0; border: 0; background: #000; cursor: zoom-in; aspect-ratio: var(--ar); overflow: hidden; }
.az-werk-bild img { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s cubic-bezier(.2,.7,.2,1), filter .6s; }
.az-werk-bild:hover img, .az-werk-bild:focus-visible img { transform: scale(1.04); }
.az-schild { display: grid; gap: .15rem; padding: .7rem 0 0; font-size: .78rem; color: var(--az-leise); }
.az-schild strong { font: 400 1.15rem/1.2 var(--az-serif); color: inherit; filter: brightness(1.4); }
.az-inv { font-size: .64rem; letter-spacing: .24em; color: var(--az-gold); }

/* Saaltext */
.az-wandtext { max-width: 46rem; margin: clamp(3rem, 8vw, 7rem) auto; padding: 0 clamp(1rem, 4vw, 2rem); }
.az-wandtext h3 { font-size: clamp(1.6rem, 3vw, 2.4rem); margin: 1.6rem 0 .8rem; }
.az-wandtext p { font: 300 clamp(1.15rem, 2vw, 1.45rem)/1.65 var(--az-serif); margin: 0 0 1rem; }

/* Durchgang zum nächsten Saal */
.az-durchgang { color: #ece6dc; --az-gold: #d9b878; position: relative; display: grid; align-content: center; justify-items: center; gap: .6rem; min-height: 70vh; margin-top: clamp(3rem, 8vw, 8rem); text-align: center; text-decoration: none; overflow: hidden; isolation: isolate; }
.az-durchgang::before { content: ""; position: absolute; inset: -5%; z-index: -2; background: var(--saalbild) center/cover; filter: brightness(.55) saturate(1.2); transition: transform 8s ease-out, filter .8s; }
.az-durchgang::after { content: ""; position: absolute; inset: 0; z-index: -1; background: radial-gradient(ellipse at center, transparent 0 30%, #000 85%); }
.az-durchgang:hover::before { transform: scale(1.08); filter: brightness(.8) saturate(1.4); }
.az-durchgang strong { font: 300 clamp(2.4rem, 7vw, 6rem)/1 var(--az-serif); }
.az-durchgang span:last-child { letter-spacing: .3em; text-transform: uppercase; font-size: .75rem; }

/* Großansicht */
.az-gross { width: 100vw; height: 100vh; max-width: none; max-height: none; margin: 0; padding: 0; border: 0; background: #000e; color: var(--az-perl); }
.az-gross::backdrop { background: #000c; backdrop-filter: blur(6px); }
.az-gross figure { margin: 0; height: 100%; display: grid; grid-template-rows: 1fr auto; place-items: center; padding: 3.5rem 4rem 1.2rem; }
.az-gross img { max-width: 100%; max-height: 100%; object-fit: contain; box-shadow: 0 0 120px #000; }
.az-gross figcaption { display: flex; flex-wrap: wrap; gap: .4rem 1.2rem; align-items: baseline; justify-content: center; padding-top: .8rem; }
.az-gross figcaption strong { font: 400 1.5rem/1.2 var(--az-serif); }
.az-gross figcaption a { color: var(--az-gold); font-size: .8rem; letter-spacing: .1em; }
.az-zu, .az-blaettern { position: absolute; border: 1px solid #ffffff30; background: #0009; color: #fff; width: 3rem; height: 3rem; border-radius: 50%; font-size: 1.4rem; cursor: pointer; }
.az-zu { top: 1rem; right: 1rem; }
.az-blaettern { top: 50%; transform: translateY(-50%); }
.az-blaettern[data-schritt="-1"] { left: 1rem; } .az-blaettern[data-schritt="1"] { right: 1rem; }

@keyframes az-drehen { to { transform: rotate(360deg); } }
@keyframes az-atmen { 50% { transform: scale(1.06); opacity: .85; } }
@media (max-width: 760px) { .az-saalplan-titel span { display: none; } .az-gross figure { padding: 3.5rem .6rem 1rem; } .az-kopf { min-height: 52vh; } }
@media (prefers-reduced-motion: reduce) { .az *, .az *::before, .az *::after { animation-duration: .01s !important; animation-iteration-count: 1 !important; transition: none !important; } }
`;

const BASIS_JS = `// Astralizes · gemeinsames Verhalten (erzeugt von scripts/spezies/eigene/astralizes.mjs)
import "../../../../Men%C3%BCs/TopBar/Top_bar.js";
import { applyAporiaRoutes } from "../../../../Men%C3%BCs/adapter/aporia-routes.js";
import { bewegungReduziert } from "../../../../Menüs/adapter/aporia-bewegung.js";
applyAporiaRoutes(document);

// Großansicht mit Blättern durch alle Werke der Seite
const dialog = document.querySelector(".az-gross");
const knoepfe = [...document.querySelectorAll(".az-werk-bild[data-gross]")].filter((b) => !b.hasAttribute("aria-hidden"));
let aktuell = -1;
const zeigen = (i) => {
    aktuell = (i + knoepfe.length) % knoepfe.length;
    const b = knoepfe[aktuell];
    const img = dialog.querySelector("img");
    img.src = b.querySelector("img").src; // sofort die Vorschau, dann das Original
    const gross = new Image(); gross.onload = () => { if (knoepfe[aktuell] === b) img.src = gross.src; }; gross.src = b.dataset.gross;
    img.alt = b.dataset.titel;
    dialog.querySelector("figcaption strong").textContent = b.dataset.titel;
    dialog.querySelector(".az-inv").textContent = b.dataset.inv;
    dialog.querySelector("figcaption a").href = b.dataset.gross;
};
knoepfe.forEach((b, i) => b.addEventListener("click", () => { zeigen(i); dialog.showModal(); }));
dialog?.querySelectorAll(".az-blaettern").forEach((b) => b.addEventListener("click", () => zeigen(aktuell + Number(b.dataset.schritt))));
dialog?.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") zeigen(aktuell + 1); if (e.key === "ArrowLeft") zeigen(aktuell - 1); });
dialog?.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
export const bewegungErlaubt = !bewegungReduziert.matches;
`;

// ---------- Saalgestaltung (je Seite eigene CSS/JS) ----------
const SAAL_CSS = {
    foyer: `/* Saal 0 · Die Schwelle – schwarzes Foyer, Werke als atmender Reigen, Gravitationslinse folgt dem Blick */
.az-foyer { position: relative; min-height: calc(100vh - 3.5rem); display: grid; place-items: center; overflow: hidden; isolation: isolate; text-align: center; }
.az-reigen span { position: absolute; inset: -6%; z-index: -3; background: var(--bild) center/cover; opacity: 0; filter: blur(2px) brightness(.72) saturate(1.25); animation: az-reigen 48s infinite; animation-delay: calc(var(--i) * 8s); }
@keyframes az-reigen { 0% { opacity: 0; transform: scale(1.12) rotate(-1deg); } 5%, 16% { opacity: 1; } 22%, 100% { opacity: 0; transform: scale(1) rotate(1deg); } }
.az-foyer::after { content: ""; position: absolute; inset: 0; z-index: -2; background: radial-gradient(ellipse at center, transparent 0 25%, #030304 78%), linear-gradient(#0000 60%, #030304); }
.az-linse { position: absolute; z-index: -1; width: 34vmin; aspect-ratio: 1; border-radius: 50%; left: var(--x, 50%); top: var(--y, 40%); translate: -50% -50%; backdrop-filter: brightness(1.8) saturate(1.8) contrast(1.2) blur(1px); box-shadow: 0 0 0 1px #ffffff22, 0 0 60px #d9b87844 inset, 0 0 120px #6c4aa855; opacity: 0; transition: opacity 1.2s, left .9s cubic-bezier(.2,.7,.2,1), top .9s cubic-bezier(.2,.7,.2,1); pointer-events: none; }
.az-foyer.az-aktiv .az-linse { opacity: 1; }
.az-foyer-mitte { position: relative; padding: 2rem 1rem 6rem; max-width: 60rem; }
.az-emblem { position: relative; width: clamp(9rem, 20vw, 14rem); aspect-ratio: 1; margin: 0 auto 1.5rem; }
.az-sphaere { position: absolute; inset: 18%; width: 64%; height: 64%; border-radius: 50%; object-fit: cover; box-shadow: 0 0 60px #b9a6ff88, 0 0 140px #d9b87844; animation: az-drehen 90s linear infinite; }
.az-krone { position: absolute; left: -45%; top: -32%; width: 190%; mix-blend-mode: screen; -webkit-mask: radial-gradient(ellipse at 50% 55%, #000 30%, transparent 70%); mask: radial-gradient(ellipse at 50% 55%, #000 30%, transparent 70%); animation: az-atmen 9s ease-in-out infinite; }
.az-titel { font-size: clamp(2.8rem, 9.5vw, 9rem); line-height: .9; letter-spacing: .05em; text-transform: uppercase; background: var(--bild) 0 50%/180% auto, linear-gradient(90deg, #8f7ad6, #f3e6c8 45%, #9fd8ff); background-blend-mode: screen; -webkit-background-clip: text; background-clip: text; color: transparent; animation: az-titel 30s ease-in-out infinite alternate; filter: drop-shadow(0 0 40px #6c4aa866); }
@keyframes az-titel { to { background-position: 100% 50%; } }
.az-motto { font: italic 300 clamp(1.3rem, 3vw, 2.2rem)/1.2 var(--az-serif); margin: .8rem 0 1.4rem; color: var(--az-gold); }
.az-foyer-text { max-width: 40rem; margin: 0 auto 2rem; font: 300 1.2rem/1.6 var(--az-serif); color: #d9d2e6; }
.az-eintritt { display: inline-block; padding: 1rem 2.6rem; border: 1px solid var(--az-gold); border-radius: 999px; text-decoration: none; letter-spacing: .3em; text-transform: uppercase; font-size: .8rem; background: #0006; transition: background .4s, color .4s; }
.az-eintritt:hover { background: var(--az-gold); color: #000; }
.az-plan { padding: clamp(3rem, 8vw, 7rem) clamp(1rem, 4vw, 4rem); }
.az-plan-raster { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 17rem), 1fr)); gap: 2px; }
.az-plan-saal { position: relative; display: grid; align-content: end; gap: .2rem; min-height: 22rem; padding: 1.4rem; text-decoration: none; overflow: hidden; isolation: isolate; }
.az-plan-saal::before { content: ""; position: absolute; inset: 0; z-index: -2; background: var(--saalbild) center/cover; filter: grayscale(1) brightness(.45); transition: filter .8s, transform 1.4s cubic-bezier(.2,.7,.2,1); }
.az-plan-saal::after { content: ""; position: absolute; inset: 0; z-index: -1; background: linear-gradient(#0000 35%, #000d); }
.az-plan-saal:hover::before, .az-plan-saal:focus-visible::before { filter: none; transform: scale(1.07); }
.az-plan-saal b { font: 300 4rem/1 var(--az-serif); color: var(--az-gold); }
.az-plan-saal strong { font: 400 1.6rem/1.15 var(--az-serif); }
.az-plan-saal span { font-size: .72rem; letter-spacing: .2em; text-transform: uppercase; color: var(--az-leise); }
.az-prozession { overflow: hidden; padding: 2rem 0 0; -webkit-mask: linear-gradient(90deg, transparent, #000 10% 90%, transparent); mask: linear-gradient(90deg, transparent, #000 10% 90%, transparent); }
.az-prozession-band { display: flex; gap: 1.2rem; width: max-content; animation: az-prozession 120s linear infinite; }
.az-prozession:hover .az-prozession-band { animation-play-state: paused; }
.az-prozession .az-werk-bild { width: auto; height: 15rem; aspect-ratio: auto; background: none; }
.az-prozession .az-werk-bild img { width: auto; height: 100%; }
@keyframes az-prozession { to { transform: translateX(-50%); } }
`,
    allgemeines: `/* Saal I · Die wandernde Verzerrung – heller White Cube; jedes Werk wirft eine wandernde Verdopplung */
.az-saal-allgemeines { background: #efece5; color: #15131a; --az-leise: #6b6574; --az-gold: #8a6a2a; }
.az-saal-allgemeines .az-saalplan { background: #efece5d9; border-color: #00000014; }
.az-weiss-kopf { min-height: 0; padding-bottom: 1rem; align-content: start; }
.az-wort { position: relative; height: .82em; margin: 1.5rem 0 0; font: 300 clamp(3rem, 10.5vw, 11rem)/.8 var(--az-serif); letter-spacing: -.01em; pointer-events: none; overflow: hidden; }
.az-wort span { position: absolute; left: 0; bottom: 0; background: var(--bild) center/cover; -webkit-background-clip: text; background-clip: text; color: transparent; }
.az-wort span + span { mix-blend-mode: multiply; opacity: .55; animation: az-verdopplung 7s ease-in-out infinite; }
@keyframes az-verdopplung { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(1.4%, -2%); } }
.az-weiss-kopf h1 { position: relative; z-index: 2; color: #15131a; }
.az-wand { display: grid; grid-auto-flow: dense; grid-template-columns: repeat(auto-fill, minmax(min(100%, 16rem), 1fr)); gap: clamp(3rem, 7vw, 7rem) clamp(2rem, 5vw, 5rem); padding: 0 clamp(1.5rem, 6vw, 7rem); align-items: end; }
.az-wand .az-gross-werk { grid-column: span 2; }
.az-wand .az-werk-bild { box-shadow: 0 30px 60px -30px #0007; max-height: 72vh; }
.az-wand .az-werk::after { content: ""; position: absolute; inset: 0 0 auto; aspect-ratio: var(--ar); background: var(--bild) center/cover; mix-blend-mode: multiply; opacity: 0; transform: translate(0, 0); pointer-events: none; transition: opacity .5s, transform 1.4s cubic-bezier(.2,.7,.2,1); }
.az-wand .az-werk:hover::after { opacity: .5; transform: translate(14px, -10px); }
@media (max-width: 760px) { .az-wand .az-gross-werk { grid-column: auto; } }
`,
    biologie: `/* Saal II · Lichtbrechung – irisierender Dunkelraum, Werke in Facetten, Prismen zerlegen das Leitbild */
.az-saal-biologie { background: radial-gradient(ellipse at 20% 0, #12203a, transparent 60%), radial-gradient(ellipse at 90% 60%, #2a1240, transparent 55%), #04040a; }
.az-prisma-kopf { min-height: 80vh; }
.az-prisma i { position: absolute; inset: 0; z-index: -1; background: var(--bild) center/cover; }
.az-prisma i:nth-child(1) { clip-path: polygon(0 0, 38% 0, 26% 100%, 0 100%); filter: hue-rotate(-40deg) saturate(1.6); animation: az-brechung 11s ease-in-out infinite; }
.az-prisma i:nth-child(2) { clip-path: polygon(38% 0, 70% 0, 62% 100%, 26% 100%); filter: hue-rotate(40deg) brightness(1.2); animation: az-brechung 11s ease-in-out infinite reverse; }
.az-prisma i:nth-child(3) { clip-path: polygon(70% 0, 100% 0, 100% 100%, 62% 100%); background-position: 5% center; filter: hue-rotate(120deg) saturate(1.5) brightness(1.3); animation: az-brechung 13s ease-in-out infinite; }
@keyframes az-brechung { 50% { transform: translateX(2.5%) scale(1.04); } }
.az-prisma-kopf::after { content: ""; position: absolute; inset: 0; z-index: 0; background: linear-gradient(#0000 40%, #04040a); }
.az-prisma-kopf h1 { background: conic-gradient(from 0deg, #ffd6f5, #a8f0ff, #fff3b0, #d0b0ff, #ffd6f5); -webkit-background-clip: text; background-clip: text; color: transparent; }
.az-facetten { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 19rem), 1fr)); gap: 3rem 2rem; padding: 0 clamp(1rem, 5vw, 5rem); }
.az-facetten .az-werk-bild { aspect-ratio: 1; clip-path: polygon(25% 3%, 75% 3%, 100% 50%, 75% 97%, 25% 97%, 0 50%); transition: clip-path .9s cubic-bezier(.2,.7,.2,1); }
.az-facetten .az-werk-bild:hover, .az-facetten .az-werk-bild:focus-visible { clip-path: polygon(0 0, 100% 0, 100% 50%, 100% 100%, 0 100%, 0 50%); }
.az-facetten .az-werk { padding: 6px; }
.az-facetten .az-werk::before { content: ""; position: absolute; inset: 0 0 auto; aspect-ratio: 1; z-index: -1; clip-path: polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%); background: conic-gradient(from var(--w, 0deg), #ff9de6, #8ef0ff, #fff07a, #b38cff, #ff9de6); animation: az-irisieren 6s linear infinite; }
@property --w { syntax: "<angle>"; inherits: false; initial-value: 0deg; }
@keyframes az-irisieren { to { --w: 360deg; } }
.az-facetten .az-werk-bild img { filter: saturate(1.15); }
.az-facetten .az-schild { text-align: center; }
`,
    entwicklung: `/* Saal III · Verzweigung – ein Stamm aus Licht; die Werke wachsen entlang der Achse */
.az-saal-entwicklung { background: linear-gradient(180deg, #050403, #120d08 50%, #050403); }
.az-zweig-kopf { min-height: 70vh; }
.az-zweig-kopf::before { content: ""; position: absolute; inset: 0; z-index: -1; background: var(--bild) center/cover; filter: brightness(1.2) saturate(1.3); -webkit-mask: linear-gradient(90deg, #000, transparent 85%); mask: linear-gradient(90deg, #000, transparent 85%); animation: az-wachsen 6s cubic-bezier(.2,.7,.2,1) both; }
@keyframes az-wachsen { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
.az-stamm { position: relative; display: grid; gap: clamp(2rem, 5vw, 4rem); padding: 2rem clamp(1rem, 5vw, 5rem) 4rem; }
.az-stamm::before { content: ""; position: absolute; left: 50%; top: 0; bottom: 0; width: 2px; translate: -50%; background: linear-gradient(#e9c58a, #8ef0ff 50%, #e9c58a); box-shadow: 0 0 24px #e9c58a; }
.az-ast { width: calc(18% + var(--stufe) * 4%); max-width: 46%; justify-self: end; margin-right: calc(50% + 2.5rem); }
.az-ast:nth-child(even) { justify-self: start; margin-right: 0; margin-left: calc(50% + 2.5rem); }
.az-ast::before { content: ""; position: absolute; top: 40%; width: 2.5rem; height: 1px; background: #e9c58a; right: -2.5rem; box-shadow: 0 0 10px #e9c58a; }
.az-ast:nth-child(even)::before { right: auto; left: -2.5rem; }
.az-ast .az-werk-bild { border-radius: 50% 50% 4px 4px / 22% 22% 4px 4px; }
@media (max-width: 760px) { .az-stamm::before { left: 1rem; } .az-ast, .az-ast:nth-child(even) { width: auto; max-width: none; margin: 0 0 0 2.5rem; justify-self: stretch; } .az-ast::before, .az-ast:nth-child(even)::before { left: -1.5rem; right: auto; width: 1.5rem; } }
`,
    heimatwelt: `/* Saal IV · Dämmerung – ein waagerechtes Panorama vor dem letzten Lichtsaum, unten der Horizont als Silhouette */
.az-saal-heimatwelt { background: #08060f; }
.az-saal-heimatwelt .az-main { background: linear-gradient(180deg, #08060f 0%, #120c22 30%, #2a1838 55%, #6a3038 78%, #d08a50 92%, #08060f 100%); }
.az-daemmer-kopf { min-height: 78vh; }
.az-daemmer-kopf::before { content: ""; position: absolute; inset: 0; z-index: -1; background: var(--bild) center/cover; filter: contrast(1.1); }
.az-saum { position: absolute; left: 0; right: 0; top: 50%; height: 3px; background: linear-gradient(90deg, transparent, #fff7e0, transparent); box-shadow: 0 0 40px 8px #ffd9a0aa; animation: az-saum 7s ease-in-out infinite; }
@keyframes az-saum { 50% { opacity: .35; transform: scaleX(.7); } }
.az-panorama { overflow-x: auto; padding: 2rem 0 3rem; scroll-snap-type: x mandatory; scrollbar-color: #ffd9a0 transparent; }
.az-panorama-band { display: flex; gap: 2rem; padding: 0 clamp(1rem, 6vw, 6rem); width: max-content; }
.az-panorama .az-werk { width: min(78vw, 46rem); scroll-snap-align: center; }
.az-panorama .az-werk-bild { aspect-ratio: 16/8; box-shadow: 0 0 60px -10px #ffb06a66; }
.az-panorama .az-werk-bild img { object-position: center 60%; }
.az-silhouette { height: 26vh; margin-top: -4vh; background: var(--bild) center 75%/cover; filter: brightness(0); -webkit-mask: linear-gradient(transparent 0, #000 55%); mask: linear-gradient(transparent 0, #000 55%); }
.az-panorama-hinweis { text-align: center; margin: 0; }
`,
    gesellschaft: `/* Saal V · Der gemeinsame Blickwinkel – heller Raum, eine Folge heller und dunkler Zeichen, alle Werke schauen zur Mitte */
.az-saal-gesellschaft { background: #e7e3d9; color: #1a1712; --az-leise: #6d665a; --az-gold: #7a5a20; }
.az-saal-gesellschaft .az-saalplan { background: #e7e3d9e0; border-color: #0000001a; }
.az-hell-kopf { min-height: 60vh; align-content: center; }
.az-hell-kopf h1 { color: #1a1712; }
.az-zeichen { display: flex; gap: 6px; margin-top: 2.5rem; }
.az-zeichen i { flex: 1; height: 3.5rem; background: #1a1712; animation: az-zeichen 4.2s steps(1) infinite; animation-delay: calc(var(--i) * -.37s); }
.az-zeichen i:nth-child(3n) { flex: 2.6; }
@keyframes az-zeichen { 0% { opacity: 1; } 40% { opacity: .08; } 70% { opacity: 1; } 85% { opacity: .3; } }
.az-kreis { position: relative; display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 15rem), 1fr)); gap: 3rem 2rem; padding: 2rem clamp(1rem, 6vw, 6rem) 4rem; }
.az-kreis-mitte { grid-column: 1 / -1; justify-self: center; width: clamp(8rem, 16vw, 12rem); aspect-ratio: 1; border-radius: 50%; background: var(--bild) center/cover; box-shadow: 0 0 0 10px #e7e3d9, 0 0 0 11px #1a171230, 0 30px 60px -20px #0006; animation: az-drehen 60s linear infinite; }
.az-kreis .az-werk-bild { border-radius: 50%; aspect-ratio: 1; box-shadow: 0 25px 50px -25px #0008; }
.az-kreis .az-schild { text-align: center; }
`,
    politik: `/* Saal VI · Zwei Zeugen – eine Naht teilt den Raum; jede Vereinbarung wird aus zwei Richtungen bezeugt */
.az-saal-politik { background: #07070a; }
.az-saal-politik .az-main { background: linear-gradient(90deg, #07070a 50%, #0e0b07 50%); }
.az-naht-kopf { min-height: 76vh; }
.az-haelfte { position: absolute; inset: 0 50% 0 0; z-index: -1; background: var(--bild) 30% center/cover; filter: grayscale(.6) brightness(.7); }
.az-haelfte--b { inset: 0 0 0 50%; transform: scaleX(-1); filter: sepia(.5) brightness(.75); }
.az-naht-kopf::after, .az-diptychen::before { content: ""; position: absolute; left: 50%; top: 0; bottom: 0; width: 1px; background: linear-gradient(transparent, #d9b878, transparent); box-shadow: 0 0 18px #d9b878; }
.az-naht-kopf .az-kopf-text { text-align: center; justify-self: center; }
.az-diptychen { position: relative; display: grid; gap: clamp(4rem, 9vw, 8rem); padding: 2rem clamp(1rem, 5vw, 5rem) 3rem; }
.az-diptychon > .az-kicker { text-align: center; }
.az-zeugen { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(2rem, 8vw, 8rem); }
.az-zeuge-name { display: block; font: italic 300 1.1rem var(--az-serif); color: var(--az-gold); margin-bottom: .6rem; }
.az-zeuge:last-child { text-align: right; }
.az-zeuge:last-child .az-werk-bild img { transform: perspective(900px) rotateY(-6deg); }
.az-zeuge:first-child .az-werk-bild img { transform: perspective(900px) rotateY(6deg); }
@media (max-width: 760px) { .az-zeugen { grid-template-columns: 1fr; } .az-zeuge:last-child { text-align: left; } }
`,
    geschichte: `/* Saal VII · Bildpaare – Fotoplatten im Blinkvergleich: zwei Aufnahmen wechseln sich vor demselben Himmel ab */
.az-saal-geschichte { background: #0d0c0a; }
.az-platten-kopf { min-height: 62vh; background: repeating-linear-gradient(90deg, #0000 0 38px, #ffffff08 38px 40px); }
.az-platten-kopf::before { content: ""; position: absolute; inset: 6% 5% 6% 40%; z-index: -1; background: var(--bild) center/cover; filter: grayscale(1) contrast(1.2) sepia(.3); border: 12px solid #1a1814; outline: 1px solid #3a352b; animation: az-plattenblink 2.4s steps(1) infinite; }
@keyframes az-plattenblink { 50% { filter: grayscale(1) invert(1) contrast(1.1); } }
.az-blinken-aus .az-platten-kopf::before { animation: none; }
.az-blink-knopf { justify-self: start; margin-top: 1.5rem; padding: .7rem 1.4rem; border: 1px solid #c8b89a; background: none; color: #e8dcc4; font: 500 .75rem var(--az-grotesk); letter-spacing: .25em; text-transform: uppercase; cursor: pointer; }
.az-blink-knopf[aria-pressed="false"] { opacity: .6; }
.az-platten { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 30rem), 1fr)); gap: 3rem; padding: 0 clamp(1rem, 5vw, 5rem); }
.az-platte { padding: 1.2rem; background: #1a1814; border: 1px solid #3a352b; box-shadow: inset 0 0 0 10px #12110e; }
.az-plattennr { font: 500 .7rem var(--az-grotesk); letter-spacing: .2em; color: #b8a98a; margin: 0 0 1rem; }
.az-blink { position: relative; display: grid; }
.az-blink .az-werk { grid-area: 1 / 1; }
.az-blink .az-werk-bild { aspect-ratio: 4/3; }
.az-blink .az-werk-bild img { filter: grayscale(1) contrast(1.25) sepia(.25); }
.az-blink .az-werk + .az-werk .az-werk-bild img { filter: grayscale(1) invert(1) contrast(1.1); }
.az-blink .az-werk + .az-werk { animation: az-blink 2.4s steps(1) infinite; }
.az-blinken-aus .az-blink .az-werk + .az-werk { animation: none; opacity: 0; pointer-events: none; }
.az-blink .az-schild { background: #1a1814; }
@keyframes az-blink { 0% { opacity: 0; pointer-events: none; } 50% { opacity: 1; pointer-events: auto; } }
`,
    gameplay: `/* Saal VIII · Zwei Aussichtsplattformen – Peilung: zwei Linien kreuzen sich dort, wo der Blick ruht */
.az-saal-gameplay { background: #020a0b; --az-gold: #6ff0d8; }
.az-hud-kopf { min-height: 82vh; cursor: crosshair; }
.az-hud-kopf::before { content: ""; position: absolute; inset: 0; z-index: -2; background: var(--bild) center/cover; filter: saturate(.6) brightness(.7) hue-rotate(-20deg); }
.az-hud-kopf::after { content: ""; position: absolute; inset: 0; z-index: -1; background: linear-gradient(#6ff0d80d 1px, transparent 1px) 0 0/100% 48px, linear-gradient(90deg, #6ff0d80d 1px, transparent 1px) 0 0/48px 100%, radial-gradient(ellipse, transparent 40%, #020a0be0); }
.az-peilung { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1; pointer-events: none; }
.az-peilung line { stroke: #6ff0d8; stroke-width: 1; stroke-dasharray: 6 6; animation: az-strich 1s linear infinite; }
.az-peil-ziel { fill: none; stroke: #6ff0d8; stroke-width: 1.5; }
@keyframes az-strich { to { stroke-dashoffset: -12; } }
.az-plattform { position: absolute; bottom: 1rem; font: 500 .7rem var(--az-grotesk); letter-spacing: .25em; text-transform: uppercase; color: #6ff0d8; z-index: 2; }
.az-plattform--a { left: 1rem; } .az-plattform--b { right: 1rem; }
.az-koordinate { display: block; margin-top: 1rem; font: 500 .85rem var(--az-grotesk); letter-spacing: .15em; color: #6ff0d8; }
.az-ziele { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 20rem), 1fr)); gap: 2.5rem; padding: 0 clamp(1rem, 5vw, 5rem); }
.az-ziele .az-werk-bild { position: relative; outline: 1px solid #6ff0d833; outline-offset: 8px; }
.az-ziele .az-werk-bild::after { content: ""; position: absolute; inset: 0; background: linear-gradient(#6ff0d8, #6ff0d8) center/1px 34% no-repeat, linear-gradient(#6ff0d8, #6ff0d8) center/34% 1px no-repeat; opacity: 0; transition: opacity .3s; mix-blend-mode: screen; }
.az-ziele .az-werk-bild:hover::after { opacity: .8; }
.az-ziele .az-werk-bild img { filter: saturate(.85); }
`,
    forschung: `/* Saal IX · Parallaxe – Labor; jedes Werk existiert zweimal und verschiebt sich mit dem Standpunkt */
.az-saal-forschung { background: #050507; --az-gold: #ff5a64; }
.az-labor-kopf { min-height: 70vh; }
.az-labor-kopf::before { content: ""; position: absolute; inset: 0; z-index: -1; background: var(--bild) center/cover; filter: brightness(1.2) saturate(1.2); }
.az-scan { position: absolute; left: 0; right: 0; height: 2px; top: 0; background: #ff5a64; box-shadow: 0 0 30px 6px #ff5a6488; animation: az-scan 5s ease-in-out infinite; }
@keyframes az-scan { 50% { top: 100%; } }
.az-stereo { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 21rem), 1fr)); gap: 3rem 2rem; padding: 0 clamp(1rem, 5vw, 5rem); }
.az-stereo .az-werk-bild { position: relative; background: #000; isolation: isolate; }
.az-stereo .az-werk-bild::before, .az-stereo .az-werk-bild::after { content: ""; position: absolute; inset: -12px; background: var(--bild) center/cover; background-blend-mode: multiply; mix-blend-mode: screen; transition: transform .3s ease-out; pointer-events: none; }
.az-stereo .az-werk-bild::before { background-color: #ff0000; transform: translate(calc(var(--px, .4) * -10px), calc(var(--py, 0) * -4px)); }
.az-stereo .az-werk-bild::after { background-color: #00ffff; transform: translate(calc(var(--px, .4) * 10px), calc(var(--py, 0) * 4px)); }
.az-stereo .az-werk-bild img { position: relative; z-index: 1; opacity: 0; transition: opacity .5s, transform 1.2s; }
.az-stereo .az-werk-bild:hover img, .az-stereo .az-werk-bild:focus-visible img { opacity: 1; }
`,
    technologien: `/* Saal X · Beobachtungsstationen – Blaupause: jede Aufnahme mit Protokollkarte nach Archivformat */
.az-saal-technologien { background: #06182c; --az-gold: #8fd8ff; --az-leise: #7fa6c4; background-image: linear-gradient(#8fd8ff0f 1px, transparent 1px), linear-gradient(90deg, #8fd8ff0f 1px, transparent 1px); background-size: 32px 32px; }
.az-blau-kopf { min-height: 72vh; }
.az-blau-kopf::before { content: ""; position: absolute; inset: 0; z-index: -1; background: var(--bild) center 30%/cover; filter: grayscale(1) contrast(1.4) brightness(.9); mix-blend-mode: screen; opacity: .65; }
.az-blau-kopf::after { content: ""; position: absolute; inset: 8% 6%; border: 1px dashed #8fd8ff66; pointer-events: none; }
.az-protokolle { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 24rem), 1fr)); gap: 2rem; padding: 0 clamp(1rem, 5vw, 5rem); }
.az-protokoll { border: 1px solid #8fd8ff40; padding: 1rem; background: #06182ccc; }
.az-protokoll .az-werk-bild img { filter: grayscale(1) sepia(1) hue-rotate(160deg) saturate(2.2) brightness(.9); }
.az-protokoll .az-werk-bild:hover img { filter: none; }
.az-protokoll dl { display: grid; grid-template-columns: 1fr 1fr; gap: .4rem 1rem; margin: 1rem 0 0; font-size: .74rem; }
.az-protokoll dt { letter-spacing: .2em; text-transform: uppercase; color: #8fd8ff; font-size: .62rem; }
.az-protokoll dd { margin: 0; color: #cfe8f8; }
`,
    medien: `/* Saal XI · Das Archiv – Salonhängung aller Originale auf dunkelrotem Samt */
.az-saal-medien { background: radial-gradient(ellipse at 50% 0, #4a1018, #1a0508 70%); }
.az-salon-kopf { min-height: 46vh; text-align: center; justify-items: center; }
.az-unterzeile { max-width: 40rem; font: 300 1.2rem/1.5 var(--az-serif); color: #e8d0c8; }
.az-filter { display: flex; flex-wrap: wrap; justify-content: center; gap: .4rem; padding: 0 1rem 2.5rem; }
.az-filter button { font: 500 .72rem var(--az-grotesk); letter-spacing: .12em; padding: .5rem .9rem; border: 1px solid #d9b87866; border-radius: 999px; background: #0004; color: var(--az-perl); cursor: pointer; }
.az-filter button[aria-pressed="true"] { background: var(--az-gold); color: #1a0508; }
.az-filter small { opacity: .7; }
.az-salon { columns: 18rem; column-gap: 1.6rem; padding: 0 clamp(1rem, 4vw, 4rem); }
.az-salon-werk { break-inside: avoid; margin-bottom: 1.8rem; padding: 10px; background: linear-gradient(135deg, #8a6a2a, #e8cf8a 30%, #6a4e1a 60%, #d9b878); box-shadow: 0 20px 40px -15px #000c; }
.az-salon-werk[hidden] { display: none; }
.az-salon-werk .az-werk-bild { border: 3px solid #1a0508; }
.az-salon-werk .az-schild { padding: .5rem .3rem .2rem; color: #2a1608; }
.az-salon-werk .az-schild strong { filter: none; color: #1a0a04; }
.az-salon-werk .az-inv { color: #4a2a08; }
`,
};

const SAAL_JS = {
    foyer: `const linse = document.querySelector(".az-linse"), foyer = document.querySelector(".az-foyer");
if (bewegungErlaubt && linse) foyer.addEventListener("pointermove", (e) => { const r = foyer.getBoundingClientRect(); linse.style.setProperty("--x", \`\${e.clientX - r.left}px\`); linse.style.setProperty("--y", \`\${e.clientY - r.top}px\`); foyer.classList.add("az-aktiv"); });`,
    heimatwelt: `const p = document.querySelector(".az-panorama");
p?.addEventListener("wheel", (e) => { if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && p.scrollWidth > p.clientWidth) { const ende = p.scrollLeft + p.clientWidth >= p.scrollWidth - 2, anfang = p.scrollLeft <= 0; if ((e.deltaY > 0 && !ende) || (e.deltaY < 0 && !anfang)) { e.preventDefault(); p.scrollLeft += e.deltaY; } } }, { passive: false });`,
    geschichte: `const k = document.querySelector(".az-blink-knopf");
k?.addEventListener("click", () => { const an = k.getAttribute("aria-pressed") !== "true"; k.setAttribute("aria-pressed", String(an)); k.textContent = an ? "Blinkvergleich läuft" : "Blinkvergleich angehalten"; document.body.classList.toggle("az-blinken-aus", !an); });
if (!bewegungErlaubt) k?.click();`,
    gameplay: `const kopf = document.querySelector(".az-hud-kopf"), svg = kopf?.querySelector(".az-peilung"), out = kopf?.querySelector(".az-koordinate");
const setze = (x, y) => { const r = kopf.getBoundingClientRect(); const a = svg.querySelector(".az-peil-a"), b = svg.querySelector(".az-peil-b"), z = svg.querySelector(".az-peil-ziel");
  a.setAttribute("x1", 0); a.setAttribute("y1", r.height); a.setAttribute("x2", x); a.setAttribute("y2", y);
  b.setAttribute("x1", r.width); b.setAttribute("y1", r.height); b.setAttribute("x2", x); b.setAttribute("y2", y);
  z.setAttribute("cx", x); z.setAttribute("cy", y);
  const wa = Math.atan2(r.height - y, x) * 180 / Math.PI, wb = Math.atan2(r.height - y, r.width - x) * 180 / Math.PI;
  out.textContent = \`Peilung A \${wa.toFixed(1)}° · Peilung B \${wb.toFixed(1)}° · Position eingegrenzt\`; };
if (kopf) { const r = kopf.getBoundingClientRect(); setze(r.width * .6, r.height * .4); kopf.addEventListener("pointermove", (e) => { const q = kopf.getBoundingClientRect(); setze(e.clientX - q.left, e.clientY - q.top); }); }`,
    forschung: `if (bewegungErlaubt) addEventListener("pointermove", (e) => { document.body.style.setProperty("--px", ((e.clientX / innerWidth) * 2 - 1).toFixed(3)); document.body.style.setProperty("--py", ((e.clientY / innerHeight) * 2 - 1).toFixed(3)); }, { passive: true });`,
    medien: `const knoepfe = [...document.querySelectorAll(".az-filter button")], werke = [...document.querySelectorAll(".az-salon-werk")];
knoepfe.forEach((b) => b.addEventListener("click", () => { knoepfe.forEach((x) => x.setAttribute("aria-pressed", String(x === b))); werke.forEach((w) => { w.hidden = !!b.dataset.saal && w.dataset.saal !== b.dataset.saal; }); }));`,
};

// ---------- schreiben ----------
write(`${S}/astralizes-basis.css`, BASIS_CSS);
for (const s of SAELE) {
    const von = `${S}/${s.datei}`;
    const dir = path.posix.dirname(von), name = path.posix.basename(s.datei).replace(/\.html$/, "");
    write(von, seite(s, INHALT[s.key]));
    write(`${dir}/${name}.css`, SAAL_CSS[s.key]);
    const basisJs = rel(`${dir}/x.js`, `${S}/astralizes-basis.js`);
    write(`${dir}/${name}.js`, `import { bewegungErlaubt } from "${basisJs.startsWith(".") ? basisJs : "./" + basisJs}";\n${SAAL_JS[s.key] ?? "void bewegungErlaubt;"}\n`);
}
// Basis-JS: Pfade relativ zum Speziesordner
write(`${S}/astralizes-basis.js`, BASIS_JS);
console.log(`Astralizes: ${SAELE.length} Säle · ${WERKE.length} Werke · ${VERTEIL.map((s) => `${s.nr}:${s.werke.length}`).join(" ")}`);
