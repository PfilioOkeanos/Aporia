// Megastruktur- und Habitatforschung – Forschungszweig
// Forschungsbaum dieser Seite. Knoten, Kosten und Belohnungen lassen sich hier direkt anpassen.
// Stufen: 0 = Grundlagen, 1 = Vertiefung, 2 = Anwendung, 3 = Durchbruch. „benoetigt“ verbindet die Knoten im Baum.
import "../../_gemeinsam/zweig.js";
import { mountForschungsbaum } from "../../../../Men%C3%BCs/adapter/aporia-forschung.js";

const knoten = [
    {
        "id": "k1",
        "name": "Tragwerkslehre",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k2",
        "name": "Habitatdesign",
        "stufe": 1,
        "benoetigt": [
            "k1"
        ],
        "kosten": 30,
        "belohnung": {
            "art": "vorteil",
            "text": "Rechenzyklen +30 % pro Sekunde",
            "wirkung": {
                "rate": 0.3
            }
        }
    },
    {
        "id": "k3",
        "name": "Rotationsschwerkraft",
        "stufe": 1,
        "benoetigt": [
            "k1"
        ],
        "kosten": 30,
        "belohnung": {
            "art": "gegenstand",
            "name": "Kalter saturn mit eisigen ringen",
            "bild": "../../../../assets/bilder/Himmelsk%C3%B6rper/GasPlaneten/kalter-saturn-mit-eisigen-ringen/hauptseite/kalter-saturn-mit-eisigen-ringen-8aeeeccff8.webp"
        }
    },
    {
        "id": "k4",
        "name": "Großbaustellen",
        "stufe": 2,
        "benoetigt": [
            "k2"
        ],
        "kosten": 80,
        "belohnung": {
            "art": "vorteil",
            "text": "„Simulation starten“ bringt +4 RZ",
            "wirkung": {
                "experiment": 4
            }
        }
    },
    {
        "id": "k5",
        "name": "Lebenserhaltungsnetze",
        "stufe": 2,
        "benoetigt": [
            "k2"
        ],
        "kosten": 80,
        "belohnung": {
            "art": "gegenstand",
            "name": "Tiefblauer eisriese mit zarten ringen",
            "bild": "../../../../assets/bilder/Himmelsk%C3%B6rper/EisWelten/tiefblauer-eisriese-mit-zarten-ringen/hauptseite/tiefblauer-eisriese-mit-zarten-ringen-e8937eae71.webp"
        }
    },
    {
        "id": "k6",
        "name": "Ringhabitate",
        "stufe": 2,
        "benoetigt": [
            "k3"
        ],
        "kosten": 80,
        "belohnung": {
            "art": "vorteil",
            "text": "Rechenzyklen +30 % pro Sekunde",
            "wirkung": {
                "rate": 0.3
            }
        }
    },
    {
        "id": "k7",
        "name": "Lebende Megastrukturen",
        "stufe": 2,
        "benoetigt": [
            "k3"
        ],
        "kosten": 80,
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
        "name": "Dyson-Konstrukte",
        "stufe": 3,
        "benoetigt": [
            "k5",
            "k6"
        ],
        "kosten": 230,
        "belohnung": {
            "art": "gegenstand",
            "name": "Gesellschaft statistik ring ohne zahlen",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Biologische%20Spezies/WaldFeen/Unterseite/Gesellschaft/Waldfeen_Gesellschaft_NUR_NEUE_BILDER_SPEC-0001/05_Statistik/gesellschaft_statistik_ring_ohne_zahlen.png"
        }
    }
];

mountForschungsbaum(document.querySelector("[data-forschungsbaum]"), {
    schluessel: "Spezialisierte und erweiterte Forschung/Megastruktur- und Habitatforschung",
    titel: "Megastruktur- und Habitatforschung",
    knoten,
    // Baumform „Diamant“ · Ressource und Aktion der Familie „hologramm“
    waehrung: {"name":"Rechenzyklen","kurz":"RZ"},
    aktion: {"text":"Simulation starten","icon":"⌬","punkte":3},
    rate: 0.8,
    stufen: ["Theorie","Modell","Simulation","Durchbruch"],
});
