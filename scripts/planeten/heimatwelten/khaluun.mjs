// Khaluun - Heimatwelt der Kollektiden (Tessari), abgeleitet aus dem bestehenden Speziesdossier.
const H = "assets/bilder/Himmelskörper/Planeten/Khaluun/";
const K = "assets/bilder/Alle Spezies+Übersicht/Mentale Spezies/Kollektiden/";

export default {
    systemseite: "inhalte/himmelskoerper/sternensysteme/details/ilaren-system/hauptseite/index.html",
    ordner: "khaluun",
    system: "ilaren-system",
    planetId: "ilaren-khaluun",
    name: "Khaluun",
    genitiv: "von Khaluun",
    klasse: "Gesteinsplanet",
    klasseLang: "Gemäßigter wasserreicher Gesteinsplanet mit aktiver Tektonik",
    spezies: {
        name: "Kollektiden (Tessari)",
        gruppe: "Mentale Spezies",
        ordner: "Kollektiden",
        seite: "inhalte/spezies/Mentale Spezies/Kollektiden/hauptseite/Spezies.html"
    },
    intro: "Khaluun ist eine wasserreiche Welt mit aktiver Plattentektonik, verzweigten Flusssystemen und weitläufigen Feuchtlandschaften. In ihren Terrassenbecken, Wanderdeltas und Nebelwäldern entwickelten sich die Tessari und ihre biologisch möglichen, zeitweiligen Verbundpersonen.",
    bildtext: "Khaluun aus dem Orbit: Ozeane, Terrassenbecken und Wanderdeltas",
    kurzprofil: [
        "Khaluun umkreist den K3V-Stern Ilaren in 0,52 AE Entfernung. Der Planet erhält rechnerisch rund 96 Prozent der mittleren Erdbestrahlung. Seine Wasserbedeckung, Atmosphäre und Wolken gleichen regionale und jahreszeitliche Schwankungen aus.",
        "Etwa 61 Prozent der Oberfläche sind von Wasser bedeckt. Zwei Monde erzeugen überlagerte Gezeiten, die besonders die flachen Küstenbecken und verzweigten Deltas prägen. Die Entstehung der Verbundperson Vey beruht auf der Biologie der Tessari, nicht auf einer exotischen Energiequelle."
    ],
    farben: {
        nacht: "#071019", tiefe: "#0b1b27", akzent: "#63c8c4", sand: "#d6bf91", moos: "#8eb18d", ozean: "#318da9",
        glas: "rgba(8, 20, 27, .82)", "glas-hell": "rgba(13, 31, 39, .9)",
        linie: "rgba(99, 200, 196, .2)", "linie-hell": "rgba(214, 191, 145, .42)", text: "#edf5f1", leise: "#a8beb9", "aporia-page-tint": "#287b86"
    },
    werte: {
        temperatur: "ca. 14 °C", temperaturMittel: 14,
        ozeane: "ca. 61 % (Ozeane, Randmeere, Deltas und Seen)",
        atmosphaere: [["Stickstoff", 77.8], ["Sauerstoff", 20.1], ["Argon", 1.2], ["Kohlendioxid", 0.06], ["Weitere Spurengase", 0.84]],
        atmoKurz: "Stickstoff-Sauerstoff, ca. 1,1 bar",
        atmoText: "Die Atmosphäre besteht überwiegend aus Stickstoff und Sauerstoff. Als globale Arbeitswerte gelten 77,8 Prozent Stickstoff, 20,1 Prozent Sauerstoff, 1,2 Prozent Argon und 0,06 Prozent Kohlendioxid. Wasserdampf und weitere Spurengase variieren regional und zeitlich. Feuchte Luft, Staub und vulkanische Gase können örtlich gesundheitlich belasten.",
        druck: "ca. 1,1 bar", druckMittel: 1.1,
        druckDaten: [["Mittlerer Oberflächendruck", "ca. 1,1 bar"], ["Sauerstoffanteil", "ca. 20,1 %"], ["Wasserbedeckung", "ca. 61 %"]],
        rotationH: 31.2, rotationText: "31,2 h (siderisch)", achsneigung: 18,
        jahreszeiten: "Vier Jahreszeiten; durch das kurze Umlaufjahr laufen sie auf Erdenzeitskala schneller ab.",
        treibhausText: "Die Gleichgewichtstemperatur ohne Atmosphäre liegt deutlich unter der mittleren Oberflächentemperatur. Atmosphäre, Wolken und Ozeane tragen zur globalen Mitteltemperatur von etwa 14 °C bei; regionale Werte weichen davon ab.",
        extra: [["Landbedeckung", "ca. 39 %"], ["Plattentektonik", "aktiv"], ["Bekannte Monde", "Deyra und Orim"], ["Einheimische intelligente Spezies", "Tessari (Kollektiden)"]],
        bahnExtra: [["Sternjahr", "ca. 155 Erdentage"], ["Umlaufposition", "dritter Planet von sechs"]],
        physikExtra: [["Oberflächengravitation", "ca. 1,02 g"], ["Fluchtgeschwindigkeit", "ca. 11,4 km/s"], ["Planetarer Dynamo", "Globales Magnetfeld vorhanden"]],
        zonen: { einheit: "°C", min: -25, max: 42, bereiche: [["Polare Randzonen", -25, 2], ["Gemäßigte Terrassen", 5, 22], ["Feuchte Deltas", 12, 30], ["Innere Trockenbecken", 18, 42]] },
        zonenText: "Die Wassermassen mildern extreme Temperaturen in Küstenregionen. Trockenbecken zeigen größere Schwankungen; Gebirgsränder, warme Randmeere und saisonale Niederschlagszonen erzeugen ausgeprägte regionale Unterschiede.",
        rekorde: [["Wasserbedeckung", "ca. 61 %"], ["Große Monde", "zwei bekannte"], ["Geologische Aktivität", "aktive Plattentektonik"], ["Prägende Küsten", "Wanderdeltas und flache Gezeitenbecken"]]
    },
    bilder: {
        medien: [["Khaluun aus dem Orbit", H + "khaluun-orbit.png"]]
    },
    kapitel: {
        "Allgemeines": { intro: "Die Tessari-Heimatwelt auf einen Blick.", abschnitte: [
            { titel: "Planetare Identität", daten: [["Name", "Khaluun"], ["System", "Ilaren-System"], ["Position", "Dritter Planet"], ["Klasse", "Terrestrischer Gesteinsplanet"], ["Biosphäre", "Komplex, kohlenstoffbasiert und wasserabhängig"], ["Intelligente Spezies", "Tessari (Kollektiden)"]] },
            { titel: "Eine Welt der Wasserwege", text: ["Khaluuns Küstenebenen, verzweigte Flüsse und Gezeitenbecken bilden einen zusammenhängenden Lebensraum. Regelmäßige Überflutungen verändern sichere Wege und begünstigen langfristig flexible Kooperation."] }
        ] },
        "Geografie": { intro: "Terrassen, Deltas und Nebelwälder bilden die prägenden Landschaften.", kopfbild: H + "khaluun-orbit.png", abschnitte: [
            { titel: "Große Terrassenbecken", text: ["Flache, durch Flüsse, Sedimente und tektonische Bewegungen geformte Becken. Erhöhte Terrassen bieten natürliche Schutzräume neben Wasserläufen, Inseln und Überflutungsflächen."] },
            { titel: "Wanderdeltas und Randmeere", text: ["Flussarme verlagern sich über lange Zeiträume. Trichterförmige Meeresarme verstärken örtlich die Gezeiten; Siedlungen nutzen erhöhte Plattformen und flexible Wasserbauwerke."] },
            { titel: "Nebelwälder und Basaltstufen", text: ["Feuchte Wälder beherbergen eine vielfältige Biosphäre. Tektonisch angehobene Basaltlandschaften enthalten mineralische Ablagerungen, unterirdische Gewässer und geothermisch aktive Regionen."] },
            { titel: "Innere Trockenbecken und polare Randzonen", text: ["Im trockenen Landesinneren schwanken Temperatur und Feuchtigkeit stärker. Polare Regionen besitzen saisonale Eisgebiete; ihre Besiedlung erforderte zusätzliche Umwelttechnik."] }
        ] },
        "Gewässer": { intro: "Flüsse, Ozeane und wechselnde Gezeiten formen Khaluuns Küsten.", abschnitte: [
            { titel: "Ozeane und flache Randmeere", text: ["Große Ozeanbecken sind mit ausgedehnten flachen Randmeeren verbunden. Strömungen, Sedimenttransport und Tektonik verändern Küstenlinien allmählich."] },
            { titel: "Gezeiten der beiden Monde", text: ["Deyra verursacht den stärkeren regelmäßigen Tidenhub; Orim überlagert ihn mit einem längeren Zyklus. Extreme globale Fluten treten nicht regelmäßig auf, doch Stürme und ungünstige Konstellationen können flache Buchten überfluten."] }
        ] },
        "Geologie": { intro: "Ein aktiver Planet mit Ozeankrusten, Basaltstufen und bewegten Platten.", abschnitte: [
            { titel: "Aktive Plattentektonik", text: ["Tektonische Platten verschieben sich und erneuern langfristig Teile der Kruste. Vulkanismus und Gebirgsbildung sind regional ausgeprägt; sie beeinflussen Flussläufe und Mineralverteilung."] },
            { titel: "Rohstoffräume", text: ["Basaltstufen und geothermische Regionen enthalten nutzbare Metalle und mineralische Ablagerungen. Förderung ist an Küsten und in besiedelten Feuchtgebieten ökologisch begrenzt."] }
        ] },
        "Biosphäre": { intro: "Die Biosphäre ist kohlenstoffbasiert und an flüssiges Wasser gebunden.", abschnitte: [
            { titel: "Lebensräume", text: ["Ozeane, Flussdeltas, Feuchtwälder, Basalthochländer und trockene Binnenbecken beherbergen deutlich unterschiedliche Lebensgemeinschaften. Küsten- und Flussökosysteme sind besonders produktiv."] },
            { titel: "Ursprungsräume der Tessari", text: ["Feuchte Deltas, überflutbare Terrassen und Waldsysteme bilden die wahrscheinlichsten frühen Lebensräume der Tessari. Die komplexe Biologie ihrer Kontaktlamellen entwickelte sich aus sozialer Signalisierung und Koordination."] }
        ] },
        "Spezies": { intro: "Khaluun ist die Heimatwelt der Tessari, die im Archiv als Kollektiden geführt werden.", abschnitte: [
            { titel: "Tessari und Veya", text: ["Jeder Tessar ist eine eigenständige Person. Unter passenden biologischen Bedingungen können mehrere freiwillig eine zusätzliche, zeitweilige Verbundperson – einen Vey – hervorbringen. Diese Fähigkeit ist Teil der Speziesbiologie und keine planetare Strahlungs- oder Energiewirkung."], verweise: [["Zum Kollektiden-Dossier", "inhalte/spezies/Mentale Spezies/Kollektiden/hauptseite/Spezies.html"]] }
        ] },
        "Geschichte": { intro: "Die langfristige Geschichte Khaluuns ist mit der Entwicklung seiner Biosphäre und Zivilisation verbunden.", abschnitte: [
            { titel: "Geologische Entwicklung", text: ["Ozeanbecken, Flusssysteme und Terrassenlandschaften entstanden über geologische Zeiträume aus Wasser, Erosion und aktiver Tektonik. Die heutige Küstenlinie ist nicht statisch."] },
            { titel: "Besiedlung und Raumfahrt", text: ["Frühe Siedlungen lagen auf erhöhten Terrassen und an geschützten Gewässern. Später wurden die beiden Monde zu frühen Forschungszielen; der Asteroidengürtel erweiterte die Rohstoffbasis der Raumfahrt."] }
        ] },
        "Fraktionen": { intro: "Die politische Zuordnung Khaluuns folgt der Eigenständigkeit der Tessari-Gesellschaft.", abschnitte: [
            { titel: "Heimische Zivilisation", text: ["Die Kollektiden sind auf Khaluun heimisch. Individuelle Tessari und zeitweilig bestehende Veya besitzen in ihrer Gesellschaft eigene rechtliche und politische Bedeutung."] },
            { titel: "Interstellare Beziehungen", text: ["Der Erstkontakt führte zu Fragen der Anerkennung von Veya als eigenständige Personen. Konkrete Mitgliedschaften und Gebietsansprüche fremder Fraktionen werden im vorhandenen Speziesdossier nicht abschließend festgelegt."] }
        ] },
        "Rohstoffe": { intro: "Die Ressourcengewinnung muss Ozeane und empfindliche Küstenökosysteme berücksichtigen.", abschnitte: [
            { titel: "Mineralien und Wasser", text: ["Metalle und industrielle Mineralien finden sich besonders in tektonischen und basaltischen Regionen. Oberflächenwasser ist reichlich vorhanden, seine Aufbereitung und der Schutz der Flusssysteme bleiben dennoch zentrale Infrastrukturaufgaben."] },
            { titel: "Asteroidengürtel", text: ["Der Gürtel zwischen Meyt und Daran liefert zusätzliche metallische, silikatische und kohlenstoffhaltige Rohstoffe und verringert den Abbaudruck auf Khaluuns Biosphäre."] }
        ] },
        "Erforschung": { intro: "Die Erforschung verbindet Planetologie, Ozeanographie und Kollektiden-Biologie.", abschnitte: [
            { titel: "Offene Planetenfragen", liste: ["Langfristige Entwicklung der Wanderdeltas", "Wechselwirkung zwischen Gezeiten und Küstenökosystemen", "Regionale Klimaverläufe und Ozeanströmungen", "Tektonische Entwicklung der Basaltstufen"] },
            { titel: "Forschung zur Entstehung der Veya", text: ["Fossilien und Kontaktorgane helfen, die Evolution sozialer Signalübertragung zu rekonstruieren. Wann daraus erstmals subjektive Verbundpersönlichkeit entstand, bleibt eine offene wissenschaftliche Frage."] }
        ] },
        "Besonderheiten": { intro: "Khaluuns Besonderheiten ergeben sich aus gewöhnlichen planetaren Prozessen.", abschnitte: [
            { titel: "Zwei sich überlagernde Mondzyklen", text: ["Die unterschiedlichen Umlaufzeiten Deyras und Orims erzeugen wiederkehrende Gezeitenmuster. Sie verstärken lokal die Wasserbewegung, ohne eine regelmäßige planetenweite Flut auszulösen."] },
            { titel: "Biologie statt Anomalie", text: ["Die Fähigkeit zur Bildung eines Vey beruht auf kompatiblen Nervensystemen und Kontaktlamellen. Das Arbeitsmodell benötigt keine kosmische Anomalie."] }
        ] }
    }
};
