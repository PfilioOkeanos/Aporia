import "../../../../../../../Menüs/TopBar/Top_bar.js";
import "../../../../../../../Menüs/Side_bar/side_bar.js";
import { applyAporiaRoutes, getAporiaRoute } from "../../../../../../../Menüs/adapter/aporia-routes.js";

applyAporiaRoutes();
const map = new URL(getAporiaRoute("sternenkarte"));
map.searchParams.set("objekt", "Kugel 4");
document.querySelector("[data-earth-map]").href = map.href;

const species = [
    ["Tiger", "Panthera tigris", "Säugetiere", "Wald und Grasland", "Asien", "Fleischfresser", "Je nach Population unterschiedlich", "Stark gefährdet (IUCN, 2022)", "Großkatze", "https://sintas.or.id/wp-content/uploads/2022/11/IUCN-Tiger-2022.pdf"],
    ["Afrikanischer Savannenelefant", "Loxodonta africana", "Säugetiere", "Savanne und Wald", "Afrika südlich der Sahara", "Pflanzenfresser", "Bis etwa 4 m Schulterhöhe", "Stark gefährdet (IUCN)", "Vom Afrikanischen Waldelefanten zu unterscheiden", "https://doi.org/10.2305/IUCN.UK.2022-2.RLTS.T181008073A223031019.en"],
    ["Blauwal", "Balaenoptera musculus", "Säugetiere", "Meer", "In mehreren Ozeanen", "Vor allem Krill", "Bis etwa 33 m", "Gefährdet (US-ESA)", "Größtes bekanntes Tier", "https://www.fisheries.noaa.gov/species/blue-whale"],
    ["Rotaugenlaubfrosch", "Agalychnis callidryas", "Amphibien", "Tropischer Regenwald", "Mittelamerika", "Vor allem Insekten", "Wenige Zentimeter", "Nicht im Dossier bewertet", "Überwiegend nachtaktiv", "https://animaldiversity.org/accounts/Agalychnis_callidryas/"],
    ["Stieleiche", "Quercus robur", "Pflanzen", "Wald und Tiefland", "Natürlich von Europa bis Iran", "Fotosynthese", "Mehrere zehn Meter", "Nicht im Dossier bewertet", "Heimische Baumart in weiten Teilen Europas", "https://powo.science.kew.org/taxon/304293-2"],
    ["Haushuhn", "Gallus gallus domesticus", "Vögel", "Siedlung und Kulturland", "Weltweit in Haltung", "Allesfresser", "Rasseabhängig", "Domestiziert", "Haustierform von Gallus gallus", "https://www.ncbi.nlm.nih.gov/mesh/D002645"],
    ["Escherichia coli", "Escherichia coli", "Bakterien", "Darm und Umwelt", "Weltweit", "Heterotroph", "Mikrometerbereich", "Nicht im Dossier bewertet", "Bakterienart mit unterschiedlichen Stämmen", "https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=562"]
];
document.querySelector("[data-life-total]").textContent = String(species.length);
const rows = document.querySelector("[data-life-rows]");
const search = document.querySelector("[data-life-search]");
const filters = [["group", 2], ["habitat", 3], ["status", 7]].map(([key, column]) => {
    const select = document.querySelector("[data-life-" + key + "]");
    const values = [...new Set(species.map(entry => entry[column]))].sort((a, b) => a.localeCompare(b, "de"));
    for (const value of values) select.add(new Option(value, value));
    return { select, column };
});
const prev = document.querySelector("[data-life-prev]");
const next = document.querySelector("[data-life-next]");
const count = document.querySelector("[data-life-count]");
const pageSize = 6;
let page = 0;
const normalize = value => value.toLocaleLowerCase("de").normalize("NFD").replace(/\p{M}/gu, "");

function render() {
    const term = normalize(search.value.trim());
    const matches = species.filter(entry =>
        (!term || normalize(entry.slice(0, 9).join(" ")).includes(term)) &&
        filters.every(({ select, column }) => !select.value || entry[column] === select.value));
    const start = page * pageSize;
    rows.replaceChildren(...matches.slice(start, start + pageSize).map(entry => {
        const row = document.createElement("tr");
        entry.slice(0, 9).forEach((value, i) => {
            const cell = document.createElement(i === 0 ? "th" : "td");
            if (i === 0) cell.scope = "row";
            if (i === 1) {
                const italic = document.createElement("i");
                italic.textContent = value;
                cell.append(italic);
            } else cell.textContent = value;
            if (i === 8) {
                const source = document.createElement("a");
                source.href = entry[9];
                source.textContent = "Quelle";
                cell.append(" · ", source);
            }
            row.append(cell);
        });
        return row;
    }));
    count.textContent = matches.length ? (start + 1) + "–" + Math.min(start + pageSize, matches.length) + " von " + matches.length + " Einträgen" : "Keine passenden Einträge.";
    prev.disabled = page === 0;
    next.disabled = start + pageSize >= matches.length;
}
function reset() { page = 0; render(); }
search.addEventListener("input", reset);
for (const { select } of filters) select.addEventListener("change", reset);
prev.addEventListener("click", () => { if (page > 0) { page--; render(); } });
next.addEventListener("click", () => { if (!next.disabled) { page++; render(); } });
render();
