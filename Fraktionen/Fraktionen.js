import { applyAporiaRoutes } from "../Menüs/Router/aporia-routes.js";

const profiles = [
  {
    name: "Konföderation",
    route: "konfoederation",
    summary: "Demokratisches Bündnis mit gemeinsamer Mitbestimmung und gemeinsamem Recht."
  },
  {
    name: "Konsortium",
    route: "konsortium",
    summary: "Zentralherrschaft, die Einfluss durch Ressourcen, Verträge und wirtschaftliche Macht bündelt."
  },
  {
    name: "Protektorat",
    route: "protektorat",
    summary: "Gildenbasierter Schutzraum mit Befugnissen, Gildenpunkten und Ruf."
  },
  {
    name: "Synaptorat",
    route: "synaptorat",
    summary: "Kollektivnetzwerk mit zentralem synaptischem Kern und eigenständig denkenden Mitgliedern."
  },
  {
    name: "Ätherwanderer",
    route: "aetherwanderer",
    summary: "Unabhängige Einzelne außerhalb der Großmächte, verbunden mit den Übergängen zwischen Welten."
  }
];

const host = document.getElementById("faction-cards");
host.innerHTML = profiles.map(profile => `
  <article class="faction-overview-card">
    <span class="faction-label">FRAKTIONSPROFIL</span>
    <h2>${profile.name}</h2>
    <p>${profile.summary}</p>
    <a class="faction-card-link" href="#" data-route="${profile.route}">
      Profil öffnen →
    </a>
  </article>
`).join("");

applyAporiaRoutes(document);
