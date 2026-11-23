// Synthetische Lebensforschung – Forschungszweig
// Forschungsbaum dieser Seite. Knoten, Kosten und Belohnungen lassen sich hier direkt anpassen.
// Stufen: 0 = Grundlagen, 1 = Vertiefung, 2 = Anwendung, 3 = Durchbruch. „benoetigt“ verbindet die Knoten im Baum.
import "../../_gemeinsam/zweig.js";
import { mountForschungsbaum } from "../../../../Men%C3%BCs/adapter/aporia-forschung.js";

const knoten = [
    {
        "id": "k1",
        "name": "Biochemie",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k2",
        "name": "Zellsynthese",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k3",
        "name": "Künstliche Genome",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k4",
        "name": "Bioreaktoren",
        "stufe": 1,
        "benoetigt": [
            "k1",
            "k2"
        ],
        "kosten": 25,
        "belohnung": {
            "art": "vorteil",
            "text": "Proben +40 % pro Sekunde",
            "wirkung": {
                "rate": 0.4
            }
        }
    },
    {
        "id": "k5",
        "name": "Lebende Architektur",
        "stufe": 1,
        "benoetigt": [
            "k2",
            "k3"
        ],
        "kosten": 25,
        "belohnung": {
            "art": "gegenstand",
            "name": "Kaeross die planetengrosse synthesekreatur",
            "bild": "../../../../assets/bilder/Himmelsk%C3%B6rper/synthetische_planetenwesen/kaeross/hauptseite/kaeross-die-planetengrosse-synthesekreatur-6e98c8844bfc.jpg"
        }
    },
    {
        "id": "k6",
        "name": "Synthetische Organismen",
        "stufe": 2,
        "benoetigt": [
            "k4"
        ],
        "kosten": 55,
        "belohnung": {
            "art": "gegenstand",
            "name": "Jorvane das planetengrosse synthesewesen",
            "bild": "../../../../assets/bilder/Himmelsk%C3%B6rper/synthetische_planetenwesen/jorvane/hauptseite/jorvane-das-planetengrosse-synthesewesen-630028e7a940.jpg"
        }
    },
    {
        "id": "k7",
        "name": "Hybride Lebensformen",
        "stufe": 2,
        "benoetigt": [
            "k4",
            "k5"
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
        "id": "k8",
        "name": "Erschaffung neuen Lebens",
        "stufe": 3,
        "benoetigt": [
            "k6",
            "k7"
        ],
        "kosten": 135,
        "belohnung": {
            "art": "gegenstand",
            "name": "Glyrane der planetengrosse synthesekoloss",
            "bild": "../../../../assets/bilder/Himmelsk%C3%B6rper/synthetische_planetenwesen/glyrane/hauptseite/glyrane-der-planetengrosse-synthesekoloss-858030f06c09.jpg"
        }
    }
];

mountForschungsbaum(document.querySelector("[data-forschungsbaum]"), {
    schluessel: "Umwelt, Leben und Ressourcen/Synthetische Lebensforschung",
    titel: "Synthetische Lebensforschung",
    knoten,
    // Baumform „Netz“ · Ressource und Aktion der Familie „biom“
    waehrung: {"name":"Proben","kurz":"PR"},
    aktion: {"text":"Proben sammeln","icon":"❦","punkte":3},
    rate: 0.6,
    stufen: ["Keimung","Wachstum","Vernetzung","Kreislauf"],
});
