// Exotische Materieforschung – Forschungszweig
// Forschungsbaum dieser Seite. Knoten, Kosten und Belohnungen lassen sich hier direkt anpassen.
// Stufen: 0 = Grundlagen, 1 = Vertiefung, 2 = Anwendung, 3 = Durchbruch. „benoetigt“ verbindet die Knoten im Baum.
import "../../_gemeinsam/zweig.js";
import { mountForschungsbaum } from "../../../../Men%C3%BCs/adapter/aporia-forschung.js";

const knoten = [
    {
        "id": "k1",
        "name": "Teilchenphysik",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k2",
        "name": "Materiezustände",
        "stufe": 1,
        "benoetigt": [
            "k1"
        ],
        "kosten": 20,
        "belohnung": {
            "art": "vorteil",
            "text": "Forschungskosten −15 %",
            "wirkung": {
                "rabatt": 0.15
            }
        }
    },
    {
        "id": "k3",
        "name": "Antimaterie",
        "stufe": 1,
        "benoetigt": [
            "k1"
        ],
        "kosten": 20,
        "belohnung": {
            "art": "vorteil",
            "text": "Forschungskosten −15 %",
            "wirkung": {
                "rabatt": 0.15
            }
        }
    },
    {
        "id": "k4",
        "name": "Seltsame Materie",
        "stufe": 1,
        "benoetigt": [
            "k1"
        ],
        "kosten": 20,
        "belohnung": {
            "art": "gegenstand",
            "name": "Chemische exotische Sturme",
            "bild": "../../../../assets/bilder/Himmelsk%C3%B6rper/OzeanWelt/erde-im-sternenmeer/unterseiten/ERDE_BILDER/St%C3%BCrme/11%20%E2%80%93%20Chemische%20&%20exotische%20St%C3%BCrme/11_Chemische_exotische_Sturme.jpg"
        }
    },
    {
        "id": "k5",
        "name": "Negative Masse",
        "stufe": 2,
        "benoetigt": [
            "k2",
            "k3"
        ],
        "kosten": 55,
        "belohnung": {
            "art": "gegenstand",
            "name": "Kristallhüterin in der Lavahöhle",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Biologische%20Spezies/Technoiden/gesamtdarstellung/Kristallh%C3%BCterin%20in%20der%20Lavah%C3%B6hle-7.png"
        }
    },
    {
        "id": "k6",
        "name": "Exotische Kristalle",
        "stufe": 2,
        "benoetigt": [
            "k3",
            "k4"
        ],
        "kosten": 55,
        "belohnung": {
            "art": "vorteil",
            "text": "Quantenenergie +15 % pro Sekunde",
            "wirkung": {
                "rate": 0.15
            }
        }
    },
    {
        "id": "k7",
        "name": "Materieumwandlung",
        "stufe": 2,
        "benoetigt": [
            "k2",
            "k4"
        ],
        "kosten": 55,
        "belohnung": {
            "art": "vorteil",
            "text": "„Teilchen kollidieren“ bringt +4 QE",
            "wirkung": {
                "experiment": 4
            }
        }
    },
    {
        "id": "k8",
        "name": "Stabile Exotik",
        "stufe": 3,
        "benoetigt": [
            "k5",
            "k6",
            "k7"
        ],
        "kosten": 140,
        "belohnung": {
            "art": "gegenstand",
            "name": "Seltene exotische Materialien",
            "bild": "../../../../assets/bilder/Himmelsk%C3%B6rper/OzeanWelt/erde-im-sternenmeer/unterseiten/ERDE_BILDER/Rohstoffe/13%20%E2%80%93%20Seltene%20&%20exotische%20Materialien/13_Seltene_exotische_Materialien.jpg"
        }
    }
];

mountForschungsbaum(document.querySelector("[data-forschungsbaum]"), {
    schluessel: "Fundamentale und exotische Forschung/Exotische Materieforschung",
    titel: "Exotische Materieforschung",
    knoten,
    // Baumform „Fächer“ · Ressource und Aktion der Familie „quanten“
    waehrung: {"name":"Quantenenergie","kurz":"QE"},
    aktion: {"text":"Teilchen kollidieren","icon":"⚛","punkte":3},
    rate: 0.7,
    stufen: ["Hypothese","Messung","Feld","Durchbruch"],
});
