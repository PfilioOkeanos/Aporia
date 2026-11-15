export const PLATZHALTERLINK = "./Objektdetails/Objektdetails.html";
const karte = new URL("../../../Sternenkarte/Sternenkarte.html", import.meta.url);

export function objektLink(pfad, name) {
    const ziel = new URL(pfad || PLATZHALTERLINK, karte);
    const platzhalter = new URL(PLATZHALTERLINK, karte);
    const lokalerTest = karte.protocol === "file:" && ziel.protocol === "file:" && !/^[a-z][a-z0-9+.-]*:/i.test(pfad ?? "");
    if (!["http:", "https:"].includes(ziel.protocol) && !lokalerTest) {
        throw new Error("Verwende einen relativen Seitenpfad oder eine HTTP(S)-Adresse.");
    }
    if (ziel.origin === platzhalter.origin && ziel.pathname === platzhalter.pathname) {
        ziel.searchParams.set("objekt", name);
    }
    return ziel.href;
}
