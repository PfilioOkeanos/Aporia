const key = "aporia.sternenkarte.rueckkehr.v1";

export function dossierVorschauLink(karte, dossier, name, typ, medium) {
    const ziel = new URL(karte);
    const basis = new URL("../../", ziel);
    const seite = new URL(dossier);
    if (seite.origin !== basis.origin || !seite.pathname.startsWith(basis.pathname)) return ziel;
    ziel.searchParams.set("vorschau", seite.pathname.slice(basis.pathname.length));
    ziel.searchParams.set("name", name);
    ziel.searchParams.set("typ", typ);
    if (medium) ziel.searchParams.set("medium", medium);
    return ziel;
}

export function leseDossierVorschau(karte) {
    const aktuelleKarte = new URL(karte);
    const pfad = aktuelleKarte.searchParams.get("vorschau");
    if (!pfad || !/^inhalte\/(?:himmelskoerper|Kosmologie)\//.test(pfad) || /\\|%2f|%5c/i.test(pfad)) return null;
    const basis = new URL("../../", aktuelleKarte);
    const dossier = new URL(pfad, basis);
    const inhalte = new URL("inhalte/", basis);
    if (dossier.origin !== inhalte.origin ||
        !["himmelskoerper/", "Kosmologie/"].some(kategorie =>
            dossier.pathname.startsWith(inhalte.pathname + kategorie)) ||
        !dossier.pathname.endsWith(".html") || dossier.search || dossier.hash) return null;

    const name = aktuelleKarte.searchParams.get("name")?.trim().slice(0, 180);
    const typ = aktuelleKarte.searchParams.get("typ")?.trim().slice(0, 70);
    const medium = aktuelleKarte.searchParams.get("medium");
    return {
        id: "@dossier-vorschau", name: name || "Archivobjekt", typ: typ || "Himmelskörper",
        archivLink: dossier.href, position: [0, 0, 0], radius: 1, color: [0.55, 0.68, 0.8],
        beschreibung: "Schematische Vorschau. Dieses Dossier hat noch keine Position in der Sternenkarte.",
        vorschau: /^[a-z0-9._-]{1,230}$/i.test(medium ?? "") ? medium : undefined
    };
}

export function speichereKartenansicht(ansicht) {
    try {
        sessionStorage.setItem(key, JSON.stringify(ansicht));
    } catch {
        // The map remains usable when browser storage is unavailable.
    }
}

export function ladeKartenansicht() {
    try {
        const ansicht = JSON.parse(sessionStorage.getItem(key));
        const kamera = ansicht?.kamera;
        if (typeof ansicht?.gruppe === "string" && Array.isArray(kamera?.target) && kamera.target.length === 3 &&
            [...kamera.target, kamera.yaw, kamera.pitch, kamera.distance].every(Number.isFinite) &&
            Math.abs(kamera.pitch) <= 1.5 && kamera.distance > 0 && kamera.distance <= 1e30) return ansicht;
    } catch {
        // Missing or unavailable session storage is equivalent to a fresh visit.
    }
    return null;
}
