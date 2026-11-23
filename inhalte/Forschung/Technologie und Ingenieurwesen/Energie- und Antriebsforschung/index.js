// Energie- und Antriebsforschung – Forschungszweig
// Forschungsbaum dieser Seite. Knoten, Kosten und Belohnungen lassen sich hier direkt anpassen.
// Stufen: 0 = Grundlagen, 1 = Vertiefung, 2 = Anwendung, 3 = Durchbruch. „benoetigt“ verbindet die Knoten im Baum.
import "../../_gemeinsam/zweig.js";
import { mountForschungsbaum } from "../../../../Men%C3%BCs/adapter/aporia-forschung.js";

const knoten = [
    {
        "id": "k1",
        "name": "Energieumwandlung",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k2",
        "name": "Speichertechnik",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k3",
        "name": "Fusionsforschung",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k4",
        "name": "Ionenantrieb",
        "stufe": 0,
        "benoetigt": [],
        "kosten": 10
    },
    {
        "id": "k5",
        "name": "Supraleitung",
        "stufe": 1,
        "benoetigt": [
            "k1",
            "k2"
        ],
        "kosten": 25,
        "belohnung": {
            "art": "vorteil",
            "text": "Konstruktionspunkte +20 % pro Sekunde",
            "wirkung": {
                "rate": 0.2
            }
        }
    },
    {
        "id": "k6",
        "name": "Plasmatriebwerk",
        "stufe": 1,
        "benoetigt": [
            "k3",
            "k4"
        ],
        "kosten": 25,
        "belohnung": {
            "art": "gegenstand",
            "name": "Helium-3-Deuterium-Fusionspellet im Plasmaraum",
            "bild": "../../../../assets/bilder/Rohstoffe/Helium-3-Deuterium-Fusionspellet%20im%20Plasmaraum-12.png"
        }
    },
    {
        "id": "k7",
        "name": "Fusionsantrieb",
        "stufe": 2,
        "benoetigt": [
            "k5",
            "k6"
        ],
        "kosten": 55,
        "belohnung": {
            "art": "gegenstand",
            "name": "Gluhende fusionsnarbe eines jungen planeten",
            "bild": "../../../../assets/bilder/Himmelsk%C3%B6rper/Gesteinsplaneten/laearra/hauptseite/gluhende-fusionsnarbe-eines-jungen-planeten-9b94da1622.webp"
        }
    },
    {
        "id": "k8",
        "name": "Nullpunktenergie",
        "stufe": 3,
        "benoetigt": [
            "k7"
        ],
        "kosten": 135,
        "belohnung": {
            "art": "gegenstand",
            "name": "Antrieb 09 dunkle energie antrieb",
            "bild": "../../../../assets/bilder/Fahrzeuge%20&%20Raumschiffe/Antriebe/antrieb_09_dunkle_energie_antrieb.png"
        }
    }
];

mountForschungsbaum(document.querySelector("[data-forschungsbaum]"), {
    schluessel: "Technologie und Ingenieurwesen/Energie- und Antriebsforschung",
    titel: "Energie- und Antriebsforschung",
    knoten,
    // Baumform „Breite Basis“ · Ressource und Aktion der Familie „werkstatt“
    waehrung: {"name":"Konstruktionspunkte","kurz":"KP"},
    aktion: {"text":"Prototyp bauen","icon":"⚙","punkte":3},
    rate: 0.7,
    stufen: ["Grundlagen","Entwurf","Prototyp","Meisterwerk"],
});
