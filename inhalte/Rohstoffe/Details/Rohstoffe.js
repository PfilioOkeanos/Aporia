import { resourceDetails } from "../rohstoff-details.js";
import { createNoteEditor } from "../../../Menüs/adapter/dossier-note.js";
import { applyAporiaRoutes } from "../../../Menüs/adapter/aporia-routes.js";
import { loadResources, resourceTopics } from "../rohstoff-katalog.js";

applyAporiaRoutes(document);
const main = document.querySelector("main");
const content = document.querySelector("#resource-content");
const status = document.querySelector("[role=status]");
const params = new URLSearchParams(location.search);
const groupKey = main.dataset.resourceGroup ?? params.get("gruppe");
const resourceId = main.dataset.resourceId ?? params.get("eintrag");

try {
    const groups = await loadResources();
    const group = groups.find(([key]) => key === groupKey);
    const item = group?.[2].find(entry => entry.id === resourceId);
    if (!item) {
        status.textContent = "Dieser Rohstoff ist im Archiv nicht vorhanden.";
    } else {
        document.title = item.title + " | Aporia";
        main.querySelector("h1").textContent = item.title;
        status.textContent = group[1];
        main.style.setProperty("--resource-art", "url(" + JSON.stringify(item.url) + ")");
        main.classList.add("resource-artwork");
        const imageLink = document.createElement("a");
        imageLink.href = item.url;
        imageLink.target = "_blank";
        imageLink.rel = "noopener";
        imageLink.textContent = "Bild in voller Größe öffnen";
        status.after(imageLink);

        content.className = "exploration-dossier";
        content.dataset.sidebarDetails = "";
        content.dataset.sidebarDefault = "";
        const details = resourceDetails(group[0], item);
        for (const [key, label, fields] of resourceTopics) {
            const section = document.createElement("details");
            section.id = "erkundung-" + key;
            const summary = document.createElement("summary");
            summary.dataset.sidebarTab = "";
            summary.textContent = label;
            const copy = document.createElement("p");
            copy.className = "exploration-content";
            copy.textContent = (details[key] ?? "Angaben offen.") + "\n\n" + fields;
            const storageKey = "aporia.rohstoff.notiz:" + JSON.stringify([group[0], item.id, key]);
            const fieldsToEdit = key === "uebersicht" ? [main.querySelector("h1")] : [];
            section.append(summary);
            section.append(createNoteEditor(storageKey, label, copy.textContent, summary, fieldsToEdit));
            content.append(section);
        }
        function openTopic() {
            const section = document.getElementById(location.hash.slice(1));
            if (section instanceof HTMLDetailsElement && content.contains(section)) {
                section.open = true;
                section.scrollIntoView({ block: "start" });
            }
        }
        window.addEventListener("hashchange", openTopic);
        openTopic();
        main.dispatchEvent(new Event("aporia:detail-tabs-ready"));
    }
} catch (error) {
    console.error("Rohstoffdossier:", error);
    status.textContent = "Das Rohstoffdossier konnte nicht aufgebaut werden.";
}
