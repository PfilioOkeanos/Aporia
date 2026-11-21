// Genetik und Biotechnologie – Forschungszweig
// Forschungsbaum dieser Seite. Knoten, Kosten und Belohnungen lassen sich hier direkt anpassen.
// Stufen: 0 = Grundlagen, 1 = Vertiefung, 2 = Anwendung, 3 = Durchbruch. „benoetigt“ verbindet die Knoten im Baum.
import "../../_gemeinsam/zweig.js";
import { mountForschungsbaum } from "../../../../Men%C3%BCs/adapter/aporia-forschung.js";

const knoten = [
    {
        "id": "k1",
        "name": "Erbinformation",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k2",
        "name": "Molekularbiologie",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k3",
        "name": "Genregulation",
        "stufe": 1,
        "benoetigt": [
            "k1",
            "k2"
        ],
        "kosten": 20,
        "belohnung": {
            "art": "vorteil",
            "text": "Messwerte +15 % pro Sekunde",
            "wirkung": {
                "rate": 0.15
            }
        }
    },
    {
        "id": "k4",
        "name": "Sequenzierung",
        "stufe": 2,
        "benoetigt": [
            "k3"
        ],
        "kosten": 50,
        "belohnung": {
            "art": "gegenstand",
            "name": "Waldfeen genetik dna konzept",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Biologische%20Spezies/WaldFeen/Unterseite/biologie/assets/bilder/genetik/waldfeen_genetik_dna_konzept.jpg"
        }
    },
    {
        "id": "k5",
        "name": "Gentherapie",
        "stufe": 2,
        "benoetigt": [
            "k3"
        ],
        "kosten": 50,
        "belohnung": {
            "art": "vorteil",
            "text": "„Messung durchführen“ bringt +1 MW",
            "wirkung": {
                "experiment": 1
            }
        }
    },
    {
        "id": "k6",
        "name": "Klonierung",
        "stufe": 3,
        "benoetigt": [
            "k4"
        ],
        "kosten": 115,
        "belohnung": {
            "art": "gegenstand",
            "name": "Unterwasser-Laboratorium mit Alien-Spezimen",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Biologische%20Spezies/Thalassoiden/gesamtdarstellung/Designvorschl%C3%A4ge/Unterwasser-Laboratorium%20mit%20Alien-Spezimen-9.png"
        }
    },
    {
        "id": "k7",
        "name": "Hybridforschung",
        "stufe": 3,
        "benoetigt": [
            "k4",
            "k5"
        ],
        "kosten": 115,
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
        "name": "Kontrollierte Evolution",
        "stufe": 4,
        "benoetigt": [
            "k6",
            "k7"
        ],
        "kosten": 285,
        "belohnung": {
            "art": "gegenstand",
            "name": "Haus Thalaks Biotechnologischer Forschungskomplex",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Biologische%20Spezies/Thalassoiden/gesamtdarstellung/Designvorschl%C3%A4ge/Haus%20Thalaks%20Biotechnologischer%20Forschungskomplex-10.png"
        }
    }
];

mountForschungsbaum(document.querySelector("[data-forschungsbaum]"), {
    schluessel: "Naturwissenschaften/Genetik und Biotechnologie",
    titel: "Genetik und Biotechnologie",
    knoten,
    // Baumform „Kreuzung“ · Ressource und Aktion der Familie „labor“
    waehrung: {"name":"Messwerte","kurz":"MW"},
    aktion: {"text":"Messung durchführen","icon":"⚗","punkte":4},
    rate: 0.5,
    stufen: ["Grundlagen","Analyse","Experiment","Synthese","Durchbruch"],
});
