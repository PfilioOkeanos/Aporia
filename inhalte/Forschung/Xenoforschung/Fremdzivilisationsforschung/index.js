// Fremdzivilisationsforschung – Forschungszweig
// Forschungsbaum dieser Seite. Knoten, Kosten und Belohnungen lassen sich hier direkt anpassen.
// Stufen: 0 = Grundlagen, 1 = Vertiefung, 2 = Anwendung, 3 = Durchbruch. „benoetigt“ verbindet die Knoten im Baum.
import "../../_gemeinsam/zweig.js";
import { mountForschungsbaum } from "../../../../Men%C3%BCs/adapter/aporia-forschung.js";

const knoten = [
    {
        "id": "k1",
        "name": "Erstkontakt",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k2",
        "name": "Fremde Technik",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k3",
        "name": "Gesellschaftsformen",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k4",
        "name": "Fremde Geschichte",
        "stufe": 1,
        "benoetigt": [
            "k1",
            "k2"
        ],
        "kosten": 20,
        "belohnung": {
            "art": "gegenstand",
            "name": "Kultur Zivilisationsgeschichte",
            "bild": "../../../../assets/bilder/Himmelsk%C3%B6rper/OzeanWelt/erde/unterseiten/ERDE_BILDER/Geschichte/09%20%E2%80%93%20Kultur-%20&%20Zivilisationsgeschichte/09_Kultur_Zivilisationsgeschichte.jpg"
        }
    },
    {
        "id": "k5",
        "name": "Diplomatie",
        "stufe": 1,
        "benoetigt": [
            "k2",
            "k3"
        ],
        "kosten": 20,
        "belohnung": {
            "art": "vorteil",
            "text": "Xenoproben +30 % pro Sekunde",
            "wirkung": {
                "rate": 0.3
            }
        }
    },
    {
        "id": "k6",
        "name": "Kulturtransfer",
        "stufe": 2,
        "benoetigt": [
            "k4"
        ],
        "kosten": 40,
        "belohnung": {
            "art": "vorteil",
            "text": "„Probe analysieren“ bringt +3 XP",
            "wirkung": {
                "experiment": 3
            }
        }
    },
    {
        "id": "k7",
        "name": "Allianzen",
        "stufe": 2,
        "benoetigt": [
            "k4",
            "k5"
        ],
        "kosten": 40,
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
        "name": "Galaktische Gemeinschaft",
        "stufe": 3,
        "benoetigt": [
            "k6",
            "k7"
        ],
        "kosten": 90,
        "belohnung": {
            "art": "gegenstand",
            "name": "Protektorat Gildenfestung",
            "bild": "../../../../assets/bilder/Fraktions_%C3%BCbersichtseite/03_Protektorat_Gildenfestung.png"
        }
    }
];

mountForschungsbaum(document.querySelector("[data-forschungsbaum]"), {
    schluessel: "Xenoforschung/Fremdzivilisationsforschung",
    titel: "Fremdzivilisationsforschung",
    knoten,
    // Baumform „Netz“ · Ressource und Aktion der Familie „xeno“
    waehrung: {"name":"Xenoproben","kurz":"XP"},
    aktion: {"text":"Probe analysieren","icon":"✺","punkte":4},
    rate: 0.5,
    stufen: ["Kontakt","Probe","Analyse","Durchbruch"],
});
