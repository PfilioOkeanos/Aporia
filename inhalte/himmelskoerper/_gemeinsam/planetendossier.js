// Planetendossier · Verhalten für Planeten-Hauptseiten (pd-haupt) und Kapitelseiten (pd-kapitel)
// Zahlen zählen hoch, Messanzeigen füllen sich, Schichten-Erkundung, Parallaxe im Kopf,
// Einblenden beim Scrollen, Lesefortschritt, Kapitel blättern (mit Bildern der Hauptseite), Wissenssuche.
import { symbolFuer } from "./dossier-symbole.js";
const ruhig = matchMedia("(prefers-reduced-motion: reduce)").matches;
const body = document.body;
if (ruhig) body.classList.add("pd-ohne-bewegung");
const haupt = body.classList.contains("pd-haupt");
const kapitelSeite = body.classList.contains("pd-kapitel");

// ---------- Einblenden beim Scrollen ----------
function einblenden(ziele) {
    if (ruhig || !("IntersectionObserver" in window)) { ziele.forEach((z) => z.classList.add("ist-sichtbar")); return; }
    const beob = new IntersectionObserver((eintraege) => {
        for (const e of eintraege) if (e.isIntersecting) { e.target.classList.add("ist-sichtbar"); beob.unobserve(e.target); }
    }, { rootMargin: "0px 0px -8% 0px" });
    ziele.forEach((z) => beob.observe(z));
}
if (kapitelSeite) document.querySelectorAll(".astro-layout .earth-panel:not(.astro-chapters), .erde-fakt").forEach((z, i) => { z.classList.add("pd-einblenden"); z.style.transitionDelay = `${(i % 4) * 60}ms`; });
einblenden([...document.querySelectorAll(".pd-einblenden")]);

// ---------- Zahlen zählen hoch (Format bleibt erhalten: „12.756 km“, „ca. 9,81 m/s²“) ----------
function zaehle(el) {
    const original = el.textContent;
    const m = original.match(/\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d+(?:,\d+)?/);
    if (!m || ruhig) return;
    const roh = m[0], ziel = Number(roh.replace(/\./g, "").replace(",", "."));
    const nachkomma = (roh.split(",")[1] ?? "").length, tausender = roh.includes(".");
    const format = (n) => n.toLocaleString("de-DE", { minimumFractionDigits: nachkomma, maximumFractionDigits: nachkomma, useGrouping: tausender });
    const start = performance.now(), dauer = 1600;
    const schritt = (t) => {
        const p = Math.min(1, (t - start) / dauer), e = 1 - (1 - p) ** 3;
        el.textContent = original.replace(roh, format(ziel * e));
        if (p < 1) requestAnimationFrame(schritt); else el.textContent = original;
    };
    requestAnimationFrame(schritt);
}
const zahlen = [...document.querySelectorAll("[data-pd-zahl]")];
if ("IntersectionObserver" in window) {
    const beob = new IntersectionObserver((eintraege) => { for (const e of eintraege) if (e.isIntersecting) { zaehle(e.target); beob.unobserve(e.target); } }, { threshold: .6 });
    zahlen.forEach((z) => beob.observe(z));
}

// ---------- Schichten-Erkundung: von außen nach innen ----------
for (const bereich of document.querySelectorAll("[data-pd-schichten]")) {
    const tabs = [...bereich.querySelectorAll('[role="tab"]')];
    const panels = tabs.map((t) => document.getElementById(t.getAttribute("aria-controls")));
    let aktiv = 0, uhr = 0, haelt = false, sichtbar = false;
    const zeige = (i, fokus = false) => {
        aktiv = (i + tabs.length) % tabs.length;
        tabs.forEach((t, j) => { t.setAttribute("aria-selected", String(j === aktiv)); t.tabIndex = j === aktiv ? 0 : -1; panels[j].hidden = j !== aktiv; });
        if (fokus) tabs[aktiv].focus();
        tabs[aktiv].scrollIntoView({ block: "nearest", inline: "nearest" });
    };
    tabs.forEach((t, i) => t.addEventListener("click", () => { zeige(i); haelt = true; }));
    bereich.querySelector('[role="tablist"]').addEventListener("keydown", (e) => {
        const r = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
        if (r) { e.preventDefault(); zeige(aktiv + r, true); haelt = true; }
        if (e.key === "Home") { e.preventDefault(); zeige(0, true); }
        if (e.key === "End") { e.preventDefault(); zeige(tabs.length - 1, true); }
    });
    // langsamer Selbstlauf, solange niemand eingreift und der Bereich sichtbar ist
    if (!ruhig && "IntersectionObserver" in window) {
        new IntersectionObserver(([e]) => { sichtbar = e.isIntersecting; }, { threshold: .4 }).observe(bereich);
        bereich.addEventListener("pointerenter", () => { haelt = true; });
        uhr = setInterval(() => { if (sichtbar && !haelt && !document.hidden) zeige(aktiv + 1); }, 6500);
    }
}

