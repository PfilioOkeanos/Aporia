import { applyAporiaRoutes } from "../../../../../Men%C3%BCs/adapter/aporia-routes.js";
import "../../../../../Men%C3%BCs/TopBar/Top_bar.js";
import "../../../../../Men%C3%BCs/Side_bar/side_bar.js";

if (matchMedia("(max-width: 760px)").matches) {
    document.querySelector("[data-aporia-sidebar]").setAttribute("data-sidebar-default-collapsed", "");
}
applyAporiaRoutes(document);

// Heimatwelt-Kasten (Planetendossier + Sternenkarte) für Spezies mit Heimatwelt
import "../../../_gemeinsam/heimatwelt-verweis.js";
