// Orbitaloiden – gemeinsame Funktionen für Hauptseite und alle Unterseiten.
// Wird von der jeweiligen Seiten-JS importiert (z. B. Unterseiten/Biologie/biologie.js).
import { applyAporiaRoutes } from "../../../../Men%C3%BCs/adapter/aporia-routes.js";
import "../../../../Men%C3%BCs/TopBar/Top_bar.js";
import "../../../../Men%C3%BCs/Side_bar/side_bar.js";
import { mountGalleryZoom } from "../../_gemeinsam/galerie-zoom.js";
import { mountBilderKarussell } from "../../_gemeinsam/bilder-karussell.js";

if (matchMedia("(max-width: 760px)").matches) {
    document.querySelector("[data-aporia-sidebar]")?.setAttribute("data-sidebar-default-collapsed", "");
}

applyAporiaRoutes(document);

// Kapitelleiste: aktives Kapitel hervorheben, Sprung öffnet eine geschlossene Karte
const sprung = document.querySelector("[data-st-sprung]");
if (sprung) {
    const links = new Map([...sprung.querySelectorAll('a[href^="#"]')].map((a) => [a.getAttribute("href").slice(1), a]));
    if ("IntersectionObserver" in window) {
        const beobachter = new IntersectionObserver((eintraege) => {
            for (const eintrag of eintraege) {
                if (!eintrag.isIntersecting) continue;
                links.forEach((a) => a.classList.remove("is-active"));
                links.get(eintrag.target.id)?.classList.add("is-active");
            }
        }, { rootMargin: "-25% 0px -65% 0px" });
        links.forEach((_, id) => { const ziel = document.getElementById(id); if (ziel) beobachter.observe(ziel); });
    }
    sprung.addEventListener("click", (event) => {
        const link = event.target.closest('a[href^="#"]');
        const ziel = link && document.getElementById(link.getAttribute("href").slice(1));
        if (ziel instanceof HTMLDetailsElement && !ziel.open) ziel.open = true;
    });
}
const ziel = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
if (ziel instanceof HTMLDetailsElement) ziel.open = true;
else if (ziel instanceof Element && ziel.closest("details")) ziel.closest("details").open = true;

// Alle Kapitel auf- oder zuklappen
const kapitel = [...document.querySelectorAll(".st-inhalt details.st-karte")];
const klappKnopf = document.querySelector("[data-st-klappen]");
if (klappKnopf && kapitel.length) {
    const stand = () => {
        const alleOffen = kapitel.every((k) => k.open);
        klappKnopf.setAttribute("aria-pressed", String(alleOffen));
        klappKnopf.textContent = alleOffen ? "Alle zuklappen" : "Alle aufklappen";
    };
    klappKnopf.addEventListener("click", () => {
        const oeffnen = !kapitel.every((k) => k.open);
        kapitel.forEach((k) => { k.open = oeffnen; });
        stand();
    });
    kapitel.forEach((k) => k.addEventListener("toggle", stand));
    stand();
} else klappKnopf?.remove();

// Großansicht mit Zoom (gemeinsamer Adapter galerie-zoom.js) für alle Bildkarusselle
const dialog = document.querySelector("dialog.st-zoom");
const karusselle = document.querySelectorAll("[data-karussell]");
if (dialog && karusselle.length) {
    const vollbild = mountGalleryZoom(dialog);
    const bild = dialog.querySelector("img");
    const ausgabe = dialog.querySelector("output");
    let liste = [], aktuell = 0;
    const zeigen = (index) => {
        aktuell = (index + liste.length) % liste.length;
        const quelle = liste[aktuell];
        bild.src = quelle.currentSrc || quelle.src;
        bild.alt = quelle.alt;
        ausgabe.textContent = (aktuell + 1) + " / " + liste.length + " · " + quelle.alt;
    };
    for (const wurzel of karusselle) mountBilderKarussell(wurzel, { oeffnen(bilder, index) { liste = bilder; zeigen(index); vollbild(); } });
    dialog.querySelectorAll("[data-step]").forEach((knopf) => knopf.addEventListener("click", () => zeigen(aktuell + Number(knopf.dataset.step))));
    dialog.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        zeigen(aktuell + (event.key === "ArrowRight" ? 1 : -1));
    });
    dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
}

// Heimatwelt-Kasten (Planetendossier + Sternenkarte) für Spezies mit Heimatwelt
import "../../_gemeinsam/heimatwelt-verweis.js";
