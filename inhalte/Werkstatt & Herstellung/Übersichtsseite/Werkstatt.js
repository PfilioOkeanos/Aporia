import "../../../Menüs/TopBar/Top_bar.js";
import { applyAporiaRoutes } from "../../../Menüs/adapter/aporia-routes.js";

applyAporiaRoutes(document);

const cards = [...document.querySelectorAll(".craft-card")];

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        }
    }, { threshold: 0.12 });

    cards.forEach((card, index) => {
        card.style.setProperty("--card-order", String(index));
        observer.observe(card);
    });
} else {
    cards.forEach(card => card.classList.add("is-visible"));
}

document.querySelectorAll(".atelier-jump[href^='#']").forEach(link => {
    link.addEventListener("click", event => {
        const target = document.querySelector(link.getAttribute("href"));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    });
});
