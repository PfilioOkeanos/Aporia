import { applyAporiaRoutes } from "./../../../../../Men%C3%BCs/adapter/aporia-routes.js";
import { arrangeKnowledgeCards } from "./../../../_gemeinsam/wissenslayout.js";
applyAporiaRoutes(document);
arrangeKnowledgeCards();

const topic = document.querySelector(".aero .topic");
if (topic) {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 12;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    const palettes = new Map();
    const layer = document.createElement("div");
    layer.className = "aero-light";
    layer.setAttribute("aria-hidden", "true");
    topic.prepend(layer);

    function colors(image) {
        const url = image.currentSrc || image.src;
        if (palettes.has(url)) return palettes.get(url);
        if (!context || !image.complete || !image.naturalWidth) return null;
        try {
            context.clearRect(0, 0, 12, 12);
            context.drawImage(image, 0, 0, 12, 12);
            const pixels = context.getImageData(0, 0, 12, 12).data;
            const palette = [0, 8].map(start => {
                const sum = [0, 0, 0];
                let total = 0;
                for (let y = 0; y < 12; y++) for (let x = start; x < start + 4; x++) {
                    const offset = (y * 12 + x) * 4;
                    const rgb = pixels.subarray(offset, offset + 3);
                    const weight = pixels[offset + 3] / 255 * (16 + Math.max(...rgb) - Math.min(...rgb));
                    rgb.forEach((channel, i) => { sum[i] += channel * weight; });
                    total += weight;
                }
                return total ? sum.map(channel => Math.round(channel / total)) : [35, 75, 103];
            });
            palettes.set(url, palette);
            return palette;
        } catch {
            return null;
        }
    }

    let frame;
    function refresh() {
        clearTimeout(frame);
        frame = setTimeout(() => {
            const bounds = topic.getBoundingClientRect();
            if (!bounds.width || !bounds.height) return;
            const gradients = [], all = [];
            for (const image of topic.querySelectorAll("img")) {
                if (image.closest("dialog, .aero-gallery")) continue;
                const box = image.getBoundingClientRect();
                if (!box.width || !box.height) continue;
                const palette = colors(image);
                if (!palette) continue;
                all.push(...palette);
                const x = 100 * (box.left - bounds.left + box.width / 2) / bounds.width;
                const y = 100 * (box.top - bounds.top + box.height / 2) / bounds.height;
                palette.forEach((rgb, i) => {
                    const tint = rgb.join(" ");
                    gradients.push(`radial-gradient(ellipse 110% 48% at ${x + (i ? 11 : -11)}% ${y}%, rgb(${tint} / .22), rgb(${tint} / .10) 45%, rgb(${tint} / .025) 73%, rgb(${tint} / 0) 100%)`);
                });
            }
            layer.style.backgroundImage = gradients.join(", ");
            if (all.length) topic.style.setProperty("--aero-palette", all[0].map((_, i) =>
                Math.round(all.reduce((sum, rgb) => sum + rgb[i], 0) / all.length)).join(" "));
        });
    }
    topic.addEventListener("load", refresh, true);
    topic.addEventListener("toggle", refresh, true);
    new ResizeObserver(refresh).observe(topic);
    refresh();
}
