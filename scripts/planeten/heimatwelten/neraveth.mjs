import fs from "node:fs";
const dossier = fs.readFileSync(new URL("../../../Info_material/Alle_spezies_daten/Biologische Spezies/Parasitoiden/05_Heimatwelt/heimatwelt-referenz.md", import.meta.url), "utf8");
const themen = ["Astronomie","Atmosphäre","Klima","Geografie","Gewässer","Geologie","Biosphäre","Spezies","Biosphäre","Geschichte","Besonderheiten","Zivilisation","Zivilisation","Erforschung"];
const kapitel = {};
for (const match of dossier.matchAll(/^### 6\.(\d+) (.+)\r?\n([\s\S]*?)(?=^### |(?![\s\S]))/gm)) {
    const fach = themen[Number(match[1])-1];
    const text = match[3].split(/\r?\n/).map(line => line.trim().replaceAll("**","")).filter(line => line && !line.startsWith("|"));
    (kapitel[fach] ??= {abschnitte:[]}).abschnitte.push({titel:match[2].trim(),text});
}
for (const [fach,titel,text] of [
    ["Planetare Struktur","Kontinentalschelfe","Breite, flache Übergänge zwischen Festland und offenem Meer bieten Platz für wandernde Küstenlinien und ausgedehnte Feuchtgebiete."],
    ["Fraktionen","Schutzgebiete und Landnutzung","An den Wanderkorridoren überschneiden sich Siedlungsflächen und saisonale Weiden. Die örtliche Politik muss den Zugang zu Wasser und den Schutz der Herden miteinander vereinbaren."],
    ["Rohstoffe","Sedimente der Niederungen","In ehemaligen Flussarmen lassen sich Ton und feinkörnige Sande gewinnen. Aktive Überschwemmungsflächen sind zugleich wichtige Lebensräume der Sethren."]]) kapitel[fach]={abschnitte:[{titel,text:[text]}]};
export default {
    ordner:"neraveth",system:"esvar-system",planetId:"esvar-neraveth",name:"Neraveth",genitiv:"von Neraveth",klasse:"Terrestrischer Gesteinsplanet",
    spezies:{name:"Parasitoiden",gruppe:"Biologische Spezies",ordner:"Parasitoiden"},
    intro:"Zwischen den Flussniederungen und den trockenen Hochebenen Neraveths ziehen die drei großen Wirtsarten der Kheravi.",
    kurzprofil:["Neraveth ist der zweite Planet Esvars. Wasser bedeckt 58 Prozent seiner Oberfläche. Saisonale Regenfälle verbinden Weideland und Überschwemmungsbecken zu Wanderkorridoren."],
    werte:{temperatur:"17 °C",temperaturMittel:17,ozeane:"58 % Wasserbedeckung",druck:"1,06 bar",druckMittel:1.06,rotationH:28,achsneigung:18,jahreszeiten:"Saisonale Niederschlagszonen und regionale Trockenzeiten",atmoKurz:"Stickstoff und Sauerstoff",atmosphaere:[["Stickstoff",77.2],["Sauerstoff",21.8],["Argon",.9],["Kohlendioxid",.06],["Weitere Spurengase",.04]]},
    kapitel
};
