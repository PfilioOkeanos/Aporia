// Umwelt- und Ökosystemforschung – Forschungszweig
// Forschungsbaum dieser Seite. Knoten, Kosten und Belohnungen lassen sich hier direkt anpassen.
// Stufen: 0 = Grundlagen, 1 = Vertiefung, 2 = Anwendung, 3 = Durchbruch. „benoetigt“ verbindet die Knoten im Baum.
import "../../_gemeinsam/zweig.js";
import { mountForschungsbaum } from "../../../../Men%C3%BCs/adapter/aporia-forschung.js";

const knoten = [
    {
        "id": "k1",
        "name": "Stoffkreisläufe",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k2",
        "name": "Klimaforschung",
        "stufe": 1,
        "benoetigt": [
            "k1"
        ],
        "kosten": 20,
        "belohnung": {
            "art": "vorteil",
            "text": "Proben +20 % pro Sekunde",
            "wirkung": {
                "rate": 0.2
            }
        }
    },
    {
        "id": "k3",
        "name": "Biodiversität",
        "stufe": 1,
        "benoetigt": [
            "k1"
        ],
        "kosten": 20,
        "belohnung": {
            "art": "vorteil",
            "text": "Forschungskosten −20 %",
            "wirkung": {
                "rabatt": 0.2
            }
        }
    },
    {
        "id": "k4",
        "name": "Populationsdynamik",
        "stufe": 2,
        "benoetigt": [
            "k2"
        ],
        "kosten": 50,
        "belohnung": {
            "art": "vorteil",
            "text": "Proben +20 % pro Sekunde",
            "wirkung": {
                "rate": 0.2
            }
        }
    },
    {
        "id": "k5",
        "name": "Renaturierung",
        "stufe": 2,
        "benoetigt": [
            "k2",
            "k3"
        ],
        "kosten": 50,
        "belohnung": {
            "art": "vorteil",
            "text": "„Proben sammeln“ bringt +4 PR",
            "wirkung": {
                "experiment": 4
            }
        }
    },
    {
        "id": "k6",
        "name": "Ökosystemmodelle",
        "stufe": 3,
        "benoetigt": [
            "k4"
        ],
        "kosten": 105,
        "belohnung": {
            "art": "gegenstand",
            "name": "Gemeinschaft 02 weltenbaum",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Biologische%20Spezies/WaldFeen/hauptseite/gemeinschaft_02_weltenbaum.jpg"
        }
    },
    {
        "id": "k7",
        "name": "Planetare Kreisläufe",
        "stufe": 3,
        "benoetigt": [
            "k5"
        ],
        "kosten": 105,
        "belohnung": {
            "art": "vorteil",
            "text": "Forschungskosten −12 %",
            "wirkung": {
                "rabatt": 0.12
            }
        }
    },
    {
        "id": "k8",
        "name": "Gaia-Prinzip",
        "stufe": 4,
        "benoetigt": [
            "k6",
            "k7"
        ],
        "kosten": 230,
        "belohnung": {
            "art": "gegenstand",
            "name": "Leuchtende Dendroarch-Landschaft",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Gigantische%20Lebensformen/Dendroarchen/gesamtdarstellung/Leuchtende%20Dendroarch-Landschaft-8.png"
        }
    }
];

mountForschungsbaum(document.querySelector("[data-forschungsbaum]"), {
    schluessel: "Umwelt, Leben und Ressourcen/Umwelt- und Ökosystemforschung",
    titel: "Umwelt- und Ökosystemforschung",
    knoten,
    // Baumform „Kette“ · Ressource und Aktion der Familie „biom“
    waehrung: {"name":"Proben","kurz":"PR"},
    aktion: {"text":"Proben sammeln","icon":"❦","punkte":3},
    rate: 0.6,
    stufen: ["Keimung","Wachstum","Vernetzung","Blüte","Kreislauf"],
});
