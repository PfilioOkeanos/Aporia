// Künstliche Intelligenz und Robotik – Forschungszweig
// Forschungsbaum dieser Seite. Knoten, Kosten und Belohnungen lassen sich hier direkt anpassen.
// Stufen: 0 = Grundlagen, 1 = Vertiefung, 2 = Anwendung, 3 = Durchbruch. „benoetigt“ verbindet die Knoten im Baum.
import "../../_gemeinsam/zweig.js";
import { mountForschungsbaum } from "../../../../Men%C3%BCs/adapter/aporia-forschung.js";

const knoten = [
    {
        "id": "k1",
        "name": "Steuerungstechnik",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k2",
        "name": "Maschinelles Lernen",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k3",
        "name": "Robotermechanik",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k4",
        "name": "Bildverarbeitung",
        "stufe": 1,
        "benoetigt": [
            "k1",
            "k2"
        ],
        "kosten": 20,
        "belohnung": {
            "art": "vorteil",
            "text": "„Prototyp bauen“ bringt +3 KP",
            "wirkung": {
                "experiment": 3
            }
        }
    },
    {
        "id": "k5",
        "name": "Autonome Navigation",
        "stufe": 1,
        "benoetigt": [
            "k2",
            "k3"
        ],
        "kosten": 20,
        "belohnung": {
            "art": "gegenstand",
            "name": "Mechanische Eigenschaften Schwingungen",
            "bild": "../../../../assets/bilder/Himmelsk%C3%B6rper/OzeanWelt/erde/unterseiten/ERDE_BILDER/Physik/12%20%E2%80%93%20Mechanische%20Eigenschaften%20&%20Schwingungen/12_Mechanische_Eigenschaften_Schwingungen.jpg"
        }
    },
    {
        "id": "k6",
        "name": "Schwarmrobotik",
        "stufe": 2,
        "benoetigt": [
            "k4"
        ],
        "kosten": 40,
        "belohnung": {
            "art": "gegenstand",
            "name": "Cyrava die mechanische weltraumharfe",
            "bild": "../../../../assets/bilder/Himmelsk%C3%B6rper/synthetische_planetenwesen/cyrava/hauptseite/cyrava-die-mechanische-weltraumharfe-75cb4d8c231f.jpg"
        }
    },
    {
        "id": "k7",
        "name": "Neuronale Architektur",
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
        "name": "Künstliches Bewusstsein",
        "stufe": 3,
        "benoetigt": [
            "k6",
            "k7"
        ],
        "kosten": 95,
        "belohnung": {
            "art": "gegenstand",
            "name": "Syntheten B-17 „Carapax“ – Bergbau-Mech",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Technologische%20Lebensformen/Syntheten/gesamtdarstellung/gesamtdarstellung/Syntheten%20B-17%20%E2%80%9ECarapax%E2%80%9C%20%E2%80%93%20Bergbau-Mech-12.png"
        }
    }
];

mountForschungsbaum(document.querySelector("[data-forschungsbaum]"), {
    schluessel: "Technologie und Ingenieurwesen/Künstliche Intelligenz und Robotik",
    titel: "Künstliche Intelligenz und Robotik",
    knoten,
    // Baumform „Netz“ · Ressource und Aktion der Familie „werkstatt“
    waehrung: {"name":"Konstruktionspunkte","kurz":"KP"},
    aktion: {"text":"Prototyp bauen","icon":"⚙","punkte":3},
    rate: 0.7,
    stufen: ["Grundlagen","Entwurf","Prototyp","Meisterwerk"],
});
