import { observeMediaVisibility } from "../../../Men%C3%BCs/adapter/aporia-media-visibility.js";
import { getAporiaMediaCollection } from "../../../Men%C3%BCs/adapter/aporia-media.js";

for (const card of document.querySelectorAll("[data-kind][data-key]")) mountPlayer(card);
for (const view of document.querySelectorAll("[data-turntable]")) mountViewer(view);
for (const catalog of document.querySelectorAll("[data-asset-catalog]")) mountCatalog(catalog);

async function mountPlayer(card) {
    const kind = card.dataset.kind;
    const video = kind === "video";
    const status = card.querySelector(".media-status");
    const label = document.createElement("label");
    label.textContent = video ? "Video auswählen" : "Audio auswählen";
    const select = document.createElement("select");
    select.add(new Option("Keine Datei ausgewählt", ""));
    select.disabled = true;
    label.append(select);
    const player = document.createElement(kind);
    player.controls = true;
    player.preload = "none";
    player.playsInline = true;
    player.setAttribute("aria-label", card.querySelector("h3").textContent);
    const actions = document.createElement("div");
    actions.className = "controls";
    const stop = () => {
        player.pause();
        if (player.readyState) player.currentTime = 0;
    };
    const buttons = video ? [
        button(actions, "Play", async () => {
            try { await player.play(); }
            catch (error) { if (error.name !== "AbortError") report("Das Video konnte nicht abgespielt werden."); }
        }),
        button(actions, "Stopp", stop)
    ] : [];
    card.insertBefore(label, status);
    card.insertBefore(player, status);
    if (video) card.insertBefore(actions, status);
    function report(message) {
        status.textContent = message;
        status.hidden = !message;
    }
    player.addEventListener("error", () => report("Die Datei konnte nicht geladen werden."));
    try {
        const items = await getAporiaMediaCollection(card.dataset.key);
        if (!items.length) {
            report(video ? "Noch kein Video vorhanden." : "Noch keine Audiodatei vorhanden.");
            return;
        }
        select.replaceChildren(...items.map(item => {
            const name = decodeURIComponent(new URL(item.url).pathname.split("/").at(-1));
            return new Option(video ? name : item.title || name, item.url);
        }));
        function choose() {
            stop();
            report("");
            const item = items[select.selectedIndex];
            if (video) {
                if (item.poster) player.poster = new URL(item.poster, new URL("../../medien/medien.json", import.meta.url)).href;
                else player.removeAttribute("poster");
            }
            player.src = item.url;
        }
        select.addEventListener("change", choose);
        choose();
        select.disabled = false;
        buttons.forEach(control => { control.disabled = false; });
    } catch {
        report("Das Medienregister konnte nicht geladen werden.");
    }
}

function button(parent, title, action) {
    const control = document.createElement("button");
    control.type = "button";
    control.className = "control";
    control.textContent = title;
    control.disabled = true;
    control.addEventListener("click", action);
    parent.append(control);
    return control;
}

async function mountViewer(view) {
    if (view.dataset.model && await mountModel(view)) return;
    const image = view.querySelector("img");
    const status = view.querySelector(".media-status");
    const stage = document.createElement("div");
    stage.className = "turntable-stage";
    image.before(stage);
    stage.append(image);
    const controls = document.createElement("div");
    controls.className = "controls turntable-controls";
    view.append(controls);
    let frames = [], current = 0, zoom = 1, origin = null;
    function render() {
        image.style.transform = "scale(" + zoom + ")";
        if (!frames.length) return;
        image.src = frames[current].url;
        status.textContent = "Rundumansicht · " + (current + 1) + " / " + frames.length;
    }
    function rotate(step) { current = (current + step + frames.length) % frames.length; render(); }
    function magnify(step) { zoom = Math.max(1, Math.min(3, zoom + step)); render(); }
    const buttons = [
        button(controls, "Links drehen", () => rotate(-1)),
        button(controls, "Rechts drehen", () => rotate(1)),
        button(controls, "Vergrößern", () => magnify(.25)),
        button(controls, "Verkleinern", () => magnify(-.25)),
        button(controls, "Zurücksetzen", () => { current = 0; zoom = 1; render(); })
    ];
    const preview = image.getAttribute("src");
    image.addEventListener("error", () => {
        if (!frames.length) return;
        frames = [];
        buttons.forEach(control => { control.disabled = true; });
        stage.removeAttribute("tabindex");
        image.src = preview;
        image.style.transform = "";
        status.textContent = "Ein Bild der Rundumansicht konnte nicht geladen werden.";
    });
    try {
        const items = await getAporiaMediaCollection(view.dataset.turntable);
        frames = items.filter(item => /\.(avif|webp|png|jpe?g)$/i.test(new URL(item.url).pathname));
        if (frames.length < 2) {
            frames = [];
            status.textContent = "Noch keine Rundum-Bildfolge vorhanden.";
            return;
        }
        stage.tabIndex = 0;
        stage.setAttribute("aria-label", "Rundumansicht: Pfeiltasten drehen, Plus und Minus zoomen, Pos1 setzt zurück");
        stage.addEventListener("keydown", event => {
            const actions = { ArrowLeft: buttons[0], ArrowRight: buttons[1], "+": buttons[2], "-": buttons[3], Home: buttons[4] };
            const action = actions[event.key];
            if (action) { event.preventDefault(); action.click(); }
        });
        stage.addEventListener("pointerdown", event => {
            if (!frames.length || event.button !== 0) return;
            origin = event.clientX;
            stage.setPointerCapture(event.pointerId);
        });
        stage.addEventListener("pointermove", event => {
            if (!frames.length || origin === null) return;
            const steps = Math.trunc((event.clientX - origin) / 22);
            if (steps) { rotate(steps); origin += steps * 22; }
        });
        for (const type of ["pointerup", "pointercancel", "lostpointercapture"]) stage.addEventListener(type, () => { origin = null; });
        buttons.forEach(control => { control.disabled = false; });
        render();
    } catch {
        status.textContent = "Die Rundumansicht konnte nicht geladen werden.";
    }
}

