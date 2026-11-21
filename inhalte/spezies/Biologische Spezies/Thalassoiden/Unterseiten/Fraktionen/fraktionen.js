// Thalassoiden – Fraktionen (Herrschaftshäuser)
// Umschalten der Häuser (Tabs), Bildleisten mit Großansicht, Direktlinks wie #haus-frevok.
import "../../thalassoiden-basis.js";
import { mountGalleryZoom } from "../../../../_gemeinsam/galerie-zoom.js";

const tabs = [...document.querySelectorAll(".fra-wappen")];
const panels = new Map([...document.querySelectorAll(".fra-haus")].map((p) => [p.dataset.haus, p]));
const sprungLinks = [...document.querySelectorAll("[data-haus-link]")];

function zeigeHaus(id, { fokus = false, scrollen = false } = {}) {
    if (!panels.has(id)) return;
    for (const tab of tabs) {
        const aktiv = tab.dataset.haus === id;
        tab.setAttribute("aria-selected", String(aktiv));
        tab.tabIndex = aktiv ? 0 : -1;
        if (aktiv && fokus) tab.focus();
    }
    panels.forEach((panel, key) => { panel.hidden = key !== id; });
    sprungLinks.forEach((a) => a.setAttribute("aria-current", String(a.dataset.hausLink === id)));
    if (scrollen) panels.get(id).scrollIntoView({ behavior: "smooth", block: "start" });
}

for (const tab of tabs) {
    tab.addEventListener("click", () => {
        zeigeHaus(tab.dataset.haus);
        history.replaceState(null, "", `#haus-${tab.dataset.haus}`);
    });
    // Pfeiltasten wechseln zwischen den Häusern
    tab.addEventListener("keydown", (event) => {
        const i = tabs.indexOf(tab);
        const ziel = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: tabs.length - 1 }[event.key];
        if (ziel === undefined) return;
        event.preventDefault();
        zeigeHaus(tabs[(ziel + tabs.length) % tabs.length].dataset.haus, { fokus: true });
    });
}
for (const link of sprungLinks) {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        zeigeHaus(link.dataset.hausLink, { scrollen: true });
        history.replaceState(null, "", `#haus-${link.dataset.hausLink}`);
    });
}
const ausHash = () => { const m = location.hash.match(/^#haus-(\w+)/); if (m) zeigeHaus(m[1], { scrollen: true }); };
window.addEventListener("hashchange", ausHash);
zeigeHaus(location.hash.match(/^#haus-(\w+)/)?.[1] ?? tabs[0]?.dataset.haus);
ausHash();

// Großansicht für die Bildleisten (gemeinsame Galerie-Zoom-Funktion des Archivs)
const dialog = document.querySelector(".fra-dialog");
const oeffnen = mountGalleryZoom(dialog);
const dialogBild = dialog.querySelector("img");
const dialogText = dialog.querySelector("output");
let aktuelleListe = [];
let position = 0;

function zeigeBild(i) {
    position = (i + aktuelleListe.length) % aktuelleListe.length;
    const knopf = aktuelleListe[position];
    dialogBild.src = knopf.dataset.bild;
    dialogBild.alt = knopf.dataset.titel;
    dialogText.textContent = `${position + 1} / ${aktuelleListe.length} · ${knopf.dataset.titel}`;
}
document.addEventListener("click", (event) => {
    const knopf = event.target.closest(".fra-thumb");
    if (!knopf) return;
    aktuelleListe = [...knopf.closest(".fra-thumbs").querySelectorAll(".fra-thumb")];
    zeigeBild(aktuelleListe.indexOf(knopf));
    oeffnen();
});
for (const knopf of dialog.querySelectorAll("[data-step]")) knopf.addEventListener("click", () => zeigeBild(position + Number(knopf.dataset.step)));
dialog.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    zeigeBild(position + (event.key === "ArrowRight" ? 1 : -1));
});
