import "../../TopBar/Top_bar.js";
import "../../Side_bar/side_bar.js";
import { getAporiaMedia } from "../../adapter/aporia-media.js";
import { ladeObjekte } from "../../adapter/Sternenkarte/Kartendaten/Kartendaten.js";
import { objektLink } from "../../adapter/Sternenkarte/Verknuepfungen/Verknuepfungen.js";

const id = new URLSearchParams(location.search).get("id");
const status = document.querySelector("[data-object-status]");
try {
    const objekte = await ladeObjekte();
    const objekt = objekte.find(eintrag => eintrag.id === id && eintrag.beschreibung);
    if (!objekt) throw new Error("Dieser Eintrag wurde in der Sternenkarte nicht gefunden.");

    status.hidden = true;
    document.title = objekt.name + " | Aporia";
    document.querySelector("h1").textContent = objekt.name;
    const system = objekte.find(eintrag => eintrag.id === objekt.systemId) ?? (objekt.systemName ? objekt : null);
    const pfad = document.querySelector("[data-system-name]");
    pfad.textContent = " / " + (system?.systemName ?? "Sonnensystem");
    if (system) {
        const karte = document.querySelector("[data-system-map]");
        const ziel = new URL(karte.href);
        ziel.searchParams.set("system", system.id);
        karte.href = ziel.href;
    }
    const objekteImSystem = objekte.filter(eintrag => eintrag.systemId === objekt.id);
    if (objekteImSystem.length) {
        const liste = document.querySelector("[data-system-objects]");
        for (const eintrag of objekteImSystem) {
            const element = document.createElement("li");
            const link = document.createElement("a");
            link.href = objektLink(eintrag.link, eintrag.name);
            link.textContent = eintrag.name + " · " + eintrag.typ;
            element.append(link);
            liste.querySelector("ul").append(element);
        }
        liste.hidden = false;
    }
    const typ = document.querySelector("[data-object-type]");
    const mitte = objekte.find(eintrag => eintrag.id === objekt.bahnUm);
    typ.textContent = mitte ? objekt.typ + " · Umlauf um " + mitte.name : objekt.typ;
    typ.hidden = false;
    const beschreibung = document.querySelector("[data-object-description]");
    beschreibung.textContent = objekt.beschreibung;
    beschreibung.hidden = false;

    if (objekt.radiusKm) {
        const daten = document.querySelector("[data-orbit-data]");
        const zahl = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 3 });
        daten.textContent = "Mittlerer Radius: " + zahl.format(objekt.radiusKm) + " km" +
            (objekt.orbit ? " · Umlaufzeit: " + zahl.format(objekt.orbit.tage) + " Tage" : "");
        daten.hidden = false;
    }

    if (objekt.archivLink) {
        const archiv = document.querySelector("[data-object-archive]");
        archiv.href = objektLink(objekt.archivLink, objekt.name);
        archiv.hidden = false;
    }
    if (objekt.vorschau) {
        const medium = await getAporiaMedia(objekt.vorschau);
        if (medium?.url) {
            const bild = document.querySelector(".system-details img");
            bild.src = medium.url;
            bild.alt = "Archivillustration zu " + objekt.name;
            bild.hidden = false;
        }
    }
} catch (error) {
    status.textContent = error.message;
}
