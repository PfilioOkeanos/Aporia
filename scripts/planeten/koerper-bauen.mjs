// Körper bauen · gibt jedem Himmelskörper eines Sternsystems der Sternenkarte ein eigenes Dossier (Name, Daten, Verknüpfungen)
// Quelle der Wahrheit ist die Sternenkarte (Menüs/adapter/Sternenkarte/Kartendaten/objekte.json); wo vorhanden, ergänzt die
// Systemdatei (scripts/planeten/systeme/<name>.json) Werte wie Leuchtkraft, Albedo und Masse. Alle Zahlen werden berechnet.
// Das Dossier ist der Archiveintrag, den die Karte als Bild nutzt (archivLink): er bekommt den Namen des Körpers,
// eine <slug>.inhalt.json und wird mit planetendossier.mjs + kapitel-bauen.mjs neu gebaut.
//
// Eigene Texte (optional, leicht änderbar): scripts/planeten/koerper/<objekt-id>.mjs
//   export default { name?, intro?, kapitel: { "<Kapiteltitel>": { intro?, abschnitte: [ … ], ersetzen?: true } } }
//   Abschnitte wie in kapitel-bauen.mjs (text, daten, liste, karten, zeitleiste, balken, schichten, skala, bild, verweise).
//   Ohne ersetzen werden sie an die berechneten Abschnitte angehängt.
// Heimatwelt-Planeten (scripts/planeten/heimatwelten/*.mjs) und das Sonnensystem werden übersprungen.
//
// Aufruf: node scripts/planeten/koerper-bauen.mjs <system> [--bauen] [--nur <objekt-id>]
//   <system> = Systemdatei (nhalyss-system), Stern-ID (iovar-stern) oder „alle“ (alle ausgedachten Systeme)
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { ROOT, findeKoerper } from "./koerper.mjs";
import { ladeKarte, dossierPfad, koerperArg, kartenLink, verweisAuf } from "./karten-verweise.mjs";

const args = process.argv.slice(2);
const bauen = args.includes("--bauen");
const nur = args.includes("--nur") ? args[args.indexOf("--nur") + 1] : null;
const wahl = args.find((a) => !a.startsWith("--") && a !== nur) ?? "alle";

const MU_SONNE = 295.912208, ERDE = 3.0034896e-6, AU_KM = 149597870.7, LJ_AE = 63241.077, R_SONNE = 695700;
const f = (n, d = 2) => Number(n).toLocaleString("de-DE", { maximumFractionDigits: d });
const karte = ladeKarte();
const nachId = new Map(karte.map((o) => [o.id, o]));

// ---------- Systemdateien und Heimatwelten ----------
const systemDateien = fs.readdirSync(`${ROOT}scripts/planeten/systeme`).filter((x) => x.endsWith(".json")).map((x) => ({ datei: x.replace(/\.json$/, ""), def: JSON.parse(fs.readFileSync(`${ROOT}scripts/planeten/systeme/${x}`, "utf8")) }));
const heimat = [];
for (const x of fs.readdirSync(`${ROOT}scripts/planeten/heimatwelten`).filter((x) => x.endsWith(".mjs"))) {
    const s = (await import(pathToFileURL(`${ROOT}scripts/planeten/heimatwelten/${x}`).href)).default;
    heimat.push({ planetId: s.planetId, welt: s.name, spezies: s.spezies.name, seite: s.spezies.seite ?? `inhalte/spezies/${s.spezies.gruppe}/${s.spezies.ordner}/hauptseite/Spezies.html` });
}
// Heimatwelten ohne Beschreibungsdatei (von Hand gebaut)
heimat.push({ planetId: "kharuun-planet", welt: "Kharuun", spezies: "Pyronoiden", seite: "inhalte/spezies/Biologische Spezies/Pyronoiden/hauptseite/Spezies.html" });
const heimatIds = new Set(heimat.map((h) => h.planetId));

const sterne = karte.filter((o) => o.systemName && o.id !== "Kugel 1");
const systeme = wahl === "alle" ? sterne
    : [nachId.get(wahl) ?? nachId.get(systemDateien.find((s) => s.datei === wahl)?.def.stern.id)].filter(Boolean);
if (!systeme.length) throw new Error(`System „${wahl}“ nicht gefunden`);

// ---------- Hilfen ----------
const IST_STERN = /roter zwerg|brauner zwerg|weißer zwerg|hauptreihenstern|riesenstern/i;
const KAT = (o) => o.systemName || IST_STERN.test(o.typ) ? "stern" : /mond/i.test(o.typ) ? "mond" : /komet/i.test(o.typ) && !/gebiet/i.test(o.typ) ? "komet" : /asteroid$/i.test(o.typ) ? "asteroid"
    : /gürtel|ring|gebiet/i.test(o.typ) ? "guertel" : /nebel/i.test(o.typ) ? "nebel" : /gasriese/i.test(o.typ) ? "gas" : /eisriese|eisreicher riesenplanet|neptun/i.test(o.typ) ? "eisriese"
    : /zwerg/i.test(o.typ) ? "zwerg" : /eis/i.test(o.typ) ? "eis" : /ozean/i.test(o.typ) ? "ozean" : "gestein";
