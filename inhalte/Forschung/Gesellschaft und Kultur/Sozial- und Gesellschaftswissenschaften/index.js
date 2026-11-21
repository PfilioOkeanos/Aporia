// Sozial- und Gesellschaftswissenschaften – Forschungszweig
// Forschungsbaum dieser Seite. Knoten, Kosten und Belohnungen lassen sich hier direkt anpassen.
// Stufen: 0 = Grundlagen, 1 = Vertiefung, 2 = Anwendung, 3 = Durchbruch. „benoetigt“ verbindet die Knoten im Baum.
import "../../_gemeinsam/zweig.js";
import { mountForschungsbaum } from "../../../../Men%C3%BCs/adapter/aporia-forschung.js";

const knoten = [
    {
        "id": "k1",
        "name": "Sozialstruktur",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k2",
        "name": "Demografie",
        "stufe": 1,
        "benoetigt": [
            "k1"
        ],
        "kosten": 25,
        "belohnung": {
            "art": "gegenstand",
            "name": "Img gesellschaft grossmaechte",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Biologische%20Spezies/Humanoide/Unterseiten/Gesellschaft/bilder/img_gesellschaft_grossmaechte.webp"
        }
    },
    {
        "id": "k3",
        "name": "Institutionen",
        "stufe": 1,
        "benoetigt": [
            "k1"
        ],
        "kosten": 25,
        "belohnung": {
            "art": "vorteil",
            "text": "Erkenntnisse +40 % pro Sekunde",
            "wirkung": {
                "rate": 0.4
            }
        }
    },
    {
        "id": "k4",
        "name": "Konfliktforschung",
        "stufe": 1,
        "benoetigt": [
            "k1"
        ],
        "kosten": 25,
        "belohnung": {
            "art": "vorteil",
            "text": "Forschungskosten −20 %",
            "wirkung": {
                "rabatt": 0.2
            }
        }
    },
    {
        "id": "k5",
        "name": "Migrationsforschung",
        "stufe": 2,
        "benoetigt": [
            "k2",
            "k3"
        ],
        "kosten": 55,
        "belohnung": {
            "art": "vorteil",
            "text": "„Quellen auswerten“ bringt +4 EK",
            "wirkung": {
                "experiment": 4
            }
        }
    },
    {
        "id": "k6",
        "name": "Stadtsoziologie",
        "stufe": 2,
        "benoetigt": [
            "k3",
            "k4"
        ],
        "kosten": 55,
        "belohnung": {
            "art": "vorteil",
            "text": "„Quellen auswerten“ bringt +3 EK",
            "wirkung": {
                "experiment": 3
            }
        }
    },
    {
        "id": "k7",
        "name": "Gesellschaftsmodelle",
        "stufe": 2,
        "benoetigt": [
            "k2",
            "k4"
        ],
        "kosten": 55,
        "belohnung": {
            "art": "gegenstand",
            "name": "Banner gesellschaft hero",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Biologische%20Spezies/Humanoide/Unterseiten/Gesellschaft/bilder/banner_gesellschaft_hero.webp"
        }
    },
    {
        "id": "k8",
        "name": "Interspezies-Gesellschaft",
        "stufe": 3,
        "benoetigt": [
            "k5",
            "k6",
            "k7"
        ],
        "kosten": 125,
        "belohnung": {
            "art": "gegenstand",
            "name": "Kartenmotiv gesellschaft",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Biologische%20Spezies/Aeromorphen/hauptseite/kartenmotiv_gesellschaft.webp"
        }
    }
];

mountForschungsbaum(document.querySelector("[data-forschungsbaum]"), {
    schluessel: "Gesellschaft und Kultur/Sozial- und Gesellschaftswissenschaften",
    titel: "Sozial- und Gesellschaftswissenschaften",
    knoten,
    // Baumform „Fächer“ · Ressource und Aktion der Familie „archiv“
    waehrung: {"name":"Erkenntnisse","kurz":"EK"},
    aktion: {"text":"Quellen auswerten","icon":"✎","punkte":3},
    rate: 0.55,
    stufen: ["Quellen","Studien","Deutung","Erkenntnis"],
});
