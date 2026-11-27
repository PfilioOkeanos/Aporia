// APORIA – Forschungssystem (Adapter)
// Interaktiver Forschungsbaum für die Forschungszweige: Forschungspunkte sammeln, Knoten von
// unten nach oben freischalten, Vorteile und Gegenstände erhalten. Fortschritt bleibt im Browser.
//
// Nutzung (Seiten-JS):
//   import { mountForschungsbaum } from ".../Menüs/adapter/aporia-forschung.js";
//   mountForschungsbaum(document.querySelector("[data-forschungsbaum]"), {
//       schluessel, titel, knoten,
//       waehrung:   { name: "Messwerte", kurz: "MW" },              // optional
//       aktion:     { text: "Messung durchführen", icon: "⚗", punkte: 3 }, // optional
//       rate: 0.6,                                                 // optional, Punkte pro Sekunde
//       stufen: ["Grundlagen", "Vertiefung", "Anwendung", "Durchbruch"], // optional, je Stufe
//   });
// Knoten: { id, name, stufe (0 = unten … höchste Stufe = Durchbruch), benoetigt: [ids], kosten,
//           belohnung?: { art: "vorteil", text, wirkung: { rate?, rabatt?, experiment? } }
//                     | { art: "gegenstand", name, bild } }
import { bewegungReduziert } from "./aporia-bewegung.js";

const PREFIX = "aporia-forschung:";

const speicher = {
    lesen(schluessel) {
        try { return JSON.parse(localStorage.getItem(PREFIX + schluessel)) ?? null; } catch { return null; }
    },
    schreiben(schluessel, wert) {
        try { localStorage.setItem(PREFIX + schluessel, JSON.stringify(wert)); } catch { /* Speicher nicht verfügbar */ }
    },
    loeschen(schluessel) {
        try { localStorage.removeItem(PREFIX + schluessel); } catch { /* Speicher nicht verfügbar */ }
    },
};

/** Fortschritt eines Zweigs (für die Forschungsübersicht). */
export function forschungsFortschritt(schluessel, gesamt = 8) {
    const s = speicher.lesen(schluessel);
    const frei = s?.frei?.length ?? 0;
    return { frei, gesamt, anteil: gesamt ? frei / gesamt : 0 };
}

const el = (tag, attrs = {}, ...kinder) => {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
        if (k === "class") e.className = v;
        else if (k === "text") e.textContent = v;
        else if (v !== false && v != null) e.setAttribute(k, v === true ? "" : v);
    }
    e.append(...kinder.filter(Boolean));
    return e;
};
const svgEl = (tag, attrs = {}) => {
    const e = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    return e;
};
const format = (n) => Math.floor(n).toLocaleString("de-DE");

