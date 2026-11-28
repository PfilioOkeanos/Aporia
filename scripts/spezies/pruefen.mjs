// Spezies-Baukasten · Prüfen: steht jede Zeile der Info-Dateien auf den Seiten? Aufruf: npm run spezies:pruefen [-- Spezies …]
// Prüft je Spezies, ob jede Textzeile (ab 20 Zeichen) jeder Info-Datei im Text der Spezies-Seiten vorkommt.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = fileURLToPath(new URL("../../", import.meta.url)).replace(/\\/g, "/");
const INFO_BASIS = ROOT + "Info_material/Alle_spezies_daten/";
const SEITEN_BASIS = ROOT + "inhalte/spezies/";
const walk = (d) => fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]) : [];
// Spezies in allen Gruppen finden (Ordnername ohne Gruppe genügt); ohne Angabe: alle mit Infotexten
const GRUPPEN = fs.readdirSync(INFO_BASIS, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name);
const alle = GRUPPEN.flatMap((g) => fs.readdirSync(INFO_BASIS + g, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => ({ g, s: e.name })));
const wahl = process.argv.slice(2).map((x) => x.toLowerCase());
const arten = (wahl.length ? alle.filter((a) => wahl.includes(a.s.toLowerCase())) : alle.filter((a) => walk(INFO_BASIS + a.g + "/" + a.s).some((f) => !/Fragen Templates/i.test(f) && fs.statSync(f).size > 200))).filter((a) => fs.existsSync(SEITEN_BASIS + a.g + "/" + a.s));
const norm = (s) => s.normalize("NFC").replace(/[\u00ad:]/g, "").replace(/[„“”"«»]/g, '"').replace(/[‚‘’']/g, "'").replace(/[–—]/g, "-").replace(/\s+/g, " ").trim().toLowerCase();
const entities = (s) => s.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
// Heimatwelt-Dateien (05_Heimatwelt, Sternensystem) dürfen statt auf der Spezies-Seite im Planetendossier stehen,
// wenn eine Heimatwelt-Beschreibung (scripts/planeten/heimatwelten/*.mjs) mit „doppelteWeglassen“ die Quelltexte dorthin überträgt
const { findeKoerper } = await import("../planeten/koerper.mjs");
const dossierFuer = {};
for (const d of fs.readdirSync(ROOT + "scripts/planeten/heimatwelten").filter((x) => x.endsWith(".mjs"))) {
    const quelle = fs.readFileSync(ROOT + "scripts/planeten/heimatwelten/" + d, "utf8");
    if (!quelle.includes("quellAbschnitte(")) continue;
    const spec = (await import(new URL("../planeten/heimatwelten/" + d, import.meta.url).href)).default;
    try {
        const K = findeKoerper(spec.ordner);
        // Zeilen, die heimatwelt-bauen.mjs als doppelt weggelassen hat (dieselbe Angabe steht berechnet im Dossier)
        const inhalt = ROOT + K.datenDatei.replace(/\.json$/, ".inhalt.json");
        const doppelt = fs.existsSync(inhalt) ? JSON.parse(fs.readFileSync(inhalt, "utf8")).weggelasseneDoppel ?? [] : [];
        dossierFuer[spec.spezies.ordner] = { basis: K.basis, abgedeckt: new Set(doppelt.map(norm)) };
    } catch { /* Körper ohne Dossier */ }
}
const zuText = (html) => norm(entities(html.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<\/?(strong|em|b|i|code)>|<\/?a\b[^>]*>/g, "").replace(/<[^>]+>/g, " ")));
const ergebnis = {};
for (const { g, s: art } of arten) {
    const SEITEN = SEITEN_BASIS + g + "/", INFO = INFO_BASIS + g + "/";
    const html = walk(SEITEN + art).filter((f) => f.endsWith(".html")).map((f) => fs.readFileSync(f, "utf8")).join("\n");
    // Inline-Auszeichnung ohne Leerraum entfernen (Fett am Satzende), Blockgrenzen als Leerraum
    const text = norm(entities(html.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<\/?(strong|em|b|i|code)>|<\/?a\b[^>]*>/g, "").replace(/<[^>]+>/g, " ")));
    const dossier = dossierFuer[art];
    const dossierText = dossier ? zuText(walk(ROOT + dossier.basis).filter((f) => f.endsWith(".html")).map((f) => fs.readFileSync(f, "utf8")).join("\n")) : "";
    const fehlend = [];
    let gesamt = 0;
    for (const f of walk(INFO + art)) {
        const rel = path.relative(INFO + art, f).replace(/\\/g, "/");
        // an Kopfzeilen klebende Abschnittsüberschriften („… · Titan01 – …“) wie die Storys-Seiten getrennt prüfen
        const zeilen = fs.readFileSync(f, "utf8").split(/\r?\n/).flatMap((l) => { const m = l.match(/^(.*·.*[^\d\s–-])(\d{1,2}(?: –|\.) [A-ZÄÖÜ].*)$/); return m ? [m[1], m[2]] : [l]; });
        const ebene = zeilen.filter((z) => /^#\s+\d+\.\d+/.test(z.trim())).length >= 3 ? 1 : zeilen.filter((z) => /^##\s/.test(z.trim())).length <= 1 && zeilen.filter((z) => /^###\s/.test(z.trim())).length >= 2 ? 3 : 2;
        const imDossier = dossierText && /^(05_Heimatwelt|Sternensystem)\//.test(rel);
        let imKapitel = false;
        for (const roh of zeilen) {
            let z = roh.trim();
            if (!z || z === "---" || /^\|[\s:|-]+\|?$/.test(z)) continue;
            // Dateititel (Überschriften oberhalb der Kapitelebene) und fette Dokumentkennungen vor dem ersten Kapitel sind keine Inhalte
            const h = z.match(/^(#{1,6})\s/);
            if (h && h[1].length < ebene) continue;
            if (ebene === 1 && h && h[1].length === 1 && !/^#\s+\d+\.\d+/.test(z)) continue;   // Dateititel ohne Kapitelnummer
            if (h && h[1].length === ebene) imKapitel = true;
            if (!imKapitel && /^\*\*[^*]+\*\*$/.test(z)) continue;
            z = z.replace(/^#{1,6}\s+/, "").replace(/^[-*]\s+/, "").replace(/^\d+\.\s+(?=\D)/, "").replace(/\*\*/g, "").replace(/`/g, "").replace(/\[([^\]]+)\]\((?:[^()\s]|\([^()\s]*\))*\)/g, "$1").replace(/^\.\s+/, "").replace(/^\|/, "").replace(/\|$/, "");
            // Tabellenzeilen zellenweise prüfen
            const teile = roh.trim().startsWith("|") ? z.split("|").map((x) => x.trim()) : [z];
            for (const t of teile) {
                const n = norm(t);
                if (n.length < 20) continue;
                gesamt++;
                // Kapitelnummer vor Überschriften („3.1 Titel“) darf auf der Seite getrennt stehen
                const ohneNr = n.replace(/^(\d+(\.\d+)*\.?|[a-zäöü]{1,6}\d{0,3}\s+-)\s+/, "");
                if (!text.includes(n) && !text.includes(ohneNr) && !(imDossier && (dossierText.includes(n) || dossierText.includes(ohneNr) || dossier.abgedeckt.has(n)))) fehlend.push(rel + ": " + t.slice(0, 90));
            }
        }
    }
    ergebnis[art] = { gesamt, fehlend: fehlend.length };
    console.log(`${art}: ${gesamt - fehlend.length}/${gesamt} Zeilen gefunden` + (fehlend.length ? `\n  ` + fehlend.slice(0, Number(process.env.MAX || 25)).join("\n  ") + (fehlend.length > Number(process.env.MAX || 25) ? `\n  … +${fehlend.length - Number(process.env.MAX || 25)}` : "") : ""));
}
