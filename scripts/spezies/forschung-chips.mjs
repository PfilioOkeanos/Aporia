// Spezies-Baukasten · Rückverweis „Dossier der … ↗“ in Forschungszweigen.
// Fügt in Forschungszweigen einen Chip „Dossier der X ↗“ vor „Zum Forschungsbaum“ ein (idempotent).
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const FZ = fileURLToPath(new URL("../../inhalte/Forschung/", import.meta.url)).replace(/\\/g, "/");
const [route, ordner, name, ...zweige] = process.argv.slice(2);
const anker = '<a class="fz-chip" href="#forschungsbaum">';
for (const z of zweige) {
    const f = FZ + z + "/index.html";
    let t = fs.readFileSync(f, "utf8");
    if (t.includes(`data-route="${route}"`)) { console.log("vorhanden:", z); continue; }
    if (!t.includes(anker)) { console.log("KEIN ANKER:", z); continue; }
    const href = "../../../spezies/Biologische%20Spezies/" + ordner + "/hauptseite/Spezies.html";
    t = t.replace(anker, `<a class="fz-chip" data-route="${route}" href="${href}">Dossier der ${name} ↗</a>\n${anker}`);
    fs.writeFileSync(f, t);
    console.log("eingefügt:", z);
}
