// APORIA · Handy-Schicht (zentral für alle Seiten, geladen über Top_bar.js)
//
// Neue Seiten brauchen dafür nichts zu tun – sie schreiben ihr CSS wie gewohnt:
//   1. Bewegung:  @media (prefers-reduced-motion: …) wird auf den Schalter „Animationen“ umgestellt (aporia-bewegung.js)
//   2. Touch:     Jede :hover-Regel bekommt auf Touch-Geräten eine Zwillingsregel mit .ist-aktiv.
//                 Ein Element im Inhalt erhält .ist-aktiv, wenn es angetippt wird (bis zum nächsten Tippen woanders).
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
            // Regeln, die beim Überfahren eine Animation anhalten, gelten am Handy nicht – Antippen soll nichts stoppen
            const stil = regel.style;
            if (stil.animationPlayState === "paused" || stil.animationName === "none") continue;
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
// Hover-Effekte erscheinen am Handy auf dem Element, das angetippt wird (wie ein Mausklick darauf).
// Tippt man woanders hin, wandert der Effekt mit bzw. verschwindet. Nicht dauerhaft, nicht beim bloßen Scrollen.
let aktive = [];

function istInhalt(element) {
    return !element.closest(NAVIGATION);
}

function istHoverElement(element) {
    for (const basis of hoverBasen) {
        try { if (element.matches(basis)) return true; } catch { /* ungültiger Teilselektor */ }
    }
    return false;
}

if (TOUCH) {
    document.addEventListener("pointerdown", event => {
        if (event.pointerType !== "touch" && !new URLSearchParams(location.search).has("touch-test")) return;
        const neu = [];
        for (let el = event.target; el && el !== document.body; el = el.parentElement) {
            if (el instanceof Element && istInhalt(el) && istHoverElement(el)) neu.push(el);
        }
        for (const el of aktive) if (!neu.includes(el)) el.classList.remove(KLASSE);
        for (const el of neu) el.classList.add(KLASSE);
        aktive = neu;
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

// ---------- 4: Leisten am Handy ----------
// Topbar und „zweite Leisten“ (Seitennavigation wie Saalplan oder Spezies-Reiter) bleiben beim Scrollen oben.
// Der Klapp-Knopf in der Topbar (Top_bar.js) klappt beide von Hand ein/aus – die Wahl wird gemerkt.
// Zweite Leisten werden automatisch erkannt und bekommen .aporia-zweitleiste. CSS dazu: Top_bar.css.
const handyAnsicht = matchMedia(HANDY_MEDIA);
const LEISTEN_SCHLUESSEL = "aporia.leisten.zu";

export function leistenZu() {
    return document.documentElement.classList.contains("aporia-leisten-zu");
}
export function setzeLeistenZu(zu) {
    document.documentElement.classList.toggle("aporia-leisten-zu", zu);
    try { localStorage.setItem(LEISTEN_SCHLUESSEL, zu ? "ja" : "nein"); } catch { /* nur für diese Seite */ }
}
try { if (localStorage.getItem(LEISTEN_SCHLUESSEL) === "ja") document.documentElement.classList.add("aporia-leisten-zu"); } catch { /* ohne Speicher: offen */ }

// Spezies-Reiter (Übersicht · Allgemeines · Biologie …) sind immer zweite Leisten
const REITERLEISTEN = ".dossier-seitennavigation, nav[class$='-reiter'], nav[class*='-reiter ']";
const ZWEITLEISTEN_KANDIDATEN = "main nav, main header, body > nav, body > header, [class*='reiter'], [class*='leiste'], [class*='saalplan'], [class*='navigation']";
// Hohe klebende Seitenspalten (Kapitel, Sprungmarken) – in der einspaltigen Handy-Ansicht nicht kleben lassen
const KLEBESPALTEN = "main aside, main nav, main [class*='chapter'], main [class*='rail'], main [class*='jump'], main [class*='sprung'], main [class*='kapitel']";

function erkenneZweitleisten() {
    for (const element of document.querySelectorAll(REITERLEISTEN)) {
        if (element.classList.contains("aporia-zweitleiste") || element.closest(NAVIGATION)) continue;
        element.classList.add("aporia-zweitleiste", "aporia-reiterleiste");
        // aktiven Reiter in den sichtbaren Bereich der waagerecht wischbaren Leiste holen
        const aktiv = element.querySelector("[aria-current]");
        if (aktiv && handyAnsicht.matches) requestAnimationFrame(() => {
            element.scrollLeft = aktiv.offsetLeft - (element.clientWidth - aktiv.offsetWidth) / 2;
        });
    }
    for (const element of document.querySelectorAll(ZWEITLEISTEN_KANDIDATEN)) {
        // eigene Knöpfe der Handy-Schicht (Lasche/Klapp-Knopf) sind keine Leisten der Seite
        if (element.classList.contains("aporia-zweitleiste") || element.closest(NAVIGATION) || element.matches(".aporia-leisten-lasche, .aporia-leisten-knopf")) continue;
        const stil = getComputedStyle(element);
        if ((stil.position === "sticky" || stil.position === "fixed") && parseFloat(stil.top) <= 220 && element.offsetHeight < innerHeight * .25) {
            element.classList.add("aporia-zweitleiste");
        }
    }
    if (!handyAnsicht.matches) return;
    for (const element of document.querySelectorAll(KLEBESPALTEN)) {
        if (element.classList.contains("aporia-zweitleiste") || element.classList.contains("aporia-handy-statisch")) continue;
        if (getComputedStyle(element).position === "sticky" && element.offsetHeight > innerHeight * .35) element.classList.add("aporia-handy-statisch");
    }
}

// ---------- 5: Seitentyp-Erweiterungen fürs Handy (nur geladen, wenn die Seite den Aufbau hat) ----------
// Eintrag: { erkennen: "<CSS-Selektor>", modul: "<Pfad relativ zu dieser Datei>" }
const ERWEITERUNGEN = [];
const geladen = new Set();
function ladeErweiterungen() {
    for (const { erkennen, modul } of ERWEITERUNGEN) {
        if (geladen.has(modul) || !document.querySelector(erkennen)) continue;
        geladen.add(modul);
        import(modul).catch(fehler => console.warn("APORIA Handy-Erweiterung nicht geladen:", modul, fehler));
    }
}

// ---------- Ablauf ----------
function aktualisieren() {
    ladeErweiterungen();
    bearbeiteStylesheets();
    erfasseEndlosAnimationen();
    erkenneZweitleisten();
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
