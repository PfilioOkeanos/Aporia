import { applyAporiaRoutes } from "../../../Menüs/adapter/aporia-routes.js";
import "../../../Menüs/TopBar/Top_bar.js";
import "../../../Menüs/Side_bar/side_bar.js";

applyAporiaRoutes(document);

const progressBar = document.querySelector(".reading-progress span");
const radioButton = document.querySelector("#radio-preview");
const radioPanel = document.querySelector(".radio-panel");
const radioStatus = document.querySelector("#radio-status");
const playLabel = radioButton?.querySelector(".play-label");

function updateReadingProgress() {
  if (!progressBar) return;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progressBar.style.width = Math.min(100, Math.max(0, progress)) + "%";
}

window.addEventListener("scroll", updateReadingProgress, { passive: true });
window.addEventListener("resize", updateReadingProgress);
updateReadingProgress();

radioButton?.addEventListener("click", () => {
  const isPlaying = radioButton.getAttribute("aria-pressed") !== "true";
  radioButton.setAttribute("aria-pressed", String(isPlaying));
  radioPanel?.classList.toggle("is-playing", isPlaying);
  if (playLabel) playLabel.textContent = isPlaying ? "Vorschau anhalten" : "Vorschau starten";
  if (radioStatus) {
    radioStatus.textContent = isPlaying
      ? "VORSCHAU · AUDIOSTREAM FOLGT"
      : "AUDIOARCHIV IN VORBEREITUNG";
  }
});

document.querySelectorAll('.chapter-nav a[href^="#"]').forEach((link) => {
  link.addEventListener("click", () => {
    const targetId = link.getAttribute("href")?.slice(1);
    const target = targetId ? document.getElementById(targetId) : null;
    if (target) target.setAttribute("tabindex", "-1");
  });
});

