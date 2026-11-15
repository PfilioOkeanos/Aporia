import { APORIA, gruppenOption } from "../../adapter/Sternenkarte/Kartendaten/Kartengruppen.js";

export function starteGruppenwahl(container, { auswaehlen, fokussiere }) {
    const struktur = container.querySelector("[data-map-structure]");
    const eintrag = container.querySelector("[data-map-entry]");
    const suche = container.querySelector("[data-map-entry-search]");
    const status = container.querySelector("[data-map-entry-status]");
    let auswahl = "";

    let zustand;

    function aktualisiereEintraege() {
        const { gruppen, objekte, gruppeVon, aktiv } = zustand;
        const koerper = struktur.value === "@sternsysteme"
            ? gruppen.filter(gruppe => gruppe.parent === "@sternsysteme" && !gruppe.sammlung)
                .map(gruppe => ({ id: "system:" + gruppe.id, name: gruppe.name, typ: gruppe.name[0]?.toUpperCase() ?? "Sternsysteme" }))
            : struktur.value === APORIA ? []
                : objekte.filter(objekt => !objekt.systemName && (struktur.value === "@asteroidenguertel" || gruppeVon(objekt) === struktur.value))
                    .map(objekt => ({ id: "objekt:" + objekt.id, name: objekt.name, typ: objekt.typ || "Objekte" }));
        if (struktur.value === "@sternsysteme" && aktiv !== "@sternsysteme") {
            for (const objekt of objekte) {
                if (!objekt.systemName) koerper.push({
                    id: "objekt:" + objekt.id, name: objekt.name, typ: objekt.typ || "Objekte"
                });
            }
        }
        const gesucht = suche.value.trim().toLocaleLowerCase("de");
        const gefiltert = koerper.filter(objekt => objekt.name.toLocaleLowerCase("de").includes(gesucht))
            .sort((a, b) => a.typ.localeCompare(b.typ, "de") || a.name.localeCompare(b.name, "de"));
        suche.hidden = koerper.length <= 60 && !gesucht;
        eintrag.disabled = !koerper.length;
        eintrag.replaceChildren(new Option("Alle in dieser Struktur", ""));
        const gruppiert = new Map();
        const gewuenscht = auswahl.startsWith("objekt:") ? auswahl
            : aktiv !== struktur.value ? "system:" + aktiv : auswahl;
        const angezeigt = gefiltert.slice(0, 60);
        const gewaehlt = koerper.find(objekt => objekt.id === gewuenscht);
        if (gewaehlt && !angezeigt.includes(gewaehlt)) angezeigt.push(gewaehlt);
        for (const objekt of angezeigt) {
            if (!gruppiert.has(objekt.typ)) {
                const gruppe = document.createElement("optgroup");
                gruppe.label = objekt.typ;
                gruppiert.set(objekt.typ, gruppe);
                eintrag.append(gruppe);
            }
            gruppiert.get(objekt.typ).append(new Option(objekt.name, objekt.id));
        }
        eintrag.value = gewaehlt?.id ?? "";
        status.textContent = gefiltert.length > 60 ? "60 von " + gefiltert.length + " Treffern. Suche weiter eingrenzen."
            : gesucht && !gefiltert.length ? "Keine passenden Einträge." : "";
    }

    struktur.addEventListener("change", () => {
        auswahl = "";
        suche.value = "";
        auswaehlen(struktur.value);
    });
    eintrag.addEventListener("change", () => {
        auswahl = eintrag.value;
        if (auswahl.startsWith("system:")) auswaehlen(auswahl.slice(7));
        else if (auswahl.startsWith("objekt:")) fokussiere(auswahl.slice(7));
        else auswaehlen(struktur.value);
    });
    suche.addEventListener("input", aktualisiereEintraege);

    return function aktualisiereGruppenwahl(gruppen, objekte, gruppeVon, aktiv) {
        zustand = { gruppen, objekte, gruppeVon, aktiv };
        const gruppe = gruppen.find(gruppe => gruppe.id === aktiv);
        const strukturId = gruppe?.parent === "@sternsysteme" && !gruppe.sammlung ? "@sternsysteme" : aktiv;
        if (struktur.value !== strukturId) {
            suche.value = "";
            auswahl = "";
        }
        struktur.replaceChildren(...gruppen.filter(gruppe => gruppe.parent !== "@sternsysteme" || gruppe.sammlung).map(gruppenOption));
        struktur.value = strukturId;
        aktualisiereEintraege();
    };
}
