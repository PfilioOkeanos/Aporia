import "../../../Menüs/TopBar/Top_bar.js";
import { getAporiaAssetCatalog } from "../../../Menüs/adapter/aporia-media.js";

const STORAGE_KEY = "aporia.story-editor.v1";
const SAVE_DELAY = 850;
const MAX_VERSIONS = 30;
const editor = document.querySelector("#story-editor");
const statusLabel = document.querySelector("#save-status");
const elements = {
    storyList: document.querySelector("#story-list"),
    chapterList: document.querySelector("#chapter-list"),
    storyTitle: document.querySelector("#story-title"),
    chapterTitle: document.querySelector("#chapter-title"),
    editorEmpty: document.querySelector("#editor-empty"),
    wordCount: document.querySelector("#word-count"),
    search: document.querySelector("#story-search"),
    searchResults: document.querySelector("#search-results"),
    decisionList: document.querySelector("#decision-list"),
    trashList: document.querySelector("#trash-list"),
    trashDropzone: document.querySelector("#trash-dropzone"),
    trashCount: document.querySelector("#trash-count"),
    trashClear: document.querySelector("#trash-clear"),
    versionsDialog: document.querySelector("#versions-dialog"),
    versionList: document.querySelector("#version-list"),
    mediaDialog: document.querySelector("#media-dialog"),
    mediaRoot: document.querySelector("#media-root"),
    mediaFolders: document.querySelector("#media-folders"),
    mediaSelectionPath: document.querySelector("#media-selection-path"),
    mediaPathCopy: document.querySelector("#media-path-copy"),
    mediaPreview: document.querySelector("#media-preview"),
    mediaInsert: document.querySelector("#media-insert"),
    importFile: document.querySelector("#import-file")
};

function createId() {
    return crypto.randomUUID?.() ?? "id-" + Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function createChapter(title = "Kapitel 1") {
    return { id: createId(), title, content: "", versions: [], updatedAt: new Date().toISOString() };
}

function createStory(title = "Neue Geschichte") {
    return {
        id: createId(),
        title,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        chapters: [createChapter()],
        decisions: []
    };
}

function readStoredState() {
    try {
        const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
        if (parsed && Array.isArray(parsed.stories)) {
            parsed.trash = Array.isArray(parsed.trash) ? parsed.trash : [];
            parsed.activeStoryId ||= parsed.stories[0]?.id ?? null;
            parsed.activeChapterId ||= parsed.stories[0]?.chapters?.[0]?.id ?? null;
            for (const story of parsed.stories) {
                story.chapters = Array.isArray(story.chapters) ? story.chapters : [];
                story.decisions = Array.isArray(story.decisions) ? story.decisions : [];
                for (const chapter of story.chapters) {
                    chapter.versions = Array.isArray(chapter.versions) ? chapter.versions : [];
                    chapter.content = sanitizeHtml(chapter.content || "");
                }
            }
            return parsed;
        }
    } catch (error) {
        console.warn("StoryEditor konnte lokale Daten nicht laden.", error);
    }
    const firstStory = createStory();
    return { stories: [firstStory], trash: [], activeStoryId: firstStory.id, activeChapterId: firstStory.chapters[0].id };
}

let state = readStoredState();
let saveTimer = 0;
let pendingMedia = [];
let assetCatalog = null;
let selectedAsset = null;
let editorSelection = null;

function getStory() {
    return state.stories.find(story => story.id === state.activeStoryId) ?? null;
}

function getChapter(story = getStory()) {
    return story?.chapters.find(chapter => chapter.id === state.activeChapterId) ?? null;
}

function setSaveStatus(message, status = "saved") {
    statusLabel.textContent = message;
    statusLabel.dataset.state = status;
}

function scheduleSave() {
    setSaveStatus("Änderungen werden gesichert …", "saving");
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(saveNow, SAVE_DELAY);
}

function saveNow() {
    const story = getStory();
    const chapter = getChapter(story);
    const timestamp = new Date().toISOString();
    if (story) story.updatedAt = timestamp;
    if (chapter) {
        chapter.updatedAt = timestamp;
        const lastVersion = chapter.versions[chapter.versions.length - 1];
        if (!lastVersion || lastVersion.content !== chapter.content) {
            chapter.versions.push({ id: createId(), savedAt: timestamp, content: chapter.content });
            chapter.versions = chapter.versions.slice(-MAX_VERSIONS);
        }
    }
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        setSaveStatus("Lokal gespeichert");
    } catch (error) {
        console.error("Lokales Speichern fehlgeschlagen.", error);
        setSaveStatus("Speicher voll – bitte JSON sichern", "error");
    }
    renderStoryList();
    renderTrash();
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
}

function safeUrl(value) {
    try {
        const url = new URL(value, location.href);
        return ["http:", "https:"].includes(url.protocol) ? url.href : "";
    } catch {
        return "";
    }
}

function sanitizeHtml(markup) {
    const documentFragment = new DOMParser().parseFromString(String(markup), "text/html");
    const allowed = new Set(["P","DIV","BR","HR","H1","H2","H3","H4","H5","H6","STRONG","B","EM","I","U","S","UL","OL","LI","BLOCKQUOTE","A","FIGURE","FIGCAPTION","IMG","VIDEO","SPAN"]);
    for (const element of [...documentFragment.body.querySelectorAll("*")]) {
        if (element.classList.contains("aporia-free-text-grip")) { element.remove(); continue; }
        if (!allowed.has(element.tagName)) {
            element.replaceWith(document.createTextNode(element.textContent || ""));
            continue;
        }
        for (const attribute of [...element.attributes]) {
            const name = attribute.name.toLowerCase();
            if (name === "class") {
                const allowedClasses = attribute.value.split(/\s+/).filter(value => ["aporia-media-frame","aporia-media-note","aporia-free-text"].includes(value));
                if (allowedClasses.length) element.setAttribute("class", allowedClasses.join(" "));
                else element.removeAttribute("class");
                continue;
            }
            const isMediaData = ["data-aporia-media-key","data-aporia-media-frame","data-aporia-x","data-aporia-y","data-aporia-free","data-aporia-layout-x","data-aporia-layout-y","data-aporia-layout-w"].includes(name);
            const isKnownClass = name === "class" && ["aporia-media-frame","aporia-media-note","aporia-free-text"].includes(attribute.value);
            const isNoteEditable = name === "contenteditable" && ((element.tagName === "SPAN" && element.classList.contains("aporia-media-note")) || (element.tagName === "DIV" && element.classList.contains("aporia-free-text"))) && attribute.value === "true";
            const isAllowed = ["href","src","alt","title","controls","width","height"].includes(name) || isMediaData || isKnownClass || isNoteEditable;
            if (!isAllowed) {
                element.removeAttribute(attribute.name);
                continue;
            }
            if (name === "href" || name === "src") {
                const resolved = safeUrl(attribute.value);
                if (resolved) element.setAttribute(name, resolved);
                else element.removeAttribute(name);
            }
            if ((name === "data-aporia-x" || name === "data-aporia-y") && !/^(?:100|[0-9]{1,2})(?:\.[0-9]{1,2})?$/.test(attribute.value)) element.removeAttribute(name);
        if ((name === "data-aporia-layout-x" && !/^(?:100|[0-9]{1,2})(?:\.[0-9]{1,2})?$/.test(attribute.value)) || (name === "data-aporia-layout-y" && !/^\d+(?:\.\d+)?$/.test(attribute.value))) element.removeAttribute(name);
        }
        if (element.tagName === "VIDEO") element.setAttribute("controls", "");
    }
    return documentFragment.body.innerHTML;
}

function contentText(html) {
    return new DOMParser().parseFromString(html || "", "text/html").body.textContent || "";
}

