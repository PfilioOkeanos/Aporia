// Okkultismusforschung – Forschungszweig
// Forschungsbaum dieser Seite. Knoten, Kosten und Belohnungen lassen sich hier direkt anpassen.
// Stufen: 0 = Grundlagen, 1 = Vertiefung, 2 = Anwendung, 3 = Durchbruch. „benoetigt“ verbindet die Knoten im Baum.
import "../../_gemeinsam/zweig.js";
import { mountForschungsbaum } from "../../../../Men%C3%BCs/adapter/aporia-forschung.js";

const knoten = [
    {
        "id": "k1",
        "name": "Okkulte Schriften",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 5
    },
    {
        "id": "k2",
        "name": "Geheimsymbole",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 5
    },
    {
        "id": "k3",
        "name": "Verbotene Archive",
        "stufe": 1,
        "benoetigt": [
            "k1",
            "k2"
        ],
        "kosten": 15,
        "belohnung": {
            "art": "vorteil",
            "text": "Ätheressenz +30 % pro Sekunde",
            "wirkung": {
                "rate": 0.3
            }
        }
    },
    {
        "id": "k4",
        "name": "Grimoire-Analyse",
        "stufe": 2,
        "benoetigt": [
            "k3"
        ],
        "kosten": 35,
        "belohnung": {
            "art": "vorteil",
            "text": "Ätheressenz +30 % pro Sekunde",
            "wirkung": {
                "rate": 0.3
            }
        }
    },
    {
        "id": "k5",
        "name": "Schattenkulte",
        "stufe": 2,
        "benoetigt": [
            "k3"
        ],
        "kosten": 35,
        "belohnung": {
            "art": "vorteil",
            "text": "„Ritual vollziehen“ bringt +1 ÄE",
            "wirkung": {
                "experiment": 1
            }
        }
    },
    {
        "id": "k6",
        "name": "Okkulte Praktiken",
        "stufe": 3,
        "benoetigt": [
            "k4"
        ],
        "kosten": 85,
        "belohnung": {
            "art": "gegenstand",
            "name": "Technoid-Bestiarium · Zehn Urformen",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Biologische%20Spezies/Technoiden/gesamtdarstellung/Technoid-Bestiarium_%20Zehn%20Urformen-13.png"
        }
    },
    {
        "id": "k7",
        "name": "Verborgene Lehren",
        "stufe": 3,
        "benoetigt": [
            "k4",
            "k5"
        ],
        "kosten": 85,
        "belohnung": {
            "art": "vorteil",
            "text": "Forschungskosten −10 %",
            "wirkung": {
                "rabatt": 0.1
            }
        }
    },
    {
        "id": "k8",
        "name": "Das verbotene Wissen",
        "stufe": 4,
        "benoetigt": [
            "k6",
            "k7"
        ],
        "kosten": 210,
        "belohnung": {
            "art": "gegenstand",
            "name": "Okkultes Bestiarium des Moimoiden",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Mentale%20Spezies/MueMoiden/gesamtdarstellung/Okkultes%20Bestiarium%20des%20Moimoiden-7.png"
        }
    }
];

mountForschungsbaum(document.querySelector("[data-forschungsbaum]"), {
    schluessel: "Mystik und Bewusstsein/Okkultismusforschung",
    titel: "Okkultismusforschung",
    knoten,
    // Baumform „Kreuzung“ · Ressource und Aktion der Familie „arkan“
    waehrung: {"name":"Ätheressenz","kurz":"ÄE"},
    aktion: {"text":"Ritual vollziehen","icon":"✧","punkte":5},
    rate: 0.45,
    stufen: ["Überlieferung","Symbol","Ritus","Resonanz","Offenbarung"],
});
