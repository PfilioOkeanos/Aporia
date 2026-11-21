// Bewusstseinsforschung – Forschungszweig
// Forschungsbaum dieser Seite. Knoten, Kosten und Belohnungen lassen sich hier direkt anpassen.
// Stufen: 0 = Grundlagen, 1 = Vertiefung, 2 = Anwendung, 3 = Durchbruch. „benoetigt“ verbindet die Knoten im Baum.
import "../../_gemeinsam/zweig.js";
import { mountForschungsbaum } from "../../../../Men%C3%BCs/adapter/aporia-forschung.js";

const knoten = [
    {
        "id": "k1",
        "name": "Bewusstseinszustände",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k2",
        "name": "Meditation",
        "stufe": 1,
        "benoetigt": [
            "k1"
        ],
        "kosten": 25,
        "belohnung": {
            "art": "vorteil",
            "text": "Forschungskosten −10 %",
            "wirkung": {
                "rabatt": 0.1
            }
        }
    },
    {
        "id": "k3",
        "name": "Trance",
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
        "name": "Traumforschung",
        "stufe": 1,
        "benoetigt": [
            "k1"
        ],
        "kosten": 25,
        "belohnung": {
            "art": "vorteil",
            "text": "Ätheressenz +15 % pro Sekunde",
            "wirkung": {
                "rate": 0.15
            }
        }
    },
    {
        "id": "k5",
        "name": "Wahrnehmungsgrenzen",
        "stufe": 2,
        "benoetigt": [
            "k2",
            "k3"
        ],
        "kosten": 60,
        "belohnung": {
            "art": "gegenstand",
            "name": "Gesellschaft kultur ritual wald",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Biologische%20Spezies/WaldFeen/Unterseite/Gesellschaft/Waldfeen_Gesellschaft_NUR_NEUE_BILDER_SPEC-0001/02_Inhalte/gesellschaft_kultur_ritual_wald.jpg"
        }
    },
    {
        "id": "k6",
        "name": "Mentale Reisen",
        "stufe": 2,
        "benoetigt": [
            "k3",
            "k4"
        ],
        "kosten": 60,
        "belohnung": {
            "art": "gegenstand",
            "name": "Geisterhafte Nekropole im Sturmlicht",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Mentale%20Spezies/MueMoiden/gesamtdarstellung/Geisterhafte%20Nekropole%20im%20Sturmlicht-16.png"
        }
    },
    {
        "id": "k7",
        "name": "Erweitertes Bewusstsein",
        "stufe": 2,
        "benoetigt": [
            "k2",
            "k4"
        ],
        "kosten": 60,
        "belohnung": {
            "art": "vorteil",
            "text": "„Ritual vollziehen“ bringt +3 ÄE",
            "wirkung": {
                "experiment": 3
            }
        }
    },
    {
        "id": "k8",
        "name": "Reines Bewusstsein",
        "stufe": 3,
        "benoetigt": [
            "k5",
            "k6",
            "k7"
        ],
        "kosten": 140,
        "belohnung": {
            "art": "gegenstand",
            "name": "Aporia · Noetiden im Neon-Grid",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Mentale%20Spezies/Noetiden/gesamtdarstellung/Aporia_%20Noetiden%20im%20Neon-Grid-3.png"
        }
    }
];

mountForschungsbaum(document.querySelector("[data-forschungsbaum]"), {
    schluessel: "Mystik und Bewusstsein/Bewusstseinsforschung",
    titel: "Bewusstseinsforschung",
    knoten,
    // Baumform „Fächer“ · Ressource und Aktion der Familie „arkan“
    waehrung: {"name":"Ätheressenz","kurz":"ÄE"},
    aktion: {"text":"Ritual vollziehen","icon":"✧","punkte":5},
    rate: 0.45,
    stufen: ["Überlieferung","Symbol","Ritus","Offenbarung"],
});
