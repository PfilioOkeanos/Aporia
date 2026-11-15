import { keplerPeriode, kmZuKarte, positionVon } from "./Bahnphysik.js";
import { istAsteroidenguertel } from "../../adapter/Sternenkarte/Kartendaten/Kartengruppen.js";

const formen = new WeakMap();

function verbindlicheVerteilung(objekt) {
    if (formen.has(objekt)) return formen.get(objekt);
    let seed = 2166136261;
    for (const zeichen of objekt.id) seed = Math.imul(seed ^ zeichen.codePointAt(0), 16777619);
    function zufall() {
        seed = (Math.imul(seed, 1664525) + 1013904223) | 0;
        return (seed >>> 0) / 4294967296;
    }
    const anzahl = 72;
    const werte = Array.from({ length: anzahl }, (_, index) => ({
        winkel: (index + zufall()) / anzahl * 2 * Math.PI,
        quer: zufall(),
        hoehe: zufall() - .5,
        groesse: .35 + zufall() * .65,
        helligkeit: .63 + zufall() * .37
    }));
    formen.set(objekt, werte);
    return werte;
}

export function sammleAsteroiden(sichtbar, objekte, tage = 0) {
    const guertel = sichtbar.filter(istAsteroidenguertel);
    if (!guertel.length) return [];
    const nachId = new Map(objekte.map(objekt => [objekt.id, objekt]));
    return guertel.flatMap(objekt => {
        const mitte = objekt.ringUm ? nachId.get(objekt.ringUm) ?? objekt : objekt;
        const radien = objekt.ringe?.filter(wert => Number.isFinite(wert) && wert > 0);
        const innen = radien?.length ? Math.min(...radien) : objekt.radius * .68;
        const aussen = radien?.length ? Math.max(...radien) : objekt.radius;
        const breite = Math.max(aussen - innen, aussen * .08);
        const [x, y, z] = positionVon(mitte);
        return verbindlicheVerteilung(objekt).map(wert => {
            const radiusBahn = innen + wert.quer * breite;
            const umlaufzeit = Number.isFinite(mitte.gravitationMu) && mitte.gravitationMu > 0
                ? keplerPeriode(radiusBahn, mitte.gravitationMu)
                : 74 * (radiusBahn / 3.1) ** 1.5;
            const laufzeit = (objekt.bahnStartTage ?? 0) + (typeof tage === "function" ? tage(objekt) : tage);
            const winkel = wert.winkel + (laufzeit % umlaufzeit) / umlaufzeit * 2 * Math.PI;
            return {
                position: [x + Math.cos(winkel) * radiusBahn,
                    y + wert.hoehe * breite * .37, z + Math.sin(winkel) * radiusBahn],
                radius: (objekt.massstabGuertel ? kmZuKarte(200) : breite * .105) * wert.groesse,
                farbe: objekt.color.map(kanal => kanal * wert.helligkeit),
                winkel
            };
        });
    });
}
