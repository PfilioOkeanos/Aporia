// Exoplanetare Ökologie – Forschungszweig
// Forschungsbaum dieser Seite. Knoten, Kosten und Belohnungen lassen sich hier direkt anpassen.
// Stufen: 0 = Grundlagen, 1 = Vertiefung, 2 = Anwendung, 3 = Durchbruch. „benoetigt“ verbindet die Knoten im Baum.
import "../../_gemeinsam/zweig.js";
import { mountForschungsbaum } from "../../../../Men%C3%BCs/adapter/aporia-forschung.js";

const knoten = [
    {
        "id": "k1",
        "name": "Habitabilität",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k2",
        "name": "Biosignaturen",
        "stufe": 1,
        "benoetigt": [
            "k1"
        ],
        "kosten": 30,
        "belohnung": {
            "art": "vorteil",
            "text": "Beobachtungsdaten +30 % pro Sekunde",
            "wirkung": {
                "rate": 0.3
            }
        }
    },
    {
        "id": "k3",
        "name": "Fremde Nahrungsketten",
        "stufe": 1,
        "benoetigt": [
            "k1"
        ],
        "kosten": 30,
        "belohnung": {
            "art": "vorteil",
            "text": "Forschungskosten −15 %",
            "wirkung": {
                "rabatt": 0.15
            }
        }
    },
    {
        "id": "k4",
        "name": "Klimamodelle",
        "stufe": 2,
        "benoetigt": [
            "k2"
        ],
        "kosten": 70,
        "belohnung": {
            "art": "gegenstand",
            "name": "Ammoniak ozeanplanet mit leuchtenden rissen",
            "bild": "../../../../assets/bilder/Himmelsk%C3%B6rper/EisWelten/ammoniak-ozeanplanet-mit-leuchtenden-rissen/hauptseite/ammoniak-ozeanplanet-mit-leuchtenden-rissen-61740e8a1c.webp"
        }
    },
    {
        "id": "k5",
        "name": "Biomkartierung",
        "stufe": 2,
        "benoetigt": [
            "k2"
        ],
        "kosten": 70,
        "belohnung": {
            "art": "gegenstand",
            "name": "Dampfplanet mit gluhendem ozean",
            "bild": "../../../../assets/bilder/Himmelsk%C3%B6rper/EisWelten/dampfplanet-mit-gluhendem-ozean/hauptseite/dampfplanet-mit-gluhendem-ozean-ace7e0a834.webp"
        }
    },
    {
        "id": "k6",
        "name": "Anpassungsforschung",
        "stufe": 2,
        "benoetigt": [
            "k3"
        ],
        "kosten": 70,
        "belohnung": {
            "art": "vorteil",
            "text": "„Himmel beobachten“ bringt +4 BD",
            "wirkung": {
                "experiment": 4
            }
        }
    },
    {
        "id": "k7",
        "name": "Ökosystemschutz",
        "stufe": 2,
        "benoetigt": [
            "k3"
        ],
        "kosten": 70,
        "belohnung": {
            "art": "vorteil",
            "text": "„Himmel beobachten“ bringt +3 BD",
            "wirkung": {
                "experiment": 3
            }
        }
    },
    {
        "id": "k8",
        "name": "Lebende Welten",
        "stufe": 3,
        "benoetigt": [
            "k5",
            "k6"
        ],
        "kosten": 165,
        "belohnung": {
            "art": "gegenstand",
            "name": "Rissige eiswelt mit verborgenem ozean",
            "bild": "../../../../assets/bilder/Himmelsk%C3%B6rper/OzeanWelt/rissige-eiswelt-mit-verborgenem-ozean/hauptseite/rissige-eiswelt-mit-verborgenem-ozean-707d78b12a.webp"
        }
    }
];

mountForschungsbaum(document.querySelector("[data-forschungsbaum]"), {
    schluessel: "Raum- und Planetensysteme/Exoplanetare Ökologie",
    titel: "Exoplanetare Ökologie",
    knoten,
    // Baumform „Diamant“ · Ressource und Aktion der Familie „sternwarte“
    waehrung: {"name":"Beobachtungsdaten","kurz":"BD"},
    aktion: {"text":"Himmel beobachten","icon":"✦","punkte":2},
    rate: 0.9,
    stufen: ["Beobachtung","Messung","Modell","Entdeckung"],
});
