import { applyAporiaRoutes } from "../adapter/aporia-routes.js";
import { getCelestialDetailUrl } from "../adapter/aporia-celestial.js";
import { getAporiaMedia } from "../adapter/aporia-media.js";
import { loadVisibleLoop } from "../adapter/aporia-media-visibility.js";
import "../TopBar/Top_bar.js";
import "../Side_bar/side_bar.js";

applyAporiaRoutes(document);
for (const link of document.querySelectorAll("a[data-planet-dossier]")) {
    link.href = getCelestialDetailUrl("planeten", link.dataset.planetDossier);
}

const video = document.querySelector(".home-hero-video");
const toggle = document.querySelector(".home-video-toggle");
if (video && toggle) {
    const media = await getAporiaMedia(video.dataset.homeVideo);
    if (media?.url) {
        function updateToggle() {
            toggle.textContent = video.paused ? "▶" : "Ⅱ";
            toggle.setAttribute("aria-label", video.paused
                ? "Hintergrundvideo abspielen"
                : "Hintergrundvideo pausieren");
        }

        video.addEventListener("loadeddata", () => video.classList.add("is-ready"));
        video.addEventListener("play", updateToggle);
        video.addEventListener("pause", updateToggle);
        video.addEventListener("error", () => {
            video.classList.remove("is-ready");
            toggle.hidden = true;
        });
        toggle.hidden = false;
        updateToggle();
        loadVisibleLoop(video, video.closest(".home-hero"), media.url, toggle);
    }
}
