import { ordneDossier } from "./dossier-aufbau.js";
ordneDossier(document.querySelector("main"));
// Ergänzt ältere Dossierkarten. Vorhandene Kapitel und Medienelemente behalten ihre Funktion.
const main = document.querySelector("main");
main?.querySelectorAll("details[open]").forEach(chapter => { chapter.open = false; });

const mediaPanels = new Map();
if (/\/medien\.html$/i.test(location.pathname)) {
    for (const panel of main?.querySelectorAll("section:is(#videos,#bewegtbild,#audio,#klangarchiv)") ?? []) {
        const heading = panel.querySelector(":scope > h2");
        if (!heading) continue;
        const button = document.createElement("button");
        button.type = "button";
        button.className = "dossier-kapitelschalter dossier-medienschalter";
        while (heading.firstChild) button.append(heading.firstChild);
        heading.append(button);
        panel.classList.add("dossier-medienbereich");
        const setOpen = open => {
            button.setAttribute("aria-expanded", String(open));
            panel.classList.toggle("dossier-medien-zu", !open);
            if (!open) panel.querySelectorAll("video,audio").forEach(player => player.pause());
        };
        setOpen(false);
        button.addEventListener("click", () => setOpen(button.getAttribute("aria-expanded") !== "true"));
        mediaPanels.set(panel, setOpen);
    }
    for (const panel of mediaPanels.keys()) {
        if ([...panel.parentElement.children].filter(node => mediaPanels.has(node)).length > 1) {
            panel.parentElement.classList.add("dossier-medienfolge");
        }
    }
}

// Direkte Kapitelverweise sollen auch den zugehörigen Text einblenden.
function openFragment() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    if (!target) return;
    mediaPanels.get(target.closest('.dossier-medienbereich'))?.(true);
    for (let el = target; el; el = el.parentElement) if (el instanceof HTMLDetailsElement) el.open = true;
}
openFragment();
window.addEventListener("hashchange", openFragment);

