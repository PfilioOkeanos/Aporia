// Storys · gemeinsames Verhalten (erzeugt von scripts/spezies/storys.mjs)
import "../../../../../../Men%C3%BCs/TopBar/Top_bar.js";
import "../../../../../../Men%C3%BCs/Side_bar/side_bar.js";
import { applyAporiaRoutes } from "../../../../../../Men%C3%BCs/adapter/aporia-routes.js";
applyAporiaRoutes(document);

export function uebersicht() {
    const knoten = [...document.querySelectorAll(".sy-knoten, .sy-strangkarte")];
    const artKnoepfe = [...document.querySelectorAll(".sy-filter button")];
    const ortKnoepfe = [...document.querySelectorAll(".sy-welt")];
    let art = "", ort = "";
    const anwenden = () => {
        let sichtbar = 0;
        for (const k of knoten) {
            const passt = (!art || k.dataset.art === art || (k.classList.contains("sy-strangkarte") && !art)) && (!ort || (k.dataset.orte || "").split(" ").includes(ort));
            const zeigen = k.classList.contains("sy-knoten--offen") ? !art && !ort : passt;
            k.hidden = !zeigen;
            if (zeigen && k.classList.contains("sy-knoten")) sichtbar++;
        }
        document.querySelector(".sy-leer").hidden = sichtbar > 0;
        artKnoepfe.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.art === art)));
        ortKnoepfe.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.ort === ort)));
    };
    artKnoepfe.forEach((b) => b.addEventListener("click", () => { art = b.dataset.art; anwenden(); }));
    ortKnoepfe.forEach((b) => b.addEventListener("click", () => { ort = ort === b.dataset.ort ? "" : b.dataset.ort; anwenden(); }));
}

export function leseseite() {
    const balken = document.querySelector(".sy-fortschritt span");
    const text = document.querySelector(".sy-text");
    const links = [...document.querySelectorAll(".sy-inhalt a[href^='#']")];
    const abschnitte = links.map((a) => document.getElementById(a.hash.slice(1))).filter(Boolean);
    const melden = () => {
        const r = text.getBoundingClientRect();
        const anteil = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight)));
        if (balken) balken.style.transform = `scaleX(${anteil})`;
        let aktiv = abschnitte[0];
        for (const s of abschnitte) if (s.getBoundingClientRect().top < innerHeight * 0.3) aktiv = s;
        links.forEach((a) => a.toggleAttribute("aria-current", a.hash === "#" + aktiv?.id));
    };
    addEventListener("scroll", melden, { passive: true });
    addEventListener("resize", melden);
    melden();
}
