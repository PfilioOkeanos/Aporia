import { aktualisiereBahnen, gravitationsbahnFuer, IST_ASTEROID, kmZuKarte, kreisbahnFuer, positionVon, setzeAsteroidbahn, STANDARD_STARTTEMPO } from "../Sternsysteme/Bahnphysik.js";
import { starteMehrfachauswahl } from "./Mehrfachauswahl.js";
import { gruppenOption } from "../../adapter/Sternenkarte/Kartendaten/Kartengruppen.js";
import { formOptionen } from "../Szene/Objektformen.js";
import { starteVorlagenauswahl } from "./Vorlagenauswahl.js";
import { alsJSON } from "../../adapter/Sternenkarte/Kartendaten/Kartendaten.js";
import { objektLink, PLATZHALTERLINK } from "../../adapter/Sternenkarte/Verknuepfungen/Verknuepfungen.js";

function alsHex(farbe) {
    return "#" + farbe.map(kanal => Math.round(kanal * 255).toString(16).padStart(2, "0")).join("");
}

function alsRGB(hex) {
    return [1, 3, 5].map(index => Number.parseInt(hex.slice(index, index + 2), 16) / 255);
}

export function starteEditor(menue, objekte, kamera, verbindung, gruppen, tageFuer) {
    const liste = menue.querySelector("[data-edit-selection]");
    const suchfeld = menue.querySelector("[data-edit-search]");
    const mehrfach = starteMehrfachauswahl(menue.querySelector("[data-multi]"), gruppen.sichtbareObjekte);
    const formular = menue.querySelector("form");
    const feldgruppe = formular.querySelector("fieldset");
    const auswahlHinweis = menue.querySelector("[data-editor-selection-hint]");
    const felder = [...formular.querySelectorAll('input[type="number"]:not([name="emissionsstaerke"]):not([name="umlaufzeit"]):not([name="starttempo"])')];
    const { umlaufzentrum, umlaufzeit, starttempo } = formular.elements;
    const tempoZeile = formular.querySelector("[data-asteroid-speed]");
    const gruppenFeld = formular.elements.objektgruppe;
    const formFeld = formular.elements.objektform;
    for (const [id, label] of formOptionen) formFeld.add(new Option(label, id));
    const nameFeld = formular.elements.objektname;
    const { grundfarbe, leuchtfarbe, emissionsstaerke } = formular.elements;
    const typFeld = formular.elements.objekttyp;
    const linkFeld = formular.elements.objektlink;
    const hinweis = menue.querySelector("[data-editor-status]");
    const entfernen = menue.querySelector("[data-remove]");
    const status = text => { hinweis.textContent = text; };
    let auswahl = null;
    let speichern = Promise.resolve();

    function aktualisiereFelder() {
        feldgruppe.disabled = !auswahl;
        formular.hidden = !auswahl;
        auswahlHinweis.hidden = Boolean(auswahl);
        entfernen.disabled = !auswahl;
        const werte = auswahl ? [...auswahl.position, auswahl.radius] : [];
        felder.forEach((feld, i) => { feld.value = werte[i] ?? ""; });
    }

    function erlaubteZentren(objekt) {
        if (!objekt || objekt.systemName || !objekt.systemId) return [];
        const system = objekte.find(eintrag => eintrag.id === objekt.systemId && eintrag.systemName);
        if (!system) return [];
        const nachId = new Map(objekte.map(eintrag => [eintrag.id, eintrag]));
        return objekte.filter(eintrag => {
            if (eintrag !== system && eintrag.systemId !== system.id) return false;
            const besucht = new Set();
            for (let parent = eintrag; parent; parent = nachId.get(parent.bahnUm)) {
                if (parent === objekt || besucht.has(parent)) return false;
                besucht.add(parent);
            }
            return true;
        });
    }

    function waehle(objekt) {
        auswahl = objekt;
        if (objekt && !Array.from(liste.options).some(option => option.value === objekt.id)) zeigeObjektliste();
        liste.value = objekt?.id ?? "";
        gruppenFeld.disabled = !objekt || Boolean(objekt.systemName);
        gruppenFeld.value = objekt ? gruppen.gruppeVon(objekt) : gruppen.ziel();
        formFeld.value = objekt?.form ?? "";
        const zentren = erlaubteZentren(objekt);
        umlaufzentrum.replaceChildren(new Option("Keine Umlaufbahn", ""), ...zentren.map(zentrum => new Option(zentrum.name, zentrum.id)));
        umlaufzentrum.value = zentren.some(zentrum => zentrum.id === objekt?.bahnUm) ? objekt.bahnUm : "";
        umlaufzentrum.disabled = !zentren.length;
        umlaufzeit.value = objekt?.orbit?.tage ?? "";
        starttempo.value = objekt?.orbit?.starttempo ?? STANDARD_STARTTEMPO;
        aktualisiereBahnfelder();
        nameFeld.value = objekt?.name ?? "";
        linkFeld.value = objekt?.link ?? "";
        typFeld.value = objekt?.typ ?? "";
        grundfarbe.value = alsHex(objekt?.color ?? [0, 0, 0]);
        leuchtfarbe.value = alsHex(objekt?.emissionsfarbe ?? objekt?.color ?? [0, 0, 0]);
        emissionsstaerke.value = objekt?.emission ?? 0;
        aktualisiereFelder();
    }

    function zeigeObjektliste() {
        const gesucht = suchfeld.value.trim().toLocaleLowerCase("de");
        const sichtbar = gruppen.sichtbareObjekte;
        suchfeld.hidden = sichtbar.length <= 60 && !gesucht;
        const ergebnisse = sichtbar.filter(objekt => objekt.name.toLocaleLowerCase("de").includes(gesucht))
            .sort((a, b) => a.name.localeCompare(b.name, "de"));
        const angezeigt = ergebnisse.slice(0, 60);
        if (auswahl && sichtbar.includes(auswahl) && !angezeigt.includes(auswahl)) angezeigt.push(auswahl);
        liste.replaceChildren(new Option(ergebnisse.length > 60 ? "Objekt suchen oder auswählen" : "Objekt auswählen", ""));
        const sammlungen = new Map();
        for (const objekt of angezeigt) {
            const typ = objekt.typ || "Objekte";
            if (!sammlungen.has(typ)) {
                const gruppe = document.createElement("optgroup");
                gruppe.label = typ;
                sammlungen.set(typ, gruppe);
                liste.append(gruppe);
            }
            sammlungen.get(typ).append(new Option(objekt.name, objekt.id));
        }
        liste.value = auswahl?.id ?? "";
    }
    suchfeld.addEventListener("input", zeigeObjektliste);

    function aktualisiereListe() {
        zeigeObjektliste();
        mehrfach.aktualisiere();
        gruppenFeld.replaceChildren(...gruppen.liste().filter(gruppe => !gruppe.sammlung).map(gruppenOption));
        waehle(gruppen.sichtbareObjekte.includes(auswahl) ? auswahl : null);
    }

    function speichere(modell) {
        const text = alsJSON(objekte);
        if (!verbindung) {
            status("Änderungen im Speicher. Sichere sie mit JSON herunterladen.");
            return Promise.resolve(false);
        }
        status("Speichere …");
        speichern = speichern.then(async () => {
            await verbindung.speichern(text, modell);
            status("Objektdaten in objekte.json gespeichert.");
            return true;
        }).catch(error => {
            status("Speichern fehlgeschlagen. " + error.message);
            return false;
        });
        return speichern;
    }

    if (verbindung) status("Lokaler Server verbunden. Änderungen werden automatisch gespeichert.");

    const kameraHinweis = menue.querySelector("[data-camera-status]");
    menue.querySelector("[data-camera-save]").addEventListener("click", () => {
        kameraHinweis.textContent = kamera.speichereRuecksetzpunkt()
            ? "Aktuelle Ansicht als Rücksetzpunkt gespeichert."
            : "Rücksetzpunkt für diese Sitzung gesetzt.";
    });
    menue.querySelector("[data-camera-clear]").addEventListener("click", () => {
        kameraHinweis.textContent = kamera.entferneRuecksetzpunkt()
            ? "Standardansicht als Rücksetzpunkt wiederhergestellt."
            : "Standardansicht für diese Sitzung aktiv.";
    });

    liste.addEventListener("change", () => waehle(gruppen.sichtbareObjekte.find(objekt => objekt.id === liste.value) ?? null));

    function fuegeObjektHinzu(modell, name, typname = "", modelldatei, vorlage) {
        let nummer = 1;
        const typ = modell ? "Modell " : vorlage?.typ ? "Himmelsobjekt " : "Kugel ";
        while (objekte.some(objekt => objekt.id === typ + nummer)) nummer++;
        const { eye, back, near } = kamera.stand();
        const stern = objekte.find(objekt => objekt.id === gruppen.ziel() && objekt.systemName);
        const radius = vorlage?.radius ?? (vorlage && IST_ASTEROID(vorlage) && stern?.radiusKm ? kmZuKarte(50) : .65);
        const abstand = Math.max(3, radius * 3.5, near * 1.01 + radius);
        const position = eye.map((wert, achse) => wert - back[achse] * abstand);
        auswahl = { id: typ + nummer, name: name || typ + nummer,
            link: PLATZHALTERLINK, typ: typname, systemId: gruppen.ziel(), position, radius, color: [0.42, 0.72, 1] };
        if (vorlage) Object.assign(auswahl, vorlage);
        if (modell) auswahl.modell = modell;
        const objekt = auswahl;
        if (objekt.systemName) delete objekt.systemId;
        const mitte = objekte.find(eintrag => eintrag.id === objekt.systemId && eintrag.systemName);
        const istAsteroid = IST_ASTEROID(objekt) && !modell;
        const bahnErzeugt = istAsteroid && mitte && setzeAsteroidbahn(objekt, mitte, position, undefined, tageFuer(objekt));
        objekte.push(objekt);
        gruppen.wechsle(objekt.systemName ? objekt.id : objekt.systemId);
        waehle(objekt);
        const gespeichert = speichere(modelldatei);
        if (istAsteroid && !bahnErzeugt) gespeichert.then(() => {
            status("Asteroid angelegt. Wähle unter „Umlauf um“ ein Zentrum mit Gravitationsdaten und einen sicheren Abstand.");
        });
        return { objekt, gespeichert };
    }

    const liesVorlage = starteVorlagenauswahl(menue);
    menue.querySelector("[data-add]").addEventListener("click", () =>
        fuegeObjektHinzu(null, null, "", null, liesVorlage()));

    function entferneObjekt(objekt) {
        const index = objekte.indexOf(objekt);
        if (index === -1) return;
        objekte.splice(index, 1);
        if (auswahl === objekt) auswahl = null;
        gruppen.wechsle();
    }

    entfernen.addEventListener("click", () => {
        if (!auswahl) return;
        if (auswahl.systemName && objekte.some(objekt => objekt.systemId === auswahl.id)) {
            status("Verschiebe oder entferne erst die Objekte dieses Sternsystems.");
            return;
        }
        if (!window.confirm(auswahl.name + " aus der Sternenkarte entfernen?")) return;
        entferneObjekt(auswahl);
        speichere();
    });

    function aktualisiereBahnfelder() {
        const gravitation = IST_ASTEROID({ typ: typFeld.value });
        tempoZeile.hidden = !gravitation;
        starttempo.disabled = !gravitation || !umlaufzentrum.value;
        umlaufzeit.disabled = gravitation || !umlaufzentrum.value;
    }

    umlaufzentrum.addEventListener("change", () => {
        if (umlaufzentrum.value !== auswahl?.bahnUm) umlaufzeit.value = "";
        aktualisiereBahnfelder();
    });
    typFeld.addEventListener("input", aktualisiereBahnfelder);

    formular.addEventListener("invalid", event => {
        const abschnitt = event.target.closest(".map-editor-section");
        if (abschnitt) abschnitt.open = true;
    }, true);

    formular.addEventListener("submit", event => {
        event.preventDefault();
        if (!auswahl) return;
        const werte = felder.map(feld => feld.valueAsNumber);
        const emission = emissionsstaerke.valueAsNumber;
        if (!werte.every(Number.isFinite) || werte[3] <= 0 ||
            !Number.isFinite(emission) || emission < 0 || emission > 5) return;
        const name = nameFeld.value.trim();
        const link = linkFeld.value.trim() || PLATZHALTERLINK;
        if (!name) {
            status("Gib einen Namen ein.");
            return;
        }
        try {
            objektLink(link, name);
        } catch {
            status("Verwende einen relativen Seitenpfad oder eine HTTP(S)-Adresse.");
            return;
        }
        const alteGruppe = gruppen.gruppeVon(auswahl);
        const neueGruppe = gruppenFeld.value;
        let neuePosition = werte.slice(0, 3);
        const mitte = alteGruppe === neueGruppe
            ? erlaubteZentren(auswahl).find(objekt => objekt.id === umlaufzentrum.value) : null;
        const periode = umlaufzeit.valueAsNumber;
        let orbit;
        if (mitte) {
            const gleicheBahn = mitte.id === auswahl.bahnUm ? auswahl.orbit : null;
            if (IST_ASTEROID({ typ: typFeld.value })) {
                const tempo = Number.isFinite(starttempo.valueAsNumber) ? starttempo.valueAsNumber : STANDARD_STARTTEMPO;
                const unveraendert = gleicheBahn?.starttempo === tempo && werte[3] === auswahl.radius &&
                    neuePosition.every((wert, achse) => wert === auswahl.position[achse]);
                if (unveraendert) orbit = gleicheBahn;
                else {
                    const posAktuell = positionVon(auswahl);
                    const mitteAktuell = positionVon(mitte);
                    neuePosition = neuePosition.map((wert, achse) =>
                        wert + posAktuell[achse] - auswahl.position[achse] + mitte.position[achse] - mitteAktuell[achse]);
                    orbit = gravitationsbahnFuer(neuePosition, mitte, werte[3], tempo, tageFuer(auswahl));
                }
                if (!orbit) {
                    status("Die Bahn braucht ein Zentrum mit Gravitationsdaten und genügend Abstand zur Oberfläche.");
                    return;
                }
            } else {
                orbit = gleicheBahn
                    ? { ...gleicheBahn, tage: Number.isFinite(periode) ? periode : gleicheBahn.tage }
                    : kreisbahnFuer(neuePosition, mitte, Number.isFinite(periode) ? periode : undefined);
                if (!orbit) {
                    status("Platziere das Objekt außerhalb seines Umlaufzentrums.");
                    return;
                }
            }
        }

        auswahl.name = name;
        if (auswahl.systemName) auswahl.systemName = name;
        else if (neueGruppe !== alteGruppe) {
            auswahl.systemId = neueGruppe;
            delete auswahl.bahnUm;
            delete auswahl.ringUm;
        }
        auswahl.typ = typFeld.value.trim();
        if (formFeld.value) auswahl.form = formFeld.value;
        else delete auswahl.form;
        auswahl.link = link;
        if (mitte) {
            auswahl.bahnUm = mitte.id;
            auswahl.orbit = orbit;
        } else if (!auswahl.systemName) {
            delete auswahl.bahnUm;
            delete auswahl.orbit;
        }
        auswahl.position = neuePosition;
        auswahl.radius = werte[3];
        if (grundfarbe.value !== alsHex(auswahl.color)) auswahl.color = alsRGB(grundfarbe.value);
        auswahl.emissionsfarbe = alsRGB(leuchtfarbe.value);
        auswahl.emission = emission;
        gruppen.wechsle(neueGruppe);
        speichere();
    });

    menue.querySelector("[data-download]").addEventListener("click", () => {
        const url = URL.createObjectURL(new Blob([alsJSON(objekte)], { type: "application/json" }));
        const link = document.createElement("a");
        link.href = url;
        link.download = "objekte.json";
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    });

    function pruefeVerschobeneBahnen(bewegungen) {
        const nachId = new Map(objekte.map(objekt => [objekt.id, objekt]));
        const startPositionen = new Map(bewegungen.map(({ objekt, position }) => [objekt, position]));
        const neueBahnen = [];
        aktualisiereBahnen(objekte, tageFuer);
        for (const { objekt, position } of bewegungen) {
            if (!IST_ASTEROID(objekt) || objekt.orbit?.starttempo == null) continue;
            const mitte = nachId.get(objekt.bahnUm);
            if (!mitte) continue;
            const mitteVorher = startPositionen.get(mitte) ?? mitte.position;
            if (position.every((wert, achse) =>
                Math.abs(objekt.position[achse] - wert - mitte.position[achse] + mitteVorher[achse]) < 1e-9)) continue;
            const mittelpunkt = positionVon(mitte);
            const verschoben = positionVon(objekt).map((wert, achse) => wert + mitte.position[achse] - mittelpunkt[achse]);
            const orbit = gravitationsbahnFuer(verschoben, mitte, objekt.radius, objekt.orbit.starttempo, tageFuer(objekt));
            if (!orbit) {
                status("Verschieben rückgängig gemacht. Die neue Asteroidenbahn würde das Umlaufzentrum berühren.");
                return false;
            }
            neueBahnen.push({ objekt, position: verschoben, orbit });
        }
        for (const { objekt, position, orbit } of neueBahnen) Object.assign(objekt, { position, orbit });
        return true;
    }

    function abwaehlen() {
        mehrfach.leere();
        waehle(null);
    }

    aktualisiereListe();
    return { abwaehlen, pruefeVerschobeneBahnen, objekte: gruppen.sichtbareObjekte, istMarkiert: mehrfach.enthaelt, markiere: mehrfach.markiere, bewegungsObjekte: mehrfach.objekteFuer, alleObjekte: objekte, aktualisiereListe, get auswahl() { return auswahl; }, waehle, aktualisiereFelder, speichere, fuegeObjektHinzu, entferneObjekt };
}
