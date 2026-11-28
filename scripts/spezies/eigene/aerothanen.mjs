// Spezies-Baukasten · eigenes Bauskript: Aerothanen – „Die Himmelsriesen“
// Marke „Perlmutt & Sturmlicht“: jede Seite ist eine Höhenschicht der Atmosphäre (Höhenmesser als Markenzeichen).
// Texte vollständig aus Info_material/…/Aerothanen (Kapitel über bibliothek.kapitel), Bilder aus assets/…/Aerothanen:
//   vorschau/<ordner>/  – verkleinerte JPEGs (max. 1.400 px) für Seiten und Galerien
//   gestaltung/         – Gestaltungselemente (Emblem)
//   <ordner>/*.png      – unveränderte Originale (Großansicht)
// Zweite Leiste: nav.ae-reiter (Handy-Schicht macht sie klebend; „Kapitel blättern“ entsteht daraus automatisch).
// Neue Bilder: in den passenden Ordner legen, Vorschau erzeugen (siehe README) und Skript erneut ausführen.
// Aufruf: node scripts/spezies/eigene/aerothanen.mjs   (oder npm run spezies -- Aerothanen)
import fs from "node:fs";
import path from "node:path";
import { ROOT, esc, rel, write, kapitel } from "../bibliothek.mjs";

const S = "inhalte/spezies/Gigantische Lebensformen/Aerothanen";
const INFO = "Info_material/Alle_spezies_daten/Gigantische Lebensformen/Aerothanen";
const A = "assets/bilder/Alle Spezies+Übersicht/Gigantische Lebensformen/Aerothanen";
const R0 = "spezies-gigantic-12";
const P = "ae";
const GRUPPE = { name: "Gigantische Lebensformen", route: "spezies-gigantic", datei: "inhalte/spezies/Gigantische Lebensformen/ÜbersichtsseiteGigantische Lebensformen/Uebersicht.html" };
const HEIMAT = { welt: "Saelith III", system: "Osselyr-System", stern: "Saelith", dossier: "inhalte/himmelskoerper/planeten/details/saelith-iii/hauptseite/index.html",
    bild: "assets/bilder/Himmelskörper/GasPlaneten/saelith-iii/hauptseite/blau-goldener-gasriese-mit-atmospharenschweif-7503f6db85.webp",
    karte: "Menüs/Sternenkarte/Sternenkarte.html?system=osselyr-stern&objekt=osselyr-saelith-iii" };

// ---------- Bilder ----------
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
const ORDNER = { gesamtdarstellung: "Gesamtdarstellung", biologie: "Biologie", entwicklungsstadien: "Entwicklung", Heimatplanet: "Heimatwelt", Forschung: "Forschung", Technologie: "Technologie" };
function titelVon(n) {
    let t = n.replace(/-\d+$/, "").replace(/\s*\(\d+\)$/, (m) => " " + m.match(/\d+/)[0]);
    t = t.replace(/^Aerothanen_designa1(?:\s(\d+))?$/, (_, z) => "Designtafel A1" + (z ? " · Ansicht " + z : ""));
    t = t.replace(/^AerothanenB(\d)$/, "Gestalt B$1").replace(/^Höherentwickleteform\.C(\d)$/, "Höher entwickelte Form C$1");
    return t.replace(/^APORIA[ _–-]+/, "").replace(/_ /g, ": ").replace(/_/g, " ").replace(/\s+/g, " ").trim();
}
const VOR = path.join(ROOT, A, "vorschau");
const BILDER = Object.keys(ORDNER).flatMap((o) => {
    const d = path.join(VOR, o);
    if (!fs.existsSync(d)) return [];
    return fs.readdirSync(d).filter((f) => f.endsWith(".jpg")).sort((a, b) => a.localeCompare(b, "de", { numeric: true })).map((f) => {
        const n = f.replace(/\.jpg$/, "");
        const orig = `${A}/${o}/${n}.png`;
        return { ordner: o, kategorie: ORDNER[o], n, titel: titelVon(n), vor: `${A}/vorschau/${o}/${f}`, orig: fs.existsSync(path.join(ROOT, orig)) ? orig : `${A}/vorschau/${o}/${f}`, ...jpegMasse(path.join(d, f)) };
    });
});
const bildVon = (teil) => BILDER.find((b) => b.n.startsWith(teil)) ?? BILDER[0];
const EMBLEM = `${A}/gestaltung/emblem.jpg`;

// ---------- Seiten (Reihenfolge = zweite Leiste) ----------
const SEITEN = [
    { key: "uebersicht", label: "Übersicht", unter: "Die Himmelsriesen", datei: "hauptseite/Spezies.html", route: R0, info: ["01_Speziesdaten/speziesdaten.md"], hero: "Aerothanen im Sturmwolkenmeer" },
    { key: "allgemeines", label: "Allgemeines", unter: "Identität, Fähigkeiten und Designrichtlinien", datei: "Unterseiten/Allgemeines/allgemeines.html", info: ["Allgemein/Allgemein.md"], pool: (b) => b.ordner === "gesamtdarstellung", hero: "AerothanenB2", fokus: "50% 30%" },
    { key: "biologie", label: "Biologie", unter: "Anatomie eines Himmelsriesen", datei: "Unterseiten/Biologie/biologie.html", info: ["Biologie/Biologie.md"], pool: (b) => b.ordner === "biologie" || /Organ|Anatomie|Embryo/.test(b.titel), hero: "Biologische Studie des Himmelsleviathans", fokus: "50% 40%" },
    { key: "entwicklung", label: "Entwicklung", unter: "Lebenszyklus und Evolutionsstufen", datei: "Unterseiten/Entwicklung/entwicklung.html", info: ["02_Geschichte_Entwicklung/entwicklung.md"], pool: (b) => b.ordner === "entwicklungsstadien" || /Höher entwickelte/.test(b.titel), hero: "Kronen-Aerothan über den Wolken", fokus: "50% 35%" },
    { key: "heimatwelt", label: "Heimatwelt", unter: "Saelith III und das Osselyr-System", datei: "Unterseiten/Heimatwelt/heimatwelt.html", info: ["05_Heimatwelt/heimatwelt-referenz.md", "Sternensystem/Sternensytstem.md"], pool: (b) => b.ordner === "Heimatplanet" || /Saelith|Sturmwolkenmeer|Gasriesen/.test(b.titel), hero: "Schwebende Metropole im Gasriesenhimmel", fokus: "50% 45%" },
    { key: "gesellschaft", label: "Gesellschaft", unter: "Gemeinschaften im Wolkenmeer", datei: "Unterseiten/Gesellschaft/gesellschaft.html", info: ["03_Gesellschaft_Kultur/gesellschaft.md", "03_Gesellschaft_Kultur/kultur.md"], pool: (b) => /Stadt|Metropole|Megastadt|Wolkenstadt|Habitat|Kuppel/.test(b.titel), hero: "Höherentwickelter Aerothan über der Wolkenstadt", fokus: "50% 30%" },
    { key: "politik", label: "Politik", unter: "Ordnung und Fraktionsbeziehungen", datei: "Unterseiten/Politik/politik.html", info: ["04_Politik_Fraktionsbeziehungen/politik.md", "04_Politik_Fraktionsbeziehungen/fraktionsbeziehungen.md"], pool: (b) => /Schlacht|Kommando|Ring|Kupplung|Verankerung|Anker/.test(b.titel), hero: "Kosmische Schlacht über der Ringstadt", fokus: "50% 50%" },
    { key: "geschichte", label: "Geschichte", unter: "Die Chronik der Himmelsriesen", datei: "Unterseiten/Geschichte/geschichte.html", info: ["02_Geschichte_Entwicklung/geschichte.md"], pool: (b) => /Evolution|Leviathan|Urform|Wirbelsturm|Leuchtende Welten|Gestalt B/.test(b.titel), hero: "Aerothanen-Evolution unter fremden Himmeln", fokus: "50% 30%" },
    { key: "gameplay", label: "Spielintegration", unter: "Begegnungen, Missionen und Systeme", datei: "Gameplay/gameplay.html", info: ["Gameplay/spielintegration.md"], pool: (b) => /Karren|Rover|Hebevorrichtung|Kupplung|Kommandozentrale|Belastung|Disperser|Ausbringer/.test(b.titel), hero: "Aerothane in mobiler Hebevorrichtung", fokus: "50% 40%" },
    { key: "forschung", label: "Forschung", unter: "Wissenschaft der Auftriebsphysik", datei: "Forschung/forschung.html", info: ["Forschung/forschung.md"], pool: (b) => b.ordner === "Forschung", hero: "Schwebendes Forschungsnetz über Saelith III", fokus: "50% 45%" },
    { key: "technologien", label: "Technologien", unter: "Atmosphären- und Biotechnologie T01–T18", datei: "Unterseiten/Technologien/technologien.html", info: ["technologien/Technologien.md"], pool: (b) => b.ordner === "Technologie", hero: "Schwebender Ring über der Wolkenstadt", fokus: "50% 50%" },
    { key: "medien", label: "Medien", unter: "Bildarchiv, Klänge, Bewegtbild und Modelle", datei: "Unterseiten/Medien/medien.html", hero: "Leuchtende Welten im Sturmhimmel", fokus: "50% 50%" },
];
SEITEN.forEach((s, i) => {
    s.route ??= `${R0}-${s.key}`;
    s.schicht = String(i).padStart(2, "0");
    s.hoehe = (i * 1200).toLocaleString("de-DE") + " m";
    s.heroBild = bildVon(s.hero);
});
const SEITE = Object.fromEntries(SEITEN.map((s) => [s.key, s]));

