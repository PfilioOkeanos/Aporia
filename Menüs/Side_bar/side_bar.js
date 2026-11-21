import { initializeSidebarDetails } from "./sidebar-details.js";

/* ================================================= */
/* APORIA - LINKE KATEGORIENNAVIGATION               */
/* Version 2.0 - ZENTRALE ROUTENVERWALTUNG           */
/* ================================================= */


/* ============================================= */
/* 01 - ROUTENVERWALTUNG IMPORTIEREN              */
/* ============================================= */

import {
    applyAporiaRoutes
} from "../adapter/aporia-routes.js";


/* ============================================= */
/* 02 - SIDEBAR-PLATZHALTER                      */
/* ============================================= */

function ensureSidebarHost() {
    let host = document.querySelector("[data-aporia-sidebar]");
    if (host || !document.querySelector("[data-aporia-topbar]")) return host;

    host = document.createElement("div");
    host.dataset.aporiaSidebar = "";
    host.dataset.sidebarAuto = "true";

    const pageFrame = document.querySelector(".aporia-page-frame");
    const main = document.querySelector("main");
    if (pageFrame) {
        pageFrame.insertBefore(host, pageFrame.firstChild);
    } else if (main?.parentNode) {
        const frame = document.createElement("div");
        frame.className = "aporia-auto-page-frame";
        main.parentNode.insertBefore(frame, main);
        frame.append(host, main);
    } else {
        document.body.append(host);
    }

    return host;
}

const sidebarHost = ensureSidebarHost();

const savedSidebarWidth = (() => {
    try {
        return Number(window.localStorage.getItem("aporia.sidebar.width")) || 260;
    } catch {
        return 260;
    }
})();
if (savedSidebarWidth >= 210 && savedSidebarWidth <= 440) {
    document.documentElement.style.setProperty("--sidebar-width", savedSidebarWidth + "px");
}


function ensureSidebarStyles() {
    const stylesheet = new URL("./Side_bar.css", import.meta.url).href;
    const existing = [...document.querySelectorAll('link[rel="stylesheet"]')]
        .some(link => link.href === stylesheet);
    if (existing) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = stylesheet;
    document.head.append(link);
}

ensureSidebarStyles();


/* ============================================= */
/* 03 - SIDEBAR LADEN                            */
/* ============================================= */

function populatePageDetails() {
    const section = sidebarHost.querySelector("[data-sidebar-context]");
    const links = section.querySelector("[data-sidebar-context-links]");
    const main = document.querySelector("main");
    if (!main) return;

    const seen = new Set();
    const pageTitle = main.querySelector("h1");
    if (pageTitle) {
        if (!pageTitle.id) pageTitle.id = "aporia-current-page-title";
        const titleLink = document.createElement("a");
        titleLink.href = "#" + pageTitle.id;
        titleLink.textContent = pageTitle.textContent.trim();
        links.append(titleLink);
        seen.add(titleLink.href);
    }
    function addLink(href, label, route) {
        const key = route || href;
        if (!label || seen.has(key)) return;
        seen.add(key);
        const link = document.createElement("a");
        link.setAttribute("href", href);
        if (route) link.dataset.route = route;
        link.textContent = label;
        links.append(link);
    }

    for (const link of main.querySelectorAll(".consortium-nav a, .chapter-nav a, .protectorate-nav a, [data-sidebar-page-nav] a")) {
        const href = link.getAttribute("href");
        const route = link.dataset.route;
        if (!href || (href.startsWith("#") && !document.getElementById(href.slice(1)))) continue;
        if (link.hasAttribute("aria-current") || (route && route === document.body.dataset.page)) continue;
        const label = link.cloneNode(true);
        label.querySelectorAll('[aria-hidden="true"]').forEach((decoration) => decoration.remove());
        addLink(href, label.textContent.trim(), route);
    }

    const details = main.querySelectorAll("section[id], article[id], .celestial-facts h2[id]");
    for (const detail of details) {
        if (detail.closest("[hidden]")) continue;
        const heading = detail.matches("h2") ? detail : detail.querySelector("h2, h3");
        addLink("#" + detail.id, heading?.textContent.trim());
    }

    section.hidden = links.childElementCount === 0;
}

function initializeSidebarResize(host) {
    const handle = host.querySelector(".aporia-sidebar-resizer");
    if (!handle) return;

    const minimumWidth = 210;
    const maximumWidth = 440;
    const preference = "aporia.sidebar.width";
    let dragState = null;

    function setWidth(width, save = false) {
        const availableMaximum = Math.min(maximumWidth, Math.max(minimumWidth, window.innerWidth * 0.45));
        const nextWidth = Math.round(Math.max(minimumWidth, Math.min(availableMaximum, width)));
        document.documentElement.style.setProperty("--sidebar-width", nextWidth + "px");
        handle.setAttribute("aria-valuenow", String(nextWidth));
        if (save) {
            try { window.localStorage.setItem(preference, String(nextWidth)); } catch {}
        }
    }

    function finishResize(event) {
        if (!dragState || event.pointerId !== dragState.pointerId) return;
        setWidth(host.getBoundingClientRect().width, true);
        dragState = null;
        document.body.classList.remove("is-resizing-sidebar");
        if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
    }

    handle.addEventListener("pointerdown", event => {
        if (window.matchMedia("(max-width: 760px)").matches) return;
        event.preventDefault();
        const currentWidth = host.getBoundingClientRect().width;
        dragState = { pointerId: event.pointerId, startX: event.clientX, width: currentWidth };
        handle.setPointerCapture(event.pointerId);
        document.body.classList.add("is-resizing-sidebar");
    });

    handle.addEventListener("pointermove", event => {
        if (!dragState || event.pointerId !== dragState.pointerId) return;
        setWidth(dragState.width + event.clientX - dragState.startX);
    });

    handle.addEventListener("pointerup", finishResize);
    handle.addEventListener("pointercancel", finishResize);

    handle.addEventListener("keydown", event => {
        const currentWidth = host.getBoundingClientRect().width;
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            setWidth(currentWidth + (event.key === "ArrowRight" ? 16 : -16), true);
        } else if (event.key === "Home") {
            event.preventDefault();
            setWidth(minimumWidth, true);
        } else if (event.key === "End") {
            event.preventDefault();
            setWidth(maximumWidth, true);
        }
    });
}

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

        populatePageDetails();
        applyAporiaRoutes(sidebarHost);
        initializeSidebarDetails(sidebarHost);
        initializeSidebarResize(sidebarHost);


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

                if (link.dataset.route === currentPage || link.dataset.route === document.body.dataset.section) {

                    link.classList.add("is-active");

                    link.setAttribute(
                        "aria-current",
                        "page"
                    );

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

export const sidebarBereit = sidebarHost ? loadAporiaSidebar() : Promise.resolve();
