export const APORIA = "@aporia";
export const FREIE_OBJEKTE = "@frei";
export const KOSMISCHE_STRUKTUREN = "@kosmisch";
const STERNSYSTEME = "@sternsysteme";
const ASTEROIDENGUERTEL = "@asteroidenguertel";

const ebenen = [
    ["cosmic-webs", "Cosmic Webs", "Kosmisches Netz"],
    ["filamente", "Filamente", "Filament"],
    ["supergalaxien", "Supergalaxien", "Supergalaxie"],
    ["galaxienhaufen", "Galaxienhaufen", "Galaxienhaufen"],
    ["galaxiengruppen", "Galaxiengruppen", "Galaxiengruppe"],
    ["kosmologie-galaxien", "Galaxien", "Galaxie"],
    ["galaktische-strukturen", "Galaktische Strukturen", "Galaktische Struktur"],
    ["sektoren", "Sektoren", "Sektor"]
];

const strukturGruppen = new Map(ebenen.map(([route]) => [route, "@" + route]));
const typGruppen = new Map(ebenen.map(([route, , typ]) => [typ, strukturGruppen.get(route)]));

export function strukturgruppe(route) {
    return strukturGruppen.get(route);
}

export function kartengruppen(objekte) {
    const gruppen = [
        { id: APORIA, name: "Aporia", tiefe: 0, sammlung: true },
        { id: KOSMISCHE_STRUKTUREN, name: "Kosmische Strukturen", parent: APORIA, tiefe: 1 }
    ];
    for (const [route, name] of ebenen) {
        const parent = gruppen.at(-1);
        gruppen.push({ id: strukturgruppe(route), name, parent: parent.id, tiefe: parent.tiefe + 1 });
    }
    const parent = gruppen.at(-1);
    gruppen.push({ id: STERNSYSTEME, name: "Sternsysteme", parent: parent.id, tiefe: parent.tiefe + 1, sammlung: true });
    for (const objekt of objekte) {
        if (objekt.systemName) gruppen.push({
            id: objekt.id, name: objekt.systemName, parent: STERNSYSTEME, tiefe: parent.tiefe + 2
        });
    }
    gruppen.push({
        id: ASTEROIDENGUERTEL, name: "Asteroidengürtel", parent: STERNSYSTEME, tiefe: parent.tiefe + 2, sammlung: true
    });
    gruppen.push({ id: FREIE_OBJEKTE, name: "Freie Objekte", parent: APORIA, tiefe: 1 });
    return gruppen;
}

export function objektgruppe(objekt, gruppen) {
    let id = objekt.systemName ? objekt.id : objekt.systemId;
    if ((!id || id === KOSMISCHE_STRUKTUREN) && typGruppen.has(objekt.typ)) id = typGruppen.get(objekt.typ);
    return gruppen.get(id) && !gruppen.get(id).sammlung ? id : FREIE_OBJEKTE;
}

export function istAsteroidenguertel(objekt) {
    return /asteroidengürtel/i.test(objekt.typ + " " + objekt.name);
}

export function inKartengruppe(objekt, ansicht, gruppen) {
    if (ansicht === ASTEROIDENGUERTEL) return istAsteroidenguertel(objekt);
    let gruppe = gruppen.get(objektgruppe(objekt, gruppen));
    while (gruppe) {
        if (gruppe.id === ansicht) return true;
        gruppe = gruppen.get(gruppe.parent);
    }
    return false;
}

export function gruppenOption(gruppe) {
    return new Option("  ".repeat(gruppe.tiefe) + (gruppe.tiefe ? "↳ " : "") + gruppe.name, gruppe.id);
}
