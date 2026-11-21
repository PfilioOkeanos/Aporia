// Biologie – Forschungszweig
// Forschungsbaum dieser Seite. Knoten, Kosten und Belohnungen lassen sich hier direkt anpassen.
// Stufen: 0 = Grundlagen, 1 = Vertiefung, 2 = Anwendung, 3 = Durchbruch. „benoetigt“ verbindet die Knoten im Baum.
import "../../_gemeinsam/zweig.js";
import { mountForschungsbaum } from "../../../../Men%C3%BCs/adapter/aporia-forschung.js";

const knoten = [
    {
        "id": "k1",
        "name": "Zellbiologie",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k2",
        "name": "Ökologie",
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
        "id": "k3",
        "name": "Physiologie",
        "stufe": 1,
        "benoetigt": [
            "k1"
        ],
        "kosten": 25,
        "belohnung": {
            "art": "vorteil",
            "text": "„Messung durchführen“ bringt +4 MW",
            "wirkung": {
                "experiment": 4
            }
        }
    },
    {
        "id": "k4",
        "name": "Verhaltensbiologie",
        "stufe": 1,
        "benoetigt": [
            "k1"
        ],
        "kosten": 25,
        "belohnung": {
            "art": "vorteil",
            "text": "„Messung durchführen“ bringt +3 MW",
            "wirkung": {
                "experiment": 3
            }
        }
    },
    {
        "id": "k5",
        "name": "Mikrobiologie",
        "stufe": 2,
        "benoetigt": [
            "k2",
            "k3"
        ],
        "kosten": 50,
        "belohnung": {
            "art": "vorteil",
            "text": "Messwerte +25 % pro Sekunde",
            "wirkung": {
                "rate": 0.25
            }
        }
    },
    {
        "id": "k6",
        "name": "Evolutionsmodelle",
        "stufe": 2,
        "benoetigt": [
            "k3",
            "k4"
        ],
        "kosten": 50,
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
        "name": "Artenkartierung",
        "stufe": 2,
        "benoetigt": [
            "k2",
            "k4"
        ],
        "kosten": 50,
        "belohnung": {
            "art": "gegenstand",
            "name": "Biolumineszenter Garten von Haus Vhaurak",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Biologische%20Spezies/Thalassoiden/gesamtdarstellung/Designvorschl%C3%A4ge/Biolumineszenter%20Garten%20von%20Haus%20Vhaurak-8.png"
        }
    },
    {
        "id": "k8",
        "name": "Synthese des Lebensbaums",
        "stufe": 3,
        "benoetigt": [
            "k5",
            "k6",
            "k7"
        ],
        "kosten": 110,
        "belohnung": {
            "art": "gegenstand",
            "name": "Biolumineszente Mykonoidin im Pilzwald",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Biologische%20Spezies/Mykonoiden/Gesamtdarstellung/Biolumineszente%20Mykonoidin%20im%20Pilzwald.png"
        }
    }
];

mountForschungsbaum(document.querySelector("[data-forschungsbaum]"), {
    schluessel: "Naturwissenschaften/Biologie",
    titel: "Biologie",
    knoten,
    // Baumform „Fächer“ · Ressource und Aktion der Familie „labor“
    waehrung: {"name":"Messwerte","kurz":"MW"},
    aktion: {"text":"Messung durchführen","icon":"⚗","punkte":4},
    rate: 0.5,
    stufen: ["Grundlagen","Analyse","Experiment","Durchbruch"],
});
