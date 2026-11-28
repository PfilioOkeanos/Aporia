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

function hero(von, s) {
    return `<header class="ae-hero" style="--fokus:${s.fokus ?? "50% 50%"}"${himmelAttr(von, s.heroBild)}>
${bildTag(von, s.heroBild, "ae-hero-bild", "eager").replace("<img", '<img fetchpriority="high"')}
${wolken}
${hoehenmesser(s)}
<div class="ae-hero-text">
${pfad(von, s)}
<p class="ae-kicker"><span>Höhenschicht ${s.schicht}</span><span>${esc(s.hoehe)}</span></p>
<h1>${esc(s.label)}</h1>
<p class="ae-unterzeile">${esc(s.unter)}</p>
</div>
</header>`;
}

// Himmel: bildschirmfeste Bildebene hinter dem Text (keine seitenhohe Ebene). Beim Lesen blendet sie zum Bild
// des Abschnitts in Bildschirmmitte über (data-himmel). Abschnitte ohne eigenes Bild lassen den Himmel stehen.
const himmel = (von, b) => `<div class="ae-himmel" aria-hidden="true"><img class="ist-an" src="${zu(von, b.vor)}" alt="" decoding="async"><img alt="" decoding="async"></div>`;
const himmelAttr = (von, b) => b ? ` data-himmel="${zu(von, b.vor)}"` : "";
// Bildnachweis am Abschnittsanfang: nennt das Werk, das gerade den Himmel bildet, und öffnet es groß
const himmelsbild = (von, b, text) => b ? `<button type="button" class="ae-werk-bild ae-himmelsbild" data-gross="${zu(von, b.orig)}" data-vor="${zu(von, b.vor)}" data-titel="${esc(b.titel)}" data-kategorie="${esc(b.kategorie)}" aria-label="Himmelsbild ${esc(b.titel)} groß ansehen"><span>Im Himmel</span>${esc(text ?? b.titel)}</button>` : "";
const windLinie = `<span class="ae-wind" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>`;
const abschnittKopf = (von, nr, titel, id, b, bildtext) => `<header class="ae-kapitel-kopf">
${windLinie}
<span class="ae-nr" aria-hidden="true">${esc(nr)}</span>
<div class="ae-h2"><h2${id ? ` id="${id}"` : ""}>${esc(titel)}</h2></div>
${himmelsbild(von, b, bildtext)}
</header>`;
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
// Jedes Kapitel bekommt ein Bild: als Kopfband (mit Wind) und aufgeklappt als Tafel neben dem Text.
// Verteilung: 1. Zwischenüberschriften mit passendem Bild (Einschub im Text), 2. Kapitel mit passendem Bild,
// 3. restliche Kapitel der Reihe nach mit freien Bildern, 4. übrige Bilder als Einschübe – keine angehängte Galerie.
function kapitelHtml(von, s) {
    const pool = BILDER.filter((b) => s.pool?.(b) && b !== s.heroBild);
    const frei = [...pool];
    const nimm = (b) => { if (b) frei.splice(frei.indexOf(b), 1); return b; };
    const einschub = (b) => werk(von, b, "ae-werk ae-einschub");
    const kaps = [];
    for (const datei of s.info) {
        const liste = kapitel(`${INFO}/${datei}`, P);
        liste.forEach((k, i) => kaps.push({ ...k, datei, letztes: i === liste.length - 1 }));
    }
    for (const k of kaps) {
        k.einschuebe = [];
        k.text = mdLinks(k.html).replace(/<h3>([^<]+)<\/h3>/g, (h3, titel) => {
            const nurText = titel.replace(/&[a-z]+;/g, " ");
            const b = nimm(bildFuer({ nr: (nurText.match(/^[TF]\d+/) ?? [""])[0], titel: nurText }, frei));
            if (b) k.einschuebe.push(b);
            return b ? `${h3}\n${einschub(b)}` : h3;
        });
        // Kapitel mit Bildern an ihren Einzelthemen: Text breiter; der Himmel zeigt ein anderes Werk (kein Bild doppelt)
        if (k.einschuebe.length) k.voll = true;
    }
    for (const k of kaps) if (!k.bild) k.bild = nimm(bildFuer(k, frei));
    // Kapitel ohne freies Bild behalten den Himmel des vorigen Kapitels – kein Werk erscheint zweimal
    for (const k of kaps) if (!k.bild) k.bild = frei.shift() ?? null;
    let j = 0;
    while (frei.length && kaps.length) kaps[j++ % kaps.length].text += "\n" + einschub(frei.shift());

    const html = kaps.map((k, n) => {
        const quelle = k.letztes ? `\n<p class="ae-quelle">Quelle: Info_material · Aerothanen · ${esc(k.datei)}</p>` : "";
        return `<section class="ae-kapitel${k.voll ? " ae-kapitel--voll" : ""}" id="${k.id}"${himmelAttr(von, k.bild)}>
${abschnittKopf(von, k.nr === "◇" ? String(n + 1).padStart(2, "0") : k.nr, k.titel, "", k.bild)}
<div class="ae-text">${k.text}${quelle}</div>
</section>`;
    }).join("\n");
    return { html, anzahl: kaps.length };
}

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
${himmel(von, s.heroBild)}
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
    const panorama = bildVon("Schwebende Stadt über dem Sturmmeer");
    const flugbild = bildVon("Schwebender Leviathan im Gasriesensturm");
    const links = [
        [`${S}/Unterseiten/Heimatwelt/heimatwelt.html`, "Heimatwelt", `${HEIMAT.welt} · ${HEIMAT.system}`, `data-route="${R0}-heimatwelt"`],
        [HEIMAT.dossier, "Planetendossier", HEIMAT.welt, ""],
        ["inhalte/Forschung/Übersicht/Forschung.html", "Forschungsarchiv", "Alle Forschungszweige", ""],
        [GRUPPE.datei, GRUPPE.name, "Alle Spezies dieser Gruppe", `data-route="${GRUPPE.route}"`],
        ["inhalte/spezies/Spezies_übersicht/Spezies.html", "Speziesarchiv", "Alle Gruppen", `data-route="spezies"`],
    ];
    // Steckbrief-Liste („Name – Wert“) als Instrumentenleiste; die Körpergröße bekommt ihre Skala direkt am Wert.
    // „Die Himmelsriesen“ steht schon als Leitspruch im Kopf und entfällt im Text.
    const skala = `<span class="ae-skala" aria-hidden="true"><span class="ae-skala-balken"></span></span>`;
    const text = daten.map((k) => `${k.vorspann ? "" : `<h3>${esc(k.titel)}</h3>`}${mdLinks(k.html)}`).join("\n")
        .replace(/<p>Die Himmelsriesen<\/p>\n?/, "")
        .replace(/<ul>((?:<li>[^<]* – [^<]*<\/li>)+)<\/ul>/, (m, lis) => `<ul class="ae-instrumente">${lis.replace(/<li>([^<]*) – ([^<]*)<\/li>/g, (x, name, wert) => `<li><span class="ae-instrument-name">${name}</span><i class="ae-strich"> – </i><b>${wert}</b>${/Körpergröße/.test(name) ? skala : ""}</li>`)}</ul>`);
    return `<header class="ae-start"${himmelAttr(von, s.heroBild)}>
${wolken}
<div class="ae-start-text">
${pfad(von, s)}
<p class="ae-kicker"><span>Speziesdossier</span><span>${GRUPPE.name}</span></p>
<img class="ae-emblem" src="${zu(von, EMBLEM)}" alt="" width="132" height="132">
<h1 class="ae-wortmarke">Aerothanen</h1>
<p class="ae-claim">Die Himmelsriesen</p>
<a class="ae-aufstieg" href="${zu(von, `${S}/${SEITE.allgemeines.datei}`)}" data-route="${SEITE.allgemeines.route}">Aufstieg beginnen <span aria-hidden="true">↑</span></a>
</div>
<figure class="ae-start-fenster">
<button type="button" class="ae-werk-bild" data-gross="${zu(von, s.heroBild.orig)}" data-vor="${zu(von, s.heroBild.vor)}" data-titel="${esc(s.heroBild.titel)}" data-kategorie="${esc(s.heroBild.kategorie)}" aria-label="${esc(s.heroBild.titel)} in Großansicht öffnen">${bildTag(von, s.heroBild, "", "eager")}</button>
${hoehenmesser(s)}
</figure>
</header>
<div class="ae-inhalt">
<section class="ae-kapitel ae-flugdaten" aria-labelledby="flugdaten-titel"${himmelAttr(von, flugbild)}>
${abschnittKopf(von, "01", "Flugdaten", "flugdaten-titel", flugbild)}
<div class="ae-text">${text}
<p class="ae-quelle">Quelle: Info_material · Aerothanen · ${esc(s.info[0])}</p></div>
</section>
<section class="ae-panorama" aria-labelledby="panorama-titel"${himmelAttr(von, panorama)}>
<div class="ae-panorama-text">
<p class="ae-kicker"><span>Heimatwelt</span><span>${esc(HEIMAT.welt)}</span></p>
<div class="ae-h2"><h2 id="panorama-titel">${esc(panorama.titel)}</h2></div>
<p class="ae-knoepfe"><a class="ae-aufstieg ae-aufstieg--leise" href="${zu(von, `${S}/${SEITE.heimatwelt.datei}`)}" data-route="${SEITE.heimatwelt.route}">Zur Heimatwelt <span aria-hidden="true">↑</span></a>${himmelsbild(von, panorama, "Bild groß ansehen")}</p>
</div>
</section>
<section class="ae-kapitel ae-verweise" aria-labelledby="verweise-titel">
${abschnittKopf(von, "02", "Verknüpfungen", "verweise-titel", null)}
<ul class="ae-wegweiser">${links.map(([h, t, u, r]) => `<li><a href="${zu(von, h)}" ${r}><strong>${esc(t)}</strong><span>${esc(u)}</span></a></li>`).join("")}</ul>
</section>
</div>`;
}

