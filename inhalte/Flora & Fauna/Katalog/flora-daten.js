// Flora & Fauna – gemeinsamer Datenlader für Katalog und Planeten-Widget.
// Daten: ../daten/flora-fauna.json · Einträge verweisen mit "planeten" auf Planetendossiers (Ordnername).
const DATEN_URL = new URL("../daten/flora-fauna.json", import.meta.url);
const PROJEKT = new URL("../../../", import.meta.url);
let laden;

/** Alle Arten (mit aufgelöster Bild-URL). */
export function ladeArten() {
    laden ??= fetch(DATEN_URL)
        .then((antwort) => { if (!antwort.ok) throw new Error("HTTP " + antwort.status); return antwort.json(); })
        .then((daten) => (daten.eintraege ?? []).map((art) => ({
            ...art,
            bildUrl: art.bild?.datei ? new URL(art.bild.datei.split("/").map(encodeURIComponent).join("/"), PROJEKT).href : null,
        })));
    return laden;
}

/** Link in den Katalog, optional gefiltert (planet, kategorie, art). */
export function katalogUrl(filter = {}) {
    const url = new URL("./katalog.html", import.meta.url);
    for (const [schluessel, wert] of Object.entries(filter)) if (wert) url.searchParams.set(schluessel, wert);
    return url.href;
}

export const KATEGORIEN = Object.freeze([
    ["Pflanzen", "❧", "Pflanzen"],
    ["Tiere", "♧", "Tiere"],
    ["Pilze", "♙", "Pilze"],
]);
