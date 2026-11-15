import { applyAporiaRoutes } from "../../../../../Men%C3%BCs/adapter/aporia-routes.js";

applyAporiaRoutes(document);
const status = document.querySelector("#fachseiten");
for (const link of document.querySelectorAll("[data-pending]")) {
    link.addEventListener("click", () => {
        status.textContent = link.dataset.pending + " · Fachseite in Vorbereitung.";
    });
}
