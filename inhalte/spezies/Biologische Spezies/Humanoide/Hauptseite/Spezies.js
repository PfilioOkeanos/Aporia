import { applyAporiaRoutes } from "../../../../../Menüs/adapter/aporia-routes.js";
import { getAporiaMediaCollection } from "../../../../../Menüs/adapter/aporia-media.js";

import { loadVisibleLoop } from "../../../../../Menüs/adapter/aporia-media-visibility.js";

applyAporiaRoutes(document);
const video = document.querySelector(".human-film video");
const status = document.querySelector(".human-film [role=status]");
const button = document.querySelector(".human-film button");

function updateButton() {
    button.textContent = video.paused ? "Video abspielen" : "Video pausieren";
}
video.addEventListener("play", updateButton);
video.addEventListener("pause", updateButton);
video.addEventListener("loadeddata", () => {
    video.hidden = button.hidden = false;
    status.hidden = true;
    updateButton();
});
video.addEventListener("error", () => {
    video.hidden = button.hidden = true;
    status.hidden = false;
    status.textContent = "Das Introvideo konnte nicht geladen werden.";
});
try {
    const [intro] = await getAporiaMediaCollection("humanoide.intro");
    if (intro) {
        video.muted = true;
        button.hidden = false;
        updateButton();
        loadVisibleLoop(video, video.closest(".human-film"), intro.url, button);
    }
} catch {
    status.textContent = "Das Introvideo ist derzeit nicht verfügbar.";
}

const topicStatus = document.querySelector("#fachbereich-status");
for (const link of document.querySelectorAll("[data-pending-topic]")) {
    link.addEventListener("click", event => {
        event.preventDefault();
        topicStatus.hidden = false;
        topicStatus.textContent = link.dataset.pendingTopic + " · Unterseite in Vorbereitung";
    });
}
