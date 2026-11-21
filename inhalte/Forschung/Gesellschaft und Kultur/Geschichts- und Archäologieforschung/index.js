// Geschichts- und Archäologieforschung – Forschungszweig
// Forschungsbaum dieser Seite. Knoten, Kosten und Belohnungen lassen sich hier direkt anpassen.
// Stufen: 0 = Grundlagen, 1 = Vertiefung, 2 = Anwendung, 3 = Durchbruch. „benoetigt“ verbindet die Knoten im Baum.
import "../../_gemeinsam/zweig.js";
import { mountForschungsbaum } from "../../../../Men%C3%BCs/adapter/aporia-forschung.js";

const knoten = [
    {
        "id": "k1",
        "name": "Quellenkunde",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k2",
        "name": "Stratigrafie",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k3",
        "name": "Datierung",
        "stufe": 1,
        "benoetigt": [
            "k1",
            "k2"
        ],
        "kosten": 25,
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
        "name": "Epigrafik",
        "stufe": 2,
        "benoetigt": [
            "k3"
        ],
        "kosten": 55,
        "belohnung": {
            "art": "vorteil",
            "text": "„Quellen auswerten“ bringt +2 EK",
            "wirkung": {
                "experiment": 2
            }
        }
    },
    {
        "id": "k5",
        "name": "Ruinenkartierung",
        "stufe": 2,
        "benoetigt": [
            "k3"
        ],
        "kosten": 55,
        "belohnung": {
            "art": "gegenstand",
            "name": "Geistergott über den Ruinen",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Mentale%20Spezies/MueMoiden/gesamtdarstellung/Geistergott%20%C3%BCber%20den%20Ruinen-11.png"
        }
    },
    {
        "id": "k6",
        "name": "Rekonstruktion",
        "stufe": 3,
        "benoetigt": [
            "k4"
        ],
        "kosten": 125,
        "belohnung": {
            "art": "vorteil",
            "text": "„Quellen auswerten“ bringt +2 EK",
            "wirkung": {
                "experiment": 2
            }
        }
    },
    {
        "id": "k7",
        "name": "Vergessene Archive",
        "stufe": 3,
        "benoetigt": [
            "k4",
            "k5"
        ],
        "kosten": 125,
        "belohnung": {
            "art": "vorteil",
            "text": "Erkenntnisse +30 % pro Sekunde",
            "wirkung": {
                "rate": 0.3
            }
        }
    },
    {
        "id": "k8",
        "name": "Chronik der Vorläufer",
        "stufe": 4,
        "benoetigt": [
            "k6",
            "k7"
        ],
        "kosten": 275,
        "belohnung": {
            "art": "gegenstand",
            "name": "Dämonisches Ritual im Ruinentempel",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Mentale%20Spezies/MueMoiden/gesamtdarstellung/D%C3%A4monisches%20Ritual%20im%20Ruinentempel-9.png"
        }
    }
];

mountForschungsbaum(document.querySelector("[data-forschungsbaum]"), {
    schluessel: "Gesellschaft und Kultur/Geschichts- und Archäologieforschung",
    titel: "Geschichts- und Archäologieforschung",
    knoten,
    // Baumform „Kreuzung“ · Ressource und Aktion der Familie „archiv“
    waehrung: {"name":"Erkenntnisse","kurz":"EK"},
    aktion: {"text":"Quellen auswerten","icon":"✎","punkte":3},
    rate: 0.55,
    stufen: ["Quellen","Studien","Deutung","Lehre","Erkenntnis"],
});
