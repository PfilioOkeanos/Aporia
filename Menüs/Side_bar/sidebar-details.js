import { getCelestialTopics } from "../../inhalte/himmelskoerper/_gemeinsam/celestial-topics.js";
export function initializeSidebarDetails(host) {
    const main = document.querySelector("main");
    const scroll = host.querySelector(".aporia-sidebar-scroll");
    if (!main || !scroll) return;

    const panel = document.createElement("details");
    panel.className = "sidebar-details";
    const title = document.createElement("summary");
    const links = document.createElement("div");
    panel.append(title, links);
    scroll.prepend(panel);
    panel.hidden = true;

    const selector = "[data-sidebar-details], .orbit-card, .atlas-card, .home-card, .faction-card, .group-wave";
    let timer;
    let current;
    let nextId = 0;

    function show(source, refresh = false) {
        if (current === source && !refresh) return;
        if (current !== source) panel.open = false;
        current = source;
        links.replaceChildren();
        const heading = source.querySelector("h1, h2, h3, .wave-title");
        title.textContent = heading?.textContent.trim() || "Details";
        const dossierUrl = source.dataset.sidebarDossier ?? source.dataset.celestialDossier;
        if (dossierUrl) {
            for (const [key, label] of (source.sidebarTopics ?? getCelestialTopics(source.dataset.celestialGroup))) {
                const link = document.createElement("a");
                const target = new URL(dossierUrl);
                target.hash = "erkundung-" + key;
                link.href = target.href;
                link.textContent = label;
                links.append(link);
            }
            title.textContent += " · Erkundungsreiter";
            panel.hidden = false;
            return;
        }
        const tabs = source.querySelectorAll("[data-sidebar-tab]");
        for (const tab of tabs) {
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = tab.textContent.trim();
            button.addEventListener("click", () => {
                if (tab.parentElement instanceof HTMLDetailsElement) {
                    tab.parentElement.open = true;
                    tab.parentElement.scrollIntoView({ block: "start" });
                    return;
                }
                tab.click();
                source.scrollIntoView({ block: "start" });
            });
            links.append(button);
        }

        if (!tabs.length) {
            const headings = source === main ? main.querySelectorAll("h2") : source.querySelectorAll("h4");
            for (const item of headings) {
                if (!item.id) {
                    do { item.id = "archiv-detail-" + ++nextId; }
                    while (document.getElementById(item.id) !== item);
                }
                const link = document.createElement("a");
                link.href = "#" + encodeURIComponent(item.id);
                link.textContent = item.textContent.trim();
                links.append(link);
            }

            if (source !== main) {
                const targets = new Set();
                const anchors = source.matches("a") ? [source] : source.querySelectorAll("a[href]");
                for (const anchor of anchors) {
                    if (!anchor.href || anchor.getAttribute("href") === "#" || targets.has(anchor.href)) continue;
                    targets.add(anchor.href);
                    const link = document.createElement("a");
                    link.href = anchor.href;
                    link.textContent = anchor.textContent.trim() || "Details öffnen";
                    links.append(link);
                }
                if (source.matches("button")) {
                    const button = document.createElement("button");
                    button.type = "button";
                    button.textContent = "Gruppenmenü öffnen";
                    button.addEventListener("click", () => source.click());
                    links.append(button);
                }
            }
        }
        panel.hidden = !links.childElementCount;
    }

    main.addEventListener("pointerover", event => {
        const source = event.target.closest(selector);
        if (!source || source.contains(event.relatedTarget)) return;
        clearTimeout(timer);
        timer = setTimeout(() => show(source), 140);
    });
    main.addEventListener("pointerout", event => {
        const source = event.target.closest(selector);
        if (source && !source.contains(event.relatedTarget)) clearTimeout(timer);
    });
    for (const type of ["focusin", "click"]) {
        main.addEventListener(type, event => {
            const source = event.target.closest(selector);
            if (source) {
                clearTimeout(timer);
                show(source);
            }
        });
    }

    const defaultSource = main.querySelector("[data-sidebar-default]");
    show(defaultSource || main);
    main.addEventListener("aporia:detail-tabs-ready", () => {
        const updated = main.querySelector("[data-sidebar-default]");
        if (current === main || current === defaultSource) show(updated || main, true);
    });
}

