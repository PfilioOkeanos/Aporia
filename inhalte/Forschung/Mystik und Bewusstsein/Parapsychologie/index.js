// Parapsychologie – Forschungszweig
// Forschungsbaum dieser Seite. Knoten, Kosten und Belohnungen lassen sich hier direkt anpassen.
// Stufen: 0 = Grundlagen, 1 = Vertiefung, 2 = Anwendung, 3 = Durchbruch. „benoetigt“ verbindet die Knoten im Baum.
import "../../_gemeinsam/zweig.js";
import { mountForschungsbaum } from "../../../../Men%C3%BCs/adapter/aporia-forschung.js";

const knoten = [
    {
        "id": "k1",
        "name": "Fallsammlung",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k2",
        "name": "Kontrollierte Versuche",
        "stufe": 1,
        "benoetigt": [
            "k1"
        ],
        "kosten": 15,
        "belohnung": {
            "art": "vorteil",
            "text": "Ätheressenz +40 % pro Sekunde",
            "wirkung": {
                "rate": 0.4
            }
        }
    },
    {
        "id": "k3",
        "name": "Telepathie",
        "stufe": 1,
        "benoetigt": [
            "k1"
        ],
        "kosten": 15,
        "belohnung": {
            "art": "gegenstand",
            "name": "Geisterhafte Nekropole im Sturmlicht",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Mentale%20Spezies/MueMoiden/gesamtdarstellung/Geisterhafte%20Nekropole%20im%20Sturmlicht-16.png"
        }
    },
    {
        "id": "k4",
        "name": "Präkognition",
        "stufe": 2,
        "benoetigt": [
            "k2"
        ],
        "kosten": 35,
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
        "name": "Telekinese",
        "stufe": 2,
        "benoetigt": [
            "k2",
            "k3"
        ],
        "kosten": 35,
        "belohnung": {
            "art": "vorteil",
            "text": "„Ritual vollziehen“ bringt +1 ÄE",
            "wirkung": {
                "experiment": 1
            }
        }
    },
    {
        "id": "k6",
        "name": "Besessenheitsforschung",
        "stufe": 3,
        "benoetigt": [
            "k4"
        ],
        "kosten": 75,
        "belohnung": {
            "art": "vorteil",
            "text": "Forschungskosten −10 %",
            "wirkung": {
                "rabatt": 0.1
            }
        }
    },
    {
        "id": "k7",
        "name": "Psionische Verstärkung",
        "stufe": 3,
        "benoetigt": [
            "k5"
        ],
        "kosten": 75,
        "belohnung": {
            "art": "gegenstand",
            "name": "Vulkanhöhle mit leuchtendem Übersetzerwesen",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Biologische%20Spezies/Technoiden/gesamtdarstellung/Vulkanh%C3%B6hle%20mit%20leuchtendem%20%C3%9Cbersetzerwesen-6.png"
        }
    },
    {
        "id": "k8",
        "name": "Grenzen des Geistes",
        "stufe": 4,
        "benoetigt": [
            "k6",
            "k7"
        ],
        "kosten": 160,
        "belohnung": {
            "art": "gegenstand",
            "name": "Gesellschaft kultur ritual wald",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Biologische%20Spezies/WaldFeen/Unterseite/Gesellschaft/Waldfeen_Gesellschaft_NUR_NEUE_BILDER_SPEC-0001/02_Inhalte/gesellschaft_kultur_ritual_wald.jpg"
        }
    }
];

mountForschungsbaum(document.querySelector("[data-forschungsbaum]"), {
    schluessel: "Mystik und Bewusstsein/Parapsychologie",
    titel: "Parapsychologie",
    knoten,
    // Baumform „Kette“ · Ressource und Aktion der Familie „arkan“
    waehrung: {"name":"Ätheressenz","kurz":"ÄE"},
    aktion: {"text":"Ritual vollziehen","icon":"✧","punkte":5},
    rate: 0.45,
    stufen: ["Überlieferung","Symbol","Ritus","Resonanz","Offenbarung"],
});
