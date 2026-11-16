import "../TopBar/Top_bar.js";
import { sidebarBereit } from "../Side_bar/side_bar.js";
import { erzeugeKamera } from "./Kamera/Kamera.js";
import { erzeugeAchsenanzeige } from "./Kamera/Achsenanzeige.js";
import { ladeLokaleKartendatei, istLokaleKarte } from "../adapter/Sternenkarte/3D-Modelle/LokaleKartendatei.js";
import { ladeObjekte, leseObjekte } from "../adapter/Sternenkarte/Kartendaten/Kartendaten.js";
import { FREIE_OBJEKTE, inKartengruppe, kartengruppen, objektgruppe } from "../adapter/Sternenkarte/Kartendaten/Kartengruppen.js";
import { zeichneObjektnamen } from "./Objektdetails/Objektnamen.js";
import { starteObjektvorschau } from "./Objektdetails/Objektvorschau.js";
import { starteEditor } from "./Objektdetails/Objektdetails.js";
import { starteModellimport } from "../adapter/Sternenkarte/3D-Modelle/Modellimport.js";
import { erzeugeModellEbene } from "./Szene/ModellEbene.js";
import { starteBahnsimulation } from "./Sternsysteme/Bahnsimulation.js";
import { starteGruppenwahl } from "./Sternsysteme/Gruppenwahl.js";
import { starteSzene } from "./Szene/Szene.js";
import { ladeKartenansicht, leseDossierVorschau, speichereKartenansicht } from "../adapter/Sternenkarte/KartenRueckkehr.js";
import { kartenobjektLink } from "../adapter/Sternenkarte/Verknuepfungen/Verknuepfungen.js";

const canvas = document.querySelector("#star-map");
const reset = document.querySelector("#camera-reset");
const status = document.querySelector("#map-status");
const dossierVorschau = leseDossierVorschau(location.href);

function starteDossierVorschau(objekt) {
    const kamera = erzeugeKamera(canvas, reset);
    const labels = document.querySelector("#map-object-labels");
    const zeichneAchsen = erzeugeAchsenanzeige(
        document.querySelector("#camera-axes"), document.querySelector("#camera-position")
    );
    const header = document.querySelector(".map-view-header");
    header.querySelector("h1").textContent = objekt.name;
    header.querySelector(".map-scale-note").textContent = objekt.beschreibung;
    const link = document.createElement("a");
    link.href = location.pathname;
    link.textContent = "Zur regulären Sternenkarte";
    header.append(link);
    const objekte = [objekt];
    const ansicht = { objekte, alleObjekte: objekte, istMarkiert: () => false };
    kamera.fokussiereGruppe(objekt.position, 5, objekt.id);
    let vorschau;
    const zeichneNavigation = (stand, aspect) => {
        zeichneAchsen(stand);
        vorschau?.aktualisiere(stand);
        zeichneObjektnamen(labels, objekte, stand, aspect, ansicht.istMarkiert, canvas.clientHeight);
    };
    if (starteSzene(canvas, reset, status, zeichneNavigation, ansicht, kamera, { zeichnen: () => false }, () => () => 0, false)) {
        sidebarBereit.then(() => {
            const sidebar = document.querySelector("[data-aporia-sidebar] .aporia-sidebar-scroll");
            if (!sidebar) return;
            const panel = document.querySelector("#map-object-preview");
            sidebar.prepend(panel);
            vorschau = starteObjektvorschau(canvas, labels, panel, objekte, kamera);
        });
    }
}

