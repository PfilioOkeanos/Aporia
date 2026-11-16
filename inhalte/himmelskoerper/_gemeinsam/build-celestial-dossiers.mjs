import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { celestialDashboard } from "./planet-dashboard.mjs";
import { solarReferences } from "./solar-references.mjs";

const root = process.cwd();
const read = file => fs.readFileSync(file, "utf8");
const exists = file => fs.existsSync(file);
const list = dir => exists(dir) ? fs.readdirSync(dir, { withFileTypes: true }) : [];
const dirs = dir => list(dir).filter(entry => entry.isDirectory()).map(entry => path.join(dir, entry.name));
const marker = "<!-- aporia-dossier:start -->";
const end = "<!-- aporia-dossier:end -->";
const shared = "inhalte/himmelskoerper/_gemeinsam";
const sky = "Menüs/Sternenkarte";
const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
})[char]);
const decode = value => value.replace(/&amp;|&quot;|&#39;|&lt;|&gt;/g, entity => ({
    "&amp;": "&", "&quot;": '"', "&#39;": "'", "&lt;": "<", "&gt;": ">"
})[entity]);
const attr = (tag, key) => decode(tag.match(new RegExp('(?:^|\\s)' + key + '="([^"]+)"'))?.[1] ?? "");
const plain = value => decode((value ?? "").replace(/<[^>]+>/g, "").trim());
const url = (from, to) => path.relative(path.dirname(from), to).split(path.sep).map(encodeURIComponent).join("/");
const resolve = (from, target) => path.resolve(path.dirname(from), decodeURIComponent(target.split(/[?#]/)[0]));
const num = (value, digits = 0) => value.toLocaleString("de-DE", { maximumFractionDigits: digits });
const map = JSON.parse(read("Menüs/adapter/Sternenkarte/Kartendaten/objekte.json"));
const mapById = new Map(map.map(item => [item.id, item]));
const mapByFile = new Map(map.filter(item => item.archivLink?.startsWith("../")).map(item => [
    resolve(path.join(sky, "Sternenkarte.html"), item.archivLink), item
]));
const media = new Map();
function scanMedia(dir) {
    for (const entry of list(dir)) {
        const file = path.join(dir, entry.name);
        if (entry.isDirectory()) scanMedia(file);
        else if (/\.(mp3|wav|ogg|m4a|mp4|webm|glb|fbx|obj)$/i.test(file)) {
            const parts = file.split(path.sep);
            if (/^(Himmelskörper|Kosmologie)$/i.test(parts[2] ?? "")) {
                const key = parts.slice(2, 5).join("/");
                media.set(key, [...(media.get(key) ?? []), file]);
            }
        }
    }
}
for (const folder of ["audio", "videos", "Modelle"]) scanMedia(path.join("assets", folder));

const standard = {
    planeten: "Allgemeines|Astronomie|Physik|Planetare Struktur|Geografie|Atmosphäre|Klima|Gewässer|Geologie|Biosphäre|Spezies|Zivilisation|Geschichte|Fraktionen|Rohstoffe|Erforschung|Besonderheiten|Medienarchiv",
    sterne: "Allgemeines|Astronomie|Physik|Spektralklasse|Fusion|Leuchtkraft|Lebenszyklus|Geschichte|Umgebung|Erforschung|Besonderheiten|Medienarchiv",
    monde: "Allgemeines|Astronomie|Physik|Mutterplanet|Gezeiten|Gebundene Rotation|Geologie|Atmosphäre|Klima|Geschichte|Erforschung|Besonderheiten|Medienarchiv",
    sternensysteme: "Allgemeines|Astronomie|Zentralsterne|Planeten|Bahnen|Stabilität|Umgebung|Geschichte|Erforschung|Besonderheiten|Medienarchiv",
    galaxien: "Allgemeines|Astronomie|Morphologie|Sternpopulationen|Galaxienkern|Mitglieder|Dynamik|Umgebung|Geschichte|Erforschung|Besonderheiten|Medienarchiv",
    generic: "Allgemeines|Astronomie|Physik|Geschichte|Erforschung|Besonderheiten|Medienarchiv"
};
const worldTypes = [
    [/gas|jupiter|saturn/, "Gasplanet", 9, 1.3, -150, -70, "Wolkenschichten über einer tiefen Wasserstoff-Helium-Hülle", "Ein massereicher Kern sammelte Gas, während die protoplanetare Scheibe noch dicht war."],
    [/vulkan|lava|magma/, "Vulkanwelt", 1.03, 5.4, 35, 95, "Basaltebenen, Spalten und aktive Vulkangebiete", "Restwärme und radioaktiver Zerfall treiben den Vulkanismus an. Gezeiten können lokal zusätzliche Wärme liefern."],
    [/wüste|wuste|sand|dünen/, "Wüstenwelt", .88, 5, -35, 55, "Dünen, Felsbecken und windgeformte Hochländer", "Ein trockenes Inventar flüchtiger Stoffe und geringe Niederschläge ließen weite Sand- und Felsflächen entstehen."],
    [/ammoniak|eis(?!en)|gefror|kryo|frost|schnee/, "Eiswelt", .66, 3.4, -195, -110, "Eiskrusten, Bruchzonen und gefrorene Becken", "Jenseits der Frostlinie lagerten sich Eis und Gestein an. Unter der Kruste kann Restwärme erhalten geblieben sein."],
    [/ozean|meer|wasser|aquatisch/, "Ozeanwelt", 1.12, 4.5, -12, 37, "Weite Meeresbecken und vereinzelte Inselbögen", "Eisreiche Bausteine brachten Wasser auf die junge Welt. Nach der Abkühlung sammelte es sich in tiefen Becken."],
    [/synthet|künstlich|maschinen/, "Synthetische Welt", .94, 5.6, -20, 45, "Segmentierte Oberfläche mit künstlichen Strukturen", "Ein natürlicher Grundkörper könnte später überformt worden sein. Bauphase und Urheber sind offen."],
    [/metall|eisen/, "Metallreiche Welt", .72, 7, -50, 95, "Metallreiche Hochländer und dunkle Einschlagbecken", "Große frühe Kollisionen könnten einen Teil des leichteren Mantels abgetragen haben."],
    [/lebend|symbio|organisch|dschungel|wald|moos/, "Organisch geprägte Welt", .91, 4.8, -12, 34, "Dichte Oberflächenmuster mit feuchten Senken und Hochländern", "Nach der Abkühlung ermöglichten unterschiedliche Feuchte- und Lichtzonen die Ausbildung regionaler Lebensräume."],
    [/./, "Gesteinswelt", .89, 5.3, -55, 42, "Gesteinshochländer und Einschlagbecken", "Staub und Gestein wuchsen durch Kollisionen zusammen. Schwere Bestandteile sanken in der frühen Schmelzphase zum Kern."]
];
const kindProfiles = {
    sterne: ["Stern", "Ein verdichteter Bereich einer Molekülwolke kollabierte. Nach der Aufheizung des Kerns setzte die Phase der Wasserstofffusion ein."],
    asteroiden: ["Asteroid", "Der Körper könnte als Rest eines Planetesimals oder als Bruchstück einer späteren Kollision entstanden sein."],
    kometen: ["Komet", "Eis und Staub sammelten sich in einem kalten Bereich der ursprünglichen Scheibe. In Sternnähe kann Sublimation eine Koma und Schweife bilden."],
    nebel: ["Nebelgebiet", "Gas und Staub prägen die Struktur. Für helle Bereiche kommen Eigenemission, reflektiertes Sternlicht oder eine Überlagerung in Frage."],
    "schwarze-loecher": ["Schwarzes Loch", "Eine Akkretionsscheibe kann Leuchtstrukturen erzeugen. Aus dem Bildmotiv allein bleibt die Entstehungsgeschichte offen."],
    sternensysteme: ["Sternsystemregion", "Staub und Kleinkörper können in Resten einer protoplanetaren Scheibe oder durch gravitative Streuung in äußeren Regionen verblieben sein."],
    galaxien: ["Galaxie", "Die Verteilung von Sternen, Gas und Staub kann durch Gaszufluss, interne Dynamik und Begegnungen mit anderen Galaxien geprägt worden sein."],
    phaenomene: ["Astronomisches Phänomen", "Die Ursache hängt von der Objektklasse und ihrer Umgebung ab."],
    kosmologie: ["Kosmische Struktur", "Gravitation prägt die räumliche Verteilung der Bestandteile und die Entwicklung der Struktur."]
};
function profile(record) {
    const { title, group, category, known, slug, overview } = record;
    const facts = {};
    const topics = {};
    if (known) {
        const center = mapById.get(known.bahnUm);
        const system = mapById.get(known.systemId);
        facts.Klasse = known.typ ?? group;
        if (known.radiusKm > 0) facts.Radius = num(known.radiusKm, 2) + " km";
        if (known.orbit?.tage > 0) facts.Umlaufzeit = num(known.orbit.tage, 3) + " Tage";
        if (known.gravitationMu > 0 && known.radiusKm > 0) {
            const gm = known.gravitationMu / ((100 / 149597870.7) ** 3 * 86400 ** 2);
            facts.Gravitation = num(1000 * gm / known.radiusKm ** 2, 2) + " m/s²";
        }
        if (center) facts.Zentralkörper = center.name;
        if (system || known.systemName) facts.Sternsystem = known.systemName ?? system.systemName ?? system.name;
        topics.astronomie = [facts.Sternsystem && "Sternsystem: " + facts.Sternsystem, facts.Zentralkörper && "Zentralkörper: " + facts.Zentralkörper, facts.Umlaufzeit && "Umlaufzeit: " + facts.Umlaufzeit].filter(Boolean).join(" · ");
        return { name: known.name, facts, topics, intro: known.beschreibung || "In der Sternenkarte erfasst.", status: "Projektdaten aus der Sternenkarte" };
    }
    const seed = createHash("sha256").update(slug).digest();
    const sample = seed[0] / 255;
    const hint = (group + " " + title).toLowerCase();
    const isWorld = ["planeten", "zwergplaneten", "monde"].includes(category);
    const status = overview ? "Kategorieübersicht" : "Entwurf · illustrative Platzhalterdaten";
    if (isWorld) {
        const specificTypes = worldTypes.slice(0, -1);
        const motif = title.toLowerCase().split(/\s+(?:unter|über|vor|neben)\s+/)[0];
        const titleType = specificTypes.find(([pattern]) => pattern.test(motif));
        const groupType = specificTypes.find(([pattern]) => pattern.test(group.toLowerCase()));
        const [, type, baselineRadius, baselineDensity, low, high, terrain, origin] =
            (/^(gasplaneten|synthetische|lebende)/i.test(group) ? groupType : titleType ?? groupType) ?? worldTypes.at(-1);
        const gas = type === "Gasplanet" && category === "planeten";
        const isMoon = category === "monde" || /(?:vulkan|eis|gesteins)mond/.test(title.toLowerCase());
        const scale = isMoon ? .26 : category === "zwergplaneten" || /zwergplanet/.test(hint) ? .13 : 1;
        const radius = baselineRadius * scale * (.83 + sample * .34);
        const density = baselineDensity * (.92 + seed[1] / 255 * .16);
        const mass = radius ** 3 * density / 5.514;
        const gravity = 9.81 * mass / radius ** 2;
        const offset = Math.round(seed[2] / 255 * 20 - 10);
        const thawing = type === "Eiswelt" && /auftau|schmelz|warmer wasser/.test(hint);
        const range = thawing ? [-65, 12] : /eiswüste|kältewüste/.test(motif) ? [-105, -35] : [low, high];
        const temperature = num(range[0] + offset) + " bis " + num(range[1] + offset) + " °C";
        const name = /^(ChatGPT-Bild|Unbenannt)/i.test(title)
            ? (gas ? "Ner" : "Vel") + ["aris", "ora", "eth", "ion"][seed[3] % 4] + " " + seed.subarray(4, 6).toString("hex").toUpperCase()
            : title;
        facts.Klasse = isMoon ? "Mond" : scale === .13 ? "Zwergplanet" : type;
        facts.Radius = num(radius * 6371) + " km";
        facts.Masse = num(mass, 4) + " Erdmassen";
        facts.Dichte = num(density, 2) + " g/cm³";
        facts.Gravitation = num(gravity, 2) + " m/s²";
        facts[gas ? "Temperatur der Wolkenschicht" : "Regionale Oberflächentemperatur"] = temperature;
        topics["planetare struktur"] = gas ? "Eine tiefe Gashülle geht mit zunehmendem Druck in dichtere Schichten über. Der Kernaufbau bleibt offen." : "Gestein und dichtere Bestandteile könnten sich im Inneren getrennt haben. Eine äußere Kruste trägt die erkennbaren Strukturen.";
        topics.geografie = gas ? "Breitengradabhängige Wolkenbänder bilden die sichtbaren Regionen." : terrain + " sind als prägende Landschaften vorgesehen.";
        topics.atmosphäre = gas ? "Die Hülle besteht im Entwurf überwiegend aus Wasserstoff und Helium." : scale < .5 ? "Eine dauerhafte dichte Atmosphäre ist im Entwurf offen. Lokale Ausgasung ist denkbar." : type === "Vulkanwelt" ? "Vulkanische Gase und Aerosole könnten die Atmosphäre regional stark beeinflussen." : "Eine Atmosphäre ist für den Entwurf möglich. Zusammensetzung und Druck bleiben offen.";
        topics.klima = (gas ? "Vorläufiger Temperaturbereich in der sichtbaren Wolkenschicht: " : "Vorläufiger Temperaturbereich ausgewählter Regionen: ") + temperature + ". Tages- und Jahreszeitenverlauf sind offen.";
        topics.gewässer = gas ? "Sichtbare Wolken können Kondensate enthalten. Oberflächengewässer sind für diesen Entwurf nicht vorgesehen." : type === "Ozeanwelt" ? "Ausgedehnte flüssige Becken bilden das Leitmotiv. Salzgehalt, Tiefe und Strömungen bleiben offen." : type === "Eiswelt" ? "An der Oberfläche dominieren gefrorene Stoffe. Flüssigkeit unter der Kruste bleibt als Möglichkeit offen." : "Oberflächengewässer sind offen. Stoffkreisläufe hängen von Atmosphäre und Temperatur ab.";
        topics.geologie = gas ? "Der sichtbare Aufbau wird in den Kapiteln zu Atmosphäre und Wolkenschichten beschrieben." : terrain + ". Alter und Zusammensetzung der Kruste bleiben offen.";
        topics.geschichte = origin;
        topics.astronomie = "Sternsystem, Umlaufbahn und Rotationsperiode sind für diesen Entwurf offen.";
        topics.besonderheiten = terrain + ".";
        topics.gaszusammensetzung = "Als Ausgangspunkt dienen Wasserstoff und Helium. Die Anteile der Spurengase bleiben offen.";
        topics.wolkenschichten = "Unterschiedliche Kondensate können mit der Höhe wechseln. Die sichtbaren Bänder markieren Zonen verschiedener Strömung.";
        topics.stürme = "Langlebige Wirbel und Scherung zwischen benachbarten Windbändern sind mögliche Merkmale.";
        if (isMoon) {
            topics.gezeiten = "Gezeiten können das Innere erwärmen, sofern die Bahn nahe am Mutterplaneten und ausreichend exzentrisch ist.";
            topics["gebundene rotation"] = "Bei einer engen alten Bahn wäre eine gebundene Rotation plausibel. Der Entwurf legt sie noch nicht fest.";
        }
        if (thawing) topics.gewässer = "In den wärmeren Gebieten kann Schmelzwasser zeitweise an der Oberfläche liegen. Jenseits dieser Zonen dominiert weiterhin Eis.";
        if (/lavasee|lavaseen|glühende bruchzone/.test(hint)) {
            topics.besonderheiten = "Leuchtende Becken oder Bruchzonen sind als offene Lava modelliert und liegen deutlich über dem Temperaturbereich des umgebenden Geländes.";
        } else if (/geysir|eisfontän/.test(hint)) {
            topics.besonderheiten = "Die sichtbaren Fontänen dienen als Hinweis auf Ausströmungen aus Bruchzonen. Ein Reservoir unter der Kruste ist eine Entwurfsoption.";
        } else if (gas && /roten stürmen|gigantischer sturm/.test(hint)) {
            topics.stürme = "Der farblich abgesetzte Wirbel im Bild ist das Leitmotiv. Aufsteigende Wolken und Scherung an seinen Rändern sind im Entwurf vorgesehen.";
            topics.besonderheiten = topics.stürme;
        }
        if (type === "Organisch geprägte Welt") topics.biosphäre = "Die Oberflächenmuster dienen als Vorlage für zusammenhängende Feuchtlebensräume und trockenere Hochlagen. Konkrete Arten bleiben offen.";
        const worldOrigin = gas || scale === 1 ? origin : "Der Kleinkörper könnte sich durch Akkretion, Einfang oder als Bruchstück eines größeren Körpers gebildet haben. Seine Bahn und Zusammensetzung bleiben offen.";
        topics.geschichte = worldOrigin;
        return { name, facts, topics, intro: topics.geografie + " " + worldOrigin, status };
    }
    const [type, origin] = kindProfiles[category] ?? kindProfiles.kosmologie;
    facts.Klasse = overview ? title : type;
    if (group && group !== title) facts.Bildgruppe = group;
    topics.geschichte = origin;
    if (category === "sterne") {
        const color = /blau|wolf.rayet/.test(hint) ? "Blau bis blauweiß" : /rot|orange/.test(hint) ? "Orange bis rot" : /gold|gelb/.test(hint) ? "Gelb bis gold" : "";
        if (color) facts.Farbmotiv = color;
        const remnant = /neutron|pulsar|weißer zwerg|weisser zwerg/.test(hint);
        const evolved = /wolf.rayet|ries|überries|helium/.test(hint);
        if (remnant) {
            topics.geschichte = /neutron|pulsar/.test(hint)
                ? "Ein kompakter Überrest nach dem Kollaps eines massereichen Sternkerns ist der Entwurfsansatz."
                : "Der Entwurf setzt einen kompakten Sternüberrest nach dem Verlust der äußeren Sternhülle an.";
        } else if (evolved) topics.geschichte = "Das Motiv deutet auf eine fortgeschrittene Entwicklungsphase mit veränderter Hülle oder starkem Sternwind.";
        topics.spektralklasse = color ? "Farbmotiv: " + color + ". Eine Spektralklasse erfordert eine gesonderte Festlegung." : "Spektralklasse und Temperatur sind offen.";
        topics.fusion = remnant ? "Der Entwurf sieht einen kompakten Überrest vor. Eine dauerhafte Kernfusion ist dafür nicht angesetzt." : "Das Brennstadium bleibt offen. Bei einem Hauptreihenstern wäre Wasserstofffusion der Ausgangspunkt.";
        topics.lebenszyklus = topics.geschichte;
    }
    if (category === "galaxien") {
        topics.morphologie = /spiral|arme/.test(hint) ? "Das Motiv zeigt armartige Strukturen. Scheibenneigung und Zahl der Hauptarme bleiben offen." : /ring/.test(hint) ? "Ein Ring ist im Motiv die prägende Struktur. Wechselwirkungen bleiben als Entwurfsoption offen." : /ellipt/.test(hint) ? "Eine elliptische Lichtverteilung prägt den Entwurf." : "Asymmetrien, Kernform und Staubbänder dienen als visuelle Merkmale für die weitere Einordnung.";
        topics.sternpopulationen = "Kern, Scheibe oder äußere Gebiete können sich im Alter ihrer Sternpopulationen unterscheiden. Die Verteilung bleibt offen.";
    }
    if (category === "kometen") {
        topics.kern = "Der Entwurf geht von einem Gemisch aus Eis, Staub und Gestein aus.";
        topics.koma = "Bei Erwärmung kann austretendes Gas Staub mitreißen und die diffuse Hülle bilden.";
        topics.schweif = "Staub und ionisiertes Gas können getrennte Schweife ausbilden, die auf Strahlungsdruck und Sonnenwind unterschiedlich reagieren.";
    }
    if (category === "asteroiden") {
        topics.zusammensetzung = /metall|eisen/.test(hint) ? "Metallreiche Bestandteile sind das Leitmotiv. Die genaue Zusammensetzung bleibt offen." : "Ein Gemisch aus Gestein, Staub und gegebenenfalls Metall ist für den Entwurf plausibel.";
        topics.herkunft = origin;
    }
    if (category === "nebel") {
        topics["sternentstehung"] = "Kalte dichte Teilbereiche kommen als Ausgangspunkt für die Bildung neuer Sterne in Frage.";
        topics.ionisation = "Helle Emission kann durch energiereiche Strahlung benachbarter Sterne angeregt werden.";
    }
    if (category === "schwarze-loecher") {
        topics.ereignishorizont = "Die Größe des Horizonts hängt von Masse und Rotation ab. Beides bleibt für den Entwurf offen.";
        topics.akkretionsscheibe = "Leuchtende Ring- und Scheibenstrukturen können durch heißes Material und Lichtablenkung geprägt sein.";
    }
    return { name: title, facts, topics, intro: topics.geschichte, status };
}

const registryFile = "inhalte/medien/medien.json";
const registry = JSON.parse(read(registryFile)).media;
function registeredArtwork(id) {
    const entry = id.split(".").reduce((value, key) => value?.[key], registry);
    const source = typeof entry === "string" ? entry : entry?.src;
    const candidate = typeof source === "string" ? resolve(registryFile, source) : null;
    return candidate && exists(candidate) ? { file: candidate, id } : null;
}
function artwork(file, html) {
    const tag = html.match(/<img\b[^>]*\bdata-media-image="[^"]+"[^>]*>/)?.[0] ?? "";
    const id = attr(tag, "data-media-image");
    const source = attr(tag, "src");
    const candidate = source ? resolve(file, source) : null;
    return candidate && exists(candidate) ? { file: candidate, id } : registeredArtwork(id);
}

const stats = { detail: 0, overview: 0, chapters: 0, images: 0, extras: 0, known: 0, skippedAuthored: 0, missing: [], brokenLinks: [] };
const checking = process.argv.includes("--check");
const onlyMap = process.argv.includes("--kartenobjekte");
const onlyPlanetLayout = process.argv.includes("--planeten-layout");
const onlyOtherLayout = process.argv.includes("--himmelskoerper-layout");
const onlySolarPilot = process.argv.includes("--sonnensystem-pilot");
const linkTargets = new Map();
function checkLinks(file, content) {
    for (const match of content.matchAll(/(?:href|src)="([^"]+)"|(?:import |@import url\()"([^"]+)"/g)) {
        const target = match[1] ?? match[2];
        if (/^https:\/\//i.test(target)) continue;
        const resolved = resolve(file, decode(target));
        if (!linkTargets.has(resolved)) linkTargets.set(resolved, exists(resolved));
        if (!linkTargets.get(resolved)) stats.brokenLinks.push(file + " → " + target);
    }
}
function save(file, content) {
    if (checking) {
        if (!exists(file) || read(file) !== content) stats.missing.push(file);
        return;
    }
    if (exists(file) && read(file) === content) return;
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content);
}
function generated(file, content) {
    const generatedMarker = file.endsWith(".html") ? marker : "/* aporia-dossier */";
    if (exists(file) && !read(file).startsWith(generatedMarker)) {
        stats.skippedAuthored++;
        return;
    }
    if (checking) checkLinks(file, content);
    save(file, generatedMarker + "\n" + content);
}

const specialized = {
    asteroiden: "Zusammensetzung|Bahn|Herkunft",
    kometen: "Kern|Koma|Schweif|Umlaufbahn",
    nebel: "Gas|Staub|Ionisation|Sternentstehung",
    "schwarze-loecher": "Masse|Ereignishorizont|Akkretionsscheibe",
    "cosmic_web": "Filamente|Voids|Übergeordnete Verteilung",
    filamente: "Räumliche Ausdehnung|Verbindungen|Materieverteilung",
    supergalaxien: "Großräumige Struktur|Mitgliedshaufen",
    galaxienhaufen: "Mitgliedsgalaxien|Dynamik|Gesamtmasse",
    galaxiengruppen: "Mitgliedsgalaxien|Dynamik|Umgebung",
    galaxiensgruppen: "Galaxienarme|Spuren|Sektoren",
    sektoren: "Grenzen|Sternsysteme|Nachbarsektoren",
    asteroidengürtel: "Kleinkörper|Bahnen|Herkunft",
    "kosmische_übersicht": "Cosmic Web|Filamente|Superhaufen|Galaxienhaufen|Galaxien|Sektoren|Sternsysteme"
};
function chapters(record, folder) {
    const key = record.slug.toLowerCase();
    const worldGas = record.category === "planeten" && /gasplanet/i.test(record.group);
    const labels = (standard[record.category] ?? standard.generic).split("|");
    if (record.category === "zwergplaneten") labels.splice(3, 0, "Planetare Struktur", "Geologie", "Klima");
    if (worldGas) labels.push("Gaszusammensetzung", "Wolkenschichten", "Stürme");
    labels.push(...(specialized[record.category] ?? specialized[key] ?? "").split("|").filter(Boolean));
    const existing = dirs(folder).map(dir => {
        const match = path.basename(dir).match(/^(\d+)\s*[-–]\s*(.+)$/);
        return match ? { label: match[2], index: Number(match[1]), dir } : null;
    }).filter(Boolean);
    const indices = new Set(existing.map(entry => entry.index));
    const byLabel = new Map(existing.map(entry => [entry.label.toLowerCase(), entry]));
    const preferred = record.category === "planeten" ? (label, i) => i + 1 : (label, i) => 1 + Math.max(0, ...indices);
    for (const [i, label] of labels.entries()) {
        if (byLabel.has(label.toLowerCase())) continue;
        let index = preferred(label, i);
        while (indices.has(index)) index++;
        indices.add(index);
        const dir = path.join(folder, String(index).padStart(2, "0") + " - " + label);
        byLabel.set(label.toLowerCase(), { index, dir, label });
    }
    return [...byLabel.values()].sort((a, b) => a.index - b.index).map(chapter => ({
        ...chapter, file: path.join(chapter.dir, "index.html")
    }));
}

function chapterNav(from, main, entries) {
    const anchor = (to, label) => '<a data-sidebar-tab href="' + url(from, to) + '"' +
        (from === to ? ' aria-current="page"' : "") + '>' + esc(label) + '</a>';
    return '<nav class="dossier-chapters" aria-label="Dossierkapitel">' +
        (from === main ? "" : anchor(main, "Dossierhauptseite")) +
        entries.map(entry => anchor(entry.file, entry.label)).join("") + '</nav>';
}
function factList(facts) {
    const fields = Object.entries(facts);
    return fields.length ? '<dl class="dossier-details">' + fields.map(([label, value]) =>
        '<div><dt>' + esc(label) + '</dt><dd>' + esc(value) + '</dd></div>').join("") + '</dl>' : "";
}
function image(file, record) {
    if (!record.art) return "";
    const src = esc(record.art.url ?? url(file, record.art.file));
    const credit = record.art.credit ? ' · <a href="' + esc(record.art.page) + '">' + esc(record.art.credit) + '</a>' : "";
    return '<figure><a href="' + src + '"><img src="' + src +
        '" alt="' + esc(record.title) + '" decoding="async"></a><figcaption>' + esc(record.title) + credit + '</figcaption></figure>';
}
function mediaContent(file, record) {
    const player = (list, tag) => list.map(item => '<figure><figcaption>' + esc(path.basename(item)) + '</figcaption><' + tag + ' controls preload="none" src="' + url(file, item) + '"></' + tag + '></figure>').join("");
    const files = {
        audio: record.extras.filter(item => /\.(mp3|wav|ogg|m4a)$/i.test(item)),
        video: record.extras.filter(item => /\.(mp4|webm)$/i.test(item)),
        model: record.extras.filter(item => /\.(glb|fbx|obj)$/i.test(item))
    };
    const models = files.model.map(item => '<p><a href="' + url(file, item) + '">' + esc(path.basename(item)) + '</a></p>').join("");
    return '<h2>Bilder</h2>' + (image(file, record) || '<p>Kein Bild zugeordnet.</p>') +
        '<h2>Audio</h2>' + (player(files.audio, "audio") || '<p>Kein Audio zugeordnet.</p>') +
        '<h2>Videos</h2>' + (player(files.video, "video") || '<p>Kein Video zugeordnet.</p>') +
        '<h2>3D-Modelle</h2>' + (models || '<p>Kein 3D-Modell zugeordnet.</p>');
}
const openTopics = {
    biosphäre: "Lebensräume, Pflanzen, Tiere und Ökosysteme sind offen.",
    spezies: "Heimische und eingewanderte Spezies sind offen.",
    zivilisation: "Siedlungen, Gesellschaft und Technologien sind offen.",
    fraktionen: "Politische Zugehörigkeit und Fraktionsinteressen sind offen.",
    rohstoffe: "Abbaubare Rohstoffe und deren Vorkommen sind offen.",
    erforschung: "Expeditionen und Forschungsergebnisse sind offen.",
    "großräumige struktur": "Das Kapitel erfasst die räumliche Anordnung von Galaxienhaufen und die Übergänge zu Filamenten.",
    filamente: "Filamente verbinden dichtere Knoten des kosmischen Netzes. Zugeordnete Strukturen werden über das Kosmologiearchiv erschlossen.",
    voids: "Voids sind Regionen mit geringerer Materiedichte zwischen den Filamenten.",
    "übergeordnete verteilung": "Das Archiv beschreibt die Verteilung anhand von Knoten, Filamenten und Hohlräumen.",
    stabilität: "Für eine Bewertung der Bahnstabilität werden Massen, Bahnparameter und Wechselwirkungen benötigt.",
    dynamik: "Geschwindigkeiten und gegenseitige gravitative Einflüsse sind für die Einträge getrennt zu dokumentieren."
};
function chapterContent(file, record, chapter) {
    const data = record.data;
    const key = chapter.label.toLowerCase();
    if (key === "medienarchiv") return mediaContent(file, record);
    if (key === "allgemeines") return '<p>' + esc(data.intro) + '</p>' + factList(data.facts);
    const keys = {
        physik: ["Radius", "Masse", "Dichte", "Gravitation"], masse: ["Masse"],
        klima: ["Regionale Oberflächentemperatur", "Temperatur der Wolkenschicht"], astronomie: ["Sternsystem", "Zentralkörper", "Umlaufzeit"],
        bahn: ["Zentralkörper", "Umlaufzeit"], umlaufbahn: ["Zentralkörper", "Umlaufzeit"], mutterplanet: ["Zentralkörper"]
    }[key] ?? [];
    const facts = Object.fromEntries(keys.filter(name => data.facts[name]).map(name => [name, data.facts[name]]));
    const text = data.topics[key] || (Object.keys(facts).length ? "" :
        (record.known ? "" : openTopics[key]) || "Angaben zu " + chapter.label + " sind offen.");
    return (text ? '<p>' + esc(text) + '</p>' : "") + factList(facts);
}

function buildChapter(record, entries, chapter, index) {
    const file = chapter.file;
    const previous = entries[index - 1], next = entries[index + 1];
    const link = (entry, label) => entry ? '<a href="' + url(file, entry.file) + '">' + esc(label + " " + entry.label) + '</a>' : "";
    generated(path.join(chapter.dir, "index.css"), '@import url("' + url(file, path.join(shared, "celestial-dossier.css")) + '");\n');
    generated(path.join(chapter.dir, "index.js"), 'import "' + url(file, "Menüs/Side_bar/side_bar.js") + '";\n' +
        'import "' + url(file, "Menüs/TopBar/Top_bar.js") + '";\n');
    generated(file, '<!doctype html>\n<html lang="de">\n<head>\n<meta charset="utf-8">\n' +
        '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
        '<title>' + esc(chapter.label + " | " + record.data.name + " | Aporia Weltenarchiv") + '</title>\n' +
        [["Menüs/Side_bar/Side_bar.css", "?v=3"], ["Menüs/TopBar/Top_bar.css", "?v=5"], [path.join(shared, "atlas.css"), ""]].map(([asset, query]) =>
            '<link rel="stylesheet" href="' + url(file, asset) + query + '">\n').join("") +
        '<link rel="stylesheet" href="./index.css">\n</head>\n<body ' + record.body + '>\n' +
        '<div data-aporia-topbar></div>\n<div class="aporia-page-frame atlas-frame"><div data-aporia-sidebar></div>\n' +
        '<main class="atlas-main"><div class="atlas-shell">\n<nav class="atlas-crumb" aria-label="Archivpfad"><a href="' +
        url(file, record.file) + '">' + esc(record.data.name) + '</a><span aria-current="page">' + esc(chapter.label) + '</span></nav>\n' +
        '<section class="aporia-dossier" data-sidebar-details data-sidebar-default><header class="atlas-hero"><h1>' + esc(chapter.label) +
        '</h1><p>' + esc(record.data.name) + '</p></header>\n' +
        '<div class="dossier-content"><p class="dossier-status">' + esc(record.data.status) + '</p>' +
        chapterContent(file, record, chapter) + '</div>\n<h2>Dossierkapitel</h2>' + chapterNav(file, record.file, entries) +
        '<p class="dossier-pagination">' + link(previous, "←") + link(next, "→") + '</p></section>\n' +
        '</div></main></div>\n<script type="module" src="./index.js"></script>\n</body>\n</html>\n');
}

function build(file, category, overview = false, slug = path.basename(path.dirname(path.dirname(file))), curated = {}) {
    if (onlySolarPilot && !Object.hasOwn(solarReferences, slug) &&
        !["saturn", "uranus", "sonnensystem"].includes(slug)) return;
    const planet = !overview && ["planeten", "zwergplaneten"].includes(category);
    if (onlyPlanetLayout && !planet) return;
    if (onlyOtherLayout && (planet || overview)) return;
    const known = mapByFile.get(path.resolve(file));
    if (onlyMap && !known && !curated.mapSystem) return;
    const html = exists(file) ? read(file) : curated.template;
    if (/<body\b[^>]*\bdata-custom-dossier\b/.test(html)) return;
    const start = html.indexOf(marker);
    const finish = html.indexOf(end);
    if ((start < 0) !== (finish < 0)) throw new Error("Unvollständiger Dossierblock: " + file);
    const source = start < 0 ? html : html.slice(0, start) + html.slice(finish + end.length);
    const bodyTag = source.match(/<body\b[^>]*>/)?.[0] ?? "";
    const title = attr(bodyTag, "data-archive-title") || plain(source.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]);
    if (!title) throw new Error("Kein Titel: " + file);
    const group = overview ? "" : attr(bodyTag, "data-archive-group") || plain(source.match(/<header class="atlas-hero">[\s\S]*?<p>([\s\S]*?)<\/p>/)?.[1]);
    const reference = Object.hasOwn(solarReferences, slug) ? solarReferences[slug] : null;
    const art = reference?.image ?? curated.art ?? artwork(file, source);
    const mediaKey = art?.file ? path.relative(root, art.file).split(path.sep).slice(2, 5).join("/") : "";
    const extras = [...(media.get(mediaKey) ?? [])];
    if (known?.modell && known.modell === path.basename(known.modell)) {
        const model = path.join("assets", "Modelle", "Sternenkarte", known.modell);
        if (exists(model)) extras.push(model);
    }
    const record = { file, title, group, category, overview, slug, known, art, extras, body: source.match(/<body\b([^>]*)>/)?.[1].trim() ?? "" };
    record.data = curated.data ?? profile(record);
    if (reference?.sources) {
        Object.assign(record.data.facts, reference.facts);
        record.data.status = "Quellengeprüfte Grunddaten · NASA / JPL und Sternenkarte";
    }
    const folder = path.join(curated.folder ?? (overview ? path.dirname(file) : path.dirname(path.dirname(file))), "unterseiten");
    const entries = chapters(record, folder);
    const id = "AP-" + createHash("sha256").update(file.split(path.sep).join("/")).digest("hex").slice(0, 10).toUpperCase();
    const systemId = known?.systemId ?? (known?.systemName ? known.id : null);
    if (!overview) {
        const links = [...(curated.related ?? [])];
        const connections = [mapById.get(known?.bahnUm), ...map.filter(item => known && item.bahnUm === known.id)];
        for (const item of connections) {
            if (!item?.archivLink?.startsWith("../")) continue;
            const target = resolve(path.join(sky, "Sternenkarte.html"), item.archivLink);
            if (exists(target)) links.push([target, item.name]);
        }
        const original = plain(source.match(/<dt>Originaldatei<\/dt>\s*<dd>([^<]+)<\/dd>/)?.[1]);
        const orvayaNotes = curated.preserveNotes && (source.match(/<!-- orvaya-notes:start -->([\s\S]*?)<!-- orvaya-notes:end -->/)?.[1] ??
            [...source.matchAll(/<article\b[^>]*>[\s\S]*?<\/article>/g)].map(match => match[0]).join("\n"));
        const preserved = orvayaNotes ? '<details class="planet-original"><summary>Weltenbau-Notizen</summary><!-- orvaya-notes:start -->' +
            orvayaNotes + '<!-- orvaya-notes:end --></details>' : "";
        const mapHref = known ? url(file, path.join(sky, "Sternenkarte.html")) +
            (systemId ? "?system=" + encodeURIComponent(systemId) : "") : "";
        const updated = celestialDashboard(record, entries, {
            esc, url, links, id, mapHref, original, preserved, mapSystem: curated.mapSystem, reference
        });
        if (checking) checkLinks(file, updated);
        save(file, updated);
        if (!onlyPlanetLayout && !onlyOtherLayout && (!onlySolarPilot || reference?.sources)) {
            entries.forEach((chapter, index) => buildChapter(record, entries, chapter, index));
        }
        stats.detail++;
        stats.chapters += entries.length;
        if (art) stats.images++;
        if (known) stats.known++;
        stats.extras += extras.length;
        return;
    }
    const mapLink = known ? '<p><a href="' + url(file, path.join(sky, "Sternenkarte.html")) +
        (systemId ? "?system=" + encodeURIComponent(systemId) : "") + '">In der Sternenkarte öffnen</a></p>' : "";
    const related = (curated.related ?? []).map(([target, label]) =>
        '<p><a href="' + url(file, target) + '">' + esc(label) + '</a></p>').join("");
    const intro = overview ? '' : '<div class="dossier-intro">' + image(file, record) + '<div><p class="dossier-status">' +
        esc(record.data.status) + '</p><p>' + esc(record.data.intro) + '</p>' +
        factList({ "Archiv-ID": id, ...record.data.facts }) + mapLink + '</div></div>';
    const section = marker + '<section class="aporia-dossier" data-sidebar-details data-sidebar-default>' +
        '<h2>' + esc(overview || record.data.name === title ? "Dossier" : record.data.name) + '</h2>' +
        intro + related + '<h3>Dossierkapitel</h3>' + chapterNav(file, file, entries) + '</section>' + end;
    if (checking) checkLinks(file, section);
    const css = '<link rel="stylesheet" href="' + url(file, path.join(shared, "celestial-dossier.css")) + '">';
    let updated = source.includes(css) ? source : source.replace("</head>", "    " + css + "\n</head>");
    const insert = ['<div class="dossier-system-mount"></div>', overview && '      <div class="cosmology-topic"',
        '                <div class="celestial-layout">', '</main>']
        .filter(Boolean).find(candidate => updated.includes(candidate));
    updated = updated.replace(insert, section + insert);
    save(file, updated);
    entries.forEach((chapter, index) => buildChapter(record, entries, chapter, index));
    stats[overview ? "overview" : "detail"]++;
    stats.chapters += entries.length;
    if (art) stats.images++;
    if (known) stats.known++;
    stats.extras += extras.length;
}

function dossierTemplate(file, name, type, body, parent, parentLabel) {
    return '<!doctype html>\n<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">\n' +
        '<title>' + esc(name) + ' | Aporia Weltenarchiv</title>\n' +
        ["Menüs/TopBar/Top_bar.css", "Menüs/Side_bar/Side_bar.css", path.join(shared, "atlas.css")].map(asset =>
            '<link rel="stylesheet" href="' + url(file, asset) + '">').join("\n") + '\n</head>\n' +
        '<body ' + body + '><div data-aporia-topbar></div><div class="aporia-page-frame atlas-frame"><div data-aporia-sidebar></div>\n' +
        '<main class="atlas-main"><div class="atlas-shell"><nav class="atlas-crumb"><a href="' +
        url(file, parent) + '">' + esc(parentLabel) + '</a></nav>' +
        '<header class="atlas-hero"><h1>' + esc(name) + '</h1><p>' + esc(type) + '</p></header>' +
        '<div class="dossier-system-mount"></div></div></main></div>\n' +
        ["Menüs/TopBar/Top_bar.js", "Menüs/Side_bar/side_bar.js"].map(asset =>
            '<script type="module" src="' + url(file, asset) + '"></script>').join("\n") + '\n</body></html>\n';
}

const mappedFiles = new Set();
for (const [target, object] of mapByFile) {
    const file = path.relative(root, target);
    const [, domain, category, details, slug] = file.split(path.sep);
    if (domain !== "himmelskoerper" || details !== "details" || (exists(file) && !read(file).includes('data-map-dossier'))) continue;
    const parent = path.join("inhalte", "himmelskoerper", category, category + ".html");
    const art = object.vorschau && registeredArtwork(object.vorschau.replace(/-vorschau$/, ""));
    const template = dossierTemplate(file, object.name, object.typ, 'data-map-dossier data-section="himmelskoerper" data-page="' +
        esc(category) + '"', parent, "Zur Kategorieübersicht");
    if (checking) checkLinks(file, template);
    build(file, category, false, slug, { template, art });
    mappedFiles.add(path.resolve(file));
}

for (const dir of dirs("inhalte/himmelskoerper")) {
    for (const detail of dirs(path.join(dir, "details"))) {
        const file = path.join(detail, "hauptseite", "index.html");
        if (!mappedFiles.has(path.resolve(file)) && exists(file)) build(file, path.basename(dir));
    }
}
const cosmos = "inhalte/Kosmologie";
const systems = [];
for (const star of map.filter(item => item.systemName && item.archivLink)) {
    const slug = star.systemName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const file = path.join(cosmos, "Sternensysteme", "details", slug, "hauptseite", "index.html");
    const starFile = resolve(path.join(sky, "Sternenkarte.html"), star.archivLink);
    if (!exists(starFile)) continue;
    systems.push([file, star.systemName]);
    const members = map.filter(item => item.systemId === star.id);
    const related = [[starFile, star.name + " – Dossier des Zentralsterns"]];
    for (const member of members) {
        if (!member.archivLink?.startsWith("../")) continue;
        const target = resolve(path.join(sky, "Sternenkarte.html"), member.archivLink);
        if (exists(target)) related.push([target, member.name + " – Dossier"]);
    }
    const template = dossierTemplate(file, star.systemName, "Sternsystem", 'data-page="kosmologie-sternsysteme"',
        path.join(cosmos, "Sternensysteme", "Übersichtsseite", "index.html"), "Sternsysteme");
    const orbitSummary = members.filter(item => item.orbit?.tage > 0)
        .map(item => item.name + " (" + num(item.orbit.tage, 2) + " Tage)").join(", ");
    build(file, "sternensysteme", false, slug, {
        template, art: artwork(starFile, read(starFile)), related, mapSystem: true,
        data: {
            name: star.systemName, status: "Projektdaten aus der Sternenkarte",
            intro: star.beschreibung ?? "Dieses Sternsystem ist in der Sternenkarte erfasst.",
            facts: { Klasse: "Sternsystem", Zentralstern: star.name, "Kartierte Mitglieder": members.length },
            topics: {
                zentralsterne: star.name + " ist der Zentralstern. " + (star.beschreibung ?? ""),
                planeten: members.filter(item => /planet/i.test(item.typ ?? "") && !/zwerg/i.test(item.typ)).map(item => item.name).join(", "),
                bahnen: orbitSummary ? "Kartierte Umlaufzeiten: " + orbitSummary + "." : ""
            }
        }
    });
}
for (const detail of dirs(path.join(cosmos, "Galaxien", "details"))) {
    const file = path.join(detail, "hauptseite", "index.html");
    if (exists(file)) build(file, "galaxien");
}
for (const dir of dirs(cosmos)) {
    const name = path.basename(dir);
    const file = path.join(dir, "Übersichtsseite", "index.html");
    if (exists(file)) build(file, { Galaxien: "galaxien", Sternensysteme: "sternensysteme" }[name] ?? "kosmologie", true, name,
        name === "Sternensysteme" ? { related: systems } : {});
}
build(path.join(cosmos, "Kosmische_übersicht", "Kosmologie.html"), "kosmologie", true, "Kosmische_übersicht");
build(path.join("inhalte", "himmelskoerper", "phaenomene", "phaenomene.html"), "phaenomene", true, "phaenomene");
build("inhalte/himmelskoerper/orvaya.html", "planeten", false, "orvaya", {
    preserveNotes: true,
    folder: "inhalte/himmelskoerper/planeten/details/orvaya",
    art: registeredArtwork("home.panorama.orvaya"),
    related: [["inhalte/spezies/Biologische Spezies/WaldFeen/hauptseite/Spezies.html", "Zum Dossier der Waldfeen"]],
    data: {
        name: "Orvaya", status: "Festgelegte Weltenbaudaten",
        intro: "Orvaya ist die Heimat der Waldfeen. In ihren wichtigsten Siedlungsregionen prägen milde Temperaturen, Wälder und Nebel das Landschaftsbild.",
        facts: { Klasse: "Gesteinsplanet", Gravitation: "0,85 g", Tageslänge: "20 Stunden", Wasserbedeckung: "40 %",
            "Temperatur in wichtigen Waldfeenregionen": "ca. 10 bis 20 °C" },
        topics: {
            astronomie: "Orvaya umkreist einen einzelnen sonnenähnlichen Stern. Ein Tag dauert 20 Stunden.",
            klima: "In den wichtigsten Waldfeenregionen herrschen rund 10 bis 20 °C. Jahreszeiten und Niederschläge unterscheiden sich regional.",
            gewässer: "Seen und Flüsse bilden die Gewässer des Planeten. Wasser bedeckt 40 Prozent der Oberfläche. Orvaya hat keine Ozeane.",
            spezies: "Orvaya ist die Heimat der Waldfeen."
        }
    }
});
console.log(JSON.stringify({ ...stats, missing: stats.missing.slice(0, 10), missingCount: stats.missing.length,
    brokenLinks: stats.brokenLinks.slice(0, 10), brokenLinkCount: stats.brokenLinks.length }, null, 2));
if (stats.missing.length || stats.brokenLinks.length) process.exitCode = 1;
