import { erstelleModellDateiname, istModelldatei, parseModell } from "./3D-Modelle.js";

export async function starteModellimport(sidebar, editor, modellEbene, lokalAktiv) {
    if (!sidebar) return;
    const response = await fetch(new URL("./3D-Modelle.html", import.meta.url));
    if (!response.ok) throw new Error("Importbereich konnte nicht geladen werden.");
    const template = document.createElement("template");
    template.innerHTML = await response.text();
    const panel = template.content.firstElementChild;
    sidebar.prepend(panel);

    const drop = panel.querySelector(".map-model-drop");
    const input = panel.querySelector("[data-model-file]");
    const typ = panel.querySelector("[data-model-type]");
    const status = panel.querySelector("[role=status]");
    input.disabled = !lokalAktiv;
    if (!lokalAktiv) {
        status.textContent = "Starte den lokalen Aporia-Server unter 127.0.0.1:8787, um Modelle zu importieren.";
        return;
    }
    status.textContent = "Lege ein Modell ab. Die Datei wird im lokalen Projekt gespeichert.";

    async function importiere(datei) {
        if (!datei || input.disabled) return;
        if (!istModelldatei(datei.name) || !datei.size || datei.size > 128 * 1024 * 1024) {
            status.textContent = "Wähle eine GLB-, FBX- oder OBJ-Datei bis 128 MiB.";
            input.value = "";
            return;
        }
        input.disabled = true;
        const objekttyp = typ.value.trim() || "3D-Modell";
        status.textContent = "Modell wird importiert …";
        try {
            const renderer = await modellEbene.laden();
            const modell = modellEbene.bereiteVor(await parseModell(datei));
            const dateiname = erstelleModellDateiname(datei.name);
            renderer.vorbereiten(dateiname, modell);
            const ergebnis = editor.fuegeObjektHinzu(dateiname, datei.name.replace(/\.[^.]+$/, ""),
                objekttyp, { dateiname, datei });
            if (!await ergebnis.gespeichert) {
                editor.entferneObjekt(ergebnis.objekt);
                renderer.verwerfeVorbereitung(dateiname);
                throw new Error("Import wurde nicht gespeichert. Sieh im Bearbeitungsmenü nach der Fehlermeldung.");
            }
            status.textContent = datei.name + " als " + objekttyp + " importiert.";
        } catch (error) {
            status.textContent = error.message;
        } finally {
            input.disabled = false;
            input.value = "";
        }
    }

    input.addEventListener("change", () => importiere(input.files[0]));
    drop.addEventListener("dragover", event => {
        event.preventDefault();
        drop.classList.add("is-dragover");
    });
    drop.addEventListener("dragleave", () => drop.classList.remove("is-dragover"));
    drop.addEventListener("drop", event => {
        event.preventDefault();
        drop.classList.remove("is-dragover");
        if (event.dataTransfer.files.length > 1) {
            status.textContent = "Lege jeweils eine Modelldatei ab.";
            return;
        }
        importiere(event.dataTransfer.files[0]);
    });
}