// ---------- Parallaxe im Kopf ----------
const kopf = document.querySelector(".pd-hero");
if (kopf && !ruhig && matchMedia("(pointer: fine)").matches) {
    const globus = kopf.querySelector(".pd-globus"), bild = kopf.querySelector(".pd-hero-bild");
    let zx = 0, zy = 0, x = 0, y = 0, laeuft = false;
    const schritt = () => {
        x += (zx - x) * .06; y += (zy - y) * .06;
        if (globus) globus.style.translate = `${x * -14}px ${y * -10}px`;
        if (bild) bild.style.translate = `${x * 10}px ${y * 6}px`;
        if (Math.abs(zx - x) + Math.abs(zy - y) > .001) requestAnimationFrame(schritt); else laeuft = false;
    };
    kopf.addEventListener("pointermove", (e) => {
        const r = kopf.getBoundingClientRect();
        zx = (e.clientX - r.left) / r.width - .5; zy = (e.clientY - r.top) / r.height - .5;
        if (!laeuft) { laeuft = true; requestAnimationFrame(schritt); }
    });
    kopf.addEventListener("pointerleave", () => { zx = zy = 0; if (!laeuft) { laeuft = true; requestAnimationFrame(schritt); } });
}

// ---------- Kapitelseiten: Leseführung ----------
// Arbeitet nur mit dem, was jede Kapitelseite eines Himmelskörpers hat (.astro-layout, .earth-panel mit h2, .erde-wissen),
// damit dieselbe Datei für alle Planeten, Monde und übrigen Himmelskörper passt. Inhalte werden nicht verändert, nur geordnet.
// Abschnitte sind standardmäßig zugeklappt und zeigen Symbol, Nummer, Titel und eine Vorschau aus dem eigenen Text.
function leseFuehrung() {
    const main = document.querySelector("main");
    const layout = document.querySelector(".astro-layout");
    const rail = layout?.querySelector(":scope > .astro-chapters");
    const inhalt = layout && [...layout.children].find((c) => c !== rail);
    if (!main || !inhalt) return;
    inhalt.classList.add("pd-lesefluss");

    // Hüllen (z. B. Seitenspalten, Themengruppen) lösen sich im Raster auf, ihre Panels reihen sich ein
    const huellen = (el) => { for (const k of el.children) if (!k.matches(".earth-panel") && k.querySelector(".earth-panel")) { k.classList.add("pd-huelle"); huellen(k); } };
    huellen(inhalt);

    const oben = (p) => !p.parentElement.closest(".earth-panel");
    const imInhalt = [...inhalt.querySelectorAll(".earth-panel")].filter((p) => oben(p) && p.querySelector("h2"));
    const danach = [...main.querySelectorAll(":scope > .earth-panel")].filter((p) => p.querySelector("h2"));
    const abschnitte = [...imInhalt, ...danach];
    if (!abschnitte.length) return;
    // Panels nach dem Raster (Wissensdatenbank, Flora/Fauna) in den Lesefluss holen, damit die Leiste links bis zum Ende mitläuft
    for (const p of danach) inhalt.append(p);

    const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const text = (el) => el.textContent.replace(/\s+/g, " ").trim();
    const anzahl = (n, eins, viele) => `${n} ${n === 1 ? eins : viele}`;

    function schalte(e, offen) {
        e.p.classList.toggle("pd-offen", offen);
        e.p.classList.toggle("pd-zu", !offen);
        e.knopf.setAttribute("aria-expanded", String(offen));
        if (offen) {
            e.p.dispatchEvent(new CustomEvent("pd-geoeffnet"));
            requestAnimationFrame(() => dispatchEvent(new Event("resize")));   // Grafiken/Player im Abschnitt messen sich neu
        }
    }

    const eintraege = abschnitte.map((p, i) => {
        const h2 = p.querySelector("h2");
        const titel = text(h2);
        const nr = String(i + 1).padStart(2, "0");
        const sym = symbolFuer(titel);
        p.classList.add("pd-leseabschnitt", "pd-thema-" + sym.thema, "pd-zu");
        if (!p.id) p.id = "abschnitt-" + (slug(titel) || nr);

        // Kopf = direktes Kind des Panels mit der Überschrift; die Überschrift wird zum Schalter
        let kopf = h2;
        while (kopf.parentElement !== p) kopf = kopf.parentElement;
        kopf.classList.add("pd-kopf");
        const knopf = document.createElement("button");
        knopf.type = "button";
        knopf.className = "pd-schalter";
        knopf.setAttribute("aria-expanded", "false");
        knopf.innerHTML = `<span class="pd-symbol">${sym.svg}</span><span class="pd-nr">${nr}</span><span class="pd-titeltext"></span><span class="pd-pfeil" aria-hidden="true"></span>`;
        knopf.querySelector(".pd-titeltext").textContent = titel;
        h2.replaceChildren(knopf);

        // Vorschau im zugeklappten Zustand: erster Satz des Abschnitts + was drin steckt (alles aus der Seite gezählt)
        const quelle = [...p.querySelectorAll("p, li, figcaption")].find((el) => !el.closest(".pd-kopf") && text(el).length > 25);
        let satz = quelle ? text(quelle) : "";
        const ende = satz.match(/^.{25,180}?[.!?](?=\s|$)/);
        satz = ende ? ende[0] : satz.length > 170 ? satz.slice(0, 167).replace(/\s\S*$/, "") + " …" : satz;
        const marken = [];
        const werte = p.querySelectorAll("dt").length;
        const fakten = p.querySelectorAll(".erde-fakt").length;
        const punkte = p.querySelectorAll("li").length;
        if (werte) marken.push(anzahl(werte, "Wert", "Werte"));
        if (fakten) marken.push(anzahl(fakten, "Eintrag", "Einträge"));
        else if (punkte > 1) marken.push(anzahl(punkte, "Punkt", "Punkte"));
        const bilder = [...p.querySelectorAll("img, canvas, figure, svg")].filter((el) => !el.closest(".pd-kopf") && !el.parentElement.closest("figure")).length;
        if (bilder) marken.push(bilder > 1 ? anzahl(bilder, "Grafik", "Grafiken") : "Grafik");
        if (p.querySelector("video")) marken.push("Video");
        if (p.querySelector("audio")) marken.push("Audio");

        const vorschau = document.createElement("div");
        vorschau.className = "pd-vorschau";
        if (satz) vorschau.append(Object.assign(document.createElement("p"), { textContent: satz }));
        if (marken.length) {
            const reihe = Object.assign(document.createElement("div"), { className: "pd-marken" });
            marken.forEach((m) => reihe.append(Object.assign(document.createElement("span"), { textContent: m })));
            vorschau.append(reihe);
        }
        kopf.after(vorschau);

        const e = { p, titel, nr, sym, knopf };
        knopf.addEventListener("click", () => schalte(e, !p.classList.contains("pd-offen")));
        vorschau.addEventListener("click", () => schalte(e, true));
        return e;
    });

    // Werkzeugleiste: alle auf / alle zu
    const werkzeug = document.createElement("div");
    werkzeug.className = "pd-werkzeug";
    werkzeug.innerHTML = `<p><b>${eintraege.length}</b> Abschnitte · Titel antippen zum Aufklappen</p><div><button type="button" data-alle="auf">Alle aufklappen</button><button type="button" data-alle="zu">Alle zuklappen</button></div>`;
    werkzeug.addEventListener("click", (ev) => {
        const b = ev.target.closest("[data-alle]");
        if (b) eintraege.forEach((e) => schalte(e, b.dataset.alle === "auf"));
    });
    inhalt.prepend(werkzeug);

    // Sprungziele (Inhaltsleiste, Einstieg, Sprungleiste, Adresse mit #) öffnen ihren Abschnitt
    const oeffneZiel = (id) => {
        if (!id) return;
        const ziel = document.getElementById(id);
        const e = ziel && eintraege.find((x) => x.p === ziel || x.p.contains(ziel));
        if (e) schalte(e, true);
    };
    document.addEventListener("click", (ev) => {
        const a = ev.target.closest('a[href^="#"]');
        if (a) oeffneZiel(decodeURIComponent(a.getAttribute("href").slice(1)));
    });
    addEventListener("hashchange", () => oeffneZiel(decodeURIComponent(location.hash.slice(1))));
    if (location.hash) oeffneZiel(decodeURIComponent(location.hash.slice(1)));

    // Leiste links: „Auf dieser Seite“ mit Symbolen oben, alle Kapitel darunter zum Aufklappen
    if (rail && !rail.querySelector(".pd-toc")) {
        const alle = document.createElement("details");
        alle.className = "pd-alle-kapitel";
        const sum = document.createElement("summary");
        sum.textContent = rail.querySelector("h2")?.textContent.trim() || "Alle Kapitel";
        alle.append(sum, ...[...rail.childNodes].filter((n) => !(n.nodeType === 1 && n.matches("h2"))));
        rail.querySelector("h2")?.remove();
        const toc = document.createElement("div");
        toc.className = "pd-toc";
        toc.innerHTML = `<p class="pd-toc-titel">Auf dieser Seite</p><ol></ol>`;
        for (const e of eintraege) {
            const li = document.createElement("li");
            li.className = "pd-thema-" + e.sym.thema;
            li.innerHTML = `<a href="#${e.p.id}"><span class="pd-toc-symbol">${e.sym.svg}</span><span><small>${e.nr}</small><b></b></span></a>`;
            li.querySelector("b").textContent = e.titel;
            e.link = li.querySelector("a");
            toc.querySelector("ol").append(li);
        }
        rail.append(toc, alle);
        rail.classList.add("pd-leseleiste");

        // Aktueller Abschnitt + Fortschritt auf der Leitlinie
        let zuletzt = -1;
        const setze = (i) => {
            eintraege.forEach((e, j) => { e.link.toggleAttribute("aria-current", j === i); e.link.classList.toggle("ist-gelesen", j < i); e.p.classList.toggle("pd-aktiv", j === i); });
            toc.style.setProperty("--pd-toc-wert", eintraege.length > 1 ? i / (eintraege.length - 1) : 1);
            // lange Listen: aktuellen Eintrag in der Leiste sichtbar halten (nur die Leiste scrollt, nicht die Seite)
            if (i !== zuletzt && rail.scrollHeight > rail.clientHeight) {
                const rr = rail.getBoundingClientRect(), lr = eintraege[i].link.getBoundingClientRect(), rand = 60;
                if (lr.top < rr.top + rand) rail.scrollTop -= rr.top + rand - lr.top;
                else if (lr.bottom > rr.bottom - rand) rail.scrollTop += lr.bottom - rr.bottom + rand;
            }
            zuletzt = i;
        };
        const pruefe = () => {
            const linie = innerHeight * .35;
            let i = 0;
            eintraege.forEach((e, j) => { if (e.p.getBoundingClientRect().top <= linie) i = j; });
            setze(i);
        };
        addEventListener("scroll", () => requestAnimationFrame(pruefe), { passive: true });
        pruefe();
    }

    // Kopf: Umfang der Seite auf einen Blick (aus der Seite berechnet)
    const kopf = document.querySelector(".earth-hero > :is(.astro-intro, .earth-title, .nature-hero-copy)") ?? document.querySelector(".earth-hero");
    if (kopf && !document.querySelector(".pd-lesemeta")) {
        const woerter = main.innerText.split(/\s+/).filter(Boolean).length;
        const fakten = document.querySelectorAll(".erde-fakt").length;
        const teile = [`${eintraege.length} Abschnitte`];
        if (fakten) teile.push(`${fakten} Wissenseinträge`);
        teile.push(`ca. ${Math.max(1, Math.round(woerter / 200))} Min. Lesezeit`);
        const meta = document.createElement("p");
        meta.className = "pd-lesemeta";
        meta.innerHTML = teile.map((t) => `<span>${t}</span>`).join("");
        const start = document.createElement("a");
        start.href = "#" + eintraege[0].p.id;
        start.className = "pd-lesestart";
        start.textContent = "Lesen beginnen ↓";
        meta.append(start);
        kopf.append(meta);
    }

    // Wissensdatenbank: Sprungleiste und gekürzte lange Karten (gemessen, sobald der Abschnitt offen ist)
    for (const block of document.querySelectorAll(".erde-wissen")) {
        const fakten = [...block.querySelectorAll(".erde-fakt")];
        const kopfzeile = block.querySelector(":scope > header");
        const mitTitel = fakten.filter((f) => f.querySelector("h3"));
        if (kopfzeile && mitTitel.length > 3 && !block.querySelector(".pd-sprung")) {
            const leiste = document.createElement("nav");
            leiste.className = "pd-sprung";
            leiste.setAttribute("aria-label", "Zu einem Eintrag springen");
            mitTitel.forEach((f, i) => {
                const h3 = f.querySelector("h3");
                if (!f.id) f.id = "eintrag-" + (slug(h3.textContent) || i);
                const a = document.createElement("a");
                a.href = "#" + f.id;
                a.textContent = h3.textContent.trim().replace(/^(\d+)\s*/, "$1 · ");
                leiste.append(a);
            });
            (block.querySelector(".pd-vorschau") ?? kopfzeile).after(leiste);
        }
        const kuerze = () => fakten.forEach((f) => {
            if (f.classList.contains("pd-kurz-offen") || f.querySelector(".pd-mehr") || !f.offsetHeight) return;
            if (f.scrollHeight < 560) return;
            f.classList.add("pd-gekuerzt");
            const knopf = document.createElement("button");
            knopf.type = "button";
            knopf.className = "pd-mehr";
            knopf.textContent = "Weiterlesen";
            knopf.setAttribute("aria-expanded", "false");
            knopf.addEventListener("click", () => {
                const offen = f.classList.toggle("pd-kurz-offen");
                knopf.textContent = offen ? "Weniger anzeigen" : "Weiterlesen";
                knopf.setAttribute("aria-expanded", String(offen));
                if (!offen) f.scrollIntoView({ block: "nearest" });
            });
            f.append(knopf);
        });
        block.addEventListener("pd-geoeffnet", () => requestAnimationFrame(kuerze));
        addEventListener("load", kuerze, { once: true });
    }
}
if (kapitelSeite) leseFuehrung();

