import { positionVon } from "../Sternsysteme/Bahnphysik.js";

const START = { yaw: 0.35, pitch: 0.90, distance: 100, target: [0, 0, 0] };
const RESET_KEY = "aporia.sternenkarte.kamera-reset";
// Keep camera positions within the range of WebGL float uniforms.
const MIN_DISTANCE = 0.8;
const NAHGRENZE = 1e-7;
const BILDFUELLUNG = 0.78;
const MAX_DISTANCE = 1e30;
const KEYS = new Set(["KeyW", "KeyA", "KeyS", "KeyD", "KeyQ", "KeyE"]);
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function kamerabasis(yaw, pitch) {
    const sinY = Math.sin(yaw), cosY = Math.cos(yaw);
    const sinP = Math.sin(pitch), cosP = Math.cos(pitch);
    return {
        right: [cosY, 0, -sinY],
        up: [-sinY * sinP, cosP, -cosY * sinP],
        back: [sinY * cosP, sinP, cosY * cosP]
    };
}

function ladeRuecksetzpunkt(schluessel) {
    try {
        const stand = JSON.parse(window.localStorage.getItem(schluessel));
        if (stand && Array.isArray(stand.target) && stand.target.length === 3 &&
            [...stand.target, stand.yaw, stand.pitch, stand.distance].every(Number.isFinite) &&
            Math.abs(stand.pitch) <= 1.5 && stand.distance > NAHGRENZE && stand.distance <= MAX_DISTANCE) {
            return stand;
        }
    } catch {
        // A browser can disable access to local storage.
    }
    return null;
}

