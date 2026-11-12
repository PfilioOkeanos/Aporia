import { applyAporiaRoutes } from "../../../Menüs/adapter/aporia-routes.js";
import { applyAporiaMedia } from "../../../Menüs/adapter/aporia-media.js";

export function initializeAtlas() {
    const main = document.querySelector(".atlas-main");
    applyAporiaRoutes(main);
    applyAporiaMedia(main);

    const filters = main.querySelector(".atlas-filters");
    if (!filters) return;

    const buttons = [...filters.querySelectorAll("button[data-filter]")];
    const cards = [...main.querySelectorAll("[data-type]")];
    filters.addEventListener("click", event => {
        const selected = event.target.closest("button[data-filter]");
        if (!selected) return;

        for (const button of buttons) {
            button.setAttribute("aria-pressed", String(button === selected));
        }
        for (const card of cards) {
            card.hidden = selected.dataset.filter !== "all" &&
                card.dataset.type !== selected.dataset.filter;
        }
    });
    filters.hidden = false;
}
