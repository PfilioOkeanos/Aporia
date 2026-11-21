import { getResourceDetailUrl } from "../../../Menüs/adapter/aporia-resource.js";
import { applyAporiaRoutes } from "../../../Menüs/adapter/aporia-routes.js";
import { getPlanetInfos } from "../../../Menüs/adapter/aporia-planeten.js";
import { resourceCatalogFields } from "../rohstoff-details.js";
import { loadResources, resourceTopics } from "../rohstoff-katalog.js";
import { oeffneRohstoffFenster, ladeRohstoffDaten } from "../rohstoff-fenster.js";

applyAporiaRoutes(document);
let aktuelleErgebnisse = [];

const content = document.querySelector("#resource-content");
const status = document.querySelector("#resource-status");
const groupsNav = document.querySelector("#resource-groups");
const pagination = document.querySelector("#resource-pagination");
const search = document.querySelector("#resource-search");
const origin = document.querySelector("#resource-origin");
const state = document.querySelector("#resource-state");
const use = document.querySelector("#resource-use");
const sort = document.querySelector("#resource-sort");
const planetSelect = document.querySelector("#resource-planet");
const planetActive = document.querySelector("#resource-planet-active");
const filters = document.querySelector("#resource-filters");
const views = document.querySelectorAll("[data-resource-view]");
const pageSize = 40;
const collator = new Intl.Collator("de", { numeric: true, sensitivity: "base" });
const formatNumber = new Intl.NumberFormat("de");

function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (className) node.className = className;
    return node;
}

function matches(value, query) {
    return (value ?? "").toLocaleLowerCase("de").includes(query.trim().toLocaleLowerCase("de"));
}

function makeCard(item) {
    const card = element("article", "", "orbit-card resource-card");
    const target = getResourceDetailUrl(item.group, item.id);
    const link = element("a");
    link.href = target ?? item.url;
    link.title = item.title;
    const image = element("img");
    image.src = item.url;
    image.alt = "";
    image.loading = "lazy";
    image.decoding = "async";
    const copy = element("div", "", "resource-card-copy");
    copy.append(
        element("h3", item.name),
        element("p", item.symbol ? item.symbol + " · Element" : item.kind ?? item.groupLabel),
    );
    link.append(image, copy);
    card.append(link);
    // Klick öffnet das Rohstoff-Fenster; Strg/Mittelklick öffnet weiterhin das Dossier
    item.dossier = target;
    link.addEventListener("click", (event) => {
        if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        oeffneRohstoffFenster(aktuelleErgebnisse, item);
    });
    if (target) {
        card.dataset.sidebarDossier = target;
        card.sidebarTopics = resourceTopics;
    }
    return card;
}

