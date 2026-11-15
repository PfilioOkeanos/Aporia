const ACHSEN = [
    { name: "X", farbe: "#ff6479" },
    { name: "Y", farbe: "#9cda62" },
    { name: "Z", farbe: "#62b5ff" }
];

const format = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 });

export function erzeugeAchsenanzeige(canvas, koordinaten) {
    const ctx = canvas.getContext("2d");
    let vorherigerStand;
    let vorherigerText;

    return function zeichneAchsen({ right, up, back, eye }) {
        const stand = back.join(",") + ":" + right.join(",");
        if (ctx && stand !== vorherigerStand) {
            vorherigerStand = stand;
            const mitte = canvas.width / 2;
            const radius = mitte * 0.66;
            const endpunkte = ACHSEN.flatMap((achse, index) => [-1, 1].map(vorzeichen => ({
                ...achse,
                x: mitte + right[index] * radius * vorzeichen,
                y: mitte - up[index] * radius * vorzeichen,
                tiefe: back[index] * vorzeichen,
                positiv: vorzeichen > 0
            }))).sort((a, b) => a.tiefe - b.tiefe);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = "600 24px system-ui";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            for (const punkt of endpunkte) {
                ctx.globalAlpha = punkt.positiv ? 1 : 0.55;
                ctx.strokeStyle = punkt.farbe;
                ctx.fillStyle = punkt.farbe;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(mitte, mitte);
                ctx.lineTo(punkt.x, punkt.y);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(punkt.x, punkt.y, punkt.positiv ? 16 : 9, 0, Math.PI * 2);
                if (punkt.positiv) {
                    ctx.fill();
                    ctx.fillStyle = "#0a1115";
                    ctx.fillText(punkt.name, punkt.x, punkt.y);
                } else {
                    ctx.stroke();
                }
            }
            ctx.globalAlpha = 1;
        }

        const text = ACHSEN.map(({ name }, index) =>
            name + " " + format.format(Math.round(eye[index] * 10) / 10)
        );
        const schluessel = text.join("|");
        if (schluessel !== vorherigerText) {
            vorherigerText = schluessel;
            for (const [index, wert] of text.entries()) koordinaten.children[index].textContent = wert;
        }
    };
}
