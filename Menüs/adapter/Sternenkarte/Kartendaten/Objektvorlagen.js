import { getAporiaRoute } from "../../aporia-routes.js";
import { getCelestialDetailUrl, loadCelestialCatalog } from "../../aporia-celestial.js";

import { strukturgruppe } from "./Kartengruppen.js";

const wurzel = new URL("../../../../", import.meta.url);

const vorlagen = [
    ["Einfach", "Kugel", "", "", "kugel", [.42,.72,1], 0],
    ["Sterne", "Sonnenähnlicher Stern", "Stern", "sterne", "kugel", [1,.7,.32], 1.2],
    ["Sterne", "Roter Zwerg", "Roter Zwerg", "sterne", "kugel", [1,.24,.10], .85],
    ["Sterne", "Brauner Zwerg", "Brauner Zwerg", "sterne", "kugel", [.54,.22,.12], .18],
    ["Sterne", "Blauer Riese", "Blauer Riese", "sterne", "kugel", [.34,.62,1], 1.35],
    ["Sterne", "Weißer Zwerg", "Weißer Zwerg", "sterne", "kugel", [.75,.88,1], 1.15],
    ["Sterne", "Neutronenstern / Pulsar", "Neutronenstern", "sterne", "phaenomen", [.47,.74,1], 1.35],
    ["Himmelskörper", "Gesteinsplanet", "Gesteinsplanet", "planeten", "kugel", [.55,.43,.33], 0],
    ["Himmelskörper", "Ozeanplanet", "Ozeanplanet", "planeten", "kugel", [.16,.51,.78], 0],
    ["Himmelskörper", "Gasriese", "Gasriese", "planeten", "gasriese", [.83,.63,.37], 0],
    ["Himmelskörper", "Eisriese", "Eisriese", "planeten", "kugel", [.40,.68,.88], 0],
    ["Himmelskörper", "Zwergplanet", "Zwergplanet", "zwergplaneten", "kugel", [.66,.60,.52], 0],
    ["Himmelskörper", "Mond", "Mond", "monde", "kugel", [.67,.67,.62], 0],
    ["Himmelskörper", "Asteroid", "Asteroid", "asteroiden", "brocken", [.53,.46,.38], 0],
    ["Himmelskörper", "Komet", "Komet", "kometen", "komet", [.42,.75,.95], .23],
    ["Himmelskörper", "Schwarzes Loch", "Schwarzes Loch", "schwarze-loecher", "schwarzes-loch", [.045,.04,.06], 0],
    ["Himmelskörper", "Nebelfeld", "Nebel", "nebel", "wolke", [.51,.38,.79], .28],
    ["Himmelskörper", "Astronomisches Phänomen", "Phänomen", "phaenomene", "phaenomen", [.62,.49,.94], .55],
    ["Kosmische Strukturen", "Cosmic Web", "Kosmisches Netz", "cosmic-webs", "filament", [.54,.65,.88], .35],
    ["Kosmische Strukturen", "Filament", "Filament", "filamente", "filament", [.43,.59,.89], .28],
    ["Kosmische Strukturen", "Supergalaxie", "Supergalaxie", "supergalaxien", "scheibe", [.76,.62,.95], .37],
    ["Kosmische Strukturen", "Galaxienhaufen", "Galaxienhaufen", "galaxienhaufen", "wolke", [.68,.57,.83], .25],
    ["Kosmische Strukturen", "Galaxiengruppe", "Galaxiengruppe", "galaxiengruppen", "wolke", [.58,.67,.85], .25],
    ["Kosmische Strukturen", "Galaxie", "Galaxie", "kosmologie-galaxien", "scheibe", [.66,.59,.96], .32],
    ["Kosmische Strukturen", "Galaktische Struktur", "Galaktische Struktur", "galaktische-strukturen", "filament", [.64,.63,.9], .26],
    ["Kosmische Strukturen", "Sektor", "Sektor", "sektoren", "sektor", [.35,.76,.69], .17],
    ["Kosmische Strukturen", "Sternsystem", "Sternsystem", "sternensysteme", "system", [1,.66,.32], .52],
    ["Kosmische Strukturen", "Asteroidengürtel", "Asteroidengürtel", "kosmologie-asteroidenguertel", "guertel", [.68,.47,.32], .14],
    ["Kosmische Strukturen", "Kometengebiet", "Kometengebiet", "kometen", "guertel", [.42,.67,.92], .18]
];

export const objektvorlagen = vorlagen.map(([gruppe, label, typ, route, form, color, emission]) =>
    ({ gruppe, label, typ, route, form, color, emission }));

const katalogRouten = new Set([
    "sterne", "planeten", "zwergplaneten", "monde", "asteroiden", "kometen",
    "schwarze-loecher", "nebel", "galaxien", "sternensysteme"
]);

export async function ladeVorlagenArchiv(route) {
    if (route === "kosmologie-galaxien") route = "galaxien";
    if (!katalogRouten.has(route)) return [];
    return loadCelestialCatalog(route);
}

function relativZuKarte(url) {
    const ziel = new URL(url);
    if (!ziel.href.startsWith(wurzel.href)) throw new Error("Archivziel liegt außerhalb des Projekts.");
    return "../../" + ziel.href.slice(wurzel.href.length);
}

export function objektAusVorlage(vorlage, motiv) {
    const { label, typ, route, form, color, emission } = vorlage;
    const daten = { typ, form, color: [...color], emission };
    if (route) {
        daten.name = motiv?.title ?? label;
        daten.link = relativZuKarte(motiv ? getCelestialDetailUrl(route === "kosmologie-galaxien" ? "galaxien" : route, motiv.slug) : getAporiaRoute(route));
    }
    if (typ === "Asteroidengürtel") daten.radius = 4;
    if (form === "system") daten.systemName = daten.name;
    if (strukturgruppe(route)) daten.systemId = strukturgruppe(route);
    if (motiv?.preview) daten.vorschau = motiv.preview;
    return daten;
}