async function mountModel(view) {
    const status = view.querySelector(".media-status");
    const preview = view.querySelector("img");
    const label = document.createElement("label");
    label.className = "model-select";
    label.textContent = "3D-Modell auswählen";
    const select = document.createElement("select");
    select.add(new Option("Keine Modelldatei vorhanden", ""));
    select.disabled = true;
    label.append(select);
    status.before(label);

    let items;
    try {
        items = (await getAporiaMediaCollection(view.dataset.model)).filter(item =>
            /\.(glb|gltf|fbx|obj)$/i.test(new URL(item.url).pathname));
    } catch {
        status.textContent = "Das Modellregister konnte nicht geladen werden.";
        return true;
    }
    if (!items.length) return false;

    const surface = document.createElement("div");
    surface.className = "model-surface";
    surface.hidden = true;
    preview.after(surface);
    const actions = document.createElement("div");
    actions.className = "controls turntable-controls";
    let active, revision = 0;
    let visible = false;
    observeMediaVisibility(view, current => {
        visible = current;
        active?.setVisible?.(current);
    });
    const reset = button(actions, "Ansicht zurücksetzen", () => active?.reset());
    const unload = button(actions, "Modell entladen", () => {
        select.value = "";
        selectModel();
        select.focus();
    });
    view.append(actions);

    async function selectModel() {
        const request = ++revision;
        active?.dispose();
        active = null;
        surface.replaceChildren();
        reset.disabled = true;
        preview.hidden = false;
        surface.hidden = true;
        const item = items[select.selectedIndex - 1];
        unload.disabled = !item;
        if (!item) {
            status.textContent = "Wähle ein Modell, um die 3D-Ansicht zu laden.";
            return;
        }
        status.textContent = "3D-Modell wird geladen …";
        const format = new URL(item.url).pathname.split(".").at(-1).toLowerCase();
        const host = document.createElement("div");
        surface.append(host);
        try {
            const adapter = await import("./modell-viewer.js");
            if (request !== revision) return;
            const loaded = await adapter.loadModel(host, item, format);
            if (request !== revision) { loaded.dispose(); return; }
            active = loaded;
            preview.hidden = true;
            surface.hidden = false;
            loaded.setVisible?.(visible);
            loaded.resize?.();
            reset.disabled = false;
            status.textContent = "Ziehen zum Drehen. Scrollen oder mit zwei Fingern zoomen.";
        } catch (error) {
            if (request !== revision) return;
            host.remove();
            status.textContent = "Das Modell konnte nicht geladen werden: " + item.title;
            console.warn("Aporia: Modell", error);
        }
    }
    select.replaceChildren(new Option("Modell auswählen", ""), ...items.map(item => new Option(item.title || decodeURIComponent(new URL(item.url).pathname.split("/").at(-1)), item.url)));
    select.disabled = false;
    select.value = "";
    select.addEventListener("change", selectModel);
    status.textContent = "Wähle ein Modell, um die 3D-Ansicht zu laden.";
    return true;
}

