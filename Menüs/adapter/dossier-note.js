function cleanMarkup(html) {
    const template = document.createElement("template");
    template.innerHTML = html;
    const allowed = new Set(["B", "STRONG", "SPAN", "FONT", "DIV", "P", "BR", "IMG"]);
    for (const node of template.content.querySelectorAll("*")) {
        if (!allowed.has(node.tagName)) {
            node.replaceWith(document.createTextNode(node.textContent));
            continue;
        }
        const src = node.getAttribute("src");
        const size = node.getAttribute("size");
        const weight = node.style.fontWeight;
        for (const attribute of [...node.attributes]) node.removeAttribute(attribute.name);
        if (node.tagName === "IMG") {
            if (!/^data:image\/(png|jpeg|webp|gif);base64,/i.test(src ?? "")) {
                node.remove();
                continue;
            }
            node.src = src;
            node.alt = "Eingefügtes Bild";
        }
        if (node.tagName === "FONT" && /^[356]$/.test(size ?? "")) node.size = size;
        if (weight === "bold" || weight === "700") node.style.fontWeight = weight;
    }
    return template.innerHTML;
}

export function createNoteEditor(storageKey, topic, original, summary, fields = []) {
    const form = document.createElement("form");
    form.className = "dossier-note";
    const input = document.createElement("div");
    input.className = "dossier-note-surface";
    input.contentEditable = "true";
    input.setAttribute("role", "textbox");
    input.setAttribute("aria-multiline", "true");
    input.setAttribute("aria-label", "Eintrag für " + topic);
    const actions = document.createElement("div");
    actions.className = "dossier-note-actions";
    const message = document.createElement("span");
    message.setAttribute("role", "status");

    const title = document.createElement("span");
    const panel = summary.parentElement;
    function updateTitleEditing() {
        title.contentEditable = panel.open ? "plaintext-only" : "false";
    }
    panel.addEventListener("toggle", updateTitleEditing);
    updateTitleEditing();
    title.setAttribute("role", "textbox");
    title.setAttribute("aria-label", "Reiterüberschrift");
    title.addEventListener("click", event => {
        if (panel.open) event.preventDefault();
    });
    title.addEventListener("keydown", event => {
        if (panel.open && event.key === "Enter") event.preventDefault();
    });
    summary.replaceChildren(title);

    const defaults = fields.map(field => field.textContent);
    for (const field of fields) {
        field.contentEditable = "plaintext-only";
        field.addEventListener("input", () => { message.textContent = "Ungespeicherte Änderungen"; });
    }
    function restore(data = {}) {
        title.textContent = data.title || topic;
        input.textContent = original;
        if (data.html !== undefined) input.innerHTML = cleanMarkup(data.html);
        if (data.legacy) input.append(document.createElement("br"), document.createTextNode(data.legacy));
        fields.forEach((field, index) => { field.textContent = data.fields?.[index] ?? defaults[index]; });
    }

    try {
        const stored = localStorage.getItem(storageKey);
        restore(stored?.startsWith("aporia-rich-v1:") ? JSON.parse(stored.slice(15)) : { legacy: stored });
    } catch {
        restore();
        message.textContent = "Gespeicherte Daten konnten nicht geladen werden.";
    }

    function button(label, handler) {
        const control = document.createElement("button");
        control.type = "button";
        control.textContent = label;
        control.addEventListener("click", handler);
        actions.append(control);
        return control;
    }
    let range;
    document.addEventListener("selectionchange", () => {
        const selection = getSelection();
        if (selection.rangeCount && input.contains(selection.getRangeAt(0).commonAncestorContainer)) {
            range = selection.getRangeAt(0).cloneRange();
        }
    });
    function format(command, value) {
        input.focus();
        const selection = getSelection();
        if (range && input.contains(range.commonAncestorContainer)) {
            selection.removeAllRanges();
            selection.addRange(range);
        }
        document.execCommand(command, false, value);
        message.textContent = "Ungespeicherte Änderungen";
    }
    for (const [label, command, value] of [
        ["Klein", "fontSize", "3"], ["Groß", "fontSize", "5"],
        ["Sehr groß", "fontSize", "6"], ["Fett", "bold", null],
    ]) {
        button(label, () => format(command, value)).addEventListener("mousedown", event => event.preventDefault());
    }
    button("Speichern", () => {
        try {
            const data = {
                title: title.textContent.trim() || topic,
                html: cleanMarkup(input.innerHTML),
                fields: fields.map(field => field.textContent),
            };
            localStorage.setItem(storageKey, "aporia-rich-v1:" + JSON.stringify(data));
            title.textContent = data.title;
            message.textContent = "Gespeichert";
        } catch {
            message.textContent = "Speichern fehlgeschlagen. Der Browserspeicher ist möglicherweise voll.";
        }
    });
    button("Löschen", () => {
        if (!confirm("Änderungen in diesem Reiter zurücksetzen?")) return;
        try {
            localStorage.removeItem(storageKey);
            restore();
            message.textContent = "Auf Archivstand zurückgesetzt.";
        } catch {
            message.textContent = "Löschen fehlgeschlagen.";
        }
    });

    input.addEventListener("paste", event => {
        event.preventDefault();
        document.execCommand("insertText", false, event.clipboardData.getData("text/plain"));
    });
    form.addEventListener("dragover", event => event.preventDefault());
    form.addEventListener("drop", event => {
        event.preventDefault();
        for (const file of event.dataTransfer.files) {
            if (!/^image\/(png|jpeg|webp|gif)$/.test(file.type) || file.size > 2 * 1024 * 1024) {
                message.textContent = "Bitte PNG, JPEG, WebP oder GIF bis 2 MB verwenden.";
                continue;
            }
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                const image = document.createElement("img");
                image.src = reader.result;
                image.alt = file.name;
                input.append(image);
                message.textContent = "Bild eingefügt. Zum Übernehmen speichern.";
            });
            reader.readAsDataURL(file);
        }
    });
    form.addEventListener("submit", event => event.preventDefault());
    input.addEventListener("input", () => { message.textContent = "Ungespeicherte Änderungen"; });
    const options = document.createElement("details");
    options.className = "dossier-note-options";
    const optionsLabel = document.createElement("summary");
    optionsLabel.textContent = "Optionen";
    options.append(optionsLabel, actions);
    message.className = "dossier-note-status";
    form.append(options, input, message);
    return form;
}
