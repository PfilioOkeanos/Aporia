// Migriert bestehende Himmelskörper-Dossiers mit dem alten Atlas-Layout.
// Aufruf: node scripts/planeten/atlas-migrieren.mjs [<art>/<slug>] [--pruefen]
import fs from "node:fs";
import path from "node:path";
import { ROOT, HK, arten, findeKoerper } from "./koerper.mjs";
import { ladeKarte, dossierPfad, kartenLink } from "./karten-verweise.mjs";
import { baueHauptseite } from "./planetendossier.mjs";
import { baueKapitel } from "./kapitel-bauen.mjs";

const read = (file) => fs.readFileSync(ROOT + file, "utf8");
const exists = (file) => fs.existsSync(ROOT + file);
const dirs = (file) => fs.readdirSync(ROOT + file, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
const pruefen = process.argv.includes("--pruefen");
const ziel = process.argv.slice(2).find((a) => a !== "--pruefen");
const karte = ladeKarte();
const objekte = new Map();
for (const o of karte) {
    const pfad = dossierPfad(o);
    if (pfad) objekte.set(pfad, o);
}
const nachId = new Map(karte.map((o) => [o.id, o]));
const entities = { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " " };
const decode = (s) => s.replace(/&(#x[0-9a-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/gi, (_, e) =>
    e.startsWith("#x") ? String.fromCodePoint(parseInt(e.slice(2), 16)) : e.startsWith("#") ? String.fromCodePoint(Number(e.slice(1))) : entities[e]);
const text = (s = "") => decode(s.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
const abs = (von, url) => {
    const s = decode(url);
    if (/^(https?:|#)/.test(s)) return s;
    const p = s.search(/[?#]/);
    const datei = p < 0 ? s : s.slice(0, p);
    return path.posix.normalize(path.posix.join(path.posix.dirname(von), decodeURIComponent(datei))) + (p < 0 ? "" : s.slice(p));
};
const block = (html, tag, klasse) => html.match(new RegExp('<' + tag + '[^>]*class="' + klasse + '"[^>]*>([\\s\\S]*?)</' + tag + '>'))?.[1] ?? "";
const h1 = (html) => text(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]);
const dl = (html, datei) => [...html.matchAll(/<dt>([\s\S]*?)<\/dt>\s*<dd>([\s\S]*?)<\/dd>/g)].map(([, k, v]) => {
    const href = v.match(/<a\b[^>]*href="([^"]+)"/)?.[1];
    return [text(k), text(v), ...(href ? [abs(datei, href)] : [])];
});
const links = (html, datei) => [...html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map(([, href, label]) => [text(label), abs(datei, href)]);
const bild = (html, datei) => {
    const src = html.match(/<img\b[^>]*src="([^"]+)"/)?.[1];
    return src ? abs(datei, src) : null;
};
const wissenschaft = /astronomie|physik|mutterplanet|gezeiten|rotation|struktur|spektral|fusion|leuchtkraft|masse|horizont|umlauf|bahnen|stabilität|dynamik|kern|zentralsterne|^planeten$|lebenszyklus|^bahn$|spin|akkretion/i;
const natur = /geografie|atmosphäre|klima|gewässer|geologie|biosphäre|umgebung|gas|staub|ionisation|sternentstehung|wolken|stürme|gaszusammensetzung|koma|schweif|zusammensetzung/i;
const gruppe = (titel) => /^(Spezies|Zivilisation|Geschichte|Fraktionen)$/.test(titel) ? "Zivilisation"
    : wissenschaft.test(titel) ? "Wissenschaft" : natur.test(titel) ? "Natur" : "Weitere";
const symbole = { Wissenschaft: "◎", Natur: "◇", Zivilisation: "✦", Weitere: "·" };

function abschnitte(inhalt, titel, datei) {
    const stuecke = inhalt.split(/<h2[^>]*>([\s\S]*?)<\/h2>/g);
    return stuecke.flatMap((teil, i) => {
        if (i % 2 || !teil.trim()) return [];
        const ueberschrift = i ? text(stuecke[i - 1]) : titel;
        const texte = [...teil.matchAll(/<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/g)].map(([, p]) => text(p)).filter(Boolean);
        const daten = dl(teil, datei);
        const quelle = bild(teil, datei);
        const figcaption = text(teil.match(/<figcaption>([\s\S]*?)<\/figcaption>/)?.[1]);
        const verweise = links(teil, datei).map(([label, href]) => [label || "Bild öffnen", href]);
        const a = { titel: ueberschrift };
        if (texte.length) a.text = texte;
        if (daten.length) a.daten = daten.map(([k, v]) => [k, v]);
        if (quelle) { a.bild = quelle; a.bildtext = figcaption || ueberschrift; }
        if (verweise.length) a.verweise = verweise;
        return Object.keys(a).length > 1 ? [a] : [];
    });
}

function uebernehme(k, alt) {
    const datei = k.hauptseite;
    const titelblock = block(alt, "div", "earth-title");
    const name = h1(titelblock);
    const klasse = text(block(titelblock, "p", "earth-class"));
    const intro = text(titelblock.match(/<\/h1>\s*<p[^>]*>[\s\S]*?<\/p>\s*<p>([\s\S]*?)<\/p>/)?.[1]);
    const status = text(block(titelblock, "p", "planet-status"));
    if (!name || !klasse || !intro || !status) throw new Error(datei + ": Titelblock unvollständig");
    const panorama = bild(block(alt, "div", "earth-panorama"), datei);
    const grunddaten = dl(block(alt, "section", "earth-panel earth-facts"), datei);
    const position = dl(alt.match(/<h2>Position<\/h2>([\s\S]*?)<\/dl>/)?.[1] ?? "", datei);
    const verknuepfungen = links(block(alt, "ul", "earth-related"), datei).map(([titel, href]) => ({ icon: "◇", art: "Weltenarchiv", titel, href }));
    const quellen = [...alt.matchAll(/<h[23]>Quellen<\/h[23]>([\s\S]*?)<\/(?:section|footer)>/g)]
        .flatMap(([, html]) => links(html, datei)).map(([titel, href]) => ({ titel, href }));
    const o = objekte.get(datei);
    const systemId = o?.systemId ?? (o?.systemName || o?.id === "Kugel 1" ? o.id : null);
    const alterKartenlink = alt.match(/<a\b[^>]*class="earth-map"[^>]*href="([^"]+)"/)?.[1];
    const sternenkarte = systemId ? kartenLink(systemId, o.id) : alterKartenlink ? abs(datei, alterKartenlink) : null;
    const elter = nachId.get(o?.bahnUm);
    if (elter && dossierPfad(elter) && !position.some(([k, v]) => v === elter.name)) position.push(["Zentralkörper", elter.name, dossierPfad(elter)]);
    for (const zeile of position) if (elter && zeile[1] === elter.name && dossierPfad(elter)) zeile[2] = dossierPfad(elter);

    const anker = new Map();
    for (const [, vorHref, href, nachHref, inhalt] of block(alt, "section", "earth-panel earth-quick").matchAll(/<a([^>]*?)href="([^"]+)"([^>]*)>([\s\S]*?)<\/a>/g)) {
        const ids = [...(vorHref + nachHref + inhalt).matchAll(/\bid="([^"]+)"/g)].map(([, id]) => id);
        if (ids.length) anker.set(abs(datei, href), [...new Set(ids)]);
    }
    const kapitel = dirs(k.unterseiten).sort((a, b) => a.localeCompare(b, "de", { numeric: true })).flatMap((ordner) => {
        const datei = k.unterseiten + "/" + ordner + "/index.html";
        if (!exists(datei)) return [];
        const html = read(datei);
        const inhalt = html.match(/<div class="dossier-content">([\s\S]*?)<\/div>\s*<h2>Dossierkapitel<\/h2>/)?.[1];
        if (inhalt === undefined) throw new Error(datei + ": Kein Inhalt im alten Atlasformat");
        const titel = h1(html);
        const g = gruppe(titel);
        const bloecke = abschnitte(inhalt.replace(/<p class="dossier-status">[\s\S]*?<\/p>/, ""), titel, datei);
        if (!titel || !bloecke.length) throw new Error(datei + ": Keine Kapitelinhalte");
        const intro = bloecke.find((b) => b.text?.length)?.text[0] ?? "";
        return [{ nr: Number.parseInt(ordner, 10), titel, ordner, datei, gruppe: g, icon: symbole[g], intro, anker: anker.get(datei) ?? [], abschnitte: bloecke }];
    });
    const player = alt.match(/<div class="earth-player"[^>]+>/)?.[0] ?? "";
    const klasseGlobus = decode(player.match(/data-planet-class="([^"]+)"/)?.[1] ?? klasse);
    const radius = Number(player.match(/data-radius="(\d+)"/)?.[1] ?? 0);
    const globusDaten = radius && o && ["planeten","monde","zwergplaneten"].includes(k.art) ? { planet: k.slug, klasse: klasseGlobus, radius } : undefined;
    const design = { schichten: kapitel.filter((c) => ["Wissenschaft", "Natur"].includes(c.gruppe)).slice(0, 6).map((c) => [c.gruppe, c.titel]) };
    return { slug: k.slug, art: k.art, name, klasse, intro, status, panorama: panorama ? [panorama] : [], sternenkarte,
        grunddaten, position, verknuepfungen, quellen, globusDaten, globusAusblenden: !globusDaten, messwerteOriginalBeschriften: true,
        erkundungText: "Astronomische und natürliche Merkmale im Überblick.", design, kapitel };
}

const kandidaten = ziel ? [findeKoerper(ziel)] : arten().flatMap((art) => dirs(HK + "/" + art + "/details").map((slug) => findeKoerper(art + "/" + slug)));
let dossiers = 0;
let kapitel = 0;
for (const k of kandidaten) {
    if (!exists(k.hauptseite)) continue;
    const alt = read(k.hauptseite);
    if (!/<body class="earth-page planet-dashboard"/.test(alt) || alt.includes("data-custom-dossier")) continue;
    const daten = uebernehme(k, alt);
    if (!pruefen) {
        const { kapitel: seiten, ...grundlage } = daten;
        grundlage.kapitel = seiten.map(({ abschnitte, ...k }) => k);
        const inhalt = { _erzeugt: "atlas-migrieren", kapitel: Object.fromEntries(seiten.map((k) => [k.titel, { abschnitte: k.abschnitte }])) };
        const inhaltDatei = k.datenDatei.replace(/\.json$/, ".inhalt.json");
        if (exists(inhaltDatei)) throw new Error(inhaltDatei + ": Inhaltsdatei existiert bereits");
        fs.mkdirSync(path.posix.dirname(ROOT + k.datenDatei), { recursive: true });
        fs.writeFileSync(ROOT + k.datenDatei, JSON.stringify(grundlage, null, 2) + "\n");
        fs.writeFileSync(ROOT + inhaltDatei, JSON.stringify(inhalt, null, 2) + "\n");
        baueHauptseite(k, daten, { protokoll: false });
        baueKapitel(k, daten, { protokoll: false });
    }
    dossiers++;
    kapitel += daten.kapitel.length;
}
console.log(dossiers + " Dossiers und " + kapitel + " Kapitel " + (pruefen ? "zur Umstellung gefunden" : "umgestellt"));

