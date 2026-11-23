// Heimatwelt bauen · erzeugt die Inhaltsdatei (<ordner>.inhalt.json) einer Heimatwelt aus einer kompakten Beschreibung
// (scripts/planeten/heimatwelten/<name>.mjs) und dem zugehörigen Sternsystem (scripts/planeten/systeme/<name>-system.json).
// Alle Zahlenabschnitte (Steckbrief, Bahn, Stern, Monde, Erdvergleich, Physik, Atmosphäre, Klimaskala, Nachbarn)
// werden berechnet und passen dadurch immer zur Sternenkarte. Spezies-Inhalte kommen aus der Beschreibung.
// Danach: planetendossier.mjs und kapitel-bauen.mjs für den Ordner ausführen (macht dieses Skript mit --bauen selbst).
// Aufruf: node scripts/planeten/heimatwelt-bauen.mjs <name> [--bauen]
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { ROOT, findeKoerper } from "./koerper.mjs";
import { verweisAuf } from "./karten-verweise.mjs";

const name = process.argv[2];
const spec = (await import(pathToFileURL(`${ROOT}scripts/planeten/heimatwelten/${name}.mjs`).href)).default;
const K = findeKoerper(spec.ordner);
const basis = JSON.parse(fs.readFileSync(ROOT + K.datenDatei, "utf8"));
const sys = JSON.parse(fs.readFileSync(`${ROOT}scripts/planeten/systeme/${spec.system}.json`, "utf8"));
const karte = JSON.parse(fs.readFileSync(`${ROOT}Menüs/adapter/Sternenkarte/Kartendaten/objekte.json`, "utf8"));
const W = spec.werte;
// Verweise auf die Dossiers der übrigen Körper des Systems (Stern, Monde, Planeten, Gürtel, Kometen)
const kartenObj = (id) => karte.find((o) => o.id === id);
const verweiseAuf = (ids) => ids.map(kartenObj).filter(Boolean).map((o) => verweisAuf(o));
const f = (n, d = 2) => Number(n).toLocaleString("de-DE", { maximumFractionDigits: d });
const LJ_AE = 63241.077, E_KM = 6371;

// ---------- Physik aus System und Werten ----------
const stern = sys.stern;
const planet = sys.koerper.find((k) => k.id === spec.planetId);
const rE = planet.radiusKm / E_KM, mE = planet.masseErde;
const g = mE / rE ** 2, dichte = 5.514 * mE / rE ** 3, vEsc = 11.186 * Math.sqrt(mE / rE);
const L = stern.leuchtkraftSonne, M = stern.masseSonne;
const a = planet.aAE, e = planet.e ?? 0;
const tageUmlauf = 365.25 * Math.sqrt(a ** 3 / M);
const einstr = L / a ** 2;
const teq = 278.6 * L ** 0.25 / Math.sqrt(a) * (1 - (planet.albedo ?? 0.3)) ** 0.25 - 273.15;
const hzInnen = Math.sqrt(L / 1.1), hzAussen = Math.sqrt(L / 0.36);
const lage = a < hzInnen ? "innerhalb der inneren Grenze der habitablen Zone" : a > hzAussen ? "jenseits der äußeren Grenze der habitablen Zone" : "innerhalb der habitablen Zone";
const ortsjahr = tageUmlauf * 24 / W.rotationH;
const monde = sys.koerper.filter((k) => k.um === spec.planetId).map((m) => ({ ...m, aKm: Math.cbrt(398600.4418 * mE * (m.periodeTage * 86400) ** 2 / (4 * Math.PI ** 2)) }));
const planetenSys = sys.koerper.filter((k) => k.um === stern.id && k.masseErde > 0.01 && !/roter zwerg|brauner zwerg|weißer zwerg/i.test(k.typ)).sort((x, y) => x.aAE - y.aAE);
const bahnNr = planetenSys.findIndex((k) => k.id === planet.id) + 1;
const sternDurchm = 0.53 * stern.radiusSonne / a;
// Nachbarsysteme
const r = sys.lage.richtung, lg = Math.hypot(...r), pos = r.map((x) => x / lg * sys.lage.entfernungLj);
const nachbarn = karte.filter((o) => (o.systemName || o.id === "Kugel 1") && !o.id.startsWith(sys.praefix))
    .map((o) => ({ name: o.systemName ?? "Sonnensystem", lj: Math.hypot(...o.position.map((x, i) => x / 100 / LJ_AE - pos[i])) }))
    .sort((x, y) => x.lj - y.lj);