// ---------- Bausteine ----------
const zu = (von, p) => rel(von, p);
// Markdown-Links aus dem Infomaterial ([Text](https://…)) als echte Links
const mdLinks = (html) => html.replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
const bildTag = (von, b, klasse = "", laden = "lazy") => `<img${klasse ? ` class="${klasse}"` : ""} src="${zu(von, b.vor)}" alt="${esc(b.titel)}" width="${b.w}" height="${b.h}" loading="${laden}" decoding="async">`;
const werk = (von, b, klasse = "ae-werk") => `<figure class="${klasse}" data-kategorie="${esc(b.kategorie)}" style="--ar:${b.w}/${b.h}">
<button type="button" class="ae-werk-bild" data-gross="${zu(von, b.orig)}" data-vor="${zu(von, b.vor)}" data-titel="${esc(b.titel)}" data-kategorie="${esc(b.kategorie)}" aria-label="${esc(b.titel)} in Großansicht öffnen">${bildTag(von, b)}</button>
<figcaption><strong>${esc(b.titel)}</strong><span>${esc(b.kategorie)}</span></figcaption></figure>`;

function reiter(von, aktiv) {
    return `<nav class="ae-reiter" aria-label="Höhenschichten der Aerothanen">
<a class="ae-reiter-marke" data-kapitel-aus href="${zu(von, `${S}/${SEITE.uebersicht.datei}`)}" data-route="${R0}" aria-label="Aerothanen – Übersicht"><img src="${zu(von, EMBLEM)}" alt="" width="34" height="34"></a>
${SEITEN.map((s) => `<a href="${zu(von, `${S}/${s.datei}`)}" data-route="${s.route}"${s.key === aktiv ? ' aria-current="page"' : ""}><b aria-hidden="true">${s.schicht}</b>${esc(s.label)}</a>`).join("\n")}
</nav>`;
}

const pfad = (von, s) => `<nav class="ae-pfad" aria-label="Archivpfad"><a data-route="spezies" href="${zu(von, "inhalte/spezies/Spezies_übersicht/Spezies.html")}">Spezies</a><span aria-hidden="true">›</span><a data-route="${GRUPPE.route}" href="${zu(von, GRUPPE.datei)}">${GRUPPE.name}</a><span aria-hidden="true">›</span>${s.key === "uebersicht" ? `<span aria-current="page">Aerothanen</span>` : `<a data-route="${R0}" href="${zu(von, `${S}/${SEITE.uebersicht.datei}`)}">Aerothanen</a><span aria-hidden="true">›</span><span aria-current="page">${esc(s.label)}</span>`}</nav>`;

// Höhenmesser: Skala mit Marke der aktuellen Schicht (Markenzeichen der Aerothanen-Seiten)
function hoehenmesser(s) {
    const i = SEITEN.indexOf(s), n = SEITEN.length - 1;
    const striche = SEITEN.map((x, k) => `<i style="--y:${(1 - k / n) * 100}%"${k === i ? ' class="ist-hier"' : ""}></i>`).join("");
    return `<div class="ae-hoehenmesser" aria-hidden="true" style="--marke:${(1 - i / n) * 100}%">${striche}<span class="ae-hoehenmarke">${esc(s.hoehe)}</span></div>`;
}

const wolken = `<span class="ae-wolken" aria-hidden="true"><i></i><i></i></span>`;

function hero(von, s, meta) {
    return `<header class="ae-hero" style="--fokus:${s.fokus ?? "50% 50%"}">
${bildTag(von, s.heroBild, "ae-hero-bild", "eager").replace("<img", '<img fetchpriority="high"')}
${wolken}
${hoehenmesser(s)}
<div class="ae-hero-text">
${pfad(von, s)}
<p class="ae-kicker"><span>Höhenschicht ${s.schicht}</span><span>${esc(s.hoehe)}</span></p>
<h1>${esc(s.label)}</h1>
<p class="ae-unterzeile">${esc(s.unter)}</p>
${meta ? `<p class="ae-meta">${meta}</p>` : ""}
</div>
</header>`;
}

