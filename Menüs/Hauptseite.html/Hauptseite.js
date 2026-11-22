import { applyAporiaRoutes, getAporiaRoute } from "../adapter/aporia-routes.js";
import { getCelestialDetailUrl, loadCelestialCatalog } from "../adapter/aporia-celestial.js";
import { getAporiaMedia } from "../adapter/aporia-media.js";
import { loadVisibleLoop } from "../adapter/aporia-media-visibility.js";
import { starteArchivsuche } from "../adapter/aporia-archivsuche.js";
import "../TopBar/Top_bar.js";
import "../Side_bar/side_bar.js";

const ruhig = matchMedia("(prefers-reduced-motion: reduce)").matches;
const zahlFormat = new Intl.NumberFormat("de-DE");

applyAporiaRoutes(document);
for (const link of document.querySelectorAll("a[data-planet-dossier]")) {
    link.href = getCelestialDetailUrl("planeten", link.dataset.planetDossier);
}

// ---------- Archivsuche im Kopf (gemeinsamer Adapter wie in der Topbar) ----------
const suche = document.querySelector(".home-suche");
if (suche) starteArchivsuche(suche);

// ---------- Wechselnde Leitworte ----------
const leitwort = document.querySelector("[data-home-leitwort]");
const LEITWORTE = ["Fremde Welten erkunden", "Spezies begegnen", "Sternsysteme vermessen", "Fraktionen verstehen", "Rohstoffe aufspüren", "Geheimnisse erforschen"];
if (leitwort && !ruhig) {
    let i = 0;
    setInterval(() => {
        if (document.hidden) return;
        leitwort.classList.add("is-wechsel");
        setTimeout(() => {
            i = (i + 1) % LEITWORTE.length;
            leitwort.textContent = LEITWORTE[i];
            leitwort.classList.remove("is-wechsel");
        }, 350);
    }, 3200);
}

// ---------- Sternenfeld mit leichter Parallaxe zur Maus ----------
const leinwand = document.querySelector(".home-sterne");
if (leinwand && !ruhig) {
    const ctx = leinwand.getContext("2d");
    const kopf = leinwand.closest(".home-hero");
    let sterne = [], breite = 0, hoehe = 0, mausX = 0, mausY = 0, zielX = 0, zielY = 0, sichtbar = true;
    const neu = () => {
        const dpr = Math.min(devicePixelRatio || 1, 2);
        breite = Math.min(kopf.clientWidth, 4000); hoehe = Math.min(kopf.clientHeight, 2000);
        if (!breite || !hoehe) return;
        leinwand.width = breite * dpr; leinwand.height = hoehe * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        sterne = Array.from({ length: Math.round(breite * hoehe / 5200) }, () => ({ x: Math.random() * breite, y: Math.random() * hoehe, r: Math.random() * 1.3 + .2, t: Math.random() * 3 + .4, p: Math.random() * Math.PI * 2 }));
    };
    kopf.addEventListener("pointermove", (e) => { const r = kopf.getBoundingClientRect(); zielX = (e.clientX - r.left) / r.width - .5; zielY = (e.clientY - r.top) / r.height - .5; });
    kopf.addEventListener("pointerleave", () => { zielX = zielY = 0; });
    new ResizeObserver(neu).observe(kopf);
    new IntersectionObserver(([e]) => { sichtbar = e.isIntersecting; }).observe(kopf);
    const male = (zeit) => {
        requestAnimationFrame(male);
        if (!sichtbar || document.hidden) return;
        mausX += (zielX - mausX) * .05; mausY += (zielY - mausY) * .05;
        ctx.clearRect(0, 0, breite, hoehe);
        for (const s of sterne) {
            const x = (s.x - mausX * s.t * 18 + breite) % breite, y = (s.y - mausY * s.t * 12 + hoehe) % hoehe;
            ctx.globalAlpha = .35 + .45 * Math.sin(zeit / 900 * s.t + s.p) ** 2;
            ctx.fillStyle = s.t > 2.6 ? "#ffe2b0" : "#dfe9ff";
            ctx.beginPath(); ctx.arc(x, y, s.r, 0, Math.PI * 2); ctx.fill();
        }
    };
    neu();
    requestAnimationFrame(male);
}

