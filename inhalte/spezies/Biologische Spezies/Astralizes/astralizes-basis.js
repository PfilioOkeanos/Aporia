// Astralizes · gemeinsames Verhalten (erzeugt von scripts/spezies/eigene/astralizes.mjs)
import "../../../../Men%C3%BCs/TopBar/Top_bar.js";
import { applyAporiaRoutes } from "../../../../Men%C3%BCs/adapter/aporia-routes.js";
import { bewegungReduziert } from "../../../../Menüs/adapter/aporia-bewegung.js";
applyAporiaRoutes(document);

// Großansicht mit Blättern durch alle Werke der Seite
const dialog = document.querySelector(".az-gross");
const knoepfe = [...document.querySelectorAll(".az-werk-bild[data-gross]")].filter((b) => !b.hasAttribute("aria-hidden"));
let aktuell = -1;
const zeigen = (i) => {
    aktuell = (i + knoepfe.length) % knoepfe.length;
    const b = knoepfe[aktuell];
    const img = dialog.querySelector("img");
    img.src = b.querySelector("img").src; // sofort die Vorschau, dann das Original
    const gross = new Image(); gross.onload = () => { if (knoepfe[aktuell] === b) img.src = gross.src; }; gross.src = b.dataset.gross;
    img.alt = b.dataset.titel;
    dialog.querySelector("figcaption strong").textContent = b.dataset.titel;
    dialog.querySelector(".az-inv").textContent = b.dataset.inv;
    dialog.querySelector("figcaption a").href = b.dataset.gross;
};
knoepfe.forEach((b, i) => b.addEventListener("click", () => { zeigen(i); dialog.showModal(); }));
dialog?.querySelectorAll(".az-blaettern").forEach((b) => b.addEventListener("click", () => zeigen(aktuell + Number(b.dataset.schritt))));
dialog?.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") zeigen(aktuell + 1); if (e.key === "ArrowLeft") zeigen(aktuell - 1); });
dialog?.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
export const bewegungErlaubt = !bewegungReduziert.matches;
