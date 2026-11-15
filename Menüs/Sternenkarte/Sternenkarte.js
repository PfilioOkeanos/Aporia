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

const canvas = document.querySelector("#star-map");
const reset = document.querySelector("#camera-reset");
const status = document.querySelector("#map-status");
try {
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
    let aktiveGruppe = new URLSearchParams(location.search).get("system");
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
        aktiveGruppe = id;
        gruppenAktualisieren();
        vorschauSteuerung?.leere();
        const system = sichtbareObjekte.find(objekt => objekt.id === id && objekt.systemName);
        if (system) vorschauSteuerung?.zeige(system);
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
    waehleGruppe(aktiveGruppe);
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
            vorschauSteuerung = starteObjektvorschau(canvas, labels, vorschau, sichtbareObjekte, kamera);
            vorschauSteuerung.zeige(sichtbareObjekte.find(objekt => objekt.id === aktiveGruppe && objekt.systemName));
            return starteModellimport(sidebar, editor, modellEbene, Boolean(lokal));
        }).catch(error => {
            status.textContent = error.message;
            status.hidden = false;
        });
    }
} catch (error) {
    status.hidden = false;
    reset.disabled = true;
    console.error("Sternenkarte:", error);
}

