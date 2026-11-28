// APORIA · Kapitel blättern am Seitenende (zentral, geladen über Top_bar.js)
//
// Seiten mit einer Reiter-Leiste (zweite Leiste: .dossier-seitennavigation oder nav[class$="-reiter"])
// bekommen unten eine Leiste nach dem Vorbild der Planeten-Unterseiten:
//   [← Vorheriges Kapitel]  [Kapitel 02 / 08 · Zur Übersicht]  [Nächstes Kapitel →]
// Reihenfolge, Titel und Ziele kommen aus der Reiter-Leiste – neue Seiten brauchen nichts weiter.
// Die Bilder werden aus dem Kopfbild der Ziel-Seiten übernommen.
// Alte Blätter-Leisten am Seitenende ([class$="-blaettern"], .noe-pager) werden ersetzt.
// Seiten mit eigener Lösung (Planetendossiers .pd-blaettern, Astralizes .az-durchgang) bleiben unberührt.

const REITER = ".dossier-seitennavigation, nav.aporia-reiterleiste, nav[class$='-reiter'], nav[class*='-reiter ']";
const NAVIGATION = ".aporia-topbar, [data-aporia-topbar], #aporia-sidebar-host, [data-aporia-sidebar]";

function starte() {
    if (document.querySelector(".pd-blaettern, .az-durchgang, .aporia-kapitel")) return;
    const leiste = [...document.querySelectorAll(REITER)].find((n) => !n.closest(NAVIGATION));
    const main = document.querySelector("main");
    if (!leiste || !main) return;

    const links = [...leiste.querySelectorAll("a[href]:not([data-kapitel-aus])")];   // data-kapitel-aus: z. B. Emblem/Marke
    const hier = location.href.split("#")[0];
    let index = links.findIndex((a) => a.hasAttribute("aria-current"));
    if (index < 0) index = links.findIndex((a) => a.href.split("#")[0] === hier);
    if (index < 0 || links.length < 2) return;

    // alte Blätter-Leisten ersetzen
    for (const alt of main.querySelectorAll("[class$='-blaettern'], .noe-pager")) alt.remove();

    // Titel ohne Symbole (aria-hidden) und ohne vorangestellte Nummer („02 Bewusstsein“ → „Bewusstsein“)
    const titel = (a) => {
        const kopie = a.cloneNode(true);
        kopie.querySelectorAll("[aria-hidden='true']").forEach((x) => x.remove());
        return kopie.textContent.replace(/\s+/g, " ").trim().replace(/^(?:\d{1,2}|M(?=M))\s*/u, "").trim();
    };
    const karte = (a, art, klasse) => {
        const el = document.createElement("a");
        el.href = a.href;
        el.className = klasse;
        if (a.dataset.route) el.dataset.route = a.dataset.route;
        el.innerHTML = "<small></small><strong></strong>";
        el.querySelector("small").textContent = art;
        el.querySelector("strong").textContent = titel(a);
        return el;
    };
    const erstes = links[0];
    // Auf der Übersicht (Kapitel 1) gibt es kein „Vorheriges Kapitel“
    const vor = index > 0 ? karte(links[index - 1], "← Vorheriges Kapitel", "aporia-kapitel-zurueck") : null;
    const weiter = index < links.length - 1 ? karte(links[index + 1], "Nächstes Kapitel →", "aporia-kapitel-weiter") : karte(erstes, "Zurück zur Übersicht →", "aporia-kapitel-weiter");
    const mitte = document.createElement("a");
    mitte.href = erstes.href;
    mitte.className = "aporia-kapitel-mitte";
    mitte.innerHTML = `<small>Kapitel</small><b>${String(index + 1).padStart(2, "0")} / ${links.length}</b><small>Zur Übersicht</small>`;

    const nav = document.createElement("nav");
    nav.className = "aporia-kapitel";
    nav.setAttribute("aria-label", "Kapitel blättern");
    if (!vor) nav.classList.add("aporia-kapitel--start");
    nav.append(...[vor, mitte, weiter].filter(Boolean));
    const dialog = main.querySelector(":scope > dialog");
    if (dialog) dialog.before(nav); else main.append(nav);

    // Kopfbild der Ziel-Seiten als Hintergrund der Karten
    for (const a of [vor, weiter].filter(Boolean)) {
        fetch(a.href).then((r) => (r.ok ? r.text() : "")).then((html) => {
            if (!html) return;
            const seite = new DOMParser().parseFromString(html, "text/html");
            const img = seite.querySelector("header img, [class*='hero'] img, main img");
            const src = img?.getAttribute("src");
            if (src) a.prepend(Object.assign(document.createElement("img"), { src: new URL(src, a.href).href, alt: "", loading: "lazy", decoding: "async" }));
        }).catch(() => {});
    }
}

// Stylesheet einmal einbinden (liegt neben diesem Modul)
if (!document.querySelector("link[data-aporia-kapitel]")) {
    const css = Object.assign(document.createElement("link"), { rel: "stylesheet", href: new URL("./aporia-kapitel-weiter.css", import.meta.url).href });
    css.dataset.aporiaKapitel = "";
    document.head.append(css);
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", starte, { once: true });
else starte();
