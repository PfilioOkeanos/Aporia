// Erde – lebendige Effekte für Hauptseite und alle Kapitelseiten:
// Sternenhimmel, Einblenden beim Scrollen, Kapitelleiste (zurück/weiter + Fortschritt), Suche in der Wissensdatenbank.
// Wird von jeder Seite eingebunden (nicht über erde.js, das auch „Die Erde aus dem All“ nutzt).

const KAPITEL = ["Allgemeines", "Astronomie", "Physik", "Planetare Struktur", "Geografie", "Atmosphäre", "Klima", "Gewässer", "Geologie",
    "Biosphäre", "Spezies", "Zivilisation", "Geschichte", "Fraktionen", "Rohstoffe", "Erforschung", "Besonderheiten", "Medienarchiv"];
const BASIS = new URL("../", import.meta.url);
const kapitelUrl = (i) => new URL(`unterseiten/${String(i + 1).padStart(2, "0")} – ${KAPITEL[i]}/index.html`, BASIS).href;
const ruhig = matchMedia("(prefers-reduced-motion: reduce)").matches;

function sternenhimmel() {
    const leinwand = document.createElement("canvas");
    leinwand.className = "erde-sterne";
    leinwand.setAttribute("aria-hidden", "true");
    document.body.prepend(leinwand);
    const ctx = leinwand.getContext("2d");
    let sterne = [];
    let breite = 0;
    let hoehe = 0;
    function groesse() {
        const dpr = Math.min(devicePixelRatio || 1, 2);
        breite = innerWidth;
        hoehe = innerHeight;
        leinwand.width = breite * dpr;
        leinwand.height = hoehe * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const anzahl = Math.round(breite * hoehe / 5200);
        sterne = Array.from({ length: anzahl }, () => ({
            x: Math.random() * breite, y: Math.random() * hoehe, r: Math.random() * 1.2 + .2,
            p: Math.random() * Math.PI * 2, v: Math.random() * .8 + .2, f: Math.random() < .12 ? "#bfe4ff" : Math.random() < .08 ? "#ffe2b0" : "#ffffff",
        }));
        zeichnen(0);
    }
    function zeichnen(t) {
        ctx.clearRect(0, 0, breite, hoehe);
        for (const s of sterne) {
            ctx.globalAlpha = .35 + .65 * Math.abs(Math.sin(s.p + t * .0006 * s.v));
            ctx.fillStyle = s.f;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    groesse();
    addEventListener("resize", groesse);
    if (ruhig) return;
    let letzte = 0;
    (function schleife(t) {
        if (!document.hidden && t - letzte > 60) { zeichnen(t); letzte = t; }
        requestAnimationFrame(schleife);
    })(0);
}

function einblenden() {
    const ziele = document.querySelectorAll(".earth-panel:not(.astro-chapters), .erde-fakt, .erde-abschnitt, .general-cards > *, .nature-cards > article");
    if (ruhig || !("IntersectionObserver" in window)) return;
    const beobachter = new IntersectionObserver((eintraege) => {
        for (const e of eintraege) if (e.isIntersecting) { e.target.classList.add("ist-sichtbar"); beobachter.unobserve(e.target); }
    }, { rootMargin: "0px 0px -6% 0px" });
    ziele.forEach((ziel, i) => {
        ziel.classList.add("erde-reveal");
        ziel.style.transitionDelay = `${(i % 4) * 70}ms`;
        beobachter.observe(ziel);
    });
}

function kapitelleiste() {
    const pfad = decodeURIComponent(location.pathname);
    const treffer = pfad.match(/unterseiten\/(\d\d) – /);
    const index = treffer ? Number(treffer[1]) - 1 : -1;
    const leiste = document.createElement("nav");
    leiste.className = "erde-kapitelleiste";
    leiste.setAttribute("aria-label", "Kapitel blättern");
    const link = (href, text) => Object.assign(document.createElement("a"), { href, textContent: text });
    const vorher = index > 0 ? link(kapitelUrl(index - 1), "← " + KAPITEL[index - 1]) : link(new URL("hauptseite/index.html", BASIS).href, "← Übersicht");
    const weiter = index < KAPITEL.length - 1 ? link(kapitelUrl(index + 1), KAPITEL[index + 1] + " →") : link(new URL("hauptseite/index.html", BASIS).href, "Übersicht →");
    const fortschritt = document.createElement("span");
    fortschritt.className = "erde-fortschritt";
    const wert = index < 0 ? 0 : ((index + 1) / KAPITEL.length) * 100;
    fortschritt.innerHTML = `<span>${index < 0 ? "Übersicht" : `Kapitel ${index + 1} / ${KAPITEL.length}`}</span><i style="--wert:${wert}%"></i>`;
    if (index < 0) leiste.append(fortschritt, link(kapitelUrl(0), "Dossier starten →"));
    else leiste.append(vorher, fortschritt, weiter);
    (document.querySelector("main") ?? document.body).append(leiste);
}

function wissenssuche() {
    for (const block of document.querySelectorAll(".erde-wissen")) {
        const feld = block.querySelector(".erde-wissen-suche");
        if (!feld) continue;
        const fakten = [...block.querySelectorAll(".erde-fakt")];
        feld.addEventListener("input", () => {
            const q = feld.value.trim().toLocaleLowerCase("de");
            for (const f of fakten) f.hidden = q !== "" && !f.textContent.toLocaleLowerCase("de").includes(q);
        });
    }
}

sternenhimmel();
einblenden();
kapitelleiste();
wissenssuche();
