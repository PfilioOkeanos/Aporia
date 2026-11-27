import { applyAporiaRoutes, getAporiaRoute } from "../../../Menüs/adapter/aporia-routes.js";
import { applyAporiaMedia } from "../../../Menüs/adapter/aporia-media.js";
import { getCelestialDetailUrl, loadCelestialCatalog } from "../../../Menüs/adapter/aporia-celestial.js";

const sections = [
  ["Planeten", [
    ["Gesteinsplaneten", "planeten", "waldwelt"], ["Gasplaneten", "planeten", "gasriese"],
    ["Eisplaneten", "planeten", "eiswelt", "Eiswelten"], ["Ozeanplaneten", "planeten", "ozeanwelt", "Ozeanwelten"],
    ["Wüstenplaneten", "planeten", "wuestenwelt"], ["Vulkanplaneten", "planeten", "vulkanwelt", "Vulkanwelten"],
    ["Freifliegende Planeten", "planeten", "eiswelt"], ["Zwergplaneten", "zwergplaneten", "zwergplanet"],
  ]],
  ["Sterne und Sternüberreste", [
    ["Sterne", "sterne", "sonnenstern"], ["Braune Zwerge", "sterne", "sonnenstern"],
    ["Weiße Zwerge", "sterne", "sonnenstern"], ["Neutronensterne", "sterne", "neutronenstern"],
    ["Schwarze Löcher", "schwarze-loecher", "schwarzes-loch"], ["Sternensysteme", "sternensysteme", "sternensystem"],
  ]],
  ["Monde und Kleinkörper", [
    ["Monde", "monde", "mond"], ["Asteroiden", "asteroiden", "asteroid"], ["Kometen", "kometen", "nebel"],
  ]],
  ["Lebende Welten", [
    ["Lebende Planeten", "planeten", "waldwelt"], ["Lebende Monde", "monde", "mond"],
    ["Biologische Himmelskörper", "planeten", "waldwelt"], ["Kollektive Planeten", "planeten", "ozeanwelt"],
    ["Synthetische Planetenwesen", "planeten", "felsiger-zwerg"], ["Symbiotische Planeten", "planeten", "waldwelt"],
  ]],
  ["Nebel und weitere Objekte", [
    ["Emissionsnebel", "nebel", "nebel"], ["Reflexionsnebel", "nebel", "reflexionsnebel"],
    ["Dunkelnebel", "nebel", "dunkelnebel"], ["Planetarische Nebel", "nebel", "nebel"],
    ["Galaxien", "galaxien", "galaxie"], ["Kosmische Phänomene", "phaenomene", "supernova"],
  ]],
];

const main = document.querySelector(".celestial-index");
const cards = document.querySelector("#celestial-cards");
const jumps = document.querySelector(".celestial-jumps");
const previews = [];
let currentPlayer;

function makeCard(title, route, art, group, index) {
  const card = document.createElement("article");
  card.className = "orbit-card";
  // Hörprobe als eigenes kleines Feld (der eingebaute Player ist auf Android breiter als die Karte)
  card.innerHTML = '<a class="orbit-image"><img alt="" loading="lazy" width="245" height="245"></a><h3><a></a></h3>' +
    '<button type="button" class="hoerprobe" aria-pressed="false"><span class="hoerprobe-symbol" aria-hidden="true">▶</span><span>Hörprobe</span><span class="hoerprobe-leiste" aria-hidden="true"><i></i></span></button>' +
    '<audio preload="none"></audio>';
  const [imageLink, titleLink] = card.querySelectorAll("a");
  const image = card.querySelector("img");
  const player = card.querySelector("audio");
  const feld = card.querySelector(".hoerprobe");
  const symbol = feld.querySelector(".hoerprobe-symbol");
  const fortschritt = feld.querySelector(".hoerprobe-leiste i");
  feld.setAttribute("aria-label", "Hörprobe abspielen: " + title);
  feld.addEventListener("click", () => { if (player.paused) player.play().catch(() => {}); else player.pause(); });
  const zustand = () => {
    const laeuft = !player.paused && !player.ended;
    feld.setAttribute("aria-pressed", String(laeuft));
    feld.classList.toggle("ist-am-spielen", laeuft);
    symbol.textContent = laeuft ? "❚❚" : "▶";
    feld.setAttribute("aria-label", (laeuft ? "Hörprobe pausieren: " : "Hörprobe abspielen: ") + title);
  };
  player.addEventListener("play", zustand);
  player.addEventListener("pause", zustand);
  player.addEventListener("ended", () => { player.currentTime = 0; fortschritt.style.width = "0%"; zustand(); });
  player.addEventListener("timeupdate", () => {
    if (player.duration) fortschritt.style.width = (player.currentTime / player.duration * 100).toFixed(1) + "%";
  });
  imageLink.setAttribute("aria-label", title + " – " + (title.toLowerCase() === route ? "Übersicht" : "zugehöriges Archiv") + " öffnen");
  titleLink.textContent = title;
  imageLink.dataset.route = titleLink.dataset.route = route;
  image.dataset.mediaImage = "himmelskoerper.archiv." + art;
  previews.push({ title, route, group: group ?? title, image, links: [imageLink, titleLink] });
  player.setAttribute("aria-label", "Gestaltete Hörprobe: " + title);
  player.src = makeSound(index, route);
  player.addEventListener("play", () => {
    if (currentPlayer && currentPlayer !== player) currentPlayer.pause();
    currentPlayer = player;
  });
  return card;
}