export function erzeugeKamera(canvas, reset) {
    let { yaw, pitch, distance } = START;
    const target = [...START.target];
    let gruppenStart = START;
    let schluessel = RESET_KEY;
    let ruecksetzpunkt = ladeRuecksetzpunkt(schluessel);
    const keys = new Set();
    let drag = null;
    let anflug = null;
    let fokusObjekt = null;

    function bildabstand(radius) {
        const breite = Math.max(1, canvas.clientWidth);
        const hoehe = Math.max(1, canvas.clientHeight);
        const kurzseite = Math.min(1, breite / hoehe);
        // Project the sphere's tangent silhouette, rather than a flat disc through its center.
        const abstand = radius * Math.hypot(1, 2.414 / (BILDFUELLUNG * kurzseite));
        return Math.max(abstand, radius + NAHGRENZE * 1.1);
    }

    canvas.addEventListener("pointerdown", event => {
        anflug = null;
        if (event.ctrlKey) fokusObjekt = null;
    }, true);
    canvas.addEventListener("pointerdown", event => {
        const verschieben = event.button === 1 && event.shiftKey;
        if ((!verschieben && event.button !== 0) || drag) return;
        if (verschieben) {
            event.preventDefault();
            fokusObjekt = null;
        }
        canvas.focus({ preventScroll: true });
        canvas.setPointerCapture(event.pointerId);
        drag = { id: event.pointerId, x: event.clientX, y: event.clientY, verschieben };
        canvas.classList.add("is-dragging");
    });

    canvas.addEventListener("pointermove", event => {
        if (drag?.id !== event.pointerId) return;
        const dx = event.clientX - drag.x;
        const dy = event.clientY - drag.y;
        if (drag.verschieben) {
            const { right, up } = kamerabasis(yaw, pitch);
            const einheitenProPixel = 2 * distance / (2.414 * Math.max(1, canvas.clientHeight));
            for (let achse = 0; achse < 3; achse++) {
                target[achse] += (-dx * right[achse] + dy * up[achse]) * einheitenProPixel;
            }
        } else {
            yaw -= dx * 0.006;
            pitch = clamp(pitch + dy * 0.006, -1.5, 1.5);
        }
        drag.x = event.clientX;
        drag.y = event.clientY;
    });

    function endDrag(event) {
        if (drag?.id !== event.pointerId) return;
        drag = null;
        canvas.classList.remove("is-dragging");
    }

    for (const type of ["pointerup", "pointercancel", "lostpointercapture"]) {
        canvas.addEventListener(type, endDrag);
    }

    // Zoom in Log-Schritten, begrenzt auf den erlaubten Abstand (Mausrad und Zwei-Finger-Geste)
    function zoome(logSchritt) {
        anflug = null;
        const minimum = fokusObjekt ? bildabstand(fokusObjekt.radius) : MIN_DISTANCE;
        distance = Math.exp(clamp(Math.log(distance) + logSchritt,
            Math.log(minimum), Math.log(Math.max(MAX_DISTANCE, minimum))));
    }

    canvas.addEventListener("wheel", event => {
        event.preventDefault();
        const multiplier = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? canvas.clientHeight : 1;
        zoome(event.deltaY * multiplier * 0.0014);
    }, { passive: false });

    // Handy/Tablet: zwei Finger auseinanderziehen = hineinzoomen, zusammenführen = herauszoomen
    const finger = new Map();
    let pinchAbstand = 0;
    const fingerAbstand = () => {
        const [a, b] = [...finger.values()];
        return Math.hypot(a.x - b.x, a.y - b.y);
    };
    canvas.addEventListener("pointerdown", event => {
        if (event.pointerType !== "touch") return;
        finger.set(event.pointerId, { x: event.clientX, y: event.clientY });
        if (finger.size === 2) {
            pinchAbstand = fingerAbstand();
            // Drehen mit dem ersten Finger beenden, solange gezoomt wird
            drag = null;
            canvas.classList.remove("is-dragging");
            event.stopImmediatePropagation();
        }
    }, true);
    canvas.addEventListener("pointermove", event => {
        if (!finger.has(event.pointerId)) return;
        finger.set(event.pointerId, { x: event.clientX, y: event.clientY });
        if (finger.size !== 2) return;
        const neu = fingerAbstand();
        if (pinchAbstand > 0 && neu > 0) zoome(Math.log(pinchAbstand / neu));
        pinchAbstand = neu;
    });
    for (const type of ["pointerup", "pointercancel"]) {
        canvas.addEventListener(type, event => {
            if (!finger.delete(event.pointerId)) return;
            pinchAbstand = finger.size === 2 ? fingerAbstand() : 0;
        });
    }

    canvas.addEventListener("keydown", event => {
        if (!KEYS.has(event.code) || event.ctrlKey || event.metaKey || event.altKey) return;
        event.preventDefault();
        anflug = null;
        fokusObjekt = null;
        keys.add(event.code);
    });
    window.addEventListener("keyup", event => keys.delete(event.code));
    canvas.addEventListener("blur", () => keys.clear());
    window.addEventListener("blur", () => keys.clear());

    function setzeAnsicht(stand) {
        anflug = null;
        fokusObjekt = null;
        ({ yaw, pitch, distance } = stand);
        target.splice(0, target.length, ...stand.target);
        keys.clear();
        canvas.focus({ preventScroll: true });
    }

    reset.addEventListener("click", () => {
        setzeAnsicht(ruecksetzpunkt ?? gruppenStart);
    });

    function fliegeZumObjekt(objekt) {
        const { eye, back } = kamerastand();
        const mitte = [...positionVon(objekt)];
        const richtung = eye.map((wert, achse) => wert - mitte[achse]);
        const entfernung = Math.hypot(...richtung);
        const [x, y, z] = entfernung > 1e-6 ? richtung : back;
        const zielPitch = clamp(Math.atan2(y, Math.hypot(x, z)), -1.5, 1.5);
        const drehung = Math.atan2(x, z) - yaw;
        const zielYaw = yaw + Math.atan2(Math.sin(drehung), Math.cos(drehung));
        const zielAbstand = bildabstand(objekt.radius);
        fokusObjekt = null;
        const zielBack = kamerabasis(zielYaw, zielPitch).back;
        const zielAuge = mitte.map((wert, achse) => wert + zielBack[achse] * zielAbstand);
        anflug = {
            zeit: 0, objekt, eye, zielAuge, yaw, pitch, distance, zielYaw, zielPitch, zielAbstand
        };
        keys.clear();
        canvas.focus({ preventScroll: true });
    }

    function bewegeAnflug(seconds) {
        anflug.zeit += seconds;
        const fortschritt = Math.min(anflug.zeit / .65, 1);
        const t = fortschritt * fortschritt * (3 - 2 * fortschritt);
        const misch = (start, ende) => start * (1 - t) + ende * t;
        yaw = misch(anflug.yaw, anflug.zielYaw);
        pitch = misch(anflug.pitch, anflug.zielPitch);
        distance = misch(anflug.distance, anflug.zielAbstand);
        const { back } = kamerabasis(yaw, pitch);
        for (let achse = 0; achse < 3; achse++) {
            const eye = misch(anflug.eye[achse], anflug.zielAuge[achse]);
            target[achse] = eye - back[achse] * distance;
        }
        if (fortschritt === 1) {
            fokusObjekt = anflug.objekt;
            anflug = null;
        }
    }

    function kamerastand(seconds = 0) {
        if (anflug && seconds > 0) bewegeAnflug(seconds);
        if (fokusObjekt) {
            distance = Math.max(distance, bildabstand(fokusObjekt.radius));
            target.splice(0, target.length, ...positionVon(fokusObjekt));
        }
        const { right, up, back } = kamerabasis(yaw, pitch);
        const lateral = Number(keys.has("KeyD")) - Number(keys.has("KeyA"));
        const vertical = Number(keys.has("KeyE")) - Number(keys.has("KeyQ"));
        const forward = Number(keys.has("KeyW")) - Number(keys.has("KeyS"));
        const speed = clamp(distance * 0.5, 1e-6, Math.max(32, distance * .18)) * seconds /
            Math.max(1, Math.hypot(lateral, vertical, forward));

        for (let axis = 0; axis < 3; axis++) {
            const rise = axis === 1 ? vertical : 0;
            target[axis] += (right[axis] * lateral + rise - back[axis] * forward) * speed;
        }

        return {
            right, up, back,
            near: Math.max(NAHGRENZE, distance * 0.001),
            eye: target.map((value, axis) => value + back[axis] * distance)
        };
    }

    function setzeRuecksetzpunkt(stand) {
        ruecksetzpunkt = stand;
        try {
            if (stand) window.localStorage.setItem(schluessel, JSON.stringify(stand));
            else window.localStorage.removeItem(schluessel);
            return true;
        } catch {
            return false;
        }
    }

    return {
        stand: kamerastand,
        ansicht: () => ({ yaw, pitch, distance, target: [...target], fokusId: fokusObjekt?.id }),
        stelleAnsichtWiederHer(ansicht, objekt) {
            setzeAnsicht(ansicht);
            fokusObjekt = objekt ?? null;
        },
        fliegeZumObjekt,
        fokussiereGruppe(punkt, abstand, id, revision) {
            // Hochformat (Handy): der Ausschnitt ist schmaler als hoch → weiter weg, damit die ganze Gruppe ins Bild passt
            const hochformat = Math.max(1, canvas.clientHeight / Math.max(1, canvas.clientWidth));
            gruppenStart = { ...START, target: punkt, distance: abstand * Math.min(hochformat, 2.4) };
            schluessel = id === "Kugel 1" ? RESET_KEY : RESET_KEY + "." + id + (revision ? "." + revision : "");
            ruecksetzpunkt = ladeRuecksetzpunkt(schluessel);
            setzeAnsicht(gruppenStart);
        },
        fokussiere: (punkt, abstand = START.distance) => setzeAnsicht({ ...START, target: punkt, distance: abstand }),
        speichereRuecksetzpunkt: () => setzeRuecksetzpunkt({ yaw, pitch, distance, target: [...target] }),
        entferneRuecksetzpunkt: () => setzeRuecksetzpunkt(null)
    };
}
