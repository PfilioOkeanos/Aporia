// Astronomie und Kosmologie – Forschungszweig
// Forschungsbaum dieser Seite. Knoten, Kosten und Belohnungen lassen sich hier direkt anpassen.
// Stufen: 0 = Grundlagen, 1 = Vertiefung, 2 = Anwendung, 3 = Durchbruch. „benoetigt“ verbindet die Knoten im Baum.
import "../../_gemeinsam/zweig.js";
import { mountForschungsbaum } from "../../../../Men%C3%BCs/adapter/aporia-forschung.js";

const knoten = [
    {
        "id": "k1",
        "name": "Himmelsmechanik",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k2",
        "name": "Spektroskopie",
        "stufe": 1,
        "benoetigt": [
            "k1"
        ],
        "kosten": 20,
        "belohnung": {
            "art": "vorteil",
            "text": "Beobachtungsdaten +40 % pro Sekunde",
            "wirkung": {
                "rate": 0.4
            }
        }
    },
    {
        "id": "k3",
        "name": "Sternentwicklung",
        "stufe": 1,
        "benoetigt": [
            "k1"
        ],
        "kosten": 20,
        "belohnung": {
            "art": "gegenstand",
            "name": "Junger Sternhaufen im blauvioletten Nebel",
            "bild": "../../../../assets/bilder/Kosmologie/SternenEntsgehungsGebiete/junger-sternhaufen-im-blauvioletten-nebel/hauptseite/Junger%20Sternhaufen%20im%20blauvioletten%20Nebel-23.png"
        }
    },
    {
        "id": "k4",
        "name": "Galaxienforschung",
        "stufe": 2,
        "benoetigt": [
            "k2"
        ],
        "kosten": 50,
        "belohnung": {
            "art": "vorteil",
            "text": "„Himmel beobachten“ bringt +1 BD",
            "wirkung": {
                "experiment": 1
            }
        }
    },
    {
        "id": "k5",
        "name": "Radioastronomie",
        "stufe": 2,
        "benoetigt": [
            "k2",
            "k3"
        ],
        "kosten": 50,
        "belohnung": {
            "art": "gegenstand",
            "name": "Rosarote Nebelgalaxie im tiefen All",
            "bild": "../../../../assets/bilder/Kosmologie/Galaxien/rosarote-nebelgalaxie-im-tiefen-all/hauptseite/Rosarote%20Nebelgalaxie%20im%20tiefen%20All-38.png"
        }
    },
    {
        "id": "k6",
        "name": "Kosmische Strahlung",
        "stufe": 3,
        "benoetigt": [
            "k4"
        ],
        "kosten": 125,
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
        "name": "Dunkle Materie",
        "stufe": 3,
        "benoetigt": [
            "k5"
        ],
        "kosten": 125,
        "belohnung": {
            "art": "vorteil",
            "text": "Beobachtungsdaten +15 % pro Sekunde",
            "wirkung": {
                "rate": 0.15
            }
        }
    },
    {
        "id": "k8",
        "name": "Ursprung des Universums",
        "stufe": 4,
        "benoetigt": [
            "k6",
            "k7"
        ],
        "kosten": 305,
        "belohnung": {
            "art": "gegenstand",
            "name": "Junge kompakte Galaxie mit dichten Sternhaufen",
            "bild": "../../../../assets/bilder/Kosmologie/Galaxien/junge-kompakte-galaxie-mit-dichten-sternhaufen/hauptseite/Junge%20kompakte%20Galaxie%20mit%20dichten%20Sternhaufen-39.png"
        }
    }
];

mountForschungsbaum(document.querySelector("[data-forschungsbaum]"), {
    schluessel: "Raum- und Planetensysteme/Astronomie und Kosmologie",
    titel: "Astronomie und Kosmologie",
    knoten,
    // Baumform „Kette“ · Ressource und Aktion der Familie „sternwarte“
    waehrung: {"name":"Beobachtungsdaten","kurz":"BD"},
    aktion: {"text":"Himmel beobachten","icon":"✦","punkte":2},
    rate: 0.9,
    stufen: ["Beobachtung","Messung","Modell","Expedition","Entdeckung"],
});
