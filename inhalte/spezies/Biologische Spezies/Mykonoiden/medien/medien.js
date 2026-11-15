import { mountGalleryZoom } from "../../../_gemeinsam/galerie-zoom.js";
import "../../../_gemeinsam/medien-player.js";
import "../Spezies.js";

const allTiles = [...document.querySelectorAll(".rail .tile")];
let tiles = allTiles;
const feature = document.querySelector(".gallery-feature");
const dialog = document.querySelector("dialog");
const openGallery = mountGalleryZoom(dialog);
let current = Math.max(0, tiles.findIndex(tile => tile.querySelector("img").src === feature.querySelector("img").src));

function display(index, scroll = false) {
    current = (index + tiles.length) % tiles.length;
    const selected = tiles[current].querySelector("img");
    for (const container of [feature, dialog]) {
        const image = container.querySelector("img");
        image.src = selected.src;
        image.alt = selected.alt;
        container.querySelector("output").textContent = (current + 1) + " / " + tiles.length + " · " + selected.alt;
    }
    tiles.forEach((tile, i) => tile.setAttribute("aria-pressed", String(i === current)));
    if (scroll) tiles[current].scrollIntoView({ block: "nearest", inline: "nearest" });
}

allTiles.forEach(tile => tile.addEventListener("click", () => display(tiles.indexOf(tile))));
const filters = [...document.querySelectorAll("[data-gallery-filter]")];
for (const filter of filters) filter.addEventListener("click", () => {
    const category = filter.dataset.galleryFilter;
    const selected = tiles[current];
    tiles = allTiles.filter(tile => category === "alle" || tile.dataset.galleryCategory === category);
    for (const tile of allTiles) tile.hidden = !tiles.includes(tile);
    for (const button of filters) button.setAttribute("aria-pressed", String(button === filter));
    display(Math.max(0, tiles.indexOf(selected)), true);
});
feature.querySelector(".feature-open").addEventListener("click", openGallery);
for (const button of document.querySelectorAll("[data-preview], [data-step]")) {
    button.addEventListener("click", () => display(current + Number(button.dataset.preview ?? button.dataset.step), Boolean(button.dataset.preview)));
}
dialog.addEventListener("keydown", event => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    display(current + (event.key === "ArrowRight" ? 1 : -1));
});
dialog.addEventListener("click", event => {
    if (event.target === dialog) dialog.close();
});
display(current);

