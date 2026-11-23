// Maschinenbau und Ingenieurwissenschaften – Forschungszweig
// Forschungsbaum dieser Seite. Knoten, Kosten und Belohnungen lassen sich hier direkt anpassen.
// Stufen: 0 = Grundlagen, 1 = Vertiefung, 2 = Anwendung, 3 = Durchbruch. „benoetigt“ verbindet die Knoten im Baum.
import "../../_gemeinsam/zweig.js";
import { mountForschungsbaum } from "../../../../Men%C3%BCs/adapter/aporia-forschung.js";

const knoten = [
    {
        "id": "k1",
        "name": "Konstruktionslehre",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k2",
        "name": "Statik",
        "stufe": 1,
        "benoetigt": [
            "k1"
        ],
        "kosten": 25,
        "belohnung": {
            "art": "gegenstand",
            "name": "Hadrion der planetengrosse maschinenorganismus",
            "bild": "../../../../assets/bilder/Himmelsk%C3%B6rper/synthetische_planetenwesen/hadrion/hauptseite/hadrion-der-planetengrosse-maschinenorganismus-318f54f70625.jpg"
        }
    },
    {
        "id": "k3",
        "name": "Fertigungstechnik",
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
        "name": "Antriebstechnik",
        "stufe": 1,
        "benoetigt": [
            "k1"
        ],
        "kosten": 25,
        "belohnung": {
            "art": "vorteil",
            "text": "Konstruktionspunkte +30 % pro Sekunde",
            "wirkung": {
                "rate": 0.3
            }
        }
    },
    {
        "id": "k5",
        "name": "Strömungsmechanik",
        "stufe": 2,
        "benoetigt": [
            "k2",
            "k3"
        ],
        "kosten": 55,
        "belohnung": {
            "art": "vorteil",
            "text": "„Prototyp bauen“ bringt +2 KP",
            "wirkung": {
                "experiment": 2
            }
        }
    },
    {
        "id": "k6",
        "name": "Präzisionsturbinen",
        "stufe": 2,
        "benoetigt": [
            "k3",
            "k4"
        ],
        "kosten": 55,
        "belohnung": {
            "art": "gegenstand",
            "name": "Gorvaxis der planetengrosse maschinenkoloss",
            "bild": "../../../../assets/bilder/Himmelsk%C3%B6rper/synthetische_planetenwesen/gorvaxis/hauptseite/gorvaxis-der-planetengrosse-maschinenkoloss-07b1d40fda1d.jpg"
        }
    },
    {
        "id": "k7",
        "name": "Schwerlastsysteme",
        "stufe": 2,
        "benoetigt": [
            "k2",
            "k4"
        ],
        "kosten": 55,
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
        "name": "Selbstreplizierende Fabriken",
        "stufe": 3,
        "benoetigt": [
            "k5",
            "k6",
            "k7"
        ],
        "kosten": 135,
        "belohnung": {
            "art": "gegenstand",
            "name": "Elymara die geflugelte maschinenwelt",
            "bild": "../../../../assets/bilder/Himmelsk%C3%B6rper/synthetische_planetenwesen/elymara/hauptseite/elymara-die-geflugelte-maschinenwelt-830e8536f193.jpg"
        }
    }
];

mountForschungsbaum(document.querySelector("[data-forschungsbaum]"), {
    schluessel: "Technologie und Ingenieurwesen/Maschinenbau und Ingenieurwissenschaften",
    titel: "Maschinenbau und Ingenieurwissenschaften",
    knoten,
    // Baumform „Fächer“ · Ressource und Aktion der Familie „werkstatt“
    waehrung: {"name":"Konstruktionspunkte","kurz":"KP"},
    aktion: {"text":"Prototyp bauen","icon":"⚙","punkte":3},
    rate: 0.7,
    stufen: ["Grundlagen","Entwurf","Prototyp","Meisterwerk"],
});
