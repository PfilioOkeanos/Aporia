// Informatik und Informationstechnologie – Forschungszweig
// Forschungsbaum dieser Seite. Knoten, Kosten und Belohnungen lassen sich hier direkt anpassen.
// Stufen: 0 = Grundlagen, 1 = Vertiefung, 2 = Anwendung, 3 = Durchbruch. „benoetigt“ verbindet die Knoten im Baum.
import "../../_gemeinsam/zweig.js";
import { mountForschungsbaum } from "../../../../Men%C3%BCs/adapter/aporia-forschung.js";

const knoten = [
    {
        "id": "k1",
        "name": "Algorithmen",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k2",
        "name": "Datenstrukturen",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k3",
        "name": "Netzwerke",
        "stufe": 1,
        "benoetigt": [
            "k1",
            "k2"
        ],
        "kosten": 20,
        "belohnung": {
            "art": "vorteil",
            "text": "„Prototyp bauen“ bringt +4 KP",
            "wirkung": {
                "experiment": 4
            }
        }
    },
    {
        "id": "k4",
        "name": "Kryptografie",
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
        "id": "k5",
        "name": "Verteilte Systeme",
        "stufe": 2,
        "benoetigt": [
            "k3"
        ],
        "kosten": 55,
        "belohnung": {
            "art": "vorteil",
            "text": "Konstruktionspunkte +30 % pro Sekunde",
            "wirkung": {
                "rate": 0.3
            }
        }
    },
    {
        "id": "k6",
        "name": "Datenarchive",
        "stufe": 3,
        "benoetigt": [
            "k4"
        ],
        "kosten": 140,
        "belohnung": {
            "art": "gegenstand",
            "name": "Velrath – Muemoiden-Archiv M",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Mentale%20Spezies/MueMoiden/gesamtdarstellung/Velrath%20%E2%80%93%20Muemoiden-Archiv%20M-07-6.png"
        }
    },
    {
        "id": "k7",
        "name": "Quanteninformatik",
        "stufe": 3,
        "benoetigt": [
            "k4",
            "k5"
        ],
        "kosten": 140,
        "belohnung": {
            "art": "gegenstand",
            "name": "Muemoid · Archiv des Corvath",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Mentale%20Spezies/MueMoiden/gesamtdarstellung/Muemoid_%20Archiv%20des%20Corvath-14.png"
        }
    },
    {
        "id": "k8",
        "name": "Planetares Datennetz",
        "stufe": 4,
        "benoetigt": [
            "k6",
            "k7"
        ],
        "kosten": 340,
        "belohnung": {
            "art": "gegenstand",
            "name": "Datenqualitat Unsicherheiten",
            "bild": "../../../../assets/bilder/Himmelsk%C3%B6rper/OzeanWelt/erde/unterseiten/ERDE_BILDER/Erforschung/15%20%E2%80%93%20Datenqualit%C3%A4t%20&%20Unsicherheiten/15_Datenqualitat_Unsicherheiten.jpg"
        }
    }
];

mountForschungsbaum(document.querySelector("[data-forschungsbaum]"), {
    schluessel: "Technologie und Ingenieurwesen/Informatik und Informationstechnologie",
    titel: "Informatik und Informationstechnologie",
    knoten,
    // Baumform „Kreuzung“ · Ressource und Aktion der Familie „werkstatt“
    waehrung: {"name":"Konstruktionspunkte","kurz":"KP"},
    aktion: {"text":"Prototyp bauen","icon":"⚙","punkte":3},
    rate: 0.7,
    stufen: ["Grundlagen","Entwurf","Prototyp","Fertigung","Meisterwerk"],
});
