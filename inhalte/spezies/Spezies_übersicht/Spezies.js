import { applyAporiaRoutes, getAporiaRoute } from "../../../Menüs/adapter/aporia-routes.js";
import "../../../Menüs/TopBar/Top_bar.js";
import "../../../Menüs/Side_bar/side_bar.js";

applyAporiaRoutes(document);

const groups = {
  biological: {
    title: "Biologische Spezies",
    range: "ARCHIVREIHE 01–20",
    image: "../../../assets/bilder/Alle Spezies+\u00dcbersicht/Spezies_\u00fcbersicht/Kosmische Zelllandschaft des Lebens-2.png",
    description: "Lebensformen mit biologischer Grundlage. Dieses Gruppenmenü bildet den Einstieg in ihre spätere systematische Übersicht.",
  },
  mental: {
    title: "Mentale Spezies",
    range: "ARCHIVREIHE 21–30",
    image: "../../../assets/bilder/Alle Spezies+\u00dcbersicht/Spezies_\u00fcbersicht/Kosmische Resonanz der Gedanken-1.png",
    description: "Lebensformen, deren Einordnung auf mentalen Eigenschaften beruht. Die Untergliederung kann hier später ergänzt werden.",
  },
  cosmic: {
    title: "Kosmische Spezies",
    range: "ARCHIVREIHE 31–40",
    image: "../../../assets/bilder/Alle Spezies+\u00dcbersicht/Spezies_\u00fcbersicht/Sternenwebwerk aus Nebeln und Gravitationsringen-3.png",
    description: "Lebensformen mit kosmischer Prägung. Das Gruppenmenü ist als eigener Einstieg für spätere Untergruppen vorbereitet.",
  },
  technological: {
    title: "Technologische Lebensformen",
    range: "ARCHIVREIHE 41–50",
    image: "../../../assets/bilder/Alle Spezies+\u00dcbersicht/Spezies_\u00fcbersicht/Leuchtende Gitter technologischer Lebensformen-5.png",
    description: "Technologische Lebensformen werden in diesem Bereich gesammelt und später weiter unterteilt.",
  },
  gigantic: {
    title: "Gigantische Lebensformen",
    range: "ARCHIVREIHE 51-60",
    image: "../../../assets/bilder/Alle Spezies+\u00dcbersicht/Spezies_\u00fcbersicht/Kartografie eines planetaren Organismus-6.png",
    description: "Lebensformen, deren außergewöhnliche Größe ihre Einordnung prägt. Das Motiv zeigt Maßstab und Struktur, ohne eine Spezies vorwegzunehmen.",
  },
};

const imageForWave = {
  biological: groups.biological.image,
  mental: groups.mental.image,
  cosmic: "../../../assets/bilder/Alle Spezies+\u00dcbersicht/Spezies_\u00fcbersicht/Kosmisches Leben in Lichtstr\u00f6men-4.png",
  technological: groups.technological.image,
  gigantic: groups.gigantic.image,
};
for (const button of document.querySelectorAll(".group-wave[data-group]")) {
    const key = button.dataset.group;
    const link = document.createElement("a");
    link.className = button.className;
    link.dataset.group = key;
    link.dataset.route = "spezies-" + key;
    link.append(...button.childNodes);
    link.querySelector(".wave-art").src = new URL(imageForWave[key], import.meta.url).href;
    button.replaceWith(link);
}
applyAporiaRoutes(document);

const legacyGroup = location.hash.slice(1);
if (Object.hasOwn(groups, legacyGroup)) {
    location.replace(getAporiaRoute("spezies-" + legacyGroup));
}
