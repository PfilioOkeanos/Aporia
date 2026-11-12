/* APORIA - zentrale URL- und Routenverwaltung */

const routes = Object.freeze({
    "freihafen": new URL("../../inhalte/Fraktionen/Freihafen.html", import.meta.url).href,
    "synthetische-organismen": new URL("../../inhalte/spezies/Synthetische-Organismen.html", import.meta.url).href,
    "waldfeen": new URL("../../Waldfeen.html", import.meta.url).href,
    "protektorat": new URL("../../inhalte/Fraktionen/Protektorat/Protektorat.html", import.meta.url).href,
    "protektorat-verwaltung": new URL("../../inhalte/Fraktionen/Protektorat/Verwaltung.html", import.meta.url).href,
    "protektorat-gilden": new URL("../../inhalte/Fraktionen/Protektorat/Gilden.html", import.meta.url).href,
    "protektorat-auftraege": new URL("../../inhalte/Fraktionen/Protektorat/Auftraege.html", import.meta.url).href,
    "protektorat-gildenpunkte": new URL("../../inhalte/Fraktionen/Protektorat/Gildenpunkte.html", import.meta.url).href,
    "protektorat-informationsarchiv": new URL("../../inhalte/Fraktionen/Protektorat/Informationsarchiv.html", import.meta.url).href,
    "protektorat-radiosender": new URL("../../inhalte/Fraktionen/Protektorat/Radiosender.html", import.meta.url).href,
    "protektorat-tv": new URL("../../inhalte/Fraktionen/Protektorat/TV.html", import.meta.url).href,
    "protektorat-werbevideo": new URL("../../inhalte/Fraktionen/Protektorat/Werbevideo.html", import.meta.url).href,
    "universum": new URL("../../inhalte/Kosmologie/Kosmische_übersicht/Kosmologie.html", import.meta.url).href,
    "kosmische-strukturen": new URL("../../inhalte/Kosmologie/Kosmische_übersicht/Kosmologie.html", import.meta.url).href,
    "cosmic-webs": new URL("../../inhalte/Kosmologie/Cosmic_web/index.html", import.meta.url).href,
    "filamente": new URL("../../inhalte/Kosmologie/Filamente/index.html", import.meta.url).href,
    "supergalaxien": new URL("../../inhalte/Kosmologie/SuperGalaxien/index.html", import.meta.url).href,
    "galaxienhaufen": new URL("../../inhalte/Kosmologie/GalaxienHaufen/index.html", import.meta.url).href,
    "galaxiengruppen": new URL("../../inhalte/Kosmologie/Galaxiengruppen/index.html", import.meta.url).href,
    "kosmologie-galaxien": new URL("../../inhalte/Kosmologie/Galaxien/index.html", import.meta.url).href,
    "galaktische-strukturen": new URL("../../inhalte/Kosmologie/Galaxiensgruppen/index.html", import.meta.url).href,
    "sektoren": new URL("../../inhalte/Kosmologie/Sektoren/index.html", import.meta.url).href,
    "kosmologie-sternsysteme": new URL("../../inhalte/Kosmologie/Sternensysteme/index.html", import.meta.url).href,
    home: new URL("../Hauptseite.html/Hauptseite.html", import.meta.url).href,
    karte: new URL("../Karte/Karte.html", import.meta.url).href,
    fraktionen: new URL("../../inhalte/Fraktionen/Fraktions_\u00fcbersichtsseite/Fraktionen.html", import.meta.url).href,
    "alle-fraktionen": new URL("../../inhalte/Fraktionen/Fraktions_\u00fcbersichtsseite/Fraktionen.html", import.meta.url).href,
    "dossiers-fraktionen": new URL("../../inhalte/Fraktionen/Fraktions_\u00fcbersichtsseite/Fraktionen.html", import.meta.url).href,
    konfoederation: new URL("../../inhalte/Fraktionen/Konförderation/Konfoederation.html", import.meta.url).href,
    konfoerderation: new URL("../../inhalte/Fraktionen/Konförderation/Konfoederation.html", import.meta.url).href,
    konsortium: new URL("../../inhalte/Fraktionen/Das Konsortium/Konsortium.html", import.meta.url).href,
    orvaya: new URL("../../inhalte/himmelskoerper/orvaya.html", import.meta.url).href,
    himmelskoerper: new URL("../../inhalte/himmelskoerper/himmelskoerper/himmelskoerper.html", import.meta.url).href,
    planeten: new URL("../../inhalte/himmelskoerper/planeten/planeten.html", import.meta.url).href,
    sterne: new URL("../../inhalte/himmelskoerper/sterne/sterne.html", import.meta.url).href,
    monde: new URL("../../inhalte/himmelskoerper/monde/monde.html", import.meta.url).href,
    "schwarze-loecher": new URL("../../inhalte/himmelskoerper/schwarze-loecher/schwarze-loecher.html", import.meta.url).href,
    sternensysteme: new URL("../../inhalte/himmelskoerper/sternensysteme/sternensysteme.html", import.meta.url).href,
    zwergplaneten: new URL("../../inhalte/himmelskoerper/zwergplaneten/zwergplaneten.html", import.meta.url).href,
    asteroiden: new URL("../../inhalte/himmelskoerper/asteroiden/asteroiden.html", import.meta.url).href,
    nebel: new URL("../../inhalte/himmelskoerper/nebel/nebel.html", import.meta.url).href,
    galaxien: new URL("../../inhalte/himmelskoerper/galaxien/galaxien.html", import.meta.url).href,
    phaenomene: new URL("../../inhalte/himmelskoerper/phaenomene/phaenomene.html", import.meta.url).href,
    "sterne-und-sternenueberreste": new URL("../../inhalte/himmelskoerper/sterne/sterne.html", import.meta.url).href,
    "dossiers-planeten": new URL("../../inhalte/himmelskoerper/planeten/planeten.html", import.meta.url).href,
    planetensysteme: new URL("../../inhalte/himmelskoerper/sternensysteme/sternensysteme.html", import.meta.url).href,
    sternsysteme: new URL("../../inhalte/himmelskoerper/sternensysteme/sternensysteme.html", import.meta.url).href,
    "aussergewoehnliche-himmelskoerper": new URL("../../inhalte/himmelskoerper/phaenomene/phaenomene.html", import.meta.url).href,
    "roter-zwerg": new URL("../../inhalte/himmelskoerper/sterne.html", import.meta.url).href,
    spezies: new URL("../../inhalte/spezies/Spezies_\u00fcbersicht/Spezies.html", import.meta.url).href,
    "alle-spezies": new URL("../../inhalte/spezies/Spezies_\u00fcbersicht/Spezies.html", import.meta.url).href,
    speziesdossiers: new URL("../../inhalte/spezies/Spezies_\u00fcbersicht/Spezies.html", import.meta.url).href,
    "dossiers-spezies": new URL("../../inhalte/spezies/Spezies_\u00fcbersicht/Spezies.html", import.meta.url).href,
});

export function getAporiaRoute(route) {
    return routes[String(route ?? "").trim()] ?? null;
}

export function applyAporiaRoutes(root = document) {
    const links = [];
    if (root instanceof Element && root.matches("a[data-route]")) links.push(root);
    links.push(...root.querySelectorAll("a[data-route]"));
    for (const link of links) {
        const target = getAporiaRoute(link.dataset.route);
        if (target) {
            const fragment = link.dataset.routeFragment;
            link.href = fragment ? target + "#" + encodeURIComponent(fragment) : target;
            link.removeAttribute("aria-disabled");
            link.removeAttribute("tabindex");
            link.classList.remove("is-unavailable");
        } else {
            link.removeAttribute("href");
            link.setAttribute("aria-disabled", "true");
            link.setAttribute("tabindex", "-1");
            link.classList.add("is-unavailable");
        }
    }
}

export const celestialCategories = Object.freeze([
    { route: "planeten", label: "Planeten" },
    { route: "sterne", label: "Sterne und Sternüberreste" },
    { route: "monde", label: "Monde" },
    { route: "schwarze-loecher", label: "Schwarze Löcher" },
    { route: "sternensysteme", label: "Sternensysteme" },
    { route: "zwergplaneten", label: "Zwergplaneten" },
    { route: "asteroiden", label: "Asteroiden" },
    { route: "nebel", label: "Nebel" },
    { route: "galaxien", label: "Galaxien" },
    { route: "phaenomene", label: "Phänomene" }
]);