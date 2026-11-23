const groups = {
    Wissenschaft: /astronomie|physik|struktur|geologie/i,
    Natur: /geografie|atmosphäre|klima|gewässer|biosphäre|gaszusammensetzung|wolken|stürme/i,
    Zivilisation: /spezies|zivilisation|geschichte|fraktionen/i
};
const celestialGroups = {
    Astronomie: /astronomie|bahn|rotation|mutterplanet|gezeiten|umgebung|zentralstern|planeten|stabilität/i,
    Eigenschaften: /physik|masse|fusion|leuchtkraft|spektral|morphologie|kern|aufbau|zusammensetzung|atmosphäre|klima|geologie|staub|gas|ionisation|schweif|koma|horizont|akkretion|population|dynamik/i,
    Entwicklung: /geschichte|zyklus|herkunft|entstehung|erforschung|besonderheiten/i
};
const overviewLabels = {
    planeten: "Planeten", zwergplaneten: "Zwergplaneten", monde: "Monde", sterne: "Sterne",
    asteroiden: "Asteroiden", kometen: "Kometen", nebel: "Nebelgebiete",
    "schwarze-loecher": "Schwarze Löcher", galaxien: "Galaxien", sternensysteme: "Sternsysteme"
};
const oldAnchors = {
    Allgemeines: "uebersicht", Astronomie: "orbit", Physik: "gravitation", Geografie: "gelaende",
    Atmosphäre: "atmosphaere", Klima: "wetter", Biosphäre: "lebensformen", Zivilisation: "siedlungen",
    Rohstoffe: "rohstoffe", Erforschung: "entdeckungen", Besonderheiten: "gefahren"
};
const extraAnchors = {
    landung: ["Erforschung", "Astronomie"], reaktionen: ["Besonderheiten", "Geologie"]
};
const chapterRoutes = new Set(["planeten", "zwergplaneten", "monde", "sterne", "asteroiden", "kometen",
    "nebel", "schwarze-loecher"]);

