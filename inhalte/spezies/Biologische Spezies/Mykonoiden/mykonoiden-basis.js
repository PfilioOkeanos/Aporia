import { initializeSpeciesArchive } from "../../_gemeinsam/spezies-archiv.js";

initializeSpeciesArchive({
    "name": "Mykonoiden",
    "route": "spezies-biological-5",
    "archive": "../../../Spezies_%C3%BCbersicht/Spezies.html"
});

const article = document.querySelector(".species-archive .topic");
if (article) addArtworkLighting(article);

function addArtworkLighting(article) {
    const images = [...article.querySelectorAll("img:not(dialog img)")];
    const layer = document.createElement("div");
    layer.className = "artwork-lighting";
    layer.setAttribute("aria-hidden", "true");
    article.prepend(layer);

    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 24;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    const lights = new Map();
    let frame;
    const palette = new Map();

    function updatePositions() {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
            const origin = article.getBoundingClientRect();
            for (const [image, light] of lights) {
                const rect = image.getBoundingClientRect();
                const rail = image.closest(".rail");
                const viewport = rail?.getBoundingClientRect();
                light.hidden = !rect.width || !rect.height ||
                    Boolean(viewport && (rect.bottom <= viewport.top || rect.top >= viewport.bottom || rect.right <= viewport.left || rect.left >= viewport.right)) ||
                    Boolean(image.closest("details:not([open])"));
                if (light.hidden) continue;
                light.style.left = (rect.left - origin.left + rect.width / 2) + "px";
                light.style.top = (rect.top - origin.top + rect.height / 2) + "px";
                light.style.width = Math.max(origin.width * 2.6, rect.width * 4) + "px";
                light.style.height = Math.max(origin.height * 1.55, rect.height * 5, 1050) + "px";
            }
        });
    }

    function sample(image, light) {
        const source = image.currentSrc || image.src;
        if (context && image.naturalWidth) {
            try {
                context.clearRect(0, 0, 24, 24);
                context.drawImage(image, 0, 0, 24, 24);
                const pixels = context.getImageData(0, 0, 24, 24).data;
                for (const [side, start, end] of [["left", 0, 8], ["right", 16, 24]]) {
                    const sum = [0, 0, 0];
                    let total = 0;
                    for (let y = 0; y < 24; y++) for (let x = start; x < end; x++) {
                        const i = (y * 24 + x) * 4;
                        const channels = [pixels[i], pixels[i + 1], pixels[i + 2]];
                        const weight = pixels[i + 3] / 255 * (12 + Math.max(...channels) - Math.min(...channels));
                        channels.forEach((value, index) => { sum[index] += value * weight; });
                        total += weight;
                    }
                    if (!total) continue;
                    const color = sum.map(value => Math.round(value / total));
                    light.style.setProperty("--light-" + side, color.join(" "));
                    const colors = palette.get(source) ?? {};
                    colors[side] = color;
                    palette.set(source, colors);
                }
            } catch {
                // Keep the CSS fallback when the image cannot be sampled.
            }
        }
        const colors = [...palette.values()].flatMap(entry => Object.values(entry));
        if (colors.length) {
            const average = [0, 1, 2].map(i => Math.round(colors.reduce((sum, rgb) => sum + rgb[i], 0) / colors.length));
            article.style.setProperty("--artwork-palette", average.join(" "));
        }
        updatePositions();
    }

    const observer = new ResizeObserver(updatePositions);
    observer.observe(article);
    article.addEventListener("toggle", updatePositions, true);
    article.addEventListener("scroll", updatePositions, true);
    for (const image of images) {
        const light = document.createElement("span");
        light.hidden = true;
        layer.append(light);
        lights.set(image, light);
        observer.observe(image);
        image.addEventListener("load", () => sample(image, light));
        if (image.complete) sample(image, light);
    }
}

const cardGroups = [...document.querySelectorAll(".myko-article:not(.facharchiv) .source-content")].map(group => ({
    group,
    cards: [...group.children]
})).filter(({ cards }) => cards.length > 1 && cards.every(card => card.matches(".chapter-block")));

if (cardGroups.length) {
    const wide = matchMedia("(min-width: 1001px)");
    let frame;
    function packCards() {
        for (const { group, cards } of cardGroups) {
            group.classList.toggle("myko-packed", wide.matches);
            if (!wide.matches) continue;
            const rows = cards.map(card => Math.ceil(card.getBoundingClientRect().height) + 10);
            cards.forEach((card, i) => card.style.setProperty("--myko-card-rows", rows[i]));
        }
    }
    function schedulePacking() {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(packCards);
    }
    const observer = new ResizeObserver(schedulePacking);
    for (const { cards } of cardGroups) cards.forEach(card => observer.observe(card));
    wide.addEventListener("change", schedulePacking);
    packCards();
}

// Heimatwelt-Kasten (Planetendossier + Sternenkarte) für Spezies mit Heimatwelt
import "../../_gemeinsam/heimatwelt-verweis.js";