// ---------- Emblem neigt sich zur Maus ----------
const emblem = document.querySelector("[data-home-neigung]");
if (emblem && !ruhig && matchMedia("(pointer: fine)").matches) {
    const bereich = emblem.closest(".home-universe");
    bereich.addEventListener("pointermove", (e) => {
        const r = emblem.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        emblem.style.setProperty("--neigung-x", (-y * 7).toFixed(2) + "deg");
        emblem.style.setProperty("--neigung-y", (x * 9).toFixed(2) + "deg");
    });
    bereich.addEventListener("pointerleave", () => { emblem.style.removeProperty("--neigung-x"); emblem.style.removeProperty("--neigung-y"); });
}

// ---------- Bereiche blenden beim Scrollen ein ----------
const einblenden = document.querySelectorAll(".home-einblenden");
if ("IntersectionObserver" in window && !ruhig) {
    const beob = new IntersectionObserver((eintraege) => {
        for (const e of eintraege) if (e.isIntersecting) { e.target.classList.add("is-sichtbar"); beob.unobserve(e.target); }
    }, { rootMargin: "0px 0px -8% 0px" });
    einblenden.forEach((b) => beob.observe(b));
} else einblenden.forEach((b) => b.classList.add("is-sichtbar"));

// ---------- Zahlen zählen hoch ----------
function zaehle(el, ziel) {
    if (ruhig) { el.textContent = zahlFormat.format(ziel); return; }
    const start = performance.now(), dauer = 1400;
    const schritt = (t) => { const p = Math.min(1, (t - start) / dauer); el.textContent = zahlFormat.format(Math.round(ziel * (1 - (1 - p) ** 3))); if (p < 1) requestAnimationFrame(schritt); };
    requestAnimationFrame(schritt);
}
const zahlen = new Map();
const zahlBereich = document.querySelector(".home-zahlen");
let zahlenSichtbar = false;
function setzeZahl(name, wert) {
    zahlen.set(name, wert);
    const el = document.querySelector(`[data-home-zahl="${name}"]`);
    if (el && zahlenSichtbar) zaehle(el, wert);
}
if (zahlBereich) new IntersectionObserver(([e], beob) => {
    if (!e.isIntersecting) return;
    zahlenSichtbar = true; beob.disconnect();
    for (const [name, wert] of zahlen) zaehle(document.querySelector(`[data-home-zahl="${name}"]`), wert);
}).observe(zahlBereich);

// ---------- Himmelskörper: Zahlen, „Welt des Augenblicks“, „Zufällige Welt“ ----------
const kataloge = {};
for (const art of ["planeten", "monde", "sterne"]) {
    kataloge[art] = loadCelestialCatalog(art).then((liste) => { setzeZahl(art, liste.length); return liste; }).catch(() => []);
}
const welt = document.querySelector("[data-home-welt]");
const neuKnopf = document.querySelector("[data-home-welt-neu]");
const zufallKnopf = document.querySelector("[data-home-zufall]");
const mitBild = async () => (await Promise.all([kataloge.planeten, kataloge.monde])).flat().filter((k) => k.preview && k.href);
const TYP = { planeten: "Planet", monde: "Mond" };
async function zeigeWelt() {
    const liste = await mitBild();
    if (!liste.length || !welt) return;
    const k = liste[Math.floor(Math.random() * liste.length)];
    const bild = welt.querySelector("[data-home-welt-bild]");
    welt.classList.add("is-wechsel");
    await new Promise((r) => setTimeout(r, ruhig ? 0 : 250));
    // Vorschau ist ein Schlüssel im Medienregister (z. B. himmelskoerper.bildarchiv.…) oder bereits ein Pfad
    const medium = /^[\w-]+(\.[\w-]+)+$/.test(k.preview) && !/\.(webp|png|jpe?g)$/i.test(k.preview) ? await getAporiaMedia(k.preview) : null;
    bild.src = medium?.url ?? new URL(k.preview, getAporiaRoute("planeten") ?? location.href).href;
    bild.alt = k.title;
    welt.querySelector("[data-home-welt-name]").textContent = k.title;
    welt.querySelector("[data-home-welt-typ]").textContent = k.type || k.group || "Himmelskörper";
    welt.querySelectorAll("[data-home-welt-link]").forEach((a) => { a.href = k.href; });
    bild.onload = () => welt.classList.remove("is-wechsel");
    bild.onerror = () => welt.classList.remove("is-wechsel");
}
mitBild().then((liste) => {
    if (!liste.length) { welt?.querySelector("[data-home-welt-name]") && (welt.querySelector("[data-home-welt-name]").textContent = "Archiv derzeit nicht erreichbar"); return; }
    if (neuKnopf) neuKnopf.disabled = false;
    if (zufallKnopf) zufallKnopf.disabled = false;
    zeigeWelt();
});
neuKnopf?.addEventListener("click", zeigeWelt);
zufallKnopf?.addEventListener("click", async () => {
    const liste = await mitBild();
    if (liste.length) location.assign(liste[Math.floor(Math.random() * liste.length)].href);
});

