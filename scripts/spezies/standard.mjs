// Spezies-Baukasten · Standardvorlage
// Baut eine Spezies vollständig aus dem, was im Projekt liegt – ohne Handarbeit:
//   Infotexte   Info_material/Alle_spezies_daten/<Gruppe>/<Ordner>/…      (automatisch den Reitern zugeordnet)
//   Bilder      assets/bilder/Alle Spezies+Übersicht/<Gruppe>/<Ordner>/…   (Karussell, Kopf- und Kachelbilder)
//   Klänge      assets/audio/Alle Spezies+Übersicht/<Gruppe>/<Ordner>/…    (→ medien.json → Klangarchiv)
//   Videos      assets/videos/Alle Spezies+Übersicht/<Gruppe>/<Ordner>/…   (→ medien.json → Videoplayer)
//   Kurzprofil  Karte auf der Übersichtsseite der Gruppe                   (Untertitel, Steckbriefwerte, Route)
// Fehlt etwas, erscheint „Noch nicht ausgearbeitet“; ein erneuter Lauf übernimmt neue Dateien.
import fs from "node:fs";
import path from "node:path";
import { ROOT, FZ, esc, rel, write, exists, slug, kapitel, erstelle, medienSetzen, klaengeFinden } from "./bibliothek.mjs";
import { parasitoidenStart } from "./eigene/parasitoiden-start.mjs";
import { baueBasis } from "./basis.mjs";

export const GRUPPEN = {
    "Biologische Spezies": { route: "spezies-biological", uebersicht: "Übersichtsseite biologische spezies/Uebersicht.html" },
    "Gigantische Lebensformen": { route: "spezies-gigantic", uebersicht: "ÜbersichtsseiteGigantische Lebensformen/Uebersicht.html" },
    "Kosmische Spezies": { route: "spezies-cosmic", uebersicht: "Übersichtsseite Kosmische Spezies/Uebersicht.html" },
    "Mentale Spezies": { route: "spezies-mental", uebersicht: "Übersichtsseite Mentale Spezies/Uebersicht.html" },
    "Technologische Lebensformen": { route: "spezies-technological", uebersicht: "Übersichtsseite Technologische Lebensformen/Uebersicht.html" },
};
const REITER = [
    ["allgemeines", "Allgemeines", "Unterseiten/Allgemeines/allgemeines.html", "ⓘ", "Einordnung, Merkmale und Lebensweise"],
    ["biologie", "Biologie", "Unterseiten/Biologie/biologie.html", "⟡", "Körperbau, Sinne und Stoffwechsel"],
    ["entwicklung", "Entwicklung", "Unterseiten/Entwicklung/entwicklung.html", "⤳", "Evolution, Fortpflanzung und Lebensphasen"],
    ["heimatwelt", "Heimatwelt", "Unterseiten/Heimatwelt/heimatwelt.html", "◍", "Herkunft und Lebensräume"],
    ["gesellschaft", "Gesellschaft", "Unterseiten/Gesellschaft/gesellschaft.html", "⁂", "Gemeinschaft, Kultur und Alltag"],
    ["politik", "Politik", "Unterseiten/Politik/politik.html", "⚖", "Ordnung und Fraktionsbeziehungen"],
    ["geschichte", "Geschichte", "Unterseiten/Geschichte/geschichte.html", "⧗", "Wichtige Entwicklungsphasen und Wendepunkte"],
    ["gameplay", "Spielintegration", "Gameplay/gameplay.html", "◈", "Spielmechaniken und Interaktion"],
    ["forschung", "Forschung", "Forschung/forschung.html", "⚗", "Forschungsfelder und offene Fragen"],
    // nur bei Spezies, die Technologien herstellen (Infoordner „Technologien“) – sonst entfällt der Reiter
    ["technologien", "Technologien", "Unterseiten/Technologien/technologien.html", "⚙", "Erfindungen, Geräte und technische Systeme"],
    ["medien", "Medien", "Unterseiten/Medien/medien.html", "▣", "Bilder, Klänge, Bewegtbild und Modelle"],
];
export const TECHNIK_REITER = REITER.find(([k]) => k === "technologien");
// Zuordnung einer Info-Datei zu einem Reiter (Pfad relativ zum Speziesordner, Kleinschreibung)
function reiterFuer(p) {
    if (/fragen templates|template/.test(p)) return null;
    if (/(^|\/)medien\//.test(p)) return "medien";
    if (/(^|\/)forschung\//.test(p)) return "forschung";
    if (/gameplay|spielintegration/.test(p)) return "gameplay";
    if (/heimatwelt|05_/.test(p)) return "heimatwelt";
    if (/politik|fraktion|04_/.test(p)) return "politik";
    if (/(^|\/)technolog/.test(p)) return "technologien";
    if (/gesellschaft|kultur|technolog|03_/.test(p)) return "gesellschaft";
    if (/geschichte/.test(p)) return "geschichte";
    if (/entwicklung/.test(p)) return "entwicklung";
    if (/biolog/.test(p)) return "biologie";
    return "allgemeines";
}
const walk = (d) => fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]) : [];
// Farbwelt aus einem Farbton (0–360): dunkler Grund, Akzent und Zweitfarbe
function hex(h, s, l) {
    s /= 100; l /= 100;
    const k = (n) => (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
    const f = (n) => Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))))).toString(16).padStart(2, "0");
    return "#" + f(0) + f(8) + f(4);
}
export function farbenAusTon(h, zweit = (h + 40) % 360) {
    return {
        bg: hex(h, 35, 5), glas: hex(h, 35, 9), glashell: hex(h, 33, 12), linie: hex(h, 75, 65), liniehell: hex(h, 80, 75), akzent: hex(h, 75, 65), akzenthell: hex(h, 85, 88),
        zweit: hex(zweit, 80, 72), text: hex(h, 30, 93), leise: hex(h, 15, 68), tint: hex(h, 50, 48), glaslicht: hex(h, 30, 14), glasdunkel: hex(h, 35, 5),
        glow1: hex(h, 70, 45), glow2: hex(zweit, 70, 55), glow3: hex((h + 300) % 360, 60, 50), rahmen: hex(h, 35, 6), knopf: hex(h, 35, 16), reiter: hex(h, 35, 10),
        flaeche: hex(h, 35, 9), kachel: hex(h, 35, 7), herobg: hex(h, 35, 6), aktiv1: hex(h, 55, 28), aktiv2: hex(h, 55, 17), h1: hex(h, 60, 97), intro: hex(h, 25, 85), zoombg: hex(h, 35, 3),
    };
}
const tonAusName = (n) => [...n].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 360, 7);

