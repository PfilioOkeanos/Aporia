// Material- und Werkstoffwissenschaften – Forschungszweig
// Forschungsbaum dieser Seite. Knoten, Kosten und Belohnungen lassen sich hier direkt anpassen.
// Stufen: 0 = Grundlagen, 1 = Vertiefung, 2 = Anwendung, 3 = Durchbruch. „benoetigt“ verbindet die Knoten im Baum.
import "../../_gemeinsam/zweig.js";
import { mountForschungsbaum } from "../../../../Men%C3%BCs/adapter/aporia-forschung.js";

const knoten = [
    {
        "id": "k1",
        "name": "Werkstoffkunde",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k2",
        "name": "Kristallografie",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k3",
        "name": "Legierungstechnik",
        "stufe": 1,
        "benoetigt": [
            "k1"
        ],
        "kosten": 20,
        "belohnung": {
            "art": "vorteil",
            "text": "Konstruktionspunkte +20 % pro Sekunde",
            "wirkung": {
                "rate": 0.2
            }
        }
    },
    {
        "id": "k4",
        "name": "Verbundwerkstoffe",
        "stufe": 1,
        "benoetigt": [
            "k2"
        ],
        "kosten": 20,
        "belohnung": {
            "art": "vorteil",
            "text": "Forschungskosten −12 %",
            "wirkung": {
                "rabatt": 0.12
            }
        }
    },
    {
        "id": "k5",
        "name": "Oberflächentechnik",
        "stufe": 2,
        "benoetigt": [
            "k3"
        ],
        "kosten": 50,
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
        "name": "Formgedächtnismetalle",
        "stufe": 2,
        "benoetigt": [
            "k3",
            "k4"
        ],
        "kosten": 50,
        "belohnung": {
            "art": "vorteil",
            "text": "„Prototyp bauen“ bringt +1 KP",
            "wirkung": {
                "experiment": 1
            }
        }
    },
    {
        "id": "k7",
        "name": "Metamaterialien",
        "stufe": 2,
        "benoetigt": [
            "k4"
        ],
        "kosten": 50,
        "belohnung": {
            "art": "gegenstand",
            "name": "Datoralium kristall",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Biologische%20Spezies/Aeromorphen/Unterseiten/Entwicklung/datoralium_kristall.png"
        }
    },
    {
        "id": "k8",
        "name": "Selbstheilende Werkstoffe",
        "stufe": 3,
        "benoetigt": [
            "k5",
            "k6",
            "k7"
        ],
        "kosten": 115,
        "belohnung": {
            "art": "gegenstand",
            "name": "Selbstheilendes Nitinol-Mikrogitter",
            "bild": "../../../../assets/bilder/Rohstoffe/Selbstheilendes%20Nitinol-Mikrogitter-6.png"
        }
    }
];

mountForschungsbaum(document.querySelector("[data-forschungsbaum]"), {
    schluessel: "Technologie und Ingenieurwesen/Material- und Werkstoffwissenschaften",
    titel: "Material- und Werkstoffwissenschaften",
    knoten,
    // Baumform „Zwillingsstamm“ · Ressource und Aktion der Familie „werkstatt“
    waehrung: {"name":"Konstruktionspunkte","kurz":"KP"},
    aktion: {"text":"Prototyp bauen","icon":"⚙","punkte":3},
    rate: 0.7,
    stufen: ["Grundlagen","Entwurf","Prototyp","Meisterwerk"],
});
