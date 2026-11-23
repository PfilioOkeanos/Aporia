// Chitinoiden – gemeinsame Funktionen für Hauptseite und alle Unterseiten.
// Wird von der jeweiligen Seiten-JS importiert (z. B. Unterseiten/Biologie/biologie.js).
import { applyAporiaRoutes } from "../../../../Men%C3%BCs/adapter/aporia-routes.js";
import "../../../../Men%C3%BCs/TopBar/Top_bar.js";
import "../../../../Men%C3%BCs/Side_bar/side_bar.js";
import { mountGalleryZoom } from "../../_gemeinsam/galerie-zoom.js";

if (matchMedia("(max-width: 760px)").matches) {
    document.querySelector("[data-aporia-sidebar]")?.setAttribute("data-sidebar-default-collapsed", "");
}

applyAporiaRoutes(document);

// Kapitelleiste: aktives Kapitel hervorheben, Sprung öffnet eine geschlossene Karte
const sprung = document.querySelector("[data-ch-sprung]");
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

// Medienfilter (z. B. Medienleiste der Hauptseite)
for (const gruppe of document.querySelectorAll("[data-ch-galerie]")) {
    const knoepfe = gruppe.querySelectorAll("[data-filter]");
    for (const knopf of knoepfe) knopf.addEventListener("click", () => {
        for (const k of knoepfe) k.setAttribute("aria-pressed", String(k === knopf));
        for (const kachel of gruppe.querySelectorAll(".ch-kachel[data-kategorie]")) kachel.hidden = knopf.dataset.filter !== "" && kachel.dataset.kategorie !== knopf.dataset.filter;
    });
}

// Großansicht mit Zoom (gemeinsamer Adapter galerie-zoom.js); blättert nur durch sichtbare Bilder
const dialog = document.querySelector("dialog.ch-zoom");
const alleKacheln = [...document.querySelectorAll("[data-ch-galerie] .ch-kachel")];
if (dialog && alleKacheln.length) {
    const oeffnen = mountGalleryZoom(dialog);
    const bild = dialog.querySelector("img");
    const ausgabe = dialog.querySelector("output");
    let liste = alleKacheln, aktuell = 0;
    const zeigen = (index) => {
        aktuell = (index + liste.length) % liste.length;
        const quelle = liste[aktuell].querySelector("img");
        bild.src = quelle.currentSrc || quelle.src;
        bild.alt = quelle.alt;
        ausgabe.textContent = (aktuell + 1) + " / " + liste.length + " · " + quelle.alt;
    };
    alleKacheln.forEach((kachel) => kachel.addEventListener("click", () => {
        liste = alleKacheln.filter((k) => !k.hidden && k.closest("[data-ch-galerie]") === kachel.closest("[data-ch-galerie]"));
        zeigen(liste.indexOf(kachel));
        oeffnen();
    }));
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
