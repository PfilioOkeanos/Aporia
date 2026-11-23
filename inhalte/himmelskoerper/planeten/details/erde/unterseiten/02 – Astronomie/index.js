import "../../../../../../../Menüs/TopBar/Top_bar.js";
import "../../../../../../../Menüs/Side_bar/side_bar.js";
import { applyAporiaRoutes, getAporiaRoute } from "../../../../../../../Menüs/adapter/aporia-routes.js";

applyAporiaRoutes();
const map = new URL(getAporiaRoute("sternenkarte"));
map.searchParams.set("objekt", "Kugel 4");
document.querySelector("[data-earth-map]").href = map.href;

const radians = Math.PI / 180;
const day = 86400000;
const now = new Date();
const date = document.querySelector("[data-orbit-date]");
date.dateTime = now.toISOString();
date.textContent = new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", timeZone: "UTC" }).format(now);

if (now.getUTCFullYear() >= 1800 && now.getUTCFullYear() <= 2050) {
    // JPL Table 1, Earth–Moon barycenter, linear elements relative to J2000.
    const julianCentury = (now.getTime() - Date.UTC(2000, 0, 1, 12)) / day / 36525;
    const a = (1.00000261 + .00000562 * julianCentury) * 149597870.7;
    const e = .01671123 - .00004392 * julianCentury;
    const meanMotionDegrees = 35999.37244981 - .32327364;
    const mean = ((100.46457166 - 102.93768193 + meanMotionDegrees * julianCentury) % 360) * radians;
    let eccentric = mean;
    for (let i = 0; i < 5; i++) eccentric -= (eccentric - e * Math.sin(eccentric) - mean) / (1 - e * Math.cos(eccentric));
    const factor = 1 - e * Math.cos(eccentric);
    const distance = a * factor;
    const speed = a * meanMotionDegrees * radians / (36525 * 86400) * Math.sqrt((2 - factor) / factor);
    const fmt = digits => new Intl.NumberFormat("de-DE", { minimumFractionDigits: digits, maximumFractionDigits: digits });
    document.querySelector("[data-orbit-distance]").textContent = "ca. " + fmt(2).format(distance / 1e6) + " Mio. km";
    document.querySelector("[data-orbit-speed]").textContent = "ca. " + fmt(2).format(speed) + " km/s";
} else {
    document.querySelector("[data-orbit-note]").textContent = "Das JPL-Bahnmodell auf dieser Seite gilt für 1800 bis 2050.";
}