function unterseite(s) {
    return (von) => {
        const k = kapitelHtml(von, s);
        return `${hero(von, s)}
<div class="ae-inhalt">
${k.html}
</div>`;
    };
}

// Heimatwelt: nur die Zusammenfassung – alle Einzelheiten (Heimatwelt-Referenz und Sternensystem) stehen im
// Planetendossier Saelith III (scripts/planeten/heimatwelten/saelith-iii.mjs liest sie aus dem Infomaterial)
const DOSSIER_KAPITEL = [["06 – Atmosphäre", "Atmosphäre"], ["20 – Wolkenschichten", "Wolkenschichten"], ["21 – Stürme", "Stürme"], ["05 – Geografie", "Geografie"], ["10 – Biosphäre", "Biosphäre"], ["11 – Spezies", "Spezies"], ["12 – Zivilisation", "Zivilisation"], ["22 – Sternensystem", "Sternensystem"]];
const SCHICHTEN = [["Äußerer Schleier", "unter 0,1 bar"], ["Silberwolken", "0,1–1 bar"], ["Goldschicht", "1–5 bar"], ["Gemäßigte Schwebezone", "5–12 bar", true], ["Tiefe Sturmzone", "12–40 bar"], ["Hochdruckzone", "über 40 bar"]];
function heimatwelt(von) {
    const s = SEITE.heimatwelt;
    const b1 = bildVon("Kosmischer Wirbelsturm über Gasriesen"), b2 = bildVon("Schwebende Megastadt über dem Sturmriesen"), b3 = bildVon("Leuchtende Welten im Sturmhimmel"), b4 = bildVon("Schwebende Megastadt unter dem Gasriesen");
    const dossierOrdner = path.posix.dirname(path.posix.dirname(HEIMAT.dossier));
    const fakten = [["Planetentyp", "Gasriese mit Ringsystem"], ["Durchmesser", "124.000 km"], ["Schwerkraft", "ca. 1,27 g"], ["Tageslänge", "13,5 Stunden"], ["Jahreslänge", "ca. 4,57 Erdjahre"], ["Zentralstern", "Saelith · K1 V"]];
    return `${hero(von, s)}
<div class="ae-inhalt">
<section class="ae-kapitel" aria-labelledby="welt-titel"${himmelAttr(von, b1)}>
${abschnittKopf(von, "01", `${HEIMAT.welt} – Welt der Himmelsriesen`, "welt-titel", b1)}
<div class="ae-text">
<figure class="ae-planet"><img src="${zu(von, HEIMAT.bild)}" alt="${esc(HEIMAT.welt)}" width="320" height="320" loading="lazy" decoding="async"></figure>
<p>Die Aerothanen stammen von ${esc(HEIMAT.welt)}, dem dritten Hauptplaneten des ${esc(HEIMAT.system)}s. Der gold-blaue Gasriese mit hellem Ringsystem besitzt keine feste Oberfläche – Leben, Siedlungen und Geschichte der Himmelsriesen spielen sich vollständig in seiner Atmosphäre ab.</p>
<p>Ihr Lebensraum ist die gemäßigte Schwebezone: Unter kalten Silberwolken und der goldenen Wolkenschicht schweben sie zwischen gegenläufigen Windbändern, gewaltigen Wirbeln und leuchtenden Mikroorganismen.</p>
<ul class="ae-instrumente">${fakten.map(([n, w]) => `<li><span class="ae-instrument-name">${esc(n)}</span><i class="ae-strich" aria-hidden="true"></i><b>${esc(w)}</b></li>`).join("")}</ul>
</div>
</section>
<section class="ae-kapitel" aria-labelledby="profil-titel"${himmelAttr(von, b2)}>
${abschnittKopf(von, "02", "Höhenprofil der Atmosphäre", "profil-titel", b2)}
<div class="ae-text">
<p>Je tiefer, desto dichter, wärmer und stürmischer. Nur eine Schicht bietet den Himmelsriesen Halt – dort, wo Druck, Wärme und Nahrung zusammenpassen.</p>
<ol class="ae-profil">${SCHICHTEN.map(([n, d, hier]) => `<li${hier ? ' class="ist-hier"' : ""}><b>${esc(n)}</b><span>${esc(d)}</span>${hier ? "<small>Lebensraum der Aerothanen · 240–340 K</small>" : ""}</li>`).join("")}</ol>
</div>
</section>
<section class="ae-kapitel" aria-labelledby="nachbarn-titel"${himmelAttr(von, b3)}>
${abschnittKopf(von, "03", "Zwei Spezies, ein Stern", "nachbarn-titel", b3)}
<div class="ae-text">
<p>${esc(HEIMAT.welt)} teilt das ${esc(HEIMAT.system)} mit Osselyr, der Heimat der Floranoiden. Beide Spezies entstanden unabhängig voneinander und können die Welt der anderen nur mit technischen Schutzsystemen betreten – verbunden sind sie durch Forschung, Wissensaustausch und möglichen Handel.</p>
<p class="ae-knoepfe"><a href="${zu(von, "inhalte/himmelskoerper/planeten/details/osselyr/hauptseite/index.html")}">Osselyr ›</a><a href="${zu(von, HEIMAT.karte)}">Sternenkarte ›</a></p>
</div>
</section>
<section class="ae-kapitel" aria-labelledby="dossier-titel"${himmelAttr(von, b4)}>
${abschnittKopf(von, "04", "Im Planetendossier weiterlesen", "dossier-titel", b4)}
<div class="ae-text">
<p>Alle Einzelheiten zu ${esc(HEIMAT.welt)} – Bahn, Physik, Wolkenschichten, Regionen, Lebensformen und das ganze ${esc(HEIMAT.system)} – stehen im Planetendossier.</p>
<ul class="ae-wegweiser"><li><a href="${zu(von, HEIMAT.dossier)}"><strong>Planetendossier</strong><span>${esc(HEIMAT.welt)} · Hauptseite</span></a></li>${DOSSIER_KAPITEL.map(([o, t]) => `<li><a href="${zu(von, `${dossierOrdner}/unterseiten/${o}/index.html`)}"><strong>${esc(t)}</strong><span>Kapitel ${o.slice(0, 2)}</span></a></li>`).join("")}</ul>
</div>
</section>
</div>`;
}
// ---------- Medien: Ordner werden beim Bauen gelesen – neue Dateien erscheinen nach erneutem Ausführen ----------
const AUDIO = "assets/audio/Alle Spezies+Übersicht/Gigantische Lebensformen/Aerothanen";
const VIDEO = "assets/videos/Alle Spezies+Übersicht/Gigantische Lebensformen/Aerothanen";
const MODELLE = "assets/Modelle/Alle Spezies+Übersicht/Gigantische Lebensformen/Aerothanen";
const NAMEN = { koerpergeraeusche: "Körpergeräusche", kommunikation: "Kommunikation", hintergrundmusik: "Hintergrundmusik", kulturelle_musik: "Kulturelle Musik", musik: "Musik", Forschung: "Forschung", Gameplay: "Gameplay" };
const schoen = (n) => NAMEN[n] ?? n.replace(/[_-]+/g, " ").replace(/^\w/, (c) => c.toUpperCase());
const dateiTitel = (f) => path.basename(f).replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
function baum(ordner) {
    const voll = path.join(ROOT, ordner);
    if (!fs.existsSync(voll)) return [];
    return fs.readdirSync(voll, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? baum(`${ordner}/${e.name}`) : e.name.startsWith(".") ? [] : [`${ordner}/${e.name}`]);
}
function blaetter(ordner) {   // unterste Ordner = Kategorien (auch leere)
    const voll = path.join(ROOT, ordner);
    if (!fs.existsSync(voll)) return [];
    const unter = fs.readdirSync(voll, { withFileTypes: true }).filter((e) => e.isDirectory());
    return unter.length ? unter.flatMap((e) => blaetter(`${ordner}/${e.name}`)) : [ordner];
}
const AUDIO_KATS = blaetter(AUDIO).map((o) => ({ ordner: o, name: schoen(path.posix.basename(o)), oben: path.posix.relative(AUDIO, o).includes("/") ? schoen(path.posix.relative(AUDIO, o).split("/")[0]) : "", dateien: baum(o).filter((f) => /\.(mp3|wav|ogg|m4a)$/i.test(f)) }));
const VIDEOS = baum(VIDEO).filter((f) => /\.(mp4|webm|mov)$/i.test(f));
const MODELL_DATEIEN = baum(MODELLE).filter((f) => /\.(glb|gltf)$/i.test(f));
const ASSET_DATEIEN = baum(MODELLE).filter((f) => !/\.(glb|gltf)$/i.test(f));