function makeSound(index, route) {
  const rate = 12000;
  const length = rate * 7;
  const bytes = new ArrayBuffer(44 + length * 2);
  const view = new DataView(bytes);
  const write = (offset, value) => [...value].forEach((letter, i) => view.setUint8(offset + i, letter.charCodeAt(0)));
  write(0, "RIFF");
  view.setUint32(4, bytes.byteLength - 8, true);
  write(8, "WAVEfmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, rate, true);
  view.setUint32(28, rate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  write(36, "data");
  view.setUint32(40, length * 2, true);
  const pitch = 42 + index * 3;
  const windy = route === "planeten" || route === "kometen";
  let noise = 0;
  for (let i = 0; i < length; i++) {
    const time = i / rate;
    noise = .96 * noise + .04 * (Math.random() * 2 - 1);
    const fade = Math.min(time, (length - i) / rate, 1);
    const pulse = .55 + .45 * Math.sin(time * (1 + index / 10));
    const tone = Math.sin(2 * Math.PI * pitch * time + Math.sin(time * 1.6))
      + .25 * Math.sin(2 * Math.PI * pitch * 1.51 * time);
    view.setInt16(44 + i * 2, 32767 * fade * pulse * (tone * .06 + noise * (windy ? .36 : .18)), true);
  }
  return URL.createObjectURL(new Blob([bytes], { type: "audio/wav" }));
}

const tabs = [
  ["Übersicht", "Orvaya ist die Heimatwelt der Waldfeen. Ihre Tage dauern 16 bis 20 Stunden."],
  ["Rohstoffe", "Ein Rohstoffverzeichnis für Orvaya ist hier noch nicht hinterlegt."],
  ["Flora & Fauna", "Der Weltenbaum prägt die Lebensräume. Mädesüß und sein Bestäuber Ulmaäde sind dokumentiert."],
  ["Gravitation", "Die Schwerkraft ist etwas geringer als auf der Erde."],
  ["Atmosphäre", "Zur Zusammensetzung der Atmosphäre sind hier noch keine Daten hinterlegt."],
  ["Klima & Wind", "Das Klima ist überwiegend herbstlich und oft leicht neblig. Windwerte sind hier noch nicht hinterlegt."],
  ["Geologie", "Das Planetendossier beschreibt Kontinente, Gewässer und die Schlucht am Weltenbaum."],
  ["Umlaufbahn", "Bahndaten sind hier noch nicht hinterlegt."],
];

const tabBar = document.querySelector(".world-tabs");
const worldData = document.querySelector("#world-data");
for (const [name, description] of tabs) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = name;
  button.dataset.sidebarTab = "";
  button.setAttribute("aria-pressed", "false");
  button.addEventListener("click", () => {
    for (const tab of tabBar.children) tab.setAttribute("aria-pressed", String(tab === button));
    worldData.textContent = description;
  });
  tabBar.append(button);
}
tabBar.firstElementChild.click();
main.dispatchEvent(new Event("aporia:detail-tabs-ready"));

const selectedCategory = new URLSearchParams(location.search).get("kategorie");
const category = sections.flatMap(([, entries]) => entries)
  .find(([title]) => title === selectedCategory);

applyAporiaRoutes(main);
if (category) {
  await renderCategory(category);
} else {
  main.querySelector(".world-preview").hidden = true;
  renderOverview();
}

function renderOverview() {

let index = 0;
for (const [heading, entries] of sections) {
  const section = document.createElement("section");
  section.className = "celestial-group";
  section.id = "archiv-" + index;
  const jump = document.createElement("a");
  jump.href = "#" + section.id;
  jump.textContent = heading;
  jumps.append(jump);
  const title = document.createElement("h2");
  title.textContent = heading;
  const grid = document.createElement("div");
  grid.className = "orbit-grid";
  for (const entry of entries) grid.append(makeCard(entry[0], entry[1], entry[2], entry[3], index++));
  section.append(title, grid);
  cards.append(section);
}

applyAporiaRoutes(main);
const catalogs = new Map();
void Promise.allSettled(previews.map(async ({ title, route, group, image, links }) => {
  if (!catalogs.has(route)) catalogs.set(route, loadCelestialCatalog(route));
  const entries = await catalogs.get(route);
  const match = entries.find(entry => entry.group === group)
    ?? entries.find(entry => entry.title?.toLowerCase().includes(title.toLowerCase().replace(/e[rn]?$/, "")))
    ?? (["kometen", "asteroiden", "zwergplaneten", "sternensysteme"].includes(route) ? entries[0] : null);
  if (match?.preview) image.dataset.mediaImage = match.preview;
})).then(() => applyAporiaMedia(main));

for (const { title, links } of previews) {
  const url = new URL(getAporiaRoute("himmelskoerper"));
  url.searchParams.set("kategorie", title);
  for (const link of links) {
    delete link.dataset.route;
    link.href = url.href;
    if (link.classList.contains("orbit-image")) link.setAttribute("aria-label", title + " öffnen");
  }
}
}

async function renderCategory([title, route, , group = title]) {
  main.querySelector("h1").textContent = title;
  main.querySelector(".celestial-hero p").hidden = true;
  main.querySelector(".world-preview").hidden = title !== "Gesteinsplaneten";
  const back = document.createElement("a");
  back.dataset.route = "himmelskoerper";
  back.textContent = "← Alle Himmelskörper-Kategorien";
  jumps.append(back);
  applyAporiaRoutes(main);

  const grid = document.createElement("div");
  grid.className = "orbit-grid";
  const status = document.createElement("p");
  status.setAttribute("role", "status");
  status.textContent = "Archiv wird geladen …";
  cards.append(status, grid);

  let entries;
  try {
    entries = await loadCelestialCatalog(route);
  } catch {
    status.textContent = "Für diese Kategorie ist hier noch kein Bildkatalog verfügbar.";
    return;
  }

  const broadArchives = ["asteroiden", "kometen", "zwergplaneten", "schwarze-loecher", "sternensysteme"];
  const titlePatterns = {
    "Emissionsnebel": /emissions?nebel/i,
    "Reflexionsnebel": /reflexions?nebel/i,
    "Dunkelnebel": /dunkelnebel/i,
    "Planetarische Nebel": /planetarisch/i,
    "Neutronensterne": /neutronenstern/i,
    "Freifliegende Planeten": /freifliegend|vagabund|rogue/i,
    "Biologische Himmelskörper": /biologische[rn]? himmelskörper/i,
    "Kollektive Planeten": /kollektiv/i,
    "Symbiotische Planeten": /symbio/i,
  };
  const pattern = titlePatterns[title];
  const matches = entries.filter(entry =>
    broadArchives.includes(route) || entry.group === group || pattern?.test(entry.title)
  );

  status.textContent = matches.length ? "" : "Für diese Kategorie sind noch keine Einträge zugeordnet.";
  const more = document.createElement("button");
  more.type = "button";
  more.textContent = "Weitere Einträge";
  cards.append(more);
  let offset = 0;
  function appendBatch() {
    for (const entry of matches.slice(offset, offset + 24)) {
      const card = document.createElement("article");
      card.className = "orbit-card";
      const link = document.createElement("a");
      link.className = "orbit-image";
      link.href = getCelestialDetailUrl(route, entry.slug);
      card.dataset.celestialDossier = link.href;
      card.dataset.celestialGroup = entry.group ?? "";
      link.setAttribute("aria-label", entry.title);
      const image = document.createElement("img");
      image.alt = "";
      image.loading = "lazy";
      image.dataset.mediaImage = entry.preview;
      link.append(image);
      const heading = document.createElement("h3");
      const name = document.createElement("a");
      name.href = link.href;
      name.textContent = entry.title;
      heading.append(name);
      card.append(link, heading);
      grid.append(card);
      void applyAporiaMedia(card);
    }
    offset += 24;
    more.hidden = offset >= matches.length;
  }
  more.addEventListener("click", appendBatch);
  appendBatch();
}
