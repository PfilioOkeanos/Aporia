// APORIA · Handy-Schicht (zentral für alle Seiten, geladen über Top_bar.js)
//
// Neue Seiten brauchen dafür nichts zu tun – sie schreiben ihr CSS wie gewohnt:
//   1. Bewegung:  @media (prefers-reduced-motion: …) wird auf den Schalter „Animationen“ umgestellt (aporia-bewegung.js)
//   2. Touch:     Jede :hover-Regel bekommt auf Touch-Geräten eine Zwillingsregel mit .ist-aktiv.
//                 Elemente im Inhalt erhalten .ist-aktiv, solange sie in der Bildschirmmitte stehen oder angetippt wurden.
//                 So laufen Hover-Animationen auch am Handy. Eigene Regeln können .ist-aktiv auch direkt nutzen.
//   3. Leistung:  Endlos-Animationen außerhalb des Bildschirms werden angehalten und laufen beim Hineinscrollen weiter.
//
// Ausnahmen: Elemente mit  data-ohne-touch-aktiv  (und ihr Inhalt) werden nie automatisch aktiviert.

import { stelleBewegungsregelnUm, teileSelektoren, bewegungReduziert } from "./aporia-bewegung.js";

// Wann gilt die Handy-Ansicht (Topbar mit Menü-Knopf, Seitenleiste als Seitenmenü)?
// Schmaler Bildschirm, Touch-Gerät bis Tablet-Breite oder sehr niedrige Höhe (Handy quer).
// Dieselbe Bedingung steht in Top_bar.css und Side_bar.css (CSS kann keine JS-Konstanten lesen).
export const HANDY_MEDIA = "(max-width: 760px), (pointer: coarse) and (max-width: 1024px), (max-height: 500px)";

// ?touch-test in der Adresse erzwingt das Touch-Verhalten am PC (zum Ausprobieren)
const TOUCH = matchMedia("(hover: none)").matches || new URLSearchParams(location.search).has("touch-test");
const KLASSE = "ist-aktiv";
const NAVIGATION = ".aporia-topbar, [data-aporia-topbar], #aporia-sidebar-host, [data-aporia-sidebar], [data-ohne-touch-aktiv]";

// ---------- Für Skripte: Touch-Gerät? Element in der Bildschirmmitte? ----------
// Ersatz für Maus-Hover in JavaScript:
//   import { istTouch, beobachteMitte } from ".../Menüs/adapter/aporia-handy.js";
//   beobachteMitte(karte, aktiv => { … Animation starten/stoppen … });   // ruft nur auf Touch-Geräten auf
export const istTouch = TOUCH;
const mitteRueckrufe = new WeakMap();
const mitteSkripte = TOUCH ? new IntersectionObserver(eintraege => {
    for (const e of eintraege) for (const fn of mitteRueckrufe.get(e.target) ?? []) fn(e.isIntersecting);
}, { rootMargin: "-30% 0px -30% 0px" }) : null;
export function beobachteMitte(element, rueckruf) {
    if (!mitteSkripte || !element) return;
    let liste = mitteRueckrufe.get(element);
    if (!liste) { liste = []; mitteRueckrufe.set(element, liste); mitteSkripte.observe(element); }
    liste.push(rueckruf);
}

// ---------- 1 + 2: Stylesheets einmal bearbeiten ----------
const hoverBasen = new Set();

function hoverZwilling(liste) {
    let regeln;
    try { regeln = liste.cssRules; } catch { return; }
    for (let i = regeln.length - 1; i >= 0; i--) {
        const regel = regeln[i];
        if (regel instanceof CSSStyleRule) {
            if (!regel.selectorText.includes(":hover")) continue;
            const zwillinge = [];
            for (const teil of teileSelektoren(regel.selectorText)) {
                const stelle = teil.indexOf(":hover");
                if (stelle < 0) continue;
                const basis = teil.slice(0, stelle).trim();
                if (!basis || /[>+~]$/.test(basis)) continue;
                hoverBasen.add(basis);
                zwillinge.push(teil.replaceAll(":hover", "." + KLASSE));
            }
            if (!zwillinge.length) continue;
            try { liste.insertRule(`${zwillinge.join(", ")} { ${regel.style.cssText} }`, i + 1); } catch { /* ungültige Kombination überspringen */ }
        } else if (regel instanceof CSSImportRule) {
            if (regel.styleSheet) hoverZwilling(regel.styleSheet);
        } else if (regel.cssRules && !(regel instanceof CSSKeyframesRule)) {
            hoverZwilling(regel);
        }
    }
}

