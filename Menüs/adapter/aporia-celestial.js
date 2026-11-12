import { getAporiaRoute } from "./aporia-routes.js";

export function getCelestialDetailUrl(category, slug) {
    return new URL("details/" + encodeURIComponent(slug) + ".html", getAporiaRoute(category)).href;
}

export async function loadCelestialCatalog(category) {
    const response = await fetch(new URL("bildarchiv.json", getAporiaRoute(category)));
    if (!response.ok) throw new Error("Bildarchiv: HTTP " + response.status);
    return response.json();
}
