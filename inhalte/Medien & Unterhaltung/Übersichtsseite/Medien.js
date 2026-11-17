import "../../../Menüs/TopBar/Top_bar.js";
import { applyAporiaRoutes } from "../../../Menüs/adapter/aporia-routes.js";
import { applyAporiaMedia, getAporiaMedia } from "../../../Menüs/adapter/aporia-media.js";

applyAporiaRoutes(document);

const audioPlayer = document.querySelector("#archive-audio");
const videoPlayer = document.querySelector("#archive-video");

async function setAudio(key, title) {
  if (!audioPlayer) return;
  const media = await getAporiaMedia(key);
  if (!media?.url) return;
  audioPlayer.src = media.url;
  audioPlayer.load();
  document.querySelector("[data-audio-now-title]")?.replaceChildren(document.createTextNode(title));
}

async function setVideo(key, title) {
  if (!videoPlayer) return;
  videoPlayer.dataset.mediaVideo = key;
  document.querySelector("[data-video-title]")?.replaceChildren(document.createTextNode(title));
  await applyAporiaMedia(videoPlayer);
}

document.querySelectorAll("[data-audio-key]").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-audio-key]").forEach(item => item.classList.toggle("is-selected", item === button));
    setAudio(button.dataset.audioKey, button.dataset.audioTitle);
  });
});

document.querySelectorAll("[data-video-key]").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-video-key]").forEach(item => item.classList.toggle("is-selected", item === button));
    setVideo(button.dataset.videoKey, button.dataset.videoTitle);
  });
});

setAudio("medienarchiv.audio.aeromorphen_kontaktruf", "Aeromorphen · Kontaktruf");
applyAporiaMedia(document);
