
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
        "../Hauptseite.html/Hauptseite.html",
        import.meta.url
    ).href,

    /* FRAKTIONSARCHIV */
    fraktionen: new URL(
        "../../Fraktionen/Fraktionen.html",
        import.meta.url
    ).href,
    "alle-fraktionen": new URL(
        "../../Fraktionen/Fraktionen.html",
        import.meta.url
    ).href,
    "fraktionskarte": new URL(
        "../../Fraktionen/Fraktionen.html",
        import.meta.url
    ).href,
    "gesellschaftsformen": new URL(
        "../../Fraktionen/Fraktionen.html",
        import.meta.url
    ).href,
    konfoederation: new URL(
        "../../Fraktionen/Konfoederation/Konfoederation.html",
        import.meta.url
    ).href,
    konsortium: new URL(
        "../../Fraktionen/Konsortium/Konsortium.html",
        import.meta.url
    ).href,
    protektorat: new URL(
        "../../Fraktionen/Protektorat/Protektorat.html",
        import.meta.url
    ).href,
    synaptorat: new URL(
        "../../Fraktionen/Synaptorat/Synaptorat.html",
        import.meta.url
    ).href,
    aetherwanderer: new URL(
        "../../Fraktionen/Aetherwanderer/Aetherwanderer.html",
        import.meta.url
    ).href,
    "aether-wanderer": new URL(
        "../../Fraktionen/Aetherwanderer/Aetherwanderer.html",
        import.meta.url
    ).href,
    zirkel: new URL(
        "../../Fraktionen/Fraktionen.html",
        import.meta.url
    ).href,

    /* SPEZIESARCHIV */
    spezies: new URL(
        "../../inhalte/spezies/Spezies.html",
        import.meta.url
    ).href,
    "alle-spezies": new URL(
        "../../inhalte/spezies/Spezies.html",
        import.meta.url
    ).href,
    speziesdossiers: new URL(
        "../../inhalte/spezies/Spezies.html",
        import.meta.url
    ).href,
    "dossiers-spezies": new URL(
        "../../inhalte/spezies/Spezies.html",
        import.meta.url
    ).href

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