export function celestialDashboard(record, chapters, options) {
    const { esc, url, links, id, mapHref, original, preserved = "", mapSystem, reference } = options;
    const { file, slug, data, art, group, title, category, known } = record;
    const layout = "inhalte/himmelskoerper/planeten/details/erde/hauptseite";
    const isPlanet = ["planeten", "zwergplaneten"].includes(category);
    const showGlobe = isPlanet || category === "monde";
    const parent = category === "galaxien" || mapSystem
        ? "inhalte/Kosmologie/" + (mapSystem ? "Sternensysteme" : "Galaxien") + "/Übersichtsseite/index.html"
        : "inhalte/himmelskoerper/" + category + "/" + category + ".html";
    const asset = target => url(file, target);
    const imageUrl = art ? esc(art.url ?? asset(art.file)) : "";
    const image = (attrs = "") => imageUrl ? '<img src="' + imageUrl + '" alt="" decoding="async" ' + attrs + '>' : "";
    const chapterLink = entry => asset(entry.file);
    const list = rows => '<dl>\n' + rows.map(([label, value]) =>
        '    <div><dt>' + esc(label) + '</dt><dd>' + esc(value) + '</dd></div>').join("\n") + '\n</dl>';
    const menuGroups = isPlanet ? groups : celestialGroups;
    const menus = new Map([...Object.keys(menuGroups), "Weitere"].map(label => [label, []]));
    chapters.forEach(entry => {
        const label = Object.keys(menuGroups).find(key => menuGroups[key].test(entry.label)) ?? "Weitere";
        menus.get(label).push(entry);
    });
    const menuHtml = [...menus].filter(([, entries]) => entries.length).map(([label, entries]) =>
        '<details name="earth-chapters"><summary>' + label + '</summary><ul>' +
        entries.map(entry => '<li><a href="' + chapterLink(entry) + '">' + esc(entry.label) + '</a></li>').join("") +
        '</ul></details>').join("\n");
    const aliasesByChapter = new Map();
    for (const [alias, labels] of isPlanet ? [] : Object.entries(extraAnchors)) {
        const entry = labels.map(label => chapters.find(chapter => chapter.label === label)).find(Boolean) ?? chapters[0];
        if (entry) aliasesByChapter.set(entry, [...(aliasesByChapter.get(entry) ?? []), alias]);
    }
    for (const [label, alias] of isPlanet ? [] : Object.entries(oldAnchors)) {
        if (!chapters.some(entry => entry.label === label) && chapters[0]) {
            aliasesByChapter.set(chapters[0], [...(aliasesByChapter.get(chapters[0]) ?? []), alias]);
        }
    }
    const cards = chapters.map(entry => {
        const anchor = oldAnchors[entry.label];
        return '<a data-sidebar-tab href="' + chapterLink(entry) + '"' +
            (anchor ? ' id="erkundung-' + anchor + '"' : "") + '>' +
            (aliasesByChapter.get(entry) ?? []).map(alias => '<i class="dashboard-anchor" id="erkundung-' + alias + '" aria-hidden="true"></i>').join("") +
            image('loading="lazy"') + '<span>' + esc(entry.label) + '</span></a>';
    }).join("\n");
    const featureTopics = isPlanet ? /^(geografie|atmosphäre|gewässer|besonderheiten|biosphäre|planetare struktur|wolkenschichten)$/i
        : /spektral|fusion|leuchtkraft|lebenszyklus|morphologie|kern|zusammensetzung|horizont|akkretion|schweif|koma|ionisation|gezeiten|zentralstern|planeten|bahnen|umgebung/i;
    const features = Object.entries(data.topics).filter(([label, description]) => description && featureTopics.test(label))
        .slice(0, 5).map(([label, description]) => {
            const entry = chapters.find(chapter => chapter.label.toLowerCase() === label);
            return entry ? '<a href="' + chapterLink(entry) + '">' + image('loading="lazy"') +
                '<span>' + esc(entry.label) + '</span></a>' : "";
        }).filter(Boolean);
    const position = [
        ["Sternsystem", data.facts.Sternsystem ?? "Offen"],
        ["Zentralkörper", data.facts.Zentralkörper ?? "Offen"]
    ];
    const facts = Object.entries({ "Archiv-ID": id, ...data.facts })
        .filter(([label]) => !position.some(([field]) => field === label));
    const radius = known?.radiusKm ?? Number(String(data.facts.Radius ?? "").replaceAll(".", "").replace(",", ".").replace(/ km$/, ""));
    const mediaChapter = chapters.find(chapter => chapter.label === "Medienarchiv");
    const related = [...links, ...(mediaChapter ? [[mediaChapter.file, "Medienarchiv"]] : [])];
    const classification = data.facts.Klasse || (category === "planeten" ? "Planet" :
        category === "zwergplaneten" ? "Zwergplanet" : overviewLabels[category] || "Himmelskörper");
    const categoryLink = isPlanet ? 'data-route="' + category + '" href="' + asset(parent) + '"' :
        'href="' + asset(parent) + '"' + (chapterRoutes.has(category) ? ' data-route="' + category + '"' : "");
    const marker = art?.id ? 'data-media-image="' + esc(art.id) + '"' : "";
    const sources = [...(reference?.sources ?? []), ...(art?.credit ? [["Bild · " + art.credit, art.page]] : [])];
    return `<!doctype html>
<html lang="de">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#061611">
    <title>${esc(data.name)} · Aporia Weltenarchiv</title>
    <link rel="stylesheet" href="${asset("Menüs/TopBar/Top_bar.css")}">
    <link rel="stylesheet" href="${asset("Menüs/Side_bar/Side_bar.css")}">
    <link rel="stylesheet" href="${asset(layout + "/erde.css")}">
    <script type="module" src="${asset(layout + "/erde.js")}"></script>
</head>
<body class="earth-page planet-dashboard" data-page="${esc(category)}" data-section="himmelskoerper"
      data-archive-title="${esc(title)}" data-archive-group="${esc(group)}"${reference?.theme ? ' data-celestial-theme="' + esc(reference.theme) + '"' : ""}>
    <div data-aporia-topbar></div>
    <div class="earth-frame">
        <div data-aporia-sidebar data-sidebar-default-collapsed hidden></div>
        <main id="inhalt">
            <header class="earth-hero" id="uebersicht">
                <div class="earth-panorama" aria-hidden="true">${image(marker)}</div>
                <div class="earth-hero-nav">
                    <nav class="earth-crumb" aria-label="Archivpfad"><a ${categoryLink}>${esc(overviewLabels[category])}</a><span aria-hidden="true">›</span><span aria-current="page">${esc(data.name)}</span></nav>
                    <nav class="earth-tabs" aria-label="Kapitelnavigation">
                        <a href="#uebersicht" aria-current="page">Übersicht</a>
                        ${menuHtml}
                    </nav>
                </div>
                <div class="earth-title">
                    <h1>${esc(data.name)}</h1>
                    <p class="earth-class">${esc(classification)}</p>
                    <p>${esc(data.intro)}</p>
                    <p class="planet-status">${esc(data.status)}</p>
                </div>
            </header>
            <div class="earth-dashboard">
                <section class="earth-panel earth-quick" data-sidebar-details data-sidebar-default>
                    <h2>Schnellnavigation</h2>
                    <div class="earth-cards">${cards}</div>
                </section>
                <section class="earth-panel earth-facts">
                    <h2>Grunddaten</h2>
                    ${list(facts)}
                </section>
                <section class="earth-panel earth-view">
                    <h2>${showGlobe ? "3D-Ansicht" : "Objektansicht"}</h2>
                    ${showGlobe ? `<div class="earth-player" data-earth-player data-planet="${esc(slug)}" data-planet-class="${esc(classification)}" data-radius="${Number.isFinite(radius) && radius > 0 ? radius * 1000 : ""}">
                        <canvas width="320" height="320" tabindex="0" aria-label="${isPlanet ? "Planetenglobus" : "Globus"}. Mit Pfeiltasten oder Ziehen drehen, mit Mausrad, Plus oder Minus zoomen." hidden></canvas>
                        <div class="earth-controls" role="group" aria-label="Globussteuerung" hidden>
                            <button type="button" data-turn="-1" aria-label="Nach links drehen">‹</button>
                            <button type="button" data-turn="1" aria-label="Nach rechts drehen">›</button>
                            <button type="button" data-fullscreen aria-label="Vollbild öffnen" aria-pressed="false">⛶</button>
                            <div class="earth-zoom">
                                <button type="button" data-zoom="-1" aria-label="Herauszoomen">−</button>
                                <button type="button" data-zoom="1" aria-label="Heranzoomen">+</button>
                            </div>
                        </div>
                        <span class="earth-crosshair" aria-hidden="true" hidden></span>
                        <output class="earth-coordinates" aria-label="Koordinaten und Breite am Bildzentrum" hidden></output>
                        <p class="earth-view-note">360° · Schematischer Globus</p>
                    </div>` : art ? '<figure class="celestial-dashboard-art"><a href="' + imageUrl + '" aria-label="Archivbild in voller Größe öffnen">' +
                    image('loading="lazy"') + '</a></figure>' : '<p class="celestial-dashboard-art">Kein Archivbild hinterlegt.</p>'}
                </section>
                <div class="earth-aside">
                    <section class="earth-panel">
                        <h2>Position</h2>
                        ${list(position)}
                        ${mapHref ? '<a class="earth-map" href="' + esc(mapHref) + '">In der Sternenkarte öffnen →</a>' : ""}
                    </section>
                    <section class="earth-panel">
                        <h2>Verknüpfungen</h2>
                        <ul class="earth-related">${related.map(([target, label]) => '<li><a href="' + asset(target) + '">' + esc(label) + '</a></li>').join("")}</ul>
                    </section>
                </div>
                <section class="earth-panel earth-features">
                    <h2>Hauptmerkmale</h2>
                    ${features.length ? '<div class="earth-cards">' + features.join("") + '</div>' : list(facts.filter(([label]) => label !== "Archiv-ID").slice(0, 4))}
                </section>
            </div>
            ${preserved}
            ${original ? '<details class="planet-original"><summary>Bildnachweis</summary><dl><div><dt>Originaldatei</dt><dd>' + esc(original) + '</dd></div></dl></details>' : ""}${sources.length ? '\n            <footer class="earth-sources">' + sources.map(([label, href]) =>
                '<a href="' + esc(href) + '">' + esc(label) + '</a>').join(" ") + '</footer>' : ""}
        </main>
    </div>
</body>
</html>
`.replace(/[ \t]+$/gm, "");
}
