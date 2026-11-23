// Ätherforschung – Forschungszweig
// Forschungsbaum dieser Seite. Knoten, Kosten und Belohnungen lassen sich hier direkt anpassen.
// Stufen: 0 = Grundlagen, 1 = Vertiefung, 2 = Anwendung, 3 = Durchbruch. „benoetigt“ verbindet die Knoten im Baum.
import "../../_gemeinsam/zweig.js";
import { mountForschungsbaum } from "../../../../Men%C3%BCs/adapter/aporia-forschung.js";

const knoten = [
    {
        "id": "k1",
        "name": "Ätherhypothese",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k2",
        "name": "Feldmessung",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k3",
        "name": "Ätherströme",
        "stufe": 1,
        "benoetigt": [
            "k1",
            "k2"
        ],
        "kosten": 30,
        "belohnung": {
            "art": "vorteil",
            "text": "„Teilchen kollidieren“ bringt +1 QE",
            "wirkung": {
                "experiment": 1
            }
        }
    },
    {
        "id": "k4",
        "name": "Dimensionsschnittstellen",
        "stufe": 2,
        "benoetigt": [
            "k3"
        ],
        "kosten": 85,
        "belohnung": {
            "art": "vorteil",
            "text": "Quantenenergie +15 % pro Sekunde",
            "wirkung": {
                "rate": 0.15
            }
        }
    },
    {
        "id": "k5",
        "name": "Ätherleitung",
        "stufe": 2,
        "benoetigt": [
            "k3"
        ],
        "kosten": 85,
        "belohnung": {
            "art": "gegenstand",
            "name": "Kosmisches Leben in Lichtströmen",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Spezies_%C3%BCbersicht/Kosmisches%20Leben%20in%20Lichtstr%C3%B6men-4.png"
        }
    },
    {
        "id": "k6",
        "name": "Ätherspeicher",
        "stufe": 3,
        "benoetigt": [
            "k4"
        ],
        "kosten": 215,
        "belohnung": {
            "art": "gegenstand",
            "name": "Geteilter Asteroid mit Lichtkante",
            "bild": "../../../../assets/bilder/Himmelsk%C3%B6rper/Asteroiden/trojaner-von-ushara-iii/hauptseite/Geteilter%20Asteroid%20mit%20Lichtkante-28.png"
        }
    },
    {
        "id": "k7",
        "name": "Ätherantrieb",
        "stufe": 3,
        "benoetigt": [
            "k4",
            "k5"
        ],
        "kosten": 215,
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
        "name": "Ätherwanderung",
        "stufe": 4,
        "benoetigt": [
            "k6",
            "k7"
        ],
        "kosten": 570,
        "belohnung": {
            "art": "gegenstand",
            "name": "Waldfeen biologie lichtpartikel",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Biologische%20Spezies/WaldFeen/Unterseite/biologie/assets/bilder/hintergruende/waldfeen_biologie_lichtpartikel.jpg"
        }
    }
];

mountForschungsbaum(document.querySelector("[data-forschungsbaum]"), {
    schluessel: "Fundamentale und exotische Forschung/Ätherforschung",
    titel: "Ätherforschung",
    knoten,
    // Baumform „Kreuzung“ · Ressource und Aktion der Familie „quanten“
    waehrung: {"name":"Quantenenergie","kurz":"QE"},
    aktion: {"text":"Teilchen kollidieren","icon":"⚛","punkte":3},
    rate: 0.7,
    stufen: ["Hypothese","Messung","Feld","Kontrolle","Durchbruch"],
});
