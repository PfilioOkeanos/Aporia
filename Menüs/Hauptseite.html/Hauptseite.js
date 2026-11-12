import { applyAporiaRoutes } from "../adapter/aporia-routes.js";
import { getAporiaMedia } from "../adapter/aporia-media.js";
import "../TopBar/Top_bar.js";
import "../Side_bar/side_bar.js";

applyAporiaRoutes(document);

const video = document.querySelector(".home-hero-video");
const toggle = document.querySelector(".home-video-toggle");
if (video && toggle) {
    const media = await getAporiaMedia(video.dataset.homeVideo);
    if (media?.url) {
        const motion = matchMedia("(prefers-reduced-motion: reduce)");
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
        toggle.addEventListener("click", () => {
            if (video.paused) video.play().catch(updateToggle);
            else video.pause();
        });
        motion.addEventListener("change", () => {
            if (motion.matches) video.pause();
        });

        video.src = media.url;
        toggle.hidden = false;
        updateToggle();
        if (!motion.matches) video.play().catch(updateToggle);
    }
}