const hex = (rgb, k = 1, weiss = 0) => "#" + rgb.map((c) => Math.round(Math.min(255, (c * k + (1 - c * k) * weiss) * 255)).toString(16).padStart(2, "0")).join("");
const tageText = (t) => t > 730 ? `${f(t / 365.25, 1)} Jahre` : t > 2 ? `${f(t, 1)} Tage` : `${f(t * 24, 1)} Stunden`;
// Masse: Erdmassen, Mondmassen oder Kilogramm (wissenschaftliche Schreibweise)
const masseText = (mE) => { if (mE >= 0.05) return `${f(mE, 3)} Erdmassen`; if (mE >= 0.0005) return `${f(mE * 81.3, 3)} Mondmassen`; const kg = mE * 5.972e24, p = Math.floor(Math.log10(kg)); return `${f(kg / 10 ** p, 2)} · 10^${p} kg`; };
const tempWort =(c) => c > 400 ? "glühend heiß" : c > 100 ? "sehr heiß" : c > 40 ? "heiß" : c > -20 ? "gemäßigt" : c > -120 ? "kalt" : "eisig kalt";
const GRUPPE = {
    "Allgemeines": ["Weitere", "▤"], "Astronomie": ["Wissenschaft", "✧"], "Physik": ["Wissenschaft", "⚛"], "Planetare Struktur": ["Wissenschaft", "◈"], "Geografie": ["Natur", "△"],
    "Atmosphäre": ["Natur", "☁"], "Klima": ["Natur", "☀"], "Gewässer": ["Natur", "≈"], "Geologie": ["Wissenschaft", "◈"], "Biosphäre": ["Natur", "❧"], "Spezies": ["Zivilisation", "✿"],
    "Zivilisation": ["Zivilisation", "▥"], "Geschichte": ["Zivilisation", "▤"], "Fraktionen": ["Zivilisation", "◇"], "Rohstoffe": ["Weitere", "⬡"], "Erforschung": ["Weitere", "✧"],
    "Besonderheiten": ["Weitere", "✺"], "Medienarchiv": ["Weitere", "▣"], "Mutterplanet": ["Wissenschaft", "◐"], "Gezeiten": ["Natur", "≈"], "Gebundene Rotation": ["Wissenschaft", "↻"],
    "Spektralklasse": ["Wissenschaft", "✦"], "Fusion": ["Wissenschaft", "☀"], "Leuchtkraft": ["Wissenschaft", "☀"], "Lebenszyklus": ["Wissenschaft", "⧗"], "Umgebung": ["Wissenschaft", "✧"],
    "Kern": ["Wissenschaft", "◈"], "Koma": ["Natur", "☁"], "Schweif": ["Natur", "☄"], "Umlaufbahn": ["Wissenschaft", "◌"], "Zusammensetzung": ["Wissenschaft", "◈"], "Bahn": ["Wissenschaft", "◌"],
    "Herkunft": ["Weitere", "⧗"], "Zentralsterne": ["Wissenschaft", "✦"], "Planeten": ["Wissenschaft", "◍"], "Bahnen": ["Wissenschaft", "◌"], "Stabilität": ["Wissenschaft", "⚖"],
    "Gas": ["Natur", "☁"], "Staub": ["Natur", "☁"], "Ionisation": ["Wissenschaft", "⚛"], "Sternentstehung": ["Natur", "✦"],
};

// ---------- je Körper: Werte berechnen ----------
function werte(o, star, sysDef) {
    const def = sysDef ? (o.id === star.id ? sysDef.stern : sysDef.koerper.find((k) => k.id === o.id)) ?? {} : {};
    const kat = KAT(o);
    const begleiter = kat === "stern" && !o.systemName;
    const lum = (m) => m < 0.43 ? 0.23 * m ** 2.3 : m ** 4;
    const quelle = begleiter ? o : star;
    const M = quelle.gravitationMu / MU_SONNE, Rst = (quelle.radiusKm ?? 0) / R_SONNE;
    const L = (begleiter ? def.leuchtkraftSonne : sysDef?.stern.leuchtkraftSonne) ?? lum(M);
    const T = (begleiter ? def.temperaturK : sysDef?.stern.temperaturK) ?? Math.round(5772 * (L / Math.max(Rst, 0.05) ** 2) ** 0.25);
    const alter = sysDef?.stern.alterMrd ?? null;
    const elter = nachId.get(o.bahnUm ?? o.ringUm) ?? null;
    const umBegleiter = !!elter && elter.id !== star.id && KAT(elter) === "stern";   // Planet eines Begleitsterns
    const umStern = !elter || elter.id === star.id || umBegleiter;
    const Lwirt = umBegleiter ? (systemDateien.flatMap((s) => s.def.koerper).find((k) => k.id === elter.id)?.leuchtkraftSonne ?? lum(elter.gravitationMu / MU_SONNE)) : L;
    const aAE = o.orbit ? o.orbit.a / 100 : null;
    const abstandStern = umStern ? aAE : elter?.orbit ? elter.orbit.a / 100 : null;
    const rKm = o.radiusKm ?? def.radiusKm ?? null;
    const albedo = def.albedo ?? { gas: 0.42, eisriese: 0.3, eis: 0.55, komet: 0.04, asteroid: 0.1, mond: 0.12, zwerg: 0.4, ozean: 0.3 }[kat] ?? 0.2;
    let mE = def.masseErde ?? (o.gravitationMu ? o.gravitationMu / (MU_SONNE * ERDE) : 0);
    const rE = rKm ? rKm / 6371 : null;
    let dichte = mE > 0 && rE ? 5.514 * mE / rE ** 3 : { komet: 0.6, asteroid: 2.7 }[kat] ?? null;
    if (!(mE > 0) && rE && dichte) mE = dichte / 5.514 * rE ** 3;
    const g = mE > 0 && rE ? mE / rE ** 2 : null;
    const vEsc = mE > 0 && rE ? 11.186 * Math.sqrt(mE / rE) : null;
    const teq = abstandStern ? 278.6 * Lwirt ** 0.25 / Math.sqrt(abstandStern) * (1 - albedo) ** 0.25 - 273.15 : null;
    const ringe = o.ringe ? o.ringe.map((r) => r / 100) : null;
    return { begleiter, umBegleiter, wirt: umBegleiter ? elter : star, Lwirt, def, kat, M, Rst, L, T, alter, elter, umStern, aAE, abstandStern, rKm, mE, dichte, g, vEsc, teq, ringe, albedo, tage: o.orbit?.tage ?? null, e: o.orbit?.e ?? def.e ?? 0, i: o.orbit?.i ?? def.i ?? 0 };
}

