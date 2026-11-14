import { arrangeKnowledgeCards } from "./wissenslayout.js";
import { applyAporiaRoutes } from "../../../Menüs/adapter/aporia-routes.js";

const tabs = [
  [
    "hauptseite",
    "Übersicht",
    "⌂"
  ],
  [
    "anatomie",
    "Anatomie",
    "◇"
  ],
  [
    "entwicklung",
    "Entwicklung",
    "✣"
  ],
  [
    "geschichte",
    "Geschichte",
    "▤"
  ],
  [
    "gesellschaft",
    "Gesellschaft",
    "♧"
  ],
  [
    "politik",
    "Politik",
    "⚖"
  ],
  [
    "heimatwelt",
    "Heimatwelt",
    "◎"
  ],
  [
    "medien",
    "Medien",
    "▷"
  ]
];

export function initializeSpeciesArchive({ name, route, archive }) {
    const host = document.querySelector("[data-species-navigation]");
    if (!host) return;
    const makeLink = (label, href, key, className) => {
        const anchor = document.createElement("a");
        anchor.textContent = label;
        anchor.href = href;
        anchor.dataset.route = key;
        if (className) anchor.className = className;
        return anchor;
    };
    const header = document.createElement("header");
    header.className = "archive-bar";
    const logo = makeLink("APORIA", archive, "spezies", "wordmark");
    const tagline = document.createElement("small");
    tagline.textContent = "UNTER FREMDEN KRONEN";
    logo.append(tagline);
    const badge = document.createElement("span");
    badge.className = "species-badge";
    badge.textContent = "✧ " + name;
    const nav = document.createElement("nav");
    nav.setAttribute("aria-label", name);
    for (const [slug, label, icon] of tabs) {
        const key = slug === "hauptseite" ? route : route + "-" + slug;
        const link = makeLink(label, "../" + slug + "/" + slug + ".html", key);
        const symbol = document.createElement("span");
        symbol.setAttribute("aria-hidden", "true");
        symbol.textContent = icon;
        link.prepend(symbol);
        if (document.body.dataset.speciesPage === slug) link.setAttribute("aria-current", "page");
        nav.append(link);
    }
    header.append(logo, makeLink("Speziesarchiv", archive, "spezies", "archive-link"), badge, nav);
    host.replaceWith(header);
    applyAporiaRoutes(document);
    arrangeKnowledgeCards();
    const active = nav.querySelector("[aria-current]");
    if (active) nav.scrollLeft = Math.max(0, active.offsetLeft - nav.offsetLeft - nav.clientWidth / 2);
}
