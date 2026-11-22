// Planetendossier · Kapitelseiten eines Himmelskörpers auf das gemeinsame Design umstellen
// Hängt planetendossier.css/.js und die Farbdatei des Himmelskörpers ein und setzt die Body-Klassen.
// Inhalte der Seiten bleiben unverändert. Wiederholbar.
// Nur Seiten im Dossier-Aufbau (.earth-panel, wie bei der Erde) werden umgestellt; Platzhalterseiten im
// Atlas-Format werden übersprungen und aufgelistet.
// Aufruf: node scripts/planeten/kapitel-umstellen.mjs <slug>   oder   <art>/<slug>
import fs from "node:fs";
import path from "node:path";
import { ROOT, GEM, findeKoerper } from "./koerper.mjs";

const KOERPER = findeKoerper(process.argv[2]);
const enc = (p) => p.split("/").map((t) => (t === ".." ? t : encodeURIComponent(t))).join("/");
const farbdatei = ["erde-design.css", "dossier-farben.css"].map((n) => `${KOERPER.basis}/hauptseite/${n}`).find((f) => fs.existsSync(ROOT + f));
let umgestellt = 0;
const uebersprungen = [];

for (const o of fs.readdirSync(ROOT + KOERPER.unterseiten, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name)) {
    const datei = `${KOERPER.unterseiten}/${o}/index.html`;
    if (!fs.existsSync(ROOT + datei)) continue;
    let t = fs.readFileSync(ROOT + datei, "utf8");
    if (!t.includes("earth-panel")) { uebersprungen.push(o); continue; }
    const rel = (ziel) => enc(path.posix.relative(path.posix.dirname(datei), ziel));
    const css = `<link rel="stylesheet" href="${rel(GEM + "/planetendossier.css")}">`;
    const js = `<script type="module" src="${rel(GEM + "/planetendossier.js")}"></script>`;
    const farbLink = farbdatei ? `<link rel="stylesheet" href="${rel(farbdatei)}">` : "";

    // Stylesheets: planetendossier.css vor der Farbdatei (Farben gewinnen), sonst nach dem letzten Stylesheet
    if (!t.includes("planetendossier.css")) {
        if (farbLink && t.includes(farbLink)) t = t.split(farbLink).join(css + "\n    " + farbLink);
        else {
            const links = [...t.matchAll(/<link rel="stylesheet"[^>]*>/g)];
            const letzter = links.at(-1);
            const einfuegen = css + (farbLink ? "\n    " + farbLink : "");
            t = letzter ? t.slice(0, letzter.index + letzter[0].length) + "\n    " + einfuegen + t.slice(letzter.index + letzter[0].length) : t.replace("</head>", `    ${einfuegen}\n</head>`);
        }
    } else if (farbLink && !t.includes(farbLink)) {
        t = t.replace(css, css + "\n    " + farbLink);
    }
    // Script: alte Erde-Designschicht ersetzen, sonst vor </head> ergänzen
    if (!t.includes("planetendossier.js")) {
        const alt = /<script type="module" src="[^"]*erde-leben\.js"><\/script>/;
        t = alt.test(t) ? t.replace(alt, js) : t.replace("</head>", `    ${js}\n</head>`);
    } else {
        t = t.replace(/\s*<script type="module" src="[^"]*erde-leben\.js"><\/script>/, "");
    }
    t = t.replace(/<body class="([^"]*)"/, (m, k) => `<body class="${k.split(/\s+/).filter((x) => x && x !== "planetendossier" && x !== "pd-kapitel").concat("planetendossier", "pd-kapitel").join(" ")}"`);
    if (!/<body class="[^"]*pd-kapitel/.test(t)) t = t.replace(/<body(?![^>]*class=)/, '<body class="planetendossier pd-kapitel"');
    if (!t.includes("planetendossier.css") || !t.includes("planetendossier.js")) throw new Error("Umstellung unvollständig: " + o);
    fs.writeFileSync(ROOT + datei, t);
    umgestellt++;
}
console.log(`${KOERPER.art}/${KOERPER.slug}: ${umgestellt} Kapitelseiten auf das Planetendossier-Design umgestellt`);
if (uebersprungen.length) console.log(`Übersprungen (Platzhalter im Atlas-Format, noch ohne Dossier-Inhalte): ${uebersprungen.length} – ${uebersprungen.join(", ")}`);
