// Kryonoiden – Seitenklänge
// · Eintrittsklang (einmalig, kein Loop) auf Seiten mit <body data-kr-eintritt>, also der Hauptseite.
//   Blockiert der Browser die automatische Wiedergabe, erklingt er bei der ersten Interaktion auf der Seite.
// · Kurzer Frostklang beim Wechsel über die Reiterleiste (und „Blättern“); die Navigation folgt nach dem Klang.
// · Ton-Schalter im Kopf; die Wahl wird je Browser gemerkt.
// Die Dateien sind in inhalte/medien/medien.json unter „kryonoiden.ui.*“ eingetragen.
import { getAporiaMedia } from "../../../../Men%C3%BCs/adapter/aporia-media.js";

const SPEICHER = "aporia-kryonoiden-ton";
let tonAn = true;
try { tonAn = localStorage.getItem(SPEICHER) !== "aus"; } catch { /* ohne Speicher: Ton an */ }

async function lade(schluessel, lautstaerke) {
    const medium = await getAporiaMedia(schluessel);
    if (!medium?.url) return null;
    const audio = new Audio(medium.url);
    audio.preload = "auto";
    audio.volume = lautstaerke;
    return audio;
}

// Ton-Schalter
const schalter = document.createElement("button");
schalter.type = "button";
schalter.className = "kr-ton";
const schalterText = () => {
    schalter.setAttribute("aria-pressed", String(tonAn));
    schalter.textContent = tonAn ? "🔊 Klang an" : "🔇 Klang aus";
    schalter.title = tonAn ? "Seitenklänge ausschalten" : "Seitenklänge einschalten";
};
schalterText();
document.querySelector(".kr-hero")?.append(schalter);

const [eintritt, wechsel] = await Promise.all([
    document.body.hasAttribute("data-kr-eintritt") ? lade("kryonoiden.ui.eintritt", .55) : null,
    lade("kryonoiden.ui.reiterwechsel", .6),
]);

schalter.addEventListener("click", () => {
    tonAn = !tonAn;
    try { localStorage.setItem(SPEICHER, tonAn ? "an" : "aus"); } catch { /* nur für diese Sitzung */ }
    if (!tonAn) eintritt?.pause();
    schalterText();
});

// Eintrittsklang
let eintrittErledigt = !eintritt;
function eintrittSpielen() {
    if (eintrittErledigt || !tonAn) return;
    eintrittErledigt = true;
    eintritt.currentTime = 0;
    eintritt.play().catch(() => { eintrittErledigt = false; });
}
if (eintritt && tonAn) {
    eintritt.loop = false;
    eintritt.play().then(() => { eintrittErledigt = true; }).catch(() => {
        // Autoplay blockiert → bei der ersten Interaktion nachholen (nicht bei Klick auf Reiter oder den Ton-Schalter)
        const nachholen = (event) => {
            if (event.target.closest?.(".kr-reiter a, .kr-blaettern a, .kr-ton")) { eintrittErledigt = true; return; }
            eintrittSpielen();
        };
        document.addEventListener("pointerdown", nachholen, { once: true, capture: true });
        document.addEventListener("keydown", nachholen, { once: true, capture: true });
    });
}

// Frostklang beim Reiterwechsel
function wechselnMitKlang(event) {
    const link = event.target.closest("a[href]");
    if (!link || link.getAttribute("aria-current") === "page") return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === "_blank") return;
    if (!tonAn || !wechsel) return;
    event.preventDefault();
    eintrittErledigt = true;
    eintritt?.pause();
    wechsel.currentTime = 0;
    const ziel = link.href;
    let weg = false;
    const gehen = () => { if (!weg) { weg = true; location.href = ziel; } };
    wechsel.addEventListener("ended", gehen, { once: true });
    wechsel.play().catch(gehen);
    setTimeout(gehen, 450);
}
for (const leiste of document.querySelectorAll(".kr-reiter, .kr-blaettern")) leiste.addEventListener("click", wechselnMitKlang);
