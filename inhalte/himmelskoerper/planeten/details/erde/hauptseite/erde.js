import "../../../../../../Menüs/TopBar/Top_bar.js";
import "../../../../../../Menüs/Side_bar/side_bar.js";
import { applyAporiaRoutes, getAporiaRoute } from "../../../../../../Menüs/adapter/aporia-routes.js";
import { applyAporiaMedia } from "../../../../../../Menüs/adapter/aporia-media.js";
import { dossierVorschauLink, ladeKartenansicht } from "../../../../../../Menüs/adapter/Sternenkarte/KartenRueckkehr.js";
import { ladeObjekte } from "../../../../../../Menüs/adapter/Sternenkarte/Kartendaten/Kartendaten.js";
import { kartenobjektLink } from "../../../../../../Menüs/adapter/Sternenkarte/Verknuepfungen/Verknuepfungen.js";

applyAporiaRoutes();
applyAporiaMedia().catch(console.warn);

function installiereKartenRueckkehr() {
    const letzteAnsicht = ladeKartenansicht();
    const dossierPfad = decodeURI(location.pathname);
    const kamAusKarte = letzteAnsicht?.objekt && letzteAnsicht.dossierPfad &&
        decodeURI(letzteAnsicht.dossierPfad) === dossierPfad;
    const vorhandenerLink = document.querySelector(".earth-map");
    const systemDossier = dossierPfad.includes("/Kosmologie/Sternensysteme/details/");

    const karte = getAporiaRoute("sternenkarte");
    const name = document.querySelector("h1")?.textContent.trim() || "Archivobjekt";
    const typ = document.querySelector(".earth-class")?.textContent.trim() || "Himmelskörper";
    const medium = document.querySelector("[data-media-image]")?.dataset.mediaImage;
    const link = document.createElement("a");
    link.className = "earth-back-to-map";
    link.textContent = kamAusKarte ? "← Zurück zur Sternenkarte" : "In der Sternenkarte zeigen →";
    link.href = dossierVorschauLink(karte, location.href, name, typ, medium).href;
    document.querySelector(".earth-crumb").append(link);

    function verknuepfeObjekt(id) {
        const ziel = new URL(karte);
        ziel.searchParams.set("objekt", id);
        link.href = ziel.href;
        if (vorhandenerLink) vorhandenerLink.href = ziel.href;
    }
    if (kamAusKarte) verknuepfeObjekt(letzteAnsicht.objekt);
    const zuordnung = kamAusKarte ? Promise.resolve() : ladeObjekte().then(objekte => {
        const objekt = objekte.find(eintrag => eintrag.archivLink &&
            decodeURI(new URL(kartenobjektLink(eintrag)).pathname) === dossierPfad) ??
            (systemDossier ? objekte.find(eintrag => eintrag.systemName === name) : null);
        if (objekt) verknuepfeObjekt(objekt.id);
    }).catch(() => { /* The dossier preview remains available. */ });

    document.addEventListener("click", async event => {
        const ziel = event.target.closest("a");
        if (!ziel || (ziel !== link && ziel !== vorhandenerLink && ziel.dataset.route !== "sternenkarte") ||
            event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        if (ziel.dataset.route === "sternenkarte" && !vorhandenerLink && !kamAusKarte && !systemDossier) return;
        event.preventDefault();
        await zuordnung;
        location.assign(link.href);
    });
}

installiereKartenRueckkehr();

function applyImageAccent() {
    const page = document.querySelector("[data-celestial-theme]");
    const artwork = page?.querySelector(".earth-panorama img");
    if (!artwork) return;
    const sample = new Image();
    sample.crossOrigin = "anonymous";
    sample.addEventListener("load", () => {
        const canvas = document.createElement("canvas");
        canvas.width = 24;
        canvas.height = 24;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(sample, 0, 0, canvas.width, canvas.height);
        let pixels;
        try {
            pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        } catch {
            return; // Keep the preset palette if the source disallows pixel access.
        }
        const sum = [0, 0, 0];
        let total = 0;
        for (let i = 0; i < pixels.length; i += 4) {
            const channels = [pixels[i], pixels[i + 1], pixels[i + 2]];
            const high = Math.max(...channels);
            const weight = (high - Math.min(...channels)) * pixels[i + 3] / 255;
            if (high < 45 || weight < 12) continue;
            total += weight;
            channels.forEach((value, channel) => { sum[channel] += value * weight; });
        }
        if (!total) return;
        const tint = sum.map(value => Math.round(14 + value / total * .33));
        page.style.setProperty("--theme-halo", "rgb(" + tint.join(" ") + ")");
    }, { once: true });
    sample.src = artwork.currentSrc || artwork.src;
}

applyImageAccent();

const tabs = document.querySelector(".earth-tabs");
function closeMenu() {
    tabs.querySelector("details[open]")?.removeAttribute("open");
}
document.addEventListener("click", event => {
    if (!tabs.contains(event.target)) closeMenu();
});
tabs.addEventListener("keydown", event => {
    const open = tabs.querySelector("details[open]");
    if (event.key === "Escape" && open) {
        closeMenu();
        open.querySelector("summary").focus();
    }
});

// Simplified coastline coordinates in degrees, longitude followed by latitude.
const coastlines = [
    [[-168,66],[-158,71],[-138,70],[-128,74],[-104,73],[-89,70],[-79,73],[-64,66],[-58,52],[-68,45],[-80,27],[-88,28],[-98,19],[-89,16],[-82,8],[-90,10],[-104,20],[-117,32],[-125,49],[-139,58],[-151,60],[-165,55],[-168,61]],
    [[-81,9],[-72,12],[-60,9],[-49,2],[-35,-7],[-39,-17],[-49,-29],[-58,-37],[-66,-55],[-74,-51],[-75,-33],[-80,-15],[-77,-4]],
    [[-72,77],[-60,83],[-32,82],[-19,75],[-24,67],[-43,60],[-55,65],[-62,73]],
    [[-10,36],[-10,43],[-5,48],[7,54],[13,57],[12,65],[26,71],[40,69],[48,71],[66,69],[85,75],[108,74],[126,72],[152,71],[172,66],[176,62],[161,59],[144,52],[134,44],[128,38],[122,30],[111,19],[108,8],[100,10],[96,17],[91,22],[85,21],[78,8],[74,13],[68,23],[60,24],[56,27],[50,30],[45,38],[37,40],[30,36],[23,38],[15,38],[7,43],[2,42],[-2,36]],
    [[-17,14],[-16,25],[-9,34],[3,37],[15,32],[25,32],[33,31],[37,21],[43,12],[51,11],[46,1],[39,-8],[35,-19],[30,-30],[20,-35],[15,-28],[12,-17],[10,-5],[8,4],[-6,5]],
    [[42,-13],[51,-15],[48,-25],[44,-26],[43,-20]],
    [[36,30],[47,30],[56,22],[49,14],[43,13],[40,20]],
    [[112,-22],[116,-15],[129,-12],[140,-17],[144,-12],[153,-27],[151,-35],[143,-39],[135,-33],[120,-34],[114,-29]],
    [[130,-3],[136,-2],[150,-5],[151,-11],[143,-9],[135,-6]],
    [[95,5],[103,1],[107,-6],[116,-7],[121,-9],[107,-8],[99,-3]],
    [[130,31],[137,35],[143,44],[145,43],[141,36],[134,33]],
    [[166,-46],[176,-41],[178,-37],[177,-43],[169,-47]],
    [[-10,50],[-6,58],[-2,57],[1,51]],
    [[-180,-72],[-140,-74],[-103,-72],[-74,-69],[-58,-62],[-62,-75],[-21,-72],[19,-71],[55,-67],[89,-66],[123,-67],[151,-70],[180,-72],[180,-90],[-180,-90]]
];

function createMap() {
    const map = document.createElement("canvas");
    map.width = 720;
    map.height = 360;
    const ctx = map.getContext("2d");
    const sea = ctx.createLinearGradient(0, 0, 0, map.height);
    for (const [stop, color] of [[0, "#327ca2"], [.22, "#104884"], [.54, "#145fa0"], [.8, "#103975"], [1, "#28739f"]]) {
        sea.addColorStop(stop, color);
    }
    ctx.fillStyle = sea;
    ctx.fillRect(0, 0, map.width, map.height);
    const land = ctx.createLinearGradient(0, 0, 0, map.height);
    for (const [stop, color] of [[0, "#eff6ec"], [.11, "#cbd4bb"], [.23, "#58875d"], [.35, "#bc9c58"], [.43, "#d1a36a"], [.5, "#327d4d"], [.63, "#699258"], [.76, "#758759"], [.85, "#e3eeeb"], [1, "#f6fcff"]]) {
        land.addColorStop(stop, color);
    }
    ctx.fillStyle = land;
    ctx.strokeStyle = "#459ba8";
    ctx.lineWidth = 1.1;
    for (const polygon of coastlines) {
        ctx.beginPath();
        polygon.forEach(([lon, lat], i) => {
            const x = (lon + 180) * 2;
            const y = (90 - lat) * 2;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
    return ctx.getImageData(0, 0, map.width, map.height);
}

function createPlanetMap(name, classification) {
    const type = classification.toLowerCase();
    const gas = /gas|eisriese/.test(type);
    const colors = /eis/.test(type) ? [[30, 79, 117], [198, 235, 247]]
        : gas ? [[94, 51, 34], [242, 194, 129]]
        : /ozean/.test(type) ? [[13, 52, 126], [97, 168, 116]]
        : /organisch/.test(type) ? [[32, 63, 53], [151, 180, 90]]
        : /vulkan/.test(type) ? [[39, 27, 27], [246, 107, 48]]
        : [[67, 53, 45], [199, 160, 116]];
    const seed = [...name].reduce((value, char) => (31 * value + char.codePointAt(0)) >>> 0, 0) / 2 ** 32;
    const width = 512, height = 256;
    const data = new Uint8ClampedArray(width * height * 4);
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
        const longitude = x / width * 2 * Math.PI;
        const latitude = y / height * Math.PI;
        const wave = Math.sin(3 * longitude + seed * 14) * Math.sin(4 * latitude);
        const texture = Math.sin(14 * longitude + 8 * latitude + seed * 30) * Math.sin(9 * latitude);
        const level = gas ? .5 + .31 * Math.sin(22 * latitude + 1.6 * wave) + .08 * texture
            : .49 + .23 * wave + .15 * texture;
        const offset = (y * width + x) * 4;
        for (let channel = 0; channel < 3; channel++) {
            data[offset + channel] = colors[0][channel] + (colors[1][channel] - colors[0][channel]) * level;
        }
    }
    return { width, height, data };
}

function startGlobe(player) {
    const canvas = player.querySelector("canvas");
    const picture = player.querySelector("img");
    const controls = player.querySelector(".earth-controls");
    const crosshair = player.querySelector(".earth-crosshair");
    const coordinates = player.querySelector(".earth-coordinates");
    const context = canvas.getContext("2d");
    if (!context) return;
    const planet = player.dataset.planet;
    const texture = planet ? createPlanetMap(planet, player.dataset.planetClass) : createMap();
    const size = canvas.width;
    const frame = context.createImageData(size, size);
    const half = size / 2;
    let longitude = -1.35;
    let latitude = .25;
    let zoom = 1;
    let drag;
    let animation = 0;
    const zoomButtons = controls.querySelectorAll("[data-zoom]");
    const minZoom = .75;
    const maxZoom = 2_000_000;
    const radiusMeters = planet ? Number(player.dataset.radius) : 6_371_000;
    const degrees = 180 / Math.PI;
    const formatCoordinate = new Intl.NumberFormat("de-DE", { minimumFractionDigits: 6, maximumFractionDigits: 6 });
    const formatDistance = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 });

    function draw() {
        animation = 0;
        const sin = Math.sin(latitude);
        const cos = Math.cos(latitude);
        const radius = half * .87 * zoom;
        for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
            const sx = (x - half) / radius;
            const sy = (half - y) / radius;
            const distance = sx * sx + sy * sy;
            const pixel = (y * size + x) * 4;
            if (distance > 1) {
                frame.data[pixel + 3] = 0;
                continue;
            }
            const depth = Math.sqrt(1 - distance);
            const lat = Math.asin(Math.max(-1, Math.min(1, sy * cos + depth * sin)));
            const lon = Math.atan2(sx, depth * cos - sy * sin) + longitude;
            const u = ((lon / (2 * Math.PI) + .5) % 1 + 1) % 1;
            const tx = Math.min(texture.width - 1, Math.floor(u * texture.width));
            const ty = Math.max(0, Math.min(texture.height - 1, Math.floor((.5 - lat / Math.PI) * texture.height)));
            const offset = (ty * texture.width + tx) * 4;
            const light = .42 + .62 * Math.max(0, -.42 * sx + .38 * sy + .78 * depth);
            const air = (1 - depth) ** 4 * (light + .3);
            frame.data[pixel] = texture.data[offset] * light + air * 36;
            frame.data[pixel + 1] = texture.data[offset + 1] * light + air * 113;
            frame.data[pixel + 2] = texture.data[offset + 2] * light + air * 170;
            frame.data[pixel + 3] = Math.min(255, (1 - Math.sqrt(distance)) * radius * 255);
        }
        context.putImageData(frame, 0, 0);
        const wrappedLongitude = ((longitude * degrees + 180) % 360 + 360) % 360 - 180;
        const width = 2 * radiusMeters * Math.asin(Math.min(1, half / radius));
        const distance = width >= 1000 ? formatDistance.format(width / 1000) + " km" : formatDistance.format(width) + " m";
        coordinates.textContent = formatCoordinate.format(latitude * degrees) + "°, " +
            formatCoordinate.format(wrappedLongitude) + "°" + (radiusMeters > 0 ? " · " + distance : "");
    }

    function turn(dx, dy = 0) {
        longitude = (longitude + dx) % (2 * Math.PI);
        latitude = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, latitude + dy));
        if (!animation) animation = requestAnimationFrame(draw);
    }
    function updateZoomButtons() {
        for (const button of zoomButtons) {
            button.disabled = Number(button.dataset.zoom) < 0 ? zoom <= minZoom : zoom >= maxZoom;
        }
    }
    function changeZoom(factor) {
        const next = Math.max(minZoom, Math.min(maxZoom, zoom * factor));
        if (next === zoom) return;
        zoom = next;
        updateZoomButtons();
        if (!animation) animation = requestAnimationFrame(draw);
    }
    canvas.addEventListener("wheel", event => {
        if (!event.deltaY || event.ctrlKey || event.metaKey) return;
        event.preventDefault();
        const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? canvas.clientHeight : 1;
        changeZoom(Math.exp(Math.max(-2, Math.min(2, -event.deltaY * unit * .004))));
    }, { passive: false });
    canvas.addEventListener("pointerdown", event => {
        if (event.button !== 0 || drag) return;
        drag = { id: event.pointerId, x: event.clientX, y: event.clientY };
        canvas.setPointerCapture(event.pointerId);
    });
    canvas.addEventListener("pointermove", event => {
        if (drag?.id !== event.pointerId) return;
        const scale = 2 / (.87 * Math.max(1, canvas.clientWidth) * zoom);
        turn((drag.x - event.clientX) * scale, (event.clientY - drag.y) * scale);
        drag.x = event.clientX;
        drag.y = event.clientY;
    });
    canvas.addEventListener("lostpointercapture", () => { drag = null; });
    canvas.addEventListener("keydown", event => {
        if (event.ctrlKey || event.metaKey || event.altKey) return;
        if (["+", "=", "-", "−"].includes(event.key)) {
            event.preventDefault();
            const step = event.shiftKey ? 4 : 2;
            changeZoom(event.key === "+" || event.key === "=" ? step : 1 / step);
            return;
        }
        const directions = { ArrowLeft: [-.25], ArrowRight: [.25], ArrowUp: [0, .2], ArrowDown: [0, -.2] };
        if (!directions[event.key]) return;
        event.preventDefault();
        const [x, y = 0] = directions[event.key];
        turn(x / zoom, y / zoom);
    });
    for (const button of controls.querySelectorAll("[data-turn]")) {
        button.addEventListener("click", () => turn(Number(button.dataset.turn) * .3 / zoom));
    }
    for (const button of zoomButtons) {
        button.addEventListener("click", () => changeZoom(2 ** Number(button.dataset.zoom)));
    }
    const fullscreen = controls.querySelector("[data-fullscreen]");
    fullscreen.hidden = !document.fullscreenEnabled;
    fullscreen.addEventListener("click", async () => {
        try {
            if (document.fullscreenElement === player) await document.exitFullscreen();
            else await player.requestFullscreen();
        } catch (error) {
            console.warn("Globus-Vollbild nicht verfügbar", error);
        }
    });
    document.addEventListener("fullscreenchange", () => {
        const active = document.fullscreenElement === player;
        fullscreen.setAttribute("aria-pressed", String(active));
        fullscreen.setAttribute("aria-label", active ? "Vollbild beenden" : "Vollbild öffnen");
    });

    draw();
    updateZoomButtons();
    if (picture) picture.hidden = true;
    canvas.hidden = false;
    controls.hidden = false;
    crosshair.hidden = false;
    coordinates.hidden = false;
    const positionCrosshair = () => { crosshair.style.top = canvas.offsetTop + canvas.offsetHeight / 2 + "px"; };
    positionCrosshair();
    new ResizeObserver(positionCrosshair).observe(canvas);
}

const globe = document.querySelector("[data-earth-player]");
if (globe) startGlobe(globe);
