export const formOptionen = [
    ["kugel", "Kugel"], ["brocken", "Asteroid / Brocken"], ["komet", "Komet"],
    ["wolke", "Nebelfeld"], ["gasriese", "Abgeflachter Planet"], ["scheibe", "Galaxienscheibe"],
    ["filament", "Filament"], ["phaenomen", "Phänomen / Pulsar"], ["sektor", "Sektor"],
    ["schwarzes-loch", "Schwarzes Loch"], ["guertel", "Gürtel"], ["system", "Sternsystem"]
];
const formen = new Set(formOptionen.map(([id]) => id));

export function objektform(objekt) {
    if (formen.has(objekt.form)) return objekt.form;
    const typ = (objekt.typ ?? "").toLowerCase();
    if (typ.includes("nebel")) return "wolke";
    if (typ === "gasriese") return "gasriese";
    if (typ === "asteroid") return "brocken";
    if (typ === "komet") return "komet";
    if (typ.includes("schwarzes loch")) return "schwarzes-loch";
    if (typ === "phänomen" || typ === "neutronenstern") return "phaenomen";
    return "kugel";
}

export function formePunkt(form, x, y, z) {
    const unregelmaessig = .83 + .12 * Math.sin(11*x + 4*y) * Math.cos(8*z - 3*y);
    switch (form) {
        case "brocken": {
            const unebenheit = unregelmaessig * (.90 + .1 * Math.sin(4*x + 2*z));
            return [x * unebenheit, y * unebenheit * .68, z * unebenheit * .79];
        }
        case "wolke": return [x * unregelmaessig, y * (.65 + .22 * Math.sin(8*x)), z * unregelmaessig];
        case "komet": {
            const breite = .32 + .48 * (x + 1) / 2;
            return [x, y * breite, z * breite];
        }
        case "gasriese": return [x, y * .87, z];
        case "scheibe": return [x, y * .36, z];
        case "filament": return [x, y * .20 + .17 * Math.sin(5*x) * (1 - x*x), z * .23];
        case "phaenomen": return [x * (.32 + .35 * (1 - Math.abs(y))), y, z * (.32 + .35 * (1 - Math.abs(y)))];
        case "sektor": {
            const norm = Math.max(Math.abs(x), Math.abs(y), Math.abs(z));
            return norm ? [x/(norm*Math.sqrt(3)), y/(norm*Math.sqrt(3)), z/(norm*Math.sqrt(3))] : [0,0,0];
        }
        case "schwarzes-loch": return [x * .28, y * .28, z * .28];
        case "guertel":
        case "system": return [x * .22, y * .22, z * .22];
        default: return [x, y, z];
    }
}

export function markerringe(form) {
    switch (form) {
        case "schwarzes-loch": return [[.45,.57,.7,.82,.96], [1,.49,.18]];
        case "guertel": return [[.66,.75,.84,.93,1], null];
        case "system": return [[.48,.72,.96], null];
        default: return null;
    }
}
