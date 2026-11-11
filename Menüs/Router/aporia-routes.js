
/* ================================================= */
/* APORIA - ZENTRALE ROUTENVERWALTUNG                */
/* Version 2.0                                       */
/* ================================================= */


/* ============================================= */
/* 01 - SEITENADRESSEN                           */
/* ============================================= */

const SPECIES_PAGE = new URL(
    "../inhalte/spezies/Spezies.html",
    import.meta.url
).href;


const APORIA_ROUTES = {

    /* STARTSEITE */

    home: new URL(
        "./Hauptseite.html/Hauptseite.html",
        import.meta.url
    ).href,


    /* SPEZIESARCHIV */

    spezies: SPECIES_PAGE,

    "alle-spezies": SPECIES_PAGE,

    "speziesdossiers": SPECIES_PAGE,

    "dossiers-spezies": SPECIES_PAGE

};


/* ============================================= */
/* 02 - ROUTE ABRUFEN                            */
/* ============================================= */

export function getAporiaRoute(route) {

    return APORIA_ROUTES[route] ?? null;

}


/* ============================================= */
/* 03 - NAVIGATIONSLINKS VERKNÜPFEN              */
/* ============================================= */

export function applyAporiaRoutes(root = document) {

    const links = root.querySelectorAll(
        "a[data-route]"
    );

    links.forEach(link => {

        const target = getAporiaRoute(
            link.dataset.route
        );

        if (!target) {

            return;

        }

        link.href = target;

        link.removeAttribute(
            "aria-disabled"
        );

    });

}


/* ============================================= */
/* 04 - ROUTEN PRÜFEN                             */
/* ============================================= */

export function checkAporiaRoute(route) {

    const target = getAporiaRoute(route);

    if (!target) {

        console.warn(
            `APORIA: Route "${route}" ist noch nicht registriert.`
        );

        return false;

    }

    return true;

}
