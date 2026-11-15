import { observeMediaVisibility } from "../../../../Menüs/adapter/aporia-media-visibility.js";
import { applyAporiaRoutes } from "../../../../Menüs/adapter/aporia-routes.js";
import "../../../../Menüs/TopBar/Top_bar.js";
import "../../../../Menüs/Side_bar/side_bar.js";

const main = document.querySelector(".species-group-main");
const grid = main.querySelector(".species-category-grid");
const cards = [...grid.children];
const toolbar = document.createElement("div");
toolbar.className = "species-tools";
toolbar.innerHTML = `
    <label>Suche <input type="search" placeholder="Spezies suchen …"></label>
    <label>Heimatwelt <select data-world><option value="">Alle</option></select></label>
    <label>Lebensraum <select data-habitat><option value="">Alle</option></select></label>
    <label>Sortierung <select data-sort><option value="original">Archivreihenfolge</option><option value="asc">A–Z</option><option value="desc">Z–A</option></select></label>
    <button type="button" data-view aria-pressed="false">Listenansicht</button>`;
grid.before(toolbar);
const pagination = document.createElement("nav");
pagination.className = "species-pagination";
pagination.setAttribute("aria-label", "Katalogseiten");
grid.after(pagination);
const count = main.querySelector("[data-count]");
const search = toolbar.querySelector("input");
const world = toolbar.querySelector("[data-world]");
const habitat = toolbar.querySelector("[data-habitat]");
const sort = toolbar.querySelector("[data-sort]");
const view = toolbar.querySelector("[data-view]");
let page = 0;
const pageSize = 8;

for (const value of new Set(cards.map(card => card.dataset.habitat))) {
    habitat.add(new Option(value, value));
}
for (const value of new Set(cards.map(card => card.dataset.world))) {
    world.add(new Option(value, value));
}

function render() {
    const query = search.value.trim().toLocaleLowerCase("de");
    const matches = cards.filter(card => card.textContent.toLocaleLowerCase("de").includes(query)
        && (!world.value || card.dataset.world === world.value)
        && (!habitat.value || card.dataset.habitat === habitat.value));
    if (sort.value !== "original") {
        const direction = sort.value === "asc" ? 1 : -1;
        matches.sort((a, b) => direction * a.querySelector("h2").textContent.localeCompare(b.querySelector("h2").textContent, "de"));
    }
    const visible = new Set(matches.slice(page * pageSize, (page + 1) * pageSize));
    grid.append(...matches);
    for (const card of cards) card.hidden = !visible.has(card);
    count.textContent = matches.length + " von " + cards.length + " Kategorien";
    pagination.replaceChildren();
    const total = Math.ceil(matches.length / pageSize);
    for (let i = 0; i < total && total > 1; i++) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = String(i + 1);
        if (i === page) button.setAttribute("aria-current", "page");
        button.addEventListener("click", () => {
            page = i;
            render();
            pagination.children[i]?.focus();
        });
        pagination.append(button);
    }
}

toolbar.addEventListener("input", () => { page = 0; render(); });
view.addEventListener("click", () => {
    const list = grid.classList.toggle("species-category-list");
    view.setAttribute("aria-pressed", String(list));
    view.textContent = list ? "Rasteransicht" : "Listenansicht";
});
document.querySelector("[data-aporia-sidebar]").addEventListener("click", event => {
    const link = event.target.closest('a[href^="#kategorie-"]');
    const card = link && document.getElementById(link.hash.slice(1));
    if (!card?.hidden) return;
    search.value = world.value = habitat.value = "";
    sort.value = "original";
    page = Math.floor(cards.indexOf(card) / pageSize);
    render();
});
const initial = cards.findIndex(card => "#" + card.id === location.hash);
if (initial >= 0) page = Math.floor(initial / pageSize);
render();
applyAporiaRoutes(document);


for (const logo of grid.querySelectorAll("[data-animated-src]")) {
    const poster = logo.getAttribute("src");
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    function syncLogo() {
        const source = visible && !motion.matches ? logo.dataset.animatedSrc : poster;
        if (logo.getAttribute("src") !== source) logo.src = source;
    }
    observeMediaVisibility(logo, current => {
        visible = current;
        syncLogo();
    });
    motion.addEventListener("change", syncLogo);
}
