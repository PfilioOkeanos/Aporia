// APORIA – Rohstoff-Fenster
// Öffnet zu einer Rohstoff-Card ein Detailfenster mit Kennwerten, realen Angaben (PubChem/Wikipedia),
// Platzhaltern für Vorkommen und Herstellung in Aporia, Forschungslinks und Link zum Dossier.
import { resourceDetails } from "./rohstoff-details.js";

const DATEN_URL = new URL("./daten/rohstoffe.json", import.meta.url);
let datenPromise = null;
const ladeDaten = () => (datenPromise ??= fetch(DATEN_URL).then((r) => (r.ok ? r.json() : {})).catch(() => ({})));

const OFFEN = "Noch nicht ausgearbeitet";
const el = (tag, attrs = {}, ...kinder) => {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
        if (k === "class") e.className = v;
        else if (k === "text") e.textContent = v;
        else if (k === "style") e.style.cssText = v;
        else if (v !== false && v != null) e.setAttribute(k, v === true ? "" : v);
    }
    e.append(...kinder.filter((x) => x != null && x !== false));
    return e;
};
const absatz = (text, offen = OFFEN) => el("p", { class: text ? "" : "rf-offen", text: text || offen });

let dialog = null, liste = [], index = 0, beimSchliessen = null;

function baueDialog() {
    dialog = el("dialog", { class: "rf-fenster", "aria-labelledby": "rf-titel" });
    dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener("close", () => beimSchliessen?.());
    dialog.addEventListener("keydown", (e) => {
        if (e.target.closest("input, textarea")) return;
        if (e.key === "ArrowRight" && !e.target.closest("[role=tab]")) { e.preventDefault(); blaettern(1); }
        if (e.key === "ArrowLeft" && !e.target.closest("[role=tab]")) { e.preventDefault(); blaettern(-1); }
    });
    document.body.append(dialog);
}

function blaettern(richtung) {
    if (!liste.length) return;
    index = (index + richtung + liste.length) % liste.length;
    zeige(liste[index]);
}

/** Herstellungskette als kleines Diagramm (Platzhalter mit Spiel- und Realbezug). */
function kette(schritte) {
    return el("ol", { class: "rf-kette", "aria-label": "Herstellungskette" }, ...schritte.map((s, i) =>
        el("li", { style: `--i:${i}` }, el("span", { class: "rf-kette-punkt", "aria-hidden": "true", text: String(i + 1) }), el("strong", { text: s.titel }), el("span", { text: s.text }))));
}
/** Platzhalter-Karte für Fundorte in Aporia. */
function fundortKarte() {
    const svg = `<svg viewBox="0 0 320 150" aria-hidden="true"><defs><radialGradient id="rf-pl" cx="35%" cy="35%"><stop offset="0" stop-color="var(--rf-farbe)" stop-opacity=".55"/><stop offset="1" stop-color="var(--rf-farbe)" stop-opacity=".05"/></radialGradient></defs>
        <ellipse class="rf-orbit" cx="160" cy="75" rx="140" ry="52"/><ellipse class="rf-orbit" cx="160" cy="75" rx="88" ry="32"/>
        <circle cx="160" cy="75" r="14" fill="url(#rf-pl)" stroke="var(--rf-farbe)"/>
        <g class="rf-fundort"><circle cx="248" cy="58" r="9" fill="url(#rf-pl)" stroke="var(--rf-farbe)" stroke-dasharray="3 3"/><text x="248" y="40">?</text></g>
        <g class="rf-fundort"><circle cx="76" cy="98" r="7" fill="url(#rf-pl)" stroke="var(--rf-farbe)" stroke-dasharray="3 3"/><text x="76" y="122">?</text></g>
        <g class="rf-fundort"><circle cx="198" cy="118" r="5" fill="url(#rf-pl)" stroke="var(--rf-farbe)" stroke-dasharray="3 3"/><text x="198" y="140">?</text></g></svg>`;
    const box = el("div", { class: "rf-karte" });
    box.innerHTML = svg;
    box.append(el("ul", { class: "rf-platzhalter" },
        el("li", {}, el("span", { class: "rf-label", text: "Planeten / Monde" }), el("span", { text: "Fundort offen" })),
        el("li", {}, el("span", { class: "rf-label", text: "Biome / Tiefe" }), el("span", { text: "Fundort offen" })),
        el("li", {}, el("span", { class: "rf-label", text: "Scansignatur" }), el("span", { text: "Offen" })),
        el("li", {}, el("span", { class: "rf-label", text: "Häufigkeit" }), el("span", { text: "Offen" }))));
    return box;
}

