// Dendroarchen – Medienseite
// Galerie nach dem Muster der Architektoiden-Medienseite; Video, Audio, 3D und Assets
// lädt der gemeinsame Medienplayer aus inhalte/medien/medien.json (Schlüssel „dendroarchen.*“).
import "../../dendroarchen-basis.js";
import { mountGalleryZoom } from "../../../../_gemeinsam/galerie-zoom.js";
import "../../../../_gemeinsam/medien-player.js";

const galerie = document.querySelector(".den-gallery");
const vorschau = galerie.querySelector(".den-gallery-feature");
const auswahl = galerie.querySelector("[data-gallery-select]");
const motive = [...auswahl.options];
const kacheln = [...galerie.querySelectorAll("[data-gallery-index]")];
const dialog = document.querySelector(".den-content dialog");
const vollbild = mountGalleryZoom(dialog);

function zeige(index) {
    const nr = (index + motive.length) % motive.length;
    auswahl.selectedIndex = nr;
    const { value, textContent } = motive[nr];
    for (const bereich of [vorschau, dialog]) {
        const bild = bereich.querySelector("img");
        bild.src = value;
        bild.alt = textContent;
        bereich.querySelector("output").textContent = `${nr + 1} / ${motive.length} · ${textContent}`;
    }
    for (const kachel of kacheln) kachel.setAttribute("aria-pressed", String(Number(kachel.dataset.galleryIndex) === nr));
}
const schritt = (richtung) => zeige(auswahl.selectedIndex + richtung);

auswahl.addEventListener("change", () => zeige(auswahl.selectedIndex));
for (const kachel of kacheln) kachel.addEventListener("click", () => zeige(Number(kachel.dataset.galleryIndex)));
for (const knopf of galerie.querySelectorAll("[data-preview]")) knopf.addEventListener("click", () => schritt(Number(knopf.dataset.preview)));
for (const knopf of dialog.querySelectorAll("[data-step]")) knopf.addEventListener("click", () => schritt(Number(knopf.dataset.step)));
vorschau.querySelector(".feature-open").addEventListener("click", vollbild);
dialog.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    schritt(event.key === "ArrowRight" ? 1 : -1);
});
zeige(Number(auswahl.dataset.start) || 0);
