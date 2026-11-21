// Symbioseforschung – Forschungszweig
// Forschungsbaum dieser Seite. Knoten, Kosten und Belohnungen lassen sich hier direkt anpassen.
// Stufen: 0 = Grundlagen, 1 = Vertiefung, 2 = Anwendung, 3 = Durchbruch. „benoetigt“ verbindet die Knoten im Baum.
import "../../_gemeinsam/zweig.js";
import { mountForschungsbaum } from "../../../../Men%C3%BCs/adapter/aporia-forschung.js";

const knoten = [
    {
        "id": "k1",
        "name": "Wechselwirkungen",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k2",
        "name": "Mutualismus",
        "stufe": 1,
        "benoetigt": [
            "k1"
        ],
        "kosten": 20,
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
        "name": "Parasitologie",
        "stufe": 1,
        "benoetigt": [
            "k1"
        ],
        "kosten": 20,
        "belohnung": {
            "art": "vorteil",
            "text": "„Proben sammeln“ bringt +3 PR",
            "wirkung": {
                "experiment": 3
            }
        }
    },
    {
        "id": "k4",
        "name": "Wurzelnetzwerke",
        "stufe": 2,
        "benoetigt": [
            "k2"
        ],
        "kosten": 45,
        "belohnung": {
            "art": "gegenstand",
            "name": "Symbiosen okologische Beziehungen",
            "bild": "../../../../assets/bilder/Himmelsk%C3%B6rper/OzeanWelt/erde-im-sternenmeer/unterseiten/ERDE_BILDER/Biosph%C3%A4re/11%20%E2%80%93%20Symbiosen%20&%20%C3%B6kologische%20Beziehungen/11_Symbiosen_okologische_Beziehungen.jpg"
        }
    },
    {
        "id": "k5",
        "name": "Chemische Signale",
        "stufe": 2,
        "benoetigt": [
            "k2"
        ],
        "kosten": 45,
        "belohnung": {
            "art": "vorteil",
            "text": "„Proben sammeln“ bringt +2 PR",
            "wirkung": {
                "experiment": 2
            }
        }
    },
    {
        "id": "k6",
        "name": "Symbiontentechnik",
        "stufe": 2,
        "benoetigt": [
            "k3"
        ],
        "kosten": 45,
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
        "name": "Artübergreifende Gemeinschaften",
        "stufe": 2,
        "benoetigt": [
            "k3"
        ],
        "kosten": 45,
        "belohnung": {
            "art": "vorteil",
            "text": "Proben +40 % pro Sekunde",
            "wirkung": {
                "rate": 0.4
            }
        }
    },
    {
        "id": "k8",
        "name": "Planetare Symbiose",
        "stufe": 3,
        "benoetigt": [
            "k5",
            "k6"
        ],
        "kosten": 90,
        "belohnung": {
            "art": "gegenstand",
            "name": "Biolumineszentes Netzwerk aus flüssigem Licht",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Mentale%20Spezies/Noetiden/gesamtdarstellung/Biolumineszentes%20Netzwerk%20aus%20fl%C3%BCssigem%20Licht-8.png"
        }
    }
];

mountForschungsbaum(document.querySelector("[data-forschungsbaum]"), {
    schluessel: "Umwelt, Leben und Ressourcen/Symbioseforschung",
    titel: "Symbioseforschung",
    knoten,
    // Baumform „Diamant“ · Ressource und Aktion der Familie „biom“
    waehrung: {"name":"Proben","kurz":"PR"},
    aktion: {"text":"Proben sammeln","icon":"❦","punkte":3},
    rate: 0.6,
    stufen: ["Keimung","Wachstum","Vernetzung","Kreislauf"],
});
