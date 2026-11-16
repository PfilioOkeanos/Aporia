import { loadCelestialCatalog } from "../../../Menüs/adapter/aporia-celestial.js";

const pageSize = 24;
const normalize = value => value.toLocaleLowerCase("de").normalize("NFD").replace(/\p{M}/gu, "");

function createCard(entry) {
    const card = document.createElement("article");
    card.className = "atlas-card";

    const art = document.createElement("a");
    art.className = "atlas-art";
    art.href = entry.href;
    card.dataset.celestialDossier = art.href;
    card.dataset.celestialGroup = entry.group ?? "";
    art.setAttribute("aria-label", "Detailseite öffnen: " + entry.title);
    if (entry.preview) {
        const image = document.createElement("img");
        image.dataset.mediaImage = entry.preview;
        image.alt = entry.title;
        image.loading = "lazy";
        image.decoding = "async";
        art.append(image);
    } else {
        const symbol = document.createElement("span");
        symbol.setAttribute("aria-hidden", "true");
        symbol.textContent = "✧";
        art.append(symbol);
    }

    const body = document.createElement("div");
    body.className = "atlas-card-body";
    const title = document.createElement("h3");
    const titleLink = document.createElement("a");
    titleLink.href = entry.href;
    titleLink.textContent = entry.title;
    title.append(titleLink);
    const group = document.createElement("span");
    group.className = "atlas-type";
    group.textContent = entry.type || entry.group;
    const link = document.createElement("a");
    link.href = entry.href;
    link.textContent = "Details →";
    link.setAttribute("aria-label", "Details: " + entry.title);
    body.append(title, group, link);
    card.append(art, body);
    return card;
}

export async function initializeCelestialGallery() {
    const section = document.querySelector("[data-celestial-gallery]");
    if (!section) return;
    const category = section.dataset.celestialGallery || document.body.dataset.page;
    const search = section.querySelector("input");
    const select = section.querySelector("select");
    const status = section.querySelector("[role=status]");
    const grid = section.querySelector(".atlas-grid");
    const previous = section.querySelector("[data-previous]");
    const next = section.querySelector("[data-next]");
    const pagination = previous.parentElement;

    let entries;
    try {
        entries = await loadCelestialCatalog(category);
        const group = section.dataset.celestialGroup;
        if (group) entries = entries.filter(entry => entry.group === group);
    } catch {
        status.textContent = "Das Bildarchiv konnte nicht geladen werden.";
        return;
    }

    const groups = [...new Set(entries.map(entry => entry.group))];
    for (const group of groups) select.add(new Option(group, group));
    const requestedGroup = new URLSearchParams(location.search).get("gruppe");
    if (groups.includes(requestedGroup)) select.value = requestedGroup;
    select.parentElement.hidden = groups.length < 2;
    search.disabled = false;
    select.disabled = false;
    let page = 0;

    function render() {
        const query = normalize(search.value.trim());
        const visible = entries.filter(entry =>
            (!select.value || select.value === entry.group) &&
            (!query || normalize(entry.title + " " + (entry.alias ?? "")).includes(query))
        );
        const pageCount = Math.ceil(visible.length / pageSize);
        const start = page * pageSize;
        const end = Math.min(start + pageSize, visible.length);
        grid.replaceChildren(...visible.slice(start, end).map(createCard));
        status.textContent = visible.length
            ? `${start + 1}–${end} von ${visible.length} Bildern`
            : "Keine Bilder für diese Auswahl.";
        previous.disabled = page === 0;
        next.disabled = page + 1 >= pageCount;
        pagination.hidden = pageCount < 2;
    }

    function resetPage() {
        page = 0;
        render();
    }

    search.addEventListener("input", resetPage);
    select.addEventListener("change", resetPage);
    previous.addEventListener("click", () => {
        page -= 1;
        render();
        if (previous.disabled) next.focus();
    });
    next.addEventListener("click", () => {
        page += 1;
        render();
        if (next.disabled) previous.focus();
    });
    render();
}
