// Chemie – Forschungszweig
// Forschungsbaum dieser Seite. Knoten, Kosten und Belohnungen lassen sich hier direkt anpassen.
// Stufen: 0 = Grundlagen, 1 = Vertiefung, 2 = Anwendung, 3 = Durchbruch. „benoetigt“ verbindet die Knoten im Baum.
import "../../_gemeinsam/zweig.js";
import { mountForschungsbaum } from "../../../../Men%C3%BCs/adapter/aporia-forschung.js";

const knoten = [
    {
        "id": "k1",
        "name": "Atombau",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k2",
        "name": "Stöchiometrie",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k3",
        "name": "Reaktionskinetik",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k4",
        "name": "Spektralanalyse",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k5",
        "name": "Katalyse",
        "stufe": 1,
        "benoetigt": [
            "k1",
            "k2"
        ],
        "kosten": 30,
        "belohnung": {
            "art": "gegenstand",
            "name": "Versiegelte Bromampulle im Labor",
            "bild": "../../../../assets/bilder/Rohstoffe/Versiegelte%20Bromampulle%20im%20Labor-29.png"
        }
    },
    {
        "id": "k6",
        "name": "Polymerchemie",
        "stufe": 1,
        "benoetigt": [
            "k3",
            "k4"
        ],
        "kosten": 30,
        "belohnung": {
            "art": "vorteil",
            "text": "„Messung durchführen“ bringt +3 MW",
            "wirkung": {
                "experiment": 3
            }
        }
    },
    {
        "id": "k7",
        "name": "Kristallsynthese",
        "stufe": 2,
        "benoetigt": [
            "k5",
            "k6"
        ],
        "kosten": 75,
        "belohnung": {
            "art": "gegenstand",
            "name": "Probenahme Materialanalysen",
            "bild": "../../../../assets/bilder/Himmelsk%C3%B6rper/OzeanWelt/erde/unterseiten/ERDE_BILDER/Erforschung/07%20%E2%80%93%20Probenahme%20&%20Materialanalysen/07_Probenahme_Materialanalysen.jpg"
        }
    },
    {
        "id": "k8",
        "name": "Programmierbare Materie",
        "stufe": 3,
        "benoetigt": [
            "k7"
        ],
        "kosten": 180,
        "belohnung": {
            "art": "gegenstand",
            "name": "Versiegelte Ampulle mit flüssigem Sauerstoff",
            "bild": "../../../../assets/bilder/Rohstoffe/Versiegelte%20Ampulle%20mit%20fl%C3%BCssigem%20Sauerstoff-2.png"
        }
    }
];

mountForschungsbaum(document.querySelector("[data-forschungsbaum]"), {
    schluessel: "Naturwissenschaften/Chemie",
    titel: "Chemie",
    knoten,
    // Baumform „Breite Basis“ · Ressource und Aktion der Familie „labor“
    waehrung: {"name":"Messwerte","kurz":"MW"},
    aktion: {"text":"Messung durchführen","icon":"⚗","punkte":4},
    rate: 0.5,
    stufen: ["Grundlagen","Analyse","Experiment","Durchbruch"],
});