const erledigt = new WeakSet();
function bearbeiteStylesheets() {
    let neu = false;
    for (const blatt of document.styleSheets) {
        if (erledigt.has(blatt)) continue;
        try {
            void blatt.cssRules;
        } catch {
            // Fremde Adresse: nie lesbar. Eigene Datei: lädt noch → beim "load"-Ereignis erneut
            if (blatt.href && new URL(blatt.href).origin !== location.origin) erledigt.add(blatt);
            continue;
        }
        erledigt.add(blatt);
        stelleBewegungsregelnUm(blatt);
        if (TOUCH) hoverZwilling(blatt);
        neu = true;
    }
    return neu;
}

// ---------- 2: Touch-Aktivierung ----------
const beobachtet = new WeakSet();
const mitte = TOUCH ? new IntersectionObserver(eintraege => {
    for (const e of eintraege) e.target.classList.toggle(KLASSE, e.isIntersecting);
}, { rootMargin: "-38% 0px -38% 0px" }) : null;

function istInhalt(element) {
    return !element.closest(NAVIGATION);
}

function beobachteHoverElemente() {
    if (!TOUCH || !hoverBasen.size) return;
    for (const basis of hoverBasen) {
        let treffer;
        try { treffer = document.querySelectorAll(basis); } catch { continue; }
        for (const element of treffer) {
            if (beobachtet.has(element) || !istInhalt(element)) continue;
            beobachtet.add(element);
            mitte.observe(element);
        }
    }
}

if (TOUCH) {
    // Antippen aktiviert sofort (ohne auf das Scrollen zu warten)
    document.addEventListener("pointerdown", event => {
        if (event.pointerType !== "touch") return;
        for (let el = event.target; el && el !== document.body; el = el.parentElement) {
            if (beobachtet.has(el)) el.classList.add(KLASSE);
        }
    }, { passive: true });
}

// ---------- 3: Endlos-Animationen außerhalb des Bildschirms anhalten ----------
const angehalten = new WeakSet();
const animationenJeElement = new WeakMap();
const sicht = "IntersectionObserver" in window ? new IntersectionObserver(eintraege => {
    for (const e of eintraege) {
        for (const animation of animationenJeElement.get(e.target) ?? []) {
            if (!e.isIntersecting && animation.playState === "running") { animation.pause(); angehalten.add(animation); }
            else if (e.isIntersecting && angehalten.has(animation)) { animation.play(); angehalten.delete(animation); }
        }
    }
}, { rootMargin: "150px" }) : null;

function erfasseEndlosAnimationen() {
    if (!sicht || !document.getAnimations) return;
    for (const animation of document.getAnimations()) {
        const ziel = animation.effect?.target;
        if (!ziel || !(animation instanceof CSSAnimation || animation instanceof CSSTransition)) continue;
        if (animation.effect.getComputedTiming().iterations !== Infinity) continue;
        let liste = animationenJeElement.get(ziel);
        if (!liste) { liste = new Set(); animationenJeElement.set(ziel, liste); sicht.observe(ziel); }
        liste.add(animation);
    }
}

// ---------- Ablauf ----------
function aktualisieren() {
    bearbeiteStylesheets();
    beobachteHoverElemente();
    erfasseEndlosAnimationen();
}

aktualisieren();
document.addEventListener("load", event => {
    if (event.target instanceof HTMLLinkElement) aktualisieren();
}, true);
window.addEventListener("load", aktualisieren);
bewegungReduziert.addEventListener("change", () => setTimeout(erfasseEndlosAnimationen, 100));

// Neue Inhalte (nachgeladene Abschnitte, Karten, Stylesheets) gesammelt einmal pro halbe Sekunde erfassen
let geplant = null;
new MutationObserver(() => {
    if (geplant) return;
    geplant = setTimeout(() => { geplant = null; aktualisieren(); }, 500);
}).observe(document.documentElement, { childList: true, subtree: true });
