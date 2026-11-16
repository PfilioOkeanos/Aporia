import { celestialCatalogCategories, loadCelestialCatalog } from "./aporia-celestial.js";
import { celestialCategories, getAporiaRoute } from "./aporia-routes.js";

const normalize = value => value.toLocaleLowerCase("de").normalize("NFD").replace(/\p{M}/gu, "").trim();
let indexRequest;

async function readOverview(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Archivübersicht: HTTP " + response.status);
    return new DOMParser().parseFromString(await response.text(), "text/html");
}

async function speciesCards(group) {
    const page = await readOverview(getAporiaRoute("spezies-" + group));
    return [...page.querySelectorAll(".species-category-grid .species-category")].flatMap(card => {
        const title = card.querySelector("h2, h3")?.textContent.trim();
        const route = card.querySelector("[data-route]")?.dataset.route;
        const href = route && getAporiaRoute(route);
        return title && href ? [{ title, href, group: "Spezies", alias: card.querySelector("p")?.textContent }] : [];
    });
}

async function systemCards() {
    const url = getAporiaRoute("kosmologie-sternsysteme");
    const page = await readOverview(url);
    return [...page.querySelectorAll('main a[href^="../details/"]')].map(link => ({
        title: link.textContent.trim(), href: new URL(link.getAttribute("href"), url).href, group: "Sternsystem"
    }));
}

function loadSearchIndex() {
    if (!indexRequest) {
        const jobs = celestialCatalogCategories.map(loadCelestialCatalog);
        jobs.push(systemCards());
        for (const group of ["biological", "mental", "cosmic", "technological", "gigantic"]) jobs.push(speciesCards(group));
        indexRequest = Promise.allSettled(jobs).then(results => {
            const entries = results.flatMap(result => result.status === "fulfilled" ? result.value : []);
            for (const { route, label } of [...celestialCategories, { route: "spezies", label: "Spezies" }]) {
                const href = getAporiaRoute(route);
                if (href) entries.push({ title: label, href, group: "Übersicht" });
            }
            const orvaya = getAporiaRoute("orvaya");
            if (orvaya) entries.push({ title: "Orvaya", href: orvaya, group: "Planet" });
            return [...new Map(entries.map(entry => [entry.href, entry])).values()].map(entry => ({
                ...entry,
                normalized: normalize(entry.title),
                text: normalize([entry.title, entry.alias, entry.type, entry.group].filter(Boolean).join(" "))
            }));
        });
    }
    return indexRequest;
}

export function archivTreffer(index, query) {
    const normalized = normalize(query);
    if (!normalized) return [];
    const words = normalized.split(/\s+/);
    const rank = entry => entry.normalized === normalized ? 0 : entry.normalized.startsWith(normalized) ? 1 : 2;
    return index.filter(entry => words.every(word => entry.text.includes(word)))
        .sort((a, b) => rank(a) - rank(b) || a.title.localeCompare(b.title, "de"));
}

export function starteArchivsuche(container) {
    const input = container.querySelector("input[type='search']");
    if (!input) return;
    const results = document.createElement("div");
    results.className = "aporia-search-results";
    results.hidden = true;
    results.id = "aporia-search-results";
    input.setAttribute("aria-controls", results.id);
    input.setAttribute("aria-expanded", "false");
    container.append(results);
    let handle;
    let request = 0;
    function hide() {
        request++;
        clearTimeout(handle);
        results.hidden = true;
        input.setAttribute("aria-expanded", "false");
    }
    async function show(openExact = false) {
        clearTimeout(handle);
        const query = input.value.trim();
        if (!query) return hide();
        const version = ++request;
        results.hidden = false;
        input.setAttribute("aria-expanded", "true");
        results.textContent = "Archiv wird durchsucht …";
        const matches = archivTreffer(await loadSearchIndex(), query);
        if (version !== request || query !== input.value.trim()) return;
        if (openExact && (matches.length === 1 ||
            (matches[0]?.normalized === normalize(query) && matches[1]?.normalized !== normalize(query)))) {
            location.assign(matches[0].href);
            return;
        }
        results.replaceChildren();
        for (const entry of matches.slice(0, 10)) {
            const link = document.createElement("a");
            link.href = entry.href;
            link.textContent = entry.title;
            const type = document.createElement("small");
            type.textContent = entry.type || entry.group;
            link.append(type);
            results.append(link);
        }
        if (!matches.length) results.textContent = "Keine passenden Archiveinträge.";
    }
    input.addEventListener("input", () => {
        hide();
        handle = setTimeout(() => show(), 180);
    });
    input.addEventListener("focus", () => { if (input.value.trim()) show(); });
    container.addEventListener("keydown", event => {
        if (event.key === "Escape" && !results.hidden) {
            event.preventDefault();
            if (event.target !== input) input.focus();
            hide();
        } else if (event.key === "Enter" && event.target === input && input.value.trim()) {
            event.preventDefault();
            show(true);
        } else if (event.key === "ArrowDown" && !results.hidden) {
            const links = [...results.querySelectorAll("a")];
            const next = links[links.indexOf(event.target) + 1];
            if (next) {
                event.preventDefault();
                next.focus();
            }
        }
    });
    container.addEventListener("focusout", event => { if (!container.contains(event.relatedTarget)) hide(); });
}
