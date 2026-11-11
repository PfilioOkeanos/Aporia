
/* ================================================= */
/* APORIA - SPEZIESARCHIV                            */
/* ================================================= */


/* 01 - EINSTELLUNGEN */

const ITEMS_PER_PAGE = 6;

const CATALOG_URL =
    new URL(
        "../../inhalte/spezies/katalog.json",
        import.meta.url
    );


/* 02 - ELEMENTE */

const elements = {

    grid: document.getElementById("species-grid"),

    search: document.getElementById("species-search"),

    group: document.getElementById("filter-main-group"),

    subgroup: document.getElementById("filter-subgroup"),

    homeworld: document.getElementById("filter-homeworld"),

    status: document.getElementById("filter-status"),

    reset: document.getElementById("species-reset"),

    total: document.getElementById("species-total"),

    resultCount: document.getElementById("species-result-count"),

    pagination: document.getElementById("species-pagination"),

    empty: document.getElementById("species-empty"),

    dialog: document.getElementById("species-dialog"),

    dialogTitle: document.getElementById("dialog-title"),

    dialogKicker: document.getElementById("dialog-kicker"),

    dialogDescription: document.getElementById("dialog-description"),

    dialogFacts: document.getElementById("dialog-facts"),

    dialogNote: document.getElementById("dialog-note"),

    dialogLink: document.getElementById("dialog-link")

};


/* 03 - VORSCHAU-DATENSATZ */
/* Wird später durch katalog.json ersetzt. */

const PREVIEW_SPECIES = [

    {
        id: "SPEC-0001",

        name: "Waldfeen",

        mainGroup: "Biologische, intelligente Spezies",

        subgroup: "",

        homeworld: "Orvaya",

        faction: "—",

        culture: "Siedlungsverbände",

        special: "Symbiose mit Natur",

        tagline: "Enge Bindung an die Wälder Orvayas.",

        status: "Dossier V1.0",

        image: "../../assets/bilder/APORIA_Waldfeen-Dossier-4.png",

        description:
            "Die Waldfeen stammen von Orvaya. Ihre Lebensweise ist eng mit den Wäldern ihrer Heimatwelt verbunden.",

        dossierUrl: ""

    }

];


/* 04 - ZUSTÄNDE */

let speciesList = [];

let currentPage = 1;

let catalogLoaded = false;


/* 05 - DATEN NORMALISIEREN */

function normalizeSpecies(data) {

    return {

        id:
            String(data.id ?? data.speciesId ?? ""),

        name:
            String(data.name ?? data.name_de ?? "Unbenannte Spezies"),

        mainGroup:
            String(data.mainGroup ?? data.hauptgruppe ?? ""),

        subgroup:
            String(data.subgroup ?? data.untergruppe ?? ""),

        homeworld:
            String(data.homeworld ?? data.heimatwelt ?? ""),

        faction:
            String(data.faction ?? data.fraktion ?? "—"),

        culture:
            String(data.culture ?? data.kulturform ?? ""),

        special:
            String(data.special ?? data.besonderheit ?? ""),

        tagline:
            String(data.tagline ?? data.kurzbeschreibung ?? ""),

        status:
            String(data.status ?? "Nicht festgelegt"),

        image:
            String(data.image ?? data.bild ?? ""),

        description:
            String(data.description ?? data.beschreibung ?? ""),

        dossierUrl:
            String(data.dossierUrl ?? data.dossier ?? "")

    };

}


/* 06 - KATALOG LADEN */

