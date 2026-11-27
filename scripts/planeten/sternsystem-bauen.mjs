// Sternsystem bauen · trägt ein ausgedachtes Sternsystem physikalisch stimmig in die Sternenkarte ein
// Eingabe: scripts/planeten/systeme/<name>.json (Stern, Planeten, Monde, Gürtel, Kometen in physikalischen Einheiten)
// Ausgabe: Einträge in Menüs/adapter/Sternenkarte/Kartendaten/objekte.json (alle Einträge mit dem Präfix werden ersetzt,
//          alle übrigen bleiben unverändert) und ein Prüfbericht: Temperatur, Hill-Sphären, Abstände, Resonanzen,
//          Entfernung zu anderen Sternsystemen.
// Maßstab der Karte: 1 AE = 100 Einheiten, Gravitationsparameter μ = Masse/Sonnenmasse × 295,912 (Einheiten²/Tag²).
// Aufruf: node scripts/planeten/sternsystem-bauen.mjs kharuun-system [--pruefen]   (--pruefen schreibt nichts)
import fs from "node:fs";
import { ROOT } from "./koerper.mjs";
import { keplerPosition, keplerPeriode, AU_KM, EINHEITEN_PRO_AU } from "../../Menüs/Sternenkarte/Sternsysteme/Bahnphysik.js";

const name = process.argv[2] ?? "kharuun-system";
const nurPruefen = process.argv.includes("--pruefen");
const def = JSON.parse(fs.readFileSync(`${ROOT}scripts/planeten/systeme/${name}.json`, "utf8"));
const KARTE = `${ROOT}Menüs/adapter/Sternenkarte/Kartendaten/objekte.json`;
const objekte = JSON.parse(fs.readFileSync(KARTE, "utf8"));

const MU_SONNE = 295.912208;            // Einheiten³/Tag² bei 1 AE = 100 Einheiten
const ERDE_IN_SONNEN = 3.0034896e-6;
const JUPITER_IN_ERDEN = 317.83;
const LJ_IN_AE = 63241.077;
const R_SONNE_KM = 695700;
const km = (x) => (x * EINHEITEN_PRO_AU) / AU_KM;
const fmt = (n, d = 2) => Number(n).toLocaleString("de-DE", { maximumFractionDigits: d });

// ---------- Lage im Raum ----------
const r = def.lage.richtung, laenge = Math.hypot(...r);
const abstand = def.lage.entfernungLj * LJ_IN_AE * EINHEITEN_PRO_AU;
const sternPos = r.map((x) => (x / laenge) * abstand);

// ---------- Stern ----------
const s = def.stern;
const sternMu = s.masseSonne * MU_SONNE;
// Bild: { art, slug } fest oder { art, suche: "Regex" } → erstes passendes Archivmotiv, das in der Karte noch frei ist
const vergeben = new Set(objekte.filter((o) => !o.id.startsWith(def.praefix)).map((o) => o.archivLink).filter(Boolean));
const ordnerVon = (slug) => slug.replace(/-[0-9a-f]{10,12}$/i, "");
const vorschauVon = (b, id) => {
    // bestehende Zuordnung in der Karte behalten, solange ihr Dossier existiert (Ordner tragen inzwischen den Namen des Körpers)
    const alt = objekte.find((o) => o.id === id);
    if (alt?.archivLink && fs.existsSync(ROOT + alt.archivLink.replace(/^(\.\.\/)+/, ""))) { vergeben.add(alt.archivLink); return { ...(alt.vorschau ? { vorschau: alt.vorschau } : {}), archivLink: alt.archivLink }; }
    if (!b) return {};
    // fest vorgegeben (für Körper ohne Bildarchiv-Eintrag): { vorschau: "<Medienschlüssel>", archivLink: "../../inhalte/…" }
    if (b.vorschau) return { vorschau: b.vorschau, ...(b.archivLink ? { archivLink: b.archivLink } : {}) };
    const archiv = JSON.parse(fs.readFileSync(`${ROOT}inhalte/himmelskoerper/${b.art}/bildarchiv.json`, "utf8"));
    const link = (e) => {
        // Archiveinträge mit gleichem Basisslug bleiben über ihren vollständigen Slug eindeutig.
        const basis = `${ROOT}inhalte/himmelskoerper/${b.art}/details/`;
        const ordner = fs.existsSync(`${basis}${e.slug}/hauptseite/index.html`) ? e.slug : ordnerVon(e.slug);
        return `../../inhalte/himmelskoerper/${b.art}/details/${ordner}/hauptseite/index.html`;
    };
    const e = b.slug ? archiv.find((x) => x.slug.startsWith(b.slug))
        : archiv.find((x) => new RegExp(b.suche, "i").test(x.title) && !vergeben.has(link(x)) && fs.existsSync(`${ROOT}inhalte/himmelskoerper/${b.art}/details/${ordnerVon(x.slug)}/hauptseite/index.html`));
    if (!e) { console.warn(`Hinweis: kein freies Bild für ${b.art}/${b.slug ?? b.suche}`); return {}; }
    vergeben.add(link(e));
    return { vorschau: e.preview, archivLink: link(e) };
};
const link = (id) => `./Sternsysteme/Sternsysteme.html?id=${encodeURIComponent(id)}`;
const neu = [{
    id: s.id, name: s.name, typ: s.typ, link: link(s.id), ...vorschauVon(s.bild, s.id), systemName: def.systemName,
    position: sternPos, radius: km(s.radiusSonne * R_SONNE_KM), color: s.farbe, emissionsfarbe: s.emissionsfarbe, emission: s.emission,
    beschreibung: s.beschreibung, gravitationMu: sternMu, radiusKm: Math.round(s.radiusSonne * R_SONNE_KM), distanzLichtjahre: def.lage.entfernungLj, kameraRevision: 1,
}];

