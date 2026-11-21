// Gemeinsames Bildkarussell für Speziesseiten (Spur mit Scroll-Snap, Pfeile, Punkte, Filter, optional Autoplay).
// Markup: [data-karussell] > .karussell-spur > .karussell-folie (figure mit button.karussell-bild > img)
//         optional [data-filter]-Knöpfe, [data-karussell-schritt], [data-karussell-pause], .karussell-punkte, .karussell-zaehler
// Aufruf: mountBilderKarussell(wurzel, { oeffnen(bilder, index) }) – oeffnen erhält die sichtbaren <img> und den Index.
const ruhig = matchMedia("(prefers-reduced-motion: reduce)");

export function mountBilderKarussell(wurzel, { oeffnen } = {}) {
    const spur = wurzel.querySelector(".karussell-spur");
    const alle = [...spur.querySelectorAll(".karussell-folie")];
    const punkte = wurzel.querySelector(".karussell-punkte");
    const zaehler = wurzel.querySelector(".karussell-zaehler");
    const pause = wurzel.querySelector("[data-karussell-pause]");
    const takt = Number(wurzel.dataset.autoplay) || 0;
    let sichtbar = alle, aktuell = 0, uhr = 0, angehalten = false, imBild = true, schwebt = false;

    const markieren = () => {
        sichtbar.forEach((folie, i) => {
            folie.setAttribute("aria-label", `${i + 1} von ${sichtbar.length}`);
            folie.classList.toggle("is-aktiv", i === aktuell);
        });
        punkte?.querySelectorAll("button").forEach((p, i) => p.setAttribute("aria-current", String(i === aktuell)));
        if (zaehler) zaehler.textContent = sichtbar.length ? `${aktuell + 1} / ${sichtbar.length}` : "0 / 0";
    };
    const gehe = (index, sanft = true) => {
        if (!sichtbar.length) return;
        aktuell = (index + sichtbar.length) % sichtbar.length;
        spur.scrollTo({ left: sichtbar[aktuell].offsetLeft - spur.offsetLeft, behavior: sanft && !ruhig.matches ? "smooth" : "auto" });
        markieren();
    };
    const punkteBauen = () => {
        if (!punkte) return;
        punkte.replaceChildren(...sichtbar.map((folie, i) => {
            const p = document.createElement("button");
            p.type = "button";
            p.setAttribute("aria-label", `Bild ${i + 1}: ${folie.querySelector("img")?.alt ?? ""}`);
            p.addEventListener("click", () => { gehe(i); neustart(); });
            return p;
        }));
    };

    // Aktive Folie aus der Scrollposition ableiten (Wischen, Trackpad, Tastatur in der Spur)
    let warte = 0;
    spur.addEventListener("scroll", () => {
        clearTimeout(warte);
        warte = setTimeout(() => {
            const links = spur.scrollLeft;
            let bester = 0, abstand = Infinity;
            sichtbar.forEach((folie, i) => { const d = Math.abs(folie.offsetLeft - spur.offsetLeft - links); if (d < abstand) { abstand = d; bester = i; } });
            if (bester !== aktuell) { aktuell = bester; markieren(); }
        }, 90);
    }, { passive: true });

    wurzel.querySelectorAll("[data-karussell-schritt]").forEach((k) => k.addEventListener("click", () => { gehe(aktuell + Number(k.dataset.karussellSchritt)); neustart(); }));
    wurzel.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        if (event.target.closest("[data-filter]")) return;
        event.preventDefault();
        gehe(aktuell + (event.key === "ArrowRight" ? 1 : -1));
        neustart();
    });

    // Filter nach Kategorie
    const filter = wurzel.querySelectorAll("[data-filter]");
    filter.forEach((knopf) => knopf.addEventListener("click", () => {
        filter.forEach((k) => k.setAttribute("aria-pressed", String(k === knopf)));
        alle.forEach((folie) => { folie.hidden = knopf.dataset.filter !== "" && folie.dataset.kategorie !== knopf.dataset.filter; });
        sichtbar = alle.filter((folie) => !folie.hidden);
        punkteBauen();
        gehe(0, false);
    }));

    // Großansicht
    alle.forEach((folie) => folie.querySelector(".karussell-bild")?.addEventListener("click", () => {
        const index = sichtbar.indexOf(folie);
        gehe(index);
        oeffnen?.(sichtbar.map((f) => f.querySelector("img")), index);
    }));

    // Autoplay: nur mit data-autoplay, ohne reduzierte Bewegung, sichtbar und nicht während Maus/Fokus im Karussell
    const laeuft = () => takt && !ruhig.matches && !angehalten && imBild && !schwebt && !document.hidden;
    function neustart() {
        clearInterval(uhr);
        if (laeuft()) uhr = setInterval(() => gehe(aktuell + 1), takt);
    }
    if (takt && !ruhig.matches) {
        wurzel.addEventListener("pointerenter", () => { schwebt = true; neustart(); });
        wurzel.addEventListener("pointerleave", () => { schwebt = false; neustart(); });
        wurzel.addEventListener("focusin", () => { schwebt = true; neustart(); });
        wurzel.addEventListener("focusout", (e) => { if (!wurzel.contains(e.relatedTarget)) { schwebt = false; neustart(); } });
        document.addEventListener("visibilitychange", neustart);
        if ("IntersectionObserver" in window) new IntersectionObserver(([e]) => { imBild = e.isIntersecting; neustart(); }, { threshold: .35 }).observe(wurzel);
        pause?.addEventListener("click", () => {
            angehalten = !angehalten;
            pause.setAttribute("aria-pressed", String(angehalten));
            pause.textContent = angehalten ? "▶ Abspielen" : "❚❚ Pause";
            neustart();
        });
    } else pause?.remove();

    punkteBauen();
    markieren();
    neustart();
    return { gehe };
}
