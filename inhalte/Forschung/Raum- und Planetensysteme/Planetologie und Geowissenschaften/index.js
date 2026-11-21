// Planetologie und Geowissenschaften – Forschungszweig
// Forschungsbaum dieser Seite. Knoten, Kosten und Belohnungen lassen sich hier direkt anpassen.
// Stufen: 0 = Grundlagen, 1 = Vertiefung, 2 = Anwendung, 3 = Durchbruch. „benoetigt“ verbindet die Knoten im Baum.
import "../../_gemeinsam/zweig.js";
import { mountForschungsbaum } from "../../../../Men%C3%BCs/adapter/aporia-forschung.js";

const knoten = [
    {
        "id": "k1",
        "name": "Mineralogie",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k2",
        "name": "Geologie",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k3",
        "name": "Vulkanologie",
        "stufe": 1,
        "benoetigt": [
            "k1",
            "k2"
        ],
        "kosten": 35,
        "belohnung": {
            "art": "vorteil",
            "text": "Beobachtungsdaten +15 % pro Sekunde",
            "wirkung": {
                "rate": 0.15
            }
        }
    },
    {
        "id": "k4",
        "name": "Atmosphärenkunde",
        "stufe": 2,
        "benoetigt": [
            "k3"
        ],
        "kosten": 90,
        "belohnung": {
            "art": "gegenstand",
            "name": "Kruste Lithosphare",
            "bild": "../../../../assets/bilder/Himmelsk%C3%B6rper/OzeanWelt/erde-im-sternenmeer/unterseiten/ERDE_BILDER/Geologie/04%20%E2%80%93%20Kruste%20&%20Lithosph%C3%A4re/04_Kruste_Lithosphare.jpg"
        }
    },
    {
        "id": "k5",
        "name": "Planetare Kartierung",
        "stufe": 2,
        "benoetigt": [
            "k3"
        ],
        "kosten": 90,
        "belohnung": {
            "art": "gegenstand",
            "name": "Evorath der planetengrosse krustentiergigant",
            "bild": "../../../../assets/bilder/Himmelsk%C3%B6rper/synthetische_planetenwesen/evorath-der-planetengrosse-krustentiergigant/hauptseite/evorath-der-planetengrosse-krustentiergigant-edb38bd48340.jpg"
        }
    },
    {
        "id": "k6",
        "name": "Tiefenbohrung",
        "stufe": 3,
        "benoetigt": [
            "k4"
        ],
        "kosten": 255,
        "belohnung": {
            "art": "vorteil",
            "text": "Forschungskosten −15 %",
            "wirkung": {
                "rabatt": 0.15
            }
        }
    },
    {
        "id": "k7",
        "name": "Kernforschung",
        "stufe": 3,
        "benoetigt": [
            "k4",
            "k5"
        ],
        "kosten": 255,
        "belohnung": {
            "art": "vorteil",
            "text": "„Himmel beobachten“ bringt +2 BD",
            "wirkung": {
                "experiment": 2
            }
        }
    },
    {
        "id": "k8",
        "name": "Planetengenese",
        "stufe": 4,
        "benoetigt": [
            "k6",
            "k7"
        ],
        "kosten": 710,
        "belohnung": {
            "art": "gegenstand",
            "name": "Vulkanismus Magmatismus",
            "bild": "../../../../assets/bilder/Himmelsk%C3%B6rper/OzeanWelt/erde-im-sternenmeer/unterseiten/ERDE_BILDER/Geologie/06%20%E2%80%93%20Vulkanismus%20&%20Magmatismus/06_Vulkanismus_Magmatismus.jpg"
        }
    }
];

mountForschungsbaum(document.querySelector("[data-forschungsbaum]"), {
    schluessel: "Raum- und Planetensysteme/Planetologie und Geowissenschaften",
    titel: "Planetologie und Geowissenschaften",
    knoten,
    // Baumform „Kreuzung“ · Ressource und Aktion der Familie „sternwarte“
    waehrung: {"name":"Beobachtungsdaten","kurz":"BD"},
    aktion: {"text":"Himmel beobachten","icon":"✦","punkte":2},
    rate: 0.9,
    stufen: ["Beobachtung","Messung","Modell","Expedition","Entdeckung"],
});
