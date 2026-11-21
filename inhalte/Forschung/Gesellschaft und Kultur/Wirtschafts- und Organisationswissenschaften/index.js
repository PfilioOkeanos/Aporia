// Wirtschafts- und Organisationswissenschaften – Forschungszweig
// Forschungsbaum dieser Seite. Knoten, Kosten und Belohnungen lassen sich hier direkt anpassen.
// Stufen: 0 = Grundlagen, 1 = Vertiefung, 2 = Anwendung, 3 = Durchbruch. „benoetigt“ verbindet die Knoten im Baum.
import "../../_gemeinsam/zweig.js";
import { mountForschungsbaum } from "../../../../Men%C3%BCs/adapter/aporia-forschung.js";

const knoten = [
    {
        "id": "k1",
        "name": "Ressourcenökonomie",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 5
    },
    {
        "id": "k2",
        "name": "Buchhaltung",
        "stufe": 1,
        "benoetigt": [
            "k1"
        ],
        "kosten": 15,
        "belohnung": {
            "art": "gegenstand",
            "name": "Goldene Handelsrouten im roten Nebel",
            "bild": "../../../../assets/bilder/Das_Konsortium/Goldene%20Handelsrouten%20im%20roten%20Nebel-4.png"
        }
    },
    {
        "id": "k3",
        "name": "Handelsrouten",
        "stufe": 1,
        "benoetigt": [
            "k1"
        ],
        "kosten": 15,
        "belohnung": {
            "art": "vorteil",
            "text": "Erkenntnisse +30 % pro Sekunde",
            "wirkung": {
                "rate": 0.3
            }
        }
    },
    {
        "id": "k4",
        "name": "Logistik",
        "stufe": 2,
        "benoetigt": [
            "k2"
        ],
        "kosten": 30,
        "belohnung": {
            "art": "vorteil",
            "text": "Erkenntnisse +25 % pro Sekunde",
            "wirkung": {
                "rate": 0.25
            }
        }
    },
    {
        "id": "k5",
        "name": "Organisationslehre",
        "stufe": 2,
        "benoetigt": [
            "k2",
            "k3"
        ],
        "kosten": 30,
        "belohnung": {
            "art": "vorteil",
            "text": "Forschungskosten −20 %",
            "wirkung": {
                "rabatt": 0.2
            }
        }
    },
    {
        "id": "k6",
        "name": "Marktmodelle",
        "stufe": 3,
        "benoetigt": [
            "k4"
        ],
        "kosten": 55,
        "belohnung": {
            "art": "gegenstand",
            "name": "Interstellare Handelsbörse in der Stahlhalle",
            "bild": "../../../../assets/bilder/Das_Konsortium/Interstellare%20Handelsb%C3%B6rse%20in%20der%20Stahlhalle-2.png"
        }
    },
    {
        "id": "k7",
        "name": "Konzernstrategie",
        "stufe": 3,
        "benoetigt": [
            "k5"
        ],
        "kosten": 55,
        "belohnung": {
            "art": "vorteil",
            "text": "„Quellen auswerten“ bringt +2 EK",
            "wirkung": {
                "experiment": 2
            }
        }
    },
    {
        "id": "k8",
        "name": "Interstellare Wirtschaft",
        "stufe": 4,
        "benoetigt": [
            "k6",
            "k7"
        ],
        "kosten": 115,
        "belohnung": {
            "art": "gegenstand",
            "name": "Konsortium Handelsmetropole",
            "bild": "../../../../assets/bilder/Fraktions_%C3%BCbersichtseite/02_Konsortium_Handelsmetropole.png"
        }
    }
];

mountForschungsbaum(document.querySelector("[data-forschungsbaum]"), {
    schluessel: "Gesellschaft und Kultur/Wirtschafts- und Organisationswissenschaften",
    titel: "Wirtschafts- und Organisationswissenschaften",
    knoten,
    // Baumform „Kette“ · Ressource und Aktion der Familie „archiv“
    waehrung: {"name":"Erkenntnisse","kurz":"EK"},
    aktion: {"text":"Quellen auswerten","icon":"✎","punkte":3},
    rate: 0.55,
    stufen: ["Quellen","Studien","Deutung","Lehre","Erkenntnis"],
});
