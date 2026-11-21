// Metaphysik – Forschungszweig
// Forschungsbaum dieser Seite. Knoten, Kosten und Belohnungen lassen sich hier direkt anpassen.
// Stufen: 0 = Grundlagen, 1 = Vertiefung, 2 = Anwendung, 3 = Durchbruch. „benoetigt“ verbindet die Knoten im Baum.
import "../../_gemeinsam/zweig.js";
import { mountForschungsbaum } from "../../../../Men%C3%BCs/adapter/aporia-forschung.js";

const knoten = [
    {
        "id": "k1",
        "name": "Ontologie",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 5
    },
    {
        "id": "k2",
        "name": "Kausalität",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 5
    },
    {
        "id": "k3",
        "name": "Zeitphilosophie",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 5
    },
    {
        "id": "k4",
        "name": "Willensfreiheit",
        "stufe": 1,
        "benoetigt": [
            "k1",
            "k2"
        ],
        "kosten": 15,
        "belohnung": {
            "art": "vorteil",
            "text": "Forschungskosten −15 %",
            "wirkung": {
                "rabatt": 0.15
            }
        }
    },
    {
        "id": "k5",
        "name": "Dimensionstheorie",
        "stufe": 1,
        "benoetigt": [
            "k2",
            "k3"
        ],
        "kosten": 15,
        "belohnung": {
            "art": "vorteil",
            "text": "Ätheressenz +15 % pro Sekunde",
            "wirkung": {
                "rate": 0.15
            }
        }
    },
    {
        "id": "k6",
        "name": "Realitätsmodelle",
        "stufe": 2,
        "benoetigt": [
            "k4"
        ],
        "kosten": 40,
        "belohnung": {
            "art": "gegenstand",
            "name": "Narben des kosmischen aufpralls",
            "bild": "../../../../assets/bilder/Himmelsk%C3%B6rper/Gesteinsplaneten/narben-des-kosmischen-aufpralls/hauptseite/narben-des-kosmischen-aufpralls-d886476967.webp"
        }
    },
    {
        "id": "k7",
        "name": "Natur der Existenz",
        "stufe": 2,
        "benoetigt": [
            "k4",
            "k5"
        ],
        "kosten": 40,
        "belohnung": {
            "art": "gegenstand",
            "name": "Dunkler kern einer kosmischen sternenwiege",
            "bild": "../../../../assets/bilder/Himmelsk%C3%B6rper/Sterne/dunkler-kern-einer-kosmischen-sternenwiege/hauptseite/dunkler-kern-einer-kosmischen-sternenwiege-15281bde3b.webp"
        }
    },
    {
        "id": "k8",
        "name": "Erste Ursache",
        "stufe": 3,
        "benoetigt": [
            "k6",
            "k7"
        ],
        "kosten": 90,
        "belohnung": {
            "art": "gegenstand",
            "name": "Kosmische Einordnung",
            "bild": "../../../../assets/bilder/Himmelsk%C3%B6rper/OzeanWelt/erde-im-sternenmeer/unterseiten/ERDE_BILDER/Astronomie/01%20%E2%80%93%20Kosmische%20Einordnung/01_Kosmische_Einordnung.jpg"
        }
    }
];

mountForschungsbaum(document.querySelector("[data-forschungsbaum]"), {
    schluessel: "Mystik und Bewusstsein/Metaphysik",
    titel: "Metaphysik",
    knoten,
    // Baumform „Netz“ · Ressource und Aktion der Familie „arkan“
    waehrung: {"name":"Ätheressenz","kurz":"ÄE"},
    aktion: {"text":"Ritual vollziehen","icon":"✧","punkte":5},
    rate: 0.45,
    stufen: ["Überlieferung","Symbol","Ritus","Offenbarung"],
});
