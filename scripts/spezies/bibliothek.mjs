// Spezies-Baukasten · Bibliothek: gemeinsame Bausteine für Speziesseiten im Standard (Lithoiden → Plasmoiden): Reiter, Klappkapitel, Bildkarussell,
// Medienseite mit Klangarchiv. Texte wörtlich aus Info_material bzw. aus den Designtafeln (als Quelle gekennzeichnet).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = fileURLToPath(new URL("../../", import.meta.url)).replace(/\\/g, "/").replace(/\/$/, "");
export const FZ = "inhalte/Forschung";
export const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const enc = (p) => p.split("/").map((t) => (t === ".." || t === "." ? t : encodeURIComponent(t).replace(/[()']/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase()))).join("/");
export const rel = (von, ziel) => enc(path.posix.relative(path.posix.dirname(von), ziel));
export const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8").replace(/\r\n/g, "\n");
export const write = (f, c) => { fs.mkdirSync(path.dirname(path.join(ROOT, f)), { recursive: true }); fs.writeFileSync(path.join(ROOT, f), c); };
export const exists = (f) => fs.existsSync(path.join(ROOT, f));
export const slug = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/ß/g, "ss").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const inline = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
export const fakten = (paare, P) => `<dl class="${P}-fakten">${paare.map(([a, b]) => `<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join("")}</dl>`;

// ---------- Markdown: Kapitelebene automatisch (## Kapitel; oder ### Kapitel, wenn ## nur der Dateititel ist) ----------
// „Schlüssel: Wert“-Zeilen (auch als Listenpunkt, mit/ohne **) werden zu Steckbriefen; leere Zwischentitel entfallen.
const FAKT_OHNE_FETT = /^(?:[-*]\s+)?([A-ZÄÖÜ][\wäöüßÄÖÜ\- /()]{1,38}):\s+(\S.*)$/;
export function kapitel(datei, P) {
    const out = [];
    if (!exists(datei)) return out;
    const zeilen = read(datei).split("\n");
    const anzahl = (re) => zeilen.filter((z) => re.test(z.trim())).length;
    // Kapitelebene: „# 6.1 …“ (mind. drei nummerierte H1) → 1; sonst ##, oder ### wenn ## nur der Dateititel ist
    const ebene = anzahl(/^#\s+\d+\.\d+/) >= 3 ? 1 : anzahl(/^##\s/) <= 1 && anzahl(/^###\s/) >= 2 ? 3 : 2;
    const KAP = new RegExp(`^#{${ebene}}\\s+(?:(\\d+(?:\\.\\d+)*)\\.?\\s+|([A-ZÄÖÜ]{1,6}\\d{1,3})\\s+[–-]\\s+)?(.+)$`);
    const TITEL = ebene === 1 ? /^#\s+(?!\d+\.\d+)/ : new RegExp(`^#{1,${ebene - 1}}\\s`);
    const UNTER = new RegExp(`^#{${ebene + 1},6}\\s+(.+)$`);
    let cur = null, liste = null, ol = null, dl = null, tabelle = null;
    const zu = () => { liste = ol = dl = tabelle = null; };
    for (const roh of zeilen) {
        const z = roh.trim();
        if (TITEL.test(z) || z === "---") { zu(); continue; }
        const h2 = z.match(KAP);
        if (h2) { cur = { nr: h2[1] ?? h2[2] ?? "◇", titel: h2[3].replace(/\*\*/g, "").trim(), html: [] }; out.push(cur); zu(); continue; }
        if (!cur) { if (z) { cur = { nr: "◇", titel: "Steckbrief", html: [], vorspann: true }; out.push(cur); } else continue; }
        const ziel = cur.html;
        if (!z) { liste = ol = tabelle = null; continue; }
        const h3 = z.match(UNTER);
        if (h3) { zu(); ziel.push(`<h3>${inline(h3[1])}</h3>`); continue; }
        const fo = !/^\*\*/.test(z.replace(/^[-*]\s+/, "")) && z.match(FAKT_OHNE_FETT);
        if (fo && fo[1].split(/\s+/).length <= 4 && !/[.!?]$/.test(fo[1])) { if (!dl) { dl = []; ziel.push({ dl }); } dl.push(`<div><dt>${inline(fo[1])}</dt><dd>${inline(fo[2])}</dd></div>`); liste = ol = null; continue; }
        const zw = z.match(/^\*\*([^*]+)\*\*$/);
        if (zw) { zu(); ziel.push(`<h3>${inline(zw[1])}</h3>`); continue; }
        if (/^\|/.test(z)) {
            const zellen = z.replace(/^\||\|$/g, "").split("|").map((x) => x.trim());
            if (zellen.every((x) => /^:?-+:?$/.test(x))) continue;
            if (!tabelle) { tabelle = { kopf: zellen, zeilen: [] }; ziel.push(tabelle); } else tabelle.zeilen.push(zellen);
            continue;
        }
        const f = z.match(/^[-*]?\s*\*\*(.+?):\*\*\s*(.+)$/);
        if (f) { if (!dl) { dl = []; ziel.push({ dl }); } dl.push(`<div><dt>${inline(f[1])}</dt><dd>${inline(f[2])}</dd></div>`); liste = ol = null; continue; }
        const li = z.match(/^[-*]\s+(.+)$/);
        if (li) { if (!liste) { liste = []; ziel.push(liste); } liste.push(`<li>${inline(li[1])}</li>`); dl = ol = null; continue; }
        const nr = z.match(/^\d+\.\s+(.+)$/);
        if (nr) { if (!ol) { ol = { ol: [] }; ziel.push(ol); } ol.ol.push(`<li>${inline(nr[1])}</li>`); dl = liste = null; continue; }
        zu();
        ziel.push(`<p>${inline(z)}</p>`);
    }
    const render = (b) => Array.isArray(b) ? `<ul>${b.join("")}</ul>` : b.dl ? `<dl class="${P}-fakten">${b.dl.join("")}</dl>` : b.ol ? `<ol>${b.ol.join("")}</ol>`
        : b.kopf ? `<div class="${P}-tabelle"><table><thead><tr>${b.kopf.map((x) => `<th>${inline(x)}</th>`).join("")}</tr></thead><tbody>${b.zeilen.map((r) => `<tr>${r.map((x) => `<td>${inline(x)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>` : b;
    for (const k of out) { k.html = k.html.map(render).join("\n"); k.id = "k-" + slug((k.nr === "◇" ? "" : k.nr + "-") + k.titel); }
    // Leere Kapitel (z. B. Untertitel direkt vor dem ersten nummerierten Kapitel) entfallen;
    // ihr Titel wird als Einleitungszeile dem folgenden Kapitel vorangestellt, damit nichts verloren geht.
    const voll = [];
    let offen = [];
    for (const k of out) {
        if (!/<(p|ul|ol|dl|div)\b/.test(k.html)) { if (!k.vorspann) offen.push(k.titel); continue; }
        if (offen.length) { k.html = offen.map((t) => `<p class="${P}-kicker">${inline(t)}</p>`).join("\n") + "\n" + k.html; offen = []; }
        voll.push(k);
    }
    return voll;
}

// ---------- Audio: Titel aus Dateinamen ----------
const WORT = { Blaetter: "Blätter", Auffaechern: "Auffächern", Reisst: "Reißt", Oeffnet: "Öffnet", Loest: "Löst", Daemmerung: "Dämmerung", Fluessigkeit: "Flüssigkeit", Umwaelzen: "Umwälzen", Warnfluestern: "Warnflüstern", Naerstofffluss: "Nährstofffluss", Abstossung: "Abstoßung", Vertraeglichkeits: "Verträglichkeits", Begruessung: "Begrüßung", Rueckfrage: "Rückfrage", Fluestern: "Flüstern", Seitwaertsschritt: "Seitwärtsschritt", Frostgeroell: "Frostgeröll", Oeffnen: "Öffnen", Eislukeoeffnen: "Eisluke öffnen", Eishoehlen: "Eishöhlen", Atmosphaere: "Atmosphäre", Kaelte: "Kälte", Kaeltestarre: "Kältestarre", Stroemen: "Strömen", Waermestoss: "Wärmestoß", Huellenschicht: "Hüllenschicht", Schliessen: "Schließen", Rueckwaerts: "Rückwärts", Abstoss: "Abstoß", Aerger: "Ärger", Erschoepfung: "Erschöpfung", Erschoepft: "Erschöpft", Uebertragung: "Übertragung", Duese: "Düse", Kristallhoehe: "Kristallhöhe", Loesen: "Lösen", Waermespeicher: "Wärmespeicher", Wiedererwaermen: "Wiedererwärmen", Waermeerneuerung: "Wärmeerneuerung", Eroeffnung: "Eröffnung", Brutstaette: "Brutstätte", Abkuehlung: "Abkühlung", Bestaetigung: "Bestätigung", Zuenden: "Zünden", Huelle: "Hülle", Stoerung: "Störung", Leitungsstoerung: "Leitungsstörung",Freude: "Freude", Mineralplatten: "Mineralplatten", Ruhekontakt: "Ruhekontakt", Schmelze: "Schmelze", Rumpf: "Rumpf", Muede: "Müde", Gruss: "Gruß", Stoss: "Stoß", Waerme: "Wärme", Fuehlen: "Fühlen", Schuetzen: "Schützen" };
export function titelAusDatei(datei) {
    let t = path.posix.basename(datei).replace(/\.wav$/i, "").replace(/_LOOP$/i, "");
    t = t.replace(/^[A-Z]{3}_(?:[A-Z]+_)?(?:[A-Z]?\d+_)*(?:\d+_)?/, "");
    const teile = t.split("_").flatMap((x) => x.replace(/([a-zäöü])([A-Z])/g, "$1 $2").split(" ")).filter(Boolean);
    return teile.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).map((w) => WORT[w] ?? w).join(" ");
}

export function erstelle(cfg) {
    const { S, INFO, A, NAME, KLASSE, P, R0, THEME, BESCHREIBUNG, SEITEN, REGION } = cfg;
    const bild = (b) => typeof b === "string" ? b : b.datei;
    const ROUTE = (s) => R0 + s.suffix;
    const S_ = Object.fromEntries(SEITEN.map((s) => [s.key, s]));
    // Gruppe für den Archivpfad (Standard: Biologische Spezies)
    const G = cfg.GRUPPE ?? { name: "Biologische Spezies", route: "spezies-biological", uebersicht: "inhalte/spezies/Biologische Spezies/Übersichtsseite biologische spezies/Uebersicht.html" };

    function ausschnitt(f, region, klasse = "", alt = "", laden = "lazy") {
        const r = REGION[region];
        if (!r) throw new Error("Region fehlt: " + region);
        return `<span class="${P}-ausschnitt ${klasse}" style="--x:${r.x};--y:${r.y};--w:${r.w};--h:${r.h};--r:${r.r}"${alt ? "" : ' aria-hidden="true"'}><img src="${rel(f, r.bild)}" alt="${esc(alt)}" ${laden === "eager" ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></span>`;
    }
    function kopf(s, extraCss = []) {
        const f = s.file, base = path.posix.basename(f, ".html"), haupt = s.key === "hauptseite";
        return `<!doctype html>
<html lang="de">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="${THEME}">
    <meta name="description" content="${esc(haupt ? BESCHREIBUNG : s.label + " der " + NAME + " im APORIA-Weltenarchiv.")}">
    <title>${esc(haupt ? NAME + " · APORIA Weltenarchiv" : s.label + " · " + NAME + " · APORIA")}</title>
    <link rel="stylesheet" href="${rel(f, "Menüs/TopBar/Top_bar.css")}">
    <link rel="stylesheet" href="${rel(f, "Menüs/Side_bar/Side_bar.css")}">
${extraCss.map((c) => `    <link rel="stylesheet" href="${rel(f, c)}">\n`).join("")}    <link rel="stylesheet" href="${rel(f, "inhalte/spezies/_gemeinsam/bilder-karussell.css")}">
    <link rel="stylesheet" href="${rel(f, S + "/" + KLASSE + "-basis.css")}">
    <link rel="stylesheet" href="${base}.css">
    <script type="module" src="${base}.js"></script>
</head>
<body class="${KLASSE} ${P}-${s.key}" data-page="${ROUTE(s)}" data-section="spezies">
    <div data-aporia-topbar></div>
    <div class="aporia-page-frame ${P}-frame">
        <div data-aporia-sidebar></div>
        <main class="${P}-dossier" id="inhalt">
`;
    }
    const fuss = () => `            <dialog class="${P}-zoom" aria-label="Bild in Großansicht"><div class="controls"><button class="control" type="button" data-step="-1" aria-label="Vorheriges Bild">←</button><output aria-live="polite"></output><button class="control" type="button" data-step="1" aria-label="Nächstes Bild">→</button></div><form method="dialog"><button class="control">Schließen</button></form><img alt=""></dialog>
        </main>
    </div>
</body>
</html>
`;
    function pfad(s) {
        const f = s.file, haupt = s.key === "hauptseite";
        return `<nav class="${P}-pfad" aria-label="Archivpfad"><a data-route="spezies" href="${rel(f, "inhalte/spezies/Spezies_übersicht/Spezies.html")}">Spezies</a><span aria-hidden="true">›</span><a data-route="${G.route}" href="${rel(f, G.uebersicht)}">${esc(G.name)}</a><span aria-hidden="true">›</span>${haupt ? `<span aria-current="page">${NAME}</span>` : `<a data-route="${R0}" href="${rel(f, SEITEN[0].file)}">${NAME}</a><span aria-hidden="true">›</span><span aria-current="page">${esc(s.label)}</span>`}</nav>`;
    }
    function reiter(s, zusatz = "") {
        const f = s.file;
        return `            <nav class="${P}-reiter" aria-label="Hauptreiter der ${NAME}"${cfg.reiterAttr ?? ""}>
${SEITEN.map((t) => `                <a href="${rel(f, t.file)}" data-route="${ROUTE(t)}"${t.key === s.key ? ' aria-current="page"' : ""}><span aria-hidden="true">${t.icon}</span>${esc(t.label)}</a>`).join("\n")}${zusatz}
            </nav>
`;
    }
    const titel = (t, klein = "", icon = "", id = "") => `<h2 class="${P}-h2"${id ? ` id="${id}"` : ""}>${icon ? `<span class="${P}-icon" aria-hidden="true">${icon}</span>` : ""}${esc(t)}${klein ? ` <small>${esc(klein)}</small>` : ""}</h2>`;
    function karte(k, offen = false) {
        return `                    <details class="${P}-panel ${P}-karte" id="${k.id}"${offen ? " open" : ""}>
                        <summary><span class="${P}-nr">${esc(k.nr)}</span><h2>${esc(k.titel)}</h2><span class="${P}-chevron" aria-hidden="true"></span></summary>
                        <div class="${P}-text">
${k.html.split("\n").map((z) => "                            " + z).join("\n")}
                        </div>
                    </details>`;
    }
    function sprung(liste) {
        return `<nav class="${P}-panel ${P}-sprung" data-${P}-sprung aria-label="Kapitel dieser Seite">
                    <p class="${P}-kicker">Kapitel</p>
                    <button type="button" class="${P}-klappen" data-${P}-klappen aria-pressed="false">Alle aufklappen</button>
${liste.map((k) => `                    <a href="#${k.id}"><span class="${P}-nr">${esc(k.nr)}</span>${esc(k.titel)}</a>`).join("\n")}
                </nav>`;
    }
    function karussell(f, liste, { buehne = false, filter = false, autoplay = 0, label = "Bildarchiv der " + NAME, texte = {} } = {}) {
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
        return `<section class="${P}-panel ${P}-block ${P}-karussell-block" id="${id}" aria-label="${esc(ueberschrift)}">
                    ${titel(ueberschrift, liste.length + " Bilder · Bildarchiv")}
                    ${karussell(s.file, liste, { label: ueberschrift + " der " + NAME })}
                </section>`;
    }
    function verknuepfungen(s) {
        const f = s.file;
        const links = cfg.links(f, S_, rel);
        return `<aside class="${P}-panel ${P}-block ${P}-links" aria-label="Verknüpfungen">
                    ${titel("Verknüpfungen")}
                    <ul>
${links.map(([h, t, u, r = ""]) => `                        <li><a href="${h}" ${r}><strong>${esc(t)}</strong><span>${esc(u)}</span></a></li>`).join("\n")}
                    </ul>
                </aside>`;
    }
    function blaettern(s) {
        return "";   // Blätter-Knöpfe entfallen – zum Wechseln dient die mitwandernde Reiter-Leiste (Handy-Schicht)
        const i = SEITEN.indexOf(s), vor = SEITEN[i - 1], nach = SEITEN[i + 1], f = s.file;
        return `<nav class="${P}-blaettern" aria-label="Hauptreiter blättern">${vor ? `<a href="${rel(f, vor.file)}" data-route="${ROUTE(vor)}">← ${esc(vor.label)}</a>` : "<span></span>"}${nach ? `<a href="${rel(f, nach.file)}" data-route="${ROUTE(nach)}">${esc(nach.label)} →</a>` : "<span></span>"}</nav>`;
    }
    const quelle = (q) => `<p class="${P}-quelle">Quelle: ${esc(q)}</p>`;
    function seitenDateien(s, jsZusatz = "") {
        const base = s.file.replace(/\.html$/, "");
        if (!exists(base + ".js")) write(base + ".js", `// ${NAME} – ${s.label}\n// Gemeinsame Funktionen (Topbar, Sidebar, Routen, Klappkapitel, Bildkarussell) kommen aus der Basis.\nimport "${rel(s.file, S + "/" + KLASSE + "-basis.js")}";\n${jsZusatz}`);
        if (!exists(base + ".css")) write(base + ".css", `/* ${NAME} – ${s.label}\n   Gemeinsames Design: ${KLASSE}-basis.css · hier nur Anpassungen dieser Seite. */\n`);
    }
    function heroBild(s) {
        const t = s.titelbild;
        if (!t) return "";
        if (t.region) return ausschnitt(s.file, t.region, `${P}-hero-bild`, "", "eager");
        return `<img class="${P}-hero-bild" src="${rel(s.file, bild(t))}" alt="" fetchpriority="high" decoding="async">`;
    }
    function hero(s) {
        return `            <header class="${P}-hero ${P}-hero--reiter">
                ${heroBild(s)}
                <span class="${P}-glanz" aria-hidden="true"></span>
                <div class="${P}-hero-text">
                    ${pfad(s)}
                    <h1>${esc(s.label)}</h1>
                    <p class="${P}-unterzeile">${esc(s.text)}</p>
                </div>
            </header>
`;
    }
    // Info-Kapitel: Quelle als Dateiname oder { datei, nur: ["Titelanfang", …], hinweis } für eine Auswahl
    function infoKapitel(quellen) {
        return quellen.flatMap((q) => {
            const datei = typeof q === "string" ? q : q.datei;
            let liste = kapitel(INFO + "/" + datei, P);
            if (q.nur) liste = liste.filter((k) => q.nur.some((t) => k.titel.startsWith(t)));
            if (q.ohne) liste = liste.filter((k) => !q.ohne.some((t) => k.titel.startsWith(t)));
            if (q.kuerzel) liste = liste.filter((k) => q.kuerzel.some((p) => new RegExp(`^${p}\\d`).test(k.nr)));
            return liste.map((k) => ({ ...k, html: k.html + `\n<p class="${P}-quelle">Quelle: Info_material · ${esc(NAME)} · ${esc(datei)}${q.hinweis ? " · " + esc(q.hinweis) : ""}</p>` }));
        });
    }
    const eindeutig = (liste) => { const n = {}; return liste.map((k) => { n[k.id] = (n[k.id] ?? 0) + 1; return n[k.id] > 1 ? { ...k, id: k.id + "-" + n[k.id] } : k; }); };
    // Kapitel einer Seite: Designtafel-Inhalte + Info-Kapitel; leere Infodateien → Platzhalter
    function kapitelVon(s) {
        const design = (s.design ?? []).map((d, i) => ({ nr: "◆", id: "d-" + slug(d.titel), titel: d.titel, html: d.html + `\n<p class="${P}-quelle ${P}-quelle-design">Quelle: ${esc(d.quelle)}</p>` }));
        const info = infoKapitel(s.quellen ?? []);
        const liste = eindeutig([...design, ...info]);
        if (!info.length) liste.push({ nr: "…", id: "noch-offen", titel: design.length ? "Weitere Inhalte" : s.label, html: `<p class="${P}-offen">Noch nicht ausgearbeitet.</p>${s.quellen?.length ? `\n<p class="${P}-quelle">Vorgesehene Infodateien (noch ohne Text): ${s.quellen.map((q) => esc(q)).join(" · ")}</p>` : ""}` });
        return liste;
    }
    function reiterSeite(s, { jsZusatz = "" } = {}) {
        const k = kapitelVon(s);
        const html = kopf(s) + hero(s) + reiter(s) +
            `            <div class="${P}-layout">
                <div class="${P}-inhalt">
${k.map((x, i) => karte(x, i === 0 || (k.length <= 3))).join("\n")}
                    ${s.galerie?.length ? galerie(s, s.galerie) : ""}
                    ${verknuepfungen(s)}
                    ${blaettern(s)}
                </div>
                ${sprung([...k, ...(s.galerie?.length ? [{ id: "galerie", nr: "▣", titel: "Bilder" }] : [])])}
            </div>
` + fuss();
        write(s.file, html);
        seitenDateien(s, jsZusatz);
    }
    // Medienseite: Schnellnavigation, Bildgalerie (Karussell), Klangarchiv, Video, 3D, Assets
    function medienSeite(s, { bilder, klang, modellRegion, texte = {}, jsZusatz = "" }) {
        const f = s.file, KEY = KLASSE;
        const klangAnzahl = klang.reduce((n, k) => n + k.anzahl, 0);
        const zusatz = eindeutig(infoKapitel(s.quellen ?? []));
        const bereiche = [["bilder", "▣", "Bildgalerie", bilder.length + " Bilder"], ["klangarchiv", "♪", "Klangarchiv", klangAnzahl + " Klänge"], ["bewegtbild", "▶", "Video", ""], ["ansicht", "◎", "3D und 360°", ""], ["assetverkauf", "◇", "Digitale Assets", ""]];
        if (zusatz.length) bereiche.push([zusatz[0].id, "✎", "Gestaltung & Sound", zusatz.length + " Kapitel"]);
        const liste = [...bereiche.slice(0, 5).map(([id, , t], i) => ({ id, nr: String(i + 1).padStart(2, "0"), titel: t })), ...zusatz];
        const html = kopf(s, ["inhalte/spezies/_gemeinsam/medien-player.css", "inhalte/spezies/_gemeinsam/klangarchiv.css"]) + hero(s) + reiter(s) +
            `            <div class="${P}-layout">
                <div class="${P}-inhalt">
                    <nav class="${P}-panel ${P}-block ${P}-medien-nav" aria-label="Medienbereiche">
${bereiche.map(([id, icon, t, n]) => `                        <a href="#${id}"><span aria-hidden="true">${icon}</span>${esc(t)}${n ? ` <b>${esc(n)}</b>` : ""}</a>`).join("\n")}
                    </nav>
                    <section class="${P}-panel ${P}-block ${P}-karussell-block" id="bilder" aria-labelledby="bilder-titel">
                        ${titel("Bildgalerie", bilder.length + " Bilder", "▣", "bilder-titel")}
                        ${bilder.length ? karussell(f, bilder, { buehne: true, filter: true, label: "Bildgalerie der " + NAME, texte }) : `<p class="${P}-offen">Noch keine Bilder im Bildarchiv. Vorgesehener Ordner: ${esc(A)}</p>`}
                    </section>
                    <section class="${P}-panel ${P}-block" id="klangarchiv" aria-labelledby="klang-titel">
                        ${titel("Klangarchiv", klangAnzahl + " Klänge in " + klang.length + " Kategorien", "♪", "klang-titel")}
                        <div data-klangarchiv="${KEY}.audio" data-kategorien='${JSON.stringify(klang.map((k) => [k.schluessel, k.name])).replace(/'/g, "&#39;")}'></div>
                    </section>
                    <section class="${P}-panel ${P}-block ${P}-medien-bereich" id="bewegtbild"><h2 class="${P}-h2"><span class="${P}-icon" aria-hidden="true">▶</span>Animationen und Video</h2>
                        <div class="${P}-medien-zwei">
                            <article class="${P}-panel media-player-card" data-kind="video" data-key="${KEY}.videos.animationen"><h3>Animationen</h3><p class="media-status" role="status">Medien werden geladen …</p></article>
                            <article class="${P}-panel media-player-card" data-kind="video" data-key="${KEY}.videos.videos"><h3>Videos</h3><p class="media-status" role="status">Medien werden geladen …</p></article>
                        </div>
                    </section>
                    <section class="${P}-panel ${P}-block ${P}-medien-bereich" id="ansicht"${modellRegion ? ` data-turntable="${KEY}.rundum" data-model="${KEY}.modell"` : ""}><h2 class="${P}-h2"><span class="${P}-icon" aria-hidden="true">◎</span>3D-Modelle und 360°-Ansicht</h2>
                        <p class="media-status" role="status">Modellansicht in Vorbereitung.</p>
                        ${modellRegion ? ausschnitt(f, modellRegion, `${P}-medien-modell`, NAME + " aus der Designtafel") : ""}
                    </section>
                    <section class="${P}-panel ${P}-block ${P}-medien-bereich asset-catalog" id="assetverkauf" data-asset-catalog="${KEY}"><h2 class="${P}-h2"><span class="${P}-icon" aria-hidden="true">◇</span>Digitale Assets</h2><p role="status">In Vorbereitung.</p></section>
${zusatz.map((k) => karte(k)).join("\n")}
                    ${verknuepfungen(s)}
                    ${blaettern(s)}
                </div>
                ${sprung(liste)}
            </div>
` + fuss();
        write(f, html);
        const base = f.replace(/\.html$/, "");
        if (!exists(base + ".js")) write(base + ".js", `// ${NAME} – ${s.label} (Medienseite)\n// Bildgalerie als Karussell (Basis), Klangarchiv aus _gemeinsam/klangarchiv.js, Video/3D/Assets aus dem gemeinsamen Medienplayer.\n// Alle Dateien sind in inhalte/medien/medien.json unter „${KEY}.*“ eingetragen.\nimport "${rel(f, S + "/" + KLASSE + "-basis.js")}";\nimport "${rel(f, "inhalte/spezies/_gemeinsam/medien-player.js")}";\nimport "${rel(f, "inhalte/spezies/_gemeinsam/klangarchiv.js")}";\n${jsZusatz}`);
        if (!exists(base + ".css")) write(base + ".css", `/* ${NAME} – ${s.label}\n   Gemeinsames Design: ${KLASSE}-basis.css, Karussell: _gemeinsam/bilder-karussell.css, Klangarchiv: _gemeinsam/klangarchiv.css, Player: _gemeinsam/medien-player.css */\n.${P}-medien-modell { max-height: 30rem; border: 1px solid var(--${P}-linie); border-radius: 12px; }\n`);
    }
    // Hauptseite: Steckbrief aus der ersten Info-Datei (Identitätsdaten + aufklappbare Beschreibung)
    function dossierSteckbrief(s, { datei, steckbrief, beschreibung, mehr }) {
        const liste = kapitel(INFO + "/" + datei, P);
        const sb = liste.find((k) => steckbrief.some((t) => k.titel.startsWith(t)));
        const be = beschreibung ? liste.find((k) => beschreibung.some((t) => k.titel.startsWith(t))) : null;
        if (!sb) throw new Error("Steckbrief-Kapitel fehlt in " + datei);
        return `<section class="${P}-panel ${P}-block ${P}-dossier-steckbrief" aria-labelledby="dossier-steckbrief-titel">
                ${titel("Steckbrief aus dem Dossier", sb.titel === "Steckbrief" ? "" : sb.titel, "◆", "dossier-steckbrief-titel")}
                <div class="${P}-dossier-raster">
                    <div class="${P}-text ${P}-text--frei">${sb.html}</div>
                    ${be ? `<details class="${P}-klapp" open><summary><strong>${esc(be.titel)}</strong><span class="${P}-chevron" aria-hidden="true"></span></summary><div class="${P}-klapp-inhalt">${be.html}</div></details>` : ""}
                </div>
                <p class="${P}-quelle">Quelle: Info_material · ${esc(NAME)} · ${esc(datei)} · <a href="${rel(s.file, S_[mehr].file)}" data-route="${ROUTE(S_[mehr])}">Mehr unter ${esc(S_[mehr].label)} →</a></p>
            </section>`;
    }
    return { ROUTE, S_, ausschnitt, dossierSteckbrief, kopf, fuss, pfad, reiter, titel, karte, sprung, karussell, galerie, verknuepfungen, blaettern, quelle, seitenDateien, hero, reiterSeite, medienSeite, kapitelVon };
}

// medien.json: Block für eine Spezies vor „rohstoffe“ einfügen (nur wenn noch nicht vorhanden)
export function medienEintragen(schluessel, block) {
    const datei = path.join(ROOT, "inhalte/medien/medien.json");
    let t = fs.readFileSync(datei, "utf8");
    const nl = t.includes("\r\n") ? "\r\n" : "\n";
    if (JSON.parse(t).media?.[schluessel] || new RegExp(`\\n    "${schluessel}": \\{`).test(t)) { console.log("medien.json:", schluessel, "schon vorhanden"); return false; }
    const anker = nl + '    "rohstoffe": {';
    if (!t.includes(anker)) throw new Error("Anker rohstoffe fehlt");
    const text = JSON.stringify(block, null, 2).split("\n").map((z, i) => (i === 0 ? "" : "    ") + z).join(nl);
    t = t.replace(anker, `${nl}    "${schluessel}": ${text},${anker}`);
    JSON.parse(t);
    fs.writeFileSync(datei, t);
    console.log("medien.json:", schluessel, "eingetragen");
    return true;
}
// Audio-Kategorien aus Ordnern lesen → medien.json-Block
export function audioBlock(audioBasis, kategorien) {
    const audio = {};
    for (const k of kategorien) {
        const ordner = path.join(ROOT, audioBasis, k.ordner);
        const dateien = fs.readdirSync(ordner).filter((x) => /\.wav$/i.test(x)).sort((a, b) => a.localeCompare(b, "de", { numeric: true }));
        audio[k.schluessel] = { items: dateien.map((d) => ({ title: titelAusDatei(d), src: "../../" + audioBasis + "/" + k.ordner + "/" + d })) };
        k.anzahl = dateien.length;
    }
    return audio;
}

// medien.json: Block einer Spezies anlegen oder – wenn er vom Baukasten stammt („_baukasten": true) – ersetzen.
// Von Hand gepflegte Blöcke ohne Kennung bleiben unangetastet.
export function medienSetzen(schluessel, block) {
    const datei = path.join(ROOT, "inhalte/medien/medien.json");
    let t = fs.readFileSync(datei, "utf8");
    const nl = t.includes("\r\n") ? "\r\n" : "\n";
    const daten = JSON.parse(t);
    const vorhanden = daten.media?.[schluessel];
    if (vorhanden && !vorhanden._baukasten) { console.log("  medien.json:", schluessel, "von Hand gepflegt – unverändert"); return false; }
    const text = JSON.stringify({ _baukasten: true, ...block }, null, 2).split("\n").map((z, i) => (i === 0 ? "" : "    ") + z).join(nl);
    if (vorhanden) {
        const start = t.indexOf(nl + '    "' + schluessel + '": {');
        if (start < 0) throw new Error("Block nicht gefunden: " + schluessel);
        let i = t.indexOf("{", start), tiefe = 0, inString = false;
        for (; i < t.length; i++) {
            const c = t[i];
            if (inString) { if (c === "\\") i++; else if (c === '"') inString = false; continue; }
            if (c === '"') inString = true; else if (c === "{") tiefe++; else if (c === "}") { tiefe--; if (tiefe === 0) break; }
        }
        const kopf = nl + '    "' + schluessel + '": ';
        t = t.slice(0, start) + kopf + text + t.slice(i + 1);
    } else {
        const anker = nl + '    "rohstoffe": {';
        if (!t.includes(anker)) throw new Error("Anker rohstoffe fehlt");
        t = t.split(anker).join(nl + '    "' + schluessel + '": ' + text + "," + anker);
    }
    JSON.parse(t);
    fs.writeFileSync(datei, t);
    return true;
}
// Klänge aus allen Unterordnern einer Spezies (gleiche Datei in mehreren Ordnern nur einmal)
export function klaengeFinden(audioBasis) {
    const basis = path.join(ROOT, audioBasis);
    if (!fs.existsSync(basis)) return [];
    const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
    const gesehen = new Set(), gruppen = new Map();
    for (const f of walk(basis).filter((x) => /\.(wav|mp3|ogg)$/i.test(x)).sort((a, b) => a.localeCompare(b, "de", { numeric: true }))) {
        const merkmal = path.basename(f) + ":" + fs.statSync(f).size;
        if (gesehen.has(merkmal)) continue;
        gesehen.add(merkmal);
        const ordner = path.relative(basis, path.dirname(f)).replace(/\\/g, "/") || ".";
        if (!gruppen.has(ordner)) gruppen.set(ordner, []);
        gruppen.get(ordner).push(f);
    }
    const schoen = (o) => o.split("/").pop().replace(/^\d+[_ -]*/, "").replace(/[_-]+/g, " ").replace(/([a-zäöü])([A-Z])/g, "$1 $2").replace(/\b\w/g, (c) => c.toUpperCase());
    return [...gruppen].map(([ordner, dateien]) => ({ ordner, schluessel: slug(ordner === "." ? "allgemein" : ordner).replace(/-/g, "_"), name: ordner === "." ? "Klänge" : (WORT[schoen(ordner)] ?? schoen(ordner).split(" ").map((w) => WORT[w] ?? w).join(" ")), anzahl: dateien.length, items: dateien.map((d) => ({ title: titelAusDatei(path.basename(d)), src: "../../" + path.relative(ROOT, d).replace(/\\/g, "/") })) }));
}
