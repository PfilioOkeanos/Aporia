import { mountGalleryZoom } from "../../../../_gemeinsam/galerie-zoom.js";
import "../../../../_gemeinsam/medien-player.js";

const gallery = document.querySelector(".techno-gallery");
const feature = gallery.querySelector(".gallery-feature");
const picker = gallery.querySelector("[data-gallery-select]");
const choices = [...picker.options];
const tiles = [...gallery.querySelectorAll("[data-gallery-index]")];
const dialog = document.querySelector("dialog");
const openGallery = mountGalleryZoom(dialog);

function show(index) {
    const selected = (index + choices.length) % choices.length;
    picker.selectedIndex = selected;
    const { value, textContent } = choices[selected];
    for (const area of [feature, dialog]) {
        const image = area.querySelector("img");
        image.src = value;
        image.alt = textContent;
        area.querySelector("output").textContent = (selected + 1) + " / " + choices.length + " · " + textContent;
    }
    for (const tile of tiles) tile.setAttribute("aria-pressed", String(Number(tile.dataset.galleryIndex) === selected));
}

function step(direction) {
    show(picker.selectedIndex + direction);
}

picker.addEventListener("change", () => show(picker.selectedIndex));
for (const tile of tiles) tile.addEventListener("click", () => show(Number(tile.dataset.galleryIndex)));
for (const button of document.querySelectorAll("[data-preview], [data-step]")) {
    button.addEventListener("click", () => step(Number(button.dataset.preview ?? button.dataset.step)));
}
feature.querySelector(".feature-open").addEventListener("click", openGallery);
dialog.addEventListener("keydown", event => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    step(event.key === "ArrowRight" ? 1 : -1);
});
show(0);
