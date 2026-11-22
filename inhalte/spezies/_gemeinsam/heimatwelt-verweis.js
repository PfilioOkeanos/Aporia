// Heimatwelt-Verweis · zeigt auf jeder Speziesseite einer Spezies mit Heimatwelt einen kompakten Kasten
// „Heimatwelt“ mit Planetenbild, Planetendossier und Sternensystem in der Sternenkarte.
// Daten: heimatwelten.js (erzeugt von scripts/planeten/heimatwelt-verweise.mjs).
// Eingebunden über die Basis-Skripte der Spezies und _gemeinsam/spezies-navigation.js.
// Seiten, die bereits selbst auf das Planetendossier verlinken, bleiben unverändert.
import { HEIMATWELTEN } from "./heimatwelten.js";

const WURZEL = new URL("../../../", import.meta.url);
const zuUrl = (pfad) => new URL(pfad.split("/").map(encodeURIComponent).join("/"), WURZEL).href;

function finde() {
    const pfad = decodeURIComponent(location.pathname);
    const treffer = Object.entries(HEIMATWELTEN).find(([spezies]) => pfad.includes(`/inhalte/spezies/${spezies}/`));
    return treffer?.[1] ?? null;
}

function stil() {
    if (document.getElementById("heimatwelt-verweis-stil")) return;
    const style = document.createElement("style");
    style.id = "heimatwelt-verweis-stil";
    style.textContent = `
.heimatwelt-verweis { box-sizing: border-box; display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: .9rem; width: 100%; margin: 0 0 1rem; padding: .7rem .9rem; border: 1px solid rgba(255, 255, 255, .16); border-radius: 14px; background: rgba(8, 10, 18, .72); color: #eef2f6; font: 400 .92rem/1.4 "Segoe UI", system-ui, sans-serif; box-shadow: 0 .4rem 1.2rem rgba(0, 0, 0, .3); backdrop-filter: blur(6px); }
.heimatwelt-verweis__bild { display: block; width: 3.6rem; height: 3.6rem; overflow: hidden; border-radius: 50%; box-shadow: 0 0 0 1px rgba(255, 255, 255, .2), 0 0 1rem rgba(120, 200, 255, .25); }
.heimatwelt-verweis__bild img { width: 100%; height: 100%; object-fit: cover; }
.heimatwelt-verweis__text { display: grid; gap: .1rem; min-width: 0; }
.heimatwelt-verweis__kicker { color: rgba(238, 242, 246, .62); font-size: .68rem; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; }
.heimatwelt-verweis__name { color: #fff; font: 600 1.15rem/1.2 Georgia, "Palatino Linotype", serif; }
.heimatwelt-verweis__system { color: rgba(238, 242, 246, .72); font-size: .82rem; }
.heimatwelt-verweis__links { display: flex; flex-wrap: wrap; gap: .45rem; justify-content: flex-end; }
.heimatwelt-verweis__links a { display: inline-flex; align-items: center; padding: .42rem .85rem; border: 1px solid rgba(255, 255, 255, .28); border-radius: 999px; color: #fff !important; font-size: .84rem; font-weight: 600; text-decoration: none; white-space: nowrap; background: rgba(255, 255, 255, .06); }
.heimatwelt-verweis__links a:hover, .heimatwelt-verweis__links a:focus-visible { border-color: rgba(255, 255, 255, .6); background: rgba(255, 255, 255, .14); }
@media (max-width: 640px) {
    .heimatwelt-verweis { grid-template-columns: auto minmax(0, 1fr); }
    .heimatwelt-verweis__links { grid-column: 1 / -1; justify-content: flex-start; }
}`;
    document.head.append(style);
}

// Platz: nach der Reiterleiste → nach dem Seitenkopf → an den Anfang des Inhaltsbereichs → an den Seitenanfang
function platziere(kasten) {
    const main = document.querySelector("main") ?? document.body;
    const reiter = [...main.querySelectorAll(":scope > nav")].find((n) => [...n.classList].some((k) => k.endsWith("-reiter")) || /^Hauptreiter/.test(n.getAttribute("aria-label") ?? ""));
    if (reiter) return reiter.after(kasten);
    const kopf = main.querySelector(":scope > header");
    if (kopf) return kopf.after(kasten);
    // mehrspaltige Raster (Kopf in einer Rasterzelle): an den Anfang der Inhaltsspalte
    const inhalt = [...main.querySelectorAll("*")].find((e) => [...e.classList].some((k) => /-(content|inhalt|core)$/.test(k)));
    if (inhalt) return inhalt.prepend(kasten);
    // schlichte Seiten: hinter den ersten Titelblock (nicht unter die Zierleiste der Topbar)
    const erster = [...main.children].find((e) => e !== kasten && !/^(SCRIPT|STYLE|DIALOG)$/.test(e.tagName));
    if (erster) return erster.after(kasten);
    main.prepend(kasten);
}

function zeige() {
    const w = finde();
    if (!w || document.querySelector(".heimatwelt-verweis")) return;
    const ordner = w.ordner;
    const schonVerlinkt = [...document.querySelectorAll("a[href]")].some((a) => decodeURIComponent(a.getAttribute("href")).includes(`/details/${ordner}/`));
    if (schonVerlinkt) return;
    stil();
    const dossier = zuUrl(w.dossier);
    const karte = zuUrl("Menüs/Sternenkarte/Sternenkarte.html") + "?system=" + encodeURIComponent(w.system);
    const kasten = document.createElement("aside");
    kasten.className = "heimatwelt-verweis";
    kasten.setAttribute("aria-label", `Heimatwelt ${w.welt}`);
    kasten.innerHTML = `${w.bild ? `<a class="heimatwelt-verweis__bild" href="${dossier}" tabindex="-1" aria-hidden="true"><img src="${zuUrl(w.bild)}" alt="" loading="lazy" decoding="async"></a>` : ""}
        <span class="heimatwelt-verweis__text"><span class="heimatwelt-verweis__kicker">Heimatwelt</span><span class="heimatwelt-verweis__name"></span><span class="heimatwelt-verweis__system"></span></span>
        <span class="heimatwelt-verweis__links"><a href="${dossier}">Planetendossier ›</a><a href="${karte}">Sternenkarte ›</a></span>`;
    kasten.querySelector(".heimatwelt-verweis__name").textContent = w.welt;
    kasten.querySelector(".heimatwelt-verweis__system").textContent = `${w.systemName} · Stern ${w.stern}`;
    platziere(kasten);
}

if (document.readyState === "complete") zeige();
else addEventListener("load", zeige, { once: true });
