// Quelltext-Kapitel · liest ein Markdown-Dossier mit Abschnitten „### KÜRZEL01 – Titel“ (z. B. heimatwelt-referenz.md
// einer Spezies) und liefert je Abschnitt Dossier-Abschnitte für heimatwelt-bauen.mjs (text, liste, daten, karten).
// So stehen die ausführlichen Quelldaten vollständig im Planetendossier und müssen nicht auf der Spezies-Seite stehen.
// Nutzung in einer Heimatwelt-Beschreibung:
//   const hw = quellAbschnitte("Info_material/…/05_Heimatwelt/heimatwelt-referenz.md");
//   kapitel: { "Astronomie": { abschnitte: hw("HW02", "HW13") } }
import fs from "node:fs";
import { ROOT } from "./koerper.mjs";

const sauber = (s) => s.replace(/\*\*/g, "").replace(/`/g, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").trim();
// „Schlüssel: Wert“ mit kurzem Schlüssel → Datenzeile
const paar = (s) => { const m = s.match(/^([^:]{2,48}):\s+(.+)$/); return m && !/[.!?]$/.test(m[1]) ? [m[1].trim(), m[2].trim()] : null; };

function bloecke(zeilen, titel) {
    const aus = [];
    let akt = null, lauf = null;
    const neu = (t) => { akt = { titel: t }; aus.push(akt); lauf = null; };
    neu(titel);
    let tabelle = null;
    // Listenlauf abschließen: überwiegend „Schlüssel: Wert“ → Datenzeilen (Rest als Liste), sonst alles als Liste
    const schliessen = () => {
        if (!lauf) return;
        const paare = lauf.map(paar);
        if (paare.filter(Boolean).length * 2 >= lauf.length) lauf.forEach((t, i) => paare[i] ? (akt.daten ??= []).push(paare[i]) : (akt.liste ??= []).push(t));
        else (akt.liste ??= []).push(...lauf);
        lauf = null;
    };
    for (const roh of zeilen) {
        const z = roh.trim();
        if (!z || z === "---") { tabelle = null; continue; }
        const h4 = z.match(/^#{4,6}\s+(.+)$/);
        if (h4) { schliessen(); neu(sauber(h4[1])); tabelle = null; continue; }
        if (z.startsWith("|")) {
            schliessen();
            const zellen = z.replace(/^\||\|$/g, "").split("|").map((x) => sauber(x));
            if (zellen.every((x) => /^:?-+:?$/.test(x))) continue;
            if (!tabelle) { tabelle = zellen; continue; }   // Kopfzeile
            (akt.karten ??= []).push({ titel: zellen[0], text: zellen.slice(1).map((x, i) => `${tabelle[i + 1]}: ${x}`).join(" · ") });
            continue;
        }
        const li = z.match(/^(?:[-*]|\d+\.)\s+(.+)$/);
        if (li) { (lauf ??= []).push(sauber(li[1])); continue; }
        schliessen();
        const t = sauber(z);
        // Einleitungssatz mit Doppelpunkt nach einer Liste wird Überschrift des nächsten Blocks
        if (akt.liste || akt.daten || akt.karten) {
            if (/:$/.test(t) && t.length < 80) { neu(t.replace(/:$/, "")); continue; }
            neu(`${titel} · Fortsetzung`);
        }
        (akt.text ??= []).push(t);
    }
    schliessen();
    return aus.filter((b) => b.text || b.liste || b.daten || b.karten);
}

export function quellAbschnitte(datei) {
    const text = fs.readFileSync(ROOT + datei, "utf8").split(/\r?\n/);
    const abschnitte = new Map();
    let kuerzel = null, titel = "", sammel = [];
    const ende = () => { if (kuerzel) abschnitte.set(kuerzel, bloecke(sammel, titel)); };
    for (const z of text) {
        const m = z.trim().match(/^###\s+([A-Z]{1,4}\d{2})\s+[–-]\s+(.+)$/);
        if (m) { ende(); kuerzel = m[1]; titel = sauber(m[2]); sammel = []; continue; }
        if (kuerzel && !/^#{1,2}\s/.test(z.trim())) sammel.push(z);
    }
    ende();
    const benutzt = new Set();
    const hole = (...k) => k.flatMap((x) => { if (!abschnitte.has(x)) throw new Error(`${datei}: Abschnitt ${x} fehlt`); benutzt.add(x); return abschnitte.get(x); });
    // nicht zugeordnete Abschnitte melden, damit keine Quelldaten verloren gehen
    hole.rest = () => [...abschnitte.keys()].filter((k) => !benutzt.has(k));
    return hole;
}
