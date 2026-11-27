// Spezies-Baukasten · Storys
// Baut aus Info_material/Alle_spezies_daten/<Gruppe>/<Spezies>/Storys eine Übersichtsseite (Zeitleiste, Schauplätze,
// Handlungsstränge, Dossiers) und je Geschichte eine eigene Leseseite. Neue oder geänderte Storys: Skript erneut ausführen.
// Aufruf: node scripts/spezies/storys.mjs [Humanoide]
import fs from "node:fs";
import path from "node:path";
import { ROOT, esc, rel, write, slug } from "./bibliothek.mjs";

// ---------- Einstellungen je Spezies ----------
const ARTEN = {
    Humanoide: {
        gruppe: "Biologische Spezies", name: "Humanoide", route: "spezies-biological-1",
        seiten: "inhalte/spezies/Biologische Spezies/Humanoide",
        kopfbild: "assets/bilder/Alle Spezies+Übersicht/Biologische Spezies/Humanoide/Unterseiten/Geschichte/ChatGPT-Bild 14. Nov. 2026, 17_25_06-1.png",
        untertitel: "Geschichten der Menschheit zwischen Erde, Mond und Titan",
        einleitung: "Alle Geschichten und Erzählbausteine der Menschen in APORIA – von der ersten Nachricht über das unbekannte Signal bis zu den Träumen auf Titan. Die Zeitleiste folgt den Storynummern, darunter liegen die Handlungsstränge, Figuren und Produktionsdossiers.",
        // Schauplätze in Reihenfolge der Reise (Kennung → Anzeigename, Farbe)
        orte: [["erde", "Erde", "#4fb3e8"], ["erdmond", "Erdmond", "#c9ced6"], ["titan", "Titan", "#f0a95a"], ["uebergreifend", "Speziesübergreifend", "#b48cff"]],
        straenge: {
            "Der Forscher": "Der Forscher",
            "Der typ": "Der Typ",
            "Mondbasis": "Mondbasis",
            "Bärbel_und_Erich_in_der_ruihe_liegt_die_kraft": "Bärbel und Erich",
            "Kinder_spielen_astronaut_undalien": "Astronaut und Alien",
            "ERinnerungs_kerne_von spezies": "Erinnerungskerne",
        },
        // Angaben, die nicht im Text stehen (Dateiname → Werte)
        vorgaben: {
            "Erste_reise_zum_mond_bisZumshuttle.md": { orte: ["erde", "erdmond"], art: "Charaktergeschichte" },
            "Story.Pilot-xenobiologin-techniker.md": { titel: "Die Hauptcharaktere", orte: ["erdmond"], art: "Figuren" },
            "Der Begleiter Roboter-fürs_spiel.md": { orte: ["erde"] },
            "Forscher_guckt_zeitkapsel.md": { orte: ["erde"], art: "Charaktergeschichte" },
            "Roboter_entwerfen_teil1.md": { orte: ["erde"] },
            "Erinnerungskerne.md": { orte: ["uebergreifend"], art: "Gameplay-Dossier" },
            "APORIA_Nachrichten.md": { orte: ["erde"] },
            "APORIA_Prolog_01.md": { orte: ["erde"] },
        },
    },
};

const ART_REIHENFOLGE = ["Hauptgeschichte", "Parallelstrang", "Charaktergeschichte", "Figuren", "Konzept", "Produktionsdossier", "Gameplay-Dossier"];
const ART_TEXT = { Hauptgeschichte: "Hauptgeschichte", Parallelstrang: "Paralleler Handlungsstrang", Charaktergeschichte: "Charaktergeschichte", Figuren: "Figuren", Konzept: "Konzept", Produktionsdossier: "Produktionsdossier", "Gameplay-Dossier": "Gameplay-Dossier" };

const wahl = process.argv[2] ?? "Humanoide";
const A = ARTEN[wahl];
if (!A) throw new Error("Keine Storys-Einstellungen für " + wahl);
const INFO = `Info_material/Alle_spezies_daten/${A.gruppe}/${A.name}/Storys`;
const ZIEL = `${A.seiten}/Unterseiten/Storys`;
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const ORT = Object.fromEntries(A.orte.map(([k, n, f]) => [k, { k, n, f }]));

