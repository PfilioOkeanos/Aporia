// Saelith III · Heimatwelt der Aerothanen. Die Kapiteltexte kommen vollständig und unverändert aus dem Infomaterial
// (heimatwelt-referenz.md und Sternensystem/Sternensytstem.md) – die Spezies-Seite zeigt nur noch eine Zusammenfassung.
// Bahn 2,60 AE unverändert; 62.000 km, 120 Erdmassen, Ringsystem 85.000–150.000 km ergänzt.
import { quellAbschnitte } from "../quelltext-kapitel.mjs";
const Q = "Info_material/Alle_spezies_daten/Gigantische Lebensformen/Aerothanen/";
const hw = quellAbschnitte(Q + "05_Heimatwelt/heimatwelt-referenz.md");
const ss = quellAbschnitte(Q + "Sternensystem/Sternensytstem.md");
export default {
    kapitelErgaenzen: true, doppelteWeglassen: true,
    ordner: "saelith-iii", system: "osselyr-system", planetId: "osselyr-saelith-iii",
    name: "Saelith III", genitiv: "von Saelith III", klasse: "Gasriese", globusKlasse: "Gasriese",
    klasseLang: "Gasriese mit atmosphärischer Biosphäre und Ringsystem",
    spezies: { name: "Aerothanen", gruppe: "Gigantische Lebensformen", ordner: "Aerothanen" },
    intro: "Saelith III – die Welt der Himmelsriesen. Ein gold-blauer Gasriese mit hellem Ringsystem, ohne feste Oberfläche. In seiner gemäßigten Schwebezone, fünf bis zwölf bar tief in der Atmosphäre, leben die Aerothanen: aufrecht schwebende Giganten von 500 bis 3.000 Metern Höhe.",
    bildtext: "Saelith III – Welt der Himmelsriesen",
    kurzprofil: [
        "Saelith III ist der dritte Hauptplanet des Osselyr-Systems. Mit 124.000 Kilometern Durchmesser und rund 120 Erdmassen (0,38 Jupitermassen) ist er ein leichter, ausgedehnter Gasriese; am Referenzniveau beträgt die Schwerkraft etwa 1,27 g. Er umkreist den orangefarbenen Zwerg Saelith in 2,60 AE Abstand und rotiert in nur 13,5 Stunden.",
        "Seine Atmosphäre besteht zu 87 % aus molekularem Wasserstoff und zu 12,3 % aus Helium. Die Klimazonen liegen übereinander: Unter den kalten Silberwolken und der Goldschicht folgt die gemäßigte Schwebezone mit 240–340 Kelvin – Hauptlebensraum der Aerothanen und Schwerpunkt ihrer Zivilisation.",
    ],
    farben: { nacht: "#07080e", tiefe: "#10131d", akzent: "#e8b860", sand: "#d8b77c", moos: "#8fb6d6", ozean: "#4f86c6", glas: "rgba(14, 16, 26, .8)", "glas-hell": "rgba(24, 27, 40, .86)", linie: "rgba(232, 184, 96, .16)", "linie-hell": "rgba(143, 182, 214, .36)", text: "#f2f2f6", leise: "#aab0c2", "aporia-page-tint": "#5a4a22" },
    werte: {
        temperatur: "ca. 240–340 K (−33 bis 67 °C) in der Schwebezone · Gleichgewicht ca. −143 °C", temperaturMittel: 20, ozeane: "Keine Oberfläche; wasserhaltige Wolken und Niederschläge",
        atmosphaere: [["Molekularer Wasserstoff", 87], ["Helium", 12.3], ["Methan", 0.4], ["Weitere Gase und Dämpfe", 0.3]],
        atmoKurz: "Wasserstoff-Helium, Schwebezone bei 5–12 bar",
        atmoText: "Vorläufiges Arbeitsmodell nach molaren Anteilen: 87,0 % molekularer Wasserstoff, 12,3 % Helium, 0,4 % Methan und 0,3 % weitere Gase – Wasserdampf, Ammoniak, Schwefelwasserstoff, Neon, Argon, Kohlenwasserstoffe und regionale biogene Spurengase. Wasser und Ammoniak kondensieren in geeigneten Schichten. Freier Sauerstoff fehlt; für sauerstoffatmende Spezies ist die Luft nicht atembar.",
        druck: "ca. 5–12 bar in der Schwebezone (nach unten stark ansteigend)", druckMittel: 8,
        druckDaten: [["Äußerer Schleier", "unter 0,1 bar"], ["Silberwolken", "ca. 0,1–1 bar"], ["Goldschicht", "ca. 1–5 bar"], ["Gemäßigte Schwebezone", "ca. 5–12 bar"], ["Tiefe Sturmzone", "ca. 12–40 bar"], ["Hochdruckzone", "über 40 bar"]],
        rotationH: 13.5, rotationText: "ca. 13,5 h", achsneigung: 11, jahreszeiten: "Veränderungen der äußeren Strahlungs- und Wolkenbedingungen",
        treibhausText: "Die Gleichgewichtstemperatur von rund 130 K beschreibt nur die oberen Wolken. In der Tiefe steigen Druck und Temperatur stark an; zusätzlich gibt der Planet Wärme aus seinem Inneren ab.",
        magnetfeldFaktor: 8,
        physikExtra: [["Feste Oberfläche", "Nicht vorhanden"], ["Magnetosphäre", "Ausgedehnt, mit Strahlungsgürteln und Polarlichtern"]],
        extra: [["Beiname", "Welt der Himmelsriesen"], ["Archiv-ID", "AP-8B515B4143"], ["Ringsystem", "Hell, ca. 85.000–150.000 km vom Zentrum"], ["Charakteristische Farben", "Gold, Ocker, Blau, Silberweiß"], ["Fraktionszugehörigkeit", "Offen"]],
        umbenennen: { "Mittlere Oberflächentemperatur": "Temperatur der Schwebezone", "Ozeane": "Wasser", "Atmosphärendruck": "Druck der Schwebezone", "Schwerkraft": "Schwerkraft (Referenzniveau)", "Oberflächenschwerkraft": "Schwerkraft (Referenzniveau)", "Mittlere Temperatur": "Temperatur der Schwebezone", "Luftdruck (Mittel)": "Druck der Schwebezone" },
        zonen: { einheit: "°C", min: -180, max: 150, bereiche: [["Äußerer Schleier", -175, -150], ["Silberwolken", -150, -100], ["Goldschicht", -100, -30], ["Gemäßigte Schwebezone", -33, 67], ["Tiefe Sturmzone", 60, 150]] },
        zonenText: "Auf Saelith III verlaufen die Klimazonen nach Breitengrad und vor allem nach Tiefe. Gegenläufige Windbänder, aufsteigende und absinkende Gasmassen und Wärme aus dem Inneren prägen das Wetter; stabile Regionen wechseln mit extrem dynamischen Gebieten. Die Temperaturwerte der oberen Schichten sind Schätzungen des Archivs.",
        rekorde: [["Größte Lebensformen", "Aerothanen, 500–3.000 m hoch"], ["Lebenserwartung der Aerothanen", "ca. 2.500–9.000 Jahre"], ["Größter Wirbel", "Kronenwirbel, ca. 18.000 km"], ["Stärkste Winde", "bis ca. 1.000 km/h in lokalen Sturmregionen"]],
    },
    kapitel: {
        "Allgemeines": { intro: "Saelith III auf einen Blick: Wolken, Ringe und Himmelsriesen.", abschnitte: hw("HW01", "HW31") },
        "Astronomie": { intro: "Ein Gasriese im äußeren Osselyr-System.", abschnitte: [...hw("HW02"), ...ss("SS07"), ...hw("HW13", "HW14")] },
        "Physik": { abschnitte: hw("HW03") },
        "Planetare Struktur": { abschnitte: hw("HW04") },
        "Geografie": { intro: "Keine Kontinente – Regionen aus Wolken und Strömungen.", abschnitte: hw("HW10") },
        "Atmosphäre": { abschnitte: hw("HW05") },
        "Klima": { abschnitte: hw("HW08") },
        "Gewässer": { abschnitte: hw("HW11") },
        "Geologie": { abschnitte: hw("HW12", "HW25") },
        "Biosphäre": { intro: "Eine vollständig atmosphärische Biosphäre.", abschnitte: hw("HW15", "HW16") },
        "Spezies": { intro: "Die Aerothanen – aufrechte Himmelsriesen.", abschnitte: [...hw("HW17", "HW18"), ...ss("SS13", "SS14")] },
        "Zivilisation": { abschnitte: hw("HW19", "HW24", "HW26") },
        "Geschichte": { abschnitte: hw("HW20") },
        "Fraktionen": { abschnitte: hw("HW21") },
        "Rohstoffe": { abschnitte: hw("HW22") },
        "Erforschung": { abschnitte: hw("HW23") },
        "Besonderheiten": { abschnitte: hw("HW27", "HW28", "HW29", "HW30") },
        "Gaszusammensetzung": { abschnitte: hw("HW06") },
        "Wolkenschichten": { abschnitte: hw("HW07") },
        "Stürme": { abschnitte: hw("HW09") },
        "Sternensystem": { intro: "Das Osselyr-System: Saelith, vier Hauptplaneten und zwei intelligente Spezies.", abschnitte: ss("SS01", "SS02", "SS03", "SS04", "SS05", "SS06", "SS08", "SS09", "SS10", "SS11", "SS12", "SS15", "SS16", "SS17", "SS18") },
        "Medienarchiv": { abschnitte: [] },
    },
};
if (hw.rest().length || ss.rest().length) throw new Error("Saelith III: nicht zugeordnete Quellabschnitte " + [...hw.rest(), ...ss.rest()].join(", "));
