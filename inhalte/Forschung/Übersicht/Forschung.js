// APORIA – Forschungsübersicht: Filter, Suche, Netzdiagramm und Forschungsfortschritt je Zweig
import { applyAporiaRoutes } from "../../../Men%C3%BCs/adapter/aporia-routes.js";
import { forschungsFortschritt } from "../../../Men%C3%BCs/adapter/aporia-forschung.js";
import "../../../Men%C3%BCs/TopBar/Top_bar.js";

applyAporiaRoutes(document);

const gruppen = [...document.querySelectorAll(".fu-gruppe")];
const karten = [...document.querySelectorAll(".fu-karte")];
const filterKnoepfe = [...document.querySelectorAll(".fu-filter [data-filter]")];
const netzKnoten = [...document.querySelectorAll(".fu-knoten")];
const suche = document.querySelector("[data-suche]");
const nurBegonnen = document.querySelector("[data-begonnen]");
const treffer = document.querySelector("[data-treffer]");
let filter = "alle";

// ---------- Fortschritt aus dem Forschungsadapter ----------
function fortschrittLaden() {
    let frei = 0, gesamt = 0;
    for (const karte of karten) {
        const f = forschungsFortschritt(karte.dataset.schluessel, Number(karte.dataset.knoten));
        frei += f.frei; gesamt += f.gesamt;
        karte.querySelector(".fu-ring-wert").style.strokeDasharray = `${f.anteil * 100} 100`;
        karte.querySelector(".fu-ring-zahl").textContent = `${f.frei}/${f.gesamt}`;
        karte.classList.toggle("ist-begonnen", f.frei > 0);
        karte.classList.toggle("ist-fertig", f.frei === f.gesamt);
        karte.dataset.frei = f.frei;
        karte.setAttribute("aria-label", `${karte.querySelector("strong").textContent}, ${f.frei} von ${f.gesamt} Forschungen erforscht`);
    }
    for (const g of gruppen) {
        const k = [...g.querySelectorAll(".fu-karte")];
        const gf = k.reduce((s, x) => s + Number(x.dataset.frei), 0), gg = k.reduce((s, x) => s + Number(x.dataset.knoten), 0);
        g.querySelector("[data-gruppe-balken]").style.width = `${gg ? gf / gg * 100 : 0}%`;
        g.querySelector("[data-gruppe-zahl]").textContent = `${gf} / ${gg} erforscht`;
    }
    document.querySelector("[data-gesamt-frei]").textContent = frei;
    document.querySelector("[data-gesamt-balken]").style.width = `${gesamt ? frei / gesamt * 100 : 0}%`;
    document.querySelector("[data-gesamt-prozent]").textContent = `${gesamt ? Math.round(frei / gesamt * 100) : 0} %`;
}

// ---------- Filter und Suche ----------
function anwenden() {
    const q = suche.value.trim().toLocaleLowerCase("de");
    let sichtbar = 0;
    for (const g of gruppen) {
        let inGruppe = 0;
        for (const karte of g.querySelectorAll(".fu-karte")) {
            const passt = (!q || karte.textContent.toLocaleLowerCase("de").includes(q) || g.querySelector("h2").textContent.toLocaleLowerCase("de").includes(q))
                && (!nurBegonnen.checked || Number(karte.dataset.frei) > 0);
            karte.parentElement.hidden = !passt;
            if (passt) inGruppe++;
        }
        g.hidden = (filter !== "alle" && g.id !== filter) || inGruppe === 0;
        if (!g.hidden) sichtbar += inGruppe;
    }
    treffer.textContent = `${sichtbar} von ${karten.length} Forschungszweigen`;
    for (const b of filterKnoepfe) b.setAttribute("aria-pressed", String(b.dataset.filter === filter));
    for (const n of netzKnoten) n.classList.toggle("ist-aktiv", n.dataset.filter === filter);
}
function setzeFilter(id, scrollen = false) {
    filter = id;
    anwenden();
    if (scrollen && id !== "alle") document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}
for (const b of filterKnoepfe) b.addEventListener("click", () => setzeFilter(b.dataset.filter));
for (const n of netzKnoten) n.addEventListener("click", (e) => { e.preventDefault(); setzeFilter(filter === n.dataset.filter ? "alle" : n.dataset.filter, true); history.replaceState(null, "", `#${n.dataset.filter}`); });
suche.addEventListener("input", anwenden);
nurBegonnen.addEventListener("change", anwenden);

// Rückkehr von einem Zweig (#gruppe-N) und aktualisierter Fortschritt beim Zurückblättern
addEventListener("pageshow", () => { fortschrittLaden(); anwenden(); });
fortschrittLaden();
anwenden();
const ziel = location.hash ? document.querySelector(location.hash) : null;
if (ziel?.classList.contains("fu-gruppe")) requestAnimationFrame(() => ziel.scrollIntoView({ block: "start" }));
