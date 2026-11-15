import { getAporiaMedia } from "../../adapter/aporia-media.js";
import { objektLink } from "../../adapter/Sternenkarte/Verknuepfungen/Verknuepfungen.js";
import { kugelAmZeiger } from "../Szene/Objektbewegung.js";

export function starteObjektvorschau(canvas, labels, panel, objekte, kamera) {
    const titel = panel.querySelector("h2");
    const typ = panel.querySelector("[data-preview-type]");
    const bild = panel.querySelector("img");
    const link = panel.querySelector("a");
    let position;
    let beschriftung;
    let aktuell;
    let version = 0;

    function zeige(objekt) {
        if (!objekt || objekt === aktuell) return;
        aktuell = objekt;
        const anfrage = ++version;
        titel.textContent = objekt.name;
        typ.textContent = objekt.typ || "";
        typ.hidden = !objekt.typ;
        link.href = objektLink(objekt.link, objekt.name);
        bild.hidden = true;
        bild.removeAttribute("src");
        panel.hidden = false;

        if (!objekt.vorschau) return;
        getAporiaMedia(objekt.vorschau).then(medium => {
            if (anfrage !== version || !medium?.url) return;
            bild.src = medium.url;
            bild.hidden = false;
        });
    }

    canvas.addEventListener("pointermove", event => {
        position = event.buttons === 0 ? [event.clientX, event.clientY] : null;
    });
    canvas.addEventListener("pointerleave", () => { position = null; });
    canvas.addEventListener("pointerdown", () => { position = null; }, true);
    function zeigeBeschriftung(event) {
        const id = event.target.closest("a[data-id]")?.dataset.id;
        zeige(objekte.find(objekt => objekt.id === id));
    }
    labels.addEventListener("pointerover", event => {
        beschriftung = event.target.closest("a[data-id]");
        zeigeBeschriftung(event);
    });
    labels.addEventListener("pointerout", event => {
        if (event.target === beschriftung && !beschriftung.contains(event.relatedTarget)) beschriftung = null;
    });
    labels.addEventListener("focusin", zeigeBeschriftung);
    function leere() {
        aktuell = null;
        position = null;
        beschriftung = null;
        version++;
        panel.hidden = true;
    }
    panel.querySelector("button").addEventListener("click", leere);

    function objektUnterZeiger(stand) {
        if (beschriftung?.isConnected) return objekte.find(objekt => objekt.id === beschriftung.dataset.id);
        if (!position) return null;
        const rect = canvas.getBoundingClientRect();
        return rect.height ? kugelAmZeiger(objekte, stand, rect, ...position) : null;
    }

    window.addEventListener("keydown", event => {
        const zirkumflex = event.key === "^" || (event.key === "Dead" && event.code === "Backquote");
        if (!zirkumflex || event.ctrlKey || event.metaKey || event.altKey || event.isComposing ||
            event.target?.closest?.("input, textarea, select, [contenteditable]")) return;
        const objekt = objektUnterZeiger(kamera.stand());
        if (!objekt) return;
        event.preventDefault();
        if (!event.repeat) kamera.fliegeZumObjekt(objekt);
    });

    return { aktualisiere: stand => zeige(objektUnterZeiger(stand)), leere, zeige };
}
