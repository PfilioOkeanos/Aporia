// Stellaroiden – gemeinsame Funktionen für Hauptseite und alle Unterseiten.
// Wird von der jeweiligen Seiten-JS importiert (z. B. Unterseiten/Biologie/biologie.js).
import { applyAporiaRoutes } from "../../../../Men%C3%BCs/adapter/aporia-routes.js";
import "../../../../Men%C3%BCs/TopBar/Top_bar.js";
import "../../../../Men%C3%BCs/Side_bar/side_bar.js";

if (matchMedia("(max-width: 760px)").matches) {
    document.querySelector("[data-aporia-sidebar]")?.setAttribute("data-sidebar-default-collapsed", "");
}

applyAporiaRoutes(document);

// Kapitelleiste: aktives Kapitel hervorheben, Sprung öffnet eine geschlossene Karte
const sprungleiste = document.querySelector("[data-ste-jumps]");
if (sprungleiste) {
    const links = new Map([...sprungleiste.querySelectorAll('a[href^="#"]')].map((a) => [a.getAttribute("href").slice(1), a]));
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
    sprungleiste.addEventListener("click", (event) => {
        const link = event.target.closest('a[href^="#"]');
        const ziel = link && document.getElementById(link.getAttribute("href").slice(1));
        if (ziel instanceof HTMLDetailsElement && !ziel.open) ziel.open = true;
    });
}

// „Alle öffnen / Alle schließen“ für die Unterkapitel-Karten
document.addEventListener("click", (event) => {
    const knopf = event.target.closest("[data-ste-toggle]");
    if (!knopf) return;
    const offen = knopf.dataset.steToggle === "open";
    document.querySelectorAll("details.ste-card").forEach((karte) => { karte.open = offen; });
});

// Heimatwelt-Kasten (Planetendossier + Sternenkarte) für Spezies mit Heimatwelt
import "../../_gemeinsam/heimatwelt-verweis.js";
