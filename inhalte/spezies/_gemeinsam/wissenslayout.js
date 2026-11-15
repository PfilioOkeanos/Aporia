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
    centerSingleCardRows(root);
}


// Measure the rows after CSS has chosen the current number of columns.
export function centerSingleCardRows(root = document) {
    const grids = root.querySelectorAll(
        ".facharchiv .source-content, .species-detail-panels, .hh-detail-grid, .hs-detail .hs-grid, .ha-grid"
    );
    for (const grid of grids) {
        const cards = [...grid.children].filter(card =>
            card.matches(".chapter-block, .species-detail-panel, .ha-card"));
        if (!cards.length) continue;
        let frame;
        function update() {
            const bounds = grid.getBoundingClientRect();
            if (!bounds.width) return;
            const rows = new Map();
            for (const card of cards) {
                if (!card.getClientRects().length) continue;
                const row = rows.get(card.offsetTop) ?? [];
                row.push(card);
                rows.set(card.offsetTop, row);
            }
            for (const row of rows.values()) {
                for (const card of row) {
                    const rect = card.getBoundingClientRect();
                    const previous = parseFloat(card.style.getPropertyValue("--single-card-offset")) || 0;
                    const shift = row.length === 1 && rect.width < bounds.width - 1
                        ? bounds.left + bounds.width / 2 - (rect.left + rect.width / 2 - previous)
                        : 0;
                    const value = shift.toFixed(2) + "px";
                    if (card.style.getPropertyValue("--single-card-offset") !== value) {
                        card.style.setProperty("--single-card-offset", value);
                    }
                }
            }
        }
        const observer = new ResizeObserver(() => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(update);
        });
        observer.observe(grid);
        for (const card of cards) observer.observe(card);
        update();
    }
}
