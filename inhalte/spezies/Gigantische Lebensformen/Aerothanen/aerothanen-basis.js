// Aerothanen · gemeinsames Verhalten (erzeugt von scripts/spezies/eigene/aerothanen.mjs)
import "../../../../Men%C3%BCs/TopBar/Top_bar.js";
import { applyAporiaRoutes } from "../../../../Men%C3%BCs/adapter/aporia-routes.js";
applyAporiaRoutes(document);

// Kapitel: alle auf-/zuklappen, Sprungziel öffnen
const kapitel = [...document.querySelectorAll("details.ae-kapitel")];
const klappen = document.querySelector("[data-ae-klappen]");
if (klappen && kapitel.length) {
    const stand = () => { const alle = kapitel.every((k) => k.open); klappen.setAttribute("aria-pressed", String(alle)); klappen.textContent = alle ? "Alle zuklappen" : "Alle aufklappen"; };
    klappen.addEventListener("click", () => { const auf = !kapitel.every((k) => k.open); kapitel.forEach((k) => { k.open = auf; }); stand(); });
    kapitel.forEach((k) => k.addEventListener("toggle", stand));
    stand();
}
const ziel = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
if (ziel instanceof HTMLDetailsElement) ziel.open = true;

// Großansicht mit Blättern (Pfeiltasten, Knöpfe, Wischen)
let grossOeffnen = () => {};
const dialog = document.querySelector(".ae-gross");
if (dialog) {
    const bild = dialog.querySelector("img"), titel = dialog.querySelector("figcaption strong"), zaehler = dialog.querySelector(".ae-gross-zaehler"), link = dialog.querySelector("figcaption a");
    let liste = [], aktuell = 0;
    const sichtbar = () => [...document.querySelectorAll(".ae-werk-bild")].filter((b) => !b.closest("[hidden]"));
    const zeigen = (i) => {
        aktuell = (i + liste.length) % liste.length;
        const b = liste[aktuell];
        bild.src = b.dataset.vor; bild.alt = b.dataset.titel;
        titel.textContent = b.dataset.titel; link.href = b.dataset.gross;
        zaehler.textContent = (aktuell + 1) + " / " + liste.length + " · " + b.dataset.kategorie;
    };
    document.addEventListener("click", (e) => {
        const knopf = e.target.closest(".ae-werk-bild");
        if (!knopf) return;
        grossOeffnen(sichtbar(), sichtbar().indexOf(knopf));
    });
    grossOeffnen = (l, i) => { liste = l; zeigen(Math.max(0, i)); dialog.showModal(); };
    dialog.querySelectorAll("[data-schritt]").forEach((k) => k.addEventListener("click", () => zeigen(aktuell + Number(k.dataset.schritt))));
    dialog.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") zeigen(aktuell + 1); if (e.key === "ArrowLeft") zeigen(aktuell - 1); });
    dialog.addEventListener("click", (e) => { if (e.target === dialog || e.target.tagName === "FIGURE") dialog.close(); });
    let startX = null;
    dialog.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
    dialog.addEventListener("touchend", (e) => { if (startX === null) return; const dx = e.changedTouches[0].clientX - startX; if (Math.abs(dx) > 50) zeigen(aktuell + (dx < 0 ? 1 : -1)); startX = null; }, { passive: true });
}

// Medien: Bild-Karussell (Bühne + Daumenleiste + Filter, blättert von selbst, Wischen am Handy)
const buehne = document.querySelector(".ae-buehne");
if (buehne) {
    const daumen = [...document.querySelectorAll(".ae-daumen-bild")];
    const bild = buehne.querySelector(".ae-buehne-gross img"), himmel = buehne.querySelector(".ae-buehne-hintergrund");
    const titel = buehne.querySelector(".ae-buehne-bild strong"), kat = buehne.querySelector(".ae-buehne-kategorie"), zaehler = buehne.querySelector(".ae-buehne-zaehler");
    const sicht = () => daumen.filter((d) => !d.hidden);
    let aktuell = daumen[0];
    const zeige = (d) => {
        if (!d) return;
        aktuell = d;
        const liste = sicht();
        bild.style.opacity = "0";
        setTimeout(() => {
            bild.src = d.dataset.vor; bild.alt = d.dataset.titel;
            himmel.src = d.dataset.vor;
            titel.textContent = d.dataset.titel; kat.textContent = d.dataset.kategorie;
            zaehler.textContent = (liste.indexOf(d) + 1) + " / " + liste.length;
            bild.style.opacity = "1";
        }, 180);
        daumen.forEach((x) => x.toggleAttribute("aria-current", x === d));
        d.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    };
    const schritt = (n) => { const liste = sicht(); zeige(liste[(liste.indexOf(aktuell) + n + liste.length) % liste.length]); };
    daumen.forEach((d) => d.addEventListener("click", () => { halt(); zeige(d); }));
    buehne.querySelectorAll("[data-buehne]").forEach((k) => k.addEventListener("click", () => { halt(); schritt(Number(k.dataset.buehne)); }));
    const filter = [...document.querySelectorAll(".ae-filter button")];
    filter.forEach((b) => b.addEventListener("click", () => {
        filter.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        daumen.forEach((d) => { d.hidden = !!b.dataset.filter && d.dataset.kategorie !== b.dataset.filter; });
        zeige(sicht()[0]);
    }));
    // Großansicht vom Bühnenbild aus, blättert durch die sichtbaren Bilder
    buehne.querySelector(".ae-buehne-gross").addEventListener("click", () => { halt(); grossOeffnen(sicht(), sicht().indexOf(aktuell)); });
    // Wischen auf der Bühne
    let startX = null;
    buehne.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
    buehne.addEventListener("touchend", (e) => { if (startX === null) return; const dx = e.changedTouches[0].clientX - startX; if (Math.abs(dx) > 50) { halt(); schritt(dx < 0 ? 1 : -1); } startX = null; }, { passive: true });
    // von selbst weiterblättern, solange die Bühne sichtbar ist und nicht bedient wurde
    let takt = null, imBild = false, bedient = false;
    const halt = () => { bedient = true; clearInterval(takt); takt = null; };
    const lauf = () => { clearInterval(takt); takt = null; if (imBild && !bedient && !document.hidden && !matchMedia("(prefers-reduced-motion: reduce)").matches) takt = setInterval(() => schritt(1), 6500); };
    new IntersectionObserver(([e]) => { imBild = e.isIntersecting; lauf(); }).observe(buehne);
    document.addEventListener("visibilitychange", lauf);
}

// Medien: 3D-Modelle laden erst beim Antippen (gemeinsamer Modell-Adapter)
document.querySelectorAll(".ae-modell").forEach((m) => {
    m.querySelector(".ae-modell-laden")?.addEventListener("click", async (e) => {
        const ort = m.querySelector(".ae-modell-buehne");
        e.currentTarget.textContent = "Wird geladen …";
        try {
            const { loadModel } = await import("../../_gemeinsam/modell-viewer.js");
            ort.replaceChildren();
            await loadModel(ort, { url: new URL(m.dataset.modell, location.href).href, title: m.dataset.titel }, m.dataset.modell.split(".").pop().toLowerCase());
        } catch { ort.textContent = "Modell konnte nicht geladen werden."; }
    });
});
