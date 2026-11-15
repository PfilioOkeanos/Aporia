import { objektLink, PLATZHALTERLINK } from "../Verknuepfungen/Verknuepfungen.js";

import { istModelldatei } from "../3D-Modelle/3D-Modelle.js";

const datei = new URL("./objekte.json", import.meta.url);

export function leseObjekte(text) {
    const objekte = JSON.parse(text);
    const vektor = wert => Array.isArray(wert) && wert.length === 3 && wert.every(Number.isFinite);
    const farbe = wert => vektor(wert) && wert.every(kanal => kanal >= 0 && kanal <= 1);
    if (!Array.isArray(objekte) || objekte.some(objekt =>
        !objekt || typeof objekt.id !== "string" || !objekt.id.trim() ||
        !vektor(objekt.position) || !farbe(objekt.color) ||
        (objekt.emissionsfarbe != null && !farbe(objekt.emissionsfarbe)) ||
        (objekt.emission != null && (!Number.isFinite(objekt.emission) || objekt.emission < 0 || objekt.emission > 5)) ||
        !Number.isFinite(objekt.radius) || objekt.radius <= 0 ||
        (objekt.modell != null && !istModelldatei(objekt.modell))
    ) || new Set(objekte.map(({ id }) => id)).size !== objekte.length) {
        throw new Error("Ungültige Kartendatei.");
    }
    return objekte.map(objekt => {
        const name = typeof objekt.name === "string" ? objekt.name.trim() || objekt.id : objekt.id;
        const link = typeof objekt.link === "string" ? objekt.link.trim() || PLATZHALTERLINK : PLATZHALTERLINK;
        objektLink(link, name);
        const typ = typeof objekt.typ === "string" ? objekt.typ.trim() : "";
        return { ...objekt, name, link, typ };
    });
}

export async function ladeObjekte() {
    const response = await fetch(datei, { cache: "no-store" });
    if (!response.ok) throw new Error("Kartendatei konnte nicht geladen werden.");
    return leseObjekte(await response.text());
}

export function alsJSON(objekte) {
    return JSON.stringify(objekte, null, 2) + "\n";
}
