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
    // steinAnzahl (optional): Dichte des Gürtels bzw. Körperfelds, sonst 72 wie bisher
    const anzahl = Number.isInteger(objekt.steinAnzahl) && objekt.steinAnzahl > 0 ? Math.min(objekt.steinAnzahl, 600) : 72;
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

// Brocken mit steinMindestPx (optional) bleiben auf dem Bildschirm mindestens so groß (Bildwinkel 45°),
// damit ein maßstabsgetreuer Gürtel als Band vieler kleiner Körper sichtbar bleibt. Ohne Angabe: echter Radius.
export function sichtbarerSteinRadius(stein, abstand, bildhoehe) {
    if (!stein.mindestPx || !bildhoehe) return stein.radius;
    return Math.max(stein.radius, abstand * 0.8284 / bildhoehe * stein.mindestPx / 2);
}

export function sammleAsteroiden(sichtbar, objekte, tage = 0) {
    // koerperfeld (optional): auch andere Gebiete (z. B. Kometengebiete) als Feld einzelner Brocken darstellen
    const guertel = sichtbar.filter(objekt => istAsteroidenguertel(objekt) || objekt.koerperfeld === true);
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
                // steingroesseKm (optional): größter Brocken im Maßstab, sonst 200 km wie bisher
                radius: (objekt.massstabGuertel ? kmZuKarte(objekt.steingroesseKm ?? 200) : breite * .105) * wert.groesse,
                farbe: objekt.color.map(kanal => kanal * wert.helligkeit),
                mindestPx: (objekt.steinMindestPx ?? 0) * (.55 + wert.groesse * .45),
                winkel
            };
        });
    });
}
