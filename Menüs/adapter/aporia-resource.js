import { getAporiaRoute } from "./aporia-routes.js";

export function getResourceDetailUrl(group, id) {
    const number = id.match(/-(\d+)\.png$/i)?.[1];
    if (!number || !["elemente", "raumfahrt"].includes(group)) return null;
    return new URL(group + "-" + number.padStart(3, "0") + ".html", getAporiaRoute("rohstoff-detail")).href;
}
