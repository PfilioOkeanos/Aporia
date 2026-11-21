// Xenomedizin – Forschungszweig
// Forschungsbaum dieser Seite. Knoten, Kosten und Belohnungen lassen sich hier direkt anpassen.
// Stufen: 0 = Grundlagen, 1 = Vertiefung, 2 = Anwendung, 3 = Durchbruch. „benoetigt“ verbindet die Knoten im Baum.
import "../../_gemeinsam/zweig.js";
import { mountForschungsbaum } from "../../../../Men%C3%BCs/adapter/aporia-forschung.js";

const knoten = [
    {
        "id": "k1",
        "name": "Vergleichende Anatomie",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k2",
        "name": "Xenopharmakologie",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k3",
        "name": "Fremde Erreger",
        "stufe": 1,
        "benoetigt": [
            "k1",
            "k2"
        ],
        "kosten": 20,
        "belohnung": {
            "art": "vorteil",
            "text": "„Probe analysieren“ bringt +2 XP",
            "wirkung": {
                "experiment": 2
            }
        }
    },
    {
        "id": "k4",
        "name": "Quarantäneprotokolle",
        "stufe": 2,
        "benoetigt": [
            "k3"
        ],
        "kosten": 45,
        "belohnung": {
            "art": "gegenstand",
            "name": "Anatomie Physiologie",
            "bild": "../../../../assets/bilder/Himmelsk%C3%B6rper/OzeanWelt/erde-im-sternenmeer/unterseiten/ERDE_BILDER/Flora%20&%20Fauna/14%20%E2%80%93%20Anatomie%20&%20Physiologie/14_Anatomie_Physiologie.jpg"
        }
    },
    {
        "id": "k5",
        "name": "Interspezies-Chirurgie",
        "stufe": 2,
        "benoetigt": [
            "k3"
        ],
        "kosten": 45,
        "belohnung": {
            "art": "gegenstand",
            "name": "Waldfeen regeneration waldumgebung",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Biologische%20Spezies/WaldFeen/Unterseite/biologie/assets/bilder/regeneration/waldfeen_regeneration_waldumgebung.jpg"
        }
    },
    {
        "id": "k6",
        "name": "Universelle Gegenmittel",
        "stufe": 3,
        "benoetigt": [
            "k4"
        ],
        "kosten": 95,
        "belohnung": {
            "art": "vorteil",
            "text": "Xenoproben +20 % pro Sekunde",
            "wirkung": {
                "rate": 0.2
            }
        }
    },
    {
        "id": "k7",
        "name": "Hybride Therapien",
        "stufe": 3,
        "benoetigt": [
            "k4",
            "k5"
        ],
        "kosten": 95,
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
        "name": "Medizin aller Spezies",
        "stufe": 4,
        "benoetigt": [
            "k6",
            "k7"
        ],
        "kosten": 215,
        "belohnung": {
            "art": "gegenstand",
            "name": "Waldfeen regeneration verlauf konzept",
            "bild": "../../../../assets/bilder/Alle%20Spezies%2B%C3%9Cbersicht/Biologische%20Spezies/WaldFeen/Unterseite/biologie/assets/bilder/regeneration/waldfeen_regeneration_verlauf_konzept.jpg"
        }
    }
];

mountForschungsbaum(document.querySelector("[data-forschungsbaum]"), {
    schluessel: "Xenoforschung/Xenomedizin",
    titel: "Xenomedizin",
    knoten,
    // Baumform „Kreuzung“ · Ressource und Aktion der Familie „xeno“
    waehrung: {"name":"Xenoproben","kurz":"XP"},
    aktion: {"text":"Probe analysieren","icon":"✺","punkte":4},
    rate: 0.5,
    stufen: ["Kontakt","Probe","Analyse","Verständnis","Durchbruch"],
});
