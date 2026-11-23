// Morphologie und Transformationsforschung – Forschungszweig
// Forschungsbaum dieser Seite. Knoten, Kosten und Belohnungen lassen sich hier direkt anpassen.
// Stufen: 0 = Grundlagen, 1 = Vertiefung, 2 = Anwendung, 3 = Durchbruch. „benoetigt“ verbindet die Knoten im Baum.
import "../../_gemeinsam/zweig.js";
import { mountForschungsbaum } from "../../../../Men%C3%BCs/adapter/aporia-forschung.js";

const knoten = [
    {
        "id": "k1",
        "name": "Körperbaupläne",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 5
    },
    {
        "id": "k2",
        "name": "Wachstumsmuster",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 5
    },
    {
        "id": "k3",
        "name": "Metamorphose",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 5
    },
    {
        "id": "k4",
        "name": "Gewebeplastizität",
        "stufe": 1,
        "benoetigt": [
            "k1",
            "k2"
        ],
        "kosten": 20,
        "belohnung": {
            "art": "gegenstand",
            "name": "Aussere Gestalt Abplattung",
            "bild": "../../../../assets/bilder/Himmelsk%C3%B6rper/OzeanWelt/erde/unterseiten/ERDE_BILDER/Planetare%20Strukturen/02%20%E2%80%93%20%C3%84u%C3%9Fere%20Gestalt%20&%20Abplattung/02_Aussere_Gestalt_Abplattung.jpg"
        }
    },
    {
        "id": "k5",
        "name": "Formwandel",
        "stufe": 1,
        "benoetigt": [
            "k2",
            "k3"
        ],
        "kosten": 20,
        "belohnung": {
            "art": "gegenstand",
            "name": "Mykonoid 2 (1)",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Biologische%20Spezies/Mykonoiden/EntwicklungsStadien/Mykonoid_2%20(1080%20x%201620%20px)(1).png"
        }
    },
    {
        "id": "k6",
        "name": "Gezielte Transformation",
        "stufe": 2,
        "benoetigt": [
            "k4"
        ],
        "kosten": 50,
        "belohnung": {
            "art": "vorteil",
            "text": "Rechenzyklen +25 % pro Sekunde",
            "wirkung": {
                "rate": 0.25
            }
        }
    },
    {
        "id": "k7",
        "name": "Adaptive Körper",
        "stufe": 2,
        "benoetigt": [
            "k4",
            "k5"
        ],
        "kosten": 50,
        "belohnung": {
            "art": "vorteil",
            "text": "„Simulation starten“ bringt +4 RZ",
            "wirkung": {
                "experiment": 4
            }
        }
    },
    {
        "id": "k8",
        "name": "Freie Gestaltwahl",
        "stufe": 3,
        "benoetigt": [
            "k6",
            "k7"
        ],
        "kosten": 125,
        "belohnung": {
            "art": "gegenstand",
            "name": "Technoide · Zehn Gestaltvarianten",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Biologische%20Spezies/Technoiden/gesamtdarstellung/Technoide_%20Zehn%20Gestaltvarianten-4.png"
        }
    }
];

mountForschungsbaum(document.querySelector("[data-forschungsbaum]"), {
    schluessel: "Spezialisierte und erweiterte Forschung/Morphologie und Transformationsforschung",
    titel: "Morphologie und Transformationsforschung",
    knoten,
    // Baumform „Netz“ · Ressource und Aktion der Familie „hologramm“
    waehrung: {"name":"Rechenzyklen","kurz":"RZ"},
    aktion: {"text":"Simulation starten","icon":"⌬","punkte":3},
    rate: 0.8,
    stufen: ["Theorie","Modell","Simulation","Durchbruch"],
});
