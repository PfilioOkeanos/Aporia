// Bewusstseins- und neuronale Vernetzungsforschung – Forschungszweig
// Forschungsbaum dieser Seite. Knoten, Kosten und Belohnungen lassen sich hier direkt anpassen.
// Stufen: 0 = Grundlagen, 1 = Vertiefung, 2 = Anwendung, 3 = Durchbruch. „benoetigt“ verbindet die Knoten im Baum.
import "../../_gemeinsam/zweig.js";
import { mountForschungsbaum } from "../../../../Men%C3%BCs/adapter/aporia-forschung.js";

const knoten = [
    {
        "id": "k1",
        "name": "Neuroanatomie",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k2",
        "name": "Neuronale Signale",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k3",
        "name": "Schnittstellentechnik",
        "stufe": 1,
        "benoetigt": [
            "k1"
        ],
        "kosten": 30,
        "belohnung": {
            "art": "vorteil",
            "text": "„Simulation starten“ bringt +2 RZ",
            "wirkung": {
                "experiment": 2
            }
        }
    },
    {
        "id": "k4",
        "name": "Gedächtnisspeicher",
        "stufe": 1,
        "benoetigt": [
            "k1",
            "k2"
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
        "id": "k5",
        "name": "Kollektive Netze",
        "stufe": 1,
        "benoetigt": [
            "k2"
        ],
        "kosten": 30,
        "belohnung": {
            "art": "vorteil",
            "text": "Forschungskosten −12 %",
            "wirkung": {
                "rabatt": 0.12
            }
        }
    },
    {
        "id": "k6",
        "name": "Neuronale Kopplung",
        "stufe": 2,
        "benoetigt": [
            "k3",
            "k4"
        ],
        "kosten": 85,
        "belohnung": {
            "art": "vorteil",
            "text": "Rechenzyklen +25 % pro Sekunde",
            "wirkung": {
                "rate": 0.25
            }
        }
    },
    {
        "id": "k7",
        "name": "Geteiltes Bewusstsein",
        "stufe": 2,
        "benoetigt": [
            "k4",
            "k5"
        ],
        "kosten": 85,
        "belohnung": {
            "art": "gegenstand",
            "name": "Img gesellschaft netzwerk",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Biologische%20Spezies/Humanoide/Unterseiten/Gesellschaft/bilder/img_gesellschaft_netzwerk.webp"
        }
    },
    {
        "id": "k8",
        "name": "Bewusstseinsübertragung",
        "stufe": 3,
        "benoetigt": [
            "k6",
            "k7"
        ],
        "kosten": 230,
        "belohnung": {
            "art": "gegenstand",
            "name": "Biolumineszentes Netzwerk aus fünf Kernen",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Mentale%20Spezies/Noetiden/gesamtdarstellung/Biolumineszentes%20Netzwerk%20aus%20f%C3%BCnf%20Kernen-10.png"
        }
    }
];

mountForschungsbaum(document.querySelector("[data-forschungsbaum]"), {
    schluessel: "Spezialisierte und erweiterte Forschung/Bewusstseins- und neuronale Vernetzungsforschung",
    titel: "Bewusstseins- und neuronale Vernetzungsforschung",
    knoten,
    // Baumform „Pyramide“ · Ressource und Aktion der Familie „hologramm“
    waehrung: {"name":"Rechenzyklen","kurz":"RZ"},
    aktion: {"text":"Simulation starten","icon":"⌬","punkte":3},
    rate: 0.8,
    stufen: ["Theorie","Modell","Simulation","Durchbruch"],
});
