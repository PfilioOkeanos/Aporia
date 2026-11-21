// Syntheten – Hauptseite (Allgemeines)
import "../syntheten-basis.js";
import { mountGalleryZoom } from "../../../_gemeinsam/galerie-zoom.js";

// Referenzbild der ersten Produktionsgeneration in der Großansicht öffnen
const dialog = document.querySelector(".syn-dialog");
const ausloeser = document.querySelector("[data-syn-zoom]");
if (dialog && ausloeser) {
    const oeffnen = mountGalleryZoom(dialog);
    ausloeser.addEventListener("click", oeffnen);
}