// ---------- Inhalte ----------
function baueInhalt(o, star, sysDef, K, basis) {
    const w = werte(o, star, sysDef);
    const sysName = star.systemName, starId = star.id;
    const koerper = karte.filter((x) => x.systemId === starId);
    const planeten = koerper.filter((x) => x.bahnUm === starId && ["gestein", "ozean", "eis", "gas", "eisriese", "zwerg"].includes(KAT(x))).sort((a, b) => a.orbit.a - b.orbit.a);
    const monde = koerper.filter((x) => x.bahnUm === o.id).sort((a, b) => a.orbit.a - b.orbit.a);
    const geschwister = w.elter && !w.umStern ? koerper.filter((x) => x.bahnUm === w.elter.id) : [];
    const hw = heimat.find((h) => koerper.some((x) => x.id === h.planetId));
    const hwObj = hw ? nachId.get(hw.planetId) : null;
    const name = o.name, GEN = `von ${name}`;
    const ist = (...k) => k.includes(w.kat);
    const planetArt = ist("gestein", "ozean", "eis", "gas", "eisriese", "zwerg");
    const L_ = (x) => verweisAuf(x);

    // Steckbrief / Grunddaten
    const daten = [["Typ", o.typ], ["Sternsystem", sysName]];
    if (!ist("stern")) daten.push(["Zentralkörper", w.elter?.name ?? star.name]);
    if (ist("stern")) daten.push(["Masse", `${f(w.M)} Sonnenmassen`], ["Radius", `${f(w.Rst)} Sonnenradien`], ["Leuchtkraft", `${f(w.L, 4)} Sonnenleuchtkräfte`], ["Oberflächentemperatur", `ca. ${f(w.T, 0)} K`], ...(w.alter ? [["Alter", `ca. ${f(w.alter, 1)} Mrd. Jahre`]] : []));
    if (w.ringe) daten.push([w.umStern ? "Ausdehnung" : "Ringbereich", w.umStern ? `${f(w.ringe[0], 2)}–${f(w.ringe.at(-1), 2)} AE` : `${f(w.ringe[0] * AU_KM, 0)}–${f(w.ringe.at(-1) * AU_KM, 0)} km vom Zentrum`]);
    if (w.aAE && (!ist("stern") || w.begleiter)) daten.push(["Große Halbachse", w.umStern ? `${f(w.aAE, 3)} AE` : `${f(w.aAE * AU_KM, 0)} km`]);
    if (w.tage) daten.push(["Umlaufzeit", tageText(w.tage)]);
    if (w.rKm && !ist("stern", "guertel")) daten.push(["Durchmesser", `${f(w.rKm * 2, 0)} km`]);
    if (w.mE > 0 && !ist("stern", "guertel", "nebel")) daten.push(["Masse", masseText(w.mE)]);
    if (w.g && !ist("stern", "guertel", "nebel")) daten.push(["Schwerkraft", w.g >= 0.01 ? `${f(w.g, 2)} g` : `${f(w.g * 9.81 * 100, 2)} cm/s²`]);
    if (w.teq != null && !ist("stern", "nebel")) daten.push(["Gleichgewichtstemperatur", `ca. ${f(w.teq, 0)} °C`]);
    if (monde.length) daten.push([ist("stern") ? "Planeten" : "Monde", `${monde.length} (${monde.map((m) => m.name).join(", ")})`]);

    // Bausteine
    const satz = w.begleiter ? `${name} ist ein Begleitstern von ${star.name} und umkreist ihn in rund ${f(w.aAE, 0)} AE Abstand – ein Umlauf dauert ${tageText(w.tage)}.` : ist("stern") ? `${name} ist der Zentralstern des ${sysName}s.` : w.umBegleiter ? `${name} umkreist den Begleitstern ${w.elter.name} in ${f(w.aAE, 3)} AE Abstand und braucht für einen Umlauf ${tageText(w.tage)}.` : ist("guertel") ? `${name} umgibt ${w.elter?.name ?? star.name} im ${sysName}.`
        : ist("mond") ? `${name} umkreist ${w.elter.name} in ${tageText(w.tage)}.` : `${name} umkreist ${star.name} in ${f(w.aAE, 3)} AE Abstand und braucht für einen Umlauf ${tageText(w.tage)}.`;
    const heimatHinweis = hw && hwObj?.id !== o.id ? { titel: `Im System von ${hw.welt}`, text: [`Das ${sysName} ist die Heimat der ${hw.spezies}: Ihr Planet ${hw.welt} umkreist ${star.name}${ist("mond") && w.elter?.id === hwObj.id ? `, und ${name} ist einer seiner Monde` : ""}.`], verweise: [L_(hwObj), [`Speziesdossier ${hw.spezies}`, hw.seite]] } : null;
    const begleitsterne = koerper.filter((x) => KAT(x) === "stern");
    const systemListe = { titel: "Körper des Systems", zeitleiste: [[`${star.name} · Stern`, star.typ], ...begleitsterne.map((b) => [`${b.name} · Begleitstern in ${f(b.orbit.a / 100, 0)} AE${b.id === o.id ? " · dieses Dossier" : ""}`, b.typ]), ...planeten.map((p) => [`${p.name} · ${f(p.orbit.a / 100, 2)} AE${p.id === o.id ? " · dieses Dossier" : ""}`, p.typ]), ...koerper.filter((x) => KAT(x) === "guertel" && x.ringUm === starId).map((x) => [`${x.name} · ${f(x.ringe[0] / 100, 1)}–${f(x.ringe.at(-1) / 100, 1)} AE`, x.typ])],
        verweise: [star, ...begleitsterne, ...planeten].filter((x) => x.id !== o.id).slice(0, 10).map((x) => L_(x)) };
    const bahn = w.tage ? { titel: "Bahn", daten: [["Zentralkörper", w.elter?.name ?? star.name], ["Große Halbachse", w.umStern ? `${f(w.aAE, 4)} AE (${f(w.aAE * 149.6, 1)} Mio. km)` : `${f(w.aAE * AU_KM, 0)} km`], ["Exzentrizität", f(w.e, 3)], ["Bahnneigung", `${f(w.i, 1)}°`], ["Umlaufzeit", tageText(w.tage)], ...(w.umStern ? [["Einstrahlung", `${f(w.Lwirt / w.aAE ** 2, 3)}-fach der Erde`]] : [])] } : null;
    const physik = w.rKm && !ist("stern", "guertel", "nebel") ? { titel: "Kerndaten", daten: [["Radius", `${f(w.rKm, 0)} km`], ...(w.mE > 0 ? [["Masse", masseText(w.mE)]] : []), ...(w.dichte ? [["Mittlere Dichte", `${f(w.dichte, 2)} g/cm³`]] : []), ...(w.g ? [["Oberflächenschwerkraft", `${f(w.g * 9.81, 2)} m/s² (${f(w.g, 3)} g)`]] : []), ...(w.vEsc ? [["Fluchtgeschwindigkeit", `${f(w.vEsc, 2)} km/s`]] : [])],
        ...(w.mE >= 0.05 && planetArt ? { vergleich: { mit: "Erde", werte: [["Durchmesser", Math.round(w.rKm * 2), 12742, "km"], ["Masse", +w.mE.toFixed(3), 1, "Erdmassen"], ["Schwerkraft", +w.g.toFixed(2), 1, "g"]] } } : {}) } : null;
    const schichten = {
        stern: [["Korona", "Dünne, sehr heiße äußere Atmosphäre"], ["Photosphäre", `Sichtbare Oberfläche, ca. ${f(w.T, 0)} K`], ["Konvektionszone", "Energietransport durch aufsteigendes Plasma"], ...(w.M > 0.35 ? [["Strahlungszone", "Energietransport durch Strahlung"]] : []), ["Kern", "Wasserstofffusion zu Helium"]],
        gas: [["Wolkendecke", "Ammoniak- und Wasserwolken in Bändern"], ["Wasserstoffhülle", "Molekularer Wasserstoff und Helium"], ["Metallischer Wasserstoff", "Leitfähige Schicht unter extremem Druck – Ursprung des Magnetfelds"], ["Kern", "Gestein und Eis"]],
        eisriese: [["Atmosphäre", "Wasserstoff, Helium und Methan"], ["Eismantel", "Wasser, Ammoniak und Methan unter hohem Druck"], ["Kern", "Gestein und Metall"]],
        eis: [["Eiskruste", "Gefrorenes Wasser und flüchtige Stoffe"], ["Eismantel", "Hochdruckeis, eventuell mit flüssigen Schichten"], ["Kern", "Gestein"]],
        ozean: [["Ozean", "Globale Wasserschicht"], ["Meeresboden", "Basaltische Kruste"], ["Mantel", "Silikatgestein"], ["Kern", "Eisen und Nickel"]],
        komet: [["Staubkruste", "Dunkle, kohlenstoffreiche Oberfläche"], ["Eis-Staub-Gemisch", "Wassereis, Kohlendioxid und Staub"], ["Kern", "Lockeres Eis-Gestein-Gemenge"]],
        asteroid: w.rKm && w.rKm < 60 ? [["Regolith", "Staub und Gesteinsschutt"], ["Trümmerkörper", "Lose zusammengehaltene Gesteinsbrocken"]] : [["Regolith", "Staub und Gesteinsschutt"], ["Gesteinsmantel", "Silikate und Metalle"], ["Kern", "Metallreich"]],
    }[w.kat] ?? (w.rKm && w.rKm > 400 ? [["Kruste", "Silikatgestein"], ["Mantel", "Dichteres Silikatgestein"], ["Kern", "Eisen und Nickel"]] : null);
    const atmo = ist("gas") ? [["Wasserstoff", 86], ["Helium", 13], ["Methan und Spurengase", 1]] : ist("eisriese") ? [["Wasserstoff", 80], ["Helium", 17], ["Methan", 2.3], ["Spurengase", 0.7]]
        : planetArt && w.mE >= 0.3 && w.teq != null && w.teq < 300 ? (w.teq > 60 ? [["Kohlendioxid", 95], ["Stickstoff", 3.5], ["Argon und Spurengase", 1.5]] : [["Kohlendioxid", 62], ["Stickstoff", 33], ["Argon", 5]]) : null;
    const atmoText = atmo ? (ist("gas", "eisriese") ? `${name} besitzt keine feste Oberfläche; die Hülle geht nach innen allmählich in dichtere Schichten über.` : w.teq > 60 ? `Eine dichte, kohlendioxidreiche Hülle staut die Wärme ${GEN}.` : `${name} hält eine dünne, kalte Gashülle fest.`)
        : `${name} besitzt keine nennenswerte Atmosphäre${w.mE > 0 && w.mE < 0.3 ? " – dafür ist die Schwerkraft zu gering" : w.teq > 300 ? " – die Hitze hat flüchtige Stoffe längst entweichen lassen" : ""}.`;
    const besonders = [];
    if (planetArt && planeten.length > 1) {
        if (planeten[0].id === o.id) besonders.push(`Innerster Planet des ${sysName}s`);
        if (planeten.at(-1).id === o.id) besonders.push(`Äußerster Planet des ${sysName}s`);
        if ([...planeten].sort((a, b) => (b.radiusKm ?? 0) - (a.radiusKm ?? 0))[0].id === o.id) besonders.push(`Größter Planet des ${sysName}s`);
    }
    if (ist("mond") && geschwister.length > 1 && [...geschwister].sort((a, b) => (b.radiusKm ?? 0) - (a.radiusKm ?? 0))[0].id === o.id) besonders.push(`Größter Mond von ${w.elter.name}`);
    if (o.anomalie || w.def.anomalie) besonders.push("Als Anomalie in der Sternenkarte verzeichnet");
    if (monde.length) besonders.push(`${ist("stern") ? (monde.length === 1 ? "Ein eigener Planet" : monde.length + " eigene Planeten") : monde.length === 1 ? "Ein Mond" : monde.length + " Monde"}: ${monde.map((m) => m.name).join(", ")}`);
    const mondKarten = monde.length ? { titel: ist("stern") ? "Planeten" : "Monde", karten: monde.map((m) => ({ titel: m.name, text: `${m.radiusKm ? f(m.radiusKm * 2, 0) + " km Durchmesser, " : ""}Umlauf in ${tageText(m.orbit.tage)}. ${m.beschreibung ?? ""}`.trim() })), verweise: monde.map((m) => L_(m)) } : null;
    const temp = w.teq != null ? { titel: "Temperatur", text: [`Bei ${f(w.abstandStern, 3)} AE Abstand zu ${w.wirt.name} liegt die Gleichgewichtstemperatur ${GEN} bei rund ${f(w.teq, 0)} °C – ${tempWort(w.teq)}.${atmo && !ist("gas", "eisriese") && w.teq > 60 ? " Die dichte Gashülle heizt die Oberfläche zusätzlich auf." : ""}`] } : null;
    const offen = { stern: ["Wie stark schwankt die magnetische Aktivität?", "Wie hat sich die Leuchtkraft seit der Entstehung verändert?"], gas: ["Wie tief reichen die Wolkenbänder?", "Wie groß ist der feste Kern?"], eisriese: ["Gibt es flüssige Schichten im Eismantel?", "Wie entstand die Achslage?"],
        mond: ["Ist der Mond eingefangen oder mit seinem Planeten entstanden?", "Welche Spuren tragen seine ältesten Krater?"], komet: ["Woher stammt der Komet genau?", "Wie lange übersteht sein Kern noch die Annäherungen an den Stern?"], asteroid: ["Ist der Körper ein Bruchstück eines größeren Körpers?", "Welche Rohstoffe birgt er?"],
        guertel: ["Wie viel Masse enthält das Gebiet insgesamt?", "Welche Resonanzen formen seine Ränder?"], nebel: ["Welche Sterne beleuchten den Nebel?", "Entstehen in ihm neue Sterne?"] }[w.kat] ?? ["Wie ist der innere Aufbau beschaffen?", "Gab es früher eine dichtere Atmosphäre?"];
    if (o.anomalie || w.def.anomalie) offen.unshift(`Was steckt hinter den Besonderheiten ${GEN}?`);
    const rohstoffe = { gas: ["Wasserstoff", "Helium-3", "Ammoniak"], eisriese: ["Wasserstoff", "Methan", "Wassereis"], eis: ["Wassereis", "Flüchtige Stoffe"], komet: ["Wassereis", "Organische Verbindungen", "Staub"], asteroid: ["Silikate", "Eisen und Nickel", "Seltene Metalle"], guertel: ["Silikate", "Metalle", "Eis (äußere Bereiche)"], stern: ["Energie (Strahlung)"], nebel: ["Gas", "Staub"] }[w.kat] ?? ["Silikatgestein", "Metallerze"];
    const allgemeines = [{ titel: "Kurzprofil", bild: true, bildtext: `${name}`, text: [o.beschreibung ?? "", satz].filter(Boolean) }, { titel: "Steckbrief", daten }, heimatHinweis].filter(Boolean);

    const A = {
        "Allgemeines": { intro: `${name} auf einen Blick.`, abschnitte: allgemeines },
        "Astronomie": { intro: ist("stern") ? `${name} im Raum.` : `${name} im ${sysName}.`, abschnitte: [bahn, ist("stern") && !w.begleiter ? { titel: "Lage im Raum", daten: [["Entfernung zur Sonne", `${f(star.distanzLichtjahre ?? 0, 1)} Lichtjahre`], ["Nächste Nachbarsysteme", nachbarn(star).slice(0, 3).map((n) => `${n.name} (${f(n.lj, 1)} Lj)`).join(", ")]] } : null,
            planetArt && w.umStern ? { titel: `Am Himmel ${GEN}`, text: [`${w.wirt.name} erscheint von hier aus etwa ${f(0.53 * (w.wirt.radiusKm ?? 0) / R_SONNE / w.aAE, 2)}° groß (die Sonne von der Erde: 0,53°).`] } : null, systemListe].filter(Boolean) },
        "Physik": { abschnitte: [physik ?? { titel: "Physik", daten: daten.slice(2) }] },
        "Planetare Struktur": { abschnitte: schichten ? [{ titel: "Schalenbau", schichten }] : [] },
        "Geografie": { abschnitte: [{ titel: "Oberfläche", text: [ist("gas", "eisriese") ? `${name} besitzt keine feste Oberfläche. Sichtbar sind Wolkenbänder, Wirbel und Stürme.` : `Die Oberfläche ${GEN} ist ${tempWort(w.teq ?? 0)}${w.mE > 0 && w.mE < 0.3 ? " und von Einschlagkratern geprägt" : ""}.`] }] },
        "Atmosphäre": { abschnitte: [{ titel: "Gashülle", text: [atmoText], ...(atmo ? { balken: { werte: atmo } } : {}) }] },
        "Klima": { abschnitte: [temp].filter(Boolean) },
        "Gewässer": { abschnitte: [{ titel: "Wasser", text: [ist("eis") ? `Wasser kommt ${GEN} gefroren vor; unter dem Eis sind flüssige Schichten möglich.` : ist("gas", "eisriese") ? "Wasser liegt in den Wolkenschichten und tief im Inneren unter hohem Druck vor." : w.teq != null && w.teq > 100 ? "Für flüssiges Wasser ist es viel zu heiß." : w.teq != null && w.teq < -20 ? "Wasser gibt es höchstens als Eis in Kratern und im Untergrund." : "Offene Gewässer sind nicht verzeichnet."] }] },
        "Geologie": { abschnitte: [{ titel: "Geologie", text: [ist("gas", "eisriese") ? "Ohne feste Oberfläche gibt es keine Geologie im engeren Sinn; im Inneren herrschen extreme Drücke und Temperaturen." : w.mE > 0.3 ? `${name} ist groß genug, um im Inneren noch Wärme zu speichern; Spuren alter vulkanischer Tätigkeit sind wahrscheinlich.` : `${name} ist geologisch weitgehend erstarrt; Einschläge haben seine Oberfläche geformt.`] }] },
        "Biosphäre": { abschnitte: [{ titel: "Leben", text: [`${GEN.replace(/^von/, "Auf")} ist kein Leben verzeichnet.`.replace(/^Auf (.)/, (m, c) => "Auf " + c)] }] },
        "Spezies": { abschnitte: [{ titel: "Bewohner", text: [`${name} ist keine Heimat einer intelligenten Spezies.`] }, heimatHinweis].filter(Boolean) },
        "Zivilisation": { abschnitte: [{ titel: "Siedlungen", text: [`${GEN.replace(/^von/, "Für")} sind keine dauerhaften Siedlungen verzeichnet.`] }, heimatHinweis].filter(Boolean) },
        "Geschichte": { abschnitte: [{ titel: "Entstehung", text: [ist("komet") ? `${name} stammt aus den kalten Außenbereichen des ${sysName}s und wurde auf seine heutige, langgestreckte Bahn gelenkt.` : ist("asteroid", "guertel") ? `${name} besteht aus Material, das sich bei der Entstehung des ${sysName}s nicht zu einem Planeten vereinte.` : `${name} entstand zusammen mit dem ${sysName}${w.alter ? ` vor rund ${f(w.alter, 1)} Milliarden Jahren` : ""}.`] }] },
        "Fraktionen": { abschnitte: [{ titel: "Ansprüche", text: [`${GEN.replace(/^von/, "Für")} sind keine Fraktionsansprüche verzeichnet.`] }] },
        "Rohstoffe": { abschnitte: [{ titel: "Rohstoffe", liste: rohstoffe }] },
        "Erforschung": { abschnitte: [{ titel: "Offene Fragen", liste: offen }, { titel: "In der Sternenkarte", text: [`${name} ist mit allen Bahndaten im ${sysName} der Sternenkarte eingetragen.`], verweise: [["In der Sternenkarte zeigen", kartenLink(starId, o.id)]] }] },
        "Besonderheiten": { abschnitte: [{ titel: "Besonderheiten", liste: besonders.length ? besonders : [o.beschreibung ?? name] }, mondKarten].filter(Boolean) },
        "Medienarchiv": { abschnitte: [{ titel: `${name} – Archivbild`, bild: true, bildtext: name }] },
        "Mutterplanet": { abschnitte: w.elter ? [{ titel: w.elter.name, text: [w.elter.beschreibung ?? ""].filter(Boolean), daten: [["Typ", w.elter.typ], ...(w.elter.radiusKm ? [["Durchmesser", `${f(w.elter.radiusKm * 2, 0)} km`]] : []), w.ringe ? ["Ringbereich", `${f(w.ringe[0] * AU_KM, 0)}–${f(w.ringe.at(-1) * AU_KM, 0)} km vom Zentrum`] : ["Abstand des Mondes", `${f(w.aAE * AU_KM, 0)} km (${f(w.aAE * AU_KM / (w.elter.radiusKm ?? 1), 1)} Planetenradien)`]], verweise: [L_(w.elter)] }, geschwister.length > 1 ? { titel: `Weitere Monde von ${w.elter.name}`, liste: geschwister.filter((x) => x.id !== o.id).map((x) => `${x.name} – Umlauf in ${tageText(x.orbit.tage)}`), verweise: geschwister.filter((x) => x.id !== o.id).map((x) => L_(x)) } : null].filter(Boolean) : [] },
        "Gezeiten": { abschnitte: w.ringe && w.elter ? [{ titel: "Gezeitenkräfte", text: [`Die Teilchen ${GEN} kreisen innerhalb der Roche-Grenze von ${w.elter.name}. Dort sind die Gezeitenkräfte stärker als die gegenseitige Anziehung der Brocken – sie können sich nicht zu einem Mond zusammenballen.`] }] : w.elter ? [{ titel: "Gezeitenkräfte", text: [`Auf seiner Bahn in ${f(w.aAE * AU_KM, 0)} km Abstand wirken starke Gezeitenkräfte von ${w.elter.name} auf ${name}.${w.e > 0.02 ? ` Die leicht exzentrische Bahn (e = ${f(w.e, 3)}) knetet das Innere bei jedem Umlauf.` : ""}`] }] : [] },
        "Gebundene Rotation": { abschnitte: w.ringe && w.elter ? [{ titel: "Bewegung der Teilchen", text: [`Ein Ring dreht sich nicht als Ganzes: Jedes Teilchen ${GEN} folgt seiner eigenen Bahn. Innen umrunden sie ${w.elter.name} schneller als außen – nach den keplerschen Gesetzen.`] }] : w.elter ? [{ titel: "Rotation", text: [`${name} wendet ${w.elter.name} vermutlich stets dieselbe Seite zu: Ein Tag dauert so lange wie ein Umlauf – ${tageText(w.tage)}.`] }] : [] },
        "Spektralklasse": { abschnitte: [{ titel: "Einordnung", daten: [["Typ", o.typ], ["Oberflächentemperatur", `ca. ${f(w.T, 0)} K`], ["Farbe", w.T > 6000 ? "gelbweiß" : w.T > 5200 ? "gelb" : w.T > 3900 ? "orange" : "rot"]] }] },
        "Fusion": { abschnitte: [{ titel: "Energiequelle", text: [`Im Kern von ${name} verschmilzt Wasserstoff zu Helium.${w.M < 0.35 ? " Der Stern ist vollständig konvektiv und mischt seinen Brennstoff durch." : ""}`] }] },
        "Leuchtkraft": { abschnitte: [{ titel: "Strahlung", daten: [["Leuchtkraft", `${f(w.L, 4)} Sonnenleuchtkräfte`], ["Habitable Zone", `${f(Math.sqrt(w.L / 1.1), 2)}–${f(Math.sqrt(w.L / 0.36), 2)} AE`]] }] },
        "Lebenszyklus": { abschnitte: [{ titel: "Lebensdauer", text: [`Ein Stern mit ${f(w.M)} Sonnenmassen bleibt rund ${f(10 * w.M ** -2.5, 0)} Milliarden Jahre auf der Hauptreihe${w.alter ? `; ${name} ist etwa ${f(w.alter, 1)} Milliarden Jahre alt` : ""}.`] }] },
        "Umgebung": { abschnitte: [systemListe, ist("stern") ? { titel: "Nachbarsysteme", liste: nachbarn(star).slice(0, 5).map((n) => `${n.name} – ${f(n.lj, 1)} Lichtjahre`) } : null].filter(Boolean) },
        "Kern": { abschnitte: [{ titel: "Kometenkern", text: [`Der Kern ${GEN} misst rund ${f((w.rKm ?? 5) * 2, 0)} km und besteht aus einem lockeren Gemenge aus Eis, Staub und Gestein.`], ...(schichten ? { schichten } : {}) }] },
        "Koma": { abschnitte: [{ titel: "Koma", text: [`Nähert sich ${name} dem Stern ${star.name}, verdampft Eis und bildet eine leuchtende Gashülle um den Kern.`] }] },
        "Schweif": { abschnitte: [{ titel: "Schweif", text: [o.beschreibung ?? `In Sternnähe bildet ${name} Staub- und Ionenschweife.`] }] },
        "Umlaufbahn": { abschnitte: [bahn, w.aAE ? { titel: "Sternnächster und fernster Punkt", daten: [["Perihel", `${f(w.aAE * (1 - w.e), 2)} AE`], ["Aphel", `${f(w.aAE * (1 + w.e), 2)} AE`]] } : null].filter(Boolean) },
        "Zusammensetzung": { abschnitte: [{ titel: "Material", liste: rohstoffe, ...(schichten ? { schichten } : {}) }] },
        "Bahn": { abschnitte: [bahn].filter(Boolean) },
        "Herkunft": { abschnitte: [{ titel: "Herkunft", text: [`${name} ist ein Überrest aus der Entstehungszeit des ${sysName}s.`] }] },
        "Zentralsterne": { abschnitte: [{ titel: star.name, text: [star.beschreibung ?? ""], verweise: [L_(star)] }] },
        "Planeten": { abschnitte: [systemListe] },
        "Bahnen": { abschnitte: [{ titel: "Lage", daten: daten.filter(([k]) => /Ausdehnung|Ringbereich|Zentralkörper/.test(k)) }] },
        "Stabilität": { abschnitte: [{ titel: "Stabilität", text: [w.umStern ? `Die Brocken ${GEN} bewegen sich auf stabilen Bahnen zwischen den Planeten; Resonanzen mit den großen Planeten formen die Ränder des Gebiets.` : `Der Ring liegt innerhalb der Roche-Grenze von ${w.elter?.name}: Seine Teilchen können sich dort nicht zu einem Mond zusammenballen.`] }] },
        "Gas": { abschnitte: [{ titel: "Gas", text: ["Der Nebel besteht überwiegend aus Wasserstoff und Helium."] }] },
        "Staub": { abschnitte: [{ titel: "Staub", text: ["Feiner Staub streut das Licht benachbarter Sterne und lässt den Nebel bläulich leuchten."] }] },
        "Ionisation": { abschnitte: [{ titel: "Ionisation", text: ["Ein Reflexionsnebel leuchtet nicht selbst, sondern streut das Licht naher Sterne."] }] },
        "Sternentstehung": { abschnitte: [{ titel: "Sternentstehung", text: ["Ob im Nebel neue Sterne entstehen, ist nicht bekannt."] }] },
    };

    // Kapitel zusammenstellen (Titel aus dem Archiv) und eigene Texte einmischen
    const extra = eigeneTexte(o.id);
    const kapitel = {};
    for (const k of basis.kapitel) {
        const auto = A[k.titel] ?? { abschnitte: [{ titel: k.titel, text: [o.beschreibung ?? name] }] };
        const e = extra?.kapitel?.[k.titel] ?? {};
        const [gruppe, icon] = GRUPPE[k.titel] ?? ["Weitere", "◆"];
        const abschnitte = e.ersetzen ? e.abschnitte ?? [] : [...auto.abschnitte, ...(e.abschnitte ?? [])];
        kapitel[k.titel] = { gruppe, icon, intro: e.intro ?? auto.intro ?? `${k.titel} ${GEN}.`, abschnitte: abschnitte.length ? abschnitte : [{ titel: k.titel, text: [o.beschreibung ?? name] }] };
    }
    const rgb = o.color ?? [0.6, 0.6, 0.65];
    const texturKlasse = { stern: "Vulkan", komet: "Eis", eis: "Eis", eisriese: "Eisriese", gas: "Gasriese", ozean: "Ozean", nebel: "Gasriese" }[w.kat] ?? (rgb[2] > rgb[0] + 0.08 ? "Eis" : "Gestein");
    const position = [["Sternsystem", sysName], ...(ist("stern") && !w.begleiter ? [["Entfernung zur Sonne", `${f(star.distanzLichtjahre ?? 0, 1)} Lichtjahre`], ["Nächste Nachbarsysteme", nachbarn(star).slice(0, 2).map((n) => `${n.name} (${f(n.lj, 1)} Lj)`).join(", ")]] : [["Zentralstern", star.name, dossierPfad(star)], ...(w.elter && !w.umStern ? [["Umläuft", w.elter.name, dossierPfad(w.elter)]] : []), ...(w.aAE ? [["Abstand", w.umStern ? `${f(w.aAE, 3)} AE` : `${f(w.aAE * AU_KM, 0)} km`]] : [])])];
    const verweise = [
        { icon: "✦", art: "Sternenkarte", titel: `${name} im ${sysName}`, href: kartenLink(starId, o.id), route: null },
        ...(!ist("stern") || w.begleiter ? [{ icon: "☀", art: "Zentralstern", titel: star.name, href: L_(star)[1], route: null }] : []),
        ...(w.elter && !w.umStern ? [{ icon: "◍", art: ist("guertel") ? "Planet" : "Mutterplanet", titel: w.elter.name, href: L_(w.elter)[1], route: null }] : []),
        ...monde.map((m) => ({ icon: "◐", art: ist("stern") ? "Planet" : "Mond", titel: m.name, href: L_(m)[1], route: null })),
        ...(hw && hwObj.id !== o.id ? [{ icon: "✿", art: `Heimatwelt der ${hw.spezies}`, titel: hw.welt, href: L_(hwObj)[1], route: null }, { icon: "◈", art: "Spezies-Dossier", titel: hw.spezies, href: hw.seite, route: null }] : []),
    ];
    return {
        name: extra?.name ?? name, genitiv: GEN, dossierName: `${extra?.name ?? name}-Dossier`, klasse: `${o.typ}`,
        intro: extra?.intro ?? [o.beschreibung, satz].filter(Boolean).join(" "),
        globusDaten: { planet: K.slug, klasse: texturKlasse, radius: Math.round((w.rKm ?? 1000) * 1000) },
        sternenkarte: kartenLink(starId, o.id),
        grunddaten: [["System-ID", o.id], ["Archiv-ID", basis.grunddaten.find(([k]) => k === "Archiv-ID")?.[1] ?? "-"], ...daten],
        position, verknuepfungen: [...verweise, ...(extra?.verknuepfungen ?? [])],
        quellen: [{ titel: `Sternenkarte · ${sysName}`, href: kartenLink(starId, o.id) }, ...(hw ? [{ titel: `Speziesdossier ${hw.spezies}`, href: hw.seite }] : [])],
        design: { farben: { nacht: hex(rgb, 0.05), tiefe: hex(rgb, 0.11), akzent: hex(rgb, 1, 0.35), sand: hex([rgb[0], rgb[1] * 0.92, rgb[2] * 0.7], 1, 0.4), moos: hex([rgb[0] * 0.8, rgb[1], rgb[2] * 0.75], 1, 0.25), ozean: hex([rgb[0] * 0.6, rgb[1] * 0.85, rgb[2]], 1, 0.2), glas: "rgba(8, 12, 18, .76)", "glas-hell": "rgba(16, 22, 32, .82)", linie: "rgba(255, 255, 255, .12)", "linie-hell": "rgba(255, 255, 255, .3)", text: "#eef2f6", leise: "#a8b0bc", "aporia-page-tint": hex(rgb, 0.45) },
            ...(ist("komet") ? { schichten: [["Orbit", "Umlaufbahn"], ["Hülle", "Schweif"], ["Hülle", "Koma"], ["Kern", "Kern"]] } : ist("stern") ? { schichten: [["Strahlung", "Leuchtkraft"], ["Hülle", "Spektralklasse"], ["Kern", "Fusion"], ["Zeit", "Lebenszyklus"]] } : ist("asteroid") ? { schichten: [["Orbit", "Bahn"], ["Material", "Zusammensetzung"], ["Zeit", "Herkunft"]] } : ist("guertel") ? { schichten: [["Lage", "Bahnen"], ["System", "Planeten"], ["Dynamik", "Stabilität"]] } : ist("mond") ? { schichten: [["Orbit", "Astronomie"], ["Planet", "Mutterplanet"], ["Kräfte", "Gezeiten"], ["Tiefe", "Geologie"]] } : {}) },
        kapitel,
    };
}

