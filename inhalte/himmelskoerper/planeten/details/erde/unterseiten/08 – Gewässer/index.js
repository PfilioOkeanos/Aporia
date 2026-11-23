import "../../../../../../../Menüs/TopBar/Top_bar.js";
import "../../../../../../../Menüs/Side_bar/side_bar.js";
import { applyAporiaRoutes, getAporiaRoute } from "../../../../../../../Menüs/adapter/aporia-routes.js";

applyAporiaRoutes();
const map = new URL(getAporiaRoute("sternenkarte"));
map.searchParams.set("objekt", "Kugel 4");
document.querySelector("[data-earth-map]").href = map.href;
