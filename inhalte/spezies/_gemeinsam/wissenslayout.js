const widths = { bildtext:8, textbild:8, thema:4, fakten:4, fach:8, vergleich:6, galerie:12, besonderheit:6, vollbreite:12 };

export function arrangeKnowledgeCards(root = document) {
    for (const group of root.querySelectorAll(".source-content, .species-detail-panels")) {
        let occupied = 0;
        let row = [];
        const finishRow = () => {
            if (row.length && occupied < 12) {
                const last = row.at(-1);
                last.style.setProperty("--card-span", last.width + 12 - occupied);
            }
            row = [];
            occupied = 0;
        };
        for (const card of group.children) {
            if (!card.matches(".chapter-block, .species-detail-panel")) {
                finishRow();
                continue;
            }
            const visual = card.querySelector(":scope > .chapter-visual");
            const text = card.querySelector(":scope > .chapter-text");
            if (visual && text) {
                const body = document.createElement("div");
                body.className = "chapter-body";
                visual.before(body);
                body.append(visual, text);
            }
            const title = card.querySelector("h2,h3,h4")?.textContent.trim() ?? "";
            const words = card.textContent.trim().split(/\s+/).length;
            const type = card.dataset.cardType || (
                card.querySelector("[data-gallery]") ? "galerie" :
                card.querySelector("[data-comparison]") ? "vergleich" :
                card.querySelector("table") ? "vollbreite" :
                card.querySelector(".chapter-visual img") ? (card.classList.contains("chapter-reverse") ? "textbild" : "bildtext") :
                card.querySelector("dl") ? "fakten" :
                words > 150 || title.length > 72 ? "fach" :
                words > 85 ? "besonderheit" : "thema"
            );
            const width = widths[type] ?? 6;
            if (occupied + width > 12) finishRow();
            card.dataset.cardType = type;
            card.style.setProperty("--card-span", width);
            row.push({ style: card.style, width });
            occupied += width;
            if (occupied === 12) finishRow();
        }
        finishRow();
    }
}
