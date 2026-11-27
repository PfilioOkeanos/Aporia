// Spezies-Baukasten · Ergänzen: fehlende Info-Kapitel auf älteren, von Hand gebauten Seiten einfügen.
// Ergänzt auf älteren Speziesseiten die Info-Kapitel, deren Inhalte auf den Seiten der Spezies noch fehlen.
// Einfügen als Bereich „Aus dem Infomaterial“ vor </main>; wiederholbar (vorhandener Bereich wird ersetzt).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { kapitel, esc } from "./bibliothek.mjs";

const ROOT = fileURLToPath(new URL("../../", import.meta.url)).replace(/\\/g, "/");
const INFO = "Info_material/Alle_spezies_daten/Biologische Spezies/";
const SEITEN = ROOT + "inhalte/spezies/Biologische Spezies/";
const AUFTRAG = {
    "Technologische Lebensformen/Architektoiden": [["01_Speziesdaten/speziesdaten.md", "hauptseite/Spezies.html"], ["02_Geschichte_Entwicklung/entwicklung.md", "Unterseiten/Entwicklung/entwicklung.html"], ["02_Geschichte_Entwicklung/geschichte.md", "Unterseiten/Geschichte/geschichte.html"], ["03_Gesellschaft_Kultur/gesellschaft.md", "Unterseiten/Gesellschaft/gesellschaft.html"], ["04_Politik_Fraktionsbeziehungen/politik.md", "Unterseiten/Politik/politik.html"], ["05_Heimatwelt/heimatwelt-referenz.md", "Unterseiten/Heimatwelt/heimatwelt.html"], ["Gameplay/gameplay", "Gameplay/gameplay.html"], ["Forschung/Module", "Gameplay/gameplay.html"], ["medien/@medien", "Unterseiten/Medien/medien.html"]],
    "Technologische Lebensformen/Biomechnoiden": [["Gameplay/.gitkeep", "Gameplay/gameplay.html"]],
    "Gigantische Lebensformen/Dendroarchen": [["Allgemeines/Allgemeines", "hauptseite/Spezies.html"], ["Gameplay/.gitkeep", "Gameplay/gameplay.html"]],
    "Mentale Spezies/MueMoiden": [["Allgemeines/Allgemeines", "hauptseite/Spezies.html"], ["Gameplay/.gitkeep", "Gameplay/gameplay.html"]],
    Thalassoiden: [["Forschung/.gitkeep", "Forschung/forschung.html"]],
    Aeromorphen: [["gesammteinformationen/protokoll", "Hauptseite_übersicht/Spezies.html"]],
    Mykonoiden: [["01_Speziesdaten/Speziesdaten", "hauptseite/hauptseite.html"], ["02_Geschichte_Entwicklung/geschichte.md", "geschichte/geschichte.html"], ["03_Gesellschaft_Kultur/kultur.md", "gesellschaft/gesellschaft.html"], ["03_Gesellschaft_Kultur/gesellschaft.md", "gesellschaft/gesellschaft.html"], ["04_Politik_Fraktionsbeziehungen/fraktionsbeziehungen.md", "politik/politik.html"]],
    Humanoide: [["01_Speziesdaten/speziesdaten.md", "Hauptseite/Spezies.html"], ["02_Geschichte_Entwicklung/entwicklung.md", "Unterseiten/Entwicklung/entwicklung.html"], ["02_Geschichte_Entwicklung/geschichte.md", "Unterseiten/Geschichte/geschichte.html"], ["04_Politik_Fraktionsbeziehungen/politik.md", "Unterseiten/Politik/politik.html"], ["04_Politik_Fraktionsbeziehungen/fraktionsbeziehungen.md", "Unterseiten/Politik/politik.html"], ["05_Heimatwelt/heimatwelt-referenz.md", "Unterseiten/Heimatwelt/heimatwelt.html"], ["Sternensystem/sternensytem.md", "Unterseiten/Heimatwelt/heimatwelt.html"]],
    WaldFeen: [["02_Geschichte_Entwicklung/entwicklung.md", "Unterseite/Entwicklung/entwicklung.html"], ["02_Geschichte_Entwicklung/geschichte.md", "Unterseite/Geschichte/geschichte.html"], ["03_Gesellschaft_Kultur/gesellschaft.md", "Unterseite/Gesellschaft/gesellschaft.html"], ["Technologien/tech", "Unterseite/Gesellschaft/gesellschaft.html"], ["04_Politik_Fraktionsbeziehungen/politik.md", "Unterseite/Politik/politik.html"], ["05_Heimatwelt/heimatwelt-referenz.md", "Unterseite/Heimatwelt/heimatwelt.html"], ["05_Heimatwelt/Tierarten/Tierarten", "Unterseite/Heimatwelt/heimatwelt.html"], ["05_Heimatwelt/faune/faunepflanzen", "Unterseite/Heimatwelt/heimatwelt.html"], ["01_Speziesdaten/Biologie.md", "Unterseite/biologie/biologie.html"], ["Spielintegrationgameplay/spiel gameplay", "Gameplay/gameplay.html"], ["Gameplay/gameplay", "Gameplay/gameplay.html"]],
};
const nurArten = process.argv.slice(2);
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const norm = (s) => s.normalize("NFC").replace(/[\u00ad:]/g, "").replace(/[„“”"«»]/g, '"').replace(/[‚‘’']/g, "'").replace(/[–—]/g, "-").replace(/\s+/g, " ").trim().toLowerCase();
const ent = (s) => s.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const nurText = (html) => norm(ent(html.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<\/?(strong|em|b|i|code)>/g, "").replace(/<[^>]+>/g, " ")));
const BLOCK = /<section class="info-ergaenzung"[\s\S]*?<!-- \/info-ergaenzung -->\n?/;
const rel = (von, ziel) => path.posix.relative(path.posix.dirname(von), ziel).split("/").map((t) => (t === ".." ? t : encodeURIComponent(t))).join("/");