// ---------- Kapitel mit passendem Bild ----------
const woerter = (t) => new Set(t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").split(/[^a-zß0-9]+/).filter((w) => w.length >= 5).map((w) => w.slice(0, 7)));
const code = (t) => (t.match(/\b([TF])0*(\d{1,2})\b/) ?? []).slice(1).join("");
function bildFuer(k, pool) {
    let best = null, punkte = 0;
    const kw = woerter(k.titel), kc = code(k.nr + " " + k.titel);
    for (const b of pool) {
        let p = 0;
        const bc = code(b.titel);
        if (kc && bc && bc !== kc) continue;   // Bild gehört sichtbar zu einer anderen Technologie/Forschung
        if (kc && bc === kc) p += 5;
        for (const w of woerter(b.titel)) if (kw.has(w)) p++;
        if (p > punkte) { punkte = p; best = b; }
    }
    return punkte >= 1 ? best : null;
}
function kapitelHtml(von, s) {
    const pool = BILDER.filter((b) => s.pool?.(b) && b !== s.heroBild);
    const frei = [...pool];
    const teile = [];
    let nr = 0;
    for (const datei of s.info) {
        const liste = kapitel(`${INFO}/${datei}`, P);
        liste.forEach((k, i) => {
            nr++;
            // Zwischenüberschriften (z. B. „F03 – Kaskadenversagen …“) bekommen zuerst ihr eigenes Bild …
            let text = mdLinks(k.html).replace(/<h3>([^<]+)<\/h3>/g, (h3, titel) => {
                const nurText = titel.replace(/&[a-z]+;/g, " ");
                const passt = bildFuer({ nr: (nurText.match(/^[TF]\d+/) ?? [""])[0], titel: nurText }, frei);
                if (!passt) return h3;
                frei.splice(frei.indexOf(passt), 1);
                return `${h3}\n${werk(von, passt, "ae-werk ae-kapitelbild")}`;
            });
            // … das Kapitel selbst bekommt eines, wenn noch keines darin steht
            const b = text.includes("ae-kapitelbild") ? null : bildFuer(k, frei);
            if (b) frei.splice(frei.indexOf(b), 1);
            const quelle = i === liste.length - 1 ? `\n<p class="ae-quelle">Quelle: Info_material · Aerothanen · ${esc(datei)}</p>` : "";
            teile.push(`<details class="ae-kapitel" id="${k.id}"${nr === 1 ? " open" : ""}>
<summary><span class="ae-nr">${esc(k.nr === "◇" ? String(nr).padStart(2, "0") : k.nr)}</span><h2>${esc(k.titel)}</h2><span class="ae-chevron" aria-hidden="true"></span></summary>
<div class="ae-text">${b ? werk(von, b, "ae-werk ae-kapitelbild") : ""}
${text}${quelle}</div>
</details>`);
        });
    }
    return { html: teile.join("\n"), anzahl: nr, rest: frei };
}
const galerie = (von, liste, titel = "Bildschicht") => liste.length ? `<section class="ae-galerie-block" aria-label="${esc(titel)}">
<h2 class="ae-h2"><span>${esc(titel)}</span><small>${liste.length} ${liste.length === 1 ? "Bild" : "Bilder"}</small></h2>
<div class="ae-galerie">${liste.map((b) => werk(von, b)).join("\n")}</div>
</section>` : "";

// ---------- Seitengerüst ----------
function seite(s, inhalt) {
    const von = `${S}/${s.datei}`;
    const name = path.posix.basename(s.datei).replace(/\.html$/, "");
    return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#0b0d1c">
<meta name="description" content="Aerothanen – ${esc(s.label)}: ${esc(s.unter)}. Die Himmelsriesen im APORIA-Weltenarchiv.">
<title>${s.key === "uebersicht" ? "Aerothanen · Die Himmelsriesen" : `${esc(s.label)} · Aerothanen`} · APORIA</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Marcellus&family=Manrope:wght@400;500;700&display=swap">
<link rel="stylesheet" href="${zu(von, "Menüs/TopBar/Top_bar.css")}">
<link rel="stylesheet" href="${zu(von, "Menüs/Side_bar/Side_bar.css")}">
<link rel="stylesheet" href="${zu(von, `${S}/aerothanen-basis.css`)}">
<link rel="stylesheet" href="${name}.css">
<script type="module" src="${name}.js"></script>
</head>
<body class="ae ae-seite-${s.key}" data-page="${s.route}" data-section="spezies" data-eigenes-design>
<div data-aporia-topbar></div>
<div class="aporia-page-frame ae-frame">
<div data-aporia-sidebar></div>
<main class="ae-main" id="inhalt">
${reiter(von, s.key)}
${inhalt(von)}
<dialog class="ae-gross" aria-label="Bild in Großansicht">
<figure><img alt=""><figcaption><span class="ae-gross-zaehler"></span><strong></strong><a target="_blank" rel="noopener">Original öffnen ↗</a></figcaption></figure>
<button type="button" class="ae-gross-knopf ae-gross-zurueck" data-schritt="-1" aria-label="Vorheriges Bild">‹</button>
<button type="button" class="ae-gross-knopf ae-gross-weiter" data-schritt="1" aria-label="Nächstes Bild">›</button>
<form method="dialog"><button class="ae-gross-zu" aria-label="Schließen">×</button></form>
</dialog>
</main>
</div>
</body>
</html>
`;
}

// ---------- Inhalte ----------
function uebersicht(von) {
    const s = SEITE.uebersicht;
    const daten = kapitel(`${INFO}/${s.info[0]}`, P);
    const gestalten = ["Gestalt B1", "Gestalt B3", "Schwebender Leviathan im Gasriesensturm", "Höherentwickelter Aerothan über der Wolkenstadt", "Gestalt B4", "Kronen-Aerothan über den Wolken"].map((t) => BILDER.find((b) => b.titel.startsWith(t))).filter(Boolean);
    const links = [
        [`${S}/Unterseiten/Heimatwelt/heimatwelt.html`, "Heimatwelt", `${HEIMAT.welt} · ${HEIMAT.system}`, `data-route="${R0}-heimatwelt"`],
        [HEIMAT.dossier, "Planetendossier", HEIMAT.welt, ""],
        ["inhalte/Forschung/Übersicht/Forschung.html", "Forschungsarchiv", "Alle Forschungszweige", ""],
        [GRUPPE.datei, GRUPPE.name, "Alle Spezies dieser Gruppe", `data-route="${GRUPPE.route}"`],
        ["inhalte/spezies/Spezies_übersicht/Spezies.html", "Speziesarchiv", "Alle Gruppen", `data-route="spezies"`],
    ];
    return `<header class="ae-start" style="--bild:url('${zu(von, s.heroBild.vor)}')">
${wolken}
<div class="ae-start-text">
${pfad(von, s)}
<p class="ae-kicker"><span>Speziesdossier</span><span>${GRUPPE.name}</span></p>
<img class="ae-emblem" src="${zu(von, EMBLEM)}" alt="" width="132" height="132">
<h1 class="ae-wortmarke">Aerothanen</h1>
<p class="ae-claim">Die Himmelsriesen</p>
<p class="ae-unterzeile">Intelligente Schwebewesen mit riesigen Auftriebsorganen und spezialisierten Nervensystemen.</p>
<a class="ae-aufstieg" href="${zu(von, `${S}/${SEITE.allgemeines.datei}`)}" data-route="${SEITE.allgemeines.route}">Aufstieg beginnen <span aria-hidden="true">↑</span></a>
</div>
<figure class="ae-start-fenster">
<button type="button" class="ae-werk-bild" data-gross="${zu(von, s.heroBild.orig)}" data-vor="${zu(von, s.heroBild.vor)}" data-titel="${esc(s.heroBild.titel)}" data-kategorie="${esc(s.heroBild.kategorie)}" aria-label="${esc(s.heroBild.titel)} in Großansicht öffnen">${bildTag(von, s.heroBild, "", "eager")}</button>
${hoehenmesser(s)}
</figure>
</header>
<section class="ae-flugdaten" aria-labelledby="flugdaten-titel">
<h2 class="ae-h2" id="flugdaten-titel"><span>Flugdaten</span><small>Speziesdaten</small></h2>
<div class="ae-flugdaten-raster">
<div class="ae-panel ae-flugdaten-text">${daten.map((k) => `${k.vorspann ? "" : `<h3>${esc(k.titel)}</h3>`}${mdLinks(k.html)}`).join("\n")}
<p class="ae-quelle">Quelle: Info_material · Aerothanen · ${esc(s.info[0])}</p></div>
<div class="ae-panel ae-groesse" aria-label="Körpergröße 500 Meter bis 3 Kilometer">
<p class="ae-kicker"><span>Körpergröße</span></p>
<div class="ae-groesse-skala"><span class="ae-groesse-balken"></span><b class="ae-groesse-min">500 m</b><b class="ae-groesse-max">3 km</b></div>
<p class="ae-groesse-zahl">500 m <span>bis</span> 3 km</p>
<p class="ae-leise">Lebensraum: Atmosphären großer Gasplaneten</p>
</div>
</div>
</section>
<section class="ae-gestalten" aria-labelledby="gestalten-titel">
<h2 class="ae-h2" id="gestalten-titel"><span>Gestalten über den Wolken</span><small>${gestalten.length} Ansichten</small></h2>
<div class="ae-gestalten-spur">${gestalten.map((b) => werk(von, b, "ae-werk ae-gestalt")).join("\n")}</div>
</section>
<aside class="ae-verweise" aria-label="Verknüpfungen">
<h2 class="ae-h2"><span>Verknüpfungen</span></h2>
<ul>${links.map(([h, t, u, r]) => `<li><a href="${zu(von, h)}" ${r}><strong>${esc(t)}</strong><span>${esc(u)}</span></a></li>`).join("")}</ul>
</aside>`;
}

function unterseite(s) {
    return (von) => {
        const k = kapitelHtml(von, s);
        const heimat = s.key === "heimatwelt" ? `<section class="ae-heimat" aria-label="Heimatwelt ${esc(HEIMAT.welt)}">
<img src="${zu(von, HEIMAT.bild)}" alt="${esc(HEIMAT.welt)}" width="320" height="320" loading="lazy" decoding="async">
<div><p class="ae-kicker"><span>Heimatwelt</span><span>Gasriese</span></p><h2>${esc(HEIMAT.welt)}</h2><p class="ae-leise">${esc(HEIMAT.system)} · Stern ${esc(HEIMAT.stern)}</p>
<p class="ae-knoepfe"><a href="${zu(von, HEIMAT.dossier)}">Planetendossier ›</a><a href="${zu(von, "Menüs/Sternenkarte/Sternenkarte.html")}?system=osselyr-stern&amp;objekt=osselyr-saelith-iii">Sternenkarte ›</a></p></div>
</section>` : "";
        const bilder = k.rest.length + (k.html.match(/ae-kapitelbild/g) ?? []).length;
        return `${hero(von, s, `${k.anzahl} Kapitel · ${bilder} ${bilder === 1 ? "Bild" : "Bilder"}`)}
<div class="ae-inhalt">
${heimat}
<div class="ae-werkzeug"><p class="ae-kicker"><span>${k.anzahl} Kapitel</span></p><button type="button" class="ae-klappen" data-ae-klappen aria-pressed="false">Alle aufklappen</button></div>
<div class="ae-kapitel-liste">
${k.html}
</div>
${galerie(von, k.rest)}
</div>`;
    };
}

function medien(von) {
    const s = SEITE.medien;
    const kats = [...new Set(BILDER.map((b) => b.kategorie))];
    return `${hero(von, s, `${BILDER.length} Bilder in ${kats.length} Kategorien`)}
<div class="ae-inhalt">
<section class="ae-galerie-block" id="bildarchiv" aria-labelledby="bildarchiv-titel">
<h2 class="ae-h2" id="bildarchiv-titel"><span>Bildarchiv</span><small>${BILDER.length} Bilder</small></h2>
<div class="ae-filter" role="group" aria-label="Bilder filtern"><button type="button" aria-pressed="true" data-filter="">Alle <small>${BILDER.length}</small></button>${kats.map((k) => `<button type="button" aria-pressed="false" data-filter="${esc(k)}">${esc(k)} <small>${BILDER.filter((b) => b.kategorie === k).length}</small></button>`).join("")}</div>
<div class="ae-galerie ae-galerie--archiv">${BILDER.map((b) => werk(von, b)).join("\n")}</div>
</section>
<section class="ae-panel ae-medienfeld" id="klangarchiv" aria-labelledby="klang-titel"><h2 class="ae-h2" id="klang-titel"><span>Klangarchiv</span><small>0 Klänge</small></h2>
<p>Noch keine Klänge im Archiv. Vorgesehener Ordner: <code>assets/audio/Alle Spezies+Übersicht/Gigantische Lebensformen/Aerothanen</code></p></section>
<section class="ae-panel ae-medienfeld" id="video" aria-labelledby="video-titel"><h2 class="ae-h2" id="video-titel"><span>Animationen und Video</span></h2>
<p>Animationen und Videos der Himmelsriesen sind in Vorbereitung.</p></section>
<section class="ae-panel ae-medienfeld" id="modelle" aria-labelledby="modelle-titel"><h2 class="ae-h2" id="modelle-titel"><span>3D-Modelle und 360°-Ansicht</span></h2>
<p>Modellansicht in Vorbereitung.</p></section>
<section class="ae-panel ae-medienfeld" id="assets" aria-labelledby="assets-titel"><h2 class="ae-h2" id="assets-titel"><span>Digitale Assets</span></h2>
<p>In Vorbereitung.</p></section>
</div>`;
}

// ---------- Gestaltung ----------
const BASIS_CSS = `/* Aerothanen · Marke „Perlmutt & Sturmlicht“ (erzeugt von scripts/spezies/eigene/aerothanen.mjs) */
.ae {
    --ae-nacht: #0b0d1c; --ae-tief: #121633; --ae-sturm: #2a2350; --ae-perl: #f4ecf3; --ae-text: #e9e4f2; --ae-leise: #b7aecb;
    --ae-rose: #e8b48a; --ae-lavendel: #c9a6ff; --ae-tuerkis: #78e0ea; --ae-linie: #c9a6ff33;
    --ae-schillern: linear-gradient(100deg, #fff4e8 0%, #f2c7a5 22%, #c9a6ff 52%, #8fe3ee 78%, #fff4e8 100%);
    --ae-serif: "Marcellus", Georgia, serif; --ae-sans: "Manrope", "Segoe UI", system-ui, sans-serif;
    margin: 0; color: var(--ae-text); font-family: var(--ae-sans); line-height: 1.65;
    background: radial-gradient(ellipse 80% 50% at 70% -10%, #3a2a5c 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 0% 30%, #1d2a4a 0%, transparent 70%), linear-gradient(180deg, var(--ae-tief), var(--ae-nacht) 45%, #07080f);
    background-attachment: fixed;
}
.ae *, .ae *::before, .ae *::after { box-sizing: border-box; }
.ae-main a { color: var(--ae-rose); }
.ae-frame { display: flex; align-items: flex-start; }
.ae-frame > [data-aporia-sidebar] { flex: 0 0 auto; }
.ae-main { flex: 1 1 auto; min-width: 0; padding-bottom: 2rem; }

/* Kicker, Überschriften */
.ae-kicker { display: flex; flex-wrap: wrap; gap: .4rem 1rem; margin: 0; font: 700 .7rem/1.3 var(--ae-sans); letter-spacing: .24em; text-transform: uppercase; color: var(--ae-tuerkis); }
.ae-kicker span + span::before { content: "·"; margin-right: 1rem; color: var(--ae-leise); }
.ae-h2 { display: flex; align-items: baseline; flex-wrap: wrap; gap: .3rem 1rem; margin: 0 0 1.2rem; font: 400 clamp(1.5rem, 3vw, 2.2rem)/1.15 var(--ae-serif); letter-spacing: .04em; }
.ae-h2 span { background: var(--ae-schillern); -webkit-background-clip: text; background-clip: text; color: transparent; }
.ae-h2 small { font: 700 .7rem var(--ae-sans); letter-spacing: .2em; text-transform: uppercase; color: var(--ae-leise); }
.ae-leise { color: var(--ae-leise); }

/* Zweite Leiste: Höhenschichten (klebt unter der Topbar, liegt über deren herabhängender Grafik) */
.ae-reiter {
    position: sticky; top: var(--aporia-topbar-height, 78px); z-index: 1000;
    display: flex; flex-wrap: nowrap; align-items: center; gap: .25rem; overflow-x: auto; overscroll-behavior-x: contain; scrollbar-width: none;
    padding: .45rem clamp(.6rem, 2vw, 1.4rem);
    background: linear-gradient(180deg, #0b0d1cf5, #0b0d1ce6); border-bottom: 1px solid var(--ae-linie);
    box-shadow: 0 10px 24px #0008;
}
body:has(.aporia-topbar details[open], .aporia-topbar.is-menu-open) .ae-reiter { z-index: 990; }
.ae-reiter::-webkit-scrollbar { display: none; }
.ae-reiter a { flex: 0 0 auto; display: inline-flex; align-items: baseline; gap: .4rem; padding: .45rem .75rem; border-radius: 999px; color: var(--ae-text); font: 500 .86rem var(--ae-sans); text-decoration: none; white-space: nowrap; transition: background .2s, color .2s; }
.ae-reiter a b { font: 700 .62rem var(--ae-sans); letter-spacing: .12em; color: var(--ae-tuerkis); }
.ae-reiter a:hover { background: #c9a6ff1f; }
.ae-reiter a[aria-current] { background: var(--ae-schillern); color: var(--ae-nacht); }
.ae-reiter a[aria-current] b { color: var(--ae-sturm); }
.ae-reiter .ae-reiter-marke { padding: 0; margin-right: .4rem; }
.ae-reiter-marke img { display: block; width: 34px; height: 34px; border-radius: 50%; object-fit: cover; box-shadow: 0 0 0 1px #f2c7a566, 0 0 14px #c9a6ff55; }

/* Wolkenbänder (nur im Kopfbereich, kopfgroß – keine seitenhohe animierte Ebene) */
.ae-wolken { position: absolute; inset: 0; z-index: 1; overflow: hidden; pointer-events: none; }
.ae-wolken i { position: absolute; left: -30%; width: 160%; height: 38%; border-radius: 50%; filter: blur(28px); opacity: .5; background: radial-gradient(ellipse at 50% 50%, #f4ecf355, transparent 65%); animation: ae-treiben 38s linear infinite; }
.ae-wolken i:first-child { bottom: -8%; }
.ae-wolken i:last-child { top: 18%; height: 26%; opacity: .32; animation-duration: 56s; animation-direction: reverse; }
@keyframes ae-treiben { from { transform: translateX(-12%); } to { transform: translateX(12%); } }

/* Höhenmesser */
.ae-hoehenmesser { position: absolute; z-index: 2; top: 12%; bottom: 12%; right: clamp(.8rem, 3vw, 2.4rem); width: 2px; background: linear-gradient(#78e0ea00, #78e0ea88, #c9a6ff88, #e8b48a00); }
.ae-hoehenmesser i { position: absolute; right: 0; top: var(--y); width: 10px; height: 1px; background: #f4ecf399; }
.ae-hoehenmesser i.ist-hier { width: 22px; height: 2px; background: var(--ae-rose); box-shadow: 0 0 10px var(--ae-rose); }
.ae-hoehenmarke { position: absolute; right: 30px; top: var(--marke); transform: translateY(-50%); padding: .15rem .55rem; border: 1px solid #e8b48a88; border-radius: 999px; background: #0b0d1ccc; color: var(--ae-perl); font: 700 .7rem var(--ae-sans); letter-spacing: .12em; white-space: nowrap; }

/* Kopf der Unterseiten */
.ae-hero { position: relative; isolation: isolate; display: grid; align-items: end; min-height: clamp(22rem, 62vh, 36rem); overflow: hidden; border-bottom: 1px solid var(--ae-linie); }
.ae-hero-bild { position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%; object-fit: cover; object-position: var(--fokus); }
.ae-hero::after { content: ""; position: absolute; inset: 0; z-index: -1; background: linear-gradient(0deg, var(--ae-nacht) 2%, #0b0d1cb8 34%, #0b0d1c33 70%, #0b0d1c66), linear-gradient(90deg, #0b0d1ccc, transparent 60%); }
.ae-hero-text { position: relative; z-index: 3; display: grid; gap: .55rem; max-width: 46rem; padding: clamp(1.4rem, 4vw, 3.4rem) clamp(1rem, 5vw, 4rem); }
.ae-hero h1 { margin: 0; font: 400 clamp(2.4rem, 6.5vw, 5rem)/1 var(--ae-serif); letter-spacing: .06em; background: var(--ae-schillern); -webkit-background-clip: text; background-clip: text; color: transparent; }
.ae-unterzeile { margin: 0; font: 400 clamp(1.05rem, 2vw, 1.35rem)/1.4 var(--ae-serif); color: var(--ae-perl); }
.ae-meta { margin: .3rem 0 0; font: 700 .72rem var(--ae-sans); letter-spacing: .18em; text-transform: uppercase; color: var(--ae-leise); }
.ae-pfad { display: flex; flex-wrap: wrap; gap: .35rem; font-size: .8rem; color: var(--ae-leise); }
.ae-pfad a { color: var(--ae-perl); text-decoration: none; opacity: .85; }
.ae-pfad a:hover { opacity: 1; text-decoration: underline; }

/* Inhalt */
.ae-inhalt { display: grid; gap: 1.2rem; max-width: 72rem; margin: 0 auto; padding: clamp(1.2rem, 3vw, 2.4rem) clamp(.8rem, 3vw, 2rem); }
.ae-panel { border: 1px solid var(--ae-linie); border-radius: 18px; background: linear-gradient(160deg, #1a1b3ae6, #0d0f22f2); box-shadow: inset 0 1px 0 #f4ecf31a, 0 18px 40px #0007; padding: clamp(1rem, 2.5vw, 1.6rem); }
.ae-werkzeug { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.ae-klappen { padding: .5rem 1rem; border: 1px solid #c9a6ff66; border-radius: 999px; background: transparent; color: var(--ae-perl); font: 700 .72rem var(--ae-sans); letter-spacing: .14em; text-transform: uppercase; cursor: pointer; }
.ae-klappen:hover { background: #c9a6ff1f; }

/* Kapitel als Wolkenschichten */
.ae-kapitel-liste { display: grid; gap: .8rem; }
.ae-kapitel { position: relative; border: 1px solid var(--ae-linie); border-radius: 16px; background: linear-gradient(160deg, #191a38f0, #0d0f22f5); box-shadow: inset 0 1px 0 #f4ecf314, 0 12px 30px #0006; overflow: hidden; }
.ae-kapitel::before { content: ""; position: absolute; left: 0; right: 0; top: 0; height: 2px; background: var(--ae-schillern); opacity: .55; }
.ae-kapitel > summary { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: .9rem; padding: 1rem 1.2rem; cursor: pointer; list-style: none; }
.ae-kapitel > summary::-webkit-details-marker { display: none; }
.ae-kapitel > summary h2 { margin: 0; font: 400 clamp(1.1rem, 2.2vw, 1.45rem)/1.25 var(--ae-serif); color: var(--ae-perl); letter-spacing: .02em; }
.ae-nr { min-width: 2.6rem; padding: .25rem .5rem; border: 1px solid #78e0ea55; border-radius: 999px; font: 700 .7rem var(--ae-sans); letter-spacing: .1em; text-align: center; color: var(--ae-tuerkis); }
.ae-chevron { width: .7rem; height: .7rem; border-right: 2px solid var(--ae-rose); border-bottom: 2px solid var(--ae-rose); transform: rotate(45deg); transition: transform .25s; }
.ae-kapitel[open] .ae-chevron { transform: rotate(-135deg); }
.ae-kapitel:hover { border-color: #c9a6ff66; }
.ae-text { padding: 0 1.2rem 1.3rem; }
.ae-text > :first-child { margin-top: 0; }
.ae-text h3 { margin: 1.3rem 0 .4rem; font: 400 1.15rem var(--ae-serif); color: var(--ae-rose); }
.ae-text p, .ae-text li { max-width: 72ch; }
.ae-text ul { padding-left: 1.2rem; }
.ae-text li::marker { color: var(--ae-tuerkis); }
.ae-fakten { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 15rem), 1fr)); gap: .5rem; margin: .8rem 0; }
.ae-fakten div { padding: .6rem .8rem; border: 1px solid var(--ae-linie); border-radius: 12px; background: #0b0d1c99; }
.ae-fakten dt { font: 700 .66rem var(--ae-sans); letter-spacing: .16em; text-transform: uppercase; color: var(--ae-tuerkis); }
.ae-fakten dd { margin: .15rem 0 0; color: var(--ae-perl); }
.ae-tabelle { overflow-x: auto; }
.ae-tabelle table { width: 100%; border-collapse: collapse; font-size: .92rem; }
.ae-tabelle th, .ae-tabelle td { padding: .45rem .6rem; border-bottom: 1px solid var(--ae-linie); text-align: left; vertical-align: top; }
.ae-tabelle th { color: var(--ae-tuerkis); font-weight: 700; }
.ae-quelle { margin: 1rem 0 0; font-size: .74rem; color: var(--ae-leise); }

/* Werke (Bilder): immer im eigenen Seitenverhältnis – nichts wird abgeschnitten */
.ae-werk { margin: 0; }
.ae-werk-bild { display: block; width: 100%; padding: 0; border: 0; border-radius: 12px; overflow: hidden; background: #07080f; cursor: zoom-in; aspect-ratio: var(--ar); }
.ae-werk-bild img { display: block; width: 100%; height: 100%; object-fit: contain; transition: transform .6s cubic-bezier(.2, .7, .2, 1); }
.ae-werk-bild:hover img { transform: scale(1.025); }
.ae-werk figcaption { display: grid; gap: .1rem; padding: .5rem .2rem 0; }
.ae-werk figcaption strong { font: 500 .88rem/1.3 var(--ae-sans); color: var(--ae-perl); }
.ae-werk figcaption span { font: 700 .62rem var(--ae-sans); letter-spacing: .16em; text-transform: uppercase; color: var(--ae-leise); }
.ae-kapitelbild { float: right; width: min(42%, 22rem); margin: .2rem 0 1rem 1.4rem; }
.ae-galerie { columns: 16rem; column-gap: 1rem; }
.ae-galerie .ae-werk { break-inside: avoid; margin-bottom: 1rem; }
.ae-galerie .ae-werk[hidden] { display: none; }

/* Großansicht */
.ae-gross { width: 100vw; height: 100dvh; max-width: none; max-height: none; margin: 0; padding: 0; border: 0; background: #05060cf2; color: var(--ae-perl); }
.ae-gross::backdrop { background: #000c; }
.ae-gross figure { display: grid; grid-template-rows: 1fr auto; place-items: center; height: 100%; margin: 0; padding: 3.2rem 3.6rem 1rem; }
.ae-gross img { max-width: 100%; max-height: 100%; object-fit: contain; box-shadow: 0 0 80px #000; }
.ae-gross figcaption { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: center; gap: .4rem 1rem; padding-top: .7rem; text-align: center; }
.ae-gross figcaption strong { font: 400 1.25rem var(--ae-serif); }
.ae-gross-zaehler { font: 700 .7rem var(--ae-sans); letter-spacing: .2em; color: var(--ae-tuerkis); }
.ae-gross figcaption a { font-size: .8rem; color: var(--ae-rose); }
.ae-gross-knopf, .ae-gross-zu { position: absolute; display: grid; place-items: center; width: 3rem; height: 3rem; border: 1px solid #f4ecf344; border-radius: 50%; background: #0b0d1ccc; color: var(--ae-perl); font: 1.8rem/1 var(--ae-serif); cursor: pointer; }
.ae-gross-zurueck { left: .8rem; top: 50%; transform: translateY(-50%); }
.ae-gross-weiter { right: .8rem; top: 50%; transform: translateY(-50%); }
.ae-gross-zu { top: .8rem; right: .8rem; }

/* Kapitel blättern am Seitenende (aporia-kapitel-weiter.js) in Aerothanen-Farben */
.ae .aporia-kapitel { --kapitel-akzent: #e8b48a; --kapitel-nacht: #0b0d1c; --kapitel-text: #f4ecf3; max-width: 72rem; margin: 1rem auto 0; padding: 0 clamp(.8rem, 3vw, 2rem); }

/* Handy */
@media (max-width: 760px) {
    .ae { background-attachment: scroll; }
    .ae-hero { min-height: 62svh; }
    .ae-hero::after { background: linear-gradient(0deg, var(--ae-nacht) 4%, #0b0d1cc4 42%, #0b0d1c26 78%, #0b0d1c80); }
    .ae-hoehenmesser { top: 18%; bottom: 30%; right: .7rem; }
    .ae-hoehenmarke { font-size: .62rem; right: 26px; }
    .ae-kapitel > summary { padding: .85rem .9rem; gap: .7rem; }
    .ae-text { padding: 0 .9rem 1.1rem; }
    .ae-kapitelbild { float: none; width: 100%; margin: 0 0 1rem; }
    .ae-galerie { columns: 2; column-gap: .6rem; }
    .ae-galerie .ae-werk { margin-bottom: .6rem; }
    .ae-werk figcaption strong { font-size: .78rem; }
    .ae-gross figure { padding: 3.4rem .6rem .8rem; }
    .ae-gross-knopf { width: 2.4rem; height: 2.4rem; font-size: 1.4rem; background: #0b0d1c99; }
    .ae-gross-zurueck { left: .3rem; } .ae-gross-weiter { right: .3rem; }
}
@media (max-width: 420px) { .ae-galerie { columns: 1; } }
@media (prefers-reduced-motion: reduce) {
    .ae-wolken i { animation: none; }
    .ae-werk-bild img, .ae-chevron { transition: none; }
}
`;

const SEITEN_CSS = {
    uebersicht: `/* Übersicht · Wolkendecke – Startfenster mit Wortmarke, Flugdaten und Gestalten */
.ae-start { position: relative; isolation: isolate; display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, .9fr); align-items: center; gap: clamp(1rem, 4vw, 3rem); min-height: calc(100svh - var(--aporia-topbar-height, 78px) - 3.2rem); padding: clamp(1.4rem, 4vw, 3.4rem) clamp(1rem, 5vw, 4rem); overflow: hidden; border-bottom: 1px solid var(--ae-linie); }
.ae-start::before { content: ""; position: absolute; inset: -6%; z-index: -2; background: var(--bild) center 40% / cover; filter: blur(26px) saturate(1.3) brightness(.55); }
.ae-start::after { content: ""; position: absolute; inset: 0; z-index: -1; background: radial-gradient(ellipse 70% 60% at 30% 60%, #0b0d1c33, #0b0d1cd9 75%), linear-gradient(0deg, var(--ae-nacht), transparent 30%); }
.ae-start-text { position: relative; z-index: 3; display: grid; gap: .8rem; justify-items: start; min-width: 0; container-type: inline-size; }
.ae-emblem { width: clamp(84px, 11vw, 132px); height: auto; aspect-ratio: 1; border-radius: 50%; object-fit: cover; box-shadow: 0 0 0 1px #f2c7a588, 0 0 0 8px #c9a6ff14, 0 0 50px #c9a6ff66; animation: ae-schweben 9s ease-in-out infinite; }
@keyframes ae-schweben { 50% { transform: translateY(-8px); } }
.ae-wortmarke { margin: 0; font: 400 min(6.4rem, 13.5cqi)/.95 var(--ae-serif); letter-spacing: .1em; text-transform: uppercase; background: var(--ae-schillern); background-size: 200% 100%; -webkit-background-clip: text; background-clip: text; color: transparent; animation: ae-schillern 14s ease-in-out infinite; }
@keyframes ae-schillern { 50% { background-position: 100% 0; } }
.ae-claim { margin: 0; font: 400 clamp(1.3rem, 2.6vw, 2rem) var(--ae-serif); letter-spacing: .3em; text-transform: uppercase; color: var(--ae-rose); }
.ae-start .ae-unterzeile { max-width: 34rem; color: var(--ae-text); font-family: var(--ae-sans); font-size: clamp(1rem, 1.6vw, 1.15rem); }
.ae-aufstieg { display: inline-flex; align-items: center; gap: .6rem; margin-top: .6rem; padding: .85rem 1.5rem; border-radius: 999px; background: var(--ae-schillern); color: var(--ae-nacht) !important; font: 700 .85rem var(--ae-sans); letter-spacing: .14em; text-transform: uppercase; text-decoration: none; box-shadow: 0 12px 30px #c9a6ff44; transition: transform .25s; }
.ae-aufstieg:hover { transform: translateY(-3px); }
.ae-start-fenster { position: relative; z-index: 2; justify-self: center; width: min(100%, 26rem); margin: 0; }
.ae-start-fenster .ae-werk-bild { aspect-ratio: 2 / 3; border-radius: 999px 999px 24px 24px; box-shadow: 0 0 0 1px #f2c7a566, 0 30px 80px #000a, 0 0 70px #c9a6ff33; }
.ae-start-fenster .ae-werk-bild img { object-fit: cover; }
.ae-start-fenster .ae-hoehenmesser { right: -1.6rem; }
.ae-flugdaten, .ae-gestalten, .ae-verweise { max-width: 72rem; margin: 0 auto; padding: clamp(1.4rem, 3vw, 2.6rem) clamp(.8rem, 3vw, 2rem) 0; }
.ae-flugdaten-raster { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); gap: 1rem; }
.ae-flugdaten-text ul { list-style: none; padding: 0; display: grid; gap: .4rem; }
.ae-flugdaten-text li { padding: .55rem .8rem; border: 1px solid var(--ae-linie); border-radius: 12px; background: #0b0d1c99; }
.ae-flugdaten-text h3 { font: 400 1.15rem var(--ae-serif); color: var(--ae-rose); }
.ae-groesse { display: grid; align-content: center; gap: .9rem; }
.ae-groesse-skala { position: relative; height: 3.2rem; margin-top: 1.6rem; border-bottom: 1px solid #f4ecf344; background: repeating-linear-gradient(90deg, #f4ecf333 0 1px, transparent 1px 10%); }
.ae-groesse-balken { position: absolute; bottom: 0; left: 16.6%; right: 0; height: 60%; border-radius: 8px 8px 0 0; background: var(--ae-schillern); box-shadow: 0 0 24px #c9a6ff55; }
.ae-groesse-min, .ae-groesse-max { position: absolute; top: -1.3rem; font: 700 .7rem var(--ae-sans); color: var(--ae-leise); }
.ae-groesse-min { left: 16.6%; transform: translateX(-50%); } .ae-groesse-max { right: 0; }
.ae-groesse-zahl { margin: 0; font: 400 clamp(1.8rem, 4vw, 2.6rem)/1 var(--ae-serif); color: var(--ae-perl); }
.ae-groesse-zahl span { font-size: .5em; color: var(--ae-leise); }
.ae-gestalten-spur { display: grid; grid-auto-flow: column; grid-auto-columns: minmax(13rem, 18rem); gap: 1rem; overflow-x: auto; padding-bottom: .6rem; scroll-snap-type: x mandatory; scrollbar-color: #c9a6ff55 transparent; }
.ae-gestalt { scroll-snap-align: start; }
.ae-verweise ul { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 15rem), 1fr)); gap: .7rem; }
.ae-verweise a { display: grid; gap: .15rem; padding: .9rem 1.1rem; border: 1px solid var(--ae-linie); border-radius: 14px; background: linear-gradient(160deg, #1a1b3ae6, #0d0f22f2); text-decoration: none; transition: border-color .2s, transform .2s; }
.ae-verweise a:hover { border-color: #e8b48a88; transform: translateY(-2px); }
.ae-verweise strong { color: var(--ae-perl); font-weight: 700; }
.ae-verweise span { color: var(--ae-leise); font-size: .85rem; }
@media (max-width: 860px) {
    .ae-start { grid-template-columns: minmax(0, 1fr); min-height: 0; text-align: left; }
    .ae-start-fenster { width: min(78%, 20rem); order: -1; }
    .ae-start-fenster .ae-hoehenmesser { right: -1.1rem; }
    .ae-flugdaten-raster { grid-template-columns: minmax(0, 1fr); }
}
@media (prefers-reduced-motion: reduce) { .ae-emblem, .ae-wortmarke { animation: none; } }
`,
    heimatwelt: `/* Heimatwelt · Saelith III */
.ae-heimat { display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: center; gap: 1.2rem; padding: 1.1rem 1.3rem; border: 1px solid #78e0ea44; border-radius: 18px; background: radial-gradient(ellipse at 0% 50%, #78e0ea1f, transparent 60%), linear-gradient(160deg, #142038f0, #0d0f22f5); }
.ae-heimat img { width: clamp(5rem, 14vw, 8rem); height: auto; aspect-ratio: 1; border-radius: 50%; object-fit: cover; box-shadow: 0 0 0 1px #78e0ea66, 0 0 40px #78e0ea44; }
.ae-heimat h2 { margin: .2rem 0; font: 400 clamp(1.6rem, 3vw, 2.2rem) var(--ae-serif); color: var(--ae-perl); }
.ae-knoepfe { display: flex; flex-wrap: wrap; gap: .5rem; margin: .6rem 0 0; }
.ae-knoepfe a { padding: .45rem .9rem; border: 1px solid #f4ecf344; border-radius: 999px; color: var(--ae-perl) !important; text-decoration: none; font-size: .85rem; }
.ae-knoepfe a:hover { background: #f4ecf31a; }
@media (max-width: 520px) { .ae-heimat { grid-template-columns: minmax(0, 1fr); justify-items: start; } }
`,
    technologien: `/* Technologien · Bauplan-Anmutung */
.ae-seite-technologien .ae-kapitel { background: linear-gradient(160deg, #10203af0, #0b0f22f5), repeating-linear-gradient(0deg, #78e0ea0a 0 1px, transparent 1px 28px); }
.ae-seite-technologien .ae-nr { border-color: #e8b48a77; color: var(--ae-rose); }
`,
    forschung: `/* Forschung · Laborlicht */
.ae-seite-forschung .ae-kapitel::before { background: linear-gradient(90deg, #78e0ea, #c9a6ff); opacity: .7; }
`,
    medien: `/* Medien · Bildarchiv mit Filter */
.ae-filter { display: flex; flex-wrap: wrap; gap: .4rem; margin-bottom: 1.2rem; }
.ae-filter button { padding: .45rem .9rem; border: 1px solid #c9a6ff55; border-radius: 999px; background: #0b0d1c99; color: var(--ae-perl); font: 700 .72rem var(--ae-sans); letter-spacing: .08em; cursor: pointer; }
.ae-filter button small { opacity: .7; margin-left: .2rem; }
.ae-filter button[aria-pressed="true"] { background: var(--ae-schillern); color: var(--ae-nacht); border-color: transparent; }
.ae-medienfeld code { font-size: .8rem; color: var(--ae-tuerkis); overflow-wrap: anywhere; }
`,
};

// ---------- Verhalten ----------
const BASIS_JS = `// Aerothanen · gemeinsames Verhalten (erzeugt von scripts/spezies/eigene/aerothanen.mjs)
import "../../../../Men%C3%BCs/TopBar/Top_bar.js";
import { applyAporiaRoutes } from "../../../../Men%C3%BCs/adapter/aporia-routes.js";
applyAporiaRoutes(document);

// Kapitel: alle auf-/zuklappen, Sprungziel öffnen
const kapitel = [...document.querySelectorAll("details.ae-kapitel")];
const klappen = document.querySelector("[data-ae-klappen]");
if (klappen && kapitel.length) {
    const stand = () => { const alle = kapitel.every((k) => k.open); klappen.setAttribute("aria-pressed", String(alle)); klappen.textContent = alle ? "Alle zuklappen" : "Alle aufklappen"; };
    klappen.addEventListener("click", () => { const auf = !kapitel.every((k) => k.open); kapitel.forEach((k) => { k.open = auf; }); stand(); });
    kapitel.forEach((k) => k.addEventListener("toggle", stand));
    stand();
}
const ziel = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
if (ziel instanceof HTMLDetailsElement) ziel.open = true;

// Großansicht mit Blättern (Pfeiltasten, Knöpfe, Wischen)
const dialog = document.querySelector(".ae-gross");
if (dialog) {
    const bild = dialog.querySelector("img"), titel = dialog.querySelector("figcaption strong"), zaehler = dialog.querySelector(".ae-gross-zaehler"), link = dialog.querySelector("figcaption a");
    let liste = [], aktuell = 0;
    const sichtbar = () => [...document.querySelectorAll(".ae-werk-bild")].filter((b) => !b.closest("[hidden]"));
    const zeigen = (i) => {
        aktuell = (i + liste.length) % liste.length;
        const b = liste[aktuell];
        bild.src = b.dataset.vor; bild.alt = b.dataset.titel;
        titel.textContent = b.dataset.titel; link.href = b.dataset.gross;
        zaehler.textContent = (aktuell + 1) + " / " + liste.length + " · " + b.dataset.kategorie;
    };
    document.addEventListener("click", (e) => {
        const knopf = e.target.closest(".ae-werk-bild");
        if (!knopf) return;
        liste = sichtbar(); zeigen(liste.indexOf(knopf)); dialog.showModal();
    });
    dialog.querySelectorAll("[data-schritt]").forEach((k) => k.addEventListener("click", () => zeigen(aktuell + Number(k.dataset.schritt))));
    dialog.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") zeigen(aktuell + 1); if (e.key === "ArrowLeft") zeigen(aktuell - 1); });
    dialog.addEventListener("click", (e) => { if (e.target === dialog || e.target.tagName === "FIGURE") dialog.close(); });
    let startX = null;
    dialog.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
    dialog.addEventListener("touchend", (e) => { if (startX === null) return; const dx = e.changedTouches[0].clientX - startX; if (Math.abs(dx) > 50) zeigen(aktuell + (dx < 0 ? 1 : -1)); startX = null; }, { passive: true });
}

// Medien: Bildarchiv filtern
const filter = [...document.querySelectorAll(".ae-filter button")];
filter.forEach((b) => b.addEventListener("click", () => {
    filter.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    document.querySelectorAll(".ae-galerie--archiv .ae-werk").forEach((w) => { w.hidden = !!b.dataset.filter && w.dataset.kategorie !== b.dataset.filter; });
}));
`;

// ---------- schreiben ----------
write(`${S}/aerothanen-basis.css`, BASIS_CSS);
write(`${S}/aerothanen-basis.js`, BASIS_JS);
for (const s of SEITEN) {
    const von = `${S}/${s.datei}`;
    const dir = path.posix.dirname(von), name = path.posix.basename(s.datei).replace(/\.html$/, "");
    const inhalt = s.key === "uebersicht" ? uebersicht : s.key === "medien" ? medien : unterseite(s);
    write(von, seite(s, inhalt));
    write(`${dir}/${name}.css`, SEITEN_CSS[s.key] ?? `/* Aerothanen · ${s.label} – gemeinsames Design: aerothanen-basis.css */\n`);
    const basis = rel(`${dir}/x.js`, `${S}/aerothanen-basis.js`);
    write(`${dir}/${name}.js`, `// Aerothanen · ${s.label}\nimport "${basis.startsWith(".") ? basis : "./" + basis}";\n`);
}
console.log(`Aerothanen: ${SEITEN.length} Seiten · ${BILDER.length} Bilder`);
