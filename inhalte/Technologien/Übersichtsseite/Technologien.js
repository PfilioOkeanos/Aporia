import "../../../Menüs/TopBar/Top_bar.js";
import { applyAporiaRoutes } from "../../../Menüs/adapter/aporia-routes.js";

applyAporiaRoutes(document);

const cards = [...document.querySelectorAll(".technology-card")];
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.08 });
  cards.forEach((card, index) => {
    card.style.setProperty("--order", String(index));
    observer.observe(card);
  });
} else {
  cards.forEach(card => card.classList.add("is-visible"));
}