for (const [art, auftraege] of Object.entries(AUFTRAG)) {
    const [gruppe, name] = art.includes("/") ? art.split("/") : ["Biologische Spezies", art];
    if (nurArten.length && !nurArten.includes(art) && !nurArten.includes(name)) continue;
    const SEITEN_G = ROOT + "inhalte/spezies/" + gruppe + "/", INFO_G = "Info_material/Alle_spezies_daten/" + gruppe + "/";
    // Seitentext der Spezies ohne bisherige Ergänzungen
    const dateien = walk(SEITEN_G + name).filter((f) => f.endsWith(".html"));
    const text = nurText(dateien.map((f) => fs.readFileSync(f, "utf8").replace(BLOCK, "")).join("\n"));
    const jeSeite = {};
    for (const [info, seite] of auftraege) {
        if (!fs.existsSync(ROOT + INFO_G + name + "/" + info)) { console.log("  fehlt Infodatei:", art, info); continue; }
        const liste = kapitel(INFO_G + name + "/" + info, "ie");
        for (const k of liste) {
            // Kapitel aufnehmen, wenn ein Textbaustein (ab 20 Zeichen) auf den Seiten fehlt
            const bausteine = [...k.html.matchAll(/<(p|li|div|h3|td|th)\b[^>]*>([\s\S]*?)<\/\1>/g)].map((m) => nurText(m[2])).filter((t) => t.length >= 20);
            const titelFehlt = k.titel.length >= 20 && !text.includes(norm(k.titel));
            if (!titelFehlt && bausteine.every((b) => text.includes(b))) continue;
            const etikett = info.split("/").filter((x) => x !== ".gitkeep").pop().replace(/\.md$/, "").replace(/^\p{Ll}/u, (c) => c.toUpperCase());
            (jeSeite[seite] ??= []).push({ ...k, titel: k.vorspann ? "Steckbrief – " + etikett : k.titel, quelle: info });
        }
    }
    // Seiten ohne fehlende Kapitel: einen früher eingefügten Bereich entfernen
    for (const seite of new Set(auftraege.map(([, s]) => s))) {
        if (jeSeite[seite]) continue;
        const datei = SEITEN_G + name + "/" + seite;
        const alt = fs.readFileSync(datei, "utf8");
        if (BLOCK.test(alt)) { fs.writeFileSync(datei, alt.replace(BLOCK, "")); console.log(`${art} · ${seite}: Bereich entfernt (nichts mehr offen)`); }
    }
    for (const [seite, roh] of Object.entries(jeSeite)) {
        const zaehl = {};
        const liste = roh.map((k) => { zaehl[k.id] = (zaehl[k.id] ?? 0) + 1; return zaehl[k.id] > 1 ? { ...k, id: k.id + "-" + zaehl[k.id] } : k; });
        const datei = SEITEN_G + name + "/" + seite;
        let html = fs.readFileSync(datei, "utf8").replace(BLOCK, "");
        const webPfad = "inhalte/spezies/" + gruppe + "/" + name + "/" + seite;
        const css = rel(webPfad, "inhalte/spezies/_gemeinsam/info-ergaenzung.css");
        if (!html.includes("info-ergaenzung.css")) html = html.replace("</head>", `    <link rel="stylesheet" href="${css}">\n</head>`);
        const block = `<section class="info-ergaenzung" id="aus-dem-infomaterial" aria-labelledby="info-ergaenzung-titel">
    <h2 id="info-ergaenzung-titel">Aus dem Infomaterial</h2>
    <p class="info-ergaenzung-hinweis">Weitere Kapitel aus Info_material · ${esc(name)}, die auf dieser Seite noch nicht ausgearbeitet waren. Zum Lesen aufklappen.</p>
    <div class="info-ergaenzung-werkzeug"><button type="button" onclick="this.closest('.info-ergaenzung').querySelectorAll('details').forEach((d) => d.open = true)">Alle aufklappen</button><button type="button" onclick="this.closest('.info-ergaenzung').querySelectorAll('details').forEach((d) => d.open = false)">Alle zuklappen</button></div>
${liste.map((k) => `    <details class="info-kapitel" id="info-${k.id}"><summary><span class="info-nr">${esc(k.nr)}</span>${esc(k.titel)}</summary><div class="info-text">
${k.html}
<p class="info-quelle">Quelle: Info_material · ${esc(name)} · ${esc(k.quelle)}</p>
    </div></details>`).join("\n")}
</section><!-- /info-ergaenzung -->
`;
        const pos = html.lastIndexOf("</main>");
        if (pos < 0) throw new Error("kein </main> in " + datei);
        html = html.slice(0, pos) + block + html.slice(pos);
        fs.writeFileSync(datei, html);
        console.log(`${art} · ${seite}: ${liste.length} Kapitel ergänzt (${liste.map((k) => k.titel).join(" | ").slice(0, 160)})`);
    }
}
