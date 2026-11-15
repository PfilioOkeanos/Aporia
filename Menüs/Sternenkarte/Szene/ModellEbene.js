export function erzeugeModellEbene(canvas, meldeFehler) {
    let renderer;
    let module;
    let laden;
    let automatischVersucht = false;
    function ladeRenderer() {
        if (!laden) {
            laden = import("./ModellRenderer.js").then(modul => {
                module = modul;
                renderer = modul.erzeugeModellRenderer(canvas, meldeFehler);
                return renderer;
            }).catch(error => {
                laden = null;
                throw new Error("3D-Modellrenderer konnte nicht geladen werden: " + error.message);
            });
        }
        return laden;
    }
    return {
        laden: ladeRenderer,
        bereiteVor: modell => module.bereiteModellVor(modell),
        zeichnen(stand, width, height, editor, tage) {
            if (!renderer && !automatischVersucht && editor.objekte.some(objekt => objekt.modell)) {
                automatischVersucht = true;
                ladeRenderer().catch(error => meldeFehler(error.message));
            }
            return renderer?.zeichnen(stand, width, height, editor, tage) ?? false;
        }
    };
}
