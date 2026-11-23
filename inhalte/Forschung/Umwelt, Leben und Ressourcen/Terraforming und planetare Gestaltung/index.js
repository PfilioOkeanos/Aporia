// Terraforming und planetare Gestaltung – Forschungszweig
// Forschungsbaum dieser Seite. Knoten, Kosten und Belohnungen lassen sich hier direkt anpassen.
// Stufen: 0 = Grundlagen, 1 = Vertiefung, 2 = Anwendung, 3 = Durchbruch. „benoetigt“ verbindet die Knoten im Baum.
import "../../_gemeinsam/zweig.js";
import { mountForschungsbaum } from "../../../../Men%C3%BCs/adapter/aporia-forschung.js";

const knoten = [
    {
        "id": "k1",
        "name": "Atmosphärenchemie",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 5
    },
    {
        "id": "k2",
        "name": "Klimatechnik",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 5
    },
    {
        "id": "k3",
        "name": "Bodenbildung",
        "stufe": 1,
        "benoetigt": [
            "k1"
        ],
        "kosten": 15,
        "belohnung": {
            "art": "vorteil",
            "text": "„Proben sammeln“ bringt +2 PR",
            "wirkung": {
                "experiment": 2
            }
        }
    },
    {
        "id": "k4",
        "name": "Wasserkreisläufe",
        "stufe": 1,
        "benoetigt": [
            "k1",
            "k2"
        ],
        "kosten": 15,
        "belohnung": {
            "art": "vorteil",
            "text": "Proben +25 % pro Sekunde",
            "wirkung": {
                "rate": 0.25
            }
        }
    },
    {
        "id": "k5",
        "name": "Kuppelhabitate",
        "stufe": 1,
        "benoetigt": [
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
        "id": "k6",
        "name": "Pionierorganismen",
        "stufe": 2,
        "benoetigt": [
            "k3",
            "k4"
        ],
        "kosten": 30,
        "belohnung": {
            "art": "gegenstand",
            "name": "Lebender graphitplanet mit roten kolonien",
            "bild": "../../../../assets/bilder/Himmelsk%C3%B6rper/Lebende_planeten/yelityn/hauptseite/lebender-graphitplanet-mit-roten-kolonien-05a2f285fd52.jpg"
        }
    },
    {
        "id": "k7",
        "name": "Planetare Umformung",
        "stufe": 2,
        "benoetigt": [
            "k4",
            "k5"
        ],
        "kosten": 30,
        "belohnung": {
            "art": "gegenstand",
            "name": "Gefrorene bernstein kolonie im tiefraum",
            "bild": "../../../../assets/bilder/Himmelsk%C3%B6rper/Lebende_planeten/raelonol/hauptseite/gefrorene-bernstein-kolonie-im-tiefraum-dbf901f18357.jpg"
        }
    },
    {
        "id": "k8",
        "name": "Neue Heimatwelten",
        "stufe": 3,
        "benoetigt": [
            "k6",
            "k7"
        ],
        "kosten": 75,
        "belohnung": {
            "art": "gegenstand",
            "name": "Kolonien Stutzpunkte",
            "bild": "../../../../assets/bilder/Himmelsk%C3%B6rper/OzeanWelt/erde/unterseiten/ERDE_BILDER/Fraktionen/09%20%E2%80%93%20Kolonien%20&%20St%C3%BCtzpunkte/09_Kolonien_Stutzpunkte.jpg"
        }
    }
];

mountForschungsbaum(document.querySelector("[data-forschungsbaum]"), {
    schluessel: "Umwelt, Leben und Ressourcen/Terraforming und planetare Gestaltung",
    titel: "Terraforming und planetare Gestaltung",
    knoten,
    // Baumform „Pyramide“ · Ressource und Aktion der Familie „biom“
    waehrung: {"name":"Proben","kurz":"PR"},
    aktion: {"text":"Proben sammeln","icon":"❦","punkte":3},
    rate: 0.6,
    stufen: ["Keimung","Wachstum","Vernetzung","Kreislauf"],
});
