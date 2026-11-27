// Inhalts-Übersichten (Szene mit Flächen, siehe Archivansicht.css) · Kartenansicht fürs Handy
// Wird automatisch von Menüs/adapter/aporia-handy.js geladen, sobald eine Seite  nav.scene > a.scene-link  enthält.
// Baut unter der Szene je Fläche eine Karte mit dem passenden Bildausschnitt (gleiche Daten wie die Szene:
// --art, --shape, background-size/-position). Sichtbar nur in der Handy-Ansicht (CSS).
// Neue Übersichtsseiten brauchen nichts weiter – Markup wie bisher genügt.

const szene = document.querySelector("nav.scene");
if (szene && !document.querySelector(".scene-karten")) {
    const [breite, hoehe] = (szene.style.aspectRatio || "16 / 9").split("/").map(Number);
    const links = [...szene.querySelectorAll(":scope > a.scene-link")];

    const bereich = document.createElement("section");
    bereich.className = "scene-karten";
    bereich.setAttribute("aria-label", "Bereiche");
    bereich.style.setProperty("--art", szene.style.getPropertyValue("--art"));

    const kopf = document.createElement("p");
    kopf.className = "scene-karten-kopf";
    kopf.textContent = `Bereiche · ${links.length}`;
    bereich.append(kopf);

    const liste = document.createElement("div");
    liste.className = "scene-karten-liste";
    for (const link of links) {
        const karte = document.createElement("a");
        karte.className = "scene-karte";
        karte.href = link.getAttribute("href");
        // Ziel wie die Fläche in der Szene (falls Routen den Link später umschreiben)
        karte.addEventListener("click", event => { event.preventDefault(); link.click(); });

        const bild = document.createElement("span");
        bild.className = "scene-karte-bild";
        bild.setAttribute("aria-hidden", "true");
        const w = parseFloat(link.style.width) || 30, h = parseFloat(link.style.height) || 30;
        bild.style.aspectRatio = `${(w * breite).toFixed(1)} / ${(h * hoehe).toFixed(1)}`;
        bild.style.backgroundSize = link.style.backgroundSize;
        bild.style.backgroundPosition = link.style.backgroundPosition;
        bild.style.setProperty("--shape", link.style.getPropertyValue("--shape"));

        const titel = document.createElement("span");
        titel.className = "scene-karte-titel";
        titel.textContent = link.querySelector("span")?.textContent.trim() || link.getAttribute("aria-label") || "";

        const pfeil = document.createElement("span");
        pfeil.className = "scene-karte-pfeil";
        pfeil.setAttribute("aria-hidden", "true");
        pfeil.textContent = "→";

        karte.append(bild, titel, pfeil);
        liste.append(karte);
    }
    bereich.append(liste);
    szene.after(bereich);
}
