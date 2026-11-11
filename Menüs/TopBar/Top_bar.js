
/* ================================================= */
/* APORIA - OBERE HAUPTNAVIGATION                    */
/* Version 4.0 - ZENTRALE ROUTENVERWALTUNG            */
/* ================================================= */

/* 01 - ROUTENVERWALTUNG IMPORTIEREN */

import {
    applyAporiaRoutes
} from "../Router/aporia-routes.js";


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


        /* 05 - VIER HAUPTNAVIGATIONSPUNKTE */

        const requiredNavItems = [

            {
                route: "karte",
                label: "Karte",
                icon:
                    '<path d="M3 6 L9 3 L15 6 L21 3 V18 L15 21 L9 18 L3 21 Z"/>' +
                    '<path d="M9 3 V18 M15 6 V21"/>'
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

            input.placeholder = "Archiv durchsuchen ...";

            input.setAttribute(
                "aria-label",
                "Aporia-Archiv durchsuchen"
            );

            const shortcut = document.createElement("kbd");

            shortcut.textContent = "Strg + K";

            search.append(icon, input, shortcut);

            header.appendChild(search);

        }


        /* 09 - ZENTRALE ROUTEN ANWENDEN */

        applyAporiaRoutes(topbarHost);


        /* 10 - AKTUELLE SEITE MARKIEREN */

        const currentPage = document.body.dataset.page;

        topbarHost.querySelectorAll(
            "[data-route]"
        ).forEach(link => {

            link.classList.remove("is-active");

            link.removeAttribute("aria-current");

            if (link.dataset.route === currentPage) {

                link.classList.add("is-active");

                link.setAttribute(
                    "aria-current",
                    "page"
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
