import { applyAporiaRoutes } from "../../../Menüs/adapter/aporia-routes.js";
import "../../../Menüs/TopBar/Top_bar.js";
import "../../../Menüs/Side_bar/side_bar.js";

applyAporiaRoutes(document);

// Nur Dossiers mit vorhandener Detailseite bekommen einen aktiven Link.
document.querySelectorAll(".card-link[data-route]").forEach((link) => {
  if (link.classList.contains("is-unavailable")) {
    link.textContent = "Dossier folgt";
    link.removeAttribute("data-route");
    link.removeAttribute("href");
    link.classList.add("card-link--pending");
  }
});