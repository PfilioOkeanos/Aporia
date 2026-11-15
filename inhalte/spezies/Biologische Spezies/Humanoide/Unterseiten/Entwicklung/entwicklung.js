import { centerSingleCardRows } from "../../../../_gemeinsam/wissenslayout.js";
import { applyAporiaRoutes } from "../../../../../../Menüs/adapter/aporia-routes.js";
applyAporiaRoutes(document);
const status = document.querySelector("#fachbereich-status");
for (const link of document.querySelectorAll("[data-pending-topic]")) {
    link.addEventListener("click", event => {
        event.preventDefault();
        status.hidden = false;
        status.textContent = link.dataset.pendingTopic + " · Unterseite in Vorbereitung";
    });
}

centerSingleCardRows();
