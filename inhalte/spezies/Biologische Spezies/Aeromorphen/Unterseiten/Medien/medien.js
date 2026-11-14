import "../../../../_gemeinsam/medien-player.js";
import "../../Hauptseite_%C3%BCbersicht/Spezies.js";
import { getAporiaMediaCollection } from "../../../../../../Men%C3%BCs/adapter/aporia-media.js";

const groups = Object.entries({ neue_motive:"Neue Aeromorphen-Bilder", gesamtdarstellung:"Ganzkörpervarianten", hauptseite:"Übersicht", anatomie:"Anatomie", entwicklung:"Entwicklung", geschichte:"Geschichte", gesellschaft:"Gesellschaft", politik:"Politik", heimatwelt:"Heimatwelt", medien:"Medien" });

async function gallery() {
    const section = document.querySelector("#bilder");
    const status = section.querySelector(".media-status");
    try {
        const collections = await Promise.all(groups.map(async ([key, title]) =>
            ({ key, title, items: await getAporiaMediaCollection("aeromorphen.bilder." + key) })));
        const populated = collections.filter(group => group.items.length);
        if (!populated.length) { status.textContent = "In Vorbereitung"; return; }
        const controls = section.querySelector(".gallery-controls");
        const select = controls.querySelector("select");
        const preview = section.querySelector(".gallery-preview");
        const grid = section.querySelector(".aero-gallery");
        const dialog = document.querySelector("dialog");
        const all = populated.flatMap(group => group.items);
        let items = all, index = 0;
        select.add(new Option("Alle", ""));
        for (const group of populated) select.add(new Option(group.title, group.key));
        function show(next) {
            index = (next + items.length) % items.length;
            const item = items[index];
            for (const container of [preview, dialog]) {
                const img = container.querySelector("img");
                img.src = item.url;
                img.alt = item.title;
            }
            dialog.querySelector("p").textContent = item.title;
            controls.querySelector("output").textContent = (index + 1) + " / " + items.length;
            [...grid.children].forEach((button, i) => button.setAttribute("aria-pressed", String(i === index)));
        }
        function populate() {
            items = populated.find(group => group.key === select.value)?.items ?? all;
            grid.replaceChildren(...items.map((item, i) => {
                const button = document.createElement("button");
                button.type = "button";
                button.setAttribute("aria-label", item.title);
                const img = new Image();
                img.loading = "lazy";
                img.alt = "";
                img.src = item.url;
                button.append(img);
                button.addEventListener("click", () => show(i));
                return button;
            }));
            show(0);
        }
        select.addEventListener("change", populate);
        for (const container of [section, dialog]) {
            container.querySelector("[data-prev]").addEventListener("click", () => show(index - 1));
            container.querySelector("[data-next]").addEventListener("click", () => show(index + 1));
        }
        dialog.addEventListener("keydown", event => {
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
            event.preventDefault();
            show(index + (event.key === "ArrowRight" ? 1 : -1));
        });
        preview.addEventListener("click", () => dialog.showModal());
        populate();
        controls.hidden = preview.hidden = false;
        status.hidden = true;
    } catch {
        status.textContent = "Die Galerie konnte nicht geladen werden.";
    }
}

gallery();
