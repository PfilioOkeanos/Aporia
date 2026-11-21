// Flora & Fauna – Artenkatalog
// Filter über die Adresse: ?planet=erde-im-sternenmeer&kategorie=Pflanzen&art=pflanze-001
import "../../../Men%C3%BCs/TopBar/Top_bar.js";
import "../../../Men%C3%BCs/Side_bar/side_bar.js";
import { applyAporiaRoutes } from "../../../Men%C3%BCs/adapter/aporia-routes.js";
import { getPlanetInfos } from "../../../Men%C3%BCs/adapter/aporia-planeten.js";
import { ladeArten, KATEGORIEN } from "./flora-daten.js";

applyAporiaRoutes(document);

const $ = (s) => document.querySelector(s);
const raster = $("#arten-raster"), status = $("#arten-status"), aktiv = $("#arten-aktiv");
const felder = { planet: $("#arten-planet"), gruppe: $("#arten-gruppe"), lebensraum: $("#arten-lebensraum"), gefaehrdung: $("#arten-gefaehrdung") };
const suche = $("#arten-suche"), formular = $("#arten-formular"), kategorienNav = $("#arten-kategorien");
const dialog = $("#arten-dialog");
const sortierer = new Intl.Collator("de", { sensitivity: "base" });
const normal = (s) => String(s ?? "").toLocaleLowerCase("de").normalize("NFD").replace(/\p{M}/gu, "");

function el(tag, text, klasse) {
    const knoten = document.createElement(tag);
    if (text) knoten.textContent = text;
    if (klasse) knoten.className = klasse;
    return knoten;
}
function optionen(select, werte) {
    for (const [wert, text] of werte) select.add(new Option(text, wert));
}