// ---------- Körper ----------
const nachId = new Map([[s.id, { obj: neu[0], mu: sternMu, masseSonne: s.masseSonne }]]);
const bericht = [];
for (const k of def.koerper) {
    const basis = { id: k.id, name: k.name, typ: k.typ, link: link(k.id), ...vorschauVon(k.bild, k.id), color: k.farbe, systemId: s.id, beschreibung: k.beschreibung };
    if (k.ringeAE) {   // Gürtel und Kometengebiete
        const mitte = nachId.get(k.ringUm).obj.position;
        const ringe = k.ringeAE.map((a) => a * EINHEITEN_PRO_AU);
        // Ankerpunkt (Beschriftung, Link): mittlerer Ring; bei sehr weiten Gebieten (z. B. Kometenwolken) optional ankerAE,
        // weil die Karte den Startausschnitt nach den Ankerpunkten bemisst und sonst die Planeten verschwinden
        const m = k.ankerAE ? k.ankerAE * EINHEITEN_PRO_AU : ringe[Math.floor(ringe.length / 2)];
        // Gebiete sind keine Körper: kein sichtbarer Kugelkörper (form „guertel“, winziger Radius),
        // sichtbar werden nur die einzelnen unförmigen Brocken (Anzahl und Größe je Gebietstyp)
        // Ankerpunkt selbst ist ein unförmiger Brocken; steinMindestPx hält die Brocken auf dem Bildschirm sichtbar
        if (k.anomalie) basis.anomalie = true;
        const feld = { form: "brocken", massstabGuertel: true, bahnStartTage: 0, steinAnzahl: k.anzahl ?? 160, steingroesseKm: k.groesseKm ?? 300, steinMindestPx: k.mindestPx ?? 3, ...(k.typ === "Asteroidengürtel" ? {} : { koerperfeld: true }) };
        neu.push({ ...basis, position: [mitte[0] + m * 0.8, mitte[1], mitte[2] - m * 0.6], radius: km(k.groesseKm ?? 300), ringUm: k.ringUm, ringe, ...feld });
        bericht.push(`${k.name}: ${k.ringeAE[0]}–${k.ringeAE.at(-1)} AE`);
        continue;
    }
    const eltern = nachId.get(k.um);
    if (!eltern) throw new Error(`${k.id}: Zentralkörper ${k.um} fehlt (Reihenfolge prüfen)`);
    const mu = (k.masseErde ?? 0) * ERDE_IN_SONNEN * MU_SONNE;
    const a = k.aAE ? k.aAE * EINHEITEN_PRO_AU : Math.cbrt((eltern.mu * (k.periodeTage ** 2)) / (4 * Math.PI ** 2));
    const tage = k.periodeTage ?? keplerPeriode(a, eltern.mu + mu);
    const orbit = { a, e: k.e ?? 0, i: k.i ?? 0, knoten: k.knoten ?? 0, peri: k.peri ?? 0, phase: k.phase ?? 0, tage };
    const start = keplerPosition(orbit, 0);
    const position = eltern.obj.position.map((x, i) => x + start[i]);
    neu.push({ ...basis, position, radius: km(k.radiusKm), bahnUm: k.um, orbit, radiusKm: k.radiusKm, ...(mu ? { gravitationMu: mu } : {}) });
    nachId.set(k.id, { obj: neu.at(-1), mu: mu || 1e-12, k, a, tage, eltern: k.um });
}