function medien(von) {
    const s = SEITE.medien;
    const kats = [...new Set(BILDER.map((b) => b.kategorie))];
    const erstes = BILDER[0];
    const klaenge = AUDIO_KATS.reduce((n, k) => n + k.dateien.length, 0);
    const ordnerHinweis = (o) => `<p class="ae-ordner"><span>Ordner</span><code>${esc(o)}</code></p>`;
    const welle = `<span class="ae-welle" aria-hidden="true">${Array.from({ length: 28 }, (_, i) => `<i style="--h:${(28 + 62 * Math.abs(Math.sin(i * 1.7))).toFixed(0)}%;--v:${(i * 0.09).toFixed(2)}s"></i>`).join("")}</span>`;
    return `${hero(von, s)}<div class="ae-inhalt ae-medien">
<section class="ae-karussell" id="bildarchiv" aria-labelledby="bildarchiv-titel">
<div class="ae-h2"><h2 id="bildarchiv-titel"><span>Bild-Karussell</span></h2><small>${BILDER.length} Bilder</small></div>
<div class="ae-filter" role="group" aria-label="Bilder filtern"><button type="button" aria-pressed="true" data-filter="">Alle <small>${BILDER.length}</small></button>${kats.map((k) => `<button type="button" aria-pressed="false" data-filter="${esc(k)}">${esc(k)} <small>${BILDER.filter((b) => b.kategorie === k).length}</small></button>`).join("")}</div>
<div class="ae-buehne">
<img class="ae-buehne-hintergrund" src="${zu(von, erstes.vor)}" alt="" aria-hidden="true">
<span class="ae-wind" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>
<button type="button" class="ae-buehne-knopf" data-buehne="-1" aria-label="Vorheriges Bild">‹</button>
<figure class="ae-buehne-bild"><button type="button" class="ae-buehne-gross" aria-label="Bild in Großansicht öffnen"><img src="${zu(von, erstes.vor)}" alt="${esc(erstes.titel)}" width="${erstes.w}" height="${erstes.h}"></button>
<figcaption><span class="ae-buehne-kategorie">${esc(erstes.kategorie)}</span><strong>${esc(erstes.titel)}</strong><span class="ae-buehne-zaehler">1 / ${BILDER.length}</span></figcaption></figure>
<button type="button" class="ae-buehne-knopf" data-buehne="1" aria-label="Nächstes Bild">›</button>
</div>
<div class="ae-daumen" aria-label="Alle Bilder">${BILDER.map((b, i) => `<button type="button" class="ae-daumen-bild" data-index="${i}" data-kategorie="${esc(b.kategorie)}" data-vor="${zu(von, b.vor)}" data-gross="${zu(von, b.orig)}" data-titel="${esc(b.titel)}" aria-label="${esc(b.titel)}"${i === 0 ? ' aria-current="true"' : ""}><img src="${zu(von, b.vor)}" alt="" loading="lazy" decoding="async" width="${b.w}" height="${b.h}"></button>`).join("")}</div>
</section>

<section class="ae-medienfeld" id="klangarchiv" aria-labelledby="klang-titel">
<div class="ae-h2"><h2 id="klang-titel"><span>Klangarchiv</span></h2><small>${klaenge} Klänge in ${AUDIO_KATS.length} Kategorien</small></div>
<div class="ae-klang-raster">${AUDIO_KATS.map((k) => `<article class="ae-klang">
<header><p class="ae-kicker">${k.oben ? `<span>${esc(k.oben)}</span>` : ""}<span>${k.dateien.length} ${k.dateien.length === 1 ? "Klang" : "Klänge"}</span></p><h3>${esc(k.name)}</h3></header>
${k.dateien.length ? `<ol class="ae-spur">${k.dateien.map((f) => `<li><span>${esc(dateiTitel(f))}</span><audio controls preload="none" src="${zu(von, f)}"></audio></li>`).join("")}</ol>` : `${welle}<p class="ae-leise">Bereit für Klänge – Dateien (MP3, WAV, OGG) in diesen Ordner legen und das Bauskript ausführen.</p>${ordnerHinweis(k.ordner)}`}
</article>`).join("\n")}</div>
</section>

<section class="ae-medienfeld" id="video" aria-labelledby="video-titel">
<div class="ae-h2"><h2 id="video-titel"><span>Animationen und Video</span></h2><small>${VIDEOS.length} Videos</small></div>
${VIDEOS.length ? `<div class="ae-video-raster">${VIDEOS.map((f) => `<figure class="ae-video"><video controls preload="metadata" playsinline src="${zu(von, f)}"></video><figcaption>${esc(dateiTitel(f))}</figcaption></figure>`).join("")}</div>`
        : `<div class="ae-bildschirm"><img src="${zu(von, bildVon("Kosmischer Wirbelsturm über Gasriesen").vor)}" alt="" loading="lazy" decoding="async"><span class="ae-wind" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span><span class="ae-play" aria-hidden="true">▶</span>
<div class="ae-bildschirm-text"><p class="ae-kicker"><span>Bewegtbild</span><span>16:9</span></p><p>Bereit für Animationen und Videos (MP4, WebM).</p>${ordnerHinweis(VIDEO)}</div></div>`}
</section>

<section class="ae-medienfeld" id="modelle" aria-labelledby="modelle-titel">
<div class="ae-h2"><h2 id="modelle-titel"><span>3D-Modelle und 360°-Ansicht</span></h2><small>${MODELL_DATEIEN.length} Modelle</small></div>
${MODELL_DATEIEN.length ? `<div class="ae-modell-raster">${MODELL_DATEIEN.map((f) => `<figure class="ae-modell" data-modell="${zu(von, f)}" data-titel="${esc(dateiTitel(f))}"><div class="ae-modell-buehne"><button type="button" class="ae-modell-laden">3D-Modell laden</button></div><figcaption>${esc(dateiTitel(f))}</figcaption></figure>`).join("")}</div>`
        : `<div class="ae-holo"><div class="ae-holo-kugel" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
<div><p class="ae-kicker"><span>Modellansicht</span><span>GLB · GLTF</span></p><p>Bereit für drehbare 3D-Modelle mit 360°-Ansicht – die Ansicht lädt erst beim Antippen.</p>${ordnerHinweis(MODELLE)}</div></div>`}
</section>

<section class="ae-medienfeld" id="assets" aria-labelledby="assets-titel">
<div class="ae-h2"><h2 id="assets-titel"><span>Digitale Assets</span></h2><small>${ASSET_DATEIEN.length} Dateien</small></div>
${ASSET_DATEIEN.length ? `<ul class="ae-asset-liste">${ASSET_DATEIEN.map((f) => `<li><a href="${zu(von, f)}" download><strong>${esc(path.basename(f))}</strong><span>${esc(path.extname(f).slice(1).toUpperCase())}</span></a></li>`).join("")}</ul>`
        : `<div class="ae-panel ae-asset-leer"><p class="ae-kicker"><span>Downloads</span><span>FBX · Blend · Texturen</span></p><p>Bereit für Quelldateien und Texturen zum Herunterladen.</p>${ordnerHinweis(MODELLE)}</div>`}
</section>
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
.ae-frame { display: flex; }
.ae-frame > [data-aporia-sidebar] { flex: 0 0 auto; }
.ae-main { flex: 1 1 auto; min-width: 0; padding-bottom: 2rem; }

/* Kicker, Überschriften */
.ae-kicker { display: flex; flex-wrap: wrap; gap: .4rem 1rem; margin: 0; font: 700 .7rem/1.3 var(--ae-sans); letter-spacing: .24em; text-transform: uppercase; color: var(--ae-tuerkis); }
.ae-kicker span + span::before { content: "·"; margin-right: 1rem; color: var(--ae-leise); }
.ae-h2 { display: flex; align-items: baseline; flex-wrap: wrap; gap: .3rem 1rem; margin: 0 0 1.2rem; font: 400 clamp(1.5rem, 3vw, 2.2rem)/1.15 var(--ae-serif); letter-spacing: .04em; }
.ae-h2 h2 { margin: 0; font: inherit; letter-spacing: inherit; }
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

/* Himmel: bildschirmfeste Bildebene hinter allem (position: fixed – keine seitenhohe Ebene, nicht endlos animiert) */
.ae-himmel { position: fixed; inset: 0; z-index: -1; pointer-events: none; background: var(--ae-nacht); }
.ae-himmel img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 1.4s ease; }
.ae-himmel img.ist-an { opacity: 1; }
.ae-himmel::after { content: ""; position: absolute; inset: 0; background: linear-gradient(0deg, #0b0d1cb3, transparent 38%), linear-gradient(90deg, #0b0d1c99, #0b0d1c33 55%, #0b0d1c14); }
.ae-main { overflow-x: clip; }

/* Wind: feine Luftströme (nur so groß wie ihr Band) */
.ae-wind { position: absolute; inset: 0; z-index: 1; overflow: hidden; pointer-events: none; }
.ae-wind i { position: absolute; left: -40%; width: 38%; height: 1px; border-radius: 1px; background: linear-gradient(90deg, transparent, #f4ecf3cc 45%, #c9e9ff 55%, transparent); opacity: 0; animation: ae-windstoss 7s linear infinite; }
.ae-wind i:nth-child(1) { top: 22%; animation-delay: 0s; }
.ae-wind i:nth-child(2) { top: 41%; width: 52%; animation-delay: 1.6s; animation-duration: 9s; }
.ae-wind i:nth-child(3) { top: 58%; width: 30%; animation-delay: 3.1s; }
.ae-wind i:nth-child(4) { top: 73%; width: 46%; animation-delay: 4.4s; animation-duration: 8s; }
.ae-wind i:nth-child(5) { top: 33%; width: 24%; animation-delay: 5.7s; animation-duration: 6s; }
@keyframes ae-windstoss { 0% { transform: translateX(0) translateY(0); opacity: 0; } 12% { opacity: .75; } 70% { opacity: .5; } 100% { transform: translateX(380%) translateY(-14px); opacity: 0; } }

/* Fluss: Abschnitte gehen ohne Kästen ineinander über; zwischen ihnen öffnet sich der Himmel */
.ae-inhalt { max-width: 104rem; margin: 0 auto; padding: 0 clamp(1rem, 5vw, 5rem) clamp(3rem, 8vh, 6rem); }
.ae-inhalt > * { min-width: 0; }
.ae-kapitel { --luft: clamp(7rem, 34vh, 18rem); position: relative; isolation: isolate; max-width: 60rem; padding-top: var(--luft); scroll-margin-top: calc(var(--aporia-topbar-height, 78px) + 3.4rem); }
.ae-kapitel:first-child { --luft: clamp(2.6rem, 7vw, 5rem); }
/* weicher Dunst hinter dem Text – ohne Rand, an allen Seiten auslaufend */
.ae-kapitel::before { content: ""; position: absolute; z-index: -1; top: calc(var(--luft) - 4.5rem); bottom: -3.5rem; left: -6rem; right: -6rem; background: #0b0d1cd9; pointer-events: none;
    -webkit-mask-image: linear-gradient(90deg, transparent, #000 6rem, #000 calc(100% - 6rem), transparent), linear-gradient(180deg, transparent, #000 4.5rem, #000 calc(100% - 3.5rem), transparent);
    -webkit-mask-composite: source-in; mask-image: linear-gradient(90deg, transparent, #000 6rem, #000 calc(100% - 6rem), transparent), linear-gradient(180deg, transparent, #000 4.5rem, #000 calc(100% - 3.5rem), transparent); mask-composite: intersect; }
.ae-kapitel-kopf { position: relative; display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: end; gap: .4rem 1.2rem; margin-bottom: 1.6rem; padding-bottom: 1.1rem; }
.ae-kapitel-kopf::after { content: ""; position: absolute; left: 0; right: -40vw; bottom: 0; height: 1px; background: linear-gradient(90deg, var(--ae-rose), #c9a6ff88 25%, transparent 70%); }
.ae-kapitel-kopf .ae-wind { inset: auto -40vw -1.4rem 0; height: 3rem; }
.ae-nr { font: 400 clamp(2.6rem, 6vw, 4.8rem)/.85 var(--ae-serif); letter-spacing: .02em; background: var(--ae-schillern); -webkit-background-clip: text; background-clip: text; color: transparent; }
.ae-kapitel-kopf .ae-h2 { margin: 0; font-size: clamp(1.55rem, 3.4vw, 2.6rem); }
.ae-werk-bild.ae-himmelsbild { grid-column: 1 / -1; justify-self: start; display: inline-flex; align-items: baseline; gap: .6rem; width: auto; max-width: 100%; aspect-ratio: auto; padding: .32rem .85rem; border: 1px solid #f4ecf333; border-radius: 999px; background: #0b0d1c66; color: var(--ae-leise); font: 500 .78rem/1.3 var(--ae-sans); text-align: left; overflow: visible; }
.ae-himmelsbild span { flex: 0 0 auto; font: 700 .6rem var(--ae-sans); letter-spacing: .2em; text-transform: uppercase; color: var(--ae-tuerkis); }
.ae-werk-bild.ae-himmelsbild:hover { color: var(--ae-perl); border-color: #e8b48a88; }
.ae-panel { border: 1px solid var(--ae-linie); border-radius: 18px; background: linear-gradient(160deg, #1a1b3ae6, #0d0f22f2); padding: clamp(1rem, 2.5vw, 1.6rem); }
.ae-knoepfe { display: flex; flex-wrap: wrap; align-items: center; gap: .6rem; margin: 1rem 0 0; }
.ae-knoepfe > a:not(.ae-aufstieg) { padding: .45rem .95rem; border: 1px solid #f4ecf344; border-radius: 999px; color: var(--ae-perl); text-decoration: none; font-size: .88rem; }
.ae-knoepfe > a:not(.ae-aufstieg):hover { background: #f4ecf31a; }
.ae-knoepfe .ae-himmelsbild { grid-column: auto; }
/* Wegweiser: Verweise als Linien statt Kacheln */
.ae-wegweiser { list-style: none; margin: 1.2rem 0 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 14rem), 1fr)); gap: 0 2rem; }
.ae-text ul.ae-wegweiser { border: 0; padding: 0; }
.ae-text ul.ae-wegweiser li { padding: 0; border: 0; }
.ae-text ul.ae-wegweiser li::before { display: none; }
.ae-wegweiser a { display: grid; gap: .15rem; padding: .85rem 0 .9rem; border-top: 1px solid #c9a6ff40; text-decoration: none; transition: border-color .2s; }
.ae-wegweiser a:hover { border-top-color: var(--ae-rose); }
.ae-wegweiser strong { color: var(--ae-perl); font: 400 1.15rem var(--ae-serif); letter-spacing: .02em; }
.ae-wegweiser a:hover strong { color: var(--ae-rose); }
.ae-wegweiser span { color: var(--ae-leise); font-size: .84rem; }
/* Instrumentenleiste: Kennwerte frei über dem Himmel, getrennt nur durch feine Linien */
.ae-text ul.ae-instrumente { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 11.5rem), 1fr)); gap: 0 2rem; margin: 1.6rem 0 2rem; padding: 0; border: 0; }
.ae-text ul.ae-instrumente li { max-width: none; padding: .9rem 0 1rem; border: 0; border-top: 1px solid #c9a6ff44; }
.ae-text ul.ae-instrumente li::before { display: none; }
.ae-instrument-name { display: block; font: 700 .64rem var(--ae-sans); letter-spacing: .2em; text-transform: uppercase; color: var(--ae-tuerkis); }
.ae-strich { display: block; width: 1.6rem; height: 2px; margin: .5rem 0 .55rem; background: var(--ae-schillern); font-size: 0; color: transparent; overflow: hidden; }
.ae-instrumente b { display: block; font: 400 clamp(1.1rem, 2vw, 1.45rem)/1.25 var(--ae-serif); color: var(--ae-perl); }
.ae-skala { position: relative; display: block; height: 2.2rem; margin-top: .8rem; border-bottom: 1px solid #f4ecf344; background: repeating-linear-gradient(90deg, #f4ecf333 0 1px, transparent 1px 10%); }
.ae-skala-balken { position: absolute; bottom: 0; left: 16.6%; right: 0; height: 62%; border-radius: 6px 6px 0 0; background: var(--ae-schillern); box-shadow: 0 0 20px #c9a6ff55; }

/* Text mit Gestaltungselementen */
.ae-text { min-width: 0; font-size: 1.03rem; }
.ae-text > :first-child { margin-top: 0; }
.ae-text > p:first-of-type { font-size: 1.13rem; color: var(--ae-perl); }
.ae-text p, .ae-text li { max-width: 74ch; }
.ae-text h3 { position: relative; margin: 2rem 0 .7rem; padding-left: 2.2rem; font: 400 1.25rem/1.3 var(--ae-serif); color: var(--ae-rose); }
.ae-text h3::before { content: ""; position: absolute; left: 0; top: .62em; width: 1.6rem; height: 2px; background: var(--ae-schillern); box-shadow: 0 0 10px #c9a6ff88; }
.ae-text ul { list-style: none; display: grid; gap: 0; margin: .6rem 0 1.1rem; padding: .2rem 0; border-left: 2px solid transparent; border-image: var(--ae-schillern) 1; }
.ae-text ul li { position: relative; padding: .45rem .4rem .45rem 2rem; border-bottom: 1px solid #c9a6ff1a; }
.ae-text ul li::before { content: ""; position: absolute; left: .85rem; top: 1.05em; width: .7rem; height: 2px; background: var(--ae-tuerkis); box-shadow: 4px -4px 0 -0.5px #78e0ea66; transform: translateY(-50%); }
.ae-text ol { margin: .8rem 0 1.1rem; padding-left: 1.4rem; display: grid; gap: .35rem; }
.ae-text ol li::marker { color: var(--ae-rose); font-weight: 700; }
.ae-fakten { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 13rem), 1fr)); gap: 0 1.8rem; margin: 1.2rem 0; }
.ae-fakten div { padding: .75rem 0 .85rem; border-top: 1px solid #c9a6ff44; }
.ae-fakten dt { font: 700 .64rem var(--ae-sans); letter-spacing: .18em; text-transform: uppercase; color: var(--ae-tuerkis); }
.ae-fakten dd { margin: .25rem 0 0; color: var(--ae-perl); }
.ae-tabelle { overflow-x: auto; margin: 1.2rem 0; }
.ae-tabelle table { width: 100%; border-collapse: collapse; font-size: .92rem; }
.ae-tabelle th, .ae-tabelle td { padding: .6rem .75rem .6rem 0; border-bottom: 1px solid #c9a6ff2e; text-align: left; vertical-align: top; }
.ae-tabelle th { color: var(--ae-tuerkis); font: 700 .7rem var(--ae-sans); letter-spacing: .14em; text-transform: uppercase; border-bottom-color: #c9a6ff66; }
.ae-text strong { color: var(--ae-perl); }
.ae-text .ae-kicker { margin: 0 0 .6rem; }
.ae-quelle { margin: 1.6rem 0 0; font-size: .74rem; color: var(--ae-leise); }

/* Werke (Bilder): immer im eigenen Seitenverhältnis – nichts wird abgeschnitten */
.ae-werk { margin: 0; }
.ae-werk-bild { display: block; width: 100%; padding: 0; border: 0; border-radius: 12px; overflow: hidden; background: #07080f; cursor: zoom-in; aspect-ratio: var(--ar); }
.ae-werk-bild img { display: block; width: 100%; height: 100%; object-fit: contain; transition: transform .6s cubic-bezier(.2, .7, .2, 1); }
.ae-werk-bild:hover img { transform: scale(1.025); }
.ae-werk figcaption { display: grid; gap: .1rem; padding: .55rem .2rem 0; }
.ae-werk figcaption strong { font: 500 .88rem/1.3 var(--ae-sans); color: var(--ae-perl); }
.ae-werk figcaption span { font: 700 .62rem var(--ae-sans); letter-spacing: .16em; text-transform: uppercase; color: var(--ae-leise); }
/* Einschub: Bild neben seinem Thema; auf breiten Fenstern ragt es aus der Textspalte in den Himmel */
.ae-einschub { float: right; width: min(46%, 24rem); margin: .3rem 0 1.2rem 1.8rem; }
.ae-einschub .ae-werk-bild { background: transparent; border-radius: 16px; box-shadow: 0 0 0 1px #f4ecf322, 0 26px 60px #000a, 0 0 50px #c9a6ff1f; }
.ae-text::after { content: ""; display: block; clear: both; }
.ae-kapitel--voll .ae-text p, .ae-kapitel--voll .ae-text li { max-width: 80ch; }
.ae-text { container-type: inline-size; }
@container (max-width: 40rem) {
    .ae-einschub { float: none; width: 100%; max-width: 30rem; margin: .4rem 0 1.2rem; }
}
@media (min-width: 1400px) {
    .ae-einschub { width: min(52%, 28rem); margin-right: clamp(-18rem, -14vw, -6rem); }
}
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
.ae .aporia-kapitel { --kapitel-akzent: #e8b48a; --kapitel-nacht: #0b0d1c; --kapitel-text: #f4ecf3; max-width: 104rem; margin: 1rem auto 0; padding: 0 clamp(.8rem, 3vw, 2rem); }

/* Handy und schmale Fenster */
@media (max-width: 760px) {
    .ae { background-attachment: scroll; }
    .ae-himmel::after { background: linear-gradient(0deg, #0b0d1c99, #0b0d1c40 50%, #0b0d1c66); }
    .ae-hero { min-height: 62svh; }
    .ae-hero::after { background: linear-gradient(0deg, #0b0d1c 0%, #0b0d1cb8 40%, #0b0d1c26 78%, #0b0d1c80); }
    .ae-hoehenmesser { top: 18%; bottom: 30%; right: .7rem; }
    .ae-hoehenmarke { font-size: .62rem; right: 26px; }
    .ae-inhalt { padding-inline: 1rem; }
    .ae-kapitel { --luft: 40svh; }
    .ae-kapitel::before { left: -1rem; right: -1rem; top: calc(var(--luft) - 3.5rem);
        -webkit-mask-image: linear-gradient(180deg, transparent, #000 3.5rem, #000 calc(100% - 3rem), transparent); mask-image: linear-gradient(180deg, transparent, #000 3.5rem, #000 calc(100% - 3rem), transparent); }
    .ae-kapitel-kopf { gap: .3rem .8rem; }
    .ae-einschub { float: none; width: 100%; margin: .4rem 0 1.1rem; }
    .ae-text { font-size: 1rem; }
    .ae-text h3 { padding-left: 1.8rem; }
    .ae-text h3::before { width: 1.2rem; }
    .ae-werk figcaption strong { font-size: .8rem; }
    .ae-gross figure { padding: 3.4rem .6rem .8rem; }
    .ae-gross-knopf { width: 2.4rem; height: 2.4rem; font-size: 1.4rem; background: #0b0d1c99; }
    .ae-gross-zurueck { left: .3rem; } .ae-gross-weiter { right: .3rem; }
}
@media (prefers-reduced-motion: reduce) {
    .ae-wolken i, .ae-wind i { animation: none; }
    .ae-wind { display: none; }
    .ae-himmel img, .ae-werk-bild img { transition: none; }
}
`;

const SEITEN_CSS = {
    uebersicht: `/* Übersicht · Wolkendecke – Startfenster mit Wortmarke, danach Flugdaten, Panorama und Wegweiser im Himmel */
.ae-start { position: relative; isolation: isolate; display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, .9fr); align-items: center; gap: clamp(1rem, 4vw, 3rem); min-height: calc(100svh - var(--aporia-topbar-height, 78px) - 3.2rem); padding: clamp(1.4rem, 4vw, 3.4rem) clamp(1rem, 5vw, 5rem); overflow: hidden; }
.ae-start::after { content: ""; position: absolute; inset: 0; z-index: -1; background: radial-gradient(ellipse 70% 60% at 30% 55%, #0b0d1c4d, #0b0d1cb3 80%); }
.ae-start-text { position: relative; z-index: 3; display: grid; gap: .8rem; justify-items: start; min-width: 0; container-type: inline-size; }
.ae-emblem { width: clamp(84px, 11vw, 132px); height: auto; aspect-ratio: 1; border-radius: 50%; object-fit: cover; box-shadow: 0 0 0 1px #f2c7a588, 0 0 0 8px #c9a6ff14, 0 0 50px #c9a6ff66; animation: ae-schweben 9s ease-in-out infinite; }
@keyframes ae-schweben { 50% { transform: translateY(-8px); } }
.ae-wortmarke { margin: 0; font: 400 min(6.4rem, 13.5cqi)/.95 var(--ae-serif); letter-spacing: .1em; text-transform: uppercase; background: var(--ae-schillern); background-size: 200% 100%; -webkit-background-clip: text; background-clip: text; color: transparent; animation: ae-schillern 14s ease-in-out infinite; }
@keyframes ae-schillern { 50% { background-position: 100% 0; } }
.ae-claim { margin: 0; font: 400 clamp(1.3rem, 2.6vw, 2rem) var(--ae-serif); letter-spacing: .3em; text-transform: uppercase; color: var(--ae-rose); }
.ae-aufstieg { display: inline-flex; align-items: center; gap: .6rem; margin-top: .6rem; padding: .85rem 1.5rem; border-radius: 999px; background: var(--ae-schillern); color: var(--ae-nacht) !important; font: 700 .85rem var(--ae-sans); letter-spacing: .14em; text-transform: uppercase; text-decoration: none; box-shadow: 0 12px 30px #c9a6ff44; transition: transform .25s; }
.ae-aufstieg:hover { transform: translateY(-3px); }
.ae-aufstieg--leise { margin-top: 0; background: #0b0d1ccc; color: var(--ae-perl) !important; border: 1px solid #f2c7a588; box-shadow: none; }
.ae-start-fenster { position: relative; z-index: 2; justify-self: center; width: min(100%, 26rem); margin: 0; }
.ae-start-fenster .ae-werk-bild { aspect-ratio: 2 / 3; border-radius: 999px 999px 24px 24px; box-shadow: 0 0 0 1px #f2c7a566, 0 30px 80px #000a, 0 0 70px #c9a6ff33; }
.ae-start-fenster .ae-werk-bild img { object-fit: cover; }
.ae-start-fenster .ae-hoehenmesser { right: -1.6rem; }
/* Panorama: ein offenes Wolkenfenster – der Himmel zeigt die schwebende Stadt, darüber nur Titel und Weg */
.ae-panorama { position: relative; display: grid; align-items: end; min-height: clamp(26rem, 86vh, 52rem); padding-bottom: clamp(1rem, 4vh, 3rem); }
.ae-panorama-text { display: grid; gap: .7rem; justify-items: start; max-width: 42rem; text-shadow: 0 2px 18px #000c; }
.ae-panorama .ae-h2 { margin: 0; font-size: clamp(1.8rem, 4.4vw, 3.4rem); }
.ae-panorama .ae-knoepfe { margin: .4rem 0 0; }
@media (max-width: 860px) {
    .ae-start { grid-template-columns: minmax(0, 1fr); min-height: 0; }
    .ae-start-fenster { width: min(78%, 20rem); order: -1; }
    .ae-start-fenster .ae-hoehenmesser { right: -1.1rem; }
    .ae-panorama { min-height: 70svh; }
}
@media (prefers-reduced-motion: reduce) { .ae-emblem, .ae-wortmarke { animation: none; } }
`,
    heimatwelt: `/* Heimatwelt · Zusammenfassung zu Saelith III – Planet, Höhenprofil, Nachbarn, Weg ins Dossier */
.ae-planet { position: relative; float: right; width: min(40%, 20rem); aspect-ratio: 1; margin: .2rem 0 1.4rem 2.2rem; }
.ae-planet img { display: block; width: 100%; height: 100%; border-radius: 50%; object-fit: cover; box-shadow: 0 0 0 1px #78e0ea55, 0 0 70px #78e0ea33, inset -30px -20px 60px #000a; }
.ae-planet::after { content: ""; position: absolute; left: -24%; right: -24%; top: 41%; height: 18%; border-radius: 50%; border: 2px solid #f4ecf355; box-shadow: 0 0 0 7px #e8b48a1c, 0 0 30px #c9a6ff33; transform: rotate(-14deg); pointer-events: none; }
@media (min-width: 1400px) { .ae-planet { margin-right: clamp(-16rem, -12vw, -5rem); width: min(44%, 24rem); } }
.ae-text ol.ae-profil { list-style: none; margin: 1.6rem 0 .6rem; padding: 0; display: grid; gap: 0; border-left: 2px solid transparent; border-image: linear-gradient(#78e0ea00, #78e0ea, #e8b48a 60%, #b8573a) 1; }
.ae-profil li { position: relative; display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: baseline; gap: .2rem 1rem; max-width: none; padding: .9rem .4rem .9rem 1.8rem; border-bottom: 1px solid #c9a6ff1f; }
.ae-profil li::before { content: ""; position: absolute; left: -7px; top: 1.45rem; width: 12px; height: 12px; border-radius: 50%; background: var(--ae-nacht); border: 2px solid var(--ae-leise); }
.ae-profil b { font: 400 1.18rem var(--ae-serif); color: var(--ae-perl); }
.ae-profil span { font: 700 .72rem var(--ae-sans); letter-spacing: .12em; color: var(--ae-leise); white-space: nowrap; }
.ae-profil .ist-hier { padding-block: 1.3rem; background: linear-gradient(90deg, #e8b48a2e, transparent 85%); }
.ae-profil .ist-hier::before { top: 1.85rem; background: var(--ae-rose); border-color: var(--ae-rose); box-shadow: 0 0 16px var(--ae-rose); }
.ae-profil .ist-hier b { font-size: 1.4rem; color: var(--ae-rose); }
.ae-profil small { grid-column: 1 / -1; font: 700 .64rem var(--ae-sans); letter-spacing: .2em; text-transform: uppercase; color: var(--ae-tuerkis); }
@media (max-width: 760px) { .ae-planet { float: none; width: min(70%, 15rem); margin: .4rem auto 1.8rem; } }
`,
    technologien: `/* Technologien · Bauplan-Anmutung: Kapitelnummern in Sturmlicht-Bronze */
.ae-seite-technologien .ae-nr { background: linear-gradient(100deg, #f4ecf3, #e8b48a 45%, #b88a5c); -webkit-background-clip: text; background-clip: text; }
`,
    forschung: `/* Forschung · Laborlicht: Kapitelnummern in Türkis */
.ae-seite-forschung .ae-nr { background: linear-gradient(100deg, #f4ecf3, #78e0ea 50%, #c9a6ff); -webkit-background-clip: text; background-clip: text; }
`,    medien: `/* Medien · Bild-Karussell, Klangarchiv, Bewegtbild, 3D und Assets */
.ae-medien { gap: clamp(2rem, 4vw, 3.4rem); }
.ae-inhalt > * { min-width: 0; }
.ae-buehne-bild { width: 100%; }
.ae-filter { display: flex; flex-wrap: wrap; gap: .4rem; margin-bottom: 1rem; }
.ae-filter button { padding: .45rem .9rem; border: 1px solid #c9a6ff55; border-radius: 999px; background: #0b0d1c99; color: var(--ae-perl); font: 700 .72rem var(--ae-sans); letter-spacing: .08em; cursor: pointer; }
.ae-filter button small { opacity: .7; margin-left: .2rem; }
.ae-filter button[aria-pressed="true"] { background: var(--ae-schillern); color: var(--ae-nacht); border-color: transparent; }

/* Karussell-Bühne: das Bild groß, dahinter dasselbe Motiv weich als Himmel, mit Wind */
.ae-buehne { position: relative; isolation: isolate; display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 1rem; min-height: clamp(22rem, 62vh, 42rem); padding: clamp(1rem, 3vw, 2.4rem); border: 1px solid var(--ae-linie); border-radius: 24px; overflow: hidden; }
.ae-buehne-hintergrund { position: absolute; inset: -10%; z-index: -2; width: 120%; height: 120%; object-fit: cover; filter: blur(30px) saturate(1.3) brightness(.5); transition: opacity .5s; }
.ae-buehne::after { content: ""; position: absolute; inset: 0; z-index: -1; background: radial-gradient(ellipse at center, transparent 30%, #0b0d1ccc 100%); }
.ae-buehne-bild { position: relative; z-index: 2; display: grid; justify-items: center; gap: .8rem; margin: 0; min-width: 0; }
.ae-buehne-gross { display: block; max-width: 100%; padding: 0; border: 0; background: none; cursor: zoom-in; }
.ae-buehne-gross img { display: block; max-width: 100%; max-height: min(56vh, 36rem); width: auto; height: auto; margin: 0 auto; object-fit: contain; border-radius: 14px; box-shadow: 0 0 0 1px #f2c7a544, 0 30px 70px #000c; transition: opacity .35s; }
.ae-buehne-bild figcaption { display: grid; justify-items: center; gap: .2rem; text-align: center; }
.ae-buehne-bild strong { font: 400 clamp(1.1rem, 2vw, 1.5rem) var(--ae-serif); color: var(--ae-perl); }
.ae-buehne-kategorie { font: 700 .66rem var(--ae-sans); letter-spacing: .2em; text-transform: uppercase; color: var(--ae-tuerkis); }
.ae-buehne-zaehler { font: 700 .7rem var(--ae-sans); letter-spacing: .14em; color: var(--ae-leise); }
.ae-buehne-knopf { position: relative; z-index: 3; display: grid; place-items: center; width: 3.2rem; height: 3.2rem; border: 1px solid #f4ecf344; border-radius: 50%; background: #0b0d1ccc; color: var(--ae-perl); font: 1.9rem/1 var(--ae-serif); cursor: pointer; }
.ae-buehne-knopf:hover { border-color: var(--ae-rose); }
.ae-daumen { display: flex; gap: .5rem; margin-top: .8rem; overflow-x: auto; padding: .3rem .1rem .6rem; scroll-snap-type: x proximity; scrollbar-color: #c9a6ff55 transparent; }
.ae-daumen-bild { flex: 0 0 auto; width: 5.6rem; height: 5.6rem; padding: 0; border: 2px solid transparent; border-radius: 12px; overflow: hidden; background: #07080f; cursor: pointer; opacity: .6; scroll-snap-align: center; transition: opacity .2s, border-color .2s; }
.ae-daumen-bild img { width: 100%; height: 100%; object-fit: cover; }
.ae-daumen-bild:hover { opacity: .9; }
.ae-daumen-bild[aria-current] { opacity: 1; border-color: var(--ae-rose); }
.ae-daumen-bild[hidden] { display: none; }

/* Klangarchiv */
.ae-klang-raster { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 20rem), 1fr)); gap: 1rem; }
.ae-klang { display: grid; gap: .8rem; align-content: start; padding: 1.2rem; border: 1px solid var(--ae-linie); border-radius: 18px; background: radial-gradient(ellipse at 100% 0%, #c9a6ff1f, transparent 60%), linear-gradient(160deg, #191a38f0, #0b0d1cf5); }
.ae-klang h3 { margin: .3rem 0 0; font: 400 1.3rem var(--ae-serif); color: var(--ae-perl); }
.ae-welle { display: flex; align-items: center; gap: 3px; height: 3.6rem; padding: 0 .2rem; }
.ae-welle i { flex: 1; height: var(--h); border-radius: 2px; background: var(--ae-schillern); opacity: .55; transform-origin: center; animation: ae-welle 2.4s ease-in-out infinite; animation-delay: var(--v); }
@keyframes ae-welle { 50% { transform: scaleY(.35); opacity: .3; } }
.ae-spur { list-style: none; margin: 0; padding: 0; display: grid; gap: .6rem; }
.ae-spur li { display: grid; gap: .35rem; }
.ae-spur audio { width: 100%; }
.ae-ordner { display: grid; gap: .2rem; margin: 0; }
.ae-ordner span { font: 700 .62rem var(--ae-sans); letter-spacing: .18em; text-transform: uppercase; color: var(--ae-leise); }
.ae-ordner code { font-size: .78rem; color: var(--ae-tuerkis); overflow-wrap: anywhere; }

/* Bewegtbild */
.ae-video-raster { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 26rem), 1fr)); gap: 1rem; }
.ae-video { margin: 0; }
.ae-video video { width: 100%; aspect-ratio: 16 / 9; border-radius: 16px; background: #000; }
.ae-bildschirm { position: relative; isolation: isolate; display: grid; align-items: end; aspect-ratio: 16 / 7; min-height: 16rem; border: 1px solid var(--ae-linie); border-radius: 24px; overflow: hidden; }
.ae-bildschirm > img { position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%; object-fit: cover; opacity: .7; }
.ae-bildschirm::after { content: ""; position: absolute; inset: 0; z-index: -1; background: linear-gradient(0deg, var(--ae-nacht), #0b0d1c66 60%, #0b0d1c33); }
.ae-play { position: absolute; left: 50%; top: 42%; z-index: 2; display: grid; place-items: center; width: 4.6rem; height: 4.6rem; border: 1px solid #f4ecf388; border-radius: 50%; background: #0b0d1c99; color: var(--ae-perl); font-size: 1.6rem; transform: translate(-50%, -50%); box-shadow: 0 0 0 10px #f4ecf314; }
.ae-bildschirm-text { position: relative; z-index: 2; display: grid; gap: .5rem; padding: clamp(1rem, 3vw, 2rem); }
.ae-bildschirm-text p { margin: 0; }

/* 3D: Hologramm-Kugel als Platzhalter, Modelle laden erst beim Antippen */
.ae-holo { display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: center; gap: clamp(1rem, 4vw, 3rem); padding: clamp(1.2rem, 3vw, 2.4rem); border: 1px solid #78e0ea44; border-radius: 24px; background: radial-gradient(ellipse at 15% 50%, #78e0ea1f, transparent 60%), linear-gradient(160deg, #10203af0, #0b0d1cf5); }
.ae-holo p { margin: .5rem 0 0; }
.ae-holo-kugel { position: relative; width: clamp(8rem, 18vw, 12rem); aspect-ratio: 1; transform-style: preserve-3d; animation: ae-dreh 16s linear infinite; }
.ae-holo-kugel i { position: absolute; inset: 0; border: 1px solid #78e0eaaa; border-radius: 50%; box-shadow: 0 0 18px #78e0ea44 inset; }
.ae-holo-kugel i:nth-child(2) { transform: rotateY(45deg); }
.ae-holo-kugel i:nth-child(3) { transform: rotateY(90deg); }
.ae-holo-kugel i:nth-child(4) { transform: rotateX(90deg); border-color: #c9a6ffaa; }
@keyframes ae-dreh { to { transform: rotateY(360deg) rotateX(12deg); } }
.ae-modell-raster { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 22rem), 1fr)); gap: 1rem; }
.ae-modell { margin: 0; }
.ae-modell-buehne { display: grid; place-items: center; aspect-ratio: 4 / 3; border: 1px solid var(--ae-linie); border-radius: 18px; background: radial-gradient(ellipse, #78e0ea1a, #0b0d1c 70%); overflow: hidden; }
.ae-modell-buehne model-viewer { width: 100%; height: 100%; }
.ae-modell-laden { padding: .7rem 1.3rem; border: 1px solid #78e0ea88; border-radius: 999px; background: #0b0d1ccc; color: var(--ae-perl); font: 700 .8rem var(--ae-sans); letter-spacing: .1em; cursor: pointer; }

/* Assets */
.ae-asset-liste { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 18rem), 1fr)); gap: .6rem; }
.ae-asset-liste a { display: flex; justify-content: space-between; gap: 1rem; padding: .8rem 1rem; border: 1px solid var(--ae-linie); border-radius: 12px; background: #0b0d1cb3; color: var(--ae-perl) !important; text-decoration: none; }
.ae-asset-leer p { margin: .5rem 0 0; }

@media (max-width: 760px) {
    .ae-buehne { grid-template-columns: minmax(0, 1fr); min-height: 0; padding: 1rem .6rem; }
    .ae-buehne-knopf { position: absolute; top: 40%; width: 2.6rem; height: 2.6rem; font-size: 1.5rem; }
    .ae-buehne-knopf[data-buehne="-1"] { left: .4rem; } .ae-buehne-knopf[data-buehne="1"] { right: .4rem; }
    .ae-buehne-gross img { max-height: 52vh; }
    .ae-daumen-bild { width: 4.4rem; height: 4.4rem; }
    .ae-bildschirm { aspect-ratio: 4 / 5; }
    .ae-holo { grid-template-columns: minmax(0, 1fr); justify-items: center; text-align: center; }
}
@media (prefers-reduced-motion: reduce) { .ae-welle i, .ae-holo-kugel { animation: none; } }
`,
};

// ---------- Verhalten ----------
const BASIS_JS = `// Aerothanen · gemeinsames Verhalten (erzeugt von scripts/spezies/eigene/aerothanen.mjs)
import "../../../../Men%C3%BCs/TopBar/Top_bar.js";
import { applyAporiaRoutes } from "../../../../Men%C3%BCs/adapter/aporia-routes.js";
import { bewegungReduziert } from "../../../../Men%C3%BCs/adapter/aporia-bewegung.js";
applyAporiaRoutes(document);

// Himmel: blendet zum Bild des Abschnitts in Bildschirmmitte über (zwei Ebenen im Wechsel, erst nach dem Laden)
const himmel = document.querySelector(".ae-himmel");
const himmelsAbschnitte = [...document.querySelectorAll("[data-himmel]")];
if (himmel && himmelsAbschnitte.length) {
    const [a, b] = himmel.querySelectorAll("img");
    let vorne = a, jetzt = a.getAttribute("src"), marke = 0;
    const zeige = (src) => {
        if (!src || src === jetzt) return;
        jetzt = src;
        const hinten = vorne === a ? b : a, m = ++marke;
        const fertig = () => { if (m !== marke) return; hinten.classList.add("ist-an"); vorne.classList.remove("ist-an"); vorne = hinten; };
        hinten.onload = fertig;
        hinten.src = src;
        if (hinten.complete && hinten.naturalWidth) { hinten.onload = null; fertig(); }
    };
    const sichtbar = new Set();
    const beobachter = new IntersectionObserver((eintraege) => {
        eintraege.forEach((e) => (e.isIntersecting ? sichtbar.add(e.target) : sichtbar.delete(e.target)));
        const aktiv = himmelsAbschnitte.filter((x) => sichtbar.has(x)).pop();
        if (aktiv) zeige(aktiv.dataset.himmel);
    }, { rootMargin: "-40% 0px -40% 0px" });
    himmelsAbschnitte.forEach((x) => beobachter.observe(x));
}
// Großansicht mit Blättern (Pfeiltasten, Knöpfe, Wischen)
let grossOeffnen = () => {};
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
        grossOeffnen(sichtbar(), sichtbar().indexOf(knopf));
    });
    grossOeffnen = (l, i) => { liste = l; zeigen(Math.max(0, i)); dialog.showModal(); };
    dialog.querySelectorAll("[data-schritt]").forEach((k) => k.addEventListener("click", () => zeigen(aktuell + Number(k.dataset.schritt))));
    dialog.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") zeigen(aktuell + 1); if (e.key === "ArrowLeft") zeigen(aktuell - 1); });
    dialog.addEventListener("click", (e) => { if (e.target === dialog || e.target.tagName === "FIGURE") dialog.close(); });
    let startX = null;
    dialog.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
    dialog.addEventListener("touchend", (e) => { if (startX === null) return; const dx = e.changedTouches[0].clientX - startX; if (Math.abs(dx) > 50) zeigen(aktuell + (dx < 0 ? 1 : -1)); startX = null; }, { passive: true });
}

// Medien: Bild-Karussell (Bühne + Daumenleiste + Filter, blättert von selbst, Wischen am Handy)
const buehne = document.querySelector(".ae-buehne");
if (buehne) {
    const daumen = [...document.querySelectorAll(".ae-daumen-bild")];
    const bild = buehne.querySelector(".ae-buehne-gross img"), himmel = buehne.querySelector(".ae-buehne-hintergrund");
    const titel = buehne.querySelector(".ae-buehne-bild strong"), kat = buehne.querySelector(".ae-buehne-kategorie"), zaehler = buehne.querySelector(".ae-buehne-zaehler");
    const sicht = () => daumen.filter((d) => !d.hidden);
    let aktuell = daumen[0];
    const zeige = (d) => {
        if (!d) return;
        aktuell = d;
        const liste = sicht();
        bild.style.opacity = "0";
        setTimeout(() => {
            bild.src = d.dataset.vor; bild.alt = d.dataset.titel;
            himmel.src = d.dataset.vor;
            titel.textContent = d.dataset.titel; kat.textContent = d.dataset.kategorie;
            zaehler.textContent = (liste.indexOf(d) + 1) + " / " + liste.length;
            bild.style.opacity = "1";
        }, 180);
        daumen.forEach((x) => x.toggleAttribute("aria-current", x === d));
        d.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    };
    const schritt = (n) => { const liste = sicht(); zeige(liste[(liste.indexOf(aktuell) + n + liste.length) % liste.length]); };
    daumen.forEach((d) => d.addEventListener("click", () => { halt(); zeige(d); }));
    buehne.querySelectorAll("[data-buehne]").forEach((k) => k.addEventListener("click", () => { halt(); schritt(Number(k.dataset.buehne)); }));
    const filter = [...document.querySelectorAll(".ae-filter button")];
    filter.forEach((b) => b.addEventListener("click", () => {
        filter.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        daumen.forEach((d) => { d.hidden = !!b.dataset.filter && d.dataset.kategorie !== b.dataset.filter; });
        zeige(sicht()[0]);
    }));
    // Großansicht vom Bühnenbild aus, blättert durch die sichtbaren Bilder
    buehne.querySelector(".ae-buehne-gross").addEventListener("click", () => { halt(); grossOeffnen(sicht(), sicht().indexOf(aktuell)); });
    // Wischen auf der Bühne
    let startX = null;
    buehne.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
    buehne.addEventListener("touchend", (e) => { if (startX === null) return; const dx = e.changedTouches[0].clientX - startX; if (Math.abs(dx) > 50) { halt(); schritt(dx < 0 ? 1 : -1); } startX = null; }, { passive: true });
    // von selbst weiterblättern, solange die Bühne sichtbar ist und nicht bedient wurde
    let takt = null, imBild = false, bedient = false;
    const halt = () => { bedient = true; clearInterval(takt); takt = null; };
    const lauf = () => { clearInterval(takt); takt = null; if (imBild && !bedient && !document.hidden && !bewegungReduziert.matches) takt = setInterval(() => schritt(1), 6500); };
    new IntersectionObserver(([e]) => { imBild = e.isIntersecting; lauf(); }).observe(buehne);
    document.addEventListener("visibilitychange", lauf);
}

// Medien: 3D-Modelle laden erst beim Antippen (gemeinsamer Modell-Adapter)
document.querySelectorAll(".ae-modell").forEach((m) => {
    m.querySelector(".ae-modell-laden")?.addEventListener("click", async (e) => {
        const ort = m.querySelector(".ae-modell-buehne");
        e.currentTarget.textContent = "Wird geladen …";
        try {
            const { loadModel } = await import("../../_gemeinsam/modell-viewer.js");
            ort.replaceChildren();
            await loadModel(ort, { url: new URL(m.dataset.modell, location.href).href, title: m.dataset.titel }, m.dataset.modell.split(".").pop().toLowerCase());
        } catch { ort.textContent = "Modell konnte nicht geladen werden."; }
    });
});
`;

// ---------- schreiben ----------
write(`${S}/aerothanen-basis.css`, BASIS_CSS);
write(`${S}/aerothanen-basis.js`, BASIS_JS);
for (const s of SEITEN) {
    const von = `${S}/${s.datei}`;
    const dir = path.posix.dirname(von), name = path.posix.basename(s.datei).replace(/\.html$/, "");
    const inhalt = s.key === "uebersicht" ? uebersicht : s.key === "medien" ? medien : s.key === "heimatwelt" ? heimatwelt : unterseite(s);
    write(von, seite(s, inhalt));
    write(`${dir}/${name}.css`, SEITEN_CSS[s.key] ?? `/* Aerothanen · ${s.label} – gemeinsames Design: aerothanen-basis.css */\n`);
    const basis = rel(`${dir}/x.js`, `${S}/aerothanen-basis.js`);
    write(`${dir}/${name}.js`, `// Aerothanen · ${s.label}\nimport "${basis.startsWith(".") ? basis : "./" + basis}";\n`);
}
console.log(`Aerothanen: ${SEITEN.length} Seiten · ${BILDER.length} Bilder`);
