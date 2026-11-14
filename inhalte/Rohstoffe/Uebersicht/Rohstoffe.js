import { getResourceDetailUrl } from "../../../Menüs/adapter/aporia-resource.js";
import { applyAporiaRoutes } from "../../../Menüs/adapter/aporia-routes.js";
import { loadResources, resourceTopics } from "../rohstoff-katalog.js";

applyAporiaRoutes(document);
const content = document.querySelector("#resource-content");
const status = document.querySelector("[role=status]");
const search = document.querySelector("#resource-search");

try {
    const groups = await loadResources();
    const cards = [];
    for (const [key, label, entries] of groups) {
        const section = document.createElement("section");
        section.id = key;
        const heading = document.createElement("h2");
        heading.textContent = label;
        const grid = document.createElement("div");
        grid.className = "resource-grid";
        for (const item of entries) {
            const card = document.createElement("article");
            card.className = "orbit-card resource-card";
            const target = getResourceDetailUrl(key, item.id);
            const link = document.createElement("a");
            if (target) link.href = target;
            const image = document.createElement("img");
            image.src = item.url;
            image.alt = "";
            image.loading = "lazy";
            const title = document.createElement("h3");
            title.textContent = item.title;
            link.append(image, title);
            card.append(link);
            if (target) card.dataset.sidebarDossier = target;
            card.sidebarTopics = resourceTopics;
            grid.append(card);
            cards.push(card);
        }
        section.append(heading, grid);
        content.append(section);
    }
    function filter() {
        const query = search.value.trim().toLocaleLowerCase("de");
        let count = 0;
        for (const card of cards) {
            card.hidden = !card.textContent.toLocaleLowerCase("de").includes(query);
            if (!card.hidden) count++;
        }
        status.textContent = count + " Einträge";
    }
    search.addEventListener("input", filter);
    filter();
    document.querySelector("main").dispatchEvent(new Event("aporia:detail-tabs-ready"));
} catch {
    status.textContent = "Der Rohstoffkatalog konnte nicht geladen werden.";
}
