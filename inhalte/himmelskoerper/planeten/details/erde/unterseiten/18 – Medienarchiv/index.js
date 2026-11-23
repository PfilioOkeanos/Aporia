import "../../../../../../../Men%C3%BCs/TopBar/Top_bar.js";
import "../../../../../../../Men%C3%BCs/Side_bar/side_bar.js";
import { applyAporiaRoutes, getAporiaRoute } from "../../../../../../../Men%C3%BCs/adapter/aporia-routes.js";

applyAporiaRoutes();
const karte = document.querySelector("[data-earth-map]");
if (karte) {
    const ziel = new URL(getAporiaRoute("sternenkarte"));
    ziel.searchParams.set("objekt", "Kugel 4");
    karte.href = ziel.href;
}

// Kategorie-Filter der Wissensbilder
for (const leiste of document.querySelectorAll("[data-filterbar]")) {
    const knoepfe = leiste.querySelectorAll("[data-filter]");
    const bilder = leiste.querySelectorAll("figure[data-kategorie]");
    for (const knopf of knoepfe) knopf.addEventListener("click", () => {
        for (const k of knoepfe) k.setAttribute("aria-pressed", String(k === knopf));
        for (const b of bilder) b.hidden = knopf.dataset.filter !== "" && b.dataset.kategorie !== knopf.dataset.filter;
    });
}
// Großansicht
const lightbox = document.querySelector(".erde-lightbox");
document.addEventListener("click", (event) => {
    const knopf = event.target.closest("[data-gross]");
    if (!knopf || !lightbox) return;
    lightbox.querySelector("img").src = knopf.dataset.gross;
    lightbox.querySelector("img").alt = knopf.querySelector("img").alt;
    lightbox.querySelector("p").textContent = knopf.querySelector("img").alt;
    lightbox.showModal();
});
lightbox?.addEventListener("click", (event) => { if (event.target === lightbox) lightbox.close(); });
