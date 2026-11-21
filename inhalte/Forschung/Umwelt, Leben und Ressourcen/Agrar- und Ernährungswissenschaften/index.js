// Agrar- und Ernährungswissenschaften – Forschungszweig
// Forschungsbaum dieser Seite. Knoten, Kosten und Belohnungen lassen sich hier direkt anpassen.
// Stufen: 0 = Grundlagen, 1 = Vertiefung, 2 = Anwendung, 3 = Durchbruch. „benoetigt“ verbindet die Knoten im Baum.
import "../../_gemeinsam/zweig.js";
import { mountForschungsbaum } from "../../../../Men%C3%BCs/adapter/aporia-forschung.js";

const knoten = [
    {
        "id": "k1",
        "name": "Bodenkunde",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k2",
        "name": "Pflanzenbau",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k3",
        "name": "Ernährungslehre",
        "stufe": 1,
        "benoetigt": [
            "k1",
            "k2"
        ],
        "kosten": 20,
        "belohnung": {
            "art": "vorteil",
            "text": "Forschungskosten −15 %",
            "wirkung": {
                "rabatt": 0.15
            }
        }
    },
    {
        "id": "k4",
        "name": "Hydrokultur",
        "stufe": 2,
        "benoetigt": [
            "k3"
        ],
        "kosten": 50,
        "belohnung": {
            "art": "vorteil",
            "text": "Proben +15 % pro Sekunde",
            "wirkung": {
                "rate": 0.15
            }
        }
    },
    {
        "id": "k5",
        "name": "Pilzkulturen",
        "stufe": 2,
        "benoetigt": [
            "k3"
        ],
        "kosten": 50,
        "belohnung": {
            "art": "gegenstand",
            "name": "Pflanzen alien (2)",
            "bild": "../../../../assets/bilder/Flora%20&%20Fauna/Pflanzen/Pflanzen_alien%20(2).png"
        }
    },
    {
        "id": "k6",
        "name": "Lebensmittelsynthese",
        "stufe": 3,
        "benoetigt": [
            "k4"
        ],
        "kosten": 115,
        "belohnung": {
            "art": "vorteil",
            "text": "„Proben sammeln“ bringt +4 PR",
            "wirkung": {
                "experiment": 4
            }
        }
    },
    {
        "id": "k7",
        "name": "Orbitale Farmen",
        "stufe": 3,
        "benoetigt": [
            "k4",
            "k5"
        ],
        "kosten": 115,
        "belohnung": {
            "art": "gegenstand",
            "name": "Waldfeen nahrung pilze beeren",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Biologische%20Spezies/WaldFeen/Unterseite/biologie/assets/bilder/ernaehrung/waldfeen_nahrung_pilze_beeren.jpg"
        }
    },
    {
        "id": "k8",
        "name": "Ernährung ganzer Welten",
        "stufe": 4,
        "benoetigt": [
            "k6",
            "k7"
        ],
        "kosten": 270,
        "belohnung": {
            "art": "gegenstand",
            "name": "Pflanzen alien (1)",
            "bild": "../../../../assets/bilder/Flora%20&%20Fauna/Pflanzen/Pflanzen_alien%20(1).png"
        }
    }
];

mountForschungsbaum(document.querySelector("[data-forschungsbaum]"), {
    schluessel: "Umwelt, Leben und Ressourcen/Agrar- und Ernährungswissenschaften",
    titel: "Agrar- und Ernährungswissenschaften",
    knoten,
    // Baumform „Kreuzung“ · Ressource und Aktion der Familie „biom“
    waehrung: {"name":"Proben","kurz":"PR"},
    aktion: {"text":"Proben sammeln","icon":"❦","punkte":3},
    rate: 0.6,
    stufen: ["Keimung","Wachstum","Vernetzung","Blüte","Kreislauf"],
});
