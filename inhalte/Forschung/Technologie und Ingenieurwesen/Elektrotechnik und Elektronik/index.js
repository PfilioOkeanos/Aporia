// Elektrotechnik und Elektronik – Forschungszweig
// Forschungsbaum dieser Seite. Knoten, Kosten und Belohnungen lassen sich hier direkt anpassen.
// Stufen: 0 = Grundlagen, 1 = Vertiefung, 2 = Anwendung, 3 = Durchbruch. „benoetigt“ verbindet die Knoten im Baum.
import "../../_gemeinsam/zweig.js";
import { mountForschungsbaum } from "../../../../Men%C3%BCs/adapter/aporia-forschung.js";

const knoten = [
    {
        "id": "k1",
        "name": "Schaltungstechnik",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k2",
        "name": "Halbleiter",
        "stufe": 1,
        "benoetigt": [
            "k1"
        ],
        "kosten": 30,
        "belohnung": {
            "art": "vorteil",
            "text": "„Prototyp bauen“ bringt +2 KP",
            "wirkung": {
                "experiment": 2
            }
        }
    },
    {
        "id": "k3",
        "name": "Sensorik",
        "stufe": 1,
        "benoetigt": [
            "k1"
        ],
        "kosten": 30,
        "belohnung": {
            "art": "gegenstand",
            "name": "Leuchtendes Oganesson-Signal im Teilchendetektor",
            "bild": "../../../../assets/bilder/Rohstoffe/Leuchtendes%20Oganesson-Signal%20im%20Teilchendetektor-115.png"
        }
    },
    {
        "id": "k4",
        "name": "Signalverarbeitung",
        "stufe": 2,
        "benoetigt": [
            "k2"
        ],
        "kosten": 75,
        "belohnung": {
            "art": "vorteil",
            "text": "Konstruktionspunkte +30 % pro Sekunde",
            "wirkung": {
                "rate": 0.3
            }
        }
    },
    {
        "id": "k5",
        "name": "Hochfrequenztechnik",
        "stufe": 2,
        "benoetigt": [
            "k2",
            "k3"
        ],
        "kosten": 75,
        "belohnung": {
            "art": "vorteil",
            "text": "Konstruktionspunkte +30 % pro Sekunde",
            "wirkung": {
                "rate": 0.3
            }
        }
    },
    {
        "id": "k6",
        "name": "Feldscanner",
        "stufe": 3,
        "benoetigt": [
            "k4"
        ],
        "kosten": 205,
        "belohnung": {
            "art": "vorteil",
            "text": "„Prototyp bauen“ bringt +3 KP",
            "wirkung": {
                "experiment": 3
            }
        }
    },
    {
        "id": "k7",
        "name": "Quantenelektronik",
        "stufe": 3,
        "benoetigt": [
            "k5"
        ],
        "kosten": 205,
        "belohnung": {
            "art": "vorteil",
            "text": "Forschungskosten −20 %",
            "wirkung": {
                "rabatt": 0.2
            }
        }
    },
    {
        "id": "k8",
        "name": "Neuromorphe Chips",
        "stufe": 4,
        "benoetigt": [
            "k6",
            "k7"
        ],
        "kosten": 540,
        "belohnung": {
            "art": "gegenstand",
            "name": "Hassium-Signal im dunklen Labor",
            "bild": "../../../../assets/bilder/Rohstoffe/Hassium-Signal%20im%20dunklen%20Labor-104.png"
        }
    }
];

mountForschungsbaum(document.querySelector("[data-forschungsbaum]"), {
    schluessel: "Technologie und Ingenieurwesen/Elektrotechnik und Elektronik",
    titel: "Elektrotechnik und Elektronik",
    knoten,
    // Baumform „Kette“ · Ressource und Aktion der Familie „werkstatt“
    waehrung: {"name":"Konstruktionspunkte","kurz":"KP"},
    aktion: {"text":"Prototyp bauen","icon":"⚙","punkte":3},
    rate: 0.7,
    stufen: ["Grundlagen","Entwurf","Prototyp","Fertigung","Meisterwerk"],
});
