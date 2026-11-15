import { getAporiaRoute } from "./aporia-routes.js";

const detailordner = new Set(["asteroiden","kometen","monde","nebel","planeten","schwarze-loecher","sterne","sternensysteme","zwergplaneten","galaxien"]);
const doppelteNamen = new Set([
    "ex-lupi-im-akkretionsausbruch-4aa29ddf7d",
    "ex-lupi-im-akkretionsausbruch-3315add093",
    "gezeitenverformter-stern-nahe-einem-schwarzen-loch-9a3f124f14",
    "gezeitenverformter-stern-nahe-einem-schwarzen-loch-06049c5004",
    "herbig-ae-stern-mit-staubscheibe-und-nebel-a3b7b92ed7",
    "herbig-ae-stern-mit-staubscheibe-und-nebel-962cb3774a",
    "herbig-be-stern-im-leuchtenden-gasnebel-98a135edcf",
    "herbig-be-stern-im-leuchtenden-gasnebel-4eb54afd9b",
    "junger-klasse-iii-stern-mit-staubspuren-ee45f3db86",
    "junger-klasse-iii-stern-mit-staubspuren-c1faf4abec",
    "junger-stern-im-ubergang-bb392ee0da",
    "junger-stern-im-ubergang-11af05a3d5",
    "junger-stern-mit-geneigter-staubscheibe-30b7f54a8c",
    "junger-stern-mit-geneigter-staubscheibe-bd2c88b4bf",
    "junger-t-tauri-stern-mit-leuchtender-scheibe-acff1bfdc4",
    "junger-t-tauri-stern-mit-leuchtender-scheibe-5e01583032",
    "junger-t-tauri-stern-mit-sparlichem-staub-deef90cb4b",
    "junger-t-tauri-stern-mit-sparlichem-staub-23f674679f",
    "leuchtender-helium-weier-zwerg-503c8157a7",
    "leuchtender-helium-weier-zwerg-dee5c5d02c",
    "leuchtender-kern-einer-sternentstehungswolke-58b0a9d2c5",
    "leuchtender-kern-einer-sternentstehungswolke-190174787c"
]);

export function getCelestialDetailUrl(category, slug) {
    const ordner = doppelteNamen.has(slug) ? slug : slug.replace(/-[0-9a-f]{10,12}$/i, "");
    const detail = detailordner.has(category)
        ? encodeURIComponent(ordner) + "/hauptseite/index.html"
        : encodeURIComponent(slug) + ".html";
    return new URL("details/" + detail, getAporiaRoute(category)).href;
}

export async function loadCelestialCatalog(category) {
    const response = await fetch(new URL("bildarchiv.json", getAporiaRoute(category)));
    if (!response.ok) throw new Error("Bildarchiv: HTTP " + response.status);
    return response.json();
}
