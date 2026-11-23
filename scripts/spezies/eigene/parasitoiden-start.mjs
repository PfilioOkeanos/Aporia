import {rel, esc} from "../bibliothek.mjs";
import {ladeKarte, dossierPfad} from "../../planeten/karten-verweise.mjs";

export function parasitoidenStart(datei) {
    const objekte = ladeKarte().filter(o => o.id === "esvar-stern" || o.systemId === "esvar-stern");
    const bild = rel(datei, "assets/bilder/Alle Spezies+Übersicht/Biologische Spezies/Parasitoiden/gesamtdarstellung/Perlenspindel liest eine Tontafel-9.png");
    const karte = rel(datei, "Menüs/Sternenkarte/Sternenkarte.html") + "?system=esvar-stern";
    const links = objekte.map(o => `<a href="${rel(datei,dossierPfad(o))}"><strong>${esc(o.name)}</strong><small>${esc(o.typ)}</small></a>`).join("");
    return `<section class="kheravi-atlas" aria-labelledby="esvar-titel"><img src="${bild}" alt="Eine Perlenspindel liest eine Tontafel" loading="lazy"><div><p class="st-kicker">Atlas der Kheravi</p><h2 id="esvar-titel">Unter Esvars Licht</h2><p>Auf Neraveth dauert ein Tag 28 Stunden. Während eines Jahres umkreist Ithrel die Welt fast siebzehnmal. Jenseits der inneren Planeten ziehen der Pyroxenasteroid Sovar und der Gasriese Velun ihre Bahnen.</p><nav aria-label="Himmelskörper im Esvar-System">${links}</nav><a href="${karte}">System in der 3D-Sternenkarte öffnen →</a></div></section>`;
}