// ---------- Markdown lesen ----------
const FELD = /^(?:[-*]\s+)?(?:\*\*)?(Version|Datum|Kategorie|Status|Projekt|Spezies|Handlungsort|Verknüpfung|Universum|Spiel|Typ|Spielmodus|Geltungsbereich|Umgebung)(?:\*\*)?:(?:\*\*)?\s+(.+?)\s*$/;
const ST_ZEILE = /^(?:#+\s+)?(ST-\d{4})\s+–\s+(.+?)\s*$/;

function zeilenVorbereiten(text) {
    const out = [];
    for (const roh of text.replace(/\r\n/g, "\n").replace(/ /g, " ").split("\n")) {
        // Abschnittsüberschrift, die an der Kopfzeile klebt („… · Titan01 – Aufbruch vom Erdmond“), abtrennen
        const m = roh.match(/^(.*·.*[^\d\s–-])(\d{1,2}(?: –|\.) [A-ZÄÖÜ].*)$/);
        if (m) out.push(m[1].trim(), m[2].trim());
        else out.push(roh.replace(/\s+$/, (s) => (s.length >= 2 && !s.includes("\t") ? "  " : "")));
    }
    return out;
}

function lesen(datei) {
    const text = fs.readFileSync(path.join(ROOT, datei), "utf8");
    const z = zeilenVorbereiten(text);
    // kaum Markdown-Überschriften: Text mit „01 – …“-Abschnitten
    const schlicht = z.filter((l) => /^#{1,6}\s/.test(l.trim())).length < 3;
    const name = path.basename(datei);
    const v = A.vorgaben[name] ?? {};
    let titel = "", stNr = "", obertitel = "", untertitel = "", vorbemerkung = [], tags = [], version = "", felder = [];
    let start = 0;
    // Titel: ST-Zeile in den ersten Zeilen, sonst erste #-Überschrift
    const stIdx = z.slice(0, 12).findIndex((l) => ST_ZEILE.test(l.trim()));
    const hIdx = z.findIndex((l) => /^#\s+/.test(l.trim()));
    if (stIdx >= 0) {
        const m = z[stIdx].trim().match(ST_ZEILE);
        stNr = m[1]; titel = m[2];
        vorbemerkung = z.slice(0, stIdx).filter((l) => l.trim());
        start = stIdx + 1;
    } else if (hIdx >= 0 && hIdx < 6) {
        titel = z[hIdx].trim().replace(/^#\s+/, "");
        start = hIdx + 1;
        const t = titel.match(/^APORIA\s+–\s+(.+)$/);
        if (t) { obertitel = "APORIA"; titel = t[1]; }
        // Dossiertitel in der folgenden ##-Zeile („Produktionsdossier: Prolog 01 – …“)
        for (let i = start; i < Math.min(z.length, start + 4); i++) {
            const h = z[i].trim().match(/^##\s+(.+)$/);
            if (!h) continue;
            if (/^Produktionsdossier:\s*/.test(h[1])) { obertitel = titel; untertitel = "Produktionsdossier"; titel = h[1].replace(/^Produktionsdossier:\s*/, ""); start = i + 1; }
            else if (/dossier$/i.test(h[1])) { untertitel = h[1]; start = i + 1; }
            break;
        }
    }
    if (v.titel) titel = v.titel;
    if (!titel) titel = name.replace(/\.md$/, "").replace(/[_.-]+/g, " ");
    // Kopfangaben (Version · Schlagworte, Felder) bis zur ersten Überschrift
    const rest = [];
    let imKopf = true;
    for (let i = start; i < z.length; i++) {
        const l = z[i].trim();
        if (imKopf) {
            const ver = l.match(/^Version\s+([\d.]+)\s*·\s*(.+)$/);
            if (ver) { version = ver[1]; tags = ver[2].split("·").map((s) => s.trim()).filter(Boolean); continue; }
            const f = l.match(FELD);
            if (f && !/\|/.test(l)) { felder.push([f[1], f[2]]); continue; }
            if (l && (/^#{1,6}\s/.test(l) || ueberschrift(l, schlicht))) imKopf = false;
        }
        rest.push(z[i]);
    }
    const bloecke = parse(rest, schlicht);
    const feld = (k) => felder.find(([a]) => a === k)?.[1] ?? "";
    if (!version) version = feld("Version").split(/\s*·\s*/)[0];
    // Einordnung
    const alles = [...tags, feld("Kategorie"), feld("Handlungsort"), untertitel, titel].join(" · ");
    let art = v.art;
    if (!art) art = /Produktionsdossier/i.test(alles) ? "Produktionsdossier" : /Hauptgeschichte/i.test(alles) ? "Hauptgeschichte" : /Paralleler Handlungsstrang/i.test(alles) ? "Parallelstrang" : /Charaktergeschichte/i.test(alles) ? "Charaktergeschichte" : /Gameplay- und Technologiedossier/i.test(alles) ? "Gameplay-Dossier" : "Konzept";
    let orte = v.orte;
    if (!orte) {
        const kette = [...tags, feld("Handlungsort"), feld("Umgebung")].join(" ");
        orte = [/\bTitan\b/.test(kette) && "titan", /Erdmond/.test(kette) && "erdmond", /\bErde\b/.test(kette) && "erde"].filter(Boolean);
        if (!orte.length) orte = ["erde"];
    }
    const ordner = path.basename(path.dirname(datei));
    const strang = ordner === "Storys" ? "" : (A.straenge[ordner] ?? ordner.replace(/[_]+/g, " "));
    const woerter = text.split(/\s+/).filter(Boolean).length;
    const kapitel = bloecke.filter((b) => b.t === "h" && b.lvl === 2).length;
    const anriss = (bloecke.find((b) => b.t === "p" && b.text.length > 60 && !/^\*\*/.test(b.text))?.text ?? vorbemerkung.join(" ")).replace(/\*\*|`/g, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
    const sl = (stNr ? stNr.toLowerCase() + "-" : "") + slug(titel).slice(0, 60);
    return { datei, name, ordner, strang, titel, stNr, obertitel, untertitel, vorbemerkung, tags, version, felder, art, orte, bloecke, woerter, kapitel, anriss, slug: sl, status: feld("Status") };
}

// Überschrift in Texten ohne Markdown-Auszeichnung
function ueberschrift(l, schlicht) {
    if (!schlicht) return null;
    if (/^\.\s+\S/.test(l) && l.length < 60) return { lvl: 2, text: l.replace(/^\.\s+/, "") };
    if (/^\d{2} – \S/.test(l)) return { lvl: 2, text: l };
    if (/^Tag \d+ – \S/.test(l)) return { lvl: 2, text: l, tag: true };
    if (/^(Charakter|Phase|Szene) \d+ – \S/.test(l)) return { lvl: 3, text: l };
    if (/^\d{1,2}\. [A-ZÄÖÜ][^.:!?]{1,60}$/.test(l)) return { lvl: 2, text: l };
    return null;
}

function parse(zeilen, schlicht) {
    const b = [];
    let absatz = [], liste = null, tabelle = null, code = null;
    const absatzEnde = () => { if (absatz.length) b.push({ t: "p", text: absatz.join(" ").replace(/ {2,}/g, " ").trim(), umbruch: absatz }); absatz = []; };
    const listeEnde = () => { if (liste) b.push(liste); liste = null; };
    const tabelleEnde = () => { if (tabelle) b.push(tabelle); tabelle = null; };
    const allesEnde = () => { absatzEnde(); listeEnde(); tabelleEnde(); };
    // Ebenen der Markdown-Überschriften auf h2/h3/h4 abbilden
    const ebenen = [...new Set(zeilen.map((l) => l.trim().match(/^(#{1,6})\s/)?.[1].length).filter(Boolean))].sort();
    const ebene = (n) => Math.min(4, 2 + ebenen.indexOf(n));
    for (const roh of zeilen) {
        const l = roh.trim();
        if (code) { if (/^```/.test(l)) { b.push(code); code = null; } else code.zeilen.push(roh); continue; }
        if (/^```/.test(l)) { allesEnde(); code = { t: "code", zeilen: [] }; continue; }
        if (!l) { allesEnde(); continue; }
        if (/^(-{3,}|\*{3,})$/.test(l)) { allesEnde(); b.push({ t: "hr" }); continue; }
        const h = l.match(/^(#{1,6})\s+(.+)$/);
        if (h) { allesEnde(); b.push({ t: "h", lvl: ebene(h[1].length), text: h[2].replace(/\s*#+$/, "") }); continue; }
        const sh = ueberschrift(l, schlicht);
        if (sh) { allesEnde(); b.push({ t: "h", ...sh }); continue; }
        if (l.startsWith("|")) {
            absatzEnde(); listeEnde();
            if (/^\|[\s:|-]+\|?$/.test(l)) continue;
            const zellen = l.replace(/^\||\|$/g, "").split("|").map((s) => s.trim());
            if (!tabelle) tabelle = { t: "tab", kopf: zellen, zeilen: [] }; else tabelle.zeilen.push(zellen);
            continue;
        }
        if (roh.includes("\t") && !/^\s*[-*•]\s/.test(roh)) {
            absatzEnde(); listeEnde();
            const zellen = roh.split("\t").map((s) => s.trim());
            if (!tabelle) tabelle = { t: "tab", kopf: zellen, zeilen: [] }; else tabelle.zeilen.push(zellen);
            continue;
        }
        tabelleEnde();
        const li = roh.match(/^(\s*)([-*•]|\d+\.)\s+(.*)$/);
        if (li) {
            absatzEnde();
            const geordnet = /\d/.test(li[2]);
            if (!liste || liste.geordnet !== geordnet) { listeEnde(); liste = { t: "liste", geordnet, punkte: [] }; }
            liste.punkte.push({ text: li[3].trim(), tief: li[1].replace(/\t/g, "  ").length >= 2 });
            continue;
        }
        if (liste && /^\s{2,}\S/.test(roh)) { liste.punkte.at(-1).text += " " + l; continue; }
        listeEnde();
        const sp = l.match(/^\*\*([^*]{1,40}?):\*\*$/);
        if (sp) { absatzEnde(); b.push({ t: "sprecher", text: sp[1] }); continue; }
        absatz.push(roh.endsWith("  ") ? l + "\n" : l);
        if (!schlicht) continue;
        absatzEnde();   // ohne Markdown ist jede Zeile ein eigener Absatz
    }
    allesEnde();
    if (code) b.push(code);
    return b;
}

// ---------- HTML ----------
let ALLE = [];
const stLink = (aktuell, von) => (s) => s.replace(/\bST-\d{4}\b/g, (nr) => {
    const z = ALLE.find((x) => x.stNr === nr);
    return z && z !== aktuell ? `<a class="sy-st" href="${rel(von, `${ZIEL}/${z.slug}/${z.slug}.html`)}">${nr}</a>` : nr;
});
function inline(s, aktuell, von) {
    let h = esc(s)
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/\[([^\]]+)\]\((https?:(?:[^()\s]|\([^()\s]*\))+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\*)/g, "$1<em>$2</em>")
        .replace(/\n/g, "<br>");
    return aktuell ? stLink(aktuell, von)(h) : h;
}
const ortChip = (k) => `<span class="sy-ort" style="--ort:${ORT[k]?.f ?? "#8beaff"}">${esc(ORT[k]?.n ?? k)}</span>`;
const lesezeit = (w) => Math.max(1, Math.round(w / 220));
const tagsHtml = (s) => {
    if (!s.version && !s.tags.length) return "";
    const teile = [s.version && `Version ${s.version}`, ...s.tags].filter(Boolean);
    return `<p class="sy-tags">${teile.map((t, i) => `${i ? '<i class="sy-trenn"> · </i>' : ""}<span>${esc(t)}</span>`).join("")}</p>`;
};

function bloeckeHtml(s, von) {
    const out = [];
    let offen = false;
    const ids = new Set();
    const id = (t) => { let k = "k-" + slug(t).slice(0, 50) || "k"; let n = k, i = 2; while (ids.has(n)) n = k + "-" + i++; ids.add(n); return n; };
    const inh = [];
    for (const b of s.bloecke) {
        if (b.t === "h") {
            if (b.lvl === 2) {
                if (offen) out.push("</section>");
                const k = id(b.text);
                inh.push({ k, text: b.text });
                out.push(`<section class="sy-abschnitt${b.tag ? " sy-tag" : ""}" id="${k}" aria-labelledby="${k}-t"><h2 id="${k}-t">${inline(b.text, s, von)}</h2>`);
                offen = true;
            } else out.push(`<h${b.lvl}>${inline(b.text, s, von)}</h${b.lvl}>`);
        } else if (b.t === "p") {
            const zitat = /^[„"»]/.test(b.text);
            out.push(`<p${zitat ? ' class="sy-rede"' : ""}>${inline(b.umbruch.join(" ").replace(/\n /g, "\n").trim(), s, von)}</p>`);
        } else if (b.t === "sprecher") out.push(`<p class="sy-sprecher">${esc(b.text)}:</p>`);
        else if (b.t === "liste") {
            const tag = b.geordnet ? "ol" : "ul";
            out.push(`<${tag}>${b.punkte.map((p) => `<li${p.tief ? ' class="sy-tief"' : ""}>${inline(p.text, s, von)}</li>`).join("")}</${tag}>`);
        } else if (b.t === "tab") {
            out.push(`<div class="sy-tabelle"><table><thead><tr>${b.kopf.map((c) => `<th>${inline(c, s, von)}</th>`).join("")}</tr></thead><tbody>${b.zeilen.map((r) => `<tr>${r.map((c) => `<td>${inline(c, s, von)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`);
        } else if (b.t === "code") out.push(`<pre class="sy-code">${esc(b.zeilen.join("\n"))}</pre>`);
        else if (b.t === "hr") out.push('<hr class="sy-linie">');
    }
    if (offen) out.push("</section>");
    return { html: out.join("\n"), inh };
}

// Reiterleiste der Spezies (wie auf den übrigen Seiten)
function reiter(von, aktiv) {
    const R = [
        ["Übersicht", "Hauptseite/Spezies.html", A.route], ["Allgemeines", "Unterseiten/Allgemeines/allgemeines.html"], ["Biologie", "Unterseiten/Biologie/biologie.html"],
        ["Entwicklung", "Unterseiten/Entwicklung/entwicklung.html"], ["Heimatwelt", "Unterseiten/Heimatwelt/heimatwelt.html"], ["Gesellschaft", "Unterseiten/Gesellschaft/gesellschaft.html"],
        ["Politik", "Unterseiten/Politik/politik.html"], ["Geschichte", "Unterseiten/Geschichte/geschichte.html"], ["Spielintegration", "Gameplay/gameplay.html"],
        ["Forschung", "Forschung/forschung.html"], ["Medien", "Unterseiten/Medien/medien.html"], ["Technologien", "Unterseiten/Technologien/technologien.html"], ["Storys", "Unterseiten/Storys/storys.html", A.route + "-storys"],
    ];
    return `<nav class="dossier-reiter dossier-seitennavigation" aria-label="Dossierreiter ${esc(A.name)}">${R.map(([n, p, r]) =>
        `<a href="${rel(von, `${A.seiten}/${p}`)}"${r ? ` data-route="${r}"` : ""}${n === aktiv ? ' aria-current="page"' : ""}>${n}</a>`).join("\n")}</nav>`;
}

function rahmen(von, { titel, beschreibung, css, js, koerper, seite }) {
    const r = (p) => rel(von, p);
    return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="${esc(beschreibung)}">
<title>${esc(titel)}</title>
<link rel="stylesheet" href="${r(A.seiten + "/Hauptseite/Spezies.css")}">
<link rel="stylesheet" href="${r("Menüs/TopBar/Top_bar.css")}">
<link rel="stylesheet" href="${r("inhalte/spezies/_gemeinsam/spezies-navigation.css")}">
<link rel="stylesheet" href="${r("inhalte/spezies/_gemeinsam/dossier-aufbau.css")}">
<link rel="stylesheet" href="${css}">
<script type="module" src="${js}"></script>
</head>
<body class="species-archive human sy-seite" data-section="spezies" data-page="${seite}">
<div data-aporia-topbar></div>
<main class="sy-main" id="inhalt">
<div class="dossier-seitenkopf human-seitenkopf"><div class="dossier-panorama sy-panorama"><img src="${r(A.kopfbild)}" alt="" fetchpriority="high" decoding="async"></div>${reiter(von, "Storys")}</div>
${koerper}
</main>
</body>
</html>
`;
}

const ordnung = (a, b) => (a.stNr && b.stNr ? a.stNr.localeCompare(b.stNr) : a.stNr ? -1 : b.stNr ? 1 : ART_REIHENFOLGE.indexOf(a.art) - ART_REIHENFOLGE.indexOf(b.art) || a.titel.localeCompare(b.titel, "de"));

// ---------- Leseseite ----------
function leseseite(s, i, liste) {
    const von = `${ZIEL}/${s.slug}/${s.slug}.html`;
    const { html, inh } = bloeckeHtml(s, von);
    const vor = liste[i - 1], nach = liste[i + 1];
    const karte = (z, richtung) => z ? `<a class="sy-blatt sy-blatt--${richtung}" href="${rel(von, `${ZIEL}/${z.slug}/${z.slug}.html`)}"><small>${richtung === "vor" ? "← Vorherige" : "Nächste →"}</small><strong>${z.stNr ? esc(z.stNr) + " · " : ""}${esc(z.titel)}</strong></a>` : "<span></span>";
    const verwandt = liste.filter((z) => z !== s && z.strang && z.strang === s.strang);
    const titelHtml = s.stNr ? `<span class="sy-nr">${esc(s.stNr)}</span><i class="sy-trenn"> – </i>${esc(s.titel)}` : esc(s.titel);
    const felder = s.felder.length ? `<dl class="sy-felder">${s.felder.map(([k, w]) => `<div><dt>${esc(k)}</dt><dd>${inline(w, s, von)}</dd></div>`).join("")}</dl>` : "";
    const vorbem = s.vorbemerkung.length ? `<aside class="sy-vorbemerkung"><p class="sy-kicker">Vorbemerkung</p>${s.vorbemerkung.map((l) => `<p>${inline(l.trim(), s, von)}</p>`).join("")}</aside>` : "";
    const koerper = `
<div class="sy-fortschritt" aria-hidden="true"><span></span></div>
<header class="sy-lesekopf" style="--ort:${ORT[s.orte[0]]?.f}">
  <nav class="sy-pfad" aria-label="Archivpfad"><a href="${rel(von, `${A.seiten}/Hauptseite/Spezies.html`)}" data-route="${A.route}">${esc(A.name)}</a><span aria-hidden="true">›</span><a href="${rel(von, `${ZIEL}/storys.html`)}" data-route="${A.route}-storys">Storys</a><span aria-hidden="true">›</span><span aria-current="page">${esc(s.stNr || s.titel)}</span></nav>
  <p class="sy-kicker">${esc(ART_TEXT[s.art])}${s.strang ? " · " + esc(s.strang) : ""}${s.obertitel ? " · " + esc(s.obertitel) : ""}</p>
  <h1>${titelHtml}</h1>
  ${s.untertitel ? `<p class="sy-untertitel">${esc(s.untertitel)}</p>` : ""}
  ${tagsHtml(s)}
  <div class="sy-kennzahlen">${s.orte.map(ortChip).join("")}<span>${s.kapitel || "–"} Abschnitte</span><span>ca. ${lesezeit(s.woerter)} Min. Lesezeit</span>${s.status ? `<span>${esc(s.status)}</span>` : ""}</div>
  ${felder}
</header>
<div class="sy-leselayout">
  <nav class="sy-inhalt" aria-label="Abschnitte dieser Geschichte">
    <p class="sy-kicker">Abschnitte</p>
    ${inh.map((x) => `<a href="#${x.k}">${esc(x.text.replace(/\*\*/g, ""))}</a>`).join("\n    ") || "<p>Ein Abschnitt</p>"}
    <a class="sy-zurueck" href="${rel(von, `${ZIEL}/storys.html`)}" data-route="${A.route}-storys">← Alle Storys</a>
  </nav>
  <article class="sy-text">
    ${vorbem}
    ${html}
    <p class="sy-quelle">Quelle: Info_material · ${esc(A.name)} · Storys/${esc(path.relative(path.join(ROOT, INFO), path.join(ROOT, s.datei)).replace(/\\/g, "/"))}</p>
  </article>
</div>
${verwandt.length ? `<section class="sy-verwandt"><h2>Im Handlungsstrang „${esc(s.strang)}“</h2><div class="sy-mini">${verwandt.map((z) => miniKarte(z, von)).join("")}</div></section>` : ""}
<nav class="sy-blaettern" aria-label="Storys blättern">${karte(vor, "vor")}${karte(nach, "nach")}</nav>`;
    const css = `${s.slug}.css`, js = `${s.slug}.js`;
    write(von, rahmen(von, { titel: `${s.stNr ? s.stNr + " – " : ""}${s.titel} · Storys · ${A.name} · APORIA`, beschreibung: s.anriss.slice(0, 160), css, js, koerper, seite: `${A.route}-storys` }));
    write(`${ZIEL}/${s.slug}/${css}`, `@import url("../storys-basis.css");\n`);
    write(`${ZIEL}/${s.slug}/${js}`, `import { leseseite } from "../storys-basis.js";\nleseseite();\n`);
}

const miniKarte = (z, von) => `<a class="sy-minikarte" href="${rel(von, `${ZIEL}/${z.slug}/${z.slug}.html`)}" style="--ort:${ORT[z.orte[0]]?.f}"><small>${esc(ART_TEXT[z.art])}${z.stNr ? " · " + esc(z.stNr) : ""}</small><strong>${esc(z.titel)}</strong><span>${z.kapitel || "–"} Abschnitte · ca. ${lesezeit(z.woerter)} Min.</span></a>`;

// ---------- Übersicht ----------
function uebersicht(liste) {
    const von = `${ZIEL}/storys.html`;
    const kette = liste.filter((s) => s.stNr);
    const nrs = kette.map((s) => Number(s.stNr.slice(3)));
    const luecken = [];
    for (let n = 1; n <= Math.max(0, ...nrs); n++) if (!nrs.includes(n)) luecken.push(n);
    const knoten = [...kette.map((s) => ({ n: Number(s.stNr.slice(3)), s })), ...luecken.map((n) => ({ n }))].sort((a, b) => a.n - b.n);
    const arten = ART_REIHENFOLGE.filter((a) => liste.some((s) => s.art === a));
    const orteGenutzt = A.orte.filter(([k]) => liste.some((s) => s.orte.includes(k)));
    const woerter = liste.reduce((x, s) => x + s.woerter, 0);
    const straenge = [...new Set(liste.map((s) => s.strang).filter(Boolean))];
    const zeitleiste = knoten.map(({ n, s }) => {
        const nr = "ST-" + String(n).padStart(4, "0");
        if (!s) return `<li class="sy-knoten sy-knoten--offen" data-art="" data-orte=""><span class="sy-punkt" aria-hidden="true"></span><div class="sy-karte"><p class="sy-kicker">${nr}</p><h3>Noch nicht im Archiv</h3><p>Dieser Storybaustein wird in anderen Geschichten erwähnt, liegt aber noch nicht im Story-Ordner.</p></div></li>`;
        return `<li class="sy-knoten" data-art="${s.art}" data-orte="${s.orte.join(" ")}" style="--ort:${ORT[s.orte[0]]?.f}"><span class="sy-punkt" aria-hidden="true"></span>
<a class="sy-karte" href="${rel(von, `${ZIEL}/${s.slug}/${s.slug}.html`)}">
<p class="sy-kicker">${esc(s.stNr)} · ${esc(ART_TEXT[s.art])}</p>
<h3>${esc(s.titel)}</h3>
<div class="sy-chips">${s.orte.map(ortChip).join("")}${s.strang ? `<span class="sy-strang">${esc(s.strang)}</span>` : ""}</div>
<p class="sy-anriss">${esc(s.anriss.length > 230 ? s.anriss.slice(0, 228).replace(/\s+\S*$/, "") + " …" : s.anriss)}</p>
<p class="sy-meta">${s.kapitel || "–"} Abschnitte · ca. ${lesezeit(s.woerter)} Min.${s.version ? " · Version " + esc(s.version) : ""}<span class="sy-lesen">Lesen →</span></p>
</a></li>`;
    }).join("\n");
    const strangKarten = straenge.map((st) => {
        const teile = liste.filter((s) => s.strang === st);
        return `<article class="sy-strangkarte" data-orte="${[...new Set(teile.flatMap((s) => s.orte))].join(" ")}"><h3>${esc(st)}</h3><p class="sy-meta">${teile.length} ${teile.length === 1 ? "Text" : "Texte"} · ca. ${lesezeit(teile.reduce((x, s) => x + s.woerter, 0))} Min.</p><div class="sy-mini">${teile.map((z) => miniKarte(z, von)).join("")}</div></article>`;
    }).join("\n");
    const weitere = liste.filter((s) => !s.stNr && !s.strang);
    const ortBand = orteGenutzt.map(([k, n, f], i) => {
        const anz = liste.filter((s) => s.orte.includes(k)).length;
        return `${i ? '<span class="sy-bahn" aria-hidden="true"></span>' : ""}<button type="button" class="sy-welt sy-welt--${k}" data-ort="${k}" aria-pressed="false" style="--ort:${f}"><span class="sy-kugel" aria-hidden="true"></span><strong>${esc(n)}</strong><small>${anz} ${anz === 1 ? "Text" : "Texte"}</small></button>`;
    }).join("");
    const koerper = `
<header class="sy-kopf">
  <p class="sy-kicker">${esc(A.name)} · Storyarchiv</p>
  <h1>Storys</h1>
  <p class="sy-untertitel">${esc(A.untertitel)}</p>
  <p class="sy-einleitung">${esc(A.einleitung)}</p>
  <div class="sy-zahlen"><div><strong>${kette.length}</strong><span>nummerierte Geschichten</span></div><div><strong>${liste.length}</strong><span>Texte insgesamt</span></div><div><strong>${straenge.length}</strong><span>Handlungsstränge</span></div><div><strong>ca. ${Math.round(lesezeit(woerter) / 6) / 10} Std.</strong><span>Lesezeit</span></div></div>
</header>
<section class="sy-schauplaetze" aria-labelledby="sy-orte-t">
  <h2 id="sy-orte-t">Schauplätze</h2>
  <p class="sy-hinweis">Die Reise der Menschheit – zum Filtern einen Schauplatz wählen.</p>
  <div class="sy-reise">${ortBand}</div>
</section>
<div class="sy-filter" role="group" aria-label="Nach Art filtern"><button type="button" data-art="" aria-pressed="true">Alle</button>${arten.map((a) => `<button type="button" data-art="${a}" aria-pressed="false">${esc(ART_TEXT[a])} <small>${liste.filter((s) => s.art === a).length}</small></button>`).join("")}</div>
<section class="sy-zeitleiste-bereich" aria-labelledby="sy-zeit-t">
  <h2 id="sy-zeit-t">Zeitleiste</h2>
  <ol class="sy-zeitleiste">${zeitleiste}</ol>
  <p class="sy-leer" hidden>Keine Geschichte passt zu dieser Auswahl.</p>
</section>
${straenge.length ? `<section class="sy-straenge" aria-labelledby="sy-str-t"><h2 id="sy-str-t">Handlungsstränge</h2><div class="sy-strang-raster">${strangKarten}</div></section>` : ""}
${weitere.length ? `<section class="sy-straenge" aria-labelledby="sy-weit-t"><h2 id="sy-weit-t">Weitere Texte</h2><div class="sy-mini">${weitere.map((z) => miniKarte(z, von)).join("")}</div></section>` : ""}`;
    write(von, rahmen(von, { titel: `Storys · ${A.name} · APORIA`, beschreibung: `${A.untertitel} – Storyarchiv der ${A.name} im APORIA-Weltenarchiv.`, css: "storys.css", js: "storys.js", koerper, seite: `${A.route}-storys` }));
    write(`${ZIEL}/storys.css`, `@import url("storys-basis.css");\n`);
    write(`${ZIEL}/storys.js`, `import { uebersicht } from "./storys-basis.js";\nuebersicht();\n`);
}

// ---------- gemeinsame Gestaltung ----------
function basis() {
    const r = (p) => rel(`${ZIEL}/storys-basis.js`, p);
    write(`${ZIEL}/storys-basis.js`, `// Storys · gemeinsames Verhalten (erzeugt von scripts/spezies/storys.mjs)
import "${r("Menüs/TopBar/Top_bar.js")}";
import "${r("Menüs/Side_bar/side_bar.js")}";
import { applyAporiaRoutes } from "${r("Menüs/adapter/aporia-routes.js")}";
applyAporiaRoutes(document);

export function uebersicht() {
    const knoten = [...document.querySelectorAll(".sy-knoten, .sy-strangkarte")];
    const artKnoepfe = [...document.querySelectorAll(".sy-filter button")];
    const ortKnoepfe = [...document.querySelectorAll(".sy-welt")];
    let art = "", ort = "";
    const anwenden = () => {
        let sichtbar = 0;
        for (const k of knoten) {
            const passt = (!art || k.dataset.art === art || (k.classList.contains("sy-strangkarte") && !art)) && (!ort || (k.dataset.orte || "").split(" ").includes(ort));
            const zeigen = k.classList.contains("sy-knoten--offen") ? !art && !ort : passt;
            k.hidden = !zeigen;
            if (zeigen && k.classList.contains("sy-knoten")) sichtbar++;
        }
        document.querySelector(".sy-leer").hidden = sichtbar > 0;
        artKnoepfe.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.art === art)));
        ortKnoepfe.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.ort === ort)));
    };
    artKnoepfe.forEach((b) => b.addEventListener("click", () => { art = b.dataset.art; anwenden(); }));
    ortKnoepfe.forEach((b) => b.addEventListener("click", () => { ort = ort === b.dataset.ort ? "" : b.dataset.ort; anwenden(); }));
}

export function leseseite() {
    const balken = document.querySelector(".sy-fortschritt span");
    const text = document.querySelector(".sy-text");
    const links = [...document.querySelectorAll(".sy-inhalt a[href^='#']")];
    const abschnitte = links.map((a) => document.getElementById(a.hash.slice(1))).filter(Boolean);
    const melden = () => {
        const r = text.getBoundingClientRect();
        const anteil = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight)));
        if (balken) balken.style.transform = \`scaleX(\${anteil})\`;
        let aktiv = abschnitte[0];
        for (const s of abschnitte) if (s.getBoundingClientRect().top < innerHeight * 0.3) aktiv = s;
        links.forEach((a) => a.toggleAttribute("aria-current", a.hash === "#" + aktiv?.id));
    };
    addEventListener("scroll", melden, { passive: true });
    addEventListener("resize", melden);
    melden();
}
`);
    write(`${ZIEL}/storys-basis.css`, `/* Storys · gemeinsame Gestaltung (erzeugt von scripts/spezies/storys.mjs) */
.sy-seite { --sy-glas: #0b2533e6; --sy-linie: #3d7187; --sy-text: #e4f5ff; --sy-leise: #9fc3d3; --sy-gold: #ffd19a; background: radial-gradient(ellipse at 70% -10%, #1a4a63 0, transparent 55%), radial-gradient(ellipse at 0% 60%, #3a2a1a55, transparent 60%), #04131f; color: var(--sy-text); }
.sy-main { min-width: 0; padding: 0 clamp(1rem, 2vw, 1.6rem) 4rem; }
.sy-main > :not(.dossier-seitenkopf) { max-width: 84rem; margin-inline: auto; }
.sy-seite .human-seitenkopf > .sy-panorama { height: clamp(12rem, 34svh, 24rem); overflow: hidden; border-radius: 1rem; }
.sy-seite .human-seitenkopf > .sy-panorama > img { object-fit: cover; mask-image: linear-gradient(to bottom, #000 60%, transparent); }
.sy-seite .dossier-reiter { color: #a6edff; }
.sy-kicker { margin: 0 0 .3rem; font: 600 .78rem/1.3 system-ui, sans-serif; letter-spacing: .14em; text-transform: uppercase; color: var(--sy-gold); }
.sy-seite h1 { font: 400 clamp(2rem, 5vw, 3.8rem)/1.08 Georgia, serif; letter-spacing: .04em; margin: .2rem 0 .4rem; overflow-wrap: anywhere; }
.sy-seite h2 { font: 400 clamp(1.35rem, 2.6vw, 1.9rem)/1.2 Georgia, serif; color: var(--sy-gold); margin: 2.4rem 0 1rem; }
.sy-untertitel { font-size: clamp(1.05rem, 2vw, 1.35rem); color: #bfe9ff; margin: 0 0 .8rem; }
.sy-trenn { display: inline-block; width: 0; overflow: hidden; vertical-align: bottom; font-size: 0; }
.sy-nr { display: inline-block; font: 700 .42em/1 system-ui, sans-serif; letter-spacing: .12em; padding: .45em .7em; margin-right: .5em; vertical-align: middle; border: 1px solid var(--sy-gold); border-radius: 999px; color: var(--sy-gold); }

/* Kopf der Übersicht */
.sy-kopf { position: relative; padding: clamp(1.2rem, 3vw, 2.4rem); margin-top: .4rem; border: 1px solid var(--sy-linie); border-radius: 1.1rem; background: linear-gradient(140deg, #0f3446f0, #061a26f5 70%); box-shadow: 0 1.2rem 2.5rem -1.8rem #000; }
.sy-einleitung { max-width: 70ch; line-height: 1.6; color: var(--sy-leise); }
.sy-zahlen { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .6rem; margin-top: 1.2rem; }
.sy-zahlen div { padding: .7rem .9rem; border-radius: .7rem; background: #ffffff0a; border: 1px solid #ffffff14; }
.sy-zahlen strong { display: block; font: 600 clamp(1.3rem, 3vw, 1.9rem)/1.1 Georgia, serif; color: var(--sy-gold); }
.sy-zahlen span { font-size: .85rem; color: var(--sy-leise); }

/* Schauplätze als Reise */
.sy-hinweis { color: var(--sy-leise); margin: -.5rem 0 1rem; }
.sy-reise { display: flex; align-items: center; gap: 0; padding: 1.2rem; border-radius: 1rem; background: radial-gradient(ellipse at 50% 120%, #1b3f55, transparent 70%), #061722; border: 1px solid var(--sy-linie); overflow-x: auto; }
.sy-welt { flex: 0 0 auto; display: grid; justify-items: center; gap: .3rem; padding: .5rem .8rem; background: none; border: 1px solid transparent; border-radius: .9rem; color: inherit; font: inherit; cursor: pointer; }
.sy-welt:hover, .sy-welt[aria-pressed="true"] { border-color: var(--ort); background: #ffffff0a; }
.sy-kugel { width: clamp(3.2rem, 7vw, 5rem); aspect-ratio: 1; border-radius: 50%; background: radial-gradient(circle at 32% 30%, #fff8, transparent 30%), radial-gradient(circle at 50% 50%, var(--ort), #0b1d29 95%); box-shadow: 0 0 1.6rem -.3rem var(--ort), inset -.6rem -.5rem 1rem #0009; transition: transform .25s; }
.sy-welt--erdmond .sy-kugel { width: clamp(2.2rem, 4.5vw, 3.2rem); }
.sy-welt--titan .sy-kugel { background: radial-gradient(circle at 32% 30%, #fff5, transparent 30%), radial-gradient(circle, #f6c27a, #a8621f 70%, #3a220d); }
.sy-welt--uebergreifend .sy-kugel { border-radius: 30%; transform: rotate(45deg) scale(.7); }
.sy-welt:hover .sy-kugel { transform: scale(1.08); }
.sy-welt--uebergreifend:hover .sy-kugel { transform: rotate(45deg) scale(.78); }
.sy-welt small { color: var(--sy-leise); }
.sy-bahn { flex: 1 1 3rem; min-width: 2rem; height: 2px; background: repeating-linear-gradient(90deg, #8beaff99 0 .5rem, transparent .5rem 1rem); }

/* Filter */
.sy-filter { display: flex; flex-wrap: wrap; gap: .45rem; margin: 1.6rem 0 0; }
.sy-filter button { font: inherit; font-size: .92rem; color: var(--sy-text); background: #0d2c3b; border: 1px solid var(--sy-linie); border-radius: 999px; padding: .4rem .9rem; cursor: pointer; }
.sy-filter button small { color: var(--sy-leise); margin-left: .25rem; }
.sy-filter button[aria-pressed="true"] { background: var(--sy-gold); color: #1d1206; border-color: var(--sy-gold); }
.sy-filter button[aria-pressed="true"] small { color: #3d2a12; }

/* Zeitleiste */
.sy-zeitleiste { list-style: none; position: relative; margin: 0; padding: 0; display: grid; gap: 1.1rem; }
.sy-zeitleiste::before { content: ""; position: absolute; top: .5rem; bottom: .5rem; left: 50%; width: 2px; transform: translateX(-50%); background: linear-gradient(#4fb3e8, #c9ced6 45%, #f0a95a); opacity: .7; }
.sy-knoten { position: relative; display: grid; grid-template-columns: minmax(0, 1fr) 3rem minmax(0, 1fr); align-items: start; }
.sy-knoten[hidden] { display: none; }
@media (min-width: 901px) { .sy-knoten + .sy-knoten { margin-top: -2.5rem; } }
.sy-knoten > .sy-karte { grid-column: 1; }
.sy-knoten:nth-child(even) > .sy-karte { grid-column: 3; }
.sy-punkt { grid-column: 2; grid-row: 1; justify-self: center; margin-top: 1.3rem; width: 1rem; height: 1rem; border-radius: 50%; background: var(--ort, #567); box-shadow: 0 0 0 .3rem #04131f, 0 0 1rem var(--ort, transparent); z-index: 1; }
.sy-karte { grid-row: 1; display: block; padding: 1rem 1.1rem; border-radius: .9rem; border: 1px solid var(--sy-linie); border-top: 3px solid var(--ort, var(--sy-linie)); background: var(--sy-glas); color: inherit; text-decoration: none; transition: transform .2s, box-shadow .2s; }
a.sy-karte:hover, a.sy-karte:focus-visible { transform: translateY(-2px); box-shadow: 0 .8rem 1.6rem -1rem var(--ort); }
.sy-karte h3 { font: 600 1.2rem/1.25 Georgia, serif; margin: 0 0 .5rem; color: #f2fbff; }
.sy-anriss { color: var(--sy-leise); line-height: 1.55; margin: .5rem 0; }
.sy-meta { display: flex; flex-wrap: wrap; gap: .3rem 1rem; align-items: center; font-size: .85rem; color: var(--sy-leise); margin: .4rem 0 0; }
.sy-lesen { margin-left: auto; color: var(--sy-gold); font-weight: 600; }
.sy-knoten--offen .sy-karte { border-style: dashed; border-top-width: 1px; background: transparent; opacity: .75; }
.sy-knoten--offen .sy-punkt { background: transparent; border: 2px dashed var(--sy-leise); }
.sy-chips, .sy-kennzahlen { display: flex; flex-wrap: wrap; gap: .35rem; }
.sy-ort, .sy-strang, .sy-kennzahlen > span:not(.sy-ort) { font-size: .78rem; padding: .2rem .6rem; border-radius: 999px; border: 1px solid #ffffff22; background: #ffffff0d; }
.sy-ort { border-color: var(--ort); color: var(--ort); }
.sy-leer { color: var(--sy-leise); text-align: center; }

/* Handlungsstränge und Minikarten */
.sy-strang-raster { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 22rem), 1fr)); gap: .9rem; }
.sy-strangkarte { padding: 1rem; border-radius: .9rem; border: 1px solid var(--sy-linie); background: var(--sy-glas); }
.sy-strangkarte[hidden] { display: none; }
.sy-strangkarte h3 { font: 600 1.15rem/1.2 Georgia, serif; margin: 0; color: var(--sy-gold); }
.sy-mini { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 15rem), 1fr)); gap: .55rem; margin-top: .7rem; }
.sy-minikarte { display: grid; gap: .2rem; padding: .7rem .8rem; border-radius: .7rem; border: 1px solid #ffffff1c; border-left: 3px solid var(--ort, var(--sy-linie)); background: #ffffff08; color: inherit; text-decoration: none; }
.sy-minikarte:hover, .sy-minikarte:focus-visible { background: #ffffff12; }
.sy-minikarte small { font-size: .74rem; letter-spacing: .06em; text-transform: uppercase; color: var(--sy-gold); }
.sy-minikarte strong { font-weight: 600; line-height: 1.3; }
.sy-minikarte span { font-size: .8rem; color: var(--sy-leise); }

/* Leseseite */
.sy-fortschritt { position: fixed; inset: 0 0 auto; height: 3px; z-index: 50; pointer-events: none; }
.sy-fortschritt span { display: block; height: 100%; background: linear-gradient(90deg, #8beaff, var(--sy-gold)); transform-origin: left; transform: scaleX(0); }
.sy-lesekopf { padding: clamp(1.2rem, 3vw, 2.2rem); margin-top: .4rem; position: relative; border: 1px solid var(--sy-linie); border-top: 3px solid var(--ort); border-radius: 1.1rem; background: linear-gradient(140deg, #0f3446f2, #061a26f7 70%); }
.sy-pfad { display: flex; flex-wrap: wrap; gap: .4rem; font-size: .85rem; margin-bottom: .8rem; color: var(--sy-leise); }
.sy-tags { display: flex; flex-wrap: wrap; gap: .35rem; margin: .4rem 0 .8rem; }
.sy-tags span { font-size: .8rem; padding: .2rem .6rem; border-radius: .4rem; background: #8beaff14; border: 1px solid #8beaff33; }
.sy-felder { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 14rem), 1fr)); gap: .4rem .9rem; margin: 1rem 0 0; }
.sy-felder div { padding: .45rem .6rem; border-radius: .5rem; background: #ffffff08; }
.sy-felder dt { font-size: .74rem; letter-spacing: .08em; text-transform: uppercase; color: var(--sy-gold); }
.sy-felder dd { margin: .1rem 0 0; }
.sy-leselayout { display: grid; grid-template-columns: minmax(0, 16rem) minmax(0, 1fr); gap: clamp(1rem, 3vw, 2.5rem); margin-top: 1.6rem; align-items: start; }
.sy-inhalt { position: sticky; top: 8.5rem; max-height: calc(100vh - 10rem); overflow: auto; display: grid; gap: .1rem; padding: .9rem; border-radius: .9rem; border: 1px solid var(--sy-linie); background: var(--sy-glas); font-size: .9rem; }
.sy-inhalt a { color: var(--sy-leise); text-decoration: none; padding: .3rem .5rem; border-left: 2px solid transparent; border-radius: 0 .3rem .3rem 0; }
.sy-inhalt a:hover, .sy-inhalt a[aria-current] { color: #fff; border-left-color: var(--sy-gold); background: #ffffff0c; }
.sy-inhalt .sy-zurueck { margin-top: .6rem; color: var(--sy-gold); }
.sy-text { max-width: 74ch; font-size: 1.06rem; line-height: 1.75; }
.sy-text h2 { margin-top: 2.6rem; padding-bottom: .35rem; border-bottom: 1px solid #ffd19a33; scroll-margin-top: 8.5rem; }
.sy-abschnitt { scroll-margin-top: 8.5rem; }
.sy-tag > h2 { font-size: 1.1rem; letter-spacing: .14em; text-transform: uppercase; color: #8beaff; border: 0; text-align: center; }
.sy-text h3 { font: 600 1.2rem/1.3 Georgia, serif; color: #cfeeff; margin: 1.8rem 0 .5rem; }
.sy-text h4 { font: 600 1rem/1.3 system-ui, sans-serif; color: var(--sy-gold); margin: 1.4rem 0 .4rem; }
.sy-text p { margin: .7rem 0; }
.sy-text ul, .sy-text ol { padding-left: 1.3rem; }
.sy-text li { margin: .25rem 0; }
.sy-text li::marker { color: var(--sy-gold); }
.sy-text .sy-tief { margin-left: 1.2rem; list-style-type: circle; }
.sy-sprecher { margin: 1.3rem 0 -.3rem !important; font: 700 .82rem/1.2 system-ui, sans-serif; letter-spacing: .12em; text-transform: uppercase; color: var(--sy-gold); }
.sy-rede { padding: .2rem 0 .2rem 1rem; border-left: 2px solid #ffd19a66; font-style: italic; color: #f4ecdf; }
.sy-vorbemerkung { padding: .8rem 1rem; border-radius: .8rem; background: #ffd19a12; border: 1px solid #ffd19a33; font-size: .98rem; }
.sy-tabelle { overflow-x: auto; margin: 1rem 0; }
.sy-tabelle table { border-collapse: collapse; width: 100%; font-size: .93rem; line-height: 1.45; }
.sy-tabelle th, .sy-tabelle td { padding: .5rem .65rem; border: 1px solid #ffffff1f; text-align: left; vertical-align: top; }
.sy-tabelle th { background: #8beaff14; color: var(--sy-gold); }
.sy-code { white-space: pre-wrap; padding: .8rem 1rem; border-radius: .6rem; background: #0009; border: 1px solid #ffffff1a; font-size: .85rem; }
.sy-text code { font-size: .88em; padding: .05em .3em; border-radius: .25rem; background: #ffffff12; }
.sy-linie { border: 0; height: 1px; margin: 2rem 0; background: linear-gradient(90deg, transparent, #ffc889, #74dbff, transparent); }
.sy-st { color: var(--sy-gold) !important; font-weight: 600; }
.sy-quelle { margin-top: 2.5rem !important; font-size: .8rem; color: var(--sy-leise); }
.sy-verwandt { margin-top: 2rem; }
.sy-blaettern { display: grid; grid-template-columns: 1fr 1fr; gap: .8rem; margin-top: 2.2rem; }
.sy-blatt { display: grid; gap: .2rem; padding: .9rem 1rem; border-radius: .8rem; border: 1px solid var(--sy-linie); background: var(--sy-glas); color: inherit; text-decoration: none; }
.sy-blatt--nach { text-align: right; }
.sy-blatt small { color: var(--sy-gold); }
.sy-blatt:hover { background: #12384b; }

@media (max-width: 900px) {
    .sy-zahlen { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .sy-leselayout { grid-template-columns: minmax(0, 1fr); }
    .sy-inhalt { position: static; max-height: none; }
    .sy-zeitleiste::before { left: 1rem; }
    .sy-knoten { grid-template-columns: 2rem minmax(0, 1fr); }
    .sy-knoten > .sy-karte, .sy-knoten:nth-child(even) > .sy-karte { grid-column: 2; }
    .sy-punkt { grid-column: 1; }
}
@media (max-width: 560px) {
    .sy-main { width: min(100% - 2rem, 84rem); }
    .sy-blaettern { grid-template-columns: 1fr; }
    .sy-blatt--nach { text-align: left; }
}
@media (prefers-reduced-motion: reduce) { .sy-karte, .sy-kugel { transition: none; } }
`);
}

// ---------- Navigation und Route ----------
function navigationErgaenzen() {
    const route = `${A.route}-storys`;
    // Reiter „Storys“ hinter „Technologien“ auf allen Seiten der Spezies
    const seiten = walk(path.join(ROOT, A.seiten)).filter((f) => f.endsWith(".html") && !f.replace(/\\/g, "/").includes("/Unterseiten/Storys/"));
    let n = 0;
    for (const f of seiten) {
        let h = fs.readFileSync(f, "utf8");
        if (h.includes(`data-route="${route}"`)) continue;
        const relF = path.relative(ROOT, f).replace(/\\/g, "/");
        const link = `<a href="${rel(relF, `${ZIEL}/storys.html`)}" data-route="${route}">Storys</a>`;
        const neu = h.replace(/(<a [^>]*data-route="[^"]*-technologien"[^>]*>Technologien<\/a>)/, `$1${link}`);
        if (neu !== h) { fs.writeFileSync(f, neu); n++; }
    }
    // Route
    const rf = path.join(ROOT, "Menüs/adapter/aporia-routes.js");
    let r = fs.readFileSync(rf, "utf8");
    if (!r.includes(`"${route}"`)) {
        const pfad = `../../${ZIEL}/storys.html`.split("/").map((t) => (t === ".." ? t : encodeURIComponent(t))).join("/");
        r = r.replace(/(\s*"[^"]+-technologien": new URL\("[^"]*\/Humanoide\/[^"]*", import\.meta\.url\)\.href,)/, `$1\n    "${route}": new URL("${pfad}", import.meta.url).href,`);
        fs.writeFileSync(rf, r);
    }
    return n;
}

// ---------- Ablauf ----------
const dateien = walk(path.join(ROOT, INFO)).filter((f) => f.endsWith(".md")).map((f) => path.relative(ROOT, f).replace(/\\/g, "/"));
ALLE = dateien.map(lesen).sort(ordnung);
// alte Leseseiten entfernen (neu bauen)
for (const e of fs.existsSync(path.join(ROOT, ZIEL)) ? fs.readdirSync(path.join(ROOT, ZIEL), { withFileTypes: true }) : []) if (e.isDirectory()) fs.rmSync(path.join(ROOT, ZIEL, e.name), { recursive: true });
basis();
ALLE.forEach((s, i) => leseseite(s, i, ALLE));
uebersicht(ALLE);
const nav = navigationErgaenzen();
console.log(`${A.name}: ${ALLE.length} Storys · Übersicht + ${ALLE.length} Leseseiten · Reiter auf ${nav} Seiten ergänzt`);
for (const s of ALLE) console.log(`  ${(s.stNr || "–").padEnd(8)} ${s.art.padEnd(19)} ${s.orte.join("+").padEnd(14)} ${String(s.kapitel).padStart(3)} Abschn.  ${s.titel}`);
