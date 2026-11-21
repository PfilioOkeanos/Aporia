// Flora & Fauna – gemeinsamer Datenlader für Katalog und Planeten-Widget.
// Links in die Kataloge liegen im Adapter Menüs/adapter/aporia-planeten.js.
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

export const KATEGORIEN = Object.freeze([
    ["Pflanzen", "❧", "Pflanzen"],
    ["Tiere", "♧", "Tiere"],
    ["Pilze", "♙", "Pilze"],
]);
