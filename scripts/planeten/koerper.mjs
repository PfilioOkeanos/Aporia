// Planetendossier · Himmelskörper finden
// Gemeinsame Hilfe für daten-auslesen.mjs, planetendossier.mjs und kapitel-umstellen.mjs.
// Aufrufform: <slug> (sucht in allen Arten) oder <art>/<slug>, z. B. „monde/abgerundeter-trummermond-im-schwarzen-all“.
// Arten = Ordner unter inhalte/himmelskoerper/ mit einem Unterordner details/ (planeten, monde, sterne, kometen …).
import fs from "node:fs";
import { fileURLToPath } from "node:url";

export const ROOT = fileURLToPath(new URL("../../", import.meta.url)).replace(/\\/g, "/");
export const HK = "inhalte/himmelskoerper";
export const GEM = `${HK}/_gemeinsam`;
// erde.css/erde.js sind die gemeinsame Grundlage aller Himmelskörper-Seiten (werden nicht verändert)
export const KERN = `${HK}/planeten/details/erde-im-sternenmeer/hauptseite`;

export function arten() {
    return fs.readdirSync(ROOT + HK, { withFileTypes: true })
        .filter((e) => e.isDirectory() && fs.existsSync(`${ROOT}${HK}/${e.name}/details`))
        .map((e) => e.name);
}

export function findeKoerper(arg = "erde-im-sternenmeer") {
    const [a, b] = arg.includes("/") ? arg.split("/") : [null, arg];
    const kandidaten = (a ? [a] : arten()).filter((art) => fs.existsSync(`${ROOT}${HK}/${art}/details/${b}`));
    if (!kandidaten.length) throw new Error(`Himmelskörper „${arg}“ nicht gefunden (gesucht in: ${(a ? [a] : arten()).join(", ")})`);
    if (kandidaten.length > 1) throw new Error(`„${b}“ gibt es mehrfach (${kandidaten.join(", ")}) – bitte als <art>/<slug> angeben`);
    const art = kandidaten[0];
    const basis = `${HK}/${art}/details/${b}`;
    return {
        art,
        slug: b,
        basis,
        hauptseite: `${basis}/hauptseite/index.html`,
        unterseiten: `${basis}/unterseiten`,
        // Planeten behalten ihren bisherigen Dateinamen, andere Arten liegen in einem Unterordner
        datenDatei: `scripts/planeten/daten/${art === "planeten" ? "" : art + "/"}${b}.json`,
    };
}

// Daten eines Himmelskörpers laden: ausgelesene Grunddatei (<slug>.json) + gepflegte Inhalte (<slug>.inhalt.json).
// Die Inhaltsdatei hat Vorrang; „kapitel“ darin ist ein Objekt { "<Kapiteltitel>": { intro, gruppe, icon, untertitel, abschnitte } }.
export function ladeDaten(K) {
    const basis = JSON.parse(fs.readFileSync(ROOT + K.datenDatei, "utf8"));
    const inhaltDatei = ROOT + K.datenDatei.replace(/\.json$/, ".inhalt.json");
    if (!fs.existsSync(inhaltDatei)) return basis;
    const { kapitel: kapitelInhalt = {}, design, ...rest } = JSON.parse(fs.readFileSync(inhaltDatei, "utf8"));
    return {
        ...basis,
        ...rest,
        design: { ...(basis.design ?? {}), ...(design ?? {}) },
        kapitel: basis.kapitel.map((k) => ({ ...k, ...(kapitelInhalt[k.titel] ?? {}) })),
    };
}
