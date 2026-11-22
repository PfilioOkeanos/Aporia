import "../../../Menüs/TopBar/Top_bar.js";

const stack = document.querySelector(".species-navigation-stack");
const pageFrame = document.querySelector(".species-archive > .aporia-auto-page-frame");
const main = pageFrame?.querySelector(":scope > main");
const sectionNavigation = stack?.querySelector(":scope > :is(.archive-bar, [data-species-navigation])");

if (main && sectionNavigation) {
    const rail = document.createElement("div");
    rail.className = "species-section-nav";
    rail.append(sectionNavigation);
    pageFrame.insertBefore(rail, main);
}

// Heimatwelt-Kasten (Planetendossier + Sternenkarte) für Spezies mit Heimatwelt
import "./heimatwelt-verweis.js";