function nachbarn(star) {
    return sterne.filter((s) => s.id !== star.id).concat(karte.filter((o) => o.id === "Kugel 1"))
        .map((s) => ({ name: s.systemName ?? "Sonnensystem", lj: Math.hypot(...s.position.map((x, i) => x - star.position[i])) / 100 / LJ_AE })).sort((a, b) => a.lj - b.lj);
}
const extraCache = new Map();
function eigeneTexte(id) { return extraCache.get(id) ?? null; }
for (const x of fs.existsSync(`${ROOT}scripts/planeten/koerper`) ? fs.readdirSync(`${ROOT}scripts/planeten/koerper`).filter((x) => x.endsWith(".mjs")) : []) {
    extraCache.set(x.replace(/\.mjs$/, ""), (await import(pathToFileURL(`${ROOT}scripts/planeten/koerper/${x}`).href)).default);
}

// ---------- Ablauf ----------
const KENNUNG = "koerper-bauen";   // steht in jeder erzeugten Inhaltsdatei; ohne sie gilt die Datei als von Hand gepflegt
const node = (skript, ...a) => execFileSync("node", [`${ROOT}scripts/planeten/${skript}`, ...a], { encoding: "utf8" }).trim();
const genutzt = new Map();
let gebaut = 0;
for (const star of systeme) {
    const sysDef = systemDateien.find((s) => s.def.stern.id === star.id)?.def ?? null;
    const liste = [star, ...karte.filter((o) => o.systemId === star.id)].filter((o) => !heimatIds.has(o.id) && (!nur || o.id === nur));
    for (const o of liste) {
        const arg = koerperArg(o);
        if (!arg) { if (!/gebiet/i.test(o.typ)) console.log(`  – ${o.name}: kein Archiv-Dossier, übersprungen`); continue; }
        if (genutzt.has(arg)) throw new Error(`${arg} ist doppelt vergeben (${genutzt.get(arg)} und ${o.id})`);
        genutzt.set(arg, o.id);
        const K = findeKoerper(arg);
        if (!fs.existsSync(ROOT + K.datenDatei)) node("daten-auslesen.mjs", arg);
        const basis = JSON.parse(fs.readFileSync(ROOT + K.datenDatei, "utf8"));
        // Schutz: von Hand gepflegte Inhaltsdateien (ohne Kennung dieses Skripts) werden nie überschrieben
        const inhaltDatei = ROOT + K.datenDatei.replace(/\.json$/, ".inhalt.json");
        if (fs.existsSync(inhaltDatei) && JSON.parse(fs.readFileSync(inhaltDatei, "utf8"))._erzeugt !== KENNUNG) { console.log(`  = ${o.name}: eigene Inhaltsdatei vorhanden, unverändert`); continue; }
        const inhalt = { _erzeugt: KENNUNG, ...baueInhalt(o, star, sysDef, K, basis) };
        fs.writeFileSync(inhaltDatei, JSON.stringify(inhalt, null, 2) + "\n");
        if (bauen) {
            const farbe = `${ROOT}${K.basis}/hauptseite/dossier-farben.css`;
            if (fs.existsSync(farbe)) fs.unlinkSync(farbe);
            node("planetendossier.mjs", arg); node("kapitel-bauen.mjs", arg);
            const archiv = JSON.parse(fs.readFileSync(`${ROOT}inhalte/himmelskoerper/${K.art}/bildarchiv.json`, "utf8"));
            if (archiv.find((e) => e.slug.replace(/-[0-9a-f]{10,12}$/i, "") === K.slug)?.title !== inhalt.name) node("anzeigename.mjs", arg, inhalt.name);
        }
        gebaut++;
        console.log(`  ${inhalt.name.padEnd(24)} ${arg}`);
    }
    console.log(`${star.systemName}: fertig`);
}
console.log(`${gebaut} Körper ${bauen ? "gebaut" : "vorbereitet (Inhaltsdateien; mit --bauen auch Seiten)"}`);
