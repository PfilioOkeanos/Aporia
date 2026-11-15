export function starteMehrfachauswahl(container, sichtbareObjekte) {
    const markiert = new Set();
    const liste = container.querySelector("[data-multi-list]");
    const suche = container.querySelector("[data-multi-search]");
    const status = container.querySelector("[data-multi-status]");
    const summary = container.querySelector("summary");

    function aktualisiere() {
        const sichtbar = new Set(sichtbareObjekte);
        for (const objekt of markiert) if (!sichtbar.has(objekt)) markiert.delete(objekt);
        summary.textContent = markiert.size ? "Mehrfachauswahl (" + markiert.size + ")" : "Mehrfachauswahl";
        if (!container.open) return;
        const gesucht = suche.value.trim().toLocaleLowerCase("de");
        const gefunden = sichtbareObjekte.filter(objekt => objekt.name.toLocaleLowerCase("de").includes(gesucht));
        liste.replaceChildren();
        const gruppen = new Map();
        for (const objekt of gefunden.slice(0, 60)) {
            const typ = objekt.typ || "Objekte";
            if (!gruppen.has(typ)) {
                const feld = document.createElement("fieldset");
                const titel = document.createElement("legend");
                titel.textContent = typ;
                feld.append(titel);
                liste.append(feld);
                gruppen.set(typ, feld);
            }
            const label = document.createElement("label");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = markiert.has(objekt);
            checkbox.addEventListener("change", () => {
                if (checkbox.checked) markiert.add(objekt);
                else markiert.delete(objekt);
                aktualisiereStatus(gefunden.length);
            });
            label.append(checkbox, objekt.name);
            gruppen.get(typ).append(label);
        }
        aktualisiereStatus(gefunden.length);
    }

    function aktualisiereStatus(treffer) {
        summary.textContent = markiert.size ? "Mehrfachauswahl (" + markiert.size + ")" : "Mehrfachauswahl";
        status.textContent = treffer > 60 ? "60 von " + treffer + " Treffern. Suche weiter eingrenzen." : "";
    }

    container.addEventListener("toggle", aktualisiere);
    suche.addEventListener("input", aktualisiere);
    function leere() {
        markiert.clear();
        aktualisiere();
    }
    container.querySelector("[data-multi-clear]").addEventListener("click", leere);

    return {
        aktualisiere,
        leere,
        enthaelt: objekt => markiert.has(objekt),
        objekteFuer: objekt => markiert.has(objekt) ? [...markiert] : [objekt],
        markiere(objekte) {
            for (const objekt of objekte) markiert.add(objekt);
            aktualisiere();
        }
    };
}
