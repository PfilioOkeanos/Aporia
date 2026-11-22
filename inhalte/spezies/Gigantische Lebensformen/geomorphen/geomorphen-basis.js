// Geomorphen – gemeinsame Funktionen für Hauptseite und alle Unterseiten.
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
const sprung = document.querySelector("[data-geo-sprung]");
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

// Großansicht mit Zoom (gemeinsamer Adapter galerie-zoom.js)
const dialog = document.querySelector("dialog.geo-zoom");
const kacheln = [...document.querySelectorAll("[data-geo-galerie] .geo-kachel")];
if (dialog && kacheln.length) {
    const oeffnen = mountGalleryZoom(dialog);
    const bild = dialog.querySelector("img");
    const ausgabe = dialog.querySelector("output");
    let aktuell = 0;
    const zeigen = (index) => {
        aktuell = (index + kacheln.length) % kacheln.length;
        const quelle = kacheln[aktuell].querySelector("img");
        bild.src = quelle.currentSrc || quelle.src;
        bild.alt = quelle.alt;
        ausgabe.textContent = (aktuell + 1) + " / " + kacheln.length + " · " + quelle.alt;
    };
    kacheln.forEach((kachel, i) => kachel.addEventListener("click", () => { zeigen(i); oeffnen(); }));
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
