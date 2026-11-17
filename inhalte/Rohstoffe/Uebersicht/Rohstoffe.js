import { getResourceDetailUrl } from "../../../Menüs/adapter/aporia-resource.js";
import { applyAporiaRoutes } from "../../../Menüs/adapter/aporia-routes.js";
import { resourceCatalogFields } from "../rohstoff-details.js";
import { loadResources, resourceTopics } from "../rohstoff-katalog.js";

applyAporiaRoutes(document);

const content = document.querySelector("#resource-content");
const status = document.querySelector("#resource-status");
const groupsNav = document.querySelector("#resource-groups");
const pagination = document.querySelector("#resource-pagination");
const search = document.querySelector("#resource-search");
const origin = document.querySelector("#resource-origin");
const state = document.querySelector("#resource-state");
const use = document.querySelector("#resource-use");
const sort = document.querySelector("#resource-sort");
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
    })));
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
            (!state.value || item.state === state.value)
        ).sort((first, second) => {
            const byName = collator.compare(first.name, second.name);
            if (sort.value === "group") return collator.compare(first.groupLabel, second.groupLabel) || byName;
            return sort.value === "desc" ? -byName : byName;
        });

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
    }

    function resetPage() {
        page = 1;
        render();
    }

    for (const input of [search, origin, use]) input.addEventListener("input", resetPage);
    for (const select of [state, sort]) select.addEventListener("change", resetPage);
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
    document.querySelector("main").dispatchEvent(new Event("aporia:detail-tabs-ready"));
} catch (error) {
    console.error("Rohstoffkatalog:", error);
    status.textContent = "Der Rohstoffkatalog konnte nicht geladen werden.";
}
