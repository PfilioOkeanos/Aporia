import { createNoteEditor } from "../../../Menüs/adapter/dossier-note.js";
import { getCelestialTopics } from "./celestial-topics.js";
import { applyAporiaRoutes } from "../../../Menüs/adapter/aporia-routes.js";
import "../../../Menüs/adapter/aporia-media.js";

const main = document.querySelector("main");
const shell = main?.querySelector(".atlas-shell") ?? main;
if (shell) {
    applyAporiaRoutes(main);
    const topics = getCelestialTopics(main.querySelector(".atlas-hero p")?.textContent);
    const dossier = document.createElement("section");
    dossier.className = "exploration-dossier";
    dossier.dataset.sidebarDetails = "";
    dossier.dataset.sidebarDefault = "";
    const heading = document.createElement("h2");
    heading.textContent = "Erkundungsdossier";
    dossier.append(heading);
    const overview = document.createElement("div");
    const archiveLayout = shell.querySelector(".celestial-layout");
    if (archiveLayout) {
        archiveLayout.before(dossier);
        overview.append(archiveLayout);
    } else {
        shell.append(dossier);
    }

    for (const [key, label, fields] of topics) {
        const section = document.createElement("details");
        section.id = "erkundung-" + key;
        const summary = document.createElement("summary");
        summary.dataset.sidebarTab = "";
        summary.textContent = label;
        section.append(summary);
        if (key === "uebersicht" && archiveLayout) {
            section.append(overview);
        }
        const content = document.createElement("div");
        content.className = "exploration-content";
        const description = document.createElement("p");
        description.textContent = fields;
        const state = document.createElement("p");
        state.textContent = "Weitere Angaben offen.";
        content.append(description, state);
        const storageKey = "aporia.himmelskoerper.notiz:" + JSON.stringify([location.pathname, key]);
        const fieldsToEdit = key === "uebersicht"
            ? [document.querySelector("h1"), ...overview.querySelectorAll("dd")].filter(Boolean)
            : [];
        section.append(createNoteEditor(storageKey, label, description.textContent + "\n" + state.textContent, summary, fieldsToEdit));
        dossier.append(section);
    }

    const portrait = shell.querySelector(".celestial-portrait img, img[data-media-image]");
    if (portrait) {
        const fullImage = document.createElement("a");
        fullImage.className = "exploration-image-link";
        fullImage.textContent = "Bild in voller Größe öffnen";
        fullImage.target = "_blank";
        fullImage.rel = "noopener";
        fullImage.hidden = true;
        heading.after(fullImage);

        function updateArtwork() {
            const source = portrait.getAttribute("src");
            if (!source) return;
            const url = new URL(source, document.baseURI).href;
            main.style.setProperty("--dossier-art", "url(" + JSON.stringify(url) + ")");
            main.classList.add("celestial-page-artwork");
            fullImage.href = url;
            fullImage.hidden = false;
        }
        portrait.addEventListener("load", updateArtwork);
        updateArtwork();
    }

    function openTopic() {
        const section = document.getElementById(location.hash.slice(1));
        if (section && dossier.contains(section)) {
            section.open = true;
            section.scrollIntoView({ block: "start" });
        }
    }
    window.addEventListener("hashchange", openTopic);
    openTopic();
    main.dispatchEvent(new Event("aporia:detail-tabs-ready"));
}
