
/* ================================================= */
/* APORIA - OBERE HAUPTNAVIGATION                    */
/* Version 4.0 - ZENTRALE ROUTENVERWALTUNG            */
/* ================================================= */

/* 01 - ROUTENVERWALTUNG IMPORTIEREN */


import "../Side_bar/side_bar.js";
import {
    applyAporiaRoutes,
    celestialCategories,
    contentCategories
} from "../adapter/aporia-routes.js";
import { starteArchivsuche } from "../adapter/aporia-archivsuche.js";
import { initializeNavigationColor } from "../adapter/aporia-navigation-color.js";


/* 02 - NAVIGATION-PLATZHALTER */

const topbarHost = document.querySelector(
    "[data-aporia-topbar]"
);


/* 03 - TOPBAR LADEN */

async function loadAporiaTopbar() {

    if (!topbarHost) {
        console.error(
            "APORIA: Topbar-Platzhalter fehlt."
        );
        return;
    }

    try {

        /* HTML LADEN */

        const topbarUrl = new URL(
            "./Top_bar.html",
            import.meta.url
        );

        const response = await fetch(
            topbarUrl,
            { cache: "no-store" }
        );

        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status}`
            );
        }

        topbarHost.innerHTML =
            (await response.text()).trim();


        /* 04 - NAVIGATION PRÜFEN */

        const navigation = topbarHost.querySelector(
            ".aporia-main-nav"
        );

        const header = topbarHost.querySelector(
            ".aporia-topbar"
        );

        if (!header || !navigation) {
            throw new Error(
                "Topbar oder Hauptnavigation fehlt."
            );
        }


        initializeSidebarToggle();
        new ResizeObserver(() => {
            document.documentElement.style.setProperty("--aporia-topbar-height", header.offsetHeight + "px");
        }).observe(header);
        initializeNavigationColor(header);

        /* 05 - HAUPTNAVIGATIONSPUNKTE */

        const requiredNavItems = [

            {
                route: "karte",
                label: "Karte",
                icon:
                    '<path d="M3 6 L9 3 L15 6 L21 3 V18 L15 21 L9 18 L3 21 Z"/>' +
                    '<path d="M9 3 V18 M15 6 V21"/>'
            },

            {
                route: "sternenkarte",
                label: "Sternenkarte",
                icon: '<path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z"/>'
            },

            {
                route: "himmelskoerper",
                label: "Himmelskörper",
                icon:
                    '<circle cx="12" cy="12" r="5"/>' +
                    '<path d="M2 12 C6 4 18 4 22 12 C18 20 6 20 2 12 Z"/>'
            },

            {
                route: "fraktionen",
                label: "Fraktionen",
                icon:
                    '<path d="M12 3 L20 6 V11 C20 16 16.5 19 12 21 C7.5 19 4 16 4 11 V6 Z"/>' +
                    '<path d="M8 12 L11 15 L16 9"/>'
            },

            {
                route: "spezies",
                label: "Spezies",
                icon:
                    '<path d="M20 4 C10 4 5 8 5 14 C5 18 8 20 11 20 C17 20 20 13 20 4 Z"/>' +
                    '<path d="M3 22 C7 16 12 11 18 7"/>'
            },

            {
                route: "forschung",
                label: "Forschung",
                icon: '<path d="M9 3h6m-5 0v7l-5 8a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-8V3M8 15h8"/>'
            },

            {
                route: "rohstoffe",
                label: "Rohstoffe",
                icon: '<path d="M3 9 L8 4 H16 L21 9 L12 21 Z M3 9 H21 M8 4 L12 21 L16 4"/>'
            },

            {
                route: "kosmische-strukturen",
                label: "Kosmische Strukturen",
                icon: '<circle cx="12" cy="12" r="2"/><circle cx="4" cy="7" r="1.5"/><circle cx="20" cy="5" r="1.5"/><circle cx="18" cy="19" r="1.5"/><path d="M5.5 8 L10.3 11 M13.5 10.6 L18.8 6 M13.3 13.5 L17 18"/>'
            }

        ];


        /* 06 - DOPPELTE LINKS ENTFERNEN */

        const uniqueLinks = new Map();

        navigation.querySelectorAll(
            ".aporia-nav-link"
        ).forEach(link => {

            const route = link.dataset.route;

            if (route && !uniqueLinks.has(route)) {
                uniqueLinks.set(route, link);
            } else {
                link.remove();
            }

        });


        /* 07 - FEHLENDE MENÜPUNKTE ERGÄNZEN */

        requiredNavItems.forEach(item => {

            let link = uniqueLinks.get(item.route);

            if (!link) {

                link = document.createElement("a");

                link.className = "aporia-nav-link";
                link.dataset.route = item.route;

                const icon = document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "svg"
                );

                icon.setAttribute(
                    "viewBox",
                    "0 0 24 24"
                );

                icon.setAttribute("fill", "none");
                icon.setAttribute("aria-hidden", "true");

                icon.innerHTML = item.icon;

                link.appendChild(icon);

                navigation.appendChild(link);

            }

            link.setAttribute(
                "aria-label",
                item.label
            );

            link.title = item.label;

            let label = link.querySelector("span");

            if (!label) {

                label = document.createElement("span");

                link.appendChild(label);

            }

            label.textContent = item.label;
            navigation.append(link);

        });


        /* 08 - SUCHFELD PRÜFEN */

        let search = topbarHost.querySelector(
            ".aporia-search"
        );

        if (!search) {

            search = document.createElement("div");

            search.className = "aporia-search";

            const icon = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "svg"
            );

            icon.setAttribute("viewBox", "0 0 24 24");
            icon.setAttribute("fill", "none");

            icon.innerHTML =
                '<circle cx="10.8" cy="10.8" r="6.8"/>' +
                '<path d="M16 16 L21 21"/>';

            const input = document.createElement("input");

            input.type = "search";
            input.id = "aporia-search-input";

            input.placeholder = "Archiv durchsuchen";

            input.setAttribute(
                "aria-label",
                "Aporia-Archiv durchsuchen"
            );

            icon.setAttribute("aria-hidden", "true");
            search.append(icon, input);

            header.appendChild(search);

        }


        /* 09 - ZENTRALE ROUTEN ANWENDEN */

        const submenus = {
            himmelskoerper: celestialCategories,
            "kosmische-strukturen": [
                { route: "cosmic-webs", label: "Cosmic Webs (3)" },
                { route: "filamente", label: "Filamente" },
                { route: "supergalaxien", label: "Supergalaxien" },
                { route: "galaxienhaufen", label: "Galaxienhaufen" },
                { route: "galaxiengruppen", label: "Galaxiengruppen" },
                { route: "kosmologie-galaxien", label: "Galaxien" },
                { route: "galaktische-strukturen", label: "Galaktische Strukturen" },
                { route: "sektoren", label: "Sektoren" },
                { route: "kosmologie-sternsysteme", label: "Sternsysteme" },
                { route: "kosmologie-asteroidenguertel", label: "Asteroidengürtel" }
            ],
            fraktionen: [
                { route: "konfoederation", label: "Konföderation" },
                { route: "konsortium", label: "Das Konsortium" },
                { route: "protektorat", label: "Das Protektorat" },
                { route: "fraktionen", fragment: "synaptorat", label: "Synaptorat" },
                { route: "fraktionen", fragment: "aetherwanderer", label: "Ätherwanderer" }
            ],
            spezies: [
                { route: "spezies-biological", label: "Biologische Spezies" },
                { route: "spezies-mental", label: "Mentale Spezies" },
                { route: "spezies-cosmic", label: "Kosmische Spezies" },
                { route: "spezies-technological", label: "Technologische Lebensformen" },
                { route: "spezies-gigantic", label: "Gigantische Lebensformen" }
            ],
            forschung: [
                { route: "forschung", fragment: "forschungsgebiete", label: "Forschungsgebiete" },
                { route: "forschung", fragment: "gruppe-1", label: "Naturwissenschaften" },
                { route: "forschung", fragment: "gruppe-2", label: "Technologie und Ingenieurwesen" },
                { route: "forschung", fragment: "gruppe-3", label: "Gesellschaft und Kultur" },
                { route: "forschung", fragment: "gruppe-4", label: "Raum- und Planetensysteme" },
                { route: "forschung", fragment: "gruppe-5", label: "Umwelt, Leben und Ressourcen" },
                { route: "forschung", fragment: "gruppe-6", label: "Spezialisierte Forschung" },
                { route: "forschung", fragment: "gruppe-7", label: "Xenoforschung" },
                { route: "forschung", fragment: "gruppe-8", label: "Fundamentale und exotische Forschung" },
                { route: "forschung", fragment: "gruppe-9", label: "Mystik und Bewusstsein" }
            ],
            rohstoffe: [
                { route: "rohstoffe", fragment: "elemente", label: "Chemische Elemente" },
                { route: "rohstoffe", fragment: "raumfahrt", label: "Raumfahrt-Werkstoffe" }
            ]
        };

        addContentMenu(navigation);
        addStoryEditorMenuItem(navigation);

        for (const [route, items] of Object.entries(submenus)) {
            const parent = navigation.querySelector(`[data-route="${route}"]`);
            if (parent) addCategoryMenu(parent, items);
        }
        applyAporiaRoutes(document);

        topbarHost.querySelectorAll("a[aria-disabled='true']").forEach(link => {
            link.title = `${link.getAttribute("aria-label") || link.textContent.trim()} – Seite noch nicht angelegt`;
        });

        starteArchivsuche(search);


        /* 10 - AKTUELLE SEITE MARKIEREN */

        const currentPage = document.body.dataset.page;
        const currentSection = document.body.dataset.section;

        topbarHost.querySelectorAll(
            "[data-route]"
        ).forEach(link => {

            link.classList.remove("is-active");

            link.removeAttribute("aria-current");

            if (!link.dataset.routeFragment && (link.dataset.route === currentPage || link.dataset.route === currentSection)) {

                link.classList.add("is-active");

                link.setAttribute(
                    "aria-current",
                    link.dataset.route === currentPage ? "page" : "location"
                );

            }

        });


        /* 11 - STRG + K SUCHFELD */

        document.addEventListener("keydown", event => {

            if (
                (event.ctrlKey || event.metaKey) &&
                event.key.toLowerCase() === "k"
            ) {

                event.preventDefault();

                topbarHost.querySelector(
                    "#aporia-search-input"
                )?.focus();

            }

        });


        /* 12 - ERFOLGSMELDUNG */

        console.log(
            "APORIA: Topbar erfolgreich geladen."
        );

        console.log(
            "APORIA: Zentrale Routen angewendet."
        );

        console.log(
            "APORIA: 4 Hauptmenüpunkte vorhanden."
        );

    } catch (error) {

        console.error(
            "APORIA Topbar Fehler:",
            error
        );

        topbarHost.textContent =
            "APORIA: Hauptnavigation konnte nicht geladen werden.";

    }

}


/* 13 - INITIALISIERUNG */

loadAporiaTopbar();


function initializeSidebarToggle() {
    const button = topbarHost.querySelector("[data-sidebar-visibility]");
    const sidebar = document.querySelector("[data-aporia-sidebar]");
    if (!button || !sidebar) return;

    const preference = "aporia.sidebar.collapsed";
    sidebar.id = "aporia-sidebar-host";
    function setExpanded(expanded) {
        sidebar.hidden = !expanded;
        button.setAttribute("aria-expanded", String(expanded));
        const label = expanded ? "Seitenleiste einklappen" : "Seitenleiste ausklappen";
        button.setAttribute("aria-label", label);
        button.title = label;
    }

    let expanded = !sidebar.hasAttribute("data-sidebar-default-collapsed");
    try {
        const saved = window.localStorage.getItem(preference);
        if (saved !== null) expanded = saved !== "true";
    } catch {
        // Der Schalter bleibt auch ohne Zugriff auf den Browserspeicher nutzbar.
    }
    setExpanded(expanded);
    button.hidden = false;

    button.addEventListener("click", () => {
        const expanded = sidebar.hidden;
        setExpanded(expanded);
        try {
            window.localStorage.setItem(preference, String(!expanded));
        } catch {
            // Die aktuelle Ansicht ist bereits aktualisiert.
        }
    });
}

function addCategoryMenu(parent, items) {
    const group = document.createElement("div");
    group.className = "aporia-celestial-nav";
    parent.before(group);
    group.append(parent);

    const disclosure = document.createElement("details");
    disclosure.className = "aporia-celestial-disclosure";
    const toggle = document.createElement("summary");
    const label = parent.getAttribute("aria-label") || parent.textContent.trim();
    toggle.setAttribute("aria-label", label + " – Untermenü");
    toggle.title = label + " – Untermenü";
    toggle.textContent = "▾";
    const list = document.createElement("ul");

    for (const { route, label, fragment } of items) {
        const item = document.createElement("li");
        const link = document.createElement("a");
        link.dataset.route = route;
        if (fragment) link.dataset.routeFragment = fragment;
        link.textContent = label;
        item.append(link);
        list.append(item);
    }

    disclosure.append(toggle, list);
    group.append(disclosure);
    list.addEventListener("click", event => {
        if (event.target.closest("a[href]")) disclosure.open = false;
    });
    document.addEventListener("click", event => {
        if (disclosure.open && !group.contains(event.target)) disclosure.open = false;
    });
    group.addEventListener("keydown", event => {
        if (event.key === "Escape" && disclosure.open) {
            disclosure.open = false;
            toggle.focus();
        }
    });
}

function addContentMenu(navigation) {
    const group = document.createElement("div");
    group.className = "aporia-content-nav";

    const details = document.createElement("details");
    details.className = "aporia-content-disclosure";

    const summary = document.createElement("summary");
    summary.className = "aporia-content-trigger";
    summary.innerHTML = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 5h16M4 12h16M4 19h16"/></svg><span>Inhalte</span><span class="aporia-content-chevron" aria-hidden="true">▾</span>';
    details.append(summary);

    const panel = document.createElement("div");
    panel.className = "aporia-content-panel";
    const categoryList = document.createElement("nav");
    categoryList.className = "aporia-content-categories";
    categoryList.setAttribute("aria-label", "Inhaltsbereiche");
    const subfolderPanel = document.createElement("section");
    subfolderPanel.className = "aporia-content-subfolders";
    subfolderPanel.setAttribute("aria-live", "polite");
    panel.append(categoryList, subfolderPanel);
    details.append(panel);
    group.append(details);
    navigation.append(group);

    function selectCategory(category, selectedLink) {
        categoryList.querySelectorAll(".is-selected").forEach(link => {
            link.classList.remove("is-selected");
            link.removeAttribute("aria-current");
        });
        selectedLink.classList.add("is-selected");
        selectedLink.setAttribute("aria-current", "true");

        subfolderPanel.replaceChildren();
        const heading = document.createElement("h2");
        const overviewLink = document.createElement("a");
        overviewLink.dataset.route = category.route;
        overviewLink.textContent = category.label;
        overviewLink.className = "aporia-content-overview";
        heading.append(overviewLink);
        subfolderPanel.append(heading);

        const description = document.createElement("p");
        description.textContent = category.description;
        subfolderPanel.append(description);

        const links = document.createElement("ul");
        for (const child of category.children) {
            const row = document.createElement("li");
            const link = document.createElement("a");
            link.dataset.route = child.route;
            link.textContent = child.label;
            row.append(link);
            links.append(row);
        }
        subfolderPanel.append(links);
        applyAporiaRoutes(subfolderPanel);
    }

    for (const category of contentCategories) {
        const link = document.createElement("a");
        link.dataset.route = category.route;
        link.textContent = category.label;
        link.addEventListener("pointerenter", () => selectCategory(category, link));
        link.addEventListener("focus", () => selectCategory(category, link));
        categoryList.append(link);
    }
    const firstCategory = contentCategories[0];
    selectCategory(firstCategory, categoryList.querySelector("a"));
    applyAporiaRoutes(categoryList);

    details.addEventListener("click", event => {
        const link = event.target.closest("a[href]");
        if (link) details.open = false;
    });
    document.addEventListener("click", event => {
        if (details.open && !group.contains(event.target)) details.open = false;
    });
    group.addEventListener("keydown", event => {
        if (event.key === "Escape" && details.open) {
            details.open = false;
            summary.focus();
        }
    });
}


function addStoryEditorMenuItem(navigation) {
    if (navigation.querySelector('[data-route="story-editor"]')) return;

    const link = document.createElement("a");
    link.className = "aporia-nav-link";
    link.dataset.route = "story-editor";
    link.setAttribute("aria-label", "StoryEditor");
    link.title = "StoryEditor";

    const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute("viewBox", "0 0 24 24");
    icon.setAttribute("fill", "none");
    icon.setAttribute("aria-hidden", "true");
    icon.innerHTML = '<path d="M4 20l4.2-.9L19 8.3a2.1 2.1 0 0 0-3-3L5.2 16.1 4 20z"/><path d="M14.5 6.8l3 3"/><path d="M4 20h16"/>';
    const label = document.createElement("span");
    label.textContent = "StoryEditor";
    link.append(icon, label);
    navigation.append(link);
}
