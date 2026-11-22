// Karten-Verweise · gemeinsame Hilfe: zu jedem Objekt der Sternenkarte das Dossier (Projektpfad) und den Kartenlink finden.
// Genutzt von heimatwelt-bauen.mjs und koerper-bauen.mjs, damit Planeten, Monde, Sterne usw. sich gegenseitig verlinken.
import fs from "node:fs";
import { ROOT } from "./koerper.mjs";

export const KARTE_DATEI = `${ROOT}Menüs/adapter/Sternenkarte/Kartendaten/objekte.json`;
export const ladeKarte = () => JSON.parse(fs.readFileSync(KARTE_DATEI, "utf8"));

// archivLink „../../inhalte/himmelskoerper/<art>/details/<slug>/hauptseite/index.html“ → Projektpfad
export function dossierPfad(objekt) {
    const link = objekt?.archivLink;
    if (!link) return null;
    const pfad = link.replace(/^(\.\.\/)+/, "");
    return fs.existsSync(ROOT + pfad) ? pfad : null;
}
// Art und Ordner eines Dossiers („monde/erosionsmond-…“) für die Bauskripte
export function koerperArg(objekt) {
    const m = dossierPfad(objekt)?.match(/inhalte\/himmelskoerper\/([^/]+)\/details\/([^/]+)\//);
    return m ? `${m[1]}/${m[2]}` : null;
}
// Sternenkarte: System öffnen und Objekt auswählen
export const kartenLink = (systemId, objektId) => `Menüs/Sternenkarte/Sternenkarte.html?system=${encodeURIComponent(systemId)}${objektId && objektId !== systemId ? `&objekt=${encodeURIComponent(objektId)}` : ""}`;
// Verweis [Text, Pfad] auf das Dossier eines Objekts, sonst auf seine Position in der Karte
export function verweisAuf(objekt, text = objekt.name) {
    const sys = objekt.systemName ? objekt.id : objekt.systemId;
    return [text, dossierPfad(objekt) ?? kartenLink(sys, objekt.id)];
}
