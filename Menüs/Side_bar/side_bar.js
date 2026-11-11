
/* ================================================= */
/* APORIA - LINKE KATEGORIENNAVIGATION               */
/* Version 2.0 - ZENTRALE ROUTENVERWALTUNG           */
/* ================================================= */


/* ============================================= */
/* 01 - ROUTENVERWALTUNG IMPORTIEREN              */
/* ============================================= */

import {
    applyAporiaRoutes
} from "../Router/aporia-routes.js";


/* ============================================= */
/* 02 - SIDEBAR-PLATZHALTER                      */
/* ============================================= */

const sidebarHost = document.querySelector(
    "[data-aporia-sidebar]"
);


/* ============================================= */
/* 03 - SIDEBAR LADEN                            */
/* ============================================= */

async function loadAporiaSidebar() {

    if (!sidebarHost) {

        console.error(
            "APORIA: Sidebar-Platzhalter fehlt."
        );

        return;
    }

    try {

        /* HTML LADEN */

        const sidebarUrl = new URL(
            "./Side_bar.html",
            import.meta.url
        );

        const response = await fetch(
            sidebarUrl,
            { cache: "no-store" }
        );

        if (!response.ok) {

            throw new Error(
                `Sidebar konnte nicht geladen werden: HTTP ${response.status}`
            );

        }


        /* HTML EINFÜGEN */

        const html = await response.text();

        sidebarHost.id = "aporia-sidebar-host";

        sidebarHost.innerHTML = html.trim();


        /* ========================================= */
        /* 04 - ZENTRALE ROUTEN ANWENDEN             */
        /* ========================================= */

        applyAporiaRoutes(sidebarHost);


        /* ========================================= */
        /* 05 - AUFKLAPPBARE KATEGORIEN              */
        /* ========================================= */

        sidebarHost.addEventListener(
            "click",
            event => {

                const toggle = event.target.closest(
                    "[data-sidebar-toggle]"
                );

                if (
                    toggle &&
                    sidebarHost.contains(toggle)
                ) {

                    const panelId = toggle.getAttribute(
                        "aria-controls"
                    );

                    const panel = sidebarHost.querySelector(
                        "#" + panelId
                    );

                    if (!panel) return;

                    const shouldOpen = panel.hidden;

                    panel.hidden = !shouldOpen;

                    toggle.setAttribute(
                        "aria-expanded",
                        String(shouldOpen)
                    );

                    toggle.classList.toggle(
                        "is-open",
                        shouldOpen
                    );

                    return;

                }


                /* PLATZHALTER-LINKS VERHINDERN */

                const link = event.target.closest(
                    "a[data-route]"
                );

                if (
                    link &&
                    sidebarHost.contains(link) &&
                    link.getAttribute("href") === "#"
                ) {

                    event.preventDefault();

                }

            }
        );


        /* ========================================= */
        /* 06 - AKTUELLE SEITE ERMITTELN             */
        /* ========================================= */

        const currentPage = document.body.dataset.page;


        /* ========================================= */
        /* 07 - AKTUELLE SEITE MARKIEREN             */
        /* ========================================= */

        if (currentPage) {

            sidebarHost.querySelectorAll(
                "a[data-route]"
            ).forEach(link => {

                if (link.dataset.route === currentPage) {

                    link.classList.add("is-active");

                    link.setAttribute(
                        "aria-current",
                        "page"
                    );


                    /* ZUGEHÖRIGE UNTERMENÜS ÖFFNEN */

                    let panel = link.closest(
                        ".aporia-sidebar-submenu"
                    );

                    while (panel) {

                        panel.hidden = false;

                        const parentToggle =
                            sidebarHost.querySelector(
                                '[aria-controls="' +
                                panel.id +
                                '"]'
                            );

                        if (parentToggle) {

                            parentToggle.setAttribute(
                                "aria-expanded",
                                "true"
                            );

                            parentToggle.classList.add(
                                "is-open"
                            );

                        }

                        panel = panel.parentElement.closest(
                            ".aporia-sidebar-submenu"
                        );

                    }

                }

            });

        }


        /* ========================================= */
        /* 08 - ERFOLGSMELDUNG                       */
        /* ========================================= */

        console.log(
            "APORIA: Sidebar erfolgreich geladen."
        );

        console.log(
            "APORIA: Zentrale Routen angewendet."
        );


    } catch (error) {

        console.error(
            "APORIA Sidebar Fehler:",
            error
        );

        sidebarHost.textContent =
            "Die Archivnavigation konnte nicht geladen werden.";

    }

}


/* ============================================= */
/* 09 - INITIALISIERUNG                          */
/* ============================================= */

loadAporiaSidebar();
