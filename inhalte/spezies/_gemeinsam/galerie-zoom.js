export function mountGalleryZoom(dialog) {
    const image = dialog.querySelector("img");
    dialog.classList.add("gallery-fullscreen");
    const surface = document.createElement("div");
    surface.className = "gallery-fullscreen-surface";
    surface.append(...dialog.childNodes);
    dialog.append(surface);

    const toolbar = document.createElement("div");
    toolbar.className = "gallery-fullscreen-toolbar";
    surface.prepend(toolbar);
    toolbar.append(...surface.querySelectorAll(":scope > .controls, :scope > form"));

    const viewport = document.createElement("div");
    viewport.className = "gallery-zoom-viewport";
    viewport.tabIndex = 0;
    viewport.setAttribute("aria-label", "Bildausschnitt. Mit dem Mausrad zoomen und bei Vergrößerung scrollen.");
    image.before(viewport);
    viewport.append(image);

    const controls = document.createElement("div");
    controls.className = "controls gallery-zoom-controls";
    controls.setAttribute("role", "group");
    controls.setAttribute("aria-label", "Bildzoom");
    toolbar.append(controls);
    const level = document.createElement("span");
    level.setAttribute("aria-live", "polite");

    function addButton(label, name, action) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "control";
        button.textContent = label;
        button.setAttribute("aria-label", name);
        button.addEventListener("click", action);
        controls.append(button);
        return button;
    }

    let zoom = 1;
    const out = addButton("−", "Verkleinern", () => setZoom(zoom - 0.25));
    const reset = addButton("Zurücksetzen", "Zoom zurücksetzen", () => setZoom(1));
    const plus = addButton("+", "Vergrößern", () => setZoom(zoom + 0.25));
    controls.append(level);

    function setZoom(value, x = viewport.clientWidth / 2, y = viewport.clientHeight / 2) {
        const next = Math.min(4, Math.max(1, value));
        const factor = next / zoom;
        const left = (viewport.scrollLeft + x) * factor - x;
        const top = (viewport.scrollTop + y) * factor - y;
        zoom = next;
        viewport.style.setProperty("--gallery-zoom", zoom);
        viewport.scrollTo({ left: zoom === 1 ? 0 : left, top: zoom === 1 ? 0 : top, behavior: "instant" });
        level.textContent = Math.round(zoom * 100) + " %";
        out.disabled = reset.disabled = zoom === 1;
        plus.disabled = zoom === 4;
    }

    viewport.addEventListener("wheel", event => {
        if (!event.deltaY) return;
        event.preventDefault();
        const bounds = viewport.getBoundingClientRect();
        const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? viewport.clientHeight : 1);
        const factor = Math.exp(-Math.max(-120, Math.min(120, delta)) * 0.0025);
        setZoom(zoom * factor, event.clientX - bounds.left, event.clientY - bounds.top);
    }, { passive: false });

    dialog.addEventListener("keydown", event => {
        if (!["+", "-", "0"].includes(event.key) || event.ctrlKey || event.metaKey || event.altKey) return;
        event.preventDefault();
        setZoom(event.key === "0" ? 1 : zoom + (event.key === "+" ? 0.25 : -0.25));
    });
    let fullscreen = false;
    surface.addEventListener("fullscreenchange", () => {
        if (document.fullscreenElement === surface) {
            fullscreen = true;
        } else if (fullscreen) {
            fullscreen = false;
            if (dialog.open) dialog.close();
        }
    });
    dialog.addEventListener("close", () => {
        setZoom(1);
        if (document.fullscreenElement === surface) document.exitFullscreen().catch(() => {});
    });
    new MutationObserver(() => setZoom(1)).observe(image, { attributeFilter: ["src"] });
    setZoom(1);

    return function openGallery() {
        dialog.showModal();
        if (document.fullscreenEnabled && surface.requestFullscreen) {
            surface.requestFullscreen().then(() => {
                if (!dialog.open && document.fullscreenElement === surface) return document.exitFullscreen();
            }).catch(() => {
                // The dialog fills the viewport when browser fullscreen is unavailable.
            });
        }
    };
}
