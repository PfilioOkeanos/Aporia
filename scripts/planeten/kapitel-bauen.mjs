// Planetendossier · Kapitelseiten bauen
// Erzeugt die Kapitelseiten eines Himmelskörpers im Aufbau der Erde-Kapitel (earth-hero, astro-layout, earth-panel)
// aus scripts/planeten/daten/<slug>.inhalt.json → kapitel["<Titel>"].abschnitte.
// Design, Symbole, Zuklappen und Leseführung kommen automatisch aus _gemeinsam/planetendossier.css/.js.
// Seiten tragen data-custom-dossier, der Atlas-Generator (build-celestial-dossiers.mjs) überschreibt sie nicht.
// Aufruf: node scripts/planeten/kapitel-bauen.mjs <slug>   oder   <art>/<slug>
//
// Bausteine eines Abschnitts (alle optional außer titel):
//   text: ["Absatz", …]            liste: ["Punkt", …]            daten: [["Wert", "Angabe"], …]
//   karten: [{ titel, text }]      zeitleiste: [["Stufe", "Text"], …]
//   balken: { werte: [["Name", Prozent], …], text? }                     → Anteilsbalken mit Legende
//   schichten: [["Schicht", "Beschreibung"], …] (außen → innen)          → Schnitt durch den Körper
//   skala: { einheit, min, max, bereiche: [["Name", von, bis], …] }      → Temperatur-/Werteskala
//   bild: true | "projekt/pfad.webp", bildtext                           verweise: [["Text", "projekt/pfad"], …]
import fs from "node:fs";
import path from "node:path";
import { ROOT, GEM, KERN, findeKoerper, ladeDaten } from "./koerper.mjs";
import { symbolFuer } from "../../inhalte/himmelskoerper/_gemeinsam/dossier-symbole.js";

const KOERPER = findeKoerper(process.argv[2]);
const daten = ladeDaten(KOERPER);
const FARBEN = ["erde-design.css", "dossier-farben.css"].map((n) => `${KOERPER.basis}/hauptseite/${n}`).find((f) => fs.existsSync(ROOT + f));
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const enc = (p) => p.split("/").map((t) => (t === ".." || t === "." ? t : encodeURIComponent(t))).join("/");
const GRUPPEN = ["Wissenschaft", "Natur", "Zivilisation", "Weitere"];
const zahl = (n) => String(n).replace(".", ",");

// ---------- Grafikbausteine ----------
function balken({ werte }) {
    return `<div class="pd-g-balken"><div class="pd-g-balken-leiste" role="img" aria-label="${esc(werte.map(([n, p]) => `${zahl(p)} % ${n}`).join(", "))}">${werte.map(([, p], i) => `<i style="--anteil:${p}%;--i:${i}"></i>`).join("")}</div><ul>${werte.map(([n, p], i) => `<li style="--i:${i}"><b>${zahl(p)} %</b>${esc(n)}</li>`).join("")}</ul></div>`;
}
function schichten(liste) {
    const n = liste.length;
    const ringe = liste.map((_, i) => `<circle cx="100" cy="100" r="${(96 * (n - i)) / n}" style="--i:${i};--n:${n}"/>`).join("");
    return `<div class="pd-g-schichten"><svg viewBox="0 0 200 200" role="img" aria-label="Schalenaufbau: ${esc(liste.map(([s]) => s).join(", "))}"><g class="pd-g-ringe">${ringe}</g><path class="pd-g-schnitt" d="M100 100 L100 4 A96 96 0 0 1 196 100 Z"/></svg><ol>${liste.map(([s, b], i) => `<li style="--i:${i};--n:${n}"><b>${esc(s)}</b><span>${esc(b)}</span></li>`).join("")}</ol></div>`;
}
function zeitleiste(liste) {
    return `<ol class="pd-g-zeitleiste">${liste.map(([t, x], i) => `<li><span class="pd-g-punkt">${String(i + 1).padStart(2, "0")}</span><div><b>${esc(t)}</b>${x ? `<p>${esc(x)}</p>` : ""}</div></li>`).join("")}</ol>`;
}
function skala({ einheit = "", min, max, bereiche }) {
    const pos = (v) => ((v - min) / (max - min)) * 100;
    return `<div class="pd-g-skala"><div class="pd-g-skala-band" style="--n:${bereiche.length}">${bereiche.map(([n, von, bis], i) => `<span style="--von:${pos(von)}%;--bis:${pos(bis)}%;--i:${i}" title="${esc(`${n}: ${von}–${bis} ${einheit}`)}"></span>`).join("")}</div><div class="pd-g-skala-achse"><span>${zahl(min)} ${esc(einheit)}</span><span>${zahl(max)} ${esc(einheit)}</span></div><ul>${bereiche.map(([n, von, bis], i) => `<li style="--i:${i}"><i></i><b>${esc(n)}</b><span>${zahl(von)}–${zahl(bis)} ${esc(einheit)}</span></li>`).join("")}</ul></div>`;
}
// vergleich: { mit: "Erde", werte: [["Größe", wertHier, wertVergleich, "Einheit"], …] } → Doppelbalken je Größe
function vergleich({ mit = "Erde", werte }) {
    const zeile = ([n, a, b, e = ""]) => {
        const max = Math.max(a, b) || 1;
        return `<li><span class="pd-g-vergleich-name">${esc(n)}</span><span class="pd-g-vergleich-balken"><i class="pd-g-hier" style="--w:${(a / max) * 100}%"><b>${zahl(a)} ${esc(e)}</b></i><i class="pd-g-dort" style="--w:${(b / max) * 100}%"><b>${zahl(b)} ${esc(e)}</b></i></span></li>`;
    };
    return `<div class="pd-g-vergleich"><p class="pd-g-vergleich-legende"><span class="pd-g-hier">${esc(daten.name)}</span><span class="pd-g-dort">${esc(mit)}</span></p><ul>${werte.map(zeile).join("")}</ul></div>`;
}
function karten(liste) {
    return `<div class="pd-g-karten">${liste.map(({ titel, text }) => { const s = symbolFuer(titel); return `<article class="pd-g-karte pd-thema-${s.thema}"><span class="pd-g-karte-symbol">${s.svg}</span><h3>${esc(titel)}</h3>${text ? `<p>${esc(text)}</p>` : ""}</article>`; }).join("")}</div>`;
}

