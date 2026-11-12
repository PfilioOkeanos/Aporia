import { applyAporiaRoutes } from "../../../Menüs/adapter/aporia-routes.js";
import "../../../Menüs/TopBar/Top_bar.js";
import "../../../Menüs/Side_bar/side_bar.js";

applyAporiaRoutes(document);

const groups = {
  biological: {
    title: "Biologische Spezies",
    range: "ARCHIVREIHE 01–20",
    image: "../../../assets/bilder/Spezies_\u00fcbersicht_bilder/Kosmische Zelllandschaft des Lebens-2.png",
    description: "Lebensformen mit biologischer Grundlage. Dieses Gruppenmenü bildet den Einstieg in ihre spätere systematische Übersicht.",
  },
  mental: {
    title: "Mentale Spezies",
    range: "ARCHIVREIHE 21–30",
    image: "../../../assets/bilder/Spezies_\u00fcbersicht_bilder/Kosmische Resonanz der Gedanken-1.png",
    description: "Lebensformen, deren Einordnung auf mentalen Eigenschaften beruht. Die Untergliederung kann hier später ergänzt werden.",
  },
  cosmic: {
    title: "Kosmische Spezies",
    range: "ARCHIVREIHE 31–40",
    image: "../../../assets/bilder/Spezies_\u00fcbersicht_bilder/Sternenwebwerk aus Nebeln und Gravitationsringen-3.png",
    description: "Lebensformen mit kosmischer Prägung. Das Gruppenmenü ist als eigener Einstieg für spätere Untergruppen vorbereitet.",
  },
  technological: {
    title: "Technologische Lebensformen",
    range: "ARCHIVREIHE 41–50",
    image: "../../../assets/bilder/Spezies_\u00fcbersicht_bilder/Leuchtende Gitter technologischer Lebensformen-5.png",
    description: "Technologische Lebensformen werden in diesem Bereich gesammelt und später weiter unterteilt.",
  },
  gigantic: {
    title: "Gigantische Lebensformen",
    range: "ARCHIVREIHE 51–59",
    image: "../../../assets/bilder/Spezies_\u00fcbersicht_bilder/Kartografie eines planetaren Organismus-6.png",
    description: "Lebensformen, deren außergewöhnliche Größe ihre Einordnung prägt. Das Motiv zeigt Maßstab und Struktur, ohne eine Spezies vorwegzunehmen.",
  },
};

const imageForWave = {
  biological: groups.biological.image,
  mental: groups.mental.image,
  cosmic: "../../../assets/bilder/Spezies_\u00fcbersicht_bilder/Kosmisches Leben in Lichtstr\u00f6men-4.png",
  technological: groups.technological.image,
  gigantic: groups.gigantic.image,
};
const menu = document.querySelector("#group-menu");
const menuTitle = document.querySelector("#group-menu-title");
const menuRange = document.querySelector("#group-menu-range");
const menuDescription = document.querySelector("#group-menu-description");
const menuArt = document.querySelector(".menu-art");
const waveButtons = [...document.querySelectorAll(".group-wave[data-group]")];
let activeButton = null;

for (const button of waveButtons) {
  const image = button.querySelector(".wave-art");
  image.src = new URL(imageForWave[button.dataset.group], import.meta.url).href;
  button.addEventListener("click", () => openGroup(button));
}

function openGroup(button) {
  const group = groups[button.dataset.group];
  if (!group || !menu) return;
  activeButton?.setAttribute("aria-expanded", "false");
  activeButton = button;
  activeButton.setAttribute("aria-expanded", "true");
  menuTitle.textContent = group.title;
  menuRange.textContent = group.range;
  menuDescription.textContent = group.description;
  menuArt.src = new URL(group.image, import.meta.url).href;
  menuArt.alt = `Abstraktes Gruppenmotiv: ${group.title}`;
  menu.hidden = false;
  menu.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function closeGroup() {
  if (!menu) return;
  menu.hidden = true;
  activeButton?.setAttribute("aria-expanded", "false");
  activeButton?.focus();
  activeButton = null;
}

document.querySelector("[data-close-menu]")?.addEventListener("click", closeGroup);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menu && !menu.hidden) closeGroup();
});