import { istAsteroidenguertel } from "../../adapter/Sternenkarte/Kartendaten/Kartengruppen.js";

export const AU_KM = 149597870.7;
export const EINHEITEN_PRO_AU = 100;
export const kmZuKarte = km => km * EINHEITEN_PRO_AU / AU_KM;

const kreis = Math.PI * 2;
const rad = Math.PI / 180;
const positionen = new WeakMap();

export function positionVon(objekt) {
    return positionen.get(objekt) ?? objekt.position;
}

function bahnvektor(bahn, exzentrischeAnomalie) {
    const x = Math.cos(exzentrischeAnomalie) - bahn.e;
    const y = Math.sqrt(1 - bahn.e ** 2) * Math.sin(exzentrischeAnomalie);
    const i = bahn.i * rad, knoten = bahn.knoten * rad, peri = bahn.peri * rad;
    const laengs = x * Math.cos(peri) - y * Math.sin(peri);
    const quer = x * Math.sin(peri) + y * Math.cos(peri);
    let ekliptik = [
        laengs * Math.cos(knoten) - quer * Math.cos(i) * Math.sin(knoten),
        laengs * Math.sin(knoten) + quer * Math.cos(i) * Math.cos(knoten),
        quer * Math.sin(i)
    ];
    if (bahn.pol) {
        const [ra, deklination] = bahn.pol.map(wert => wert * rad);
        const basisX = [-Math.sin(ra), Math.cos(ra), 0];
        const basisY = [-Math.sin(deklination) * Math.cos(ra), -Math.sin(deklination) * Math.sin(ra), Math.cos(deklination)];
        const pol = [Math.cos(deklination) * Math.cos(ra), Math.cos(deklination) * Math.sin(ra), Math.sin(deklination)];
        const aequator = basisX.map((wert, achse) =>
            wert * ekliptik[0] + basisY[achse] * ekliptik[1] + pol[achse] * ekliptik[2]);
        const schiefe = 23.43928 * rad;
        ekliptik = [aequator[0],
            aequator[1] * Math.cos(schiefe) + aequator[2] * Math.sin(schiefe),
            -aequator[1] * Math.sin(schiefe) + aequator[2] * Math.cos(schiefe)];
    }
    return [ekliptik[0], ekliptik[2], -ekliptik[1]];
}

export function keplerPosition(bahn, tage) {
    const phase = (bahn.phase * rad + kreis * (tage % bahn.tage) / bahn.tage) % kreis;
    const m = ((phase + Math.PI + kreis) % kreis) - Math.PI;
    let e = bahn.e < .8 ? m : (m < 0 ? -Math.PI : Math.PI);
    for (let i = 0; i < 18; i++) {
        const schritt = (e - bahn.e * Math.sin(e) - m) / (1 - bahn.e * Math.cos(e));
        e -= schritt;
        if (Math.abs(schritt) < 1e-12) break;
    }
    return bahnvektor(bahn, e).map(wert => wert * bahn.a);
}

export function bahnPunkte(bahn) {
    return Float32Array.from(Array.from({ length: 256 }, (_, index) =>
        bahnvektor(bahn, index * kreis / 256)).flat());
}

export function bahnzentrum(objekt, parent) {
    const startvektor = keplerPosition(objekt.orbit, 0);
    const mitte = positionVon(parent);
    return mitte.map((wert, achse) => wert + objekt.position[achse] - parent.position[achse] - startvektor[achse]);
}

export function aktualisiereBahnen(objekte, tage) {
    const nachId = new Map(objekte.map(objekt => [objekt.id, objekt]));
    const bearbeitet = new Set();
    const aufloesen = objekt => {
        if (bearbeitet.has(objekt)) return;
        bearbeitet.add(objekt);
        positionen.delete(objekt);
        const parent = nachId.get(objekt.bahnUm);
        if (!objekt.orbit || !parent || parent === objekt) return;
        aufloesen(parent);
        const mitte = bahnzentrum(objekt, parent);
        const zeit = typeof tage === "function" ? tage(objekt) : tage;
        const aktuell = keplerPosition(objekt.orbit, zeit - (objekt.orbit.startTag ?? 0));
        positionen.set(objekt, mitte.map((wert, achse) => wert + aktuell[achse]));
    };
    for (const objekt of objekte) aufloesen(objekt);
}