async function mountCatalog(catalog) {
    const species = catalog.dataset.assetCatalog;
    const status = catalog.querySelector('[role="status"]');
    function element(tag, text, parent) {
        const node = document.createElement(tag);
        node.textContent = text;
        parent.append(node);
        return node;
    }

    try {
        // Categories are metadata, so use the single-entry adapter instead of the URL-only collection helper.
        const { getAporiaMedia } = await import("../../../Men%C3%BCs/adapter/aporia-media.js");
        const entry = await getAporiaMedia(species + ".assetverkauf");
        const categories = entry?.items;
        if (!categories?.length) {
            status.textContent = "Demnächst verfügbar.";
            return;
        }
        const layout = element("div", "", catalog);
        layout.className = "asset-carousel-layout";
        for (const [type, heading] of [["audio", "Audio-Assets"], ["3d", "3D-Assets"]]) {
            const section = element("section", "", layout);
            element("h3", heading, section);
            const grid = element("div", "", section);
            grid.className = "asset-carousel";
            grid.setAttribute("role", "group");
            grid.setAttribute("aria-label", heading);
            const cards = [];
            for (const category of categories.filter(item => item.type === type)) {
                const collections = await Promise.all((category.previewCollections ?? []).map(async name => ({
                    name, items: await getAporiaMediaCollection(species + "." + name)
                })));
                const products = collections.flatMap(({ name, items }) => items.map(item => ({ item, name })));
                for (const { item, name } of products.length ? products : [{}]) {
                    const card = element("article", "", grid);
                    card.className = "asset-card";
                    cards.push(card);
                    card.dataset.assetId = item?.id ?? (item ? category.id + ":" + new URL(item.url).pathname.split("/").at(-1) : category.id);
                    const icon = element("span", type === "audio" ? "♫" : "◇", card);
                    icon.className = "asset-symbol";
                    icon.setAttribute("aria-hidden", "true");
                    element("h4", item?.title || category.title, card);
                    element("p", item?.description || category.description, card);
                    const details = element("dl", "", card);
                    details.className = "asset-details";
                    const price = item?.price ?? category.price;
                    const currency = item?.currency ?? category.currency;
                    for (const [term, value] of [
                        ["Kategorie", category.title],
                        ["Format", item?.format ?? category.format ?? (item ? new URL(item.url).pathname.split(".").at(-1).toUpperCase() : "Noch offen")],
                        ["Dateigröße", item?.fileSize ?? category.fileSize ?? "Noch offen"],
                        ["Lizenz", item?.license ?? category.license ?? "Noch offen"],
                        ["Preis", price != null && currency ? price + " " + currency : "Noch offen"]
                    ]) {
                        const row = element("div", "", details);
                        element("dt", term, row);
                        element("dd", String(value), row);
                    }
                    if (item) {
                        const action = element("a", "Vorschau öffnen", card);
                        action.href = type === "audio" ? "#audio" : "#ansicht";
                        action.addEventListener("click", () => {
                            const key = species + "." + name;
                            const target = type === "audio"
                                ? document.querySelector('[data-key="' + CSS.escape(key) + '"] select')
                                : document.querySelector('[data-model="' + CSS.escape(key) + '"] select');
                            if (!target || !Array.from(target.options).some(option => option.value === item.url)) return;
                            target.value = item.url;
                            target.dispatchEvent(new Event("change"));
                            target.focus({ preventScroll: true });
                        });
                    }
                    // Reserved for a future public shop product URL, separate from the preview.
                    const purchase = element("div", "", card);
                    purchase.className = "asset-purchase";
                    const buy = element("span", "Kauf: Demnächst verfügbar", purchase);
                    buy.className = "asset-availability";
                    element("small", "Shop-Verlinkung in Vorbereitung", purchase);
                }
            }
            mountAssetCarousel(grid, cards);
        }
        status.hidden = true;
    } catch {
        status.textContent = "Die Produktübersicht konnte nicht geladen werden.";
    }
}

function mountAssetCarousel(carousel, cards) {
    if (!cards.length) return;
    const controls = document.createElement("div");
    controls.className = "asset-carousel-controls";
    const count = document.createElement("span");
    count.setAttribute("role", "status");
    let index = 0;
    function show(next) {
        index = (next + cards.length) % cards.length;
        cards.forEach((card, i) => { card.hidden = i !== index; });
        count.textContent = (index + 1) + " / " + cards.length;
    }
    const previous = button(controls, "‹ Zurück", () => show(index - 1));
    controls.append(count);
    const next = button(controls, "Weiter ›", () => show(index + 1));
    previous.disabled = next.disabled = cards.length < 2;
    carousel.prepend(controls);
    controls.addEventListener("keydown", event => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        show(index + (event.key === "ArrowLeft" ? -1 : 1));
    });
    show(0);
}
