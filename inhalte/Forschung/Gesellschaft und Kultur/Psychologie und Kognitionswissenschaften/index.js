// Psychologie und Kognitionswissenschaften – Forschungszweig
// Forschungsbaum dieser Seite. Knoten, Kosten und Belohnungen lassen sich hier direkt anpassen.
// Stufen: 0 = Grundlagen, 1 = Vertiefung, 2 = Anwendung, 3 = Durchbruch. „benoetigt“ verbindet die Knoten im Baum.
import "../../_gemeinsam/zweig.js";
import { mountForschungsbaum } from "../../../../Men%C3%BCs/adapter/aporia-forschung.js";

const knoten = [
    {
        "id": "k1",
        "name": "Wahrnehmung",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k2",
        "name": "Gedächtnis",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k3",
        "name": "Lernpsychologie",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k4",
        "name": "Emotionsforschung",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k5",
        "name": "Sozialpsychologie",
        "stufe": 1,
        "benoetigt": [
            "k1",
            "k2"
        ],
        "kosten": 25,
        "belohnung": {
            "art": "vorteil",
            "text": "Forschungskosten −12 %",
            "wirkung": {
                "rabatt": 0.12
            }
        }
    },
    {
        "id": "k6",
        "name": "Kognitive Modelle",
        "stufe": 1,
        "benoetigt": [
            "k3",
            "k4"
        ],
        "kosten": 25,
        "belohnung": {
            "art": "gegenstand",
            "name": "Biolumineszentes neuronales Jelly-Netzwerk",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Mentale%20Spezies/Noetiden/gesamtdarstellung/Biolumineszentes%20neuronales%20Jelly-Netzwerk-6.png"
        }
    },
    {
        "id": "k7",
        "name": "Speziesvergleichende Psychologie",
        "stufe": 2,
        "benoetigt": [
            "k5",
            "k6"
        ],
        "kosten": 50,
        "belohnung": {
            "art": "vorteil",
            "text": "Erkenntnisse +20 % pro Sekunde",
            "wirkung": {
                "rate": 0.2
            }
        }
    },
    {
        "id": "k8",
        "name": "Theorie des Geistes",
        "stufe": 3,
        "benoetigt": [
            "k7"
        ],
        "kosten": 105,
        "belohnung": {
            "art": "gegenstand",
            "name": "Biolumineszentes Jellyfish-Neuronennetzwerk",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Mentale%20Spezies/Noetiden/gesamtdarstellung/Biolumineszentes%20Jellyfish-Neuronennetzwerk.png"
        }
    }
];

mountForschungsbaum(document.querySelector("[data-forschungsbaum]"), {
    schluessel: "Gesellschaft und Kultur/Psychologie und Kognitionswissenschaften",
    titel: "Psychologie und Kognitionswissenschaften",
    knoten,
    // Baumform „Breite Basis“ · Ressource und Aktion der Familie „archiv“
    waehrung: {"name":"Erkenntnisse","kurz":"EK"},
    aktion: {"text":"Quellen auswerten","icon":"✎","punkte":3},
    rate: 0.55,
    stufen: ["Quellen","Studien","Deutung","Erkenntnis"],
});
