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

// Das Fraktionswappen führt zum selben Dossier wie der Textlink der Karte.
document.querySelectorAll(".faction-card").forEach((card) => {
  const image = card.querySelector(".faction-emblem");
  const destination = card.querySelector(".card-link[href]");
  if (!image || !destination) return;

  const imageLink = document.createElement("a");
  imageLink.className = "faction-emblem-link";
  imageLink.href = destination.href;
  imageLink.setAttribute("aria-label", destination.textContent.trim() + ": " + card.querySelector("h2")?.textContent.trim());
  image.before(imageLink);
  imageLink.append(image);
});
