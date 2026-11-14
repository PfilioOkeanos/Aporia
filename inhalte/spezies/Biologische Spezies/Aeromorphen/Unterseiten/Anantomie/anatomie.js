import "./../../Hauptseite_%C3%BCbersicht/Spezies.js";

const cardGroups = document.querySelectorAll(".anatomy-details .source-content");
const wideLayout = matchMedia("(min-width: 851px)");
let frame;

function packCards() {
    for (const group of cardGroups) {
        const cards = [...group.children].filter(card => card.matches(".aero-chapter"));
        if (cards.length !== group.children.length || !cards.length) continue;
        group.classList.toggle("is-packed", wideLayout.matches);
        if (!wideLayout.matches) continue;
        const heights = cards.map(card => Math.ceil(card.getBoundingClientRect().height) + 8);
        cards.forEach((card, index) => {
            const rows = String(heights[index]);
            if (card.style.getPropertyValue("--anatomy-card-rows") !== rows) {
                card.style.setProperty("--anatomy-card-rows", rows);
            }
        });
    }
}

function schedulePacking() {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(packCards);
}

const cardObserver = new ResizeObserver(schedulePacking);
for (const group of cardGroups) {
    for (const card of group.children) cardObserver.observe(card);
}
wideLayout.addEventListener("change", schedulePacking);
packCards();