// ---------- Prüfbericht ----------
const L = s.leuchtkraftSonne;
const zeilen = [`${def.systemName} · Stern ${s.name} (${s.typ}), ${s.masseSonne} M☉, ${s.radiusSonne} R☉, ${L} L☉`];
zeilen.push(`Habitable Zone (konservativ): ${fmt(Math.sqrt(L / 1.1))}–${fmt(Math.sqrt(L / 0.36))} AE · Grenze zum Treibhaus-Durchgehen ab ~${fmt(Math.sqrt(L / 1.1))} AE innen`);
for (const [id, e] of nachId) {
    if (!e.k) continue;
    const k = e.k;
    if (e.eltern === s.id && k.masseErde > 0) {
        const aAE = e.a / EINHEITEN_PRO_AU;
        const einstr = L / aAE ** 2;
        const teq = 278.6 * L ** 0.25 / Math.sqrt(aAE) * (1 - (k.albedo ?? 0.3)) ** 0.25;
        const hill = aAE * (1 - (k.e ?? 0)) * Math.cbrt((k.masseErde * ERDE_IN_SONNEN) / (3 * s.masseSonne));
        let t = `${k.name}: a = ${fmt(aAE, 4)} AE, Umlauf ${fmt(e.tage, 1)} Tage, Einstrahlung ${fmt(einstr)} × Erde, Gleichgewichtstemperatur ${fmt(teq - 273.15, 0)} °C, Hill-Radius ${fmt(hill * AU_KM, 0)} km`;
        if (k.zielTemperaturC != null) t += ` → nötige Treibhauswirkung für ${k.zielTemperaturC} °C: +${fmt(k.zielTemperaturC + 273.15 - teq, 0)} K`;
        zeilen.push(t);
    } else if (e.eltern !== s.id) {
        const p = nachId.get(e.eltern);
        const hill = (p.a / EINHEITEN_PRO_AU) * (1 - (p.k.e ?? 0)) * Math.cbrt((p.k.masseErde * ERDE_IN_SONNEN) / (3 * s.masseSonne));
        const aKm = (e.a / EINHEITEN_PRO_AU) * AU_KM;
        zeilen.push(`  ${k.name} um ${p.k.name}: ${fmt(aKm, 0)} km, ${fmt(e.tage, 2)} Tage, ${fmt((aKm / (hill * AU_KM)) * 100, 0)} % des Hill-Radius ${aKm / (hill * AU_KM) < 0.49 ? "(stabil)" : "(INSTABIL – über ~49 %)"}`);
    }
}
// Abstände benachbarter Planeten in gegenseitigen Hill-Radien
const planeten = [...nachId.values()].filter((e) => e.k && e.eltern === s.id && e.k.masseErde > 0.01 && !/roter zwerg|brauner zwerg|weißer zwerg/i.test(e.k.typ)).sort((x, y) => x.a - y.a);
for (let i = 1; i < planeten.length; i++) {
    const [p, q] = [planeten[i - 1], planeten[i]];
    const rh = Math.cbrt(((p.k.masseErde + q.k.masseErde) * ERDE_IN_SONNEN) / (3 * s.masseSonne)) * (p.a + q.a) / 2;
    zeilen.push(`Abstand ${p.k.name} → ${q.k.name}: ${fmt((q.a - p.a) / rh, 1)} gegenseitige Hill-Radien ${(q.a - p.a) / rh > 3.5 ? "(stabil)" : "(eng)"} · Periodenverhältnis ${fmt(q.tage / p.tage, 3)}`);
}
// Nachbarsysteme und gravitative Einflusszone (galaktische Hill-Sphäre ≈ 3,6 Lj × (M/M☉)^⅓)
const einfluss = (m) => 3.6 * Math.cbrt(m);
zeilen.push(`Einflusszone von ${s.name}: ca. ${fmt(einfluss(s.masseSonne), 1)} Lj · ${def.einzelstern ? "Einzelstern (kein stellarer Begleiter)" : "Mehrfachsystem"}`);
const andere = objekte.filter((o) => (o.systemName || o.id === "Kugel 1") && !o.id.startsWith(def.praefix));
for (const o of andere) {
    const lj = Math.hypot(...o.position.map((x, i) => x - sternPos[i])) / EINHEITEN_PRO_AU / LJ_IN_AE;
    const m = o.gravitationMu ? o.gravitationMu / MU_SONNE : 1;
    zeilen.push(`Entfernung zu ${o.systemName ?? o.name}: ${fmt(lj, 2)} Lj ${lj > einfluss(s.masseSonne) + einfluss(m) ? "(keine gegenseitige Beeinflussung)" : "(EINFLUSSZONEN ÜBERLAPPEN)"}`);
}
zeilen.push(...bericht);
console.log(zeilen.join("\n"));

if (!nurPruefen) {
    const behalten = objekte.filter((o) => !o.id.startsWith(def.praefix));
    fs.writeFileSync(KARTE, JSON.stringify([...behalten, ...neu], null, 2) + "\n");
    console.log(`\n${neu.length} Einträge für das ${def.systemName} in die Sternenkarte geschrieben (${behalten.length} andere unverändert).`);
}
