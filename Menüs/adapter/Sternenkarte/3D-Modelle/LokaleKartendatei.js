const api = "/api/sternenkarte/objekte";

export function istLokaleKarte() {
    return location.origin === "http://127.0.0.1:8787";
}

async function ergebnis(response) {
    const daten = await response.json();
    if (!response.ok) throw new Error(daten.fehler ?? "Lokaler Server ist nicht erreichbar.");
    return daten;
}

export async function ladeLokaleKartendatei(leseObjekte) {
    const ziel = await ergebnis(await fetch(api, { cache: "no-store" }));
    return {
        text: ziel.text,
        objekte: leseObjekte(ziel.text),
        async speichern(text, modell) {
            let body = text;
            if (modell) {
                const meta = new TextEncoder().encode(JSON.stringify({ text, dateiname: modell.dateiname }));
                const header = new DataView(new ArrayBuffer(4));
                header.setUint32(0, meta.length, true);
                body = new Blob([header.buffer, meta, modell.datei], { type: "application/octet-stream" });
            }
            const daten = await ergebnis(await fetch(api, {
                method: modell ? "POST" : "PUT",
                headers: { "If-Match": ziel.version, "X-Aporia-Token": ziel.token },
                body
            }));
            ziel.version = daten.version;
        }
    };
}
