// Physik – Forschungszweig
// Forschungsbaum dieser Seite. Knoten, Kosten und Belohnungen lassen sich hier direkt anpassen.
// Stufen: 0 = Grundlagen, 1 = Vertiefung, 2 = Anwendung, 3 = Durchbruch. „benoetigt“ verbindet die Knoten im Baum.
import "../../_gemeinsam/zweig.js";
import { mountForschungsbaum } from "../../../../Men%C3%BCs/adapter/aporia-forschung.js";

const knoten = [
    {
        "id": "k1",
        "name": "Mechanik",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k2",
        "name": "Thermodynamik",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k3",
        "name": "Elektromagnetismus",
        "stufe": 1,
        "benoetigt": [
            "k1"
        ],
        "kosten": 25,
        "belohnung": {
            "art": "vorteil",
            "text": "Messwerte +20 % pro Sekunde",
            "wirkung": {
                "rate": 0.2
            }
        }
    },
    {
        "id": "k4",
        "name": "Optik und Wellen",
        "stufe": 1,
        "benoetigt": [
            "k2"
        ],
        "kosten": 25,
        "belohnung": {
            "art": "vorteil",
            "text": "„Messung durchführen“ bringt +2 MW",
            "wirkung": {
                "experiment": 2
            }
        }
    },
    {
        "id": "k5",
        "name": "Quantenmechanik",
        "stufe": 2,
        "benoetigt": [
            "k3"
        ],
        "kosten": 55,
        "belohnung": {
            "art": "gegenstand",
            "name": "Schwarzes loch im gluhenden akkretionsring",
            "bild": "../../../../assets/bilder/Himmelsk%C3%B6rper/SchwarzeL%C3%B6cher/veyaiven-singularitat/hauptseite/schwarzes-loch-im-gluhenden-akkretionsring-b1c1f53b8cff.jpg"
        }
    },
    {
        "id": "k6",
        "name": "Plasmaphysik",
        "stufe": 2,
        "benoetigt": [
            "k3",
            "k4"
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
        "id": "k7",
        "name": "Relativitätstheorie",
        "stufe": 2,
        "benoetigt": [
            "k4"
        ],
        "kosten": 55,
        "belohnung": {
            "art": "gegenstand",
            "name": "Asymmetrische akkretionsscheibe um ein schwarzes loch",
            "bild": "../../../../assets/bilder/Himmelsk%C3%B6rper/SchwarzeL%C3%B6cher/elovden-singularitat/hauptseite/asymmetrische-akkretionsscheibe-um-ein-schwarzes-loch-698cbd16419d.jpg"
        }
    },
    {
        "id": "k8",
        "name": "Vereinheitlichte Feldtheorie",
        "stufe": 3,
        "benoetigt": [
            "k5",
            "k6",
            "k7"
        ],
        "kosten": 135,
        "belohnung": {
            "art": "gegenstand",
            "name": "Junger akkretionsmond im schwarzen all",
            "bild": "../../../../assets/bilder/Himmelsk%C3%B6rper/Monde/deyra/motive/motiv-02/hauptseite/junger-akkretionsmond-im-schwarzen-all-c41afb8268.webp"
        }
    }
];

mountForschungsbaum(document.querySelector("[data-forschungsbaum]"), {
    schluessel: "Naturwissenschaften/Physik",
    titel: "Physik",
    knoten,
    // Baumform „Zwillingsstamm“ · Ressource und Aktion der Familie „labor“
    waehrung: {"name":"Messwerte","kurz":"MW"},
    aktion: {"text":"Messung durchführen","icon":"⚗","punkte":4},
    rate: 0.5,
    stufen: ["Grundlagen","Analyse","Experiment","Durchbruch"],
});