async function loadSpeciesCatalog() {

    try {

        const response = await fetch(CATALOG_URL);

        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status}`
            );
        }

        const data = await response.json();

        const entries = Array.isArray(data)
            ? data
            : data.spezies ?? data.species ?? data.items;

        if (!Array.isArray(entries)) {
            throw new Error(
                "Ungültige Katalogstruktur."
            );
        }

        speciesList = entries
            .map(normalizeSpecies)
            .filter(species => species.id && species.name);

        catalogLoaded = true;

        console.log(
            "APORIA: Spezieskatalog erfolgreich geladen.",
            speciesList.length
        );

    } catch (error) {

        console.info(
            "APORIA: Katalog noch nicht vorhanden. Vorschau wird geladen.",
            error
        );

        speciesList = PREVIEW_SPECIES.map(normalizeSpecies);

        catalogLoaded = false;

    }

    populateFilters();

    renderSpecies();

}


/* 07 - FILTER BEFÜLLEN */

function populateSelect(select, field, label) {

    const previousValue = select.value;

    const values = [

        ...new Set(
            speciesList
                .map(species => species[field])
                .filter(value => value && value !== "—")
        )

    ].sort((a, b) => a.localeCompare(b, "de"));

    select.replaceChildren();

    const defaultOption = document.createElement("option");

    defaultOption.value = "";
    defaultOption.textContent = label;

    select.appendChild(defaultOption);

    values.forEach(value => {

        const option = document.createElement("option");

        option.value = value;
        option.textContent = value;

        select.appendChild(option);

    });

    if (values.includes(previousValue)) {
        select.value = previousValue;
    }

}


function populateFilters() {

    populateSelect(
        elements.group,
        "mainGroup",
        "Alle Hauptgruppen"
    );

    populateSelect(
        elements.subgroup,
        "subgroup",
        "Alle Untergruppen"
    );

    populateSelect(
        elements.homeworld,
        "homeworld",
        "Alle Heimatwelten"
    );

    populateSelect(
        elements.status,
        "status",
        "Alle Status"
    );

}


/* 08 - FILTER ANWENDEN */

function getFilteredSpecies() {

    const search = elements.search.value
        .trim()
        .toLocaleLowerCase("de");

    return speciesList.filter(species => {

        const searchContent = [

            species.id,
            species.name,
            species.mainGroup,
            species.subgroup,
            species.homeworld,
            species.faction,
            species.culture,
            species.special

        ].join(" ").toLocaleLowerCase("de");


        const matchesSearch =
            !search || searchContent.includes(search);

        const matchesGroup =
            !elements.group.value ||
            species.mainGroup === elements.group.value;

        const matchesSubgroup =
            !elements.subgroup.value ||
            species.subgroup === elements.subgroup.value;

        const matchesHomeworld =
            !elements.homeworld.value ||
            species.homeworld === elements.homeworld.value;

        const matchesStatus =
            !elements.status.value ||
            species.status === elements.status.value;


        return (
            matchesSearch &&
            matchesGroup &&
            matchesSubgroup &&
            matchesHomeworld &&
            matchesStatus
        );

    });

}


/* 09 - INFORMATIONSFELD ERSTELLEN */

function createFact(label, value) {

    const fact = document.createElement("div");

    fact.className = "species-fact";

    const title = document.createElement("span");

    title.className = "species-fact-label";
    title.textContent = label;

    const content = document.createElement("span");

    content.className = "species-fact-value";
    content.textContent = value || "Noch offen";

    fact.append(title, content);

    return fact;

}


/* 10 - SPEZIESKARTE ERSTELLEN */

function createSpeciesCard(species) {

    const card = document.createElement("button");

    card.type = "button";

    card.className = "species-card";

    card.setAttribute(
        "aria-label",
        `${species.name} – Speziesdetails öffnen`
    );


    /* LINKE SEITE */

    const left = document.createElement("div");

    left.className = "species-card-left";


    const id = document.createElement("span");

    id.className = "species-card-id";
    id.textContent = species.id;


    const name = document.createElement("h3");

    name.textContent = species.name;


    const group = document.createElement("span");

    group.className = "species-card-group";

    group.textContent =
        species.subgroup
            ? `${species.mainGroup} · ${species.subgroup}`
            : species.mainGroup;


    const tagline = document.createElement("div");

    tagline.className = "species-card-tagline";

    tagline.textContent =
        species.tagline || "Weitere Informationen folgen.";


    left.append(id, name, group, tagline);


    /* RECHTE SEITE */

    const right = document.createElement("div");

    right.className = "species-card-right";

    right.append(

        createFact("Heimatwelt", species.homeworld),

        createFact("Fraktion", species.faction),

        createFact("Kulturform", species.culture),

        createFact("Besonderheit", species.special)

    );


    /* PORTRÄT */

    const portrait = document.createElement("div");

    portrait.className = "species-card-portrait";


    const fallback = document.createElement("div");

    fallback.className = "species-portrait-fallback";

    const symbol = document.createElement("span");

    symbol.textContent = "✧";

    const fallbackText = document.createElement("small");

    fallbackText.textContent = "PORTRÄT FOLGT";

    fallback.append(symbol, fallbackText);


    if (species.image) {

        const image = document.createElement("img");

        image.src = species.image;
        image.alt = species.name;

        fallback.hidden = true;

        image.addEventListener("error", () => {

            image.hidden = true;
            fallback.hidden = false;

        });

        portrait.append(image);

    }

    portrait.append(fallback);


    card.append(left, right, portrait);


    /* DETAILANSICHT ÖFFNEN */

    card.addEventListener("click", () => {

        openSpeciesDialog(species);

    });


    return card;

}


/* 11 - DETAILANSICHT */

function openSpeciesDialog(species) {

    elements.dialogTitle.textContent = species.name;

    elements.dialogKicker.textContent =
        `SPEZIESDOSSIER · ${species.id}`;

    elements.dialogDescription.textContent =
        species.description || "Weitere Informationen folgen.";


    elements.dialogFacts.replaceChildren();


    const facts = [

        ["Hauptgruppe", species.mainGroup],

        ["Untergruppe", species.subgroup],

        ["Heimatwelt", species.homeworld],

        ["Fraktion", species.faction],

        ["Kulturform", species.culture],

        ["Besonderheit", species.special],

        ["Dossierstatus", species.status]

    ];


    facts.forEach(([label, value]) => {

        const item = document.createElement("div");

        item.className = "dialog-fact";

        const title = document.createElement("strong");

        title.textContent = label;

        const content = document.createElement("span");

        content.textContent = value || "Noch offen";

        item.append(title, content);

        elements.dialogFacts.appendChild(item);

    });


    elements.dialogLink.hidden = !species.dossierUrl;

    if (species.dossierUrl) {
        elements.dialogLink.href = species.dossierUrl;
    }

    elements.dialogNote.hidden = Boolean(species.dossierUrl);


    elements.dialog.hidden = false;

    elements.dialog.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    document.querySelector(".species-dialog-close").focus();

}


/* DETAILANSICHT SCHLIESSEN */

function closeSpeciesDialog() {

    elements.dialog.hidden = true;

    elements.dialog.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

}


/* 12 - SEITENNUMMERIERUNG */

function createPageButton(label, page, disabled = false, active = false) {

    const button = document.createElement("button");

    button.type = "button";

    button.className = "species-page-button";

    button.textContent = label;

    button.disabled = disabled;

    if (active) {
        button.classList.add("is-active");
        button.setAttribute("aria-current", "page");
    }

    button.addEventListener("click", () => {

        currentPage = page;

        renderSpecies();

        elements.grid.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

    return button;

}


function renderPagination(pageCount) {

    elements.pagination.replaceChildren();

    if (pageCount <= 1) {
        return;
    }

    elements.pagination.appendChild(

        createPageButton(
            "←",
            currentPage - 1,
            currentPage === 1
        )

    );


    const start = Math.max(
        1,
        Math.min(currentPage - 2, pageCount - 4)
    );

    const end = Math.min(
        pageCount,
        start + 4
    );


    for (let page = start; page <= end; page++) {

        elements.pagination.appendChild(

            createPageButton(
                String(page),
                page,
                false,
                page === currentPage
            )

        );

    }


    elements.pagination.appendChild(

        createPageButton(
            "→",
            currentPage + 1,
            currentPage === pageCount
        )

    );

}


/* 13 - SEITE AKTUALISIEREN */

function renderSpecies() {

    const filtered = getFilteredSpecies();

    const pageCount = Math.max(
        1,
        Math.ceil(filtered.length / ITEMS_PER_PAGE)
    );

    currentPage = Math.min(currentPage, pageCount);


    const start = (currentPage - 1) * ITEMS_PER_PAGE;

    const visibleSpecies = filtered.slice(
        start,
        start + ITEMS_PER_PAGE
    );


    elements.grid.replaceChildren();


    visibleSpecies.forEach(species => {

        elements.grid.appendChild(
            createSpeciesCard(species)
        );

    });


    elements.empty.hidden = filtered.length !== 0;


    elements.total.textContent =
        `${speciesList.length} SPEZIES IM ARCHIV`;


    elements.resultCount.textContent =
        `${filtered.length} Spezies gefunden`;


    renderPagination(pageCount);

}


/* 14 - EREIGNISSE */

elements.search.addEventListener("input", () => {

    currentPage = 1;

    renderSpecies();

});


[
    elements.group,
    elements.subgroup,
    elements.homeworld,
    elements.status

].forEach(select => {

    select.addEventListener("change", () => {

        currentPage = 1;

        renderSpecies();

    });

});


elements.reset.addEventListener("click", () => {

    elements.search.value = "";

    elements.group.value = "";
    elements.subgroup.value = "";
    elements.homeworld.value = "";
    elements.status.value = "";

    currentPage = 1;

    renderSpecies();

});


/* DETAILANSICHT SCHLIESSEN */

elements.dialog.addEventListener("click", event => {

    if (event.target.closest("[data-dialog-close]")) {

        closeSpeciesDialog();

    }

});


document.addEventListener("keydown", event => {

    if (
        event.key === "Escape" &&
        !elements.dialog.hidden
    ) {

        closeSpeciesDialog();

    }

});


/* 15 - START */

loadSpeciesCatalog();
