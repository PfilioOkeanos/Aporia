// APORIA · Animationen an/aus (zentral für alle Seiten, geladen über Top_bar.js)
//
// Seiten schreiben weiter ganz normal  @media (prefers-reduced-motion: reduce) { … }  in ihr CSS.
// Dieses Modul ersetzt solche Regeln beim Laden durch umschaltbare Regeln:
//   reduce          → :root[data-bewegung="aus"] …
//   no-preference   → :root:not([data-bewegung="aus"]) …
// Damit entscheidet der Schalter in der Seitenleiste – nicht mehr allein die Geräteeinstellung.
// Die Geräteeinstellung („Bewegung reduzieren“, oft im Stromsparmodus aktiv) gilt nur als Vorschlag beim ersten Besuch.
//
// JavaScript fragt statt matchMedia("(prefers-reduced-motion: reduce)") dieses Modul:
//   import { bewegungReduziert } from ".../Menüs/adapter/aporia-bewegung.js";
//   if (bewegungReduziert.matches) …;  bewegungReduziert.addEventListener("change", …)

const SCHLUESSEL = "aporia.bewegung";
const ATTRIBUT = "data-bewegung";
const geraet = matchMedia("(prefers-reduced-motion: reduce)");

function gespeichert() {
    try {
        const wert = localStorage.getItem(SCHLUESSEL);
        if (wert === "an" || wert === "aus") return wert;
        // Erster Besuch: Geräteeinstellung als Vorschlag übernehmen und merken
        const vorschlag = geraet.matches ? "aus" : "an";
        localStorage.setItem(SCHLUESSEL, vorschlag);
        return vorschlag;
    } catch {
        return "an";   // ohne Browserspeicher laufen Animationen
    }
}

let zustand = gespeichert();
document.documentElement.setAttribute(ATTRIBUT, zustand);

// Ersatz für matchMedia("(prefers-reduced-motion: reduce)") – gleiche Form: .matches + "change"-Ereignis
const ereignisse = new EventTarget();
export const bewegungReduziert = {
    get matches() { return zustand === "aus"; },
    addEventListener: (typ, fn) => ereignisse.addEventListener(typ, fn),
    removeEventListener: (typ, fn) => ereignisse.removeEventListener(typ, fn),
};

export function animationenAn() { return zustand !== "aus"; }

export function setzeAnimationen(an) {
    zustand = an ? "an" : "aus";
    document.documentElement.setAttribute(ATTRIBUT, zustand);
    try { localStorage.setItem(SCHLUESSEL, zustand); } catch { /* nur für diese Seite */ }
    const ereignis = new Event("change");
    ereignis.matches = zustand === "aus";
    ereignisse.dispatchEvent(ereignis);
}

// ---------- CSS-Regeln umschreiben ----------
const AUS = `:root[${ATTRIBUT}="aus"]`;
const AN = `:root:not([${ATTRIBUT}="aus"])`;

// Teilt eine Selektorliste an Kommas auf oberster Ebene (nicht innerhalb von :is(…), [..])
function teileSelektoren(liste) {
    const teile = [];
    let tiefe = 0, start = 0;
    for (let i = 0; i < liste.length; i++) {
        const z = liste[i];
        if (z === "(" || z === "[") tiefe++;
        else if (z === ")" || z === "]") tiefe--;
        else if (z === "," && tiefe === 0) { teile.push(liste.slice(start, i)); start = i + 1; }
    }
    teile.push(liste.slice(start));
    return teile.map(t => t.trim()).filter(Boolean);
}

function praefix(selektor, vorsatz) {
    // html / :root bekommen die Bedingung direkt angehängt, alles andere wird darunter eingeordnet
    const m = selektor.match(/^(html|:root)(?=$|[\s.#:[>+~])/i);
    if (m) return vorsatz + selektor.slice(m[0].length);
    return vorsatz + " " + selektor;
}

function regelText(regel, vorsatz) {
    if (regel instanceof CSSStyleRule) {
        const selektoren = teileSelektoren(regel.selectorText).map(s => praefix(s, vorsatz)).join(", ");
        return `${selektoren} { ${regel.style.cssText} }`;
    }
    if (regel instanceof CSSMediaRule || (typeof CSSSupportsRule !== "undefined" && regel instanceof CSSSupportsRule)) {
        const innen = [...regel.cssRules].map(r => regelText(r, vorsatz)).filter(Boolean).join("\n");
        const kopf = regel instanceof CSSMediaRule ? `@media ${regel.conditionText ?? regel.media.mediaText}` : `@supports ${regel.conditionText}`;
        return `${kopf} { ${innen} }`;
    }
    return regel.cssText;   // z. B. @keyframes bleibt unverändert
}

function bewegungsBedingung(text) {
    if (!/prefers-reduced-motion/i.test(text)) return null;
    const ohne = text.replace(/\(\s*prefers-reduced-motion\s*:\s*(reduce|no-preference)\s*\)/gi, "").replace(/^\s*and\s+|\s+and\s*$/gi, "").replace(/\s+and\s+and\s+/gi, " and ").trim();
    const art = /prefers-reduced-motion\s*:\s*no-preference/i.test(text) ? AN : /prefers-reduced-motion\s*:\s*reduce/i.test(text) ? AUS : null;
    if (!art || /\bnot\b|,/.test(text)) return null;   // ungewöhnliche Formen nicht anfassen
    return { vorsatz: art, rest: ohne };
}

function bearbeiteListe(eltern) {
    let regeln;
    try { regeln = eltern.cssRules; } catch { return; }   // fremde Stylesheets (z. B. Schriften) sind gesperrt
    for (let i = regeln.length - 1; i >= 0; i--) {
        const regel = regeln[i];
        if (regel instanceof CSSMediaRule) {
            const bedingung = bewegungsBedingung(regel.conditionText ?? regel.media.mediaText);
            if (bedingung) {
                const innen = [...regel.cssRules].map(r => regelText(r, bedingung.vorsatz)).join("\n");
                const ersatz = bedingung.rest ? `@media ${bedingung.rest} { ${innen} }` : innen;
                try {
                    eltern.deleteRule(i);
                    // Mehrere Regeln: in umgekehrter Reihenfolge an derselben Stelle einfügen → Reihenfolge bleibt
                    const teile = bedingung.rest ? [ersatz] : [...regel.cssRules].map(r => regelText(r, bedingung.vorsatz));
                    for (let k = teile.length - 1; k >= 0; k--) {
                        try { eltern.insertRule(teile[k], i); } catch { /* einzelne fehlerhafte Regel überspringen */ }
                    }
                } catch { /* Stylesheet nicht änderbar */ }
                continue;
            }
            bearbeiteListe(regel);
        } else if (regel instanceof CSSImportRule) {
            if (regel.styleSheet) bearbeiteListe(regel.styleSheet);
        } else if (regel.cssRules && !(regel instanceof CSSKeyframesRule)) {
            bearbeiteListe(regel);   // @supports, @layer, @container …
        }
    }
}

// Wird von aporia-handy.js für jedes Stylesheet einmal aufgerufen
export function stelleBewegungsregelnUm(blatt) { bearbeiteListe(blatt); }
export { teileSelektoren };