function tab(id, titel, inhalt) { return { id, titel, inhalt }; }

async function zeige(item) {
    const daten = await ladeDaten();
    const d = daten[item.schluessel] ?? {};
    const spiel = resourceDetails(item.group, item) ?? {};
    const farbe = d.farbe ?? (item.group === "raumfahrt" ? "#ffbe68" : "#8fd8ff");
    dialog.style.setProperty("--rf-farbe", farbe);
    dialog.dataset.gruppe = item.group;
    const t = d.texte ?? {};
    const name = d.name ?? item.name ?? item.title;

    // Kopf: Symbolkachel im Periodensystem-Stil bzw. Materialkachel
    const kachel = el("div", { class: "rf-kachel", "aria-hidden": "true" },
        el("span", { class: "rf-kachel-nr", text: d.ordnungszahl ?? (item.group === "raumfahrt" ? "R" : "") }),
        el("span", { class: "rf-kachel-symbol", text: d.symbol ?? name.slice(0, 2) }),
        el("span", { class: "rf-kachel-masse", text: d.werte?.Atommasse ?? d.kategorie ?? "" }));
    const kopf = el("header", { class: "rf-kopf" }, kachel,
        el("div", { class: "rf-kopf-text" },
            el("p", { class: "rf-label", text: item.groupLabel ?? "Rohstoff" }),
            el("h2", { id: "rf-titel", text: name }),
            el("div", { class: "rf-chips" },
                el("span", { class: "rf-chip", text: d.kategorie ?? item.kind ?? "Rohstoff" }),
                d.werte?.["Zustand (Standard)"] ? el("span", { class: "rf-chip", text: d.werte["Zustand (Standard)"] }) : null,
                d.fiktiv ? el("span", { class: "rf-chip rf-chip--fiktiv", text: "Fiktives Spielmaterial" }) : null)),
        el("div", { class: "rf-kopf-knoepfe" },
            el("button", { type: "button", class: "rf-knopf", "aria-label": "Vorheriger Rohstoff", "data-blaettern": "-1", text: "‹" }),
            el("button", { type: "button", class: "rf-knopf", "aria-label": "Nächster Rohstoff", "data-blaettern": "1", text: "›" }),
            el("button", { type: "button", class: "rf-knopf rf-schliessen", "aria-label": "Fenster schließen", text: "✕" })));

    const werte = el("dl", { class: "rf-werte" }, ...Object.entries(d.werte ?? {}).map(([k, v]) =>
        el("div", {}, el("dt", { text: k }), el("dd", { class: v ? "" : "rf-offen", text: v ?? OFFEN }))));

    const tabs = [
        tab("uebersicht", "Übersicht", [
            el("h3", { text: "Beschreibung" }), absatz(t.kurz, d.fiktiv ? `${name} ist ein fiktives Material der Spielwelt. ${spiel.eigenschaften ?? ""}` : OFFEN),
            el("h3", { text: "Kennwerte" }), werte,
        ]),
        tab("vorkommen", "Vorkommen", [
            el("h3", { text: "Fundorte in Aporia" }), fundortKarte(),
            el("p", { class: "rf-hinweis", text: spiel.vorkommen ?? "Bestätigte Fundorte in Aporia sind offen." }),
            el("h3", { text: d.fiktiv ? "Reale Grundlage" : "Vorkommen in der Realität" }), absatz(t.vorkommen),
        ]),
        tab("herstellung", "Herstellung", [
            el("h3", { text: "Herstellungskette in Aporia" }),
            kette([
                { titel: "Fund", text: d.herkunft ?? "Fundort offen" },
                { titel: "Gewinnung", text: spiel.gewinnung ?? "Verfahren offen" },
                { titel: "Aufbereitung", text: "Anlage und Rezept offen" },
                { titel: "Produkt", text: d.anwendung ?? spiel.nutzung ?? "Verwendung offen" },
            ]),
            el("h3", { text: "Gewinnung und Herstellung in der Realität" }), absatz(t.gewinnung),
        ]),
        tab("verwendung", "Verwendung", [
            el("h3", { text: "Verwendung in Aporia" }), absatz(spiel.nutzung),
            el("h3", { text: "Verwendung in der Realität" }), absatz(t.verwendung),
        ]),
        tab("sicherheit", "Sicherheit & Handel", [
            el("h3", { text: "Gefahren und Schutz" }), absatz(spiel.gefahren), t.sicherheit ? absatz(t.sicherheit) : null,
            el("h3", { text: "Transport und Lagerung" }), absatz(spiel.lagerung),
            el("h3", { text: "Handel" }), absatz(spiel.handel),
        ]),
    ];
    const tablist = el("div", { class: "rf-tabs", role: "tablist", "aria-label": "Rohstoffinformationen" });
    const panels = el("div", { class: "rf-panels" });
    tabs.forEach((tb, i) => {
        const knopf = el("button", { type: "button", role: "tab", id: `rf-tab-${tb.id}`, "aria-controls": `rf-panel-${tb.id}`, "aria-selected": String(i === 0), tabindex: i ? "-1" : "0", text: tb.titel });
        const panel = el("section", { class: "rf-panel", role: "tabpanel", id: `rf-panel-${tb.id}`, "aria-labelledby": `rf-tab-${tb.id}`, hidden: i !== 0 }, ...tb.inhalt);
        tablist.append(knopf); panels.append(panel);
    });
    const waehleTab = (knopf) => {
        for (const k of tablist.children) { const an = k === knopf; k.setAttribute("aria-selected", String(an)); k.tabIndex = an ? 0 : -1; panels.querySelector(`#${k.getAttribute("aria-controls")}`).hidden = !an; }
        knopf.focus();
    };
    tablist.addEventListener("click", (e) => { const k = e.target.closest("[role=tab]"); if (k) waehleTab(k); });
    tablist.addEventListener("keydown", (e) => {
        const k = [...tablist.children], i = k.indexOf(document.activeElement);
        if (i < 0 || !["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) return;
        e.preventDefault();
        waehleTab(k[e.key === "Home" ? 0 : e.key === "End" ? k.length - 1 : (i + (e.key === "ArrowRight" ? 1 : -1) + k.length) % k.length]);
    });

    const bild = el("figure", { class: "rf-bild" },
        el("img", { src: item.url, alt: item.title ?? name, decoding: "async" }),
        el("figcaption", {}, el("span", { text: item.title ?? "" }), el("a", { href: item.url, target: "_blank", rel: "noopener", text: "Originalgröße ↗" })));
    const fuss = el("footer", { class: "rf-fuss" },
        el("div", { class: "rf-links" },
            el("span", { class: "rf-label", text: "Forschung" }),
            ...(d.forschung ?? []).map((f) => el("a", { class: "rf-link", href: f.href, text: f.name + " →" })),
            item.dossier ? el("a", { class: "rf-link rf-link--dossier", href: item.dossier, text: "Vollständiges Dossier öffnen" }) : null),
        el("p", { class: "rf-quelle" },
            d.texte?.quelle ? el("span", {}, "Texte: Auszüge aus Wikipedia, ", el("a", { href: d.texte.quelle.url, target: "_blank", rel: "noopener", text: `„${d.texte.quelle.titel}“` }), " (CC BY-SA 4.0)") : null,
            item.group === "elemente" ? el("span", {}, " · Kennwerte: ", el("a", { href: "https://pubchem.ncbi.nlm.nih.gov/periodic-table/", target: "_blank", rel: "noopener", text: "PubChem" })) : null,
            el("span", { class: "rf-zaehler", text: ` · ${index + 1} / ${liste.length}` })));

    dialog.replaceChildren(el("div", { class: "rf-rahmen" }, kopf, el("div", { class: "rf-koerper" }, bild, el("div", { class: "rf-info" }, tablist, panels)), fuss));
    dialog.querySelector(".rf-schliessen").addEventListener("click", () => dialog.close());
    for (const k of dialog.querySelectorAll("[data-blaettern]")) k.addEventListener("click", () => blaettern(Number(k.dataset.blaettern)));
    dialog.classList.remove("ist-neu"); void dialog.offsetWidth; dialog.classList.add("ist-neu");
    history.replaceState(null, "", `${location.pathname}?rohstoff=${item.schluessel}${location.hash}`);
}

/**
 * Öffnet das Fenster für einen Eintrag der Liste.
 * @param {Array} eintraege  sichtbare Rohstoffe (für Blättern), je { schluessel, group, groupLabel, id, url, title, name, dossier }
 */
export async function oeffneRohstoffFenster(eintraege, start) {
    if (!dialog) baueDialog();
    liste = eintraege;
    index = Math.max(0, eintraege.indexOf(start));
    const ausloeser = document.activeElement;
    beimSchliessen = () => { history.replaceState(null, "", location.pathname + location.hash); ausloeser?.focus?.(); };
    await zeige(liste[index]);
    if (!dialog.open) dialog.showModal();
    dialog.querySelector("[role=tab]")?.focus();
}
export { ladeDaten as ladeRohstoffDaten };
