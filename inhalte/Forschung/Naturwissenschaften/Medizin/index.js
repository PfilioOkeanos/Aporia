// Medizin – Forschungszweig
// Forschungsbaum dieser Seite. Knoten, Kosten und Belohnungen lassen sich hier direkt anpassen.
// Stufen: 0 = Grundlagen, 1 = Vertiefung, 2 = Anwendung, 3 = Durchbruch. „benoetigt“ verbindet die Knoten im Baum.
import "../../_gemeinsam/zweig.js";
import { mountForschungsbaum } from "../../../../Men%C3%BCs/adapter/aporia-forschung.js";

const knoten = [
    {
        "id": "k1",
        "name": "Anatomie",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 5
    },
    {
        "id": "k2",
        "name": "Pharmakologie",
        "stufe": 1,
        "benoetigt": [
            "k1"
        ],
        "kosten": 15,
        "belohnung": {
            "art": "vorteil",
            "text": "Messwerte +40 % pro Sekunde",
            "wirkung": {
                "rate": 0.4
            }
        }
    },
    {
        "id": "k3",
        "name": "Diagnostik",
        "stufe": 1,
        "benoetigt": [
            "k1"
        ],
        "kosten": 15,
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
        "name": "Chirurgie",
        "stufe": 2,
        "benoetigt": [
            "k2"
        ],
        "kosten": 35,
        "belohnung": {
            "art": "vorteil",
            "text": "„Messung durchführen“ bringt +4 MW",
            "wirkung": {
                "experiment": 4
            }
        }
    },
    {
        "id": "k5",
        "name": "Immunologie",
        "stufe": 2,
        "benoetigt": [
            "k2",
            "k3"
        ],
        "kosten": 35,
        "belohnung": {
            "art": "gegenstand",
            "name": "Waldfeen regeneration haut",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Biologische%20Spezies/WaldFeen/Unterseite/biologie/assets/bilder/regeneration/waldfeen_regeneration_haut.jpg"
        }
    },
    {
        "id": "k6",
        "name": "Feldmedizin",
        "stufe": 3,
        "benoetigt": [
            "k4"
        ],
        "kosten": 80,
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
        "name": "Regenerationsmedizin",
        "stufe": 3,
        "benoetigt": [
            "k5"
        ],
        "kosten": 80,
        "belohnung": {
            "art": "gegenstand",
            "name": "Handel Versorgungsnetze",
            "bild": "../../../../assets/bilder/Himmelsk%C3%B6rper/OzeanWelt/erde-im-sternenmeer/unterseiten/ERDE_BILDER/Zivilisation/14%20%E2%80%93%20Handel%20&%20Versorgungsnetze/14_Handel_Versorgungsnetze.jpg"
        }
    },
    {
        "id": "k8",
        "name": "Speziesübergreifende Heilkunde",
        "stufe": 4,
        "benoetigt": [
            "k6",
            "k7"
        ],
        "kosten": 185,
        "belohnung": {
            "art": "gegenstand",
            "name": "Medizin Gesundheitswesen",
            "bild": "../../../../assets/bilder/Himmelsk%C3%B6rper/OzeanWelt/erde-im-sternenmeer/unterseiten/ERDE_BILDER/Zivilisation/16%20%E2%80%93%20Medizin%20&%20Gesundheitswesen/16_Medizin_Gesundheitswesen.jpg"
        }
    }
];

mountForschungsbaum(document.querySelector("[data-forschungsbaum]"), {
    schluessel: "Naturwissenschaften/Medizin",
    titel: "Medizin",
    knoten,
    // Baumform „Kette“ · Ressource und Aktion der Familie „labor“
    waehrung: {"name":"Messwerte","kurz":"MW"},
    aktion: {"text":"Messung durchführen","icon":"⚗","punkte":4},
    rate: 0.5,
    stufen: ["Grundlagen","Analyse","Experiment","Synthese","Durchbruch"],
});
