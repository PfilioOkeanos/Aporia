const tintProperty = "--aporia-scene-tint";
const sceneImage = "img[data-navigation-scene], img[class*='hero'], img[class*='background'], img[class*='galaxy']";
const backgroundUrl = /url\(\s*(?:"([^"]+)"|'([^']+)'|([^)]*))\s*\)/i;

function imageUrl(style) {
    const match = style.backgroundImage.match(backgroundUrl);
    return match && (match[1] ?? match[2] ?? match[3]).trim();
}

function containsPoint(box, x, y) {
    return x >= box.left && x < box.right && y >= box.top && y < box.bottom;
}

function sourceAt(main, x, y) {
    const visited = new Set();
    for (const hit of document.elementsFromPoint(x, y)) {
        if (hit !== main && !main.contains(hit)) continue;
        for (let node = hit; node && !visited.has(node); node = node.parentElement) {
            visited.add(node);
            for (const image of node.querySelectorAll(":scope > img")) {
                const box = image.getBoundingClientRect();
                if (box.width < 140 || box.height < 90 || !containsPoint(box, x, y)) continue;
                const style = getComputedStyle(image);
                if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) continue;
                if (image.matches(sceneImage) || style.position === "absolute") {
                    const url = image.currentSrc || image.getAttribute("src");
                    if (url) return url;
                }
            }

            const url = imageUrl(getComputedStyle(node));
            if (url && node.clientWidth >= 140 && node.clientHeight >= 90) return url;
            if (node.matches("main, section, header, body, [data-media-background]")) {
                for (const pseudo of ["::before", "::after"]) {
                    const style = getComputedStyle(node, pseudo);
                    const image = imageUrl(style);
                    if (image && style.content !== "none" && style.display !== "none" && Number(style.opacity) > 0) return image;
                }
            }
        }
    }
    return null;
}

function representativeColor(pixels) {
    const hues = Array.from({ length: 12 }, () => ({ score: 0, rgb: [0, 0, 0] }));
    for (let i = 0; i < pixels.length; i += 4) {
        const channels = [pixels[i], pixels[i + 1], pixels[i + 2]];
        const [red, green, blue] = channels;
        const max = Math.max(...channels);
        const spread = max - Math.min(...channels);
        if (pixels[i + 3] < 128 || spread < 14 || max < 30) continue;
        const hue = max === red ? (green - blue) / spread
            : max === green ? 2 + (blue - red) / spread : 4 + (red - green) / spread;
        const bucket = hues[Math.round((hue + 6) * 2) % 12];
        const weight = spread * (0.45 + max / 255);
        bucket.score += weight;
        channels.forEach((channel, index) => { bucket.rgb[index] += channel * weight; });
    }
    const best = hues.reduce((first, second) => first.score >= second.score ? first : second);
    if (!best.score) return null;
    const average = best.rgb.map(value => value / best.score);
    const peak = Math.max(...average);
    const rgb = average.map(value => Math.round(value * Math.max(1, 172 / peak)));
    return "rgb(" + rgb.join(" ") + ")";
}

export function initializeNavigationColor(topbar) {
    const sidebarHasPreset = Boolean(document.body.dataset.navigationColor);
    const colors = new Map();
    const currentSource = new WeakMap();
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 32;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;

    function getColor(source) {
        const url = new URL(source, document.baseURI);
        if (url.origin !== location.origin) return Promise.resolve(null);
        if (!colors.has(url.href)) {
            if (colors.size >= 64) colors.delete(colors.keys().next().value);
            const color = new Promise(resolve => {
                const image = new Image();
                image.onload = () => {
                    try {
                        context.clearRect(0, 0, 32, 32);
                        context.drawImage(image, 0, 0, 32, 32);
                        resolve(representativeColor(context.getImageData(0, 0, 32, 32).data));
                    } catch {
                        resolve(null);
                    }
                };
                image.onerror = () => resolve(null);
                image.src = url.href;
            });
            colors.set(url.href, color);
        }
        return colors.get(url.href);
    }

    async function tint(bar, source) {
        if (currentSource.get(bar) === source) return;
        currentSource.set(bar, source);
        const color = source ? await getColor(source) : null;
        if (currentSource.get(bar) !== source) return;
        if (color) bar.style.setProperty(tintProperty, color);
        else bar.style.removeProperty(tintProperty);
    }

    let pending = false;
    function scheduleUpdate() {
        if (pending) return;
        pending = true;
        requestAnimationFrame(() => {
            pending = false;
            const main = document.querySelector("main");
            if (!main) return;
            const content = main.getBoundingClientRect();
            const header = topbar.getBoundingClientRect();
            const top = Math.max(0, header.bottom, content.top);
            const bottom = Math.min(window.innerHeight, content.bottom);
            const left = Math.max(0, content.left);
            const right = Math.min(window.innerWidth, content.right);
            if (bottom <= top || right <= left) return;
            const point = (horizontal, vertical) => sourceAt(main,
                left + (right - left) * horizontal, top + (bottom - top) * vertical);
            const topSource = point(.5, .08) || point(.24, .08) || point(.75, .08) || point(.5, .32);
            tint(topbar, topSource);

            const sidebar = document.querySelector("[data-aporia-sidebar]:not([hidden]) .aporia-sidebar");
            if (sidebar && !sidebarHasPreset) {
                const sidebarSource = point(.08, .30) || point(.22, .30) || point(.12, .12) || topSource;
                tint(sidebar, sidebarSource);
            }
        });
    }

    document.addEventListener("scroll", scheduleUpdate, { capture: true, passive: true });
    document.addEventListener("load", scheduleUpdate, true);
    window.addEventListener("resize", scheduleUpdate, { passive: true });
    const observer = new MutationObserver(records => {
        if (records.some(({ target }) => target === document.body || target === document.documentElement ||
            target.closest?.("main, [data-aporia-sidebar]") && !target.closest?.(".aporia-sidebar"))) scheduleUpdate();
    });
    observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["src", "style", "hidden"] });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["style"] });
    scheduleUpdate();
}
