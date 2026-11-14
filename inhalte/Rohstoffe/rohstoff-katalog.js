import { getAporiaMediaCollection } from "../../Menüs/adapter/aporia-media.js";

export const resourceTopics = [
    ["uebersicht", "Übersicht", "Name, Bild, Rohstoffgruppe, Seltenheit, Hauptverwendung und Erkennungsmerkmale"],
    ["eigenschaften", "Eigenschaften", "Gewicht, Härte, Hitzebeständigkeit, Leitfähigkeit, besondere Effekte und Nutzen für Ausrüstung, Bau und Transport"],
    ["vorkommen", "Vorkommen & Fundorte", "Planeten, Monde, Asteroiden, Biome, Fundtiefe, Spuren, Scansignatur, Erschöpfung und Regeneration"],
    ["gewinnung", "Gewinnung & Verarbeitung", "Werkzeuge, Fahrzeuge, Schutzkleidung, Aufbereitungsanlagen, Verarbeitungsschritte und Verluste"],
    ["nutzung", "Verwendung", "Bauteile, Ausrüstung, Gebäude, Reinheit, Qualität und Ersatzstoffe"],
    ["lagerung", "Transport & Lagerung", "Gewicht, Platzbedarf, Behälter, Kühlung, Abschirmung, Verderb, Verdampfung und Erschütterung"],
    ["gefahren", "Gefahren & Schutz", "Risiken bei Fund, Abbau und Transport, Warnzeichen, Schutz und Vorgehen bei einem Unfall"],
    ["handel", "Handel & Verfügbarkeit", "Käufer, Verkäufer, Knappheit, Preisschwankungen und Erlaubnisse für Handel und Abbau"],
];

export async function loadResources() {
    const groups = [["elemente", "Elemente"], ["raumfahrt", "Raumfahrtmaterialien"]];
    return Promise.all(groups.map(async ([key, label]) => {
        const items = await getAporiaMediaCollection("rohstoffe." + key);
        return [key, label, items.map(item => ({
            ...item,
            id: decodeURIComponent(new URL(item.url).pathname.split("/").pop()),
        }))];
    }));
}
