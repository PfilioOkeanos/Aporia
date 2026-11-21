// Mystikforschung – Forschungszweig
// Forschungsbaum dieser Seite. Knoten, Kosten und Belohnungen lassen sich hier direkt anpassen.
// Stufen: 0 = Grundlagen, 1 = Vertiefung, 2 = Anwendung, 3 = Durchbruch. „benoetigt“ verbindet die Knoten im Baum.
import "../../_gemeinsam/zweig.js";
import { mountForschungsbaum } from "../../../../Men%C3%BCs/adapter/aporia-forschung.js";

const knoten = [
    {
        "id": "k1",
        "name": "Überlieferungen",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k2",
        "name": "Mystische Erfahrung",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k3",
        "name": "Visionen",
        "stufe": 1,
        "benoetigt": [
            "k1"
        ],
        "kosten": 30,
        "belohnung": {
            "art": "vorteil",
            "text": "Ätheressenz +40 % pro Sekunde",
            "wirkung": {
                "rate": 0.4
            }
        }
    },
    {
        "id": "k4",
        "name": "Heilige Orte",
        "stufe": 1,
        "benoetigt": [
            "k2"
        ],
        "kosten": 30,
        "belohnung": {
            "art": "gegenstand",
            "name": "Vulkanhöhle mit leuchtendem Übersetzerwesen",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Biologische%20Spezies/Technoiden/gesamtdarstellung/Vulkanh%C3%B6hle%20mit%20leuchtendem%20%C3%9Cbersetzerwesen-6.png"
        }
    },
    {
        "id": "k5",
        "name": "Mystische Symbole",
        "stufe": 2,
        "benoetigt": [
            "k3"
        ],
        "kosten": 65,
        "belohnung": {
            "art": "gegenstand",
            "name": "Vulkanischer Technoid mit leuchtenden Kristallen",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Biologische%20Spezies/Technoiden/gesamtdarstellung/Vulkanischer%20Technoid%20mit%20leuchtenden%20Kristallen-16.png"
        }
    },
    {
        "id": "k6",
        "name": "Resonanzfelder",
        "stufe": 2,
        "benoetigt": [
            "k3",
            "k4"
        ],
        "kosten": 65,
        "belohnung": {
            "art": "vorteil",
            "text": "Forschungskosten −20 %",
            "wirkung": {
                "rabatt": 0.2
            }
        }
    },
    {
        "id": "k7",
        "name": "Mystische Praxis",
        "stufe": 2,
        "benoetigt": [
            "k4"
        ],
        "kosten": 65,
        "belohnung": {
            "art": "vorteil",
            "text": "„Ritual vollziehen“ bringt +2 ÄE",
            "wirkung": {
                "experiment": 2
            }
        }
    },
    {
        "id": "k8",
        "name": "Einheit des Mystischen",
        "stufe": 3,
        "benoetigt": [
            "k5",
            "k6",
            "k7"
        ],
        "kosten": 145,
        "belohnung": {
            "art": "gegenstand",
            "name": "Geisterhafte Nekropole im Sturmlicht",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Mentale%20Spezies/MueMoiden/gesamtdarstellung/Geisterhafte%20Nekropole%20im%20Sturmlicht-16.png"
        }
    }
];

mountForschungsbaum(document.querySelector("[data-forschungsbaum]"), {
    schluessel: "Mystik und Bewusstsein/Mystikforschung",
    titel: "Mystikforschung",
    knoten,
    // Baumform „Zwillingsstamm“ · Ressource und Aktion der Familie „arkan“
    waehrung: {"name":"Ätheressenz","kurz":"ÄE"},
    aktion: {"text":"Ritual vollziehen","icon":"✧","punkte":5},
    rate: 0.45,
    stufen: ["Überlieferung","Symbol","Ritus","Offenbarung"],
});
