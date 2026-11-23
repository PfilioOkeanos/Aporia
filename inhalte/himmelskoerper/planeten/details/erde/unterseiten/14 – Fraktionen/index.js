import "../../../../../../../Men%C3%BCs/TopBar/Top_bar.js";
import "../../../../../../../Men%C3%BCs/Side_bar/side_bar.js";
import { applyAporiaRoutes, getAporiaRoute } from "../../../../../../../Men%C3%BCs/adapter/aporia-routes.js";

applyAporiaRoutes();
const karte = document.querySelector("[data-earth-map]");
if (karte) {
    const ziel = new URL(getAporiaRoute("sternenkarte"));
    ziel.searchParams.set("objekt", "Kugel 4");
    karte.href = ziel.href;
}