async function starteKarte() {
    const zeichneAchsen = erzeugeAchsenanzeige(
        document.querySelector("#camera-axes"),
        document.querySelector("#camera-position")
    );
    const menue = document.querySelector("#map-editor");
    const lokal = istLokaleKarte() ? await ladeLokaleKartendatei(leseObjekte) : null;
    const objekte = lokal?.objekte ?? await ladeObjekte();
    const kamera = erzeugeKamera(canvas, reset);
    const sichtbareObjekte = [];
    let gruppen = [];
    let gruppenNachId = new Map();
    const parameter = new URLSearchParams(location.search);
    const angefordertesSystem = parameter.get("system");
    const zielObjekt = objekte.find(objekt => objekt.id === parameter.get("objekt"));
    const letzteAnsicht = ladeKartenansicht();
    const browserZurueck = performance.getEntriesByType("navigation")[0]?.type === "back_forward";
    const rueckkehr = letzteAnsicht && ((browserZurueck && letzteAnsicht.suche === location.search) ||
        (zielObjekt ? letzteAnsicht.objekt === zielObjekt.id : !angefordertesSystem));
    let aktiveGruppe = rueckkehr ? letzteAnsicht.gruppe : angefordertesSystem;
    let dossierObjekt = rueckkehr ? objekte.find(objekt => objekt.id === letzteAnsicht.objekt) : null;
    let editor;
    const simulation = starteBahnsimulation(document.querySelector("#orbit-simulation"), objekte, () => editor.speichere());
    let vorschauSteuerung;
    const optionen = { auswaehlen: waehleGruppe, fokussiere: id => {
        const objekt = sichtbareObjekte.find(objekt => objekt.id === id);
        if (!objekt) return;
        kamera.fliegeZumObjekt(objekt);
        editor?.waehle(objekt);
    }};
    const ansichtsWahlen = ["#map-view-group", "#map-edit-group"].map(selector =>
        starteGruppenwahl(document.querySelector(selector), optionen));

    function gruppenAktualisieren() {
        gruppen = kartengruppen(objekte);
        gruppenNachId = new Map(gruppen.map(gruppe => [gruppe.id, gruppe]));
        if (!gruppenNachId.has(aktiveGruppe)) aktiveGruppe = gruppen[0].id;
        sichtbareObjekte.splice(0, sichtbareObjekte.length,
            ...objekte.filter(objekt => inKartengruppe(objekt, aktiveGruppe, gruppenNachId)));
        for (const aktualisiere of ansichtsWahlen) {
            aktualisiere(gruppen, sichtbareObjekte, objekt => objektgruppe(objekt, gruppenNachId), aktiveGruppe);
        }
        editor?.aktualisiereListe();
        simulation.aktualisiereSysteme(aktiveGruppe);
    }

    function waehleGruppe(id) {
        if (!gruppenNachId.has(id)) return;
        if (id !== aktiveGruppe) dossierObjekt = null;
        aktiveGruppe = id;
        gruppenAktualisieren();
        vorschauSteuerung?.leere();
        const system = sichtbareObjekte.find(objekt => objekt.id === id && objekt.systemName);
        if (system && !system.archivLink) vorschauSteuerung?.zeige(system);
        document.querySelector(".map-scale-note").textContent = gruppenNachId.get(id).name;
        const mitte = system?.position ?? [0, 1, 2].map(achse => {
            let min = Infinity, max = -Infinity;
            for (const objekt of sichtbareObjekte) {
                min = Math.min(min, objekt.position[achse] - objekt.radius);
                max = Math.max(max, objekt.position[achse] + objekt.radius);
            }
            return sichtbareObjekte.length ? min / 2 + max / 2 : 0;
        });
        const ausdehnung = sichtbareObjekte.reduce((radius, objekt) =>
            Math.max(radius, Math.hypot(...objekt.position.map((wert, achse) => wert - mitte[achse])) + objekt.radius), 0);
        kamera.fokussiereGruppe(mitte, Math.max(24, ausdehnung * 3), id, system?.kameraRevision);
    }

    gruppenAktualisieren();
    if (zielObjekt && !rueckkehr) aktiveGruppe = objektgruppe(zielObjekt, gruppenNachId);
    waehleGruppe(aktiveGruppe);
    if (rueckkehr && gruppenNachId.has(letzteAnsicht.gruppe)) {
        simulation.stelleAnsichtWiederHer(letzteAnsicht.simulation);
        const fokus = sichtbareObjekte.find(objekt => objekt.id === letzteAnsicht.kamera.fokusId);
        kamera.stelleAnsichtWiederHer(letzteAnsicht.kamera, fokus);
    } else if (zielObjekt) {
        kamera.fliegeZumObjekt(zielObjekt);
    }
    const gruppensteuerung = {
        sichtbareObjekte,
        liste: () => gruppen,
        aktuell: () => aktiveGruppe,
        gruppeVon: objekt => objektgruppe(objekt, gruppenNachId),
        ziel: () => gruppenNachId.get(aktiveGruppe).sammlung ? FREIE_OBJEKTE : aktiveGruppe,
        wechsle: id => {
            gruppenAktualisieren();
            if (id && !inKartengruppe({ systemId: id }, aktiveGruppe, gruppenNachId)) waehleGruppe(id);
        }
    };
    editor = starteEditor(menue, objekte, kamera, lokal, gruppensteuerung, simulation.tageFuer);
    const labels = document.querySelector("#map-object-labels");
    function speichereAnsicht() {
        const ziel = dossierObjekt ? new URL(kartenobjektLink(dossierObjekt)) : null;
        speichereKartenansicht({
            gruppe: aktiveGruppe, kamera: kamera.ansicht(), simulation: simulation.ansicht(),
            objekt: dossierObjekt?.id, dossierPfad: ziel?.origin === location.origin ? ziel.pathname : undefined,
            suche: location.search
        });
    }
    function merkeDossier(objekt) {
        dossierObjekt = objekt;
        speichereAnsicht();
    }
    labels.addEventListener("click", event => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.defaultPrevented) return;
        const id = event.target.closest("a[data-id]")?.dataset.id;
        const objekt = sichtbareObjekte.find(eintrag => eintrag.id === id);
        if (objekt) merkeDossier(objekt);
    });
    window.addEventListener("pagehide", speichereAnsicht);
    function zeichneNavigation(stand, aspect) {
        zeichneAchsen(stand);
        vorschauSteuerung?.aktualisiere(stand);
        zeichneObjektnamen(labels, sichtbareObjekte, stand, aspect, editor.istMarkiert, canvas.clientHeight);
    }
    const modellEbene = erzeugeModellEbene(canvas, text => {
        status.textContent = text;
        status.hidden = false;
    });
    if (starteSzene(canvas, reset, status, zeichneNavigation, editor, kamera, modellEbene, simulation.aktualisiere)) {
        sidebarBereit.then(() => {
            const sidebar = document.querySelector("[data-aporia-sidebar] .aporia-sidebar-scroll");
            if (!sidebar) return;
            const vorschau = document.querySelector("#map-object-preview");
            const steuerung = reset.closest(".camera-controls");
            sidebar.prepend(steuerung, menue, vorschau);
            steuerung.hidden = false;
            menue.hidden = false;
            vorschauSteuerung = starteObjektvorschau(canvas, labels, vorschau, sichtbareObjekte, kamera, merkeDossier);
            vorschauSteuerung.zeige(sichtbareObjekte.find(objekt =>
                objekt.id === aktiveGruppe && objekt.systemName && !objekt.archivLink));
            return starteModellimport(sidebar, editor, modellEbene, Boolean(lokal));
        }).catch(error => {
            status.textContent = error.message;
            status.hidden = false;
        });
    }
}

try {
    if (dossierVorschau) starteDossierVorschau(dossierVorschau);
    else await starteKarte();
} catch (error) {
    status.hidden = false;
    reset.disabled = true;
    console.error("Sternenkarte:", error);
}

