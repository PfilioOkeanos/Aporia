// Planetendossier · Hauptseite bauen
// Erzeugt die Hauptseite eines Planeten im neuen Planetendossier-Design aus scripts/planeten/daten/<slug>.json
// (Inhalte) und optional einem Bildarchiv mit Themenordnern (ein Bild je Kapitel).
// Design und Verhalten: inhalte/himmelskoerper/_gemeinsam/planetendossier.css/.js · Farben je Planet über --pd-*.
// Aufruf: node scripts/planeten/planetendossier.mjs <slug>   oder   <art>/<slug>
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ROOT, GEM, KERN, findeKoerper, ladeDaten } from "./koerper.mjs";

export function baueHauptseite(KOERPER, daten = ladeDaten(KOERPER), { protokoll = true } = {}) {
const { slug } = KOERPER;
// Genitiv für Sätze wie „Vom Orbit … bis in die Tiefe der Erde“ / „… Kharuuns“
const GEN = daten.genitiv ?? `der ${daten.name}`;
// Globus: ohne Angaben die Erdkarte, sonst die Planetenkarte aus erde.js (data-planet, data-planet-class, data-radius)
const globusAttr = daten.globusDaten ? ` data-planet="${daten.globusDaten.planet}" data-planet-class="${daten.globusDaten.klasse}" data-radius="${daten.globusDaten.radius}"` : "";
const OPT = daten.design ?? {};
const SEITE = KOERPER.hauptseite;
// Farben je Himmelskörper: die Erde nutzt erde-design.css, alle anderen eine eigene dossier-farben.css (wird bei Bedarf angelegt)
const FARBEN = KOERPER.basis + (fs.existsSync(ROOT + KOERPER.basis + "/hauptseite/erde-design.css") ? "/hauptseite/erde-design.css" : "/hauptseite/dossier-farben.css");
if (!fs.existsSync(ROOT + FARBEN)) {
    fs.mkdirSync(path.posix.dirname(ROOT + FARBEN), { recursive: true });   // Körper ohne eigene Hauptseite (z. B. Orvaya)
    const f = daten.design?.farben ?? {};
    const werte = [["nacht", "#050d10"], ["tiefe", "#0a1a1f"], ["akzent", "#7fe0c3"], ["sand", "#e6c48c"], ["moos", "#9cc77e"], ["ozean", "#57a9df"]];
    fs.writeFileSync(ROOT + FARBEN, `/* ${daten.name} – Farbwelt im Planetendossier-Design (Werte nach Bedarf anpassen, Vorgabe aus design.farben) */\nbody.planetendossier {\n${[...werte, ...Object.keys(f).filter((k) => !werte.some(([w]) => w === k)).map((k) => [k])].map(([k, v]) => `    --${k.startsWith("aporia") ? "" : "pd-"}${k}: ${f[k] ?? v};`).join("\n")}\n}\n`);
}

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const enc = (p) => p.split("/").map((t) => (t === ".." || t === "." ? t : encodeURIComponent(t))).join("/");
// Pfad relativ zur Seite; Parameter (?…) und Sprungmarken (#…) bleiben unkodiert erhalten
const rel = (ziel) => { if (/^(https?:|#)/.test(ziel)) return ziel; const p = ziel.split(/[?#]/)[0]; return enc(path.posix.relative(path.posix.dirname(SEITE), p)) + ziel.slice(p.length); };
// Archivpfad je Art (Planeten, Monde, Sterne …)
const ARTNAME = { planeten: "Planeten", monde: "Monde", sterne: "Sterne", kometen: "Kometen", asteroiden: "Asteroiden", sternensysteme: "Sternensysteme", zwergplaneten: "Zwergplaneten", nebel: "Nebel" };
const artSeite = `inhalte/himmelskoerper/${KOERPER.art}/${KOERPER.art}.html`;
const pfadArt = KOERPER.art === "planeten" ? `<a data-route="planeten" href="${rel("inhalte/himmelskoerper/planeten/planeten.html")}">Planeten</a>`
    : fs.existsSync(ROOT + artSeite) ? `<a href="${rel(artSeite)}">${ARTNAME[KOERPER.art] ?? KOERPER.art}</a>` : `<span>${ARTNAME[KOERPER.art] ?? KOERPER.art}</span>`;
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");

// ---------- Bilder: ein Motiv je Kapitel aus dem Bildarchiv (Themenordner, erstes Unterthema) ----------
const archiv = OPT.bildarchiv;
const themen = archiv && fs.existsSync(ROOT + archiv) ? fs.readdirSync(ROOT + archiv, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name) : [];
function archivBilder(thema) {
    const ordner = themen.find((t) => norm(t) === norm(thema)) ?? themen.find((t) => norm(t).startsWith(norm(thema)) || norm(thema).startsWith(norm(t)));
    if (!ordner) return [];
    const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
    return walk(ROOT + archiv + "/" + ordner).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).map((f) => path.relative(ROOT, f).replace(/\\/g, "/")).sort((a, b) => a.localeCompare(b, "de", { numeric: true }));
}
const benutzt = new Set();
for (const k of daten.kapitel) {
    const motive = archivBilder(OPT.themenordner?.[k.titel] ?? k.titel);
    // design.motive: { "Kapitel": "06" } wählt das Unterthema (Ordnerpräfix), sonst das erste freie Bild
    const wunsch = OPT.motive?.[k.titel];
    const bevorzugt = wunsch ? motive.filter((m) => m.split("/").at(-2).startsWith(wunsch)) : [];
    k.motiv = [...bevorzugt, ...motive].find((m) => !benutzt.has(m)) ?? motive[0] ?? null;
    if (k.motiv) benutzt.add(k.motiv);
    k.motive = motive;
}
const kap = (titel) => daten.kapitel.find((k) => k.titel === titel);
const bildVon = (k) => k?.motiv ?? k?.bild ?? daten.panorama[0];
const bild = (quelle, attribute) => quelle ? `<img src="${rel(quelle)}" alt="" ${attribute}>` : "";

// ---------- Werte aus den Grunddaten ----------
const wert = (re) => daten.grunddaten.find(([k]) => re.test(k))?.[1] ?? null;
const prozent = (s) => Number((String(s ?? "").match(/(\d+(?:,\d+)?)\s*%/) ?? [])[1]?.replace(",", ".") ?? NaN);
const HUD = [
    ["Durchmesser", wert(/durchmesser/i)], ["Schwerkraft", wert(/schwerkraft|gravitation/i)],
    ["Ø Temperatur", wert(/temperatur/i)], ["Ozeane", wert(/ozean|wasser/i)],
].filter(([, w]) => w);
const ozean = prozent(wert(/ozean|wasser/i));
const atmosphaere = wert(/atmosph/i);
const anteile = atmosphaere ? [...atmosphaere.matchAll(/(\d+(?:,\d+)?)\s*%\s*([A-Za-zÄÖÜäöüß -]+?)(?=,|$)/g)].map(([, p, name]) => [Number(p.replace(",", ".")), name.replace(/^(rund|ca\.|etwa)\s+/i, "").trim()]) : [];
const umlauf = wert(/umlauf/i), rotation = wert(/rotation|tag/i), abstand = wert(/abstand/i), masse = wert(/masse/i), monde = wert(/^monde?$/i);
const bezeichnung = (re, fallback) => daten.grunddaten.find(([k]) => re.test(k))?.[0] ?? fallback;
const zahl = (w) => (String(w).match(/\d[\d.,]*/) ?? [""])[0];

// ---------- Bausteine ----------
const GRUPPEN = ["Wissenschaft", "Natur", "Zivilisation", "Weitere"];
const tabs = () => `<nav class="earth-tabs pd-kapitelmenue" aria-label="${esc(daten.name)} · Kapitelnavigation">
                    <a href="#uebersicht" aria-current="page">Übersicht</a>
${GRUPPEN.map((g) => { const l = daten.kapitel.filter((k) => k.gruppe === g); return l.length ? `                    <details name="earth-chapters"><summary>${g}</summary><ul>${l.map((k) => `<li><a href="${rel(k.datei)}"><b aria-hidden="true">${esc(k.icon)}</b>${esc(k.titel)}</a></li>`).join("")}</ul></details>` : ""; }).join("\n")}
                </nav>`;
const kopfzeile = (kicker, titel, text = "") => `<div class="pd-kopf"><p class="pd-kicker">${esc(kicker)}</p><h2>${esc(titel)}</h2>${text ? `<p class="pd-kopf-text">${esc(text)}</p>` : ""}</div>`;
const SCHICHTEN = (OPT.schichten ?? [
    ["Orbit", "Astronomie"], ["Hülle", "Atmosphäre"], ["Hülle", "Klima"], ["Oberfläche", "Gewässer"],
    ["Oberfläche", "Geografie"], ["Oberfläche", "Biosphäre"], ["Tiefe", "Geologie"], ["Tiefe", "Planetare Struktur"],
]).map(([ebene, titel]) => ({ ebene, k: kap(titel) })).filter((s) => s.k);
const ersatzIntro = (k) => k.intro || `${k.titel} ${GEN}.`;

const html = `<!doctype html>
<html lang="de">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="${esc(OPT.farben?.nacht ?? "#050d10")}">
    <meta name="description" content="${esc(daten.intro)}">
    <title>${esc(daten.name)} · Aporia Weltenarchiv</title>
    <link rel="stylesheet" href="${rel("Menüs/TopBar/Top_bar.css")}">
    <link rel="stylesheet" href="${rel("Menüs/Side_bar/Side_bar.css")}">
    <link rel="stylesheet" href="${rel(KERN + "/erde.css")}">
    <link rel="stylesheet" href="${rel("inhalte/Flora & Fauna/Katalog/planet-leben.css")}">
    <link rel="stylesheet" href="${rel(GEM + "/planetendossier.css")}">
    <link rel="stylesheet" href="${rel(FARBEN)}">
    <script type="module" src="${rel(KERN + "/erde.js")}"></script>
    <script type="module" src="${rel(GEM + "/planetendossier.js")}"></script>
    <script type="module" src="${rel("inhalte/Flora & Fauna/Katalog/planet-leben.js")}"></script>
</head>
<body class="earth-page planetendossier pd-haupt" data-page="${KOERPER.art}" data-section="himmelskoerper" data-custom-dossier>
    <div data-aporia-topbar></div>
    <div class="earth-frame pd-rahmen">
        <div data-aporia-sidebar data-sidebar-default-collapsed hidden></div>
        <main id="inhalt" class="pd-main">
            <!-- erzeugt von scripts/planeten/planetendossier.mjs aus ${KOERPER.datenDatei} – Änderungen dort vornehmen -->
            <header class="pd-hero${daten.globusAusblenden ? " pd-hero--ohne-globus" : ""}" id="uebersicht">
                ${daten.panorama[0] ? `<div class="pd-hero-bild" aria-hidden="true"><img src="${rel(daten.panorama[0])}" alt="" fetchpriority="high" decoding="async"></div>` : ""}
                <svg class="pd-topo" aria-hidden="true" viewBox="0 0 1200 600" preserveAspectRatio="none">${Array.from({ length: 9 }, (_, i) => `<path d="M0 ${380 + i * 26} C 220 ${330 + i * 22}, 380 ${430 + i * 18}, 620 ${370 + i * 20} S 1000 ${300 + i * 28}, 1200 ${350 + i * 24}"/>`).join("")}</svg>
                <span class="pd-scan" aria-hidden="true"></span>
                <div class="pd-hero-inhalt">
                    <nav class="earth-crumb pd-pfad" aria-label="Archivpfad">${pfadArt}<span aria-hidden="true">›</span><span aria-current="page">${esc(daten.name)}</span></nav>
                    <p class="pd-kennung">${esc([daten.klasse.replace(/^Planet\s*·\s*Klasse:\s*/i, "Planet · "), ...daten.position.filter(([k]) => /sternsystem|sektor/i.test(k)).map(([k, v]) => (/sektor/i.test(k) ? "Sektor " : "") + v)].join(" · "))}</p>
                    <h1 class="pd-titel">${esc(daten.name)}</h1>
                    <p class="earth-class pd-unsichtbar">${esc(daten.klasse)}</p>
                    <p class="pd-intro">${esc(daten.intro)}</p>
                    ${daten.status ? `<p class="pd-status">${esc(daten.status)}</p>` : ""}
                    <div class="pd-aktionen">
                        <a class="pd-knopf pd-knopf--hell" href="${rel(daten.kapitel[0].datei)}">Dossier starten →</a>
                        ${daten.sternenkarte ? `<a class="pd-knopf earth-map" href="${rel(daten.sternenkarte)}">In der Sternenkarte</a>` : ""}
                    </div>
                </div>
${daten.globusAusblenden ? "" : `                <div class="pd-globus">
                    <span class="pd-orbit pd-orbit--1" aria-hidden="true"></span><span class="pd-orbit pd-orbit--2" aria-hidden="true"><i></i></span>
                    <div class="earth-player pd-player" data-earth-player${globusAttr}>
                        <canvas width="320" height="320" tabindex="0" aria-label="${esc(daten.name)}-Globus. Mit Pfeiltasten oder Ziehen drehen, mit Mausrad, Plus oder Minus zoomen." hidden></canvas>
                        <div class="earth-controls" role="group" aria-label="Globussteuerung" hidden>
                            <button type="button" data-turn="-1" aria-label="Nach links drehen">‹</button>
                            <button type="button" data-turn="1" aria-label="Nach rechts drehen">›</button>
                            <button type="button" data-fullscreen aria-label="Vollbild öffnen" aria-pressed="false">⛶</button>
                            <div class="earth-zoom"><button type="button" data-zoom="-1" aria-label="Herauszoomen">−</button><button type="button" data-zoom="1" aria-label="Heranzoomen">+</button></div>
                        </div>
                        <span class="earth-crosshair" aria-hidden="true" hidden></span>
                        <output class="earth-coordinates" aria-label="Koordinaten am Bildzentrum" hidden></output>
                    </div>
                    <p class="pd-globus-hinweis">360° · Ziehen zum Drehen</p>
                </div>`}
                <dl class="pd-hud">
${HUD.map(([k, w]) => `                    <div><dt>${esc(k)}</dt><dd data-pd-zahl>${esc(w)}</dd></div>`).join("\n")}
                </dl>
            </header>
            <div class="pd-leiste">
                ${tabs()}
            </div>

            <section class="pd-abschnitt pd-zahlen pd-einblenden" aria-labelledby="pd-zahlen-titel">
                ${kopfzeile("Messdaten", `${daten.name} in Zahlen`).replace("<h2>", '<h2 id="pd-zahlen-titel">')}
                <div class="pd-messraster">
${Number.isFinite(ozean) ? `                    <article class="pd-mess pd-mess--ring" style="--wert:${ozean}">
                        <svg viewBox="0 0 120 120" aria-hidden="true"><circle class="pd-ring-grund" cx="60" cy="60" r="52"/><circle class="pd-ring-wert" cx="60" cy="60" r="52" pathLength="100"/></svg>
                        <div class="pd-mess-zentrum"><strong data-pd-zahl>${esc(ozean)} %</strong><span>Ozeanbedeckung</span></div>
                    </article>` : ""}
${anteile.length ? `                    <article class="pd-mess pd-mess--atmo">
                        <h3>Atmosphäre</h3>
                        <div class="pd-balken" role="img" aria-label="${esc(atmosphaere)}">${anteile.map(([p], i) => `<i style="--anteil:${p}%;--i:${i}"></i>`).join("")}</div>
                        <ul class="pd-legende">${anteile.map(([p, n], i) => `<li style="--i:${i}"><b>${esc(String(p).replace(".", ","))} %</b>${esc(n)}</li>`).join("")}</ul>
                    </article>` : ""}
${rotation || umlauf ? `                    <article class="pd-mess pd-mess--zeit">
                        <div class="pd-uhr" aria-hidden="true"><i class="pd-uhr-tag"></i><i class="pd-uhr-jahr"></i><span class="pd-uhr-sonne"></span></div>
                        <dl>${rotation ? `<div><dt>Ein Tag</dt><dd>${esc(rotation)}</dd></div>` : ""}${umlauf ? `<div><dt>${esc(daten.messwerteOriginalBeschriften ? bezeichnung(/umlauf/i, "Umlaufzeit") : "Ein Jahr")}</dt><dd>${esc(umlauf)}</dd></div>` : ""}</dl>
                    </article>` : ""}
                    <article class="pd-mess pd-mess--werte">
                        <dl>${[["Masse", masse], [daten.messwerteOriginalBeschriften ? bezeichnung(/abstand/i, "Abstand") : "Abstand zum Stern", abstand], ["Monde", monde]].filter(([, w]) => w).map(([k, w]) => `<div><dt>${esc(k)}</dt><dd>${esc(w)}</dd></div>`).join("")}</dl>
                    </article>
                </div>
                <details class="pd-alle-daten">
                    <summary>Alle Grunddaten <span>${daten.grunddaten.length} Werte</span></summary>
                    <dl>${daten.grunddaten.map(([k, w]) => `<div><dt>${esc(k)}</dt><dd>${esc(w)}</dd></div>`).join("")}</dl>
                </details>
            </section>

            <section class="pd-abschnitt pd-schichten pd-einblenden" aria-labelledby="pd-schichten-titel" data-pd-schichten>
                ${kopfzeile("Erkundung", "Von außen nach innen", daten.erkundungText ?? `Vom Orbit durch Atmosphäre und Oberfläche bis in die Tiefe ${GEN}.`).replace("<h2>", '<h2 id="pd-schichten-titel">')}
                <div class="pd-schichten-raster">
                    <div class="pd-schichten-liste" role="tablist" aria-label="Schichten">
${SCHICHTEN.map(({ ebene, k }, i) => `                        <button type="button" role="tab" id="pd-tab-${i}" aria-controls="pd-schicht-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}"><small>${esc(ebene)}</small><span>${esc(k.icon)} ${esc(k.titel)}</span></button>`).join("\n")}
                    </div>
                    <div class="pd-schichten-buehne">
${SCHICHTEN.map(({ k }, i) => `                        <article class="pd-schicht" role="tabpanel" id="pd-schicht-${i}" aria-labelledby="pd-tab-${i}"${i ? " hidden" : ""}>
                            ${bild(bildVon(k), `loading="${i ? "lazy" : "eager"}" decoding="async"`)}
                            <div class="pd-schicht-text"><p class="pd-kicker">Kapitel ${String(k.nr).padStart(2, "0")}</p><h3>${esc(k.titel)}</h3><p>${esc(ersatzIntro(k))}</p><a class="pd-knopf" href="${rel(k.datei)}">Zum Kapitel ${esc(k.titel)} →</a></div>
                        </article>`).join("\n")}
                    </div>
                </div>
            </section>

${daten.lebenSlug ? `            <section class="pd-abschnitt pd-leben pd-einblenden" aria-labelledby="pd-leben-titel">
                ${kopfzeile("Biosphäre", "Lebendige Welt", "Flora, Fauna und Rohstoffe aus dem Archiv.").replace("<h2>", '<h2 id="pd-leben-titel">')}
                <div class="planet-leben" data-planet-leben="${esc(daten.lebenSlug)}" data-planet-leben-vorschau="10"><p>Flora, Fauna und Rohstoffe werden geladen …</p></div>
            </section>\n` : ""}
${daten.kapitel.some((k) => k.gruppe === "Zivilisation") ? `            <section class="pd-abschnitt pd-zivilisation pd-einblenden" aria-labelledby="pd-ziv-titel">
                ${kopfzeile("Bewohner", "Zivilisation und Geschichte").replace("<h2>", '<h2 id="pd-ziv-titel">')}
                <div class="pd-kartenband">
${daten.kapitel.filter((k) => k.gruppe === "Zivilisation").map((k) => `                    <a class="pd-karte" href="${rel(k.datei)}">${bild(bildVon(k), 'loading="lazy" decoding="async"')}<span class="pd-karte-text"><small>${esc(k.icon)} Kapitel ${String(k.nr).padStart(2, "0")}</small><strong>${esc(k.titel)}</strong><em>${esc(ersatzIntro(k))}</em></span></a>`).join("\n")}
                </div>
            </section>
` : ""}
            <section class="pd-abschnitt pd-kosmos pd-einblenden" aria-labelledby="pd-kosmos-titel">
                ${kopfzeile("Kosmische Einordnung", "Position im Universum").replace("<h2>", '<h2 id="pd-kosmos-titel">')}
                <div class="pd-kosmos-raster">
                    <div class="pd-system" aria-hidden="true"><span class="pd-stern"></span><span class="pd-bahn"><span class="pd-planet"><span class="pd-mondbahn"><i></i></span></span></span></div>
                    <div class="pd-glas pd-position">
                        <dl>${daten.position.map(([k, v, href]) => `<div><dt>${esc(k)}</dt><dd>${href ? `<a href="${rel(href)}">${esc(v)}</a>` : esc(v)}</dd></div>`).join("")}</dl>
                        ${daten.sternenkarte ? `<a class="pd-knopf" href="${rel(daten.sternenkarte)}">In der Sternenkarte öffnen →</a>` : ""}
                    </div>
                    <ul class="pd-verweise">
${daten.verknuepfungen.map((v) => `                        <li><a href="${rel(v.href)}"${v.route ? ` data-route="${esc(v.route)}"` : ""}><b aria-hidden="true">${esc(v.icon)}</b><span><small>${esc(v.art)}</small>${esc(v.titel)}</span></a></li>`).join("\n")}
                    </ul>
                </div>
            </section>

            <section class="pd-abschnitt pd-archiv pd-einblenden" aria-labelledby="pd-archiv-titel">
                ${kopfzeile("Dossier", "Alle Kapitel", `${daten.kapitel.length} Kapitel in ${GRUPPEN.filter((g) => daten.kapitel.some((k) => k.gruppe === g)).length} Bereichen.`).replace("<h2>", '<h2 id="pd-archiv-titel">')}
${GRUPPEN.filter((g) => daten.kapitel.some((k) => k.gruppe === g)).map((g) => `                <div class="pd-archiv-gruppe">
                    <h3>${g}</h3>
                    <div class="pd-archiv-raster">
${daten.kapitel.filter((k) => k.gruppe === g).map((k) => `                        <a class="pd-kachel" href="${rel(k.datei)}">${bild(bildVon(k), 'loading="lazy" decoding="async"')}${(k.anker ?? []).map((id) => `<span id="${esc(id)}" class="pd-kapitel-anker" aria-hidden="true"></span>`).join("")}<span class="pd-kachel-nr">${String(k.nr).padStart(2, "0")}</span><span class="pd-kachel-text"><strong>${esc(k.icon)} ${esc(k.titel)}</strong><em>${esc(ersatzIntro(k))}</em></span></a>`).join("\n")}
                    </div>
                </div>`).join("\n")}
            </section>

${daten.notizen?.length ? `            <section class="pd-abschnitt pd-einblenden" aria-labelledby="pd-notizen-titel">
                <h2 id="pd-notizen-titel">Frühere Weltenbau-Notizen</h2>
                ${daten.notizen.map(n => `<article class="pd-glas"><h3>${esc(n.titel)}</h3>${(n.text ?? []).map(p => `<p>${esc(p)}</p>`).join("")}${n.liste?.length ? `<ul>${n.liste.map(p => `<li>${esc(p)}</li>`).join("")}</ul>` : ""}${(n.verweise ?? []).map(([label,href]) => `<p><a href="${rel(href)}">${esc(label)}</a></p>`).join("")}</article>`).join("\n")}
            </section>
` : ""}            <footer class="pd-quellen"><span>Quellen</span>${daten.quellen.map((q) => `<a href="${rel(q.href)}">${esc(q.titel)}</a>`).join("")}</footer>
        </main>
    </div>
</body>
</html>
`;
fs.writeFileSync(ROOT + SEITE, html);
if (protokoll) console.log(`${daten.name}: Hauptseite gebaut · ${HUD.length} HUD-Werte · ${SCHICHTEN.length} Schichten · ${daten.kapitel.filter((k) => k.motiv).length}/${daten.kapitel.length} Kapitel mit Archivmotiv`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const koerper = findeKoerper(process.argv[2]);
    const daten = ladeDaten(koerper);
    baueHauptseite(koerper, daten);
    for (const { datei, anker, ...inhalt } of daten.hauptseitenAliasse ?? []) {
        const kapitel = daten.kapitel.map(k => ({ ...k, anker: anker?.[k.titel] ?? k.anker }));
        baueHauptseite({ ...koerper, hauptseite: datei }, { ...daten, ...inhalt, kapitel });
    }
}
