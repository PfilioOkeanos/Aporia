import { applyAporiaRoutes } from "../../../Menüs/adapter/aporia-routes.js";
import "../../../Menüs/TopBar/Top_bar.js";
import "../../../Menüs/Side_bar/side_bar.js";

applyAporiaRoutes(document);

const progress = document.querySelector(".reading-progress span");
if (progress) {
  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progress.style.width = percent + "%";
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();
}
