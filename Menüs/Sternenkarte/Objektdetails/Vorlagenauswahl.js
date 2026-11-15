import { ladeVorlagenArchiv, objektAusVorlage, objektvorlagen } from "../../adapter/Sternenkarte/Kartendaten/Objektvorlagen.js";

export function starteVorlagenauswahl(menue) {
    const art = menue.querySelector("[data-object-template]");
    const archiv = menue.querySelector("[data-object-archive-choice]");
    const hinweis = menue.querySelector("[data-object-template-status]");
    const gruppen = new Map();
    for (const [index, vorlage] of objektvorlagen.entries()) {
        if (!gruppen.has(vorlage.gruppe)) {
            const gruppe = document.createElement("optgroup");
            gruppe.label = vorlage.gruppe;
            gruppen.set(vorlage.gruppe, gruppe);
            art.append(gruppe);
        }
        gruppen.get(vorlage.gruppe).append(new Option(vorlage.label, index));
    }

    let motive = [];
    let version = 0;
    art.addEventListener("change", async () => {
        const anfrage = ++version;
        const { route } = objektvorlagen[Number(art.value)];
        motive = [];
        archiv.replaceChildren(new Option("Kein einzelnes Motiv", ""));
        archiv.disabled = true;
        hinweis.textContent = "";
        if (!route) return;
        try {
            const eintraege = await ladeVorlagenArchiv(route);
            if (anfrage !== version || !eintraege.length) return;
            motive = eintraege;
            const optionen = document.createDocumentFragment();
            for (const [index, motiv] of motive.entries()) optionen.append(new Option(motiv.title, index));
            archiv.append(optionen);
            archiv.disabled = false;
        } catch {
            if (anfrage === version) hinweis.textContent = "Einzelmotive konnten nicht geladen werden. Die Archivübersicht ist verfügbar.";
        }
    });

    return () => objektAusVorlage(objektvorlagen[Number(art.value)],
        archiv.value === "" ? null : motive[Number(archiv.value)]);
}
