// Kultur- und Geisteswissenschaften – Forschungszweig
// Forschungsbaum dieser Seite. Knoten, Kosten und Belohnungen lassen sich hier direkt anpassen.
// Stufen: 0 = Grundlagen, 1 = Vertiefung, 2 = Anwendung, 3 = Durchbruch. „benoetigt“ verbindet die Knoten im Baum.
import "../../_gemeinsam/zweig.js";
import { mountForschungsbaum } from "../../../../Men%C3%BCs/adapter/aporia-forschung.js";

const knoten = [
    {
        "id": "k1",
        "name": "Ästhetik",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 5
    },
    {
        "id": "k2",
        "name": "Ethik",
        "stufe": 1,
        "benoetigt": [
            "k1"
        ],
        "kosten": 10,
        "belohnung": {
            "art": "vorteil",
            "text": "„Quellen auswerten“ bringt +1 EK",
            "wirkung": {
                "experiment": 1
            }
        }
    },
    {
        "id": "k3",
        "name": "Mythenforschung",
        "stufe": 1,
        "benoetigt": [
            "k1"
        ],
        "kosten": 10,
        "belohnung": {
            "art": "gegenstand",
            "name": "Img kulturelles mosaik",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Biologische%20Spezies/Humanoide/Unterseiten/Gesellschaft/bilder/img_kulturelles_mosaik.webp"
        }
    },
    {
        "id": "k4",
        "name": "Kunstgeschichte",
        "stufe": 2,
        "benoetigt": [
            "k2"
        ],
        "kosten": 25,
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
        "name": "Religionswissenschaft",
        "stufe": 2,
        "benoetigt": [
            "k2"
        ],
        "kosten": 25,
        "belohnung": {
            "art": "vorteil",
            "text": "Erkenntnisse +40 % pro Sekunde",
            "wirkung": {
                "rate": 0.4
            }
        }
    },
    {
        "id": "k6",
        "name": "Kulturvergleich",
        "stufe": 2,
        "benoetigt": [
            "k3"
        ],
        "kosten": 25,
        "belohnung": {
            "art": "gegenstand",
            "name": "Gesellschaft kultur ritual wald",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Biologische%20Spezies/WaldFeen/Unterseite/Gesellschaft/Waldfeen_Gesellschaft_NUR_NEUE_BILDER_SPEC-0001/02_Inhalte/gesellschaft_kultur_ritual_wald.jpg"
        }
    },
    {
        "id": "k7",
        "name": "Weltbildforschung",
        "stufe": 2,
        "benoetigt": [
            "k3"
        ],
        "kosten": 25,
        "belohnung": {
            "art": "vorteil",
            "text": "Forschungskosten −10 %",
            "wirkung": {
                "rabatt": 0.1
            }
        }
    },
    {
        "id": "k8",
        "name": "Kosmische Philosophie",
        "stufe": 3,
        "benoetigt": [
            "k5",
            "k6"
        ],
        "kosten": 50,
        "belohnung": {
            "art": "gegenstand",
            "name": "Kultur schallwellen",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Biologische%20Spezies/Aeromorphen/Unterseiten/Gesellschaft/kultur_schallwellen.webp"
        }
    }
];

mountForschungsbaum(document.querySelector("[data-forschungsbaum]"), {
    schluessel: "Gesellschaft und Kultur/Kultur- und Geisteswissenschaften",
    titel: "Kultur- und Geisteswissenschaften",
    knoten,
    // Baumform „Diamant“ · Ressource und Aktion der Familie „archiv“
    waehrung: {"name":"Erkenntnisse","kurz":"EK"},
    aktion: {"text":"Quellen auswerten","icon":"✎","punkte":3},
    rate: 0.55,
    stufen: ["Quellen","Studien","Deutung","Erkenntnis"],
});
