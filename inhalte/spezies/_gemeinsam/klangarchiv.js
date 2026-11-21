// Gemeinsames Klangarchiv für Speziesseiten: ein Player, Suche, Kategorie-Chips und eine gruppierte Titelliste.
// Markup: <section data-klangarchiv="<spezies>.audio" data-kategorien='[["schluessel","Bezeichnung"], …]'></section>
// Die Titel kommen aus inhalte/medien/medien.json (Schlüssel „<spezies>.audio.<schluessel>.items“).
import { getAporiaMediaCollection } from "../../../Men%C3%BCs/adapter/aporia-media.js";

const el = (tag, klasse, text) => {
    const e = document.createElement(tag);
    if (klasse) e.className = klasse;
    if (text != null) e.textContent = text;
    return e;
};
const normal = (s) => s.toLocaleLowerCase("de").normalize("NFD").replace(/[̀-ͯ]/g, "");

async function mountKlangarchiv(wurzel) {
    const basis = wurzel.dataset.klangarchiv;
    const kategorien = JSON.parse(wurzel.dataset.kategorien || "[]");
    const status = el("p", "klang-status", "Klänge werden geladen …");
    status.setAttribute("role", "status");
    wurzel.append(status);

    const gruppen = (await Promise.all(kategorien.map(async ([schluessel, name]) => {
        try { return { schluessel, name, titel: await getAporiaMediaCollection(basis + "." + schluessel) }; }
        catch { return { schluessel, name, titel: [] }; }
    }))).filter((g) => g.titel.length);
    const alle = gruppen.flatMap((g) => g.titel.map((t) => ({ ...t, gruppe: g })));
    if (!alle.length) { status.textContent = "Noch keine Audiodateien vorhanden."; return; }
    status.remove();

    // Kopf: Suche + Zähler
    const kopf = el("div", "klang-kopf");
    const suche = el("input", "klang-suche");
    Object.assign(suche, { type: "search", placeholder: "Klang suchen, z. B. Warnruf …", autocomplete: "off" });
    suche.setAttribute("aria-label", "Klänge durchsuchen");
    const zaehler = el("output", "klang-zaehler");
    zaehler.setAttribute("aria-live", "polite");
    kopf.append(suche, zaehler);

    // Kategorie-Chips
    const chips = el("div", "klang-chips");
    chips.setAttribute("role", "group");
    chips.setAttribute("aria-label", "Kategorie wählen");
    let kategorie = "";
    const chip = (wert, text, anzahl) => {
        const b = el("button", "", null);
        b.type = "button";
        b.dataset.kategorie = wert;
        b.setAttribute("aria-pressed", String(wert === ""));
        b.append(text, el("span", "", String(anzahl)));
        b.addEventListener("click", () => { kategorie = wert; chips.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); filtern(); });
        return b;
    };
    chips.append(chip("", "Alle", alle.length), ...gruppen.map((g) => chip(g.schluessel, g.name, g.titel.length)));

    // Player
    const player = el("div", "klang-player");
    const jetzt = el("div", "klang-jetzt");
    const jetztTitel = el("strong", "", "Kein Klang ausgewählt");
    const jetztGruppe = el("span", "", "Titel in der Liste anklicken");
    jetzt.append(jetztTitel, jetztGruppe);
    const audio = el("audio");
    audio.controls = true;
    audio.preload = "none";
    audio.setAttribute("aria-label", "Klangarchiv-Player");
    const knoepfe = el("div", "klang-knoepfe");
    const zurueck = el("button", "", "‹ Zurück"), weiter = el("button", "", "Weiter ›");
    zurueck.type = weiter.type = "button";
    const auto = el("label", "klang-auto");
    const autoBox = el("input");
    autoBox.type = "checkbox";
    auto.append(autoBox, " automatisch weiter");
    knoepfe.append(zurueck, weiter, auto);
    player.append(jetzt, audio, knoepfe);

    // Liste
    const liste = el("div", "klang-liste");
    const zeilen = [];
    for (const g of gruppen) {
        const block = el("section", "klang-gruppe");
        block.id = "klang-" + g.schluessel;
        block.append(el("h3", "", g.name));
        const ol = el("ol");
        g.titel.forEach((t, i) => {
            const li = el("li");
            const b = el("button", "klang-titel");
            b.type = "button";
            b.append(el("span", "klang-nr", String(i + 1).padStart(2, "0")), el("span", "klang-name", t.title || decodeURIComponent(new URL(t.url).pathname.split("/").at(-1))));
            const eintrag = { ...t, gruppe: g, li, b, such: normal((t.title || "") + " " + g.name) };
            b.addEventListener("click", () => spielen(eintrag));
            li.append(b);
            ol.append(li);
            zeilen.push(eintrag);
        });
        block.append(ol);
        liste.append(block);
    }
    const leer = el("p", "klang-leer", "Kein Klang passt zur Suche.");
    leer.hidden = true;
    liste.append(leer);
    wurzel.append(kopf, chips, player, liste);

    let aktuell = null;
    const sichtbar = () => zeilen.filter((z) => !z.li.hidden);
    function filtern() {
        const q = normal(suche.value.trim());
        let n = 0;
        for (const z of zeilen) {
            z.li.hidden = (kategorie && z.gruppe.schluessel !== kategorie) || (q && !z.such.includes(q));
            if (!z.li.hidden) n++;
        }
        for (const block of liste.querySelectorAll(".klang-gruppe")) block.hidden = !block.querySelector("li:not([hidden])");
        leer.hidden = n > 0;
        zaehler.textContent = `${n} von ${zeilen.length} Klängen`;
    }
    async function spielen(z) {
        aktuell?.b.removeAttribute("aria-current");
        aktuell = z;
        z.b.setAttribute("aria-current", "true");
        jetztTitel.textContent = z.title;
        jetztGruppe.textContent = z.gruppe.name;
        audio.src = z.url;
        try { await audio.play(); } catch (e) { if (e.name !== "AbortError") jetztGruppe.textContent = z.gruppe.name + " · Wiedergabe nicht möglich"; }
    }
    const schritt = (r) => {
        const s = sichtbar();
        if (!s.length) return;
        const i = aktuell ? s.indexOf(aktuell) : -1;
        spielen(s[(i + r + s.length) % s.length]);
    };
    zurueck.addEventListener("click", () => schritt(-1));
    weiter.addEventListener("click", () => schritt(1));
    audio.addEventListener("ended", () => { if (autoBox.checked) schritt(1); });
    audio.addEventListener("error", () => { if (aktuell) jetztGruppe.textContent = aktuell.gruppe.name + " · Datei konnte nicht geladen werden"; });
    suche.addEventListener("input", filtern);

    // Direktsprung über #klang-<kategorie>
    const ziel = location.hash.match(/^#klang-(.+)$/);
    if (ziel) {
        chips.querySelector(`[data-kategorie="${CSS.escape(ziel[1])}"]`)?.click();
        wurzel.closest("section")?.scrollIntoView({ block: "start" });
    }
    filtern();
}

for (const wurzel of document.querySelectorAll("[data-klangarchiv]")) mountKlangarchiv(wurzel);
