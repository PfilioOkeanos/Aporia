// Gravitations- und Raumzeitforschung – Forschungszweig
// Forschungsbaum dieser Seite. Knoten, Kosten und Belohnungen lassen sich hier direkt anpassen.
// Stufen: 0 = Grundlagen, 1 = Vertiefung, 2 = Anwendung, 3 = Durchbruch. „benoetigt“ verbindet die Knoten im Baum.
import "../../_gemeinsam/zweig.js";
import { mountForschungsbaum } from "../../../../Men%C3%BCs/adapter/aporia-forschung.js";

const knoten = [
    {
        "id": "k1",
        "name": "Gravitationsfelder",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 5
    },
    {
        "id": "k2",
        "name": "Raumzeitkrümmung",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 5
    },
    {
        "id": "k3",
        "name": "Gravitationswellen",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 5
    },
    {
        "id": "k4",
        "name": "Gezeitenkräfte",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 5
    },
    {
        "id": "k5",
        "name": "Schwarze Löcher",
        "stufe": 1,
        "benoetigt": [
            "k1",
            "k2"
        ],
        "kosten": 20,
        "belohnung": {
            "art": "gegenstand",
            "name": "Gravitationsbeziehungen Resonanzen",
            "bild": "../../../../assets/bilder/Himmelsk%C3%B6rper/OzeanWelt/erde-im-sternenmeer/unterseiten/ERDE_BILDER/Astronomie/08%20%E2%80%93%20Gravitationsbeziehungen%20&%20Resonanzen/08_Gravitationsbeziehungen_Resonanzen.jpg"
        }
    },
    {
        "id": "k6",
        "name": "Gravitationslinsen",
        "stufe": 1,
        "benoetigt": [
            "k3",
            "k4"
        ],
        "kosten": 20,
        "belohnung": {
            "art": "gegenstand",
            "name": "Schwarzes loch mit leuchtendem gravitationsbogen",
            "bild": "../../../../assets/bilder/Himmelsk%C3%B6rper/SchwarzeL%C3%B6cher/schwarzes-loch-mit-leuchtendem-gravitationsbogen/hauptseite/schwarzes-loch-mit-leuchtendem-gravitationsbogen-0b75cb8f39e1.jpg"
        }
    },
    {
        "id": "k7",
        "name": "Antigravitation",
        "stufe": 2,
        "benoetigt": [
            "k5",
            "k6"
        ],
        "kosten": 50,
        "belohnung": {
            "art": "vorteil",
            "text": "„Teilchen kollidieren“ bringt +1 QE",
            "wirkung": {
                "experiment": 1
            }
        }
    },
    {
        "id": "k8",
        "name": "Raumzeitfaltung",
        "stufe": 3,
        "benoetigt": [
            "k7"
        ],
        "kosten": 135,
        "belohnung": {
            "art": "gegenstand",
            "name": "Antrieb 04 gravitationsantrieb",
            "bild": "../../../../assets/bilder/Fahrzeuge%20&%20Raumschiffe/Antriebe/antrieb_04_gravitationsantrieb.png"
        }
    }
];

mountForschungsbaum(document.querySelector("[data-forschungsbaum]"), {
    schluessel: "Fundamentale und exotische Forschung/Gravitations- und Raumzeitforschung",
    titel: "Gravitations- und Raumzeitforschung",
    knoten,
    // Baumform „Breite Basis“ · Ressource und Aktion der Familie „quanten“
    waehrung: {"name":"Quantenenergie","kurz":"QE"},
    aktion: {"text":"Teilchen kollidieren","icon":"⚛","punkte":3},
    rate: 0.7,
    stufen: ["Hypothese","Messung","Feld","Durchbruch"],
});
