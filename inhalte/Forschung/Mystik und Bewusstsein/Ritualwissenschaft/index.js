// Ritualwissenschaft – Forschungszweig
// Forschungsbaum dieser Seite. Knoten, Kosten und Belohnungen lassen sich hier direkt anpassen.
// Stufen: 0 = Grundlagen, 1 = Vertiefung, 2 = Anwendung, 3 = Durchbruch. „benoetigt“ verbindet die Knoten im Baum.
import "../../_gemeinsam/zweig.js";
import { mountForschungsbaum } from "../../../../Men%C3%BCs/adapter/aporia-forschung.js";

const knoten = [
    {
        "id": "k1",
        "name": "Ritualkunde",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k2",
        "name": "Symbolsprache",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k3",
        "name": "Zeremonialordnung",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k4",
        "name": "Rituelle Orte",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k5",
        "name": "Gemeinschaftsrituale",
        "stufe": 1,
        "benoetigt": [
            "k1",
            "k2"
        ],
        "kosten": 25,
        "belohnung": {
            "art": "gegenstand",
            "name": "Kultur Traditionen",
            "bild": "../../../../assets/bilder/Himmelsk%C3%B6rper/OzeanWelt/erde-im-sternenmeer/unterseiten/ERDE_BILDER/Zivilisation/07%20%E2%80%93%20Kultur%20&%20Traditionen/07_Kultur_Traditionen.jpg"
        }
    },
    {
        "id": "k6",
        "name": "Ritualwirkung",
        "stufe": 1,
        "benoetigt": [
            "k3",
            "k4"
        ],
        "kosten": 25,
        "belohnung": {
            "art": "vorteil",
            "text": "Ätheressenz +20 % pro Sekunde",
            "wirkung": {
                "rate": 0.2
            }
        }
    },
    {
        "id": "k7",
        "name": "Bindungsrituale",
        "stufe": 2,
        "benoetigt": [
            "k5",
            "k6"
        ],
        "kosten": 55,
        "belohnung": {
            "art": "vorteil",
            "text": "Forschungskosten −15 %",
            "wirkung": {
                "rabatt": 0.15
            }
        }
    },
    {
        "id": "k8",
        "name": "Das große Ritual",
        "stufe": 3,
        "benoetigt": [
            "k7"
        ],
        "kosten": 125,
        "belohnung": {
            "art": "gegenstand",
            "name": "Dunkle Muemoid-Konzepttafel mit Ritualsymbolen",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Mentale%20Spezies/MueMoiden/gesamtdarstellung/Dunkle%20Muemoid-Konzepttafel%20mit%20Ritualsymbolen-6.png"
        }
    }
];

mountForschungsbaum(document.querySelector("[data-forschungsbaum]"), {
    schluessel: "Mystik und Bewusstsein/Ritualwissenschaft",
    titel: "Ritualwissenschaft",
    knoten,
    // Baumform „Breite Basis“ · Ressource und Aktion der Familie „arkan“
    waehrung: {"name":"Ätheressenz","kurz":"ÄE"},
    aktion: {"text":"Ritual vollziehen","icon":"✧","punkte":5},
    rate: 0.45,
    stufen: ["Überlieferung","Symbol","Ritus","Offenbarung"],
});
