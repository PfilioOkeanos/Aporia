/* APORIA – Planeten-Zuordnung für Kataloge (Flora & Fauna, Rohstoffe)
   Einträge verweisen mit dem Ordnernamen des Planetendossiers auf ihren Planeten,
   z. B. "erde-im-sternenmeer" → inhalte/himmelskoerper/planeten/details/erde-im-sternenmeer/.
   Name und Dossier-Link kommen aus dem vorhandenen Himmelskörper-Adapter (Bildarchiv + Sternenkarte). */
import { getAporiaRoute } from "./aporia-routes.js";
import { loadCelestialCatalog } from "./aporia-celestial.js";

// Kurznamen, wo der Archivtitel ein Bildtitel ist
const kurznamen = Object.freeze({
    "erde-im-sternenmeer": "Erde",
});

export function getPlanetDossierUrl(planet) {
    return new URL("details/" + encodeURIComponent(planet) + "/hauptseite/index.html", getAporiaRoute("planeten")).href;
}

let verzeichnis;
async function ladeVerzeichnis() {
    const karten = await loadCelestialCatalog("planeten").catch(() => []);
    const map = new Map();
    for (const karte of karten) {
        const ordner = decodeURIComponent(new URL(karte.href).pathname).match(/\/details\/([^/]+)\/hauptseite\//)?.[1];
        if (ordner && !map.has(ordner)) map.set(ordner, karte.title);
    }
    return map;
}

/** Liefert { slug, name, href } für einen Planeten-Ordnernamen. */
export async function getPlanetInfo(planet) {
    verzeichnis ??= ladeVerzeichnis();
    const namen = await verzeichnis;
    return { slug: planet, name: kurznamen[planet] ?? namen.get(planet) ?? planet, href: getPlanetDossierUrl(planet) };
}

/** Liefert die Infos zu mehreren Planeten in derselben Reihenfolge. */
export function getPlanetInfos(planeten) {
    return Promise.all([...new Set(planeten)].map(getPlanetInfo));
}
