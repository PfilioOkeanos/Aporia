// Raumfahrtwissenschaften – Forschungszweig
// Forschungsbaum dieser Seite. Knoten, Kosten und Belohnungen lassen sich hier direkt anpassen.
// Stufen: 0 = Grundlagen, 1 = Vertiefung, 2 = Anwendung, 3 = Durchbruch. „benoetigt“ verbindet die Knoten im Baum.
import "../../_gemeinsam/zweig.js";
import { mountForschungsbaum } from "../../../../Men%C3%BCs/adapter/aporia-forschung.js";

const knoten = [
    {
        "id": "k1",
        "name": "Orbitalmechanik",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k2",
        "name": "Lebenserhaltung",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k3",
        "name": "Navigation",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k4",
        "name": "Raumschiffbau",
        "stufe": 1,
        "benoetigt": [
            "k1",
            "k2"
        ],
        "kosten": 20,
        "belohnung": {
            "art": "vorteil",
            "text": "Beobachtungsdaten +25 % pro Sekunde",
            "wirkung": {
                "rate": 0.25
            }
        }
    },
    {
        "id": "k5",
        "name": "Andocksysteme",
        "stufe": 1,
        "benoetigt": [
            "k2",
            "k3"
        ],
        "kosten": 20,
        "belohnung": {
            "art": "gegenstand",
            "name": "Konsortium station",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Biologische%20Spezies/Aeromorphen/Unterseiten/Geschichte/konsortium_station.webp"
        }
    },
    {
        "id": "k6",
        "name": "Langstreckenexpeditionen",
        "stufe": 2,
        "benoetigt": [
            "k4"
        ],
        "kosten": 50,
        "belohnung": {
            "art": "vorteil",
            "text": "„Himmel beobachten“ bringt +2 BD",
            "wirkung": {
                "experiment": 2
            }
        }
    },
    {
        "id": "k7",
        "name": "Orbitalstationen",
        "stufe": 2,
        "benoetigt": [
            "k4",
            "k5"
        ],
        "kosten": 50,
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
        "name": "Tiefraumkolonisation",
        "stufe": 3,
        "benoetigt": [
            "k6",
            "k7"
        ],
        "kosten": 115,
        "belohnung": {
            "art": "gegenstand",
            "name": "Lebensdauer station",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Biologische%20Spezies/Aeromorphen/Unterseiten/Entwicklung/lebensdauer_station.webp"
        }
    }
];

mountForschungsbaum(document.querySelector("[data-forschungsbaum]"), {
    schluessel: "Raum- und Planetensysteme/Raumfahrtwissenschaften",
    titel: "Raumfahrtwissenschaften",
    knoten,
    // Baumform „Netz“ · Ressource und Aktion der Familie „sternwarte“
    waehrung: {"name":"Beobachtungsdaten","kurz":"BD"},
    aktion: {"text":"Himmel beobachten","icon":"✦","punkte":2},
    rate: 0.9,
    stufen: ["Beobachtung","Messung","Modell","Entdeckung"],
});
