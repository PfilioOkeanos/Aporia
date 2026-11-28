// Aerothanen · gemeinsames Verhalten (erzeugt von scripts/spezies/eigene/aerothanen.mjs)
import "../../../../Men%C3%BCs/TopBar/Top_bar.js";
import { applyAporiaRoutes } from "../../../../Men%C3%BCs/adapter/aporia-routes.js";
applyAporiaRoutes(document);

// Kapitel: alle auf-/zuklappen, Sprungziel öffnen
const kapitel = [...document.querySelectorAll("details.ae-kapitel")];
const klappen = document.querySelector("[data-ae-klappen]");
if (klappen && kapitel.length) {
    const stand = () => { const alle = kapitel.every((k) => k.open); klappen.setAttribute("aria-pressed", String(alle)); klappen.textContent = alle ? "Alle zuklappen" : "Alle aufklappen"; };
    klappen.addEventListener("click", () => { const auf = !kapitel.every((k) => k.open); kapitel.forEach((k) => { k.open = auf; }); stand(); });
    kapitel.forEach((k) => k.addEventListener("toggle", stand));
    stand();
}
const ziel = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
if (ziel instanceof HTMLDetailsElement) ziel.open = true;

// Großansicht mit Blättern (Pfeiltasten, Knöpfe, Wischen)
const dialog = document.querySelector(".ae-gross");
if (dialog) {
    const bild = dialog.querySelector("img"), titel = dialog.querySelector("figcaption strong"), zaehler = dialog.querySelector(".ae-gross-zaehler"), link = dialog.querySelector("figcaption a");
    let liste = [], aktuell = 0;
    const sichtbar = () => [...document.querySelectorAll(".ae-werk-bild")].filter((b) => !b.closest("[hidden]"));
    const zeigen = (i) => {
        aktuell = (i + liste.length) % liste.length;
        const b = liste[aktuell];
        bild.src = b.dataset.vor; bild.alt = b.dataset.titel;
        titel.textContent = b.dataset.titel; link.href = b.dataset.gross;
        zaehler.textContent = (aktuell + 1) + " / " + liste.length + " · " + b.dataset.kategorie;
    };
    document.addEventListener("click", (e) => {
        const knopf = e.target.closest(".ae-werk-bild");
        if (!knopf) return;
        liste = sichtbar(); zeigen(liste.indexOf(knopf)); dialog.showModal();
    });
    dialog.querySelectorAll("[data-schritt]").forEach((k) => k.addEventListener("click", () => zeigen(aktuell + Number(k.dataset.schritt))));
    dialog.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") zeigen(aktuell + 1); if (e.key === "ArrowLeft") zeigen(aktuell - 1); });
    dialog.addEventListener("click", (e) => { if (e.target === dialog || e.target.tagName === "FIGURE") dialog.close(); });
    let startX = null;
    dialog.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
    dialog.addEventListener("touchend", (e) => { if (startX === null) return; const dx = e.changedTouches[0].clientX - startX; if (Math.abs(dx) > 50) zeigen(aktuell + (dx < 0 ? 1 : -1)); startX = null; }, { passive: true });
}

// Medien: Bildarchiv filtern
const filter = [...document.querySelectorAll(".ae-filter button")];
filter.forEach((b) => b.addEventListener("click", () => {
    filter.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    document.querySelectorAll(".ae-galerie--archiv .ae-werk").forEach((w) => { w.hidden = !!b.dataset.filter && w.dataset.kategorie !== b.dataset.filter; });
}));
