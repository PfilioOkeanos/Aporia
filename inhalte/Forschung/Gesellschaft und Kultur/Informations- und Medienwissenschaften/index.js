// Informations- und Medienwissenschaften – Forschungszweig
// Forschungsbaum dieser Seite. Knoten, Kosten und Belohnungen lassen sich hier direkt anpassen.
// Stufen: 0 = Grundlagen, 1 = Vertiefung, 2 = Anwendung, 3 = Durchbruch. „benoetigt“ verbindet die Knoten im Baum.
import "../../_gemeinsam/zweig.js";
import { mountForschungsbaum } from "../../../../Men%C3%BCs/adapter/aporia-forschung.js";

const knoten = [
    {
        "id": "k1",
        "name": "Medientheorie",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 5
    },
    {
        "id": "k2",
        "name": "Informationsdesign",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 5
    },
    {
        "id": "k3",
        "name": "Archivwesen",
        "stufe": 1,
        "benoetigt": [
            "k1"
        ],
        "kosten": 15,
        "belohnung": {
            "art": "vorteil",
            "text": "Forschungskosten −12 %",
            "wirkung": {
                "rabatt": 0.12
            }
        }
    },
    {
        "id": "k4",
        "name": "Propagandaanalyse",
        "stufe": 1,
        "benoetigt": [
            "k1",
            "k2"
        ],
        "kosten": 15,
        "belohnung": {
            "art": "vorteil",
            "text": "Erkenntnisse +20 % pro Sekunde",
            "wirkung": {
                "rate": 0.2
            }
        }
    },
    {
        "id": "k5",
        "name": "Holomedien",
        "stufe": 1,
        "benoetigt": [
            "k2"
        ],
        "kosten": 15,
        "belohnung": {
            "art": "vorteil",
            "text": "Forschungskosten −10 %",
            "wirkung": {
                "rabatt": 0.1
            }
        }
    },
    {
        "id": "k6",
        "name": "Datenjournalismus",
        "stufe": 2,
        "benoetigt": [
            "k3",
            "k4"
        ],
        "kosten": 30,
        "belohnung": {
            "art": "gegenstand",
            "name": "Medien",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Technologische%20Lebensformen/Architektoiden/hauptseite/medien.jpg"
        }
    },
    {
        "id": "k7",
        "name": "Kollektives Gedächtnis",
        "stufe": 2,
        "benoetigt": [
            "k4",
            "k5"
        ],
        "kosten": 30,
        "belohnung": {
            "art": "vorteil",
            "text": "„Quellen auswerten“ bringt +4 EK",
            "wirkung": {
                "experiment": 4
            }
        }
    },
    {
        "id": "k8",
        "name": "Informationsökologie",
        "stufe": 3,
        "benoetigt": [
            "k6",
            "k7"
        ],
        "kosten": 75,
        "belohnung": {
            "art": "gegenstand",
            "name": "Medien babiew",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Biologische%20Spezies/Aeromorphen/Unterseiten/Medien/medien_babiew.webp"
        }
    }
];

mountForschungsbaum(document.querySelector("[data-forschungsbaum]"), {
    schluessel: "Gesellschaft und Kultur/Informations- und Medienwissenschaften",
    titel: "Informations- und Medienwissenschaften",
    knoten,
    // Baumform „Pyramide“ · Ressource und Aktion der Familie „archiv“
    waehrung: {"name":"Erkenntnisse","kurz":"EK"},
    aktion: {"text":"Quellen auswerten","icon":"✎","punkte":3},
    rate: 0.55,
    stufen: ["Quellen","Studien","Deutung","Erkenntnis"],
});
