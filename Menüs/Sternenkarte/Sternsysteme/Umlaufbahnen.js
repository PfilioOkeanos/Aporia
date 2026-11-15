import { bahnzentrum, positionVon } from "./Bahnphysik.js";
import { istAsteroidenguertel } from "../../adapter/Sternenkarte/Kartendaten/Kartengruppen.js";
import { markerringe, objektform } from "../Szene/Objektformen.js";

const ringBahnen = new WeakMap();
const bahnfarbe = [0.43, 0.62, 0.83];
const mondbahnfarbe = [0.54, 0.54, 0.68];

function farbeFuerBahn(typ) {
    if (typ === "Mond") return mondbahnfarbe;
    if (typ === "Komet") return [0.33, 0.72, 0.74];
    return bahnfarbe;
}

export const kreisPunkte = Float32Array.from(Array.from({ length: 160 }, (_, index) => {
    const winkel = index * Math.PI * 2 / 160;
    return [Math.cos(winkel), 0, Math.sin(winkel)];
}).flat());

export function sammleUmlaufbahnen(objekte) {
    const nachId = new Map(objekte.map(objekt => [objekt.id, objekt]));
    const bahnen = [];
    for (const objekt of objekte) {
        const mitte = nachId.get(objekt.bahnUm);
        if (mitte && objekt.orbit) {
            bahnen.push({ position: bahnzentrum(objekt, mitte), radius: objekt.orbit.a,
                farbe: farbeFuerBahn(objekt.typ), bahn: objekt.orbit });
        } else if (mitte) {
            const radius = Math.hypot(objekt.position[0] - mitte.position[0], objekt.position[2] - mitte.position[2]);
            if (radius > 0) {
                const position = [mitte.position[0], objekt.position[1], mitte.position[2]];
                bahnen.push({ position, radius, farbe: farbeFuerBahn(objekt.typ) });
            }
        }

        if (istAsteroidenguertel(objekt) && !objekt.massstabGuertel) continue;
        const marker = markerringe(objektform(objekt));
        if (marker && !objekt.ringe) {
            const [radien, farbe] = marker;
            for (const radius of radien) bahnen.push({
                position: positionVon(objekt), radius: objekt.radius * radius, farbe: farbe ?? objekt.color
            });
        }
        const ringzentrum = objekt.ringUm ? nachId.get(objekt.ringUm) : objekt;
        if (!ringzentrum || !Array.isArray(objekt.ringe)) continue;
        const farbe = objekt.ringUm ? objekt.color.map(kanal => 0.16 + kanal * 0.64) : objekt.color;
        if (objekt.ringPol && !ringBahnen.has(objekt)) {
            ringBahnen.set(objekt, { e: 0, i: 0, knoten: 0, peri: 0, pol: objekt.ringPol });
        }
        const radien = istAsteroidenguertel(objekt) ? [objekt.ringe[0], objekt.ringe.at(-1)] : objekt.ringe;
        for (const radius of radien) {
            if (Number.isFinite(radius) && radius > 0) bahnen.push({ position: positionVon(ringzentrum), radius, farbe, bahn: ringBahnen.get(objekt) });
        }
    }
    return bahnen;
}
