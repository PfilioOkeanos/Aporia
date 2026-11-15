import { positionVon } from "../Sternsysteme/Bahnphysik.js";

const dot = (a, b) => a.reduce((sum, value, i) => sum + value * b[i], 0);
const fovScale = 2.414;

export function kugelAmZeiger(objekte, stand, rect, x, y) {
    const localX = (2 * (x - rect.left) - rect.width) / (fovScale * rect.height);
    const localY = (rect.height - 2 * (y - rect.top)) / (fovScale * rect.height);
    const ray = stand.back.map((value, i) => stand.right[i] * localX + stand.up[i] * localY - value);
    const norm = Math.hypot(...ray);
    const direction = ray.map(value => value / norm);
    const mindestDistanz = stand.near / -dot(direction, stand.back);
    let treffer = null;
    let distanz = Infinity;

    for (const objekt of objekte) {
        const delta = positionVon(objekt).map((value, i) => value - stand.eye[i]);
        const projection = dot(delta, direction);
        const quer = delta.map((wert, achse) => wert - projection * direction[achse]);
        const discriminant = objekt.radius ** 2 - dot(quer, quer);
        if (discriminant < 0) continue;
        const root = Math.sqrt(discriminant);
        const hit = projection - root > mindestDistanz ? projection - root : projection + root;
        if (hit > mindestDistanz && hit < distanz) {
            distanz = hit;
            treffer = objekt;
        }
    }
    return treffer;
}

export function objekteImRahmen(objekte, stand, rect, start, ende) {
    const [links, rechts] = [start[0], ende[0]].sort((a, b) => a - b);
    const [oben, unten] = [start[1], ende[1]].sort((a, b) => a - b);
    return objekte.filter(objekt => {
        const delta = positionVon(objekt).map((wert, achse) => wert - stand.eye[achse]);
        const tiefe = -dot(delta, stand.back);
        if (tiefe <= stand.near) return false;
        const faktor = fovScale * rect.height * .5 / tiefe;
        const x = rect.left + rect.width * .5 + dot(delta, stand.right) * faktor;
        const y = rect.top + rect.height * .5 - dot(delta, stand.up) * faktor;
        return x >= links && x <= rechts && y >= oben && y <= unten;
    });
}

export function starteObjektbewegung(canvas, editor, kamerastand) {
    const rahmen = document.createElement("div");
    rahmen.className = "map-selection-rectangle";
    rahmen.hidden = true;
    rahmen.setAttribute("aria-hidden", "true");
    canvas.parentElement.append(rahmen);
    let drag;
    let leererKlick;

    function rahmenZeichnen(event) {
        const { start, rect } = drag;
        const x = Math.max(rect.left, Math.min(rect.right, event.clientX));
        const y = Math.max(rect.top, Math.min(rect.bottom, event.clientY));
        rahmen.style.left = canvas.offsetLeft + Math.min(x, start[0]) - rect.left + "px";
        rahmen.style.top = canvas.offsetTop + Math.min(y, start[1]) - rect.top + "px";
        rahmen.style.width = Math.abs(x - start[0]) + "px";
        rahmen.style.height = Math.abs(y - start[1]) + "px";
    }

    function objektAnKlickposition(event) {
        const stand = kamerastand();
        const rect = canvas.getBoundingClientRect();
        return stand && rect.height
            ? kugelAmZeiger(editor.objekte, stand, rect, event.clientX, event.clientY)
            : undefined;
    }

    canvas.addEventListener("pointerdown", event => {
        leererKlick = null;
        if (event.button === 0 && !event.ctrlKey && !event.shiftKey && !event.altKey &&
            !event.metaKey && !drag && objektAnKlickposition(event) === null) {
            leererKlick = { id: event.pointerId, x: event.clientX, y: event.clientY };
        }
        if (event.button !== 0 || (!event.ctrlKey && !event.shiftKey) || drag) return;
        event.stopImmediatePropagation();
        event.preventDefault();
        const stand = kamerastand();
        const rect = canvas.getBoundingClientRect();
        if (!stand || !rect.height) return;
        const start = [event.clientX, event.clientY];
        const objekt = kugelAmZeiger(editor.objekte, stand, rect, ...start);
        if (event.shiftKey) {
            drag = { id: event.pointerId, start, stand, rect, rahmen: true };
            rahmen.hidden = false;
            rahmenZeichnen(event);
        } else {
            editor.waehle(objekt);
            if (!objekt) return;
            const tiefe = -dot(positionVon(objekt).map((value, i) => value - stand.eye[i]), stand.back);
            drag = {
                id: event.pointerId, start, stand,
                bewegen: editor.bewegungsObjekte(objekt).map(eintrag => ({ objekt: eintrag, position: [...eintrag.position] })),
                scale: 2 * Math.max(tiefe, stand.near) / (fovScale * rect.height)
            };
        }
        canvas.focus({ preventScroll: true });
        canvas.setPointerCapture(event.pointerId);
    }, true);

    function istKlick(event) {
        return Math.hypot(event.clientX - leererKlick.x, event.clientY - leererKlick.y) < 4;
    }

    canvas.addEventListener("pointermove", event => {
        if (leererKlick?.id === event.pointerId && !istKlick(event)) leererKlick = null;
        if (drag?.id !== event.pointerId) return;
        if (drag.rahmen) {
            rahmenZeichnen(event);
            return;
        }
        const dx = (event.clientX - drag.start[0]) * drag.scale;
        const dy = (drag.start[1] - event.clientY) * drag.scale;
        const delta = drag.stand.right.map((wert, achse) => dx * wert + dy * drag.stand.up[achse]);
        for (const { objekt, position } of drag.bewegen) {
            objekt.position = position.map((wert, achse) => wert + delta[achse]);
        }
        editor.aktualisiereFelder();
    });

    function ende(event) {
        if (leererKlick?.id === event.pointerId) {
            const leer = event.type === "pointerup" && istKlick(event) && objektAnKlickposition(event) === null;
            leererKlick = null;
            if (leer) editor.abwaehlen();
        }
        if (drag?.id !== event.pointerId) return;
        const aktion = drag;
        drag = null;
        if (aktion.rahmen) {
            rahmen.hidden = true;
            if (event.type !== "pointerup") return;
            const { rect, stand, start } = aktion;
            const endpunkt = [Math.max(rect.left, Math.min(rect.right, event.clientX)),
                Math.max(rect.top, Math.min(rect.bottom, event.clientY))];
            const kurz = Math.hypot(endpunkt[0] - start[0], endpunkt[1] - start[1]) < 4;
            const getroffen = kurz ? [kugelAmZeiger(editor.objekte, stand, rect, ...endpunkt)].filter(Boolean)
                : objekteImRahmen(editor.objekte, stand, rect, start, endpunkt);
            editor.markiere(getroffen);
        } else if (event.type !== "pointerup") {
            for (const { objekt, position } of aktion.bewegen) objekt.position = position;
            editor.aktualisiereFelder();
        } else if (aktion.bewegen.some(({ objekt, position }) => objekt.position.some((wert, i) => wert !== position[i]))) {
            if (editor.pruefeVerschobeneBahnen(aktion.bewegen)) editor.speichere();
            else for (const { objekt, position } of aktion.bewegen) objekt.position = position;
            editor.aktualisiereFelder();
        }
    }
    for (const type of ["pointerup", "pointercancel", "lostpointercapture"]) canvas.addEventListener(type, ende);
}