export function keplerPeriode(a, mu) {
    return 2 * Math.PI * Math.sqrt(a ** 3 / mu);
}

export function kreisbahnFuer(position, mitte, tage) {
    const [x, y, z] = position.map((wert, achse) => wert - mitte.position[achse]);
    const a = Math.hypot(x, y, z);
    if (!Number.isFinite(a) || a <= mitte.radius) return null;
    const laenge = Math.atan2(-z, x) / rad;
    const i = Math.atan2(y, Math.hypot(x, z)) / rad;
    const periode = Number.isFinite(mitte.gravitationMu) && mitte.gravitationMu > 0
        ? keplerPeriode(a, mitte.gravitationMu)
        : mitte.systemName ? 74 * (a / 3.1) ** 1.5 : 14 * (a / .9) ** 1.5;
    return { a, e: 0, i, knoten: laenge - 90, peri: 0, phase: 90, tage: tage ?? periode };
}

export function friereBahnstandEin(objekte, systemId, tageFuer) {
    aktualisiereBahnen(objekte, tageFuer);
    const neueStarts = objekte.filter(objekt => objekt.orbit && objekt.systemId === systemId)
        .map(objekt => ({
            objekt, position: [...positionVon(objekt)],
            phase: (objekt.orbit.phase + 360 * ((tageFuer(objekt) - (objekt.orbit.startTag ?? 0)) % objekt.orbit.tage) / objekt.orbit.tage) % 360
        }));
    for (const objekt of objekte) {
        if (objekt.systemId === systemId && istAsteroidenguertel(objekt)) {
            objekt.bahnStartTage = (objekt.bahnStartTage ?? 0) + tageFuer(objekt);
        }
    }
    for (const { objekt, position, phase } of neueStarts) {
        objekt.position = position;
        objekt.orbit.phase = phase;
        if (objekt.orbit.startTag != null) objekt.orbit.startTag = 0;
    }
}

export const IST_ASTEROID = objekt => /^asteroid$/i.test(objekt.typ?.trim() ?? "");
export const STANDARD_STARTTEMPO = 105;

export function gravitationsbahnFuer(position, mitte, objektRadius, tempo = STANDARD_STARTTEMPO, startTag = 0) {
    const kreisbahn = kreisbahnFuer(position, mitte);
    const mu = mitte.gravitationMu;
    const faktor = tempo / 100;
    if (!kreisbahn || !Number.isFinite(faktor) || !Number.isFinite(mu) || mu <= 0 || faktor < .75 || faktor > 1.35) return null;

    // A tangential launch has zero radial velocity, so it begins at an apsis.
    const a = kreisbahn.a / (2 - faktor ** 2);
    const e = Math.abs(faktor ** 2 - 1);
    if (a * (1 - e) <= mitte.radius + objektRadius) return null;
    const periapsis = faktor >= 1;
    return {
        ...kreisbahn, a, e, peri: periapsis ? 90 : -90, phase: periapsis ? 0 : 180,
        tage: keplerPeriode(a, mu), startTag, starttempo: tempo
    };
}

export function setzeAsteroidbahn(objekt, mitte, anzeigePosition, tempo, startTag = 0) {
    const basis = mitte.position;
    const aktuell = positionVon(mitte);
    const position = anzeigePosition.map((wert, achse) => wert + basis[achse] - aktuell[achse]);
    const orbit = gravitationsbahnFuer(position, mitte, objekt.radius, tempo, startTag);
    if (!orbit) return false;
    objekt.position = position;
    objekt.bahnUm = mitte.id;
    objekt.orbit = orbit;
    return true;
}