try {
    const arten = await ladeArten();
    const planeten = new Map((await getPlanetInfos(arten.flatMap((a) => a.planeten ?? []))).map((p) => [p.slug, p]));
    const parameter = new URLSearchParams(location.search);
    let kategorie = KATEGORIEN.some(([k]) => k === parameter.get("kategorie")) ? parameter.get("kategorie") : "";

    optionen(felder.planet, [...planeten.values()].sort((a, b) => sortierer.compare(a.name, b.name)).map((p) => [p.slug, p.name]));
    const einzeln = (feld) => [...new Set(arten.flatMap((a) => [].concat(a[feld] ?? [])))].filter(Boolean).sort(sortierer.compare);
    optionen(felder.gruppe, einzeln("gruppe").map((g) => [g, g]));
    optionen(felder.lebensraum, einzeln("lebensraum").map((l) => [l, l]));
    optionen(felder.gefaehrdung, einzeln("gefaehrdung").map((g) => [g, g]));
    if (planeten.has(parameter.get("planet"))) felder.planet.value = parameter.get("planet");
    for (const f of ["gruppe", "lebensraum"]) if (parameter.get(f)) felder[f].value = parameter.get(f);

    // Kategorien mit Anzahl (abhängig vom Planetenfilter)
    const kategorieLinks = new Map();
    for (const [schluessel, zeichen, text] of [["", "✦", "Alle Arten"], ...KATEGORIEN]) {
        const knopf = el("button", "", "arten-kategorie");
        knopf.type = "button";
        knopf.append(el("i", zeichen), el("span", text), el("b", ""));
        knopf.addEventListener("click", () => { kategorie = schluessel; zeigen(); });
        kategorienNav.append(knopf);
        kategorieLinks.set(schluessel, knopf);
    }

    function karte(art) {
        const knopf = el("button", "", "arten-karte");
        knopf.type = "button";
        knopf.dataset.art = art.id;
        if (art.bildUrl) {
            const bild = el("img");
            bild.src = art.bildUrl;
            bild.alt = "";
            bild.loading = "lazy";
            bild.decoding = "async";
            knopf.append(bild);
        } else knopf.append(el("span", KATEGORIEN.find(([k]) => k === art.kategorie)?.[1] ?? "✦", "arten-ohne-bild"));
        const text = el("span", "", "arten-karte-text");
        text.append(el("strong", art.name), el("em", art.wissenschaftlich ?? ""), el("small", [art.gruppe, ...(art.lebensraum ?? [])].join(" · ")));
        knopf.append(text);
        if (art.gefaehrdung && !/^Nicht gefährdet/.test(art.gefaehrdung)) knopf.append(el("span", art.gefaehrdung, "arten-iucn"));
        knopf.addEventListener("click", () => oeffnen(art));
        return knopf;
    }

    function passt(art, ohneKategorie = false) {
        const q = normal(suche.value.trim());
        return (!felder.planet.value || art.planeten?.includes(felder.planet.value)) &&
            (ohneKategorie || !kategorie || art.kategorie === kategorie) &&
            (!felder.gruppe.value || art.gruppe === felder.gruppe.value) &&
            (!felder.lebensraum.value || art.lebensraum?.includes(felder.lebensraum.value)) &&
            (!felder.gefaehrdung.value || art.gefaehrdung === felder.gefaehrdung.value) &&
            (!q || normal(art.name + " " + (art.wissenschaftlich ?? "")).includes(q));
    }

    function adresse() {
        const url = new URL(location.href);
        for (const [k, v] of [["planet", felder.planet.value], ["kategorie", kategorie], ["gruppe", felder.gruppe.value], ["lebensraum", felder.lebensraum.value]]) {
            if (v) url.searchParams.set(k, v); else url.searchParams.delete(k);
        }
        history.replaceState(null, "", url);
    }

    function zeigen() {
        const planet = planeten.get(felder.planet.value);
        const basis = arten.filter((a) => passt(a, true));
        for (const [schluessel, knopf] of kategorieLinks) {
            knopf.querySelector("b").textContent = String(schluessel ? basis.filter((a) => a.kategorie === schluessel).length : basis.length);
            knopf.setAttribute("aria-pressed", String(schluessel === kategorie));
        }
        const treffer = basis.filter((a) => passt(a)).sort((a, b) => sortierer.compare(a.name, b.name));
        raster.replaceChildren(...treffer.map(karte));
        if (!treffer.length) raster.append(el("p", "Keine Arten für diese Auswahl.", "arten-leer"));
        const art = kategorie || "Arten";
        $("#arten-titel").textContent = planet ? `${art} · ${planet.name}` : kategorie || "Artenkatalog";
        $("#arten-liste-titel").textContent = planet ? `${art} auf ${planet.name}` : kategorie ? `Alle ${kategorie}` : "Alle Arten";
        $("#arten-untertitel").textContent = planet ? `Alle erfassten ${art} des Planeten ${planet.name}.` : "Pflanzen, Tiere und Pilze aller erfassten Welten.";
        status.textContent = `${treffer.length} von ${arten.length} Arten`;
        // Hinweis auf aktiven Planetenfilter mit Rücksprung ins Dossier
        aktiv.hidden = !planet;
        if (planet) {
            const zurueck = el("a", `Zum Dossier ${planet.name} →`);
            zurueck.href = planet.href;
            const weg = el("button", "Planetenfilter entfernen ✕");
            weg.type = "button";
            weg.addEventListener("click", () => { felder.planet.value = ""; zeigen(); });
            aktiv.replaceChildren(el("span", `Gefiltert: ${planet.name}`), zurueck, weg);
        }
        adresse();
    }

    function oeffnen(art) {
        const bild = dialog.querySelector(".arten-detail-bild");
        bild.hidden = !art.bildUrl;
        if (art.bildUrl) {
            bild.querySelector("img").src = art.bildUrl;
            bild.querySelector("img").alt = art.name;
            const nachweis = bild.querySelector("figcaption");
            nachweis.replaceChildren("Bild: " + (art.bild.autor ?? "") + " · ");
            const lizenz = el("a", art.bild.lizenz ?? "Lizenz");
            lizenz.href = art.bild.quelle ?? art.bild.lizenzUrl ?? "#";
            lizenz.target = "_blank";
            lizenz.rel = "noopener";
            nachweis.append(lizenz);
        }
        $("#arten-dialog-kategorie").textContent = [art.kategorie, art.gruppe].join(" · ");
        $("#arten-dialog-name").textContent = art.name;
        $("#arten-dialog-wiss").textContent = art.wissenschaftlich ?? "";
        $("#arten-dialog-text").textContent = art.text || "Noch nicht ausgearbeitet";
        const fakten = $("#arten-dialog-fakten");
        fakten.replaceChildren();
        const zeile = (dt, inhalt) => {
            const wert = el("dd");
            wert.append(inhalt);
            const reihe = el("div");
            reihe.append(el("dt", dt), wert);
            fakten.append(reihe);
        };
        zeile("Lebensraum", (art.lebensraum ?? []).join(", ") || "Noch nicht ausgearbeitet");
        zeile("Gefährdung (IUCN)", art.gefaehrdung ?? "Keine Angabe");
        const vorkommen = document.createDocumentFragment();
        (art.planeten ?? []).forEach((slug, i) => {
            const p = planeten.get(slug);
            if (i) vorkommen.append(", ");
            const a = el("a", p?.name ?? slug);
            a.href = p?.href ?? "#";
            vorkommen.append(a);
        });
        zeile("Vorkommen", vorkommen);
        const quelle = $("#arten-dialog-quelle");
        quelle.replaceChildren("Quelle: ");
        const q = el("a", "Wikipedia · " + art.quelle.titel);
        q.href = art.quelle.url;
        q.target = "_blank";
        q.rel = "noopener";
        quelle.append(q, " (CC BY-SA 4.0)");
        dialog.showModal();
        const url = new URL(location.href);
        url.searchParams.set("art", art.id);
        history.replaceState(null, "", url);
    }
    dialog.addEventListener("close", () => {
        const url = new URL(location.href);
        url.searchParams.delete("art");
        history.replaceState(null, "", url);
    });
    dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });

    for (const feld of Object.values(felder)) feld.addEventListener("change", zeigen);
    suche.addEventListener("input", zeigen);
    formular.addEventListener("submit", (e) => e.preventDefault());
    formular.addEventListener("reset", () => { suche.value = ""; kategorie = ""; requestAnimationFrame(zeigen); });
    zeigen();
    const direkt = arten.find((a) => a.id === parameter.get("art"));
    if (direkt) oeffnen(direkt);
} catch (fehler) {
    console.error("Artenkatalog:", fehler);
    status.textContent = "Der Artenkatalog konnte nicht geladen werden.";
}