function renderStoryList() {
    const activeStory = getStory();
    elements.storyList.replaceChildren();
    for (const story of state.stories) {
        const row = document.createElement("div");
        row.className = "story-list-item";
        const select = document.createElement("button");
        select.type = "button";
        select.className = "story-select" + (story.id === activeStory?.id ? " is-active" : "");
        select.textContent = story.title || "Unbenannte Geschichte";
        select.title = select.textContent;
        select.addEventListener("click", () => {
            state.activeStoryId = story.id;
            state.activeChapterId = story.chapters[0]?.id ?? null;
            renderAll();
            scheduleSave();
        });
        const menu = document.createElement("button");
        menu.type = "button";
        menu.className = "story-item-menu";
        menu.textContent = "···";
        menu.title = "Geschichte umbenennen oder löschen";
        menu.setAttribute("aria-label", menu.title);
        menu.addEventListener("click", () => {
            const action = prompt("Geschichte umbenennen oder löschen? Gib einen neuen Namen ein. Für Löschen leer lassen und bestätigen.");
            if (action === null) return;
            if (action.trim()) {
                story.title = action.trim();
                if (story.id === state.activeStoryId) elements.storyTitle.value = story.title;
                scheduleSave();
            } else if (confirm("Diese Geschichte in den Papierkorb verschieben?")) {
                moveToTrash("story", story, story.title);
            }
        });
        row.append(select, menu);
        elements.storyList.append(row);
    }
}

function renderChapterList() {
    const story = getStory();
    elements.chapterList.replaceChildren();
    if (!story) return;
    story.chapters.forEach((chapter, index) => {
        const row = document.createElement("li");
        row.className = "chapter-item";
        const select = document.createElement("button");
        select.type = "button";
        select.className = "chapter-select" + (chapter.id === state.activeChapterId ? " is-active" : "");
        select.textContent = chapter.title || "Unbenanntes Kapitel";
        select.addEventListener("click", () => {
            state.activeChapterId = chapter.id;
            renderCurrentChapter();
            renderChapterList();
            renderDecisions();
            scheduleSave();
        });
        const actions = document.createElement("span");
        actions.className = "chapter-actions";
        const rename = document.createElement("button");
        rename.type = "button";
        rename.textContent = "✎";
        rename.title = "Kapitel umbenennen";
        rename.setAttribute("aria-label", rename.title);
        rename.addEventListener("click", () => {
            const title = prompt("Neuer Kapitelname", chapter.title);
            if (title?.trim()) {
                chapter.title = title.trim();
                if (chapter.id === state.activeChapterId) elements.chapterTitle.value = chapter.title;
                renderChapterList();
                scheduleSave();
            }
        });
        actions.append(rename);
        row.append(select, actions);
        elements.chapterList.append(row);
    });
}

function renderCurrentChapter() {
    const story = getStory();
    const chapter = getChapter(story);
    elements.storyTitle.value = story?.title ?? "";
    elements.chapterTitle.value = chapter?.title ?? "";
    const hasChapter = Boolean(chapter);
    editor.hidden = !hasChapter;
    elements.editorEmpty.hidden = hasChapter;
    editor.contentEditable = String(hasChapter);
    editor.innerHTML = chapter ? sanitizeHtml(chapter.content) : "";
    editor.querySelectorAll("img, video").forEach(media => { media.draggable = false; });
    positionMediaAnnotations(editor);
    positionFreeElements(editor);
    setSelectedObjects([]);
    hideMediaControls();
    updateWordCount();
}

function renderAll() {
    renderStoryList();
    renderChapterList();
    renderCurrentChapter();
    renderDecisions();
    renderTrash();
}

function updateWordCount() {
    const text = editor.innerText.trim();
    const words = text ? text.split(/\s+/u).length : 0;
    elements.wordCount.textContent = words + (words === 1 ? " Wort" : " Wörter");
}

function saveEditorContent() {
    const chapter = getChapter();
    if (!chapter) return;
    positionFreeElements(editor);
    chapter.content = sanitizeHtml(editor.innerHTML);
    updateWordCount();
    scheduleSave();
}

function deleteDraggedSelection(range) {
    const node = range.startContainer;
    const element = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
    const block = element?.closest(".aporia-free-text, p");
    range.deleteContents();
    if (block && block !== editor && !block.textContent.trim() && !block.querySelector("img, video, figure")) block.remove();
}

function moveToTrash(type, data, title, storyId = null) {
    state.trash.push({ id: createId(), type, title, deletedAt: new Date().toISOString(), storyId, data: structuredClone(data) });
    if (type === "story") {
        state.stories = state.stories.filter(story => story.id !== data.id);
        if (state.activeStoryId === data.id) {
            const next = state.stories[0] ?? createStory();
            if (!state.stories.length) state.stories.push(next);
            state.activeStoryId = next.id;
            state.activeChapterId = next.chapters[0]?.id ?? null;
        }
    } else {
        const story = state.stories.find(item => item.id === storyId);
        if (story) story.chapters = story.chapters.filter(chapter => chapter.id !== data.id);
        if (state.activeChapterId === data.id) state.activeChapterId = story?.chapters[0]?.id ?? null;
    }
    renderAll();
    scheduleSave();
}

function sendEditorContentToTrash(type, title, data, storyId = state.activeStoryId, chapterId = state.activeChapterId) {
    state.trash.push({ id: createId(), type, title, deletedAt: new Date().toISOString(), storyId, chapterId, data });
    renderTrash();
    saveEditorContent();
}
function renderTrash() {
    elements.trashList.replaceChildren();
    elements.trashCount.textContent = String(state.trash.length);
    elements.trashClear.disabled = state.trash.length === 0;
    if (!state.trash.length) {
        const empty = document.createElement("p");
        empty.className = "trash-entry";
        empty.textContent = "Der Papierkorb ist leer.";
        elements.trashList.append(empty);
        return;
    }
    for (const item of state.trash) {
        const entry = document.createElement("div");
        entry.className = "trash-entry";
        const label = document.createElement("span");
        const itemType = item.type === "story" ? "Geschichte" : item.type === "chapter" ? "Kapitel" : item.type === "media" ? "Bild / Video" : "Text";
        label.textContent = itemType + ": " + (item.title || "Gelöschter Inhalt");
        const actions = document.createElement("div");
        actions.className = "trash-actions";
        const restore = document.createElement("button");
        restore.type = "button";
        restore.textContent = "Wiederherstellen";
        restore.addEventListener("click", () => {
            if (item.type === "story") {
                state.stories.push(item.data);
                state.activeStoryId = item.data.id;
                state.activeChapterId = item.data.chapters[0]?.id ?? null;
            } else if (item.type === "chapter") {
                let parent = state.stories.find(story => story.id === item.storyId);
                if (!parent) {
                    parent = createStory("Wiederhergestellte Geschichte");
                    parent.chapters = [];
                    state.stories.push(parent);
                }
                parent.chapters.push(item.data);
                state.activeStoryId = parent.id;
                state.activeChapterId = item.data.id;
            } else {
                let parent = state.stories.find(story => story.id === item.storyId);
                if (!parent) { parent = createStory("Wiederhergestellte Geschichte"); state.stories.push(parent); }
                let chapter = parent.chapters.find(ch => ch.id === item.chapterId);
                if (!chapter) { chapter = createChapter("Wiederhergestellter Inhalt"); parent.chapters.push(chapter); }
                if (item.type === "media") chapter.content += item.data.html || "";
                else chapter.content += item.data.freeElement ? (item.data.html || "") : "<p>" + (item.data.html || escapeHtml(item.data.text || "")) + "</p>";
                state.activeStoryId = parent.id;
                state.activeChapterId = chapter.id;
            }
            state.trash = state.trash.filter(candidate => candidate.id !== item.id);
            renderAll();
            scheduleSave();
        });
        const remove = document.createElement("button");
        remove.type = "button";
        remove.textContent = "Endgültig löschen";
        remove.addEventListener("click", () => {
            state.trash = state.trash.filter(candidate => candidate.id !== item.id);
            renderTrash();
            scheduleSave();
        });
        actions.append(restore, remove);
        entry.append(label, actions);
        elements.trashList.append(entry);
    }
}