const einfluss = 3.6 * Math.cbrt(M);
const zahlwort = ["keine", "einen", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn"];

// ---------- Grunddaten ----------
const atmoText = W.atmosphaere.map(([gas, p]) => `${f(p, 1)} % ${gas}`).join(", ");
const grunddaten = [
    ["Archiv-ID", basis.grunddaten.find(([k]) => k === "Archiv-ID")?.[1] ?? "–"],
    ["Klasse", spec.klasseLang ?? spec.klasse],
    ["Durchmesser", `${f(planet.radiusKm * 2, 0)} km`],
    ["Radius", `${f(planet.radiusKm, 0)} km`],
    ["Masse", `${f(mE)} Erdmassen`],
    ["Dichte", `${f(dichte)} g/cm³`],
    ["Schwerkraft", `${f(g)} g (${f(g * 9.81, 1)} m/s²)`],
    ["Mittlere Oberflächentemperatur", W.temperatur],
    ["Ozeane", W.ozeane],
    ["Atmosphäre", atmoText],
    ["Atmosphärendruck", W.druck],
    ["Rotationsperiode", W.rotationText ?? `${f(W.rotationH, 1)} h`],
    ["Umlaufzeit", `${f(tageUmlauf, 0)} Erdtage`],
    ["Abstand zum Stern", `${f(a, 3)} AE`],
    ["Monde", monde.length ? `${monde.length} (${monde.map((m) => m.name).join(", ")})` : "keine"],
    ["Zentralstern", `${stern.name}, ${stern.typ}`],
    ["Einstrahlung", `${f(einstr)}-fach der Erde`],
    ["Achsneigung", `${f(W.achsneigung, 1)}°`],
    ["Exzentrizität", f(e, 3)],
    ["Fluchtgeschwindigkeit", `${f(vEsc, 1)} km/s`],
    ["Alter", `ca. ${f(stern.alterMrd, 1)} Mrd. Jahre`],
    ...(W.extra ?? []),
    ["Intelligente Spezies", spec.spezies.name],
];

// ---------- automatisch erzeugte Abschnitte ----------
const P = `inhalte/spezies/${spec.spezies.gruppe}/${spec.spezies.ordner}`;
const speziesSeite = spec.spezies.seite ?? `${P}/hauptseite/Spezies.html`;
const sub = (o, d) => { const p = `${P}/${spec.spezies.unterordner ?? "Unterseiten"}/${o}/${d}`; return fs.existsSync(ROOT + p) ? p : null; };
const auto = {
    "Allgemeines": [
        { titel: "Kurzprofil", bild: true, bildtext: spec.bildtext ?? `${spec.name} aus dem Orbit`, text: spec.kurzprofil },
        { titel: "Steckbrief", daten: [["Typ", spec.klasseLang ?? spec.klasse], ["Zentralstern", `${stern.name} (${stern.typ})`], ["Schwerkraft", `${f(g)} g`], ["Durchmesser", `${f(planet.radiusKm * 2, 0)} km`], ["Mittlere Temperatur", W.temperatur], ["Atmosphäre", W.atmoKurz], ["Wasser", W.ozeane], ["Intelligente Spezies", spec.spezies.name]] },
        { titel: `${spec.name} im Vergleich zur Erde`, vergleich: { mit: "Erde", werte: [["Durchmesser", Math.round(planet.radiusKm * 2), 12742, "km"], ["Schwerkraft", +g.toFixed(2), 1, "g"], ["Tageslänge", +W.rotationH.toFixed(1), 24, "h"], ["Luftdruck (Mittel)", W.druckMittel, 1, "bar"], ["Mittlere Temperatur", W.temperaturMittel, 15, "°C"], ...(W.vergleichExtra ?? [])] } },
    ],
    "Astronomie": [
        { titel: "Bahn und Position", text: [`${spec.name} ist der ${bahnNr}. von ${planetenSys.length} Planeten im ${sys.systemName}. Er umkreist ${stern.name} in ${f(a, 3)} AE Abstand – ${lage} (bei ${stern.name} zwischen ${f(hzInnen)} und ${f(hzAussen)} AE). Er erhält ${f(einstr)}-mal so viel Sternlicht wie die Erde.`, `Ohne Atmosphäre läge seine Gleichgewichtstemperatur bei rund ${f(teq, 0)} °C. ${W.treibhausText ?? ""}`].filter(Boolean),
          daten: [["Sternsystem", sys.systemName], ["Bahnposition", `${bahnNr}. von ${planetenSys.length} Planeten`], ["Große Halbachse", `${f(a, 3)} AE (ca. ${f(a * 149.6, 1)} Mio. km)`], ["Exzentrizität", f(e, 3)], ["Umlaufzeit", `${f(tageUmlauf, 1)} Erdtage`], ["Ortsjahr", `ca. ${f(ortsjahr, 0)} Ortstage`], ["Einstrahlung", `ca. ${f(einstr)}-fach der Erde`], [`Habitable Zone von ${stern.name}`, `${f(hzInnen)}–${f(hzAussen)} AE`], ...(W.bahnExtra ?? [])] },
        { titel: "Zentralstern", text: [stern.beschreibung], daten: [["Name", stern.name], ["Typ", stern.typ], ["Masse", `${f(M)} Sonnenmassen`], ["Radius", `${f(stern.radiusSonne)} Sonnenradien`], ["Leuchtkraft", `${f(L, 4)} Sonnenleuchtkräfte`], ["Oberflächentemperatur", `ca. ${f(stern.temperaturK, 0)} K`], ["Alter", `ca. ${f(stern.alterMrd, 1)} Mrd. Jahre`], ["Begleitsterne", sys.einzelstern ? "keine (Einzelstern)" : sys.begleiterText ?? "Mehrfachsystem"]], verweise: verweiseAuf([stern.id]) },
        { titel: "Rotation und Achse", daten: [["Rotationsperiode", W.rotationText ?? `${f(W.rotationH, 1)} h`], ["Achsneigung", `${f(W.achsneigung, 1)}°`], ["Scheinbare Sterngröße", `ca. ${f(sternDurchm, 2)}° (Sonne von der Erde: 0,53°)`], ["Jahreszeiten", W.jahreszeiten]] },
        ...(monde.length ? [{ titel: "Monde", karten: monde.map((m) => ({ titel: `${m.name}`, text: `${f(m.radiusKm * 2, 0)} km Durchmesser, Abstand ${f(m.aKm, 0)} km, Umlauf in ${f(m.periodeTage, 1)} Tagen. ${m.beschreibung}` })), verweise: verweiseAuf(monde.map((m) => m.id)) }] : [{ titel: "Monde", text: [`${spec.name} besitzt keine Monde.`] }]),
        { titel: "Planeten des Systems", zeitleiste: [...sys.koerper.filter((k) => k.um === stern.id || k.ringUm === stern.id).filter((k) => k.typ !== "Komet" && k.typ !== "Asteroid")
            .map((k) => [`${k.name} · ${k.ringeAE ? `${f(k.ringeAE[0], 1)}–${f(k.ringeAE.at(-1), 1)}` : f(k.aAE, 3)} AE`, k.beschreibung.split(". ")[0] + "."])],
          verweise: verweiseAuf(sys.koerper.filter((k) => (k.um === stern.id || k.ringUm === stern.id || k.ringUm === planet.id) && k.typ !== "Komet" && k.typ !== "Asteroid" && k.id !== planet.id).map((k) => k.id)) },
        { titel: "Nachbarschaft und Anomalien", karten: [...sys.koerper.filter((k) => k.anomalie || k.typ === "Komet" || k.typ === "Asteroid").map((k) => ({ titel: k.name, text: k.beschreibung })),
            { titel: "Nachbarsysteme", text: `${nachbarn.slice(0, 3).map((n) => `${n.name} (${f(n.lj, 1)} Lj)`).join(", ")} – alle weit außerhalb der gravitativen Einflusszone von ${stern.name} (rund ${f(einfluss, 1)} Lichtjahre).` }],
          verweise: [...verweiseAuf(sys.koerper.filter((k) => k.anomalie || k.typ === "Komet" || k.typ === "Asteroid").map((k) => k.id)), [`${sys.systemName} in der Sternenkarte`, `Menüs/Sternenkarte/Sternenkarte.html?system=${stern.id}`]] },
    ],
    "Physik": [
        { titel: "Kerndaten", daten: [["Radius", `${f(planet.radiusKm, 0)} km`], ["Masse", `${f(mE)} Erdmassen`], ["Mittlere Dichte", `${f(dichte)} g/cm³`], ["Oberflächenschwerkraft", `${f(g * 9.81, 1)} m/s² (${f(g)} g)`], ["Fluchtgeschwindigkeit", `ca. ${f(vEsc, 1)} km/s`], ...(W.physikExtra ?? [])] },
        { titel: "Physikalische Werte im Vergleich", vergleich: { mit: "Erde", werte: [["Masse", mE, 1, "Erdmassen"], ["Dichte", +dichte.toFixed(2), 5.51, "g/cm³"], ["Fluchtgeschwindigkeit", +vEsc.toFixed(1), 11.2, "km/s"], ...(W.magnetfeldFaktor != null ? [["Magnetfeld", W.magnetfeldFaktor, 1, "× Erde"]] : [])] } },
    ],
    "Atmosphäre": [
        { titel: "Zusammensetzung", text: W.atmoText ? [W.atmoText] : [], balken: { werte: W.atmosphaere } },
        { titel: "Druck", daten: W.druckDaten ?? [["Mittlerer Oberflächendruck", W.druck]] },
    ],
    "Klima": W.zonen ? [{ titel: "Temperaturzonen", text: W.zonenText ? [W.zonenText] : [], skala: W.zonen }] : [],
    "Besonderheiten": W.rekorde ? [{ titel: "Rekorde", daten: W.rekorde }] : [],
    "Medienarchiv": [{ titel: `${spec.name} aus dem All`, bild: true, bildtext: spec.bildtext ?? spec.name }, ...(spec.bilder?.medien ?? []).map(([t, b]) => ({ titel: t, bild: b, bildtext: t }))],
};

// optionale Umbenennung von Datenbeschriftungen (z. B. Gaswelten ohne feste Oberfläche): werte.umbenennen = { alt: neu }
if (W.umbenennen) {
    const um = (zeilen) => zeilen?.forEach((z) => { if (W.umbenennen[z[0]]) z[0] = W.umbenennen[z[0]]; });
    um(grunddaten);
    for (const liste of Object.values(auto)) for (const a of liste) { um(a.daten); um(a.vergleich?.werte); }
}

// ---------- zusammenführen ----------
const GRUPPE = { "Allgemeines": ["Weitere", "▤"], "Astronomie": ["Wissenschaft", "✧"], "Physik": ["Wissenschaft", "⚛"], "Planetare Struktur": ["Wissenschaft", "◈"], "Geografie": ["Natur", "△"], "Atmosphäre": ["Natur", "☁"], "Klima": ["Natur", "☀"], "Gewässer": ["Natur", "≈"], "Geologie": ["Wissenschaft", "◈"], "Biosphäre": ["Natur", "❧"], "Spezies": ["Zivilisation", "✿"], "Zivilisation": ["Zivilisation", "▥"], "Geschichte": ["Zivilisation", "▤"], "Fraktionen": ["Zivilisation", "◇"], "Rohstoffe": ["Weitere", "⬡"], "Erforschung": ["Weitere", "✧"], "Besonderheiten": ["Weitere", "✺"], "Medienarchiv": ["Weitere", "▣"], "Gaszusammensetzung": ["Natur", "☁"], "Wolkenschichten": ["Natur", "☁"], "Stürme": ["Natur", "☀"] };
const kapitel = {};
for (const k of basis.kapitel) {
    const s = spec.kapitel[k.titel] ?? {};
    const [gruppe, icon] = GRUPPE[k.titel] ?? ["Weitere", "◆"];
    kapitel[k.titel] = {
        gruppe, icon, intro: s.intro ?? `${k.titel} ${spec.genitiv}.`,
        ...(s.kopfbild ? { kopfbild: s.kopfbild, bild: s.kopfbild } : {}),
        abschnitte: [...(s.vorne ?? []), ...(auto[k.titel] ?? []), ...(s.abschnitte ?? [])],
    };
}
const verweise = [
    ...(spec.systemseite ? [{ icon: "✦", art: "Systemübersicht", titel: sys.systemName, href: spec.systemseite, route: null }] : []),
    { icon: "✿", art: "Heimische Spezies", titel: spec.spezies.name, href: speziesSeite, route: null },
    ...[["Heimatwelt", "Heimatwelt", "heimatwelt.html"], ["Politik", "Politik und Fraktionen", "politik.html"]].map(([o, t, d]) => sub(o, d) ? { icon: "◈", art: "Spezies-Dossier", titel: t, href: sub(o, d), route: null } : null).filter(Boolean),
    { icon: "✦", art: "Sternenkarte", titel: sys.systemName, href: `Menüs/Sternenkarte/Sternenkarte.html?system=${stern.id}`, route: null },
];
const quellen = [["Heimatwelt", "heimatwelt.html"], ["Geschichte", "geschichte.html"], ["Gesellschaft", "gesellschaft.html"], ["Politik", "politik.html"], ["Allgemeines", "allgemeines.html"]]
    .map(([o, d]) => sub(o, d) ? { titel: `Speziesdossier ${spec.spezies.name} · ${o}`, href: sub(o, d) } : null).filter(Boolean);
if (!quellen.length) quellen.push({ titel: `Speziesdossier ${spec.spezies.name}`, href: speziesSeite });

const inhalt = {
    name: spec.name, genitiv: spec.genitiv, dossierName: spec.dossierName ?? `${spec.name}-Dossier`, klasse: `Planet · ${spec.klasse}`,
    intro: spec.intro,
    globusDaten: { planet: K.slug, klasse: basis.klasse || spec.klasse, radius: planet.radiusKm * 1000 },
    sternenkarte: `Menüs/Sternenkarte/Sternenkarte.html?system=${stern.id}`,
    grunddaten,
    position: [["Sternsystem", sys.systemName], ["Zentralstern", `${stern.name} · ${stern.typ.replace(/^.*\((.*)\)$/, "$1")}${sys.einzelstern ? ", Einzelstern" : ""}`], ["Bahnposition", `${bahnNr}. von ${planetenSys.length} Planeten`], ["Entfernung zur Sonne", `${f(nachbarn.find((n) => n.name === "Sonnensystem")?.lj ?? sys.lage.entfernungLj, 1)} Lichtjahre`], ["Nächste Nachbarsysteme", nachbarn.slice(0, 2).map((n) => `${n.name} (${f(n.lj, 1)} Lj)`).join(", ")]],
    verknuepfungen: verweise, quellen,
    design: { farben: spec.farben },
    kapitel,
};
fs.writeFileSync(ROOT + K.datenDatei.replace(/\.json$/, ".inhalt.json"), JSON.stringify(inhalt, null, 2) + "\n");
const anzahl = Object.values(kapitel).reduce((s, k) => s + k.abschnitte.length, 0);
console.log(`${spec.name}: Inhaltsdatei geschrieben · ${anzahl} Abschnitte · Umlauf ${f(tageUmlauf, 1)} d · Einstrahlung ${f(einstr)} · T_eq ${f(teq, 0)} °C (Ziel ${W.temperaturMittel} °C) · ${lage}`);

if (process.argv.includes("--bauen")) {
    const farbe = `${ROOT}${K.basis}/hauptseite/dossier-farben.css`;
    if (fs.existsSync(farbe)) fs.unlinkSync(farbe);
    for (const s of ["planetendossier.mjs", "kapitel-bauen.mjs"]) console.log(execFileSync("node", [`${ROOT}scripts/planeten/${s}`, spec.ordner], { encoding: "utf8" }).trim());
}
// Rückweg Spezies → Planet: Zuordnung für den Heimatwelt-Kasten auf den Speziesseiten aktualisieren
console.log(execFileSync("node", [`${ROOT}scripts/planeten/heimatwelt-verweise.mjs`], { encoding: "utf8" }).trim());
