import { positionVon } from "../Sternsysteme/Bahnphysik.js";
import { kartenobjektLink } from "../../adapter/Sternenkarte/Verknuepfungen/Verknuepfungen.js";

const dot = (a, b) => a.reduce((sum, value, index) => sum + value * b[index], 0);

export function zeichneObjektnamen(container, objekte, stand, aspect, istMarkiert, hoehe) {
    const links = new Map([...container.children].map(link => [link.dataset.id, link]));

    for (const objekt of objekte) {
        const { id, name, typ, radius } = objekt;
        const delta = positionVon(objekt).map((value, index) => value - stand.eye[index]);
        const tiefe = -dot(delta, stand.back);
        const x = 50 + 50 * 2.414 * dot(delta, stand.right) / (tiefe * aspect);
        const y = 50 - 50 * 2.414 * (dot(delta, stand.up) - radius) / tiefe;
        let link = links.get(id);
        links.delete(id);

        const zuKlein = radius / tiefe < 0.001;
        const mondZuNahAmPlaneten = typ === "Mond" && objekt.orbit &&
            2.414 * objekt.orbit.a / tiefe * hoehe * .5 < 12;
        if (tiefe <= stand.near || (zuKlein && !objekt.radiusKm && !objekt.massstabGuertel) ||
            (mondZuNahAmPlaneten && !istMarkiert(objekt)) || x < 0 || x > 100 || y < 0 || y > 100) {
            link?.remove();
            continue;
        }
        if (!link) {
            link = document.createElement("a");
            link.dataset.id = id;
            container.append(link);
        }
        const ziel = kartenobjektLink(objekt);
        if (link.href !== ziel) link.href = ziel;
        const beschriftung = typ ? name + " · " + typ : name;
        if (link.textContent !== beschriftung) {
            link.textContent = beschriftung;
            link.title = beschriftung;
        }
        link.classList.toggle("is-system-star", Boolean(objekt.systemName));
        link.classList.toggle("is-marked", istMarkiert(objekt));
        link.classList.toggle("is-distance-marker", zuKlein && Boolean(objekt.radiusKm || objekt.massstabGuertel));
        link.style.left = x + "%";
        link.style.top = y + "%";
    }

    for (const link of links.values()) link.remove();
}
