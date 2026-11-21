// Interstellare Technologie – Forschungszweig
// Forschungsbaum dieser Seite. Knoten, Kosten und Belohnungen lassen sich hier direkt anpassen.
// Stufen: 0 = Grundlagen, 1 = Vertiefung, 2 = Anwendung, 3 = Durchbruch. „benoetigt“ verbindet die Knoten im Baum.
import "../../_gemeinsam/zweig.js";
import { mountForschungsbaum } from "../../../../Men%C3%BCs/adapter/aporia-forschung.js";

const knoten = [
    {
        "id": "k1",
        "name": "Raumzeitmetrik",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k2",
        "name": "Signalverzögerung",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k3",
        "name": "Feldgeneratoren",
        "stufe": 1,
        "benoetigt": [
            "k1"
        ],
        "kosten": 25,
        "belohnung": {
            "art": "vorteil",
            "text": "„Himmel beobachten“ bringt +1 BD",
            "wirkung": {
                "experiment": 1
            }
        }
    },
    {
        "id": "k4",
        "name": "Sprungnavigation",
        "stufe": 1,
        "benoetigt": [
            "k1",
            "k2"
        ],
        "kosten": 25,
        "belohnung": {
            "art": "gegenstand",
            "name": "Roter hyperriese im all",
            "bild": "../../../../assets/bilder/Himmelsk%C3%B6rper/Sterne/roter-hyperriese-im-all/hauptseite/roter-hyperriese-im-all-35d57a6ef9.webp"
        }
    },
    {
        "id": "k5",
        "name": "Quantenkommunikation",
        "stufe": 1,
        "benoetigt": [
            "k2"
        ],
        "kosten": 25,
        "belohnung": {
            "art": "gegenstand",
            "name": "Gelber hyperriese mit expandierender gashulle",
            "bild": "../../../../assets/bilder/Himmelsk%C3%B6rper/Sterne/gelber-hyperriese-mit-expandierender-gashulle/hauptseite/gelber-hyperriese-mit-expandierender-gashulle-e194354c3d.webp"
        }
    },
    {
        "id": "k6",
        "name": "Warpantrieb",
        "stufe": 2,
        "benoetigt": [
            "k3",
            "k4"
        ],
        "kosten": 65,
        "belohnung": {
            "art": "vorteil",
            "text": "Beobachtungsdaten +15 % pro Sekunde",
            "wirkung": {
                "rate": 0.15
            }
        }
    },
    {
        "id": "k7",
        "name": "Sprungtore",
        "stufe": 2,
        "benoetigt": [
            "k4",
            "k5"
        ],
        "kosten": 65,
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
        "name": "Interstellares Netz",
        "stufe": 3,
        "benoetigt": [
            "k6",
            "k7"
        ],
        "kosten": 180,
        "belohnung": {
            "art": "gegenstand",
            "name": "Blauer hyperriese im sternenwind",
            "bild": "../../../../assets/bilder/Himmelsk%C3%B6rper/Sterne/blauer-hyperriese-im-sternenwind/hauptseite/blauer-hyperriese-im-sternenwind-72ff6ba732.webp"
        }
    }
];

mountForschungsbaum(document.querySelector("[data-forschungsbaum]"), {
    schluessel: "Raum- und Planetensysteme/Interstellare Technologie",
    titel: "Interstellare Technologie",
    knoten,
    // Baumform „Pyramide“ · Ressource und Aktion der Familie „sternwarte“
    waehrung: {"name":"Beobachtungsdaten","kurz":"BD"},
    aktion: {"text":"Himmel beobachten","icon":"✦","punkte":2},
    rate: 0.9,
    stufen: ["Beobachtung","Messung","Modell","Entdeckung"],
});
