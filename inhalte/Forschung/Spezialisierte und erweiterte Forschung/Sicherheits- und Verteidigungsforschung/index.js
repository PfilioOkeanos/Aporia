// Sicherheits- und Verteidigungsforschung – Forschungszweig
// Forschungsbaum dieser Seite. Knoten, Kosten und Belohnungen lassen sich hier direkt anpassen.
// Stufen: 0 = Grundlagen, 1 = Vertiefung, 2 = Anwendung, 3 = Durchbruch. „benoetigt“ verbindet die Knoten im Baum.
import "../../_gemeinsam/zweig.js";
import { mountForschungsbaum } from "../../../../Men%C3%BCs/adapter/aporia-forschung.js";

const knoten = [
    {
        "id": "k1",
        "name": "Risikoanalyse",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k2",
        "name": "Kryptosicherheit",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k3",
        "name": "Schildtechnik",
        "stufe": 1,
        "benoetigt": [
            "k1",
            "k2"
        ],
        "kosten": 20,
        "belohnung": {
            "art": "vorteil",
            "text": "Rechenzyklen +20 % pro Sekunde",
            "wirkung": {
                "rate": 0.2
            }
        }
    },
    {
        "id": "k4",
        "name": "Frühwarnsysteme",
        "stufe": 2,
        "benoetigt": [
            "k3"
        ],
        "kosten": 55,
        "belohnung": {
            "art": "vorteil",
            "text": "„Simulation starten“ bringt +1 RZ",
            "wirkung": {
                "experiment": 1
            }
        }
    },
    {
        "id": "k5",
        "name": "Abwehrdrohnen",
        "stufe": 2,
        "benoetigt": [
            "k3"
        ],
        "kosten": 55,
        "belohnung": {
            "art": "vorteil",
            "text": "Forschungskosten −10 %",
            "wirkung": {
                "rabatt": 0.1
            }
        }
    },
    {
        "id": "k6",
        "name": "Panzerung",
        "stufe": 3,
        "benoetigt": [
            "k4"
        ],
        "kosten": 140,
        "belohnung": {
            "art": "gegenstand",
            "name": "Schildwappen mit Turm, Schlüssel und Schmiedefeuer",
            "bild": "../../../../assets/bilder/Fraktions_%C3%BCbersichtseite/Schildwappen%20mit%20Turm,%20Schl%C3%BCssel%20und%20Schmiedefeuer-7.png"
        }
    },
    {
        "id": "k7",
        "name": "Planetare Verteidigung",
        "stufe": 3,
        "benoetigt": [
            "k4",
            "k5"
        ],
        "kosten": 140,
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
        "name": "Unverwundbare Bastion",
        "stufe": 4,
        "benoetigt": [
            "k6",
            "k7"
        ],
        "kosten": 350,
        "belohnung": {
            "art": "gegenstand",
            "name": "Sicherheit Verteidigung",
            "bild": "../../../../assets/bilder/Himmelsk%C3%B6rper/OzeanWelt/erde/unterseiten/ERDE_BILDER/Zivilisation/17%20%E2%80%93%20Sicherheit%20&%20Verteidigung/17_Sicherheit_Verteidigung.jpg"
        }
    }
];

mountForschungsbaum(document.querySelector("[data-forschungsbaum]"), {
    schluessel: "Spezialisierte und erweiterte Forschung/Sicherheits- und Verteidigungsforschung",
    titel: "Sicherheits- und Verteidigungsforschung",
    knoten,
    // Baumform „Kreuzung“ · Ressource und Aktion der Familie „hologramm“
    waehrung: {"name":"Rechenzyklen","kurz":"RZ"},
    aktion: {"text":"Simulation starten","icon":"⌬","punkte":3},
    rate: 0.8,
    stufen: ["Theorie","Modell","Simulation","Prototyp","Durchbruch"],
});
