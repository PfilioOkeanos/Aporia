import { getAporiaRoute } from "../../../Menüs/adapter/aporia-routes.js";

const overview = new URL(getAporiaRoute("himmelskoerper"));
overview.search = location.search;
overview.hash = location.hash;
location.replace(overview);