// ---------- Kapitelseiten: Lesefortschritt und Blättern ----------
if (kapitelSeite) {
    const leiste = Object.assign(document.createElement("div"), { className: "pd-fortschritt" });
    leiste.setAttribute("aria-hidden", "true");
    body.append(leiste);
    const fortschritt = () => {
        const max = document.documentElement.scrollHeight - innerHeight;
        leiste.style.setProperty("--fortschritt", max > 0 ? Math.min(1, scrollY / max) : 0);
    };
    addEventListener("scroll", fortschritt, { passive: true });
    fortschritt();

    const links = [...document.querySelectorAll(".astro-chapters a[href]")].filter((a) => !a.closest(".pd-toc"));
    const index = links.findIndex((a) => a.hasAttribute("aria-current"));
    const hauptseite = document.querySelector('.earth-crumb a[href*="hauptseite"]')?.href;
    if (index >= 0 && hauptseite) {
        const nav = document.createElement("nav");
        nav.className = "pd-blaettern";
        nav.setAttribute("aria-label", "Kapitel blättern");
        const karte = (a, art, klasse) => {
            const el = document.createElement("a");
            el.href = a ? a.href : hauptseite;
            el.className = klasse;
            el.innerHTML = `<small></small><strong></strong>`;
            el.querySelector("small").textContent = art;
            el.querySelector("strong").textContent = a ? a.textContent.trim() : "Übersicht";
            return el;
        };
        const vor = karte(links[index - 1], index > 0 ? "← Vorheriges Kapitel" : "← Zurück", "pd-blaettern-zurueck");
        const weiter = karte(links[index + 1], index < links.length - 1 ? "Nächstes Kapitel →" : "Zurück zur Übersicht →", "pd-blaettern-weiter");
        const mitte = Object.assign(document.createElement("a"), { href: hauptseite, className: "pd-blaettern-mitte" });
        mitte.innerHTML = `<small>Kapitel</small><b>${String(index + 1).padStart(2, "0")} / ${links.length}</b><small>Zur Übersicht</small>`;
        nav.append(vor, mitte, weiter);
        (document.querySelector("main") ?? body).append(nav);
        // Bilder der Kapitel aus den Kacheln der Hauptseite übernehmen
        fetch(hauptseite).then((r) => r.ok ? r.text() : "").then((html) => {
            if (!html) return;
            const seite = new DOMParser().parseFromString(html, "text/html");
            const bilder = new Map([...seite.querySelectorAll(".pd-kachel")].map((k) => [new URL(k.getAttribute("href"), hauptseite).href, new URL(k.querySelector("img").getAttribute("src"), hauptseite).href]));
            for (const a of [vor, weiter]) {
                const src = bilder.get(a.href);
                if (src) a.prepend(Object.assign(document.createElement("img"), { src, alt: "", loading: "lazy", decoding: "async" }));
            }
        }).catch(() => {});
    }
}

// ---------- Wissenssuche in Kapiteln (Filter über Faktenkarten) ----------
for (const block of document.querySelectorAll(".erde-wissen")) {
    const feld = block.querySelector(".erde-wissen-suche");
    if (!feld) continue;
    const fakten = [...block.querySelectorAll(".erde-fakt")];
    feld.addEventListener("input", () => {
        const q = feld.value.trim().toLocaleLowerCase("de");
        for (const f of fakten) f.hidden = q !== "" && !f.textContent.toLocaleLowerCase("de").includes(q);
    });
}
