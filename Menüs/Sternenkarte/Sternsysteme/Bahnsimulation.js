import { aktualisiereBahnen, friereBahnstandEin, IST_ASTEROID, kreisbahnFuer, positionVon, setzeAsteroidbahn } from "./Bahnphysik.js";

export function starteBahnsimulation(panel, objekte, speichere) {
    const system = panel.querySelector("[data-orbit-system]");
    const start = panel.querySelector("[data-orbit-play]");
    const reset = panel.querySelector("[data-orbit-reset]");
    const erzeugen = panel.querySelector("[data-orbit-build]");
    const sichern = panel.querySelector("[data-orbit-save]");
    const tempo = panel.querySelector("[data-orbit-speed]");
    const zeit = panel.querySelector("output");
    const hinweis = panel.querySelector("[data-orbit-status]");
    const format = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 });
    const zeiten = new Map();
    let gespeichertWird = false;

    function zustand(id) {
        if (!zeiten.has(id)) zeiten.set(id, { tage: 0, laeuft: false, tempo: 10 });
        return zeiten.get(id);
    }

    const tageFuer = objekt => zeiten.get(objekt.systemId ?? objekt.id)?.tage ?? 0;
    const vorher = (objekt, id) => objekt.systemId === id || objekt.id === id;
    const bahnenIn = id => objekte.some(objekt => vorher(objekt, id) && objekt.orbit);

    function aktualisiere(seconds) {
        for (const uhr of zeiten.values()) if (uhr.laeuft) uhr.tage += seconds * uhr.tempo;
        aktualisiereBahnen(objekte, tageFuer);
        if (system.value) {
            const text = "Tag " + format.format(zustand(system.value).tage);
            if (zeit.textContent !== text) zeit.textContent = text;
        }
        return tageFuer;
    }

    function schaltflaechen() {
        const uhr = zustand(system.value);
        const hatBahnen = bahnenIn(system.value);
        start.textContent = uhr.laeuft ? "Pause" : "Start";
        start.setAttribute("aria-pressed", String(uhr.laeuft));
        tempo.value = String(uhr.tempo);
        start.disabled = reset.disabled = !hatBahnen || gespeichertWird;
        sichern.disabled = !hatBahnen || gespeichertWird;
        erzeugen.disabled = !system.value || gespeichertWird;
        system.disabled = gespeichertWird;
    }

    function aktualisiereSysteme(aktiveGruppe) {
        const systeme = objekte.filter(objekt => objekt.systemName);
        const vorherigeWahl = system.value;
        system.replaceChildren(...systeme.map(objekt => new Option(objekt.systemName, objekt.id)));
        system.value = systeme.find(objekt => objekt.id === aktiveGruppe)?.id ??
            systeme.find(objekt => objekt.id === vorherigeWahl)?.id ?? systeme[0]?.id ?? "";
        schaltflaechen();
        aktualisiere(0);
    }

    system.addEventListener("change", () => {
        hinweis.textContent = "";
        schaltflaechen();
        aktualisiere(0);
    });
    tempo.addEventListener("change", () => { zustand(system.value).tempo = Number(tempo.value); });
    start.addEventListener("click", () => {
        const uhr = zustand(system.value);
        uhr.laeuft = !uhr.laeuft;
        schaltflaechen();
    });
    reset.addEventListener("click", () => {
        Object.assign(zustand(system.value), { tage: 0, laeuft: false });
        schaltflaechen();
        aktualisiere(0);
    });

    erzeugen.addEventListener("click", () => {
        const id = system.value;
        const nachId = new Map(objekte.filter(objekt => vorher(objekt, id)).map(objekt => [objekt.id, objekt]));
        let anzahl = 0;
        for (const objekt of nachId.values()) {
            const mitte = nachId.get(objekt.bahnUm);
            if (objekt.orbit || !mitte || mitte === objekt) continue;
            if (IST_ASTEROID(objekt)) {
                if (setzeAsteroidbahn(objekt, mitte, positionVon(objekt), undefined, tageFuer(objekt))) anzahl++;
                continue;
            }
            const bahn = kreisbahnFuer(objekt.position, mitte);
            if (bahn) {
                objekt.orbit = bahn;
                anzahl++;
            }
        }
        hinweis.textContent = anzahl ? anzahl + " Bahnen erzeugt. Speichere den Stand, um sie zu behalten."
            : "Keine neuen Bahnen. Wähle beim Objekt unter Position und Größe zuerst „Umlauf um“.";
        schaltflaechen();
        aktualisiere(0);
    });

    sichern.addEventListener("click", async () => {
        const id = system.value;
        const uhr = zustand(id);
        uhr.laeuft = false;
        gespeichertWird = true;
        try {
            friereBahnstandEin(objekte, id, tageFuer);
            uhr.tage = 0;
            aktualisiere(0);
            schaltflaechen();
            hinweis.textContent = await speichere()
                ? "Startstand gespeichert. Diese Positionen sind jetzt Tag 0."
                : "Startstand in der Sitzung übernommen. Prüfe den Speicherstatus unter Karte bearbeiten.";
        } finally {
            gespeichertWird = false;
            schaltflaechen();
        }
    });

    aktualisiereSysteme();
    return {
        aktualisiere, aktualisiereSysteme, tageFuer,
        ansicht: () => [...zeiten].map(([id, uhr]) => [id, { ...uhr }]),
        stelleAnsichtWiederHer(eintraege) {
            if (!Array.isArray(eintraege)) return;
            for (const [id, uhr] of eintraege.filter(eintrag => Array.isArray(eintrag))) {
                if (!objekte.some(objekt => objekt.id === id && objekt.systemName) ||
                    !Number.isFinite(uhr?.tage) || !Number.isFinite(uhr?.tempo)) continue;
                zeiten.set(id, { tage: uhr.tage, tempo: uhr.tempo, laeuft: Boolean(uhr.laeuft) });
            }
            schaltflaechen();
            aktualisiere(0);
        }
    };
}