// Karte der Übersichtsseite: Name, Untertitel, Steckbriefwerte, Route, Bild
function karteLesen(gruppe, ordner) {
    const datei = path.join(ROOT, "inhalte/spezies", gruppe, GRUPPEN[gruppe].uebersicht);
    if (!fs.existsSync(datei)) return null;
    const t = fs.readFileSync(datei, "utf8");
    for (const m of t.matchAll(/<section class="species-category"[\s\S]*?<\/section>/g)) {
        const name = (m[0].match(/<h2>([^<]+)<\/h2>/) ?? [])[1];
        if (!name || name.toLowerCase().replace(/\s+/g, "") !== ordner.toLowerCase().replace(/\s+/g, "")) continue;
        return {
            name, block: m[0],
            text: (m[0].match(/<div class="species-card-copy"><p>([\s\S]*?)<\/p>/) ?? [])[1] ?? "",
            werte: [...m[0].matchAll(/<div><dt>([^<]+)<\/dt><dd>([^<]*)<\/dd><\/div>/g)].map((x) => [x[1], x[2]]),
            route: (m[0].match(/data-route="([^"]+)"/) ?? [])[1],
        };
    }
    return null;
}

export function baueStandard(cfg) {
    const { gruppe, ordner } = cfg;
    const G = GRUPPEN[gruppe];
    if (!G) throw new Error("Unbekannte Gruppe: " + gruppe);
    const S = `inhalte/spezies/${gruppe}/${ordner}`;
    const INFO = `Info_material/Alle_spezies_daten/${gruppe}/${ordner}`;
    const A = `assets/bilder/Alle Spezies+Übersicht/${gruppe}/${ordner}`;
    const AUDIO = `assets/audio/Alle Spezies+Übersicht/${gruppe}/${ordner}`;
    const VIDEO = `assets/videos/Alle Spezies+Übersicht/${gruppe}/${ordner}`;
    const karte = karteLesen(gruppe, ordner);
    const NAME = cfg.name ?? karte?.name ?? ordner;
    const KLASSE = slug(ordner).replace(/-/g, "");
    const P = "st";
    const alteSeite = exists(S + "/hauptseite/Spezies.html") ? fs.readFileSync(path.join(ROOT, S, "hauptseite/Spezies.html"), "utf8") : "";
    const R0 = cfg.route ?? (alteSeite.match(/<body[^>]*data-page="([^"]+)"/) ?? [])[1] ?? karte?.route;
    if (!R0) throw new Error(NAME + ": keine Route gefunden");
    const farben = farbenAusTon(cfg.farbton ?? tonAusName(NAME), cfg.zweitton);

    baueBasis({ gruppe, ordner, praefix: P, klasse: KLASSE, name: NAME, design: `${ordner} (Spezies-Baukasten)`, motto: `„${NAME}“`, farben });

    // ---------- Bestand einlesen ----------
    const infoDateien = walk(path.join(ROOT, INFO)).map((f) => path.relative(path.join(ROOT, INFO), f).replace(/\\/g, "/")).sort((a, b) => a.localeCompare(b, "de", { numeric: true }));
    const quellen = Object.fromEntries(REITER.map(([k]) => [k, []]));
    for (const d of infoDateien) { const k = reiterFuer(d.toLowerCase()); if (k) quellen[k].push(d); }
    Object.assign(quellen, cfg.quellen ?? {});
    // aktive Reiter: Technologien nur, wenn Infotexte dafür vorliegen
    const AKTIV = REITER.filter(([k]) => k !== "technologien" || quellen.technologien?.length);
    const bildDateien = walk(path.join(ROOT, A)).filter((f) => /\.(png|jpe?g|webp)$/i.test(f)).map((f) => path.relative(ROOT, f).replace(/\\/g, "/")).sort((a, b) => a.localeCompare(b, "de", { numeric: true }));
    const kategorie = (d) => { const o = d.slice(A.length + 1).split("/")[0]; return /^design/i.test(o) ? "Designtafeln" : /gesamt/i.test(o) ? "Gesamtdarstellung" : o.includes(".") ? "Bildarchiv" : o.replace(/[_-]+/g, " ").replace(/^\w/, (c) => c.toUpperCase()); };
    const BILDER = bildDateien.map((d) => ({ datei: d, titel: path.posix.basename(d).replace(/\.\w+$/, "").replace(/[_]+/g, " ").replace(/\s*-\d+$/, "").replace(/\s+/g, " ").trim(), kategorie: kategorie(d) }));
    if (cfg.titelmotiv) BILDER.sort((a, b) => Number(b.datei.endsWith("/" + cfg.titelmotiv)) - Number(a.datei.endsWith("/" + cfg.titelmotiv)));
    const KLANG = klaengeFinden(AUDIO);
    const videos = walk(path.join(ROOT, VIDEO)).filter((f) => /\.(mp4|webm|mov)$/i.test(f)).map((f) => ({ title: path.basename(f).replace(/\.\w+$/, "").replace(/[_]+/g, " "), src: "../../" + path.relative(ROOT, f).replace(/\\/g, "/") }));
    if (KLANG.length || videos.length) medienSetzen(KLASSE, { videos: { animationen: { items: [] }, videos: { items: videos } }, audio: Object.fromEntries(KLANG.map((k) => [k.schluessel, { items: k.items }])) });

    const bildNr = (i) => BILDER.length ? BILDER[i % BILDER.length] : null;
    const SEITEN = [{ key: "hauptseite", suffix: "", label: "Übersicht", file: S + "/hauptseite/Spezies.html", icon: "◆" },
        ...AKTIV.map(([key, label, datei, icon, text], i) => {
            const bildordner = cfg.bildordnerJeReiter?.[key];
            const reiterbilder = bildordner ? BILDER.filter((b) => b.datei.startsWith(A + "/" + bildordner + "/")) : [];
            const galerie = reiterbilder.length ? reiterbilder : Array.from({ length: Math.min(6, BILDER.length) }, (_, j) => bildNr(i + j));
            return { key, suffix: "-" + key, label, file: S + "/" + datei, icon, text, quellen: quellen[key], titelbild: reiterbilder[0] ?? bildNr(i + 1), galerie };
        })];
    if (cfg.forschungszweige?.length) {
        const fs_ = SEITEN.find((s) => s.key === "forschung");
        fs_.design = [{ titel: "Forschungszweige im Weltenarchiv", quelle: cfg.forschungsquelle ?? "Info_material · " + NAME + " · Forschung", html: `<div class="${P}-zweige">${cfg.forschungszweige.map(([z, t]) => `<a href="${rel(fs_.file, FZ + "/" + z + "/index.html")}"><strong>${esc(t)}</strong><span>${esc(z.split("/")[1])}</span></a>`).join("")}</div>` }];
    }
    const GRUPPE = { name: gruppe, route: G.route, uebersicht: `inhalte/spezies/${gruppe}/${G.uebersicht}` };
    const B = erstelle({
        S, INFO, A, NAME, KLASSE, P, R0, THEME: farben.bg, SEITEN, REGION: {}, GRUPPE,
        BESCHREIBUNG: `${NAME} im APORIA-Weltenarchiv${karte?.text ? ": " + karte.text.replace(/<[^>]+>/g, "") : ""}.`,
        links: (f, S_, rel) => [
            [rel(f, S_.forschung.file), "Forschung", "Forschungsfelder zu den " + NAME, `data-route="${R0}-forschung"`],
            [rel(f, FZ + "/Übersicht/Forschung.html"), "Forschungsarchiv", "Alle Forschungszweige"],
            [rel(f, GRUPPE.uebersicht), gruppe, "Alle Spezies dieser Gruppe", `data-route="${G.route}"`],
            [rel(f, "inhalte/spezies/Spezies_übersicht/Spezies.html"), "Speziesarchiv", "Alle Gruppen", 'data-route="spezies"'],
            [rel(f, "inhalte/himmelskoerper/planeten/planeten.html"), "Planetenarchiv", "Heimatwelten im Weltenarchiv", 'data-route="planeten"'],
        ],
    });

    // ---------- Unterseiten ----------
    for (const s of SEITEN.slice(1, -1)) B.reiterSeite(s);
    B.medienSeite(SEITEN.at(-1), { bilder: BILDER, klang: KLANG, modellRegion: null });
    // Seiten-CSS/-JS gehören dem Baukasten: immer passend zur Vorlage schreiben (ersetzt Reste älterer Vorlagen)
    for (const s of SEITEN.slice(1)) {
        const base = s.file.replace(/\.html$/, "");
        const medien = s.key === "medien";
        write(base + ".js", `// ${NAME} – ${s.label} · erzeugt vom Spezies-Baukasten (scripts/spezies) – Änderungen dort vornehmen\nimport "${rel(s.file, S + "/" + KLASSE + "-basis.js")}";\n${medien ? `import "${rel(s.file, "inhalte/spezies/_gemeinsam/medien-player.js")}";\nimport "${rel(s.file, "inhalte/spezies/_gemeinsam/klangarchiv.js")}";\n` : ""}`);
        write(base + ".css", `/* ${NAME} – ${s.label} · erzeugt vom Spezies-Baukasten (scripts/spezies)\n   Gemeinsames Design: ${KLASSE}-basis.css · eigene Anpassungen dieser Seite hier ergänzen. */\n`);
    }

    // ---------- Hauptseite ----------
    const s = SEITEN[0], f = s.file, S_ = B.S_;
    const L = (k) => `href="${rel(f, S_[k].file)}" data-route="${B.ROUTE(S_[k])}"`;
    const alleKap = (k) => (quellen[k] ?? []).flatMap((q) => { const d = typeof q === "string" ? q : q.datei; return kapitel(INFO + "/" + d, P).map((x) => ({ ...x, datei: d })); });
    const allg = alleKap("allgemeines");
    const steck = allg.find((k) => /<dl\b/.test(k.html));
    const beschr = allg.find((k) => k !== steck && /<p>/.test(k.html));
    const weitere = allg.filter((k) => k !== steck && k !== beschr).slice(0, 4);
    const forschung = alleKap("forschung").slice(0, 24);
    const intro = (beschr?.html.match(/<p>[\s\S]*?<\/p>/g) ?? []).slice(0, 2).join("") || `<p>Dieses Dossier ist noch nicht ausgearbeitet.</p>`;
    const unterzeile = karte?.text?.replace(/<[^>]+>/g, "") || gruppe;
    const stand = AKTIV.map(([k, label]) => [label, alleKap(k).length]);
    const mitText = stand.filter(([, n]) => n).length;
    const klapp = (x, offen = false) => `<details class="${P}-klapp"${offen ? " open" : ""}><summary><strong>${esc(x.titel)}</strong><small>${esc(x.nr === "◇" ? "" : x.nr)}</small><span class="${P}-chevron" aria-hidden="true"></span></summary><div class="${P}-klapp-inhalt">${x.html}</div></details>`;
    const kachel = (key) => { const t = S_[key], b = t.titelbild; return `                    <a class="${P}-panel ${P}-thema${b ? "" : ` ${P}-thema--ohne-bild`}" ${L(key)}>${b ? `<img class="${P}-thema-bild" src="${rel(f, b.datei)}" alt="" loading="lazy" decoding="async">` : `<span class="${P}-thema-icon" aria-hidden="true">${t.icon}</span>`}<strong>${esc(t.label)}</strong><span class="${P}-thema-text">${esc(t.text)}</span></a>`; };
    const dossierFakten = [...(steck ? [steck] : []), ...allg].flatMap((k) => [...k.html.matchAll(/<dt>(.*?)<\/dt><dd>(.*?)<\/dd>/g)].map((m) => [m[1], m[2]]));
    const werte = karte?.werte?.length ? fuelleWerte(karte.werte, dossierFakten) : [];
    const kurz = werte.length ? `<dl class="${P}-fakten">${werte.map(([a, b]) => `<div><dt>${esc(a)}</dt><dd>${b}</dd></div>`).join("")}</dl>` : "";
    const fehlt = [
        mitText < AKTIV.length ? [`Infotexte für ${AKTIV.length - mitText} von ${AKTIV.length} Reitern`, INFO] : null,
        !BILDER.length ? ["Bilder (Designtafel, Gesamtdarstellung)", A] : null,
        !KLANG.length ? ["Klänge (Unterordner je Kategorie)", AUDIO] : null,
        !videos.length ? ["Videos", VIDEO] : null,
    ].filter(Boolean);
    let html = B.kopf(s) +
        `            <header class="${P}-hero${BILDER.length ? "" : ` ${P}-hero--ohne-bild`}">
                ${BILDER.length ? `<img class="${P}-hero-bild" src="${rel(f, BILDER[0].datei)}" alt="" fetchpriority="high" decoding="async">` : `<span class="${P}-feld" aria-hidden="true"><i></i><i></i><i></i></span>`}
                <span class="${P}-glanz" aria-hidden="true"></span>
                <div class="${P}-hero-text">
                    ${B.pfad(s)}
                    <p class="${P}-kicker">${esc(gruppe)}</p>
                    <h1>${esc(NAME)}</h1>
                    <p class="${P}-unterzeile">${esc(unterzeile)}</p>
                    ${intro.replace(/<p>/g, `<p class="${P}-intro">`)}
                </div>
            </header>
` + B.reiter(s) +
        `            <div class="${P}-start">
                <section class="${P}-panel ${P}-block" aria-labelledby="kurz-titel">
                    ${B.titel("Kurzprofil", "Übersicht " + gruppe, "◆", "kurz-titel")}
                    ${kurz || `<p class="${P}-offen">Noch nicht ausgearbeitet.</p>`}
                    <a class="${P}-mehr" ${L("allgemeines")}>Zu Allgemeines →</a>
                </section>
                <section class="${P}-panel ${P}-block" aria-labelledby="dossier-titel">
                    ${B.titel(weitere.length ? "Aus dem Dossier" : "Dossier", weitere.length ? "Allgemeines" : "", "✦", "dossier-titel")}
                    ${weitere.length ? `<div class="${P}-klapp-liste">${weitere.map((x, i) => klapp(x, i === 0)).join("")}</div>` : `<p class="${P}-offen">Noch nicht ausgearbeitet. Sobald Infotexte vorliegen, erscheinen hier die wichtigsten Kapitel.</p>`}
                </section>
            </div>
            ${steck ? B.dossierSteckbrief(s, { datei: steck.datei, steckbrief: [steck.titel], beschreibung: beschr && beschr.datei === steck.datei ? [beschr.titel] : null, mehr: "allgemeines" }) : ""}
            <section class="${P}-themen" aria-labelledby="themen-titel">
                <h2 class="${P}-h2 ${P}-h2--linie" id="themen-titel">Themenbereiche</h2>
                <div class="${P}-themen-raster">
${["allgemeines", "biologie", "entwicklung", "heimatwelt", "gesellschaft", "politik", "geschichte", "gameplay"].map(kachel).join("\n")}
                </div>
            </section>
${BILDER.length ? `            <section class="${P}-panel ${P}-block ${P}-karussell-block" id="bildarchiv" aria-labelledby="bildarchiv-titel">
                ${B.titel("Bildarchiv", BILDER.length + " Bilder", "▣", "bildarchiv-titel")}
                ${B.karussell(f, BILDER, { buehne: true, filter: true, autoplay: 7000 })}
            </section>\n` : ""}${KLANG.length ? `            <section class="${P}-panel ${P}-block ${P}-leiste" aria-labelledby="klang-titel">
                ${B.titel("Klangarchiv", KLANG.reduce((n, k) => n + k.anzahl, 0) + " Klänge", "♪", "klang-titel")}
                <div class="${P}-chips">${KLANG.map((k) => `<a href="${rel(f, S_.medien.file)}#klang-${k.schluessel}" data-route="${R0}-medien" data-route-fragment="klang-${k.schluessel}">${esc(k.name)} <b>${k.anzahl}</b></a>`).join("")}</div>
            </section>\n` : ""}${forschung.length ? `            <section class="${P}-panel ${P}-block ${P}-leiste" aria-labelledby="forschung-titel">
                ${B.titel("Forschung", forschung.length + " Kapitel", "⚗", "forschung-titel")}
                <div class="${P}-chips">${forschung.map((x) => `<a href="${rel(f, S_.forschung.file)}#${x.id}" data-route="${R0}-forschung" data-route-fragment="${x.id}">${x.nr === "◇" ? "" : `<b>${esc(x.nr)}</b> `}${esc(x.titel)}</a>`).join("")}</div>
            </section>\n` : ""}${fehlt.length ? `            <section class="${P}-panel ${P}-block ${P}-stand" aria-labelledby="stand-titel">
                ${B.titel("Dossierstand", mitText + " von " + AKTIV.length + " Reitern mit Infotext", "◌", "stand-titel")}
                <p class="${P}-offen">Dieses Dossier wird automatisch aus dem Projekt erzeugt. Noch nicht vorhanden:</p>
                <ul class="${P}-stand-liste">${fehlt.map(([was, wo]) => `<li><strong>${esc(was)}</strong><code>${esc(wo)}</code></li>`).join("")}</ul>
            </section>\n` : ""}            <div class="${P}-layout ${P}-layout--fuss">
                <div class="${P}-inhalt">
                    ${B.verknuepfungen(s)}
                    ${B.quelle(karte ? "Übersichtsseite " + gruppe + (infoDateien.length ? " · Info_material · " + NAME : "") : "Info_material · " + NAME)}
                </div>
            </div>
` + B.fuss();
    html = html.replace(`<link rel="stylesheet" href="Spezies.css">`, `<link rel="stylesheet" href="${rel(f, "inhalte/spezies/_gemeinsam/spezies-standard.css")}">\n    <link rel="stylesheet" href="Spezies.css">`);
    if (cfg.hauptseitenStil) {
        const stil = rel(f, S + "/hauptseite/" + cfg.hauptseitenStil);
        html = html.replace("</head>", `    <link rel="stylesheet" href="${esc(stil)}">\n</head>`);
    }
    if (ordner === "Parasitoiden") {
        html = html.replace("</head>", '<link rel="stylesheet" href="kheravi.css"></head>').replace('<div class="st-start">', parasitoidenStart(f) + '<div class="st-start">');
    }
    write(f, html);
    write(S + "/hauptseite/Spezies.js", `// ${NAME} – Hauptseite · erzeugt vom Spezies-Baukasten (scripts/spezies) – Änderungen dort vornehmen\nimport "../${KLASSE}-basis.js";\n`);
    write(S + "/hauptseite/Spezies.css", `/* ${NAME} – Hauptseite · erzeugt vom Spezies-Baukasten (scripts/spezies)\n   Aufbau: inhalte/spezies/_gemeinsam/spezies-standard.css · Farben: ../${KLASSE}-basis.css · eigene Anpassungen hier ergänzen. */\n`);

    // ---------- Routen, Übersichtskarte ----------
    routenSetzen(R0, S, AKTIV);
    if (karte) karteAktualisieren(gruppe, karte, { R0, S, bild: BILDER[0]?.datei, werte });
    return { NAME, seiten: SEITEN.length, info: infoDateien.length, kapitel: stand.reduce((n, [, x]) => n + x, 0), bilder: BILDER.length, klaenge: KLANG.reduce((n, k) => n + k.anzahl, 0), videos: videos.length };
}