// ---------- Spezies im Archiv: aus den Übersichtsseiten der Gruppen (wächst automatisch mit) ----------
const GRUPPEN = [["biological", "Biologische Spezies"], ["technological", "Technologische Lebensformen"], ["cosmic", "Kosmische Spezies"], ["gigantic", "Gigantische Lebensformen"], ["mental", "Mentale Spezies"]];
const spur = document.querySelector("[data-home-spezies]");
async function speziesLaden() {
    const gruppen = await Promise.all(GRUPPEN.map(async ([key, name]) => {
        const url = getAporiaRoute("spezies-" + key);
        if (!url) return [];
        try {
            const antwort = await fetch(url);
            if (!antwort.ok) return [];
            const seite = new DOMParser().parseFromString(await antwort.text(), "text/html");
            return [...seite.querySelectorAll(".species-category")].map((karte) => {
                const bild = karte.querySelector("img")?.getAttribute("src") ?? "";
                const route = karte.querySelector("[data-route]")?.dataset.route;
                return { name: karte.querySelector("h2, h3")?.textContent.trim(), text: karte.querySelector(".species-card-copy p, p")?.textContent.trim() ?? "", gruppe: name, bild: bild ? new URL(bild, url).href : "", eigenesBild: bild && !/Spezies_%C3%BCbersicht|Spezies_übersicht/.test(bild), href: route ? getAporiaRoute(route) : null };
            }).filter((s) => s.name && s.href);
        } catch { return []; }
    }));
    const alle = gruppen.flat();
    setzeZahl("spezies", alle.length);
    return alle.filter((s) => s.eigenesBild);
}
speziesLaden().then((liste) => {
    if (!spur) return;
    if (!liste.length) { spur.querySelector(".home-spezies-status").textContent = "Noch keine Spezies mit eigenem Bild."; return; }
    // Reihenfolge jedes Mal leicht gemischt, damit die Startseite lebendig bleibt
    for (let i = liste.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [liste[i], liste[j]] = [liste[j], liste[i]]; }
    spur.replaceChildren(...liste.map((s, i) => {
        const a = document.createElement("a");
        a.className = "home-spezies-karte";
        a.href = s.href;
        a.innerHTML = `<img loading="${i < 4 ? "eager" : "lazy"}" decoding="async" alt=""><span class="home-spezies-text"><small></small><strong></strong><em></em></span>`;
        a.querySelector("img").src = s.bild;
        a.querySelector("small").textContent = s.gruppe;
        a.querySelector("strong").textContent = s.name;
        a.querySelector("em").textContent = s.text;
        return a;
    }));
});
const schritt = (r) => { const karte = spur?.querySelector(".home-spezies-karte"); if (karte) spur.scrollBy({ left: r * (karte.offsetWidth + 16), behavior: ruhig ? "auto" : "smooth" }); };
document.querySelectorAll("[data-home-spezies-schritt]").forEach((k) => k.addEventListener("click", () => schritt(Number(k.dataset.homeSpeziesSchritt))));
spur?.addEventListener("keydown", (e) => { if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); schritt(e.key === "ArrowRight" ? 1 : -1); } });

// ---------- Hintergrundvideo (Medienregister home.heroVideo) ----------
const video = document.querySelector(".home-hero-video");
const toggle = document.querySelector(".home-video-toggle");
if (video && toggle) {
    const media = await getAporiaMedia(video.dataset.homeVideo);
    if (media?.url) {
        function updateToggle() {
            toggle.textContent = video.paused ? "▶" : "Ⅱ";
            toggle.setAttribute("aria-label", video.paused
                ? "Hintergrundvideo abspielen"
                : "Hintergrundvideo pausieren");
        }

        video.addEventListener("loadeddata", () => video.classList.add("is-ready"));
        video.addEventListener("play", updateToggle);
        video.addEventListener("pause", updateToggle);
        video.addEventListener("error", () => {
            video.classList.remove("is-ready");
            toggle.hidden = true;
        });
        toggle.hidden = false;
        updateToggle();
        loadVisibleLoop(video, video.closest(".home-hero"), media.url, toggle);
    }
}
