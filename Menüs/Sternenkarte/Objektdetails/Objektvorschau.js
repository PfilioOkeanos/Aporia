import { getAporiaMedia } from "../../adapter/aporia-media.js";
import { kartenobjektLink } from "../../adapter/Sternenkarte/Verknuepfungen/Verknuepfungen.js";
import { kugelAmZeiger } from "../Szene/Objektbewegung.js";

export function starteObjektvorschau(canvas, labels, panel, objekte, kamera, merkeDossier = () => {}) {
    const titel = panel.querySelector("h2");
    const typ = panel.querySelector("[data-preview-type]");
    const beschreibung = panel.querySelector("[data-preview-description]");
    const bild = panel.querySelector("img");
    const link = panel.querySelector("a");
    let position;
    let beschriftung;
    let fokus;
    let klick;
    let aktuell;
    let version = 0;

    function zeige(objekt) {
        if (!objekt || objekt === aktuell) return;
        aktuell = objekt;
        const anfrage = ++version;
        titel.textContent = objekt.name;
        typ.textContent = objekt.typ || "";
        typ.hidden = !objekt.typ;
        beschreibung.textContent = objekt.beschreibung || "";
        beschreibung.hidden = !objekt.archivLink || !objekt.beschreibung;
        link.href = kartenobjektLink(objekt);
        link.hidden = Boolean(objekt.archivLink);
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
        if (klick?.id === event.pointerId && !kurzerKlick(event)) klick = null;
    });
    canvas.addEventListener("pointerleave", () => { position = null; });
    const ohneModifikator = event => !event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey;
    const kurzerKlick = event => Math.hypot(event.clientX - klick.x, event.clientY - klick.y) < 4;
    function objektAnPosition(stand, x, y) {
        const rect = canvas.getBoundingClientRect();
        return rect.height ? kugelAmZeiger(objekte, stand, rect, x, y) : null;
    }
    canvas.addEventListener("pointerdown", event => {
        position = null;
        klick = null;
        if (event.button !== 0 || !ohneModifikator(event)) return;
        const objekt = objektAnPosition(kamera.stand(), event.clientX, event.clientY);
        if (objekt?.archivLink) {
            klick = { id: event.pointerId, x: event.clientX, y: event.clientY, objekt };
        }
    }, true);
    canvas.addEventListener("pointerup", event => {
        if (klick?.id !== event.pointerId) return;
        const objekt = klick.objekt;
        const oeffnen = ohneModifikator(event) && kurzerKlick(event) &&
            objektAnPosition(kamera.stand(), event.clientX, event.clientY) === objekt;
        klick = null;
        if (oeffnen) {
            merkeDossier(objekt);
            window.location.assign(kartenobjektLink(objekt));
        }
    });
    for (const type of ["pointercancel", "lostpointercapture"]) {
        canvas.addEventListener(type, event => { if (klick?.id === event.pointerId) klick = null; });
    }
    function zeigeBeschriftung(event) {
        const id = event.target.closest("a[data-id]")?.dataset.id;
        zeige(objekte.find(objekt => objekt.id === id));
    }
    labels.addEventListener("pointerover", event => {
        beschriftung = event.target.closest("a[data-id]");
        zeigeBeschriftung(event);
    });
    labels.addEventListener("pointerout", event => {
        if (beschriftung && !beschriftung.contains(event.relatedTarget)) beschriftung = null;
    });
    labels.addEventListener("focusin", event => {
        const label = event.target.closest("a[data-id]");
        fokus = label?.matches(":focus-visible") &&
            objekte.some(objekt => objekt.id === label.dataset.id && objekt.archivLink) ? label : null;
        zeigeBeschriftung(event);
    });
    labels.addEventListener("focusout", event => { if (fokus === event.target) fokus = null; });
    function verberge() {
        aktuell = null;
        version++;
        panel.hidden = true;
    }
    function leere() {
        position = null;
        beschriftung = null;
        fokus = null;
        verberge();
    }
    panel.querySelector("button").addEventListener("click", leere);

    function objektUnterZeiger(stand) {
        const label = beschriftung?.isConnected ? beschriftung : !position && fokus;
        if (label?.isConnected) return objekte.find(objekt => objekt.id === label.dataset.id);
        if (!position) return null;
        return objektAnPosition(stand, ...position);
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

    return {
        aktualisiere(stand) {
            const objekt = objektUnterZeiger(stand);
            if (objekt) zeige(objekt);
            else if (aktuell?.archivLink) verberge();
        },
        leere,
        zeige
    };
}