function addNewStory() {
    const story = createStory("Neue Geschichte " + (state.stories.length + 1));
    state.stories.push(story);
    state.activeStoryId = story.id;
    state.activeChapterId = story.chapters[0].id;
    renderAll();
    scheduleSave();
    elements.storyTitle.focus();
    elements.storyTitle.select();
}

function addNewChapter() {
    const story = getStory();
    if (!story) return;
    const chapter = createChapter("Kapitel " + (story.chapters.length + 1));
    story.chapters.push(chapter);
    state.activeChapterId = chapter.id;
    renderAll();
    scheduleSave();
    elements.chapterTitle.focus();
    elements.chapterTitle.select();
}

function moveChapter(offset) {
    const story = getStory();
    const index = story?.chapters.findIndex(chapter => chapter.id === state.activeChapterId) ?? -1;
    const target = index + offset;
    if (!story || index < 0 || target < 0 || target >= story.chapters.length) return;
    [story.chapters[index], story.chapters[target]] = [story.chapters[target], story.chapters[index]];
    renderChapterList();
    scheduleSave();
}

function openVersions() {
    const chapter = getChapter();
    elements.versionList.replaceChildren();
    if (!chapter?.versions.length) {
        const empty = document.createElement("p");
        empty.className = "version-empty";
        empty.textContent = "Für dieses Kapitel gibt es noch keine gespeicherten Versionen.";
        elements.versionList.append(empty);
    } else {
        [...chapter.versions].reverse().forEach(version => {
            const row = document.createElement("div");
            row.className = "version-entry";
            const info = document.createElement("div");
            const title = document.createElement("strong");
            title.textContent = "Gespeicherter Stand";
            const date = document.createElement("small");
            date.textContent = new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", timeStyle: "short" }).format(new Date(version.savedAt));
            info.append(title, date);
            const actions = document.createElement("div");
            actions.className = "version-actions";
            const preview = document.createElement("button");
            preview.type = "button";
            preview.textContent = "Vorschau";
            preview.addEventListener("click", () => {
                editor.innerHTML = sanitizeHtml(version.content);
                updateWordCount();
            });
            const restore = document.createElement("button");
            restore.type = "button";
            restore.textContent = "Wiederherstellen";
            restore.addEventListener("click", () => {
                chapter.content = sanitizeHtml(version.content);
                state.activeChapterId = chapter.id;
                renderCurrentChapter();
                scheduleSave();
                elements.versionsDialog.close();
            });
            actions.append(preview, restore);
            row.append(info, actions);
            elements.versionList.append(row);
        });
    }
    elements.versionsDialog.showModal();
}

function nodeToMarkdown(node) {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent;
    if (node.nodeType !== Node.ELEMENT_NODE) return "";
    const children = [...node.childNodes].map(nodeToMarkdown).join("");
    switch (node.tagName) {
        case "H1": return "# " + children.trim() + "\n\n";
        case "H2": return "## " + children.trim() + "\n\n";
        case "H3": return "### " + children.trim() + "\n\n";
        case "H4": return "#### " + children.trim() + "\n\n";
        case "H5": return "##### " + children.trim() + "\n\n";
        case "H6": return "###### " + children.trim() + "\n\n";
        case "P": case "DIV": return children.trim() + "\n\n";
        case "STRONG": case "B": return "**" + children + "**";
        case "EM": case "I": return "*" + children + "*";
        case "BLOCKQUOTE": return children.trim().split("\n").map(line => "> " + line).join("\n") + "\n\n";
        case "LI": return "- " + children.trim() + "\n";
        case "BR": return "\n";
        case "IMG": return "![" + (node.alt || "") + "](" + node.src + ")\n\n";
        case "VIDEO": return "[Video](" + node.src + ")\n\n";
        default: return children;
    }
}

function downloadFile(name, data, type) {
    const url = URL.createObjectURL(new Blob([data], { type }));
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
    URL.revokeObjectURL(url);
}

function exportJson() {
    downloadFile("aporia-geschichten.json", JSON.stringify({ version: 1, stories: state.stories, trash: state.trash }, null, 2), "application/json");
}

function exportMarkdown() {
    const story = getStory();
    if (!story) return;
    const chapters = story.chapters.map((chapter, index) => {
        const markup = new DOMParser().parseFromString(chapter.content || "", "text/html").body;
        return "## " + (chapter.title || "Kapitel " + (index + 1)) + "\n\n" +
            [...markup.childNodes].map(nodeToMarkdown).join("").trim();
    }).join("\n\n");
    const markdown = "# " + (story.title || "Unbenannte Geschichte") + "\n\n" + chapters;
    downloadFile((story.title || "geschichte").replace(/[^\p{L}\p{N}-]+/gu, "_") + ".md", markdown, "text/markdown;charset=utf-8");
}