try {
    const groups = await loadResources();
    const items = groups.flatMap(([group, groupLabel, entries]) => entries.map(item => ({
        ...item,
        ...resourceCatalogFields(group, item),
        group,
        groupLabel,
        schluessel: group + "-" + (item.id.match(/-(\d+)\.png$/i)?.[1] ?? "0").padStart(3, "0"),
        dossier: getResourceDetailUrl(group, item.id),
    })));
    // Planetenzuordnung aus daten/rohstoffe.json ("planeten": Ordnernamen der Planetendossiers)
    const rohdaten = await ladeRohstoffDaten();
    for (const item of items) item.planeten = rohdaten[item.schluessel]?.planeten ?? [];
    const planets = new Map((await getPlanetInfos(items.flatMap(item => item.planeten))).map(planet => [planet.slug, planet]));
    for (const planet of [...planets.values()].sort((a, b) => collator.compare(a.name, b.name))) planetSelect.add(new Option(planet.name, planet.slug));
    const requestedPlanet = new URLSearchParams(location.search).get("planet");
    if (planets.has(requestedPlanet)) planetSelect.value = requestedPlanet;
    const categories = [["alle", "Alle Rohstoffe", items], ...groups];
    const groupLinks = new Map();
    let page = 1;
    let view = "grid";
    let group = "alle";

    for (const [key, label, entries] of categories) {
        const link = element("a");
        link.href = "#" + key;
        link.append(element("span", label), element("span", formatNumber.format(entries.length)));
        groupsNav.append(link);
        groupLinks.set(key, link);
    }

    function showPage(nextPage, pageCount) {
        if (nextPage < 1 || nextPage > pageCount || nextPage === page) return;
        page = nextPage;
        render();
        document.querySelector("#resource-list-title").scrollIntoView({ block: "start" });
        pagination.querySelector('[aria-current="page"]')?.focus({ preventScroll: true });
    }

    function renderPagination(pageCount) {
        pagination.replaceChildren();
        const addButton = (label, nextPage, accessibleLabel) => {
            const button = element("button", label);
            button.type = "button";
            button.setAttribute("aria-label", accessibleLabel);
            button.disabled = nextPage < 1 || nextPage > pageCount;
            if (nextPage === page) button.setAttribute("aria-current", "page");
            button.addEventListener("click", () => showPage(nextPage, pageCount));
            pagination.append(button);
        };
        if (pageCount < 2) return;
        addButton("‹", page - 1, "Vorherige Seite");
        for (let number = 1; number <= pageCount; number++) {
            addButton(String(number), number, "Seite " + number);
        }
        addButton("›", page + 1, "Nächste Seite");
    }

    function render() {
        for (const [key, link] of groupLinks) {
            if (key === group) link.setAttribute("aria-current", "true");
            else link.removeAttribute("aria-current");
        }
        const results = items.filter(item =>
            (group === "alle" || item.group === group) &&
            matches([item.name, item.symbol, item.title].join(" "), search.value) &&
            matches(item.origin, origin.value) &&
            matches(item.use, use.value) &&
            (!state.value || item.state === state.value) &&
            (!planetSelect.value || item.planeten.includes(planetSelect.value))
        ).sort((first, second) => {
            const byName = collator.compare(first.name, second.name);
            if (sort.value === "group") return collator.compare(first.groupLabel, second.groupLabel) || byName;
            return sort.value === "desc" ? -byName : byName;
        });

        aktuelleErgebnisse = results;
        const pageCount = Math.max(1, Math.ceil(results.length / pageSize));
        page = Math.min(pageCount, page);
        const first = (page - 1) * pageSize;
        const last = Math.min(first + pageSize, results.length);
        content.dataset.view = view;
        content.replaceChildren(...results.slice(first, last).map(makeCard));
        if (!results.length) content.append(element("p", "Keine Rohstoffe gefunden.", "resource-empty"));
        status.textContent = formatNumber.format(results.length) + " von " + formatNumber.format(items.length) + " Einträgen" +
            (pageCount > 1 ? " · " + (first + 1) + "–" + last + " angezeigt" : "");
        renderPagination(pageCount);
        renderPlanet();
    }

    function renderPlanet() {
        const planet = planets.get(planetSelect.value);
        planetActive.hidden = !planet;
        const url = new URL(location.href);
        if (planet) url.searchParams.set("planet", planet.slug); else url.searchParams.delete("planet");
        history.replaceState(null, "", url);
        if (!planet) return;
        const back = element("a", "Zum Dossier " + planet.name + " →");
        back.href = planet.href;
        const remove = element("button", "Planetenfilter entfernen ✕");
        remove.type = "button";
        remove.addEventListener("click", () => { planetSelect.value = ""; resetPage(); });
        planetActive.replaceChildren(element("span", "Gefiltert: Rohstoffe von " + planet.name), back, remove);
    }

    function resetPage() {
        page = 1;
        render();
    }

    for (const input of [search, origin, use]) input.addEventListener("input", resetPage);
    for (const select of [state, sort, planetSelect]) select.addEventListener("change", resetPage);
    filters.addEventListener("submit", event => event.preventDefault());
    filters.addEventListener("reset", () => {
        search.value = "";
        requestAnimationFrame(resetPage);
    });
    for (const field of [origin, use]) {
        document.querySelector('.resource-topics a[href="#' + field.id + '"]').addEventListener("click", event => {
            event.preventDefault();
            field.focus({ preventScroll: true });
            field.scrollIntoView({ block: "nearest" });
        });
    }
    function selectGroupFromHash() {
        const hash = location.hash.slice(1);
        if (groupLinks.has(hash) || !hash) {
            group = hash || "alle";
            resetPage();
        }
    }
    window.addEventListener("hashchange", selectGroupFromHash);
    for (const button of views) {
        button.addEventListener("click", () => {
            view = button.dataset.resourceView;
            for (const control of views) control.setAttribute("aria-pressed", String(control === button));
            content.dataset.view = view;
        });
    }
    if (groupLinks.has(location.hash.slice(1))) group = location.hash.slice(1);
    render();
    // Direktlink ?rohstoff=elemente-031 öffnet das Fenster
    const direkt = items.find((item) => item.schluessel === new URLSearchParams(location.search).get("rohstoff"));
    if (direkt) {
        direkt.dossier = getResourceDetailUrl(direkt.group, direkt.id);
        oeffneRohstoffFenster(aktuelleErgebnisse.includes(direkt) ? aktuelleErgebnisse : items, direkt);
    }
    document.querySelector("main").dispatchEvent(new Event("aporia:detail-tabs-ready"));
} catch (error) {
    console.error("Rohstoffkatalog:", error);
    status.textContent = "Der Rohstoffkatalog konnte nicht geladen werden.";
}