// Fehlende Unterseiten-Routen in aporia-routes.js nach der Hauptroute einfügen (auch für eigene Bauskripte)
export function routenSetzen(R0, S, liste = REITER) {
    const f = path.join(ROOT, "Menüs/adapter/aporia-routes.js");
    let t = fs.readFileSync(f, "utf8");
    const nl = t.includes("\r\n") ? "\r\n" : "\n";
    const enc = (p) => p.split("/").map(encodeURIComponent).join("/");
    const zeile = (k, p) => `    "${k}": new URL("../../${enc(S + "/" + p)}", import.meta.url).href,`;
    const kopf = t.split(nl).find((z) => z.includes(`"${R0}":`));
    if (!kopf) throw new Error("Hauptroute fehlt in aporia-routes.js: " + R0);
    const neu = liste.filter(([k]) => !t.includes(`"${R0}-${k}":`)).map(([k, , p]) => zeile(R0 + "-" + k, p));
    if (neu.length) { t = t.split(kopf).join([kopf, ...neu].join(nl)); fs.writeFileSync(f, t); }
}
// „Offen“-Werte des Kurzprofils aus den Steckbriefzeilen der Infotexte füllen (vorhandene Werte bleiben)
const SUCHE = { Heimatwelt: /^(Heimat(welt|planet)|Herkunft|Planet)$/i, Körpergröße: /^(Körpergröße|Größe|Körperdurchmesser|Körperlänge)$/i, Lebensdauer: /^(Lebensdauer|Lebenserwartung)$/i, Lebensraum: /^(Lebensraum|Lebensweise|Hauptlebensräume)$/i };
function fuelleWerte(werte, fakten) {
    return werte.map(([feld, wert]) => {
        if (wert !== "Offen" || !SUCHE[feld]) return [feld, wert];
        const neu = fakten.find(([k]) => SUCHE[feld].test(k.replace(/<[^>]+>/g, "").trim()))?.[1]?.replace(/<[^>]+>/g, "").trim();
        return [feld, neu ? esc(neu) : wert];
    });
}
// Übersichtskarte: Link setzen, Platzhalterbild durch eigenes Bild ersetzen, Werte aus dem Kurzprofil übernehmen
function karteAktualisieren(gruppe, karte, { R0, S, bild, werte }) {
    const f = path.join(ROOT, "inhalte/spezies", gruppe, GRUPPEN[gruppe].uebersicht);
    let t = fs.readFileSync(f, "utf8");
    let b = karte.block;
    const vonKarte = "inhalte/spezies/" + gruppe + "/" + GRUPPEN[gruppe].uebersicht;
    b = b.replace(/<a data-route="([^"]+)">Dossier öffnen/, (m, r) => `<a href="${rel(vonKarte, S + "/hauptseite/Spezies.html")}" data-route="${r}">Dossier öffnen`);
    if (bild && /Spezies_%C3%BCbersicht|Spezies_übersicht/.test((b.match(/<img src="([^"]+)"/) ?? [])[1] ?? "")) b = b.replace(/<img src="[^"]+"/, `<img src="${rel(vonKarte, bild)}"`);
    for (const [feld, wert] of werte) if (wert !== "Offen") b = b.replace(new RegExp(`<div><dt>${feld}</dt><dd>Offen</dd></div>`), () => `<div><dt>${feld}</dt><dd>${wert}</dd></div>`);
    if (b !== karte.block) { t = t.split(karte.block).join(b); fs.writeFileSync(f, t); }
}
