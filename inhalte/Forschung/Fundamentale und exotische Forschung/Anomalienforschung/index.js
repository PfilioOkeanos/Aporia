// Anomalienforschung – Forschungszweig
// Forschungsbaum dieser Seite. Knoten, Kosten und Belohnungen lassen sich hier direkt anpassen.
// Stufen: 0 = Grundlagen, 1 = Vertiefung, 2 = Anwendung, 3 = Durchbruch. „benoetigt“ verbindet die Knoten im Baum.
import "../../_gemeinsam/zweig.js";
import { mountForschungsbaum } from "../../../../Men%C3%BCs/adapter/aporia-forschung.js";

const knoten = [
    {
        "id": "k1",
        "name": "Beobachtungsprotokolle",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k2",
        "name": "Messverfahren",
        "stufe": 1,
        "benoetigt": [
            "k1"
        ],
        "kosten": 25,
        "belohnung": {
            "art": "gegenstand",
            "name": "Ursprung raumzeit anomalie",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Biologische%20Spezies/Aeromorphen/Unterseiten/Entwicklung/ursprung_raumzeit_anomalie.png"
        }
    },
    {
        "id": "k3",
        "name": "Raumrisse",
        "stufe": 1,
        "benoetigt": [
            "k1"
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
        "id": "k4",
        "name": "Zeitanomalien",
        "stufe": 2,
        "benoetigt": [
            "k2"
        ],
        "kosten": 60,
        "belohnung": {
            "art": "vorteil",
            "text": "„Teilchen kollidieren“ bringt +4 QE",
            "wirkung": {
                "experiment": 4
            }
        }
    },
    {
        "id": "k5",
        "name": "Signalanomalien",
        "stufe": 2,
        "benoetigt": [
            "k2",
            "k3"
        ],
        "kosten": 60,
        "belohnung": {
            "art": "vorteil",
            "text": "Quantenenergie +40 % pro Sekunde",
            "wirkung": {
                "rate": 0.4
            }
        }
    },
    {
        "id": "k6",
        "name": "Anomaliekartierung",
        "stufe": 3,
        "benoetigt": [
            "k4"
        ],
        "kosten": 150,
        "belohnung": {
            "art": "vorteil",
            "text": "Quantenenergie +40 % pro Sekunde",
            "wirkung": {
                "rate": 0.4
            }
        }
    },
    {
        "id": "k7",
        "name": "Eindämmung",
        "stufe": 3,
        "benoetigt": [
            "k5"
        ],
        "kosten": 150,
        "belohnung": {
            "art": "vorteil",
            "text": "Forschungskosten −12 %",
            "wirkung": {
                "rabatt": 0.12
            }
        }
    },
    {
        "id": "k8",
        "name": "Ursprung der Anomalien",
        "stufe": 4,
        "benoetigt": [
            "k6",
            "k7"
        ],
        "kosten": 380,
        "belohnung": {
            "art": "gegenstand",
            "name": "Ursprung anomalie",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Biologische%20Spezies/Aeromorphen/Unterseiten/Entwicklung/ursprung_anomalie.webp"
        }
    }
];

mountForschungsbaum(document.querySelector("[data-forschungsbaum]"), {
    schluessel: "Fundamentale und exotische Forschung/Anomalienforschung",
    titel: "Anomalienforschung",
    knoten,
    // Baumform „Kette“ · Ressource und Aktion der Familie „quanten“
    waehrung: {"name":"Quantenenergie","kurz":"QE"},
    aktion: {"text":"Teilchen kollidieren","icon":"⚛","punkte":3},
    rate: 0.7,
    stufen: ["Hypothese","Messung","Feld","Kontrolle","Durchbruch"],
});