function markdownToHtml(markdown) {
    return String(markdown).split(/\n{2,}/).map(block => {
        const heading = block.match(/^(#{1,6})\s+(.+)$/);
        if (heading) return "<h" + heading[1].length + ">" + escapeHtml(heading[2]) + "</h" + heading[1].length + ">";
        const lines = block.split("\n");
        if (lines.every(line => line.startsWith("> "))) {
            return "<blockquote><p>" + lines.map(line => escapeHtml(line.replace(/^>\s?/, ""))).join("<br>") + "</p></blockquote>";
        }
        if (lines.every(line => /^[-*]\s/.test(line))) {
            return "<ul>" + lines.map(line => "<li>" + escapeHtml(line.replace(/^[-*]\s/, "")) + "</li>").join("") + "</ul>";
        }
        const inline = escapeHtml(block)
            .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
            .replace(/\*(.+?)\*/g, "<em>$1</em>");
        return "<p>" + inline.replace(/\n/g, "<br>") + "</p>";
    }).join("");
}

function importMarkdown(text) {
    const lines = String(text).replace(/\r/g, "").split("\n");
    const titleIndex = lines.findIndex(line => /^#\s+/.test(line));
    const title = titleIndex >= 0 ? lines[titleIndex].replace(/^#\s+/, "").trim() : "Importierte Geschichte";
    const bodyLines = titleIndex >= 0 ? lines.slice(titleIndex + 1) : lines;
    const chapters = [];
    let chapterTitle = "Kapitel 1";
    let buffer = [];
    let hasChapter = false;
    function flush() {
        if (buffer.length || hasChapter) {
            chapters.push({ ...createChapter(chapterTitle), content: markdownToHtml(buffer.join("\n").trim()) });
        }
        buffer = [];
        hasChapter = false;
    }
    for (const line of bodyLines) {
        if (/^##\s+/.test(line)) {
            flush();
            chapterTitle = line.replace(/^##\s+/, "").trim();
            hasChapter = true;
        } else {
            buffer.push(line);
        }
    }
    flush();
    if (!chapters.length) chapters.push(createChapter());
    return { ...createStory(title), chapters };
}

async function importFile(file) {
    const text = await file.text();
    let importedStories = [];
    if (/\.json$/i.test(file.name)) {
        const parsed = JSON.parse(text);
        importedStories = Array.isArray(parsed.stories) ? parsed.stories : [parsed];
    } else {
        importedStories = [importMarkdown(text)];
    }
    for (const imported of importedStories) {
        if (!imported || !Array.isArray(imported.chapters)) continue;
        const story = {
            ...createStory(imported.title || "Importierte Geschichte"),
            ...imported,
            id: createId(),
            decisions: Array.isArray(imported.decisions) ? imported.decisions : []
        };
        story.chapters = imported.chapters.map(chapter => ({
            ...createChapter(chapter.title || "Kapitel"),
            ...chapter,
            id: createId(),
            content: sanitizeHtml(chapter.content || ""),
            versions: Array.isArray(chapter.versions) ? chapter.versions : []
        }));
        state.stories.push(story);
        state.activeStoryId = story.id;
        state.activeChapterId = story.chapters[0]?.id ?? null;
    }
    renderAll();
    saveNow();
}

function renderSearchResults(query) {
    const term = query.trim().toLocaleLowerCase("de");
    elements.searchResults.replaceChildren();
    if (!term) {
        elements.searchResults.hidden = true;
        return;
    }
    const hits = [];
    for (const story of state.stories) {
        if (story.title.toLocaleLowerCase("de").includes(term)) {
            hits.push({ story, chapter: story.chapters[0], label: story.title, snippet: "Geschichte" });
        }
        for (const chapter of story.chapters) {
            const text = contentText(chapter.content);
            const index = text.toLocaleLowerCase("de").indexOf(term);
            if (chapter.title.toLocaleLowerCase("de").includes(term) || index >= 0) {
                hits.push({ story, chapter, label: chapter.title, snippet: index >= 0 ? text.slice(Math.max(0, index - 35), index + term.length + 55) : story.title });
            }
        }
    }
    elements.searchResults.hidden = false;
    if (!hits.length) {
        const empty = document.createElement("div");
        empty.className = "search-result";
        empty.textContent = "Keine Treffer.";
        elements.searchResults.append(empty);
        return;
    }
    hits.slice(0, 30).forEach(hit => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "search-result";
        const title = document.createElement("strong");
        title.textContent = hit.label || "Unbenanntes Kapitel";
        const snippet = document.createElement("small");
        snippet.textContent = hit.snippet;
        button.append(title, snippet);
        button.addEventListener("click", () => {
            state.activeStoryId = hit.story.id;
            state.activeChapterId = hit.chapter?.id ?? null;
            elements.searchResults.hidden = true;
            elements.search.value = "";
            renderAll();
        });
        elements.searchResults.append(button);
    });
}

function renderDecisions() {
    const story = getStory();
    const chapter = getChapter(story);
    elements.decisionList.replaceChildren();
    if (!story || !chapter) {
        const empty = document.createElement("p");
        empty.className = "inspector-intro";
        empty.textContent = "Wähle ein Kapitel, um Entscheidungen anzulegen.";
        elements.decisionList.append(empty);
        return;
    }
    const decisions = story.decisions.filter(decision => decision.chapterId === chapter.id);
    if (!decisions.length) {
        const empty = document.createElement("p");
        empty.className = "inspector-intro";
        empty.textContent = "Für dieses Kapitel gibt es noch keine Spielerentscheidungen.";
        elements.decisionList.append(empty);
        return;
    }
    for (const decision of decisions) {
        const card = document.createElement("article");
        card.className = "decision-card";
        const heading = document.createElement("div");
        heading.className = "decision-heading";
        const label = document.createElement("span");
        label.textContent = "ENTSCHEIDUNG";
        const remove = document.createElement("button");
        remove.type = "button";
        remove.textContent = "Entfernen";
        remove.addEventListener("click", () => {
            story.decisions = story.decisions.filter(item => item.id !== decision.id);
            renderDecisions();
            scheduleSave();
        });
        heading.append(label, remove);

        const promptLabel = document.createElement("label");
        promptLabel.className = "decision-prompt";
        promptLabel.textContent = "Frage";
        const promptInput = document.createElement("textarea");
        promptInput.value = decision.prompt || "";
        promptInput.placeholder = "Welche Wahl trifft die Spielfigur?";
        promptInput.addEventListener("input", () => { decision.prompt = promptInput.value; scheduleSave(); });
        promptLabel.append(promptInput);
        card.append(heading, promptLabel);

        const choices = document.createElement("div");
        choices.className = "decision-choices";
        decision.choices.forEach((choice, index) => {
            const group = document.createElement("div");
            group.className = "decision-choice";
            const choiceLabel = document.createElement("label");
            choiceLabel.textContent = "Option " + (index + 1);
            const text = document.createElement("input");
            text.value = choice.text || "";
            text.placeholder = "Entscheidungstext";
            text.addEventListener("input", () => { choice.text = text.value; scheduleSave(); });
            const targetLabel = document.createElement("label");
            targetLabel.textContent = "Weiter zu";
            const select = document.createElement("select");
            const end = document.createElement("option");
            end.value = "";
            end.textContent = "Ende oder offen";
            select.append(end);
            for (const target of story.chapters) {
                const option = document.createElement("option");
                option.value = target.id;
                option.textContent = target.title || "Unbenanntes Kapitel";
                select.append(option);
            }
            select.value = choice.nextChapterId || "";
            select.addEventListener("change", () => { choice.nextChapterId = select.value; scheduleSave(); });
            group.append(choiceLabel, text, targetLabel, select);
            choices.append(group);
        });
        const addChoice = document.createElement("button");
        addChoice.type = "button";
        addChoice.className = "add-choice";
        addChoice.textContent = "＋ Option";
        addChoice.addEventListener("click", () => {
            decision.choices.push({ id: createId(), text: "", nextChapterId: "" });
            renderDecisions();
            scheduleSave();
        });
        card.append(choices, addChoice);
        elements.decisionList.append(card);
    }
}

function captureEditorSelection() {
    const selection = window.getSelection();
    if (selection?.rangeCount && editor.contains(selection.anchorNode)) editorSelection = selection.getRangeAt(0).cloneRange();
}

function ensureMediaFrame(figure) {
    let frame = figure.querySelector("[data-aporia-media-frame]");
    if (!frame) {
        frame = document.createElement("div");
        frame.className = "aporia-media-frame";
        frame.dataset.aporiaMediaFrame = "";
        const visual = figure.querySelector("img, video");
        if (visual) frame.append(visual);
        figure.insertBefore(frame, figure.firstChild);
    }
    frame.classList.add("aporia-media-frame");
    return frame;
}

function positionMediaAnnotations(root = editor) {
    const figures = root.matches?.("figure") ? [root, ...root.querySelectorAll("figure")] : root.querySelectorAll("figure");
    figures.forEach(figure => {
        const frame = ensureMediaFrame(figure);
        frame.querySelectorAll(".aporia-media-note").forEach(note => {
            const x = Math.max(0, Math.min(100, Number(note.dataset.aporiaX) || 50));
            const y = Math.max(0, Math.min(100, Number(note.dataset.aporiaY) || 50));
            note.className = "aporia-media-note";
            note.style.left = x + "%";
            note.style.top = y + "%";
        });
    });
}

function placeFreeElement(element, clientX, clientY, center = false) {
    const rect = editor.getBoundingClientRect();
    const width = Math.max(1, element.getBoundingClientRect().width || element.offsetWidth || 240);
    const height = Math.max(1, element.getBoundingClientRect().height || element.offsetHeight || 40);
    const contentWidth = Math.max(1, editor.clientWidth);
    const widthPercent = width / contentWidth * 100;
    const left = Math.max(0, Math.min(100 - widthPercent, ((clientX - rect.left + editor.scrollLeft - (center ? width / 2 : 0)) / contentWidth) * 100));
    const top = Math.max(0, clientY - rect.top + editor.scrollTop - (center ? height / 2 : 0));
    element.dataset.aporiaFree = "true";
    element.dataset.aporiaLayoutX = left.toFixed(2);
    element.dataset.aporiaLayoutY = top.toFixed(1);
    element.style.position = "absolute";
    element.style.left = left + "%";
    element.style.top = top + "px";
    element.style.margin = "0";
    if (element.parentElement !== editor) editor.append(element);
    positionFreeElements(editor);
}

function positionFreeElements(root = editor) {
    const nodes = root.querySelectorAll(':scope > [data-aporia-free="true"]');
    let bottom = 0;
    nodes.forEach(element => {
        if (element.classList.contains("aporia-free-text") && !element.querySelector(":scope > .aporia-free-text-grip")) {
            const grip = document.createElement("span");
            grip.className = "aporia-free-text-grip";
            grip.contentEditable = "false";
            grip.textContent = "⠿ Verschieben";
            grip.setAttribute("aria-label", "Textfeld verschieben");
            element.prepend(grip);
        }
        const x = Math.max(0, Math.min(100, Number(element.dataset.aporiaLayoutX) || 0));
        const y = Math.max(0, Number(element.dataset.aporiaLayoutY) || 0);
        element.style.position = "absolute";
        element.style.left = x + "%";
        element.style.top = y + "px";
        element.style.margin = "0";
        if (element.dataset.aporiaLayoutW) element.style.width = Math.max(5, Math.min(100, Number(element.dataset.aporiaLayoutW))) + "%";
        bottom = Math.max(bottom, y + Math.max(40, element.offsetHeight));
    });
    editor.style.minHeight = nodes.length ? Math.max(640, bottom + 48) + "px" : "";
}

function createFreeTextBox(markup, clientX, clientY) {
    const box = document.createElement("div");
    box.className = "aporia-free-text";
    box.contentEditable = "true";
    box.innerHTML = sanitizeHtml(markup || "<br>");
    placeFreeElement(box, clientX, clientY, false);
    box.focus();
    const range = document.createRange();
    range.selectNodeContents(box);
    range.collapse(false);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    return box;
}


const mediaControls = document.createElement("div");
mediaControls.className = "story-media-controls";
mediaControls.hidden = true;
mediaControls.innerHTML = "";
for (const direction of ["nw", "n", "ne", "e", "se", "s", "sw", "w"]) {
    const handle = document.createElement("span");
    handle.className = "story-media-resize-handle handle-" + direction;
    handle.dataset.resize = direction;
    handle.setAttribute("aria-label", "Medium skalieren");
    mediaControls.append(handle);
}
document.body.append(mediaControls);

let selectedMedia = null;
let mediaGesture = null;
let editorDragSelection = null;
let suppressMediaClickUntil = 0;

let canvasGesture = null;
let selectedObjects = [];

const selectionMarquee = document.createElement("div");
selectionMarquee.className = "story-selection-marquee";
selectionMarquee.hidden = true;
document.body.append(selectionMarquee);

const groupMoveHandle = document.createElement("button");
groupMoveHandle.type = "button";
groupMoveHandle.className = "story-group-move-handle";
groupMoveHandle.textContent = "⠿ Verschieben";
groupMoveHandle.hidden = true;
groupMoveHandle.setAttribute("aria-label", "Ausgewählte Elemente gemeinsam verschieben");
document.body.append(groupMoveHandle);

function setSelectedObjects(objects) {
    selectedObjects.forEach(object => object.classList.remove("is-editor-selected"));
    selectedObjects = [...new Set(objects)].filter(object => editor.contains(object));
    selectedObjects.forEach(object => object.classList.add("is-editor-selected"));
    updateSelectionHandle();
}

function updateSelectionHandle() {
    const current = selectedObjects.filter(object => editor.contains(object));
    if (!current.length) { groupMoveHandle.hidden = true; return; }
    const bounds = current.map(object => object.getBoundingClientRect());
    const left = Math.min(...bounds.map(rect => rect.left));
    const top = Math.min(...bounds.map(rect => rect.top));
    groupMoveHandle.style.left = Math.max(8, left) + "px";
    groupMoveHandle.style.top = Math.max(8, top - 38) + "px";
    groupMoveHandle.hidden = false;
}

groupMoveHandle.addEventListener("pointerdown", event => {
    if (event.button !== 0 || !selectedObjects.length) return;
    event.preventDefault();
    event.stopPropagation();
    canvasGesture = { kind: "objectCandidate", objects: [...selectedObjects], x: event.clientX, y: event.clientY, storyId: state.activeStoryId, chapterId: state.activeChapterId };
});
function ensureFreePosition(element) {
    if (element.dataset.aporiaFree === "true") return;
    const editorRect = editor.getBoundingClientRect();
    const rect = element.getBoundingClientRect();
    const editorWidth = Math.max(1, editor.clientWidth);
    const x = Math.max(0, Math.min(100, ((rect.left - editorRect.left + editor.scrollLeft) / editorWidth) * 100));
    const y = Math.max(0, rect.top - editorRect.top + editor.scrollTop);
    element.dataset.aporiaFree = "true";
    element.dataset.aporiaLayoutX = x.toFixed(2);
    element.dataset.aporiaLayoutY = y.toFixed(1);
    element.style.position = "absolute";
    element.style.left = x + "%";
    element.style.top = y + "px";
    element.style.margin = "0";
    if (element.tagName !== "FIGURE") {
        element.classList.add("aporia-free-text");
        element.dataset.aporiaLayoutW = (rect.width / editorWidth * 100).toFixed(2);
        element.style.width = element.dataset.aporiaLayoutW + "%";
    }
    editor.append(element);
}

function beginCanvasGesture(event) {
    if (event.button !== 0) return;
    const media = event.target.closest("img, video");
    const grip = event.target.closest(".aporia-free-text-grip");
    const textBox = grip?.closest(".aporia-free-text");
    const object = media?.closest("figure") || (grip ? textBox : null);
    if (object && editor.contains(object)) {
        if (media?.tagName === "VIDEO") {
            const rect = media.getBoundingClientRect();
            if (event.clientY > rect.bottom - 44) return;
        }
        const selection = window.getSelection();
        if (textBox && selection && !selection.isCollapsed && editor.contains(selection.anchorNode)) return;
        const nextSelection = selectedObjects.includes(object) ? selectedObjects : [object];
        setSelectedObjects(nextSelection);
        if (media) {
            selectedMedia = media;
            showMediaControls(media);
        }
        canvasGesture = {
            kind: "objectCandidate",
            objects: [...nextSelection],
            x: event.clientX,
            y: event.clientY,
            storyId: state.activeStoryId,
            chapterId: state.activeChapterId
        };
        return;
    }
    if (event.target === editor) {
        canvasGesture = { kind: "marqueeCandidate", x: event.clientX, y: event.clientY, storyId: state.activeStoryId, chapterId: state.activeChapterId };
    }
}

function updateMarquee(x, y) {
    const left = Math.min(canvasGesture.x, x);
    const top = Math.min(canvasGesture.y, y);
    selectionMarquee.style.left = left + "px";
    selectionMarquee.style.top = top + "px";
    selectionMarquee.style.width = Math.abs(x - canvasGesture.x) + "px";
    selectionMarquee.style.height = Math.abs(y - canvasGesture.y) + "px";
}

function moveObjectsBy(objects, dx, dy, snapshots) {
    const width = Math.max(1, editor.clientWidth);
    objects.forEach((object, index) => {
        const initial = snapshots[index];
        const objectWidth = object.getBoundingClientRect().width || object.offsetWidth || 1;
        const maxLeft = Math.max(0, 100 - objectWidth / width * 100);
        const x = Math.max(0, Math.min(maxLeft, initial.x + dx / width * 100));
        const y = Math.max(0, initial.y + dy);
        object.dataset.aporiaLayoutX = x.toFixed(2);
        object.dataset.aporiaLayoutY = y.toFixed(1);
        object.style.left = x + "%";
        object.style.top = y + "px";
    });
    positionFreeElements(editor);
    if (selectedMedia && objects.some(object => object.contains(selectedMedia))) showMediaControls(selectedMedia);
    updateSelectionHandle();
}

function moveSelectedObjectsToTrash(objects) {
    const storyId = state.activeStoryId;
    const chapterId = state.activeChapterId;
    for (const object of objects) {
        if (!editor.contains(object)) continue;
        const isMedia = object.tagName === "FIGURE";
        const html = object.outerHTML;
        const title = isMedia
            ? (object.querySelector("img")?.alt || (object.querySelector("video") ? "Video" : "Bild"))
            : (object.textContent.trim().replace(/\s+/g, " ").slice(0, 90) || "Textfeld");
        state.trash.push({
            id: createId(),
            type: isMedia ? "media" : "text",
            title,
            deletedAt: new Date().toISOString(),
            storyId,
            chapterId,
            data: isMedia ? { html } : { html, text: object.textContent, freeElement: true }
        });
        object.remove();
    }
    setSelectedObjects([]);
    hideMediaControls();
    renderTrash();
    saveEditorContent();
}


function hideMediaControls() {
    mediaControls.hidden = true;
    selectedMedia = null;
}

function showMediaControls(media) {
    if (!media || !editor.contains(media)) {
        hideMediaControls();
        return;
    }
    selectedMedia = media;
    const rect = media.getBoundingClientRect();
    mediaControls.style.left = rect.left + "px";
    mediaControls.style.top = rect.top + "px";
    mediaControls.style.width = rect.width + "px";
    mediaControls.style.height = rect.height + "px";
    mediaControls.hidden = false;
}

function createMediaNote(media, clientX, clientY) {
    const figure = media.closest("figure");
    if (!figure) return;
    const frame = ensureMediaFrame(figure);
    const rect = media.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
    const note = document.createElement("span");
    note.className = "aporia-media-note";
    note.contentEditable = "true";
    note.dataset.aporiaX = x.toFixed(2);
    note.dataset.aporiaY = y.toFixed(2);
    note.textContent = "Text eingeben";
    frame.append(note);
    positionMediaAnnotations(figure);
    note.focus();
    const range = document.createRange();
    range.selectNodeContents(note);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    note.addEventListener("blur", () => {
        if (!note.textContent.trim() || note.textContent === "Text eingeben") note.remove();
        saveEditorContent();
        showMediaControls(media);
    }, { once: true });
    saveEditorContent();
}

function startResize(event, handle) {
    if (!selectedMedia) return;
    event.preventDefault();
    event.stopPropagation();
    const figure = selectedMedia.closest("figure");
    if (figure) {
        ensureFreePosition(figure);
        positionFreeElements(editor);
    }
    const rect = selectedMedia.getBoundingClientRect();
    const figureRect = figure?.getBoundingClientRect() ?? rect;
    const editorRect = editor.getBoundingClientRect();
    mediaGesture = {
        kind: "resize",
        media: selectedMedia,
        figure,
        handle,
        x: event.clientX,
        y: event.clientY,
        width: rect.width,
        height: rect.height,
        ratio: rect.width / Math.max(rect.height, 1),
        mediaOffsetX: rect.left - figureRect.left,
        mediaOffsetY: rect.top - figureRect.top,
        mediaLeft: rect.left,
        mediaTop: rect.top,
        mediaRight: rect.right,
        mediaBottom: rect.bottom,
        editorLeft: editorRect.left,
        editorTop: editorRect.top,
        editorWidth: Math.max(1, editor.clientWidth),
        scrollLeft: editor.scrollLeft,
        scrollTop: editor.scrollTop,
        figureTop: figureRect.top
    };
}

mediaControls.querySelectorAll("[data-resize]").forEach(handle => {
    handle.addEventListener("pointerdown", event => startResize(event, handle.dataset.resize));
});
window.addEventListener("pointermove", event => {
    if (mediaGesture?.kind === "resize") {
        event.preventDefault();
        const direction = mediaGesture.handle;
        const dx = event.clientX - mediaGesture.x;
        const dy = event.clientY - mediaGesture.y;
        const horizontal = direction.includes("e") ? 1 : direction.includes("w") ? -1 : 0;
        const vertical = direction.includes("s") ? 1 : direction.includes("n") ? -1 : 0;
        let width = mediaGesture.width;
        let height = mediaGesture.height;
        if (horizontal && vertical) {
            const candidateWidth = mediaGesture.width + horizontal * dx;
            const candidateHeight = mediaGesture.height + vertical * dy;
            if (Math.abs(candidateWidth - mediaGesture.width) >= Math.abs(candidateHeight - mediaGesture.height) * mediaGesture.ratio) {
                width = candidateWidth;
                height = width / mediaGesture.ratio;
            } else {
                height = candidateHeight;
                width = height * mediaGesture.ratio;
            }
        } else if (horizontal) {
            width = mediaGesture.width + horizontal * dx;
            height = width / mediaGesture.ratio;
        } else {
            height = mediaGesture.height + vertical * dy;
            width = height * mediaGesture.ratio;
        }
        width = Math.max(80, Math.min(1600, width));
        mediaGesture.media.setAttribute("width", String(Math.round(width)));
        mediaGesture.media.removeAttribute("height");
        const resizedRect = mediaGesture.media.getBoundingClientRect();
        const left = horizontal < 0
            ? mediaGesture.mediaRight - resizedRect.width
            : mediaGesture.mediaLeft;
        const top = vertical < 0
            ? mediaGesture.mediaBottom - resizedRect.height
            : mediaGesture.mediaTop;
        if (mediaGesture.figure) {
            const figureLeft = left - mediaGesture.mediaOffsetX;
            const figureTop = top - mediaGesture.mediaOffsetY;
            const x = Math.max(0, ((figureLeft - mediaGesture.editorLeft + mediaGesture.scrollLeft) / mediaGesture.editorWidth) * 100);
            const y = Math.max(0, figureTop - mediaGesture.editorTop + mediaGesture.scrollTop);
            mediaGesture.figure.dataset.aporiaLayoutX = x.toFixed(2);
            mediaGesture.figure.dataset.aporiaLayoutY = y.toFixed(1);
            mediaGesture.figure.style.left = x + "%";
            mediaGesture.figure.style.top = y + "px";
        }
        positionMediaAnnotations(mediaGesture.media.closest("figure"));
        showMediaControls(mediaGesture.media);
    }

    if (!canvasGesture) return;
    const distance = Math.hypot(event.clientX - canvasGesture.x, event.clientY - canvasGesture.y);
    if (canvasGesture.kind === "marqueeCandidate" && distance >= 5) {
        canvasGesture.kind = "marquee";
        selectionMarquee.hidden = false;
        editor.classList.add("is-selecting-objects");
    }
    if (canvasGesture.kind === "marquee") {
        event.preventDefault();
        updateMarquee(event.clientX, event.clientY);
        return;
    }
    if (canvasGesture.kind === "objectCandidate" && distance >= 5) {
        if (canvasGesture.storyId !== state.activeStoryId || canvasGesture.chapterId !== state.activeChapterId) return;
        canvasGesture.kind = "objectMove";
        canvasGesture.objects.forEach(object => {
            ensureFreePosition(object);
            object.classList.add("is-object-dragging");
        });
        canvasGesture.snapshots = canvasGesture.objects.map(object => ({
            x: Number(object.dataset.aporiaLayoutX) || 0,
            y: Number(object.dataset.aporiaLayoutY) || 0
        }));
        document.body.classList.add("story-canvas-dragging");
        groupMoveHandle.classList.add("is-dragging");
        window.getSelection()?.removeAllRanges();
        suppressMediaClickUntil = performance.now() + 600;
    }
    if (canvasGesture.kind === "objectMove") {
        event.preventDefault();
        moveObjectsBy(canvasGesture.objects, event.clientX - canvasGesture.x, event.clientY - canvasGesture.y, canvasGesture.snapshots);
    }
});

window.addEventListener("pointerup", event => {
    if (mediaGesture?.kind === "resize") {
        const gesture = mediaGesture;
        mediaGesture = null;
        saveEditorContent();
        showMediaControls(gesture.media);
    } else if (mediaGesture) {
        mediaGesture = null;
    }

    if (!canvasGesture) return;
    const gesture = canvasGesture;
    canvasGesture?.objects?.forEach(object => object.classList.remove("is-object-dragging"));
    canvasGesture = null;
    editor.classList.remove("is-selecting-objects");
    document.body.classList.remove("story-canvas-dragging");
    groupMoveHandle.classList.remove("is-dragging");
    if (gesture.kind === "marquee") {
        selectionMarquee.hidden = true;
        const rect = {
            left: Math.min(gesture.x, event.clientX),
            right: Math.max(gesture.x, event.clientX),
            top: Math.min(gesture.y, event.clientY),
            bottom: Math.max(gesture.y, event.clientY)
        };
        const objects = [...editor.querySelectorAll("figure, .aporia-free-text, p, h1, h2, h3, h4, h5, h6, blockquote, li")].filter(object => {
            if (object.tagName !== "FIGURE" && (object.closest("figure") || (object.closest(".aporia-free-text") && object !== object.closest(".aporia-free-text")))) return false;
            if (object.tagName !== "FIGURE" && !object.textContent.trim()) return false;
            const bounds = object.getBoundingClientRect();
            return bounds.right >= rect.left && bounds.left <= rect.right && bounds.bottom >= rect.top && bounds.top <= rect.bottom;
        });
        objects.filter(object => object.tagName !== "FIGURE").forEach(ensureFreePosition);
        positionFreeElements(editor);
        setSelectedObjects(objects);
        suppressMediaClickUntil = performance.now() + 450;
    } else if (gesture.kind === "objectMove") {
        suppressMediaClickUntil = performance.now() + 450;
        const target = document.elementFromPoint(event.clientX, event.clientY);
        gesture.objects.forEach(object => object.classList.remove("is-object-dragging"));
        if (target?.closest(".trash-section")) moveSelectedObjectsToTrash(gesture.objects);
        else {
            saveEditorContent();
            const media = gesture.objects.find(object => object.tagName === "FIGURE")?.querySelector("img, video");
            if (media) showMediaControls(media);
        }
    }
    selectionMarquee.hidden = true;
    updateSelectionHandle();
});

window.addEventListener("pointercancel", () => {
    mediaGesture = null;
    if (canvasGesture?.kind === "marquee") selectionMarquee.hidden = true;
    canvasGesture = null;
    editor.classList.remove("is-selecting-objects");
    document.body.classList.remove("story-canvas-dragging");
    groupMoveHandle.classList.remove("is-dragging");
    if (selectedMedia) showMediaControls(selectedMedia);
});
window.addEventListener("resize", () => selectedMedia && showMediaControls(selectedMedia));
window.addEventListener("scroll", () => selectedMedia && showMediaControls(selectedMedia), true);


function clearAssetSelection(message = "Noch kein Medium ausgewählt.") {
    selectedAsset = null;
    pendingMedia = [];
    elements.mediaSelectionPath.textContent = message;
    elements.mediaPathCopy.disabled = true;
    elements.mediaInsert.disabled = true;
    elements.mediaPreview.replaceChildren(document.createTextNode(message));
    delete elements.mediaInsert.dataset.mediaKey;
}

async function loadAssetCatalog() {
    if (assetCatalog) return assetCatalog;
    elements.mediaRoot.replaceChildren(new Option("Asset-Ordner werden geladen …", ""));
    try {
        assetCatalog = await getAporiaAssetCatalog();
        elements.mediaRoot.replaceChildren(new Option("Asset-Ordner auswählen", ""));
        Object.keys(assetCatalog.roots).forEach(name => elements.mediaRoot.add(new Option(name, name)));
        return assetCatalog;
    } catch (error) {
        elements.mediaRoot.replaceChildren(new Option("Asset-Katalog nicht verfügbar", ""));
        clearAssetSelection("Der lokale Asset-Katalog konnte nicht geladen werden.");
        console.warn("StoryEditor Asset-Katalog konnte nicht geladen werden.", error);
        return null;
    }
}

function renderAssetFolder(node, path, parent) {
    const level = document.createElement("section");
    level.className = "media-folder-level";
    const folderNames = Object.keys(node.children || {});
    let folderSelect = null;
    let fileSelect = null;
    if (folderNames.length) {
        const folderLabel = document.createElement("label");
        folderLabel.className = "field-label";
        folderLabel.textContent = "Unterordner";
        folderSelect = document.createElement("select");
        folderSelect.className = "media-picker-select";
        folderSelect.append(new Option("Unterordner auswählen", ""));
        folderNames.forEach(name => folderSelect.add(new Option(name, name)));
        folderSelect.addEventListener("change", () => {
            level.querySelectorAll(":scope > .media-folder-level").forEach(child => child.remove());
            if (fileSelect) fileSelect.value = "";
            clearAssetSelection("Wähle eine Datei aus dem ausgewählten Ordner.");
            if (!folderSelect.value) return;
            renderAssetFolder(node.children[folderSelect.value], [...path, folderSelect.value], level);
        });
        level.append(folderLabel, folderSelect);
    }

    if (node.files?.length) {
        const fileLabel = document.createElement("label");
        fileLabel.className = "field-label";
        fileLabel.textContent = folderNames.length ? "Dateien in diesem Ordner" : "Datei auswählen";
        fileSelect = document.createElement("select");
        fileSelect.className = "media-picker-select";
        fileSelect.append(new Option("Datei auswählen", ""));
        node.files.forEach((file, index) => fileSelect.add(new Option(file.name, String(index))));
        fileSelect.addEventListener("change", () => {
            const file = node.files[Number(fileSelect.value)];
            if (!file) {
                clearAssetSelection();
                return;
            }
            level.querySelectorAll(":scope > .media-folder-level").forEach(child => child.remove());
            if (folderSelect) folderSelect.value = "";
            const segments = [...path, file.name];
            const key = segments.join(".");
            selectedAsset = { ...file, key, assetPath: segments.join(" / ") };
            pendingMedia = [selectedAsset];
            elements.mediaSelectionPath.textContent = key;
            elements.mediaPathCopy.disabled = false;
            renderMediaPreview(key);
        });
        level.append(fileLabel, fileSelect);
    }
    parent.append(level);
}

function selectAssetRoot(name) {
    elements.mediaFolders.replaceChildren();
    clearAssetSelection();
    const root = assetCatalog?.roots[name];
    if (root) renderAssetFolder(root, [name], elements.mediaFolders);
}

function mediaType(media) {
    const type = String(media.type || "").toLowerCase();
    const source = String(media.url || media.src || "");
    return type.includes("video") || /\.(mp4|webm|mov)(?:$|\?)/i.test(source) ? "video" : "image";
}

function renderMediaPreview(key) {
    elements.mediaPreview.replaceChildren();
    if (!pendingMedia.length) {
        elements.mediaPreview.textContent = "Bitte wähle ein Medium aus den Asset-Ordnern.";
        elements.mediaInsert.disabled = true;
        return;
    }
    const preview = document.createElement("div");
    preview.className = "media-preview-item";
    const media = pendingMedia[0];
    const visual = document.createElement(media.type === "video" ? "video" : "img");
    visual.src = media.url;
    if (media.type === "video") visual.controls = true;
    else visual.alt = media.title || "";
    preview.append(visual);
    elements.mediaPreview.append(preview);
    elements.mediaInsert.disabled = false;
    elements.mediaInsert.dataset.mediaKey = key;
    elements.mediaInsert.dataset.mediaIndex = "0";
}

function insertMedia() {
    const key = elements.mediaInsert.dataset.mediaKey;
    const media = pendingMedia[Number(elements.mediaInsert.dataset.mediaIndex || 0)];
    if (!media?.url || !key) return;
    editor.focus();
    const selection = window.getSelection();
    if (editorSelection && selection) {
        selection.removeAllRanges();
        selection.addRange(editorSelection);
    }
    const figure = document.createElement("figure");
    figure.dataset.aporiaMediaKey = key;
    if (media.assetPath) figure.dataset.aporiaAssetPath = media.assetPath;
    const frame = document.createElement("div");
    frame.className = "aporia-media-frame";
    frame.dataset.aporiaMediaFrame = "";
    const type = mediaType(media);
    const visual = document.createElement(type === "video" ? "video" : "img");
    visual.src = media.url;
    visual.draggable = false;
    if (type === "video") visual.controls = true;
    else visual.alt = media.alt || media.title || "";
    frame.append(visual);
    figure.append(frame);
    const caption = document.createElement("figcaption");
    caption.textContent = media.title || media.alt || "";
    if (caption.textContent) figure.append(caption);
    const currentSelection = window.getSelection();
    if (currentSelection?.rangeCount && editor.contains(currentSelection.anchorNode)) {
        const range = currentSelection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(figure);
        range.setStartAfter(figure);
        range.collapse(true);
        currentSelection.removeAllRanges();
        currentSelection.addRange(range);
    } else {
        editor.append(figure);
    }
    saveEditorContent();
    selectedMedia = visual;
    showMediaControls(visual);
    elements.mediaDialog.close();
}

function addDecision() {
    const story = getStory();
    const chapter = getChapter(story);
    if (!story || !chapter) return;
    story.decisions.push({
        id: createId(),
        chapterId: chapter.id,
        prompt: "",
        choices: [{ id: createId(), text: "", nextChapterId: "" }, { id: createId(), text: "", nextChapterId: "" }]
    });
    renderDecisions();
    scheduleSave();
}

editor.addEventListener("input", saveEditorContent);
editor.addEventListener("contextmenu", event => {
    const hasEditorSelection = selectedObjects.some(object => editor.contains(object))
        || (selectedMedia && editor.contains(selectedMedia));
    if (!hasEditorSelection) return;

    event.preventDefault();
    event.stopPropagation();
    setSelectedObjects([]);
    hideMediaControls();
});
editor.addEventListener("pointerdown", beginCanvasGesture);
editor.addEventListener("click", event => {
    if (performance.now() < suppressMediaClickUntil) return;
    const media = event.target.closest("img, video");
    if (media && editor.contains(media)) {
        const rect = media.getBoundingClientRect();
        if (media.tagName === "VIDEO" && event.clientY > rect.bottom - 44) {
            showMediaControls(media);
            return;
        }
        event.preventDefault();
        showMediaControls(media);
        createMediaNote(media, event.clientX, event.clientY);
        return;
    }
    if (event.target === editor) {
        event.preventDefault();
        hideMediaControls();
        createFreeTextBox("<br>", event.clientX, event.clientY);
        return;
    }
    if (!event.target.closest(".aporia-media-note") && !mediaControls.contains(event.target)) hideMediaControls();
});
editor.addEventListener("dragover", event => {
    if (!editorDragSelection) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
});
editor.addEventListener("drop", event => {
    const dragged = editorDragSelection;
    if (!dragged) return;
    event.preventDefault();
    editorDragSelection = null;
    editor.classList.remove("is-dragging-text");
    if (dragged.storyId !== state.activeStoryId || dragged.chapterId !== state.activeChapterId || !editor.contains(dragged.range.commonAncestorContainer)) return;
    deleteDraggedSelection(dragged.range);
    createFreeTextBox(dragged.html || escapeHtml(dragged.text), event.clientX, event.clientY);
    saveEditorContent();
});
editor.addEventListener("dragstart", event => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !editor.contains(selection.anchorNode) || !editor.contains(selection.focusNode)) return;
    const range = selection.getRangeAt(0).cloneRange();
    const fragment = range.cloneContents();
    const holder = document.createElement("div");
    holder.append(fragment.cloneNode(true));
    const text = selection.toString();
    if (!text.trim()) return;
    editorDragSelection = { range, text, html: holder.innerHTML, storyId: state.activeStoryId, chapterId: state.activeChapterId };
    event.dataTransfer.setData("text/plain", text);
    event.dataTransfer.effectAllowed = "move";
    editor.classList.add("is-dragging-text");
});
editor.addEventListener("dragend", () => { editor.classList.remove("is-dragging-text"); editorDragSelection = null; trashSection.classList.remove("is-drop-target"); });
const trashSection = elements.trashDropzone.closest(".trash-section");
trashSection.addEventListener("dragover", event => {
    if (!editorDragSelection) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    trashSection.classList.add("is-drop-target");
});
trashSection.addEventListener("dragleave", event => {
    if (!trashSection.contains(event.relatedTarget)) trashSection.classList.remove("is-drop-target");
});
trashSection.addEventListener("drop", event => {
    event.preventDefault();
    trashSection.classList.remove("is-drop-target");
    const dragged = editorDragSelection;
    editorDragSelection = null;
    editor.classList.remove("is-dragging-text");
    if (!dragged || dragged.storyId !== state.activeStoryId || dragged.chapterId !== state.activeChapterId || !editor.contains(dragged.range.commonAncestorContainer)) return;
    dragged.range.deleteContents();
    sendEditorContentToTrash("text", dragged.text.replace(/\s+/g, " ").slice(0, 90), { text: dragged.text, html: dragged.html }, dragged.storyId, dragged.chapterId);
});
editor.addEventListener("mouseup", captureEditorSelection);
editor.addEventListener("keyup", captureEditorSelection);
elements.storyTitle.addEventListener("input", () => {
    const story = getStory();
    if (!story) return;
    story.title = elements.storyTitle.value;
    renderStoryList();
    scheduleSave();
});
elements.chapterTitle.addEventListener("input", () => {
    const chapter = getChapter();
    if (!chapter) return;
    chapter.title = elements.chapterTitle.value;
    renderChapterList();
    renderDecisions();
    scheduleSave();
});
document.querySelector("#story-new").addEventListener("click", addNewStory);
document.querySelector("#chapter-new").addEventListener("click", addNewChapter);
document.querySelector("#chapter-up").addEventListener("click", () => moveChapter(-1));
document.querySelector("#chapter-down").addEventListener("click", () => moveChapter(1));
document.querySelector("#chapter-delete").addEventListener("click", () => {
    const story = getStory();
    const chapter = getChapter(story);
    if (story && chapter && confirm("Dieses Kapitel in den Papierkorb verschieben?")) moveToTrash("chapter", chapter, chapter.title, story.id);
});
elements.trashClear.addEventListener("click", () => {
    if (!state.trash.length || !confirm(`Möchtest du wirklich alle ${state.trash.length} Einträge dauerhaft aus dem Papierkorb löschen?`)) return;
    state.trash = [];
    renderTrash();
    saveEditorContent();
});
document.querySelector("#decision-new").addEventListener("click", addDecision);
document.querySelector("#versions-open").addEventListener("click", openVersions);
document.querySelector("#export-json").addEventListener("click", exportJson);
document.querySelector("#export-markdown").addEventListener("click", exportMarkdown);
elements.search.addEventListener("input", () => renderSearchResults(elements.search.value));
document.querySelector("#format-block").addEventListener("change", event => {
    editor.focus();
    document.execCommand("formatBlock", false, "<" + event.target.value.toLowerCase() + ">");
    saveEditorContent();
});
document.querySelectorAll("[data-command]").forEach(button => {
    button.addEventListener("mousedown", event => event.preventDefault());
    button.addEventListener("click", () => {
        editor.focus();
        document.execCommand(button.dataset.command, false, button.dataset.value || null);
        saveEditorContent();
    });
});
document.querySelector("#undo").addEventListener("mousedown", event => event.preventDefault());
document.querySelector("#redo").addEventListener("mousedown", event => event.preventDefault());
document.querySelector("#undo").addEventListener("click", () => { editor.focus(); document.execCommand("undo"); saveEditorContent(); });
document.querySelector("#redo").addEventListener("click", () => { editor.focus(); document.execCommand("redo"); saveEditorContent(); });
document.querySelector("#media-open").addEventListener("mousedown", event => { captureEditorSelection(); event.preventDefault(); });
document.querySelector("#media-open").addEventListener("click", async () => {
    elements.mediaDialog.showModal();
    await loadAssetCatalog();
    elements.mediaRoot.focus();
});
elements.mediaRoot.addEventListener("change", () => selectAssetRoot(elements.mediaRoot.value));
elements.mediaPathCopy.addEventListener("click", async () => {
    if (!selectedAsset?.key) return;
    try {
        await navigator.clipboard.writeText(selectedAsset.key);
        elements.mediaPathCopy.textContent = "Kopiert";
        setTimeout(() => { elements.mediaPathCopy.textContent = "Pfad kopieren"; }, 1200);
    } catch {
        elements.mediaSelectionPath.focus?.();
    }
});
elements.mediaInsert.addEventListener("click", insertMedia);
document.querySelector("#media-cancel").addEventListener("click", () => elements.mediaDialog.close());
elements.importFile.addEventListener("change", async () => {
    const file = elements.importFile.files[0];
    if (!file) return;
    try { await importFile(file); }
    catch (error) { alert("Import fehlgeschlagen: " + error.message); }
    elements.importFile.value = "";
});

renderAll();
