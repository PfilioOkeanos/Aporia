// Xenobiologie – Forschungszweig
// Forschungsbaum dieser Seite. Knoten, Kosten und Belohnungen lassen sich hier direkt anpassen.
// Stufen: 0 = Grundlagen, 1 = Vertiefung, 2 = Anwendung, 3 = Durchbruch. „benoetigt“ verbindet die Knoten im Baum.
import "../../_gemeinsam/zweig.js";
import { mountForschungsbaum } from "../../../../Men%C3%BCs/adapter/aporia-forschung.js";

const knoten = [
    {
        "id": "k1",
        "name": "Fremde Biochemie",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k2",
        "name": "Xenotaxonomie",
        "stufe": 1,
        "benoetigt": [
            "k1"
        ],
        "kosten": 30,
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
        "name": "Fremdanatomie",
        "stufe": 1,
        "benoetigt": [
            "k1"
        ],
        "kosten": 30,
        "belohnung": {
            "art": "gegenstand",
            "name": "Aeromorph koerper hero",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Biologische%20Spezies/Aeromorphen/Unterseiten/biologie/aeromorph_koerper_hero.webp"
        }
    },
    {
        "id": "k4",
        "name": "Extremophile",
        "stufe": 2,
        "benoetigt": [
            "k2"
        ],
        "kosten": 75,
        "belohnung": {
            "art": "vorteil",
            "text": "Xenoproben +25 % pro Sekunde",
            "wirkung": {
                "rate": 0.25
            }
        }
    },
    {
        "id": "k5",
        "name": "Fremde Fortpflanzung",
        "stufe": 2,
        "benoetigt": [
            "k2",
            "k3"
        ],
        "kosten": 75,
        "belohnung": {
            "art": "vorteil",
            "text": "„Probe analysieren“ bringt +1 XP",
            "wirkung": {
                "experiment": 1
            }
        }
    },
    {
        "id": "k6",
        "name": "Xenoökologie",
        "stufe": 3,
        "benoetigt": [
            "k4"
        ],
        "kosten": 180,
        "belohnung": {
            "art": "gegenstand",
            "name": "Aeromorphen himmelsruinen",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Biologische%20Spezies/Aeromorphen/hauptseite/aeromorphen-himmelsruinen.png"
        }
    },
    {
        "id": "k7",
        "name": "Lebensformen ohne Kohlenstoff",
        "stufe": 3,
        "benoetigt": [
            "k5"
        ],
        "kosten": 180,
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
        "name": "Universelle Biologie",
        "stufe": 4,
        "benoetigt": [
            "k6",
            "k7"
        ],
        "kosten": 450,
        "belohnung": {
            "art": "gegenstand",
            "name": "Aeromorphen himmelskammerrat",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Biologische%20Spezies/Aeromorphen/hauptseite/aeromorphen-himmelskammerrat.png"
        }
    }
];

mountForschungsbaum(document.querySelector("[data-forschungsbaum]"), {
    schluessel: "Xenoforschung/Xenobiologie",
    titel: "Xenobiologie",
    knoten,
    // Baumform „Kette“ · Ressource und Aktion der Familie „xeno“
    waehrung: {"name":"Xenoproben","kurz":"XP"},
    aktion: {"text":"Probe analysieren","icon":"✺","punkte":4},
    rate: 0.5,
    stufen: ["Kontakt","Probe","Analyse","Verständnis","Durchbruch"],
});
