// Planeten-Widget „Leben & Rohstoffe“ – für jede Planetenseite wiederverwendbar.
// Einbinden:  <section class="planet-leben" data-planet-leben="erde-im-sternenmeer"></section>
//             <link rel="stylesheet" href="…/inhalte/Flora%20%26%20Fauna/Katalog/planet-leben.css">
//             <script type="module" src="…/inhalte/Flora%20%26%20Fauna/Katalog/planet-leben.js"></script>
// Optional:   data-planet-leben-vorschau="12"  (Anzahl der Vorschaubilder, 0 = keine)
//             data-planet-leben-nur="Pflanzen,Tiere,Pilze,Rohstoffe"  (welche Kacheln)
import { getPlanetInfo, getArtenKatalogUrl, getRohstoffKatalogUrl } from "../../../Men%C3%BCs/adapter/aporia-planeten.js";
import { ladeArten, KATEGORIEN } from "./flora-daten.js";

const ROHSTOFFE = new URL("../../Rohstoffe/daten/rohstoffe.json", import.meta.url);
let rohstoffeLaden;
const ladeRohstoffe = () => (rohstoffeLaden ??= fetch(ROHSTOFFE).then((r) => (r.ok ? r.json() : {})).catch(() => ({})));

function el(tag, text, klasse) {
    const knoten = document.createElement(tag);
    if (text != null) knoten.textContent = text;
    if (klasse) knoten.className = klasse;
    return knoten;
}

async function aufbauen(ziel) {
    const slug = ziel.dataset.planetLeben;
    const vorschau = Number(ziel.dataset.planetLebenVorschau ?? 10);
    const nur = (ziel.dataset.planetLebenNur ?? "Pflanzen,Tiere,Pilze,Rohstoffe").split(",").map((s) => s.trim());
    const [planet, arten, rohstoffe] = await Promise.all([getPlanetInfo(slug), ladeArten().catch(() => []), ladeRohstoffe()]);
    const hier = arten.filter((a) => a.planeten?.includes(slug));
    const rohHier = Object.values(rohstoffe).filter((r) => r.planeten?.includes(slug));

    const kopf = el("header", "", "planet-leben-kopf");
    kopf.append(el("p", "Bioarchiv · Rohstoffarchiv", "planet-leben-kicker"), el("h2", `Leben & Rohstoffe auf ${planet.name}`));
    const kacheln = el("div", "", "planet-leben-kacheln");
    for (const [kategorie, zeichen, text] of KATEGORIEN) {
        if (!nur.includes(kategorie)) continue;
        const a = el("a", "", "planet-leben-kachel");
        a.href = getArtenKatalogUrl({ planet: slug, kategorie });
        a.append(el("i", zeichen), el("b", String(hier.filter((x) => x.kategorie === kategorie).length)), el("span", `${text} von ${planet.name}`));
        kacheln.append(a);
    }
    if (nur.includes("Rohstoffe")) {
        const a = el("a", "", "planet-leben-kachel planet-leben-kachel--roh");
        a.href = getRohstoffKatalogUrl(slug);
        a.append(el("i", "⬡"), el("b", String(rohHier.length)), el("span", `Rohstoffe von ${planet.name}`));
        kacheln.append(a);
    }
    ziel.replaceChildren(kopf, kacheln);

    if (vorschau > 0 && hier.length) {
        const liste = el("ul", "", "planet-leben-vorschau");
        // gleichmäßig über die Kategorien verteilt
        const nachKat = KATEGORIEN.map(([k]) => hier.filter((x) => x.kategorie === k && x.bildUrl));
        const auswahl = [];
        for (let i = 0; auswahl.length < vorschau && nachKat.some((l) => l[i]); i++) for (const l of nachKat) if (l[i] && auswahl.length < vorschau) auswahl.push(l[i]);
        for (const art of auswahl) {
            const li = el("li");
            const a = el("a");
            a.href = getArtenKatalogUrl({ planet: slug, art: art.id });
            a.title = art.name;
            const bild = el("img");
            bild.src = art.bildUrl;
            bild.alt = "";
            bild.loading = "lazy";
            bild.decoding = "async";
            a.append(bild, el("span", art.name));
            li.append(a);
            liste.append(li);
        }
        ziel.append(liste);
    }
    const fuss = el("p", "", "planet-leben-fuss");
    const alle = el("a", `Gesamten Artenkatalog von ${planet.name} öffnen →`);
    alle.href = getArtenKatalogUrl({ planet: slug });
    fuss.append(alle);
    if (!hier.length) fuss.prepend(el("span", "Noch nicht ausgearbeitet · ", "planet-leben-offen"));
    ziel.append(fuss);
}

for (const ziel of document.querySelectorAll("[data-planet-leben]")) {
    aufbauen(ziel).catch((fehler) => {
        console.error("Planeten-Widget:", fehler);
        ziel.textContent = "Flora, Fauna und Rohstoffe konnten nicht geladen werden.";
    });
}
