import { getAporiaMedia } from "../../Menüs/adapter/aporia-media.js";

const gallery = document.querySelector("[data-resource-gallery]");
const search = gallery.querySelector("input");
const select = gallery.querySelector("select");
const grid = gallery.querySelector(".rohstoff-grid");
const status = gallery.querySelector("[role=status]");
const previous = gallery.querySelector("[data-previous]");
const next = gallery.querySelector("[data-next]");
const pagination = previous.parentElement;
const pageSize = 24;
const categories = {
    elemente: "Chemisches Element",
    raumfahrt: "Raumfahrt-Werkstoff"
};
const normalize = text => text.toLocaleLowerCase("de").normalize("NFD").replace(/\p{M}/gu, "");
let page = 0;

function createCard(entry) {
    const article = document.createElement("article");
    article.className = "atlas-card";

    const link = document.createElement("a");
    link.className = "atlas-art";
    link.href = entry.url;
    link.setAttribute("aria-label", "Bild öffnen: " + entry.title);

    const image = document.createElement("img");
    image.alt = "";
    image.loading = "lazy";
    image.decoding = "async";
    image.src = entry.url;
    link.append(image);

    const body = document.createElement("div");
    body.className = "atlas-card-body";
    const title = document.createElement("h2");
    title.textContent = entry.title;
    const category = document.createElement("span");
    category.className = "atlas-type";
    category.textContent = categories[entry.group];
    body.append(title, category);
    article.append(link, body);
    return article;
}

try {
    const groups = await Promise.all(Object.keys(categories).map(async group => {
        const collection = await getAporiaMedia("rohstoffe." + group);
        if (!Array.isArray(collection?.items)) throw new Error("Rohstoffgruppe fehlt: " + group);
        return Promise.all(collection.items.map(async (_, index) => {
            const entry = await getAporiaMedia(`rohstoffe.${group}.items.${index}`);
            if (!entry?.url) throw new Error("Rohstoffbild fehlt: " + group + "/" + index);
            return { ...entry, group, searchTitle: normalize(entry.title) };
        }));
    }));
    const entries = groups.flat();

    function render() {
        const query = normalize(search.value.trim());
        const matches = entries.filter(entry =>
            (!select.value || entry.group === select.value) && entry.searchTitle.includes(query)
        );
        const start = page * pageSize;
        const end = Math.min(start + pageSize, matches.length);
        grid.replaceChildren(...matches.slice(start, end).map(createCard));
        status.textContent = matches.length
            ? `${start + 1}–${end} von ${matches.length} Rohstoffen`
            : "Keine Rohstoffe für diese Auswahl gefunden.";
        previous.disabled = page === 0;
        next.disabled = end >= matches.length;
        pagination.hidden = matches.length <= pageSize;
    }

    function resetPage() {
        page = 0;
        render();
    }

    search.disabled = false;
    select.disabled = false;
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
    function filterFromLocation() {
        const group = window.location.hash.slice(1);
        select.value = Object.hasOwn(categories, group) ? group : "";
        resetPage();
    }

    window.addEventListener("hashchange", filterFromLocation);
    filterFromLocation();
} catch (error) {
    console.error(error);
    status.textContent = "Das Rohstoffarchiv konnte nicht geladen werden.";
}
