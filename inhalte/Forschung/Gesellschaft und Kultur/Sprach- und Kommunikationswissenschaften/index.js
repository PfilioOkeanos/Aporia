// Sprach- und Kommunikationswissenschaften – Forschungszweig
// Forschungsbaum dieser Seite. Knoten, Kosten und Belohnungen lassen sich hier direkt anpassen.
// Stufen: 0 = Grundlagen, 1 = Vertiefung, 2 = Anwendung, 3 = Durchbruch. „benoetigt“ verbindet die Knoten im Baum.
import "../../_gemeinsam/zweig.js";
import { mountForschungsbaum } from "../../../../Men%C3%BCs/adapter/aporia-forschung.js";

const knoten = [
    {
        "id": "k1",
        "name": "Phonetik",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k2",
        "name": "Grammatik",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k3",
        "name": "Semiotik",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k4",
        "name": "Übersetzung",
        "stufe": 1,
        "benoetigt": [
            "k1",
            "k2"
        ],
        "kosten": 20,
        "belohnung": {
            "art": "gegenstand",
            "name": "Technoide Kommunikation in der Lavagrotte",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Biologische%20Spezies/Technoiden/gesamtdarstellung/Technoide%20Kommunikation%20in%20der%20Lavagrotte-9.png"
        }
    },
    {
        "id": "k5",
        "name": "Nonverbale Signale",
        "stufe": 1,
        "benoetigt": [
            "k2",
            "k3"
        ],
        "kosten": 20,
        "belohnung": {
            "art": "gegenstand",
            "name": "Verhalten Kommunikation",
            "bild": "../../../../assets/bilder/Himmelsk%C3%B6rper/OzeanWelt/erde-im-sternenmeer/unterseiten/ERDE_BILDER/Flora%20&%20Fauna/15%20%E2%80%93%20Verhalten%20&%20Kommunikation/15_Verhalten_Kommunikation.jpg"
        }
    },
    {
        "id": "k6",
        "name": "Glyphenanalyse",
        "stufe": 2,
        "benoetigt": [
            "k4"
        ],
        "kosten": 35,
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
        "name": "Universalsprache",
        "stufe": 2,
        "benoetigt": [
            "k4",
            "k5"
        ],
        "kosten": 35,
        "belohnung": {
            "art": "vorteil",
            "text": "Erkenntnisse +25 % pro Sekunde",
            "wirkung": {
                "rate": 0.25
            }
        }
    },
    {
        "id": "k8",
        "name": "Gedankensprache",
        "stufe": 3,
        "benoetigt": [
            "k6",
            "k7"
        ],
        "kosten": 70,
        "belohnung": {
            "art": "gegenstand",
            "name": "Technogolem mit leuchtender Hologramm-Kommunikation",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Biologische%20Spezies/Technoiden/gesamtdarstellung/Technogolem%20mit%20leuchtender%20Hologramm-Kommunikation-1.png"
        }
    }
];

mountForschungsbaum(document.querySelector("[data-forschungsbaum]"), {
    schluessel: "Gesellschaft und Kultur/Sprach- und Kommunikationswissenschaften",
    titel: "Sprach- und Kommunikationswissenschaften",
    knoten,
    // Baumform „Netz“ · Ressource und Aktion der Familie „archiv“
    waehrung: {"name":"Erkenntnisse","kurz":"EK"},
    aktion: {"text":"Quellen auswerten","icon":"✎","punkte":3},
    rate: 0.55,
    stufen: ["Quellen","Studien","Deutung","Erkenntnis"],
});
