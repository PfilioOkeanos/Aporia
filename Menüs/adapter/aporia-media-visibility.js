import { bewegungReduziert } from "./aporia-bewegung.js";
export function observeMediaVisibility(element, update) {
    let intersecting = false;
    let pageActive = true;
    let previous;
    function sync() {
        const visible = pageActive && intersecting && !document.hidden;
        if (visible === previous) return;
        previous = visible;
        update(visible);
    }
    const observer = new IntersectionObserver(([entry]) => {
        intersecting = entry.isIntersecting;
        sync();
    });
    observer.observe(element);
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("pagehide", () => { pageActive = false; sync(); });
    window.addEventListener("pageshow", () => { pageActive = true; sync(); });
}

export function loadVisibleLoop(video, container, source, toggle) {
    const motion = bewegungReduziert;
    let visible = false;
    let requested = !motion.matches;
    function sync() {
        if (!visible || !requested) {
            video.pause();
            return;
        }
        if (!video.hasAttribute("src")) video.src = source;
        video.play().catch(() => {});
    }
    video.autoplay = false;
    toggle.addEventListener("click", () => {
        requested = video.paused;
        sync();
    });
    motion.addEventListener("change", () => {
        requested = !motion.matches;
        sync();
    });
    observeMediaVisibility(container, current => {
        visible = current;
        sync();
    });
}