export function mountForschungsbaum(wurzel, config) {
    if (!wurzel) return null;
    const { schluessel, knoten } = config;
    const nachId = new Map(knoten.map((k) => [k.id, k]));
    const GRUND_RATE = config.rate ?? 0.6;
    const EXPERIMENT_PUNKTE = config.aktion?.punkte ?? 3;
    const MAX_STUFE = Math.max(...knoten.map((k) => k.stufe));
    const W = { name: config.waehrung?.name ?? "Forschungspunkte", kurz: config.waehrung?.kurz ?? "FP" };
    const stufenName = (s) => config.stufen?.[s] ?? (s === 0 ? "Grundlagen" : s === MAX_STUFE ? "Durchbruch" : s === 1 ? "Vertiefung" : "Anwendung");
    const bewegungReduziert = bewegungReduziert;

    // ---------- Zustand ----------
    const gespeichert = speicher.lesen(schluessel);
    const zustand = {
        punkte: gespeichert?.punkte ?? 0,
        frei: new Set(gespeichert?.frei ?? []),
        auswahl: null,
    };
    const sichern = () => speicher.schreiben(schluessel, { punkte: zustand.punkte, frei: [...zustand.frei], zeit: Date.now() });

    const wirkung = () => {
        const w = { rate: 0, rabatt: 0, experiment: 0 };
        for (const id of zustand.frei) {
            const b = nachId.get(id)?.belohnung;
            if (b?.wirkung) for (const k of Object.keys(w)) w[k] += b.wirkung[k] ?? 0;
        }
        return w;
    };
    const rate = () => GRUND_RATE * (1 + wirkung().rate);
    const kosten = (k) => Math.round(k.kosten * (1 - Math.min(wirkung().rabatt, 0.6)));
    const erreichbar = (k) => k.benoetigt.every((id) => zustand.frei.has(id));
    const status = (k) => zustand.frei.has(k.id) ? "frei" : !erreichbar(k) ? "gesperrt" : zustand.punkte >= kosten(k) ? "bereit" : "verfuegbar";

    // ---------- Aufbau ----------
    wurzel.classList.add("fs-system");
    const leiste = el("div", { class: "fs-leiste" });
    const anzeigePunkte = el("strong", { class: "fs-punkte", "aria-live": "off" });
    const anzeigeRate = el("span", { class: "fs-rate" });
    const ring = svgEl("svg", { class: "fs-ring", viewBox: "0 0 44 44", "aria-hidden": "true" });
    ring.append(svgEl("circle", { cx: 22, cy: 22, r: 18, class: "fs-ring-grund" }));
    const ringWert = svgEl("circle", { cx: 22, cy: 22, r: 18, class: "fs-ring-wert", pathLength: 100 });
    ring.append(ringWert);
    const anzeigeFortschritt = el("span", { class: "fs-fortschritt" });
    const knopfExperiment = el("button", { type: "button", class: "fs-knopf fs-experiment" }, el("span", { class: "fs-knopf-icon", "aria-hidden": "true", text: config.aktion?.icon ?? "⚗" }), config.aktion?.text ?? "Experiment durchführen");
    const knopfReset = el("button", { type: "button", class: "fs-knopf fs-reset", title: "Forschungsstand dieses Zweigs zurücksetzen" }, "Zurücksetzen");
    leiste.append(
        el("div", { class: "fs-wert" }, el("span", { class: "fs-label", text: W.name }), anzeigePunkte, anzeigeRate),
        el("div", { class: "fs-wert fs-wert--ring" }, ring, el("span", {}, el("span", { class: "fs-label", text: "Freigeschaltet" }), anzeigeFortschritt)),
        knopfExperiment, knopfReset,
    );

    const baum = el("div", { class: "fs-baum", role: "group", "aria-label": `Forschungsbaum ${config.titel ?? ""}`.trim() });
    const linien = svgEl("svg", { class: "fs-linien", "aria-hidden": "true" });
    baum.append(linien);
    const reihen = [];
    for (let s = MAX_STUFE; s >= 0; s--) {
        const reihe = el("div", { class: `fs-reihe fs-stufe-${s}${s === MAX_STUFE ? " fs-durchbruch" : ""}`, "data-stufe": s });
        reihe.append(el("span", { class: "fs-reihe-label", text: stufenName(s) }));
        baum.append(reihe);
        reihen[s] = reihe;
    }
    const knoepfe = new Map();
    for (const k of knoten) {
        const b = el("button", { type: "button", class: "fs-knoten", "data-id": k.id, "aria-describedby": `${schluessel}-detail` },
            el("span", { class: "fs-knoten-kern", "aria-hidden": "true" }, el("span", { class: "fs-knoten-icon", text: k.belohnung?.art === "gegenstand" ? "◆" : k.belohnung?.art === "vorteil" ? "▲" : "●" })),
            el("span", { class: "fs-knoten-name", text: k.name }),
            el("span", { class: "fs-knoten-kosten" }));
        b.addEventListener("click", () => waehle(k.id));
        b.addEventListener("dblclick", () => erforsche(k.id));
        reihen[k.stufe].append(b);
        knoepfe.set(k.id, b);
    }

    const detail = el("aside", { class: "fs-detail", id: `${schluessel}-detail`, "aria-live": "polite" });
    const inventar = el("div", { class: "fs-inventar" }, el("h3", { text: "Freigeschaltet" }), el("ul", { class: "fs-inventar-liste" }));
    const meldung = el("div", { class: "fs-meldung", role: "status", "aria-live": "polite" });
    wurzel.append(leiste, el("div", { class: "fs-bereich" }, baum, el("div", { class: "fs-seite" }, detail, inventar)), meldung);

    // ---------- Linien zwischen Knoten (SVG, bei Größenänderung neu berechnet) ----------
    const pfade = [];
    for (const k of knoten) for (const vorId of k.benoetigt) {
        const p = svgEl("path", { class: "fs-linie", pathLength: 1, "data-von": vorId, "data-zu": k.id });
        const fluss = svgEl("path", { class: "fs-fluss", pathLength: 1, "data-von": vorId, "data-zu": k.id });
        linien.append(p, fluss);
        pfade.push({ p, fluss, von: vorId, zu: k.id });
    }
    function zeichneLinien() {
        const r = baum.getBoundingClientRect();
        linien.setAttribute("viewBox", `0 0 ${r.width} ${r.height}`);
        linien.setAttribute("width", r.width);
        linien.setAttribute("height", r.height);
        for (const { p, fluss, von, zu } of pfade) {
            // Von der Oberkante des unteren Knotens zur Unterkante des oberen Knotens (unter dessen Beschriftung)
            const a = knoepfe.get(von).querySelector(".fs-knoten-kern").getBoundingClientRect();
            const b = knoepfe.get(zu).getBoundingClientRect();
            const x1 = a.left + a.width / 2 - r.left, y1 = a.top - r.top;
            const x2 = b.left + b.width / 2 - r.left, y2 = b.bottom - r.top + 2;
            const my = (y1 + y2) / 2;
            const d = `M${x1.toFixed(1)} ${y1.toFixed(1)} C ${x1.toFixed(1)} ${my.toFixed(1)}, ${x2.toFixed(1)} ${my.toFixed(1)}, ${x2.toFixed(1)} ${y2.toFixed(1)}`;
            p.setAttribute("d", d);
            fluss.setAttribute("d", d);
        }
    }
    new ResizeObserver(zeichneLinien).observe(baum);

    // ---------- Darstellung ----------
    function zeigeDetail() {
        const k = nachId.get(zustand.auswahl) ?? knoten.find((x) => status(x) === "bereit") ?? knoten.find((x) => status(x) === "verfuegbar") ?? knoten[0];
        const st = status(k);
        const fehlend = k.benoetigt.filter((id) => !zustand.frei.has(id)).map((id) => nachId.get(id).name);
        const belohnung = k.belohnung?.art === "gegenstand"
            ? el("div", { class: "fs-belohnung fs-belohnung--gegenstand" }, el("img", { src: k.belohnung.bild, alt: "", loading: "lazy", decoding: "async" }), el("span", {}, el("span", { class: "fs-label", text: "Gegenstand" }), el("strong", { text: k.belohnung.name })))
            : k.belohnung?.art === "vorteil"
                ? el("div", { class: "fs-belohnung" }, el("span", { class: "fs-label", text: "Vorteil" }), el("strong", { text: k.belohnung.text }))
                : el("div", { class: "fs-belohnung" }, el("span", { class: "fs-label", text: "Grundlage" }), el("strong", { text: "Öffnet die nächsten Forschungen" }));
        const knopf = el("button", { type: "button", class: "fs-knopf fs-erforschen", disabled: st !== "bereit" },
            st === "frei" ? "Bereits erforscht" : st === "gesperrt" ? "Voraussetzungen fehlen" : `Erforschen · ${format(kosten(k))} ${W.kurz}`);
        knopf.addEventListener("click", () => erforsche(k.id));
        detail.replaceChildren(...[
            el("p", { class: "fs-label", text: stufenName(k.stufe) }),
            el("h3", { text: k.name }),
            fehlend.length ? el("p", { class: "fs-hinweis", text: `Benötigt: ${fehlend.join(", ")}` }) : null,
            belohnung, knopf,
        ].filter(Boolean));
    }
    function zeigeInventar() {
        const liste = inventar.querySelector("ul");
        const eintraege = knoten.filter((k) => zustand.frei.has(k.id) && k.belohnung).map((k) => k.belohnung.art === "gegenstand"
            ? el("li", { class: "fs-item fs-item--gegenstand" }, el("img", { src: k.belohnung.bild, alt: "", loading: "lazy", decoding: "async" }), el("span", { text: k.belohnung.name }))
            : el("li", { class: "fs-item" }, el("span", { class: "fs-item-icon", "aria-hidden": "true", text: "▲" }), el("span", { text: k.belohnung.text })));
        liste.replaceChildren(...(eintraege.length ? eintraege : [el("li", { class: "fs-leer", text: `Noch nichts freigeschaltet. Sammle ${W.name} und erforsche „${stufenName(0)}“.` })]));
    }
    function aktualisiere() {
        anzeigePunkte.textContent = format(zustand.punkte);
        anzeigeRate.textContent = `+${rate().toLocaleString("de-DE", { maximumFractionDigits: 2 })} / s`;
        anzeigeFortschritt.textContent = `${zustand.frei.size} / ${knoten.length}`;
        ringWert.style.strokeDasharray = `${(zustand.frei.size / knoten.length) * 100} 100`;
        for (const k of knoten) {
            const b = knoepfe.get(k.id), st = status(k);
            b.dataset.status = st;
            b.setAttribute("aria-pressed", String(zustand.auswahl === k.id));
            b.setAttribute("aria-label", `${k.name}, ${{ frei: "erforscht", gesperrt: "gesperrt", bereit: "kann erforscht werden", verfuegbar: "verfügbar, zu wenig Punkte" }[st]}`);
            b.querySelector(".fs-knoten-kosten").textContent = st === "frei" ? "erforscht" : `${format(kosten(k))} ${W.kurz}`;
        }
        for (const { p, fluss, von, zu } of pfade) {
            const aktiv = zustand.frei.has(von) && zustand.frei.has(zu);
            p.classList.toggle("ist-frei", aktiv);
            p.classList.toggle("ist-offen", zustand.frei.has(von) && !zustand.frei.has(zu));
            fluss.classList.toggle("ist-frei", aktiv);
        }
        zeigeDetail();
    }

    // ---------- Aktionen ----------
    function waehle(id) {
        zustand.auswahl = id;
        aktualisiere();
    }
    function melde(text, bild) {
        meldung.replaceChildren(...[bild ? el("img", { src: bild, alt: "" }) : null, el("span", { text })].filter(Boolean));
        meldung.classList.remove("ist-sichtbar");
        void meldung.offsetWidth;
        meldung.classList.add("ist-sichtbar");
    }
    function erforsche(id) {
        const k = nachId.get(id);
        if (!k || status(k) !== "bereit") return;
        zustand.punkte -= kosten(k);
        zustand.frei.add(id);
        zustand.auswahl = id;
        sichern();
        const b = knoepfe.get(id);
        b.classList.remove("ist-neu");
        void b.offsetWidth;
        b.classList.add("ist-neu");
        for (const { p, zu } of pfade) if (zu === id) { p.classList.remove("ist-neu"); void p.getBoundingClientRect(); p.classList.add("ist-neu"); }
        const bel = k.belohnung;
        melde(bel?.art === "gegenstand" ? `Gegenstand freigeschaltet: ${bel.name}` : bel?.art === "vorteil" ? `Vorteil erhalten: ${bel.text}` : `${k.name} erforscht`, bel?.art === "gegenstand" ? bel.bild : null);
        aktualisiere();
        zeigeInventar();
        wurzel.dispatchEvent(new CustomEvent("forschung:freigeschaltet", { bubbles: true, detail: { id, schluessel } }));
    }
    knopfExperiment.addEventListener("click", () => {
        zustand.punkte += EXPERIMENT_PUNKTE + wirkung().experiment;
        knopfExperiment.classList.remove("ist-aktiv");
        void knopfExperiment.offsetWidth;
        knopfExperiment.classList.add("ist-aktiv");
        sichern();
        aktualisiere();
    });
    knopfReset.addEventListener("click", () => {
        if (!confirm("Forschungsstand dieses Zweigs wirklich zurücksetzen?")) return;
        zustand.punkte = 0;
        zustand.frei.clear();
        zustand.auswahl = null;
        speicher.loeschen(schluessel);
        aktualisiere();
        zeigeInventar();
    });

    // ---------- Punkte sammeln, nur wenn sichtbar (spart Rechenzeit) ----------
    let sichtbar = false, letzte = performance.now(), letzteAnzeige = 0;
    new IntersectionObserver(([e]) => {
        sichtbar = e.isIntersecting;
        wurzel.classList.toggle("ist-sichtbar", sichtbar);
        letzte = performance.now();
    }).observe(wurzel);
    setInterval(() => {
        const jetzt = performance.now();
        if (sichtbar && document.visibilityState === "visible") {
            zustand.punkte += rate() * (jetzt - letzte) / 1000;
            if (jetzt - letzteAnzeige > 950) { aktualisiere(); letzteAnzeige = jetzt; }
            if (Math.random() < 0.05) sichern();
        }
        letzte = jetzt;
    }, 250);
    addEventListener("pagehide", sichern);
    wurzel.classList.toggle("ist-ruhig", bewegungReduziert.matches);
    bewegungReduziert.addEventListener("change", () => wurzel.classList.toggle("ist-ruhig", bewegungReduziert.matches));

    aktualisiere();
    zeigeInventar();
    requestAnimationFrame(zeichneLinien);
    return { erforsche, zustand };
}