// ---------- Seite ----------
function seite(k, index) {
    const datei = k.datei;
    // Pfad relativ zur Seite; Parameter (?…) und Sprungmarken (#…) bleiben unkodiert erhalten
    const rel = (ziel) => { if (/^(https?:|#)/.test(ziel)) return ziel; const [p, rest = ""] = ziel.split(/(?=[?#])/); return enc(path.posix.relative(path.posix.dirname(datei), p)) + ziel.slice(p.length); };
    const bildPfad = (b) => (b === true ? daten.panorama[0] : b);
    const tabs = `<nav class="earth-tabs" aria-label="${esc(daten.name)} · Kapitelnavigation">
                        <a href="${rel(KOERPER.hauptseite)}">Übersicht</a>
${GRUPPEN.map((g) => { const l = daten.kapitel.filter((x) => x.gruppe === g); return l.length ? `                        <details name="earth-chapters"><summary>${g}</summary><ul>${l.map((x) => `<li><a href="${rel(x.datei)}"${x === k ? ' aria-current="page"' : ""}><b aria-hidden="true">${esc(x.icon)}</b>${esc(x.titel)}</a></li>`).join("")}</ul></details>` : ""; }).join("\n")}
                    </nav>`;
    const abschnitte = (k.abschnitte ?? []).map((a) => {
        const teile = [];
        if (a.bild) teile.push(`<figure class="pd-g-bild"><img src="${rel(bildPfad(a.bild))}" alt="${esc(a.bildtext ?? a.titel)}" loading="lazy" decoding="async">${a.bildtext ? `<figcaption>${esc(a.bildtext)}</figcaption>` : ""}</figure>`);
        (a.text ?? []).forEach((p) => teile.push(`<p>${esc(p)}</p>`));
        if (a.balken) teile.push(balken(a.balken));
        if (a.vergleich) teile.push(vergleich(a.vergleich));
        if (a.schichten) teile.push(schichten(a.schichten));
        if (a.skala) teile.push(skala(a.skala));
        if (a.zeitleiste) teile.push(zeitleiste(a.zeitleiste));
        if (a.daten) teile.push(`<dl class="pd-g-daten">${a.daten.map(([w, v]) => `<div><dt>${esc(w)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>`);
        if (a.liste) teile.push(`<ul class="pd-g-liste">${a.liste.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>`);
        if (a.karten) teile.push(karten(a.karten));
        if (a.verweise) teile.push(`<p class="pd-g-verweise">${a.verweise.map(([t, z]) => `<a href="${rel(z)}">${esc(t)} →</a>`).join("")}</p>`);
        if (a.hinweis) teile.push(`<p class="pd-g-hinweis">${esc(a.hinweis)}</p>`);
        return `                    <section class="earth-panel pd-g-abschnitt">
                        <h2>${esc(a.titel)}</h2>
                        <div class="pd-g-inhalt">${teile.join("\n                            ")}</div>
                    </section>`;
    }).join("\n");
    const leer = !k.abschnitte?.length ? `                    <section class="earth-panel pd-g-abschnitt"><h2>${esc(k.titel)}</h2><div class="pd-g-inhalt"><p>Noch nicht ausgearbeitet.</p></div></section>` : "";
    const quellen = (daten.quellen ?? []).map((q) => `<a href="${rel(q.href)}">${esc(q.titel)}</a>`).join(" ");

    return `<!doctype html>
<html lang="de">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="${esc(daten.design?.farben?.nacht ?? "#050d10")}">
    <meta name="description" content="${esc(k.intro ?? "")}">
    <title>${esc(daten.name)} · ${esc(k.titel)} | Aporia Weltenarchiv</title>
    <!-- erzeugt von scripts/planeten/kapitel-bauen.mjs aus ${KOERPER.datenDatei.replace(/\.json$/, ".inhalt.json")} – Änderungen dort vornehmen -->
    <link rel="stylesheet" href="${rel("Menüs/TopBar/Top_bar.css")}">
    <link rel="stylesheet" href="${rel("Menüs/Side_bar/Side_bar.css")}">
    <link rel="stylesheet" href="${rel(KERN + "/erde.css")}">
    <link rel="stylesheet" href="${rel(GEM + "/planetendossier.css")}">
    <link rel="stylesheet" href="${rel(FARBEN)}">
    <script type="module" src="${rel(GEM + "/dossier-kapitel.js")}"></script>
    <script type="module" src="${rel(GEM + "/planetendossier.js")}"></script>
</head>
<body class="earth-page planetendossier pd-kapitel pd-gebaut" data-page="${KOERPER.art}" data-section="himmelskoerper" data-custom-dossier>
    <div data-aporia-topbar></div>
    <div class="earth-frame">
        <div data-aporia-sidebar data-sidebar-default-collapsed hidden></div>
        <main id="inhalt">
            <header class="earth-hero">
                <div class="earth-hero-nav">
                    <nav class="earth-crumb" aria-label="Archivpfad">
                        <a href="${rel(`inhalte/himmelskoerper/${KOERPER.art}/${KOERPER.art}.html`)}" data-route="${KOERPER.art}">${esc(KOERPER.art[0].toUpperCase() + KOERPER.art.slice(1))}</a><span aria-hidden="true">›</span>
                        <a href="${rel(KOERPER.hauptseite)}">${esc(daten.name)}</a><span aria-hidden="true">›</span><span aria-current="page">${esc(k.titel)}</span>
                    </nav>
                    ${tabs}
                </div>
                <figure class="nature-hero-image">
                    <img src="${rel(bildPfad(k.kopfbild ?? true))}" alt="" fetchpriority="high" decoding="async">
                </figure>
                <div class="astro-intro general-intro nature-hero-copy">
                    <div><p class="astro-earth-name">${esc(daten.name)}</p><h1>${esc(k.titel)}</h1></div>
                    <p>${esc(k.untertitel ?? k.intro ?? "")}</p>
                </div>
            </header>
            <div class="astro-layout">
                <nav class="earth-panel astro-chapters" aria-label="${esc(daten.dossierName ?? daten.name + "-Dossier")}" data-sidebar-details data-sidebar-default>
                    <h2>${esc(daten.dossierName ?? daten.name + "-Dossier")}</h2>
${daten.kapitel.map((x) => `                    <a data-sidebar-tab href="${rel(x.datei)}"${x === k ? ' aria-current="page"' : ""}>${esc(x.titel)}</a>`).join("\n")}
                </nav>
                <div class="nature-layout">
${abschnitte}${leer}
                </div>
            </div>
            <footer class="earth-sources">${quellen}</footer>
        </main>
    </div>
</body>
</html>
`;
}

let gebaut = 0;
for (const [i, k] of daten.kapitel.entries()) {
    if (!k.abschnitte && !daten.leereKapitelBauen) continue;
    fs.writeFileSync(ROOT + k.datei, seite(k, i));
    gebaut++;
}
console.log(`${daten.name}: ${gebaut} Kapitelseiten gebaut (${daten.kapitel.reduce((s, k) => s + (k.abschnitte?.length ?? 0), 0)} Abschnitte)`);
