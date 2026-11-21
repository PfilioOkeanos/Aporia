// Mathematik und theoretische Forschung – Forschungszweig
// Forschungsbaum dieser Seite. Knoten, Kosten und Belohnungen lassen sich hier direkt anpassen.
// Stufen: 0 = Grundlagen, 1 = Vertiefung, 2 = Anwendung, 3 = Durchbruch. „benoetigt“ verbindet die Knoten im Baum.
import "../../_gemeinsam/zweig.js";
import { mountForschungsbaum } from "../../../../Men%C3%BCs/adapter/aporia-forschung.js";

const knoten = [
    {
        "id": "k1",
        "name": "Logik",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k2",
        "name": "Algebra",
        "stufe": 1,
        "benoetigt": [
            "k1"
        ],
        "kosten": 25,
        "belohnung": {
            "art": "vorteil",
            "text": "Rechenzyklen +15 % pro Sekunde",
            "wirkung": {
                "rate": 0.15
            }
        }
    },
    {
        "id": "k3",
        "name": "Analysis",
        "stufe": 1,
        "benoetigt": [
            "k1"
        ],
        "kosten": 25,
        "belohnung": {
            "art": "gegenstand",
            "name": "Leuchtendes Netzwerk aus Kristallmembranen",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Mentale%20Spezies/Noetiden/gesamtdarstellung/Leuchtendes%20Netzwerk%20aus%20Kristallmembranen-1.png"
        }
    },
    {
        "id": "k4",
        "name": "Topologie",
        "stufe": 2,
        "benoetigt": [
            "k2"
        ],
        "kosten": 70,
        "belohnung": {
            "art": "gegenstand",
            "name": "Ritual im Kristalltempel geschniegelt",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Mentale%20Spezies/MueMoiden/gesamtdarstellung/Ritual%20im%20Kristalltempel%20geschniegelt-15.png"
        }
    },
    {
        "id": "k5",
        "name": "Wahrscheinlichkeit",
        "stufe": 2,
        "benoetigt": [
            "k2",
            "k3"
        ],
        "kosten": 70,
        "belohnung": {
            "art": "vorteil",
            "text": "Rechenzyklen +30 % pro Sekunde",
            "wirkung": {
                "rate": 0.3
            }
        }
    },
    {
        "id": "k6",
        "name": "Chaostheorie",
        "stufe": 3,
        "benoetigt": [
            "k4"
        ],
        "kosten": 170,
        "belohnung": {
            "art": "vorteil",
            "text": "Forschungskosten −12 %",
            "wirkung": {
                "rabatt": 0.12
            }
        }
    },
    {
        "id": "k7",
        "name": "Höherdimensionale Geometrie",
        "stufe": 3,
        "benoetigt": [
            "k5"
        ],
        "kosten": 170,
        "belohnung": {
            "art": "vorteil",
            "text": "„Simulation starten“ bringt +2 RZ",
            "wirkung": {
                "experiment": 2
            }
        }
    },
    {
        "id": "k8",
        "name": "Theorie von Allem",
        "stufe": 4,
        "benoetigt": [
            "k6",
            "k7"
        ],
        "kosten": 420,
        "belohnung": {
            "art": "gegenstand",
            "name": "Kristallbestie in der leuchtenden Grotte",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Biologische%20Spezies/Technoiden/gesamtdarstellung/Kristallbestie%20in%20der%20leuchtenden%20Grotte-12.png"
        }
    }
];

mountForschungsbaum(document.querySelector("[data-forschungsbaum]"), {
    schluessel: "Spezialisierte und erweiterte Forschung/Mathematik und theoretische Forschung",
    titel: "Mathematik und theoretische Forschung",
    knoten,
    // Baumform „Kette“ · Ressource und Aktion der Familie „hologramm“
    waehrung: {"name":"Rechenzyklen","kurz":"RZ"},
    aktion: {"text":"Simulation starten","icon":"⌬","punkte":3},
    rate: 0.8,
    stufen: ["Theorie","Modell","Simulation","Prototyp","Durchbruch"],
});
