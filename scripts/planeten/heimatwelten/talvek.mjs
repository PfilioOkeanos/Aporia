// Talvek · Ursprungsplanet der Lithonetzwerke (Quelle: Info_material/…/Gigantische Lebensformen/Lithonetzwerke/05_Heimatwelt/heimatwelt-referenz.md
// und Sternensystem/Sternensystem.md – Bahn 1,57 AE unverändert, 5.097 km, 0,5 Erdmassen, Monde Rusk und Nemi)
export default {
    ordner: "talvek", system: "nerath-system", planetId: "nerath-talvek", systemseite: "inhalte/himmelskoerper/sternensysteme/details/terev-system/hauptseite/index.html",
    name: "Talvek", genitiv: "von Talvek", klasse: "Gesteinsplanet", globusKlasse: "Kalte Gesteinswelt",
    klasseLang: "Kalter terrestrischer Gesteinsplanet mit unterirdischer Biosphäre",
    spezies: { name: "Lithonetzwerke", gruppe: "Gigantische Lebensformen", ordner: "Lithonetzwerke" },
    intro: "Talvek wirkt bei oberflächlicher Betrachtung wie ein lebloser, kalter Gesteinsplanet. Doch zwei bis fünfzehn Kilometer tief in seiner Kruste leben die Lithonetzwerke – gigantische, im Gestein verwurzelte Intelligenzen. Ein einzelnes Gebirge kann Lebensraum mehrerer eigenständiger Individuen sein.",
    bildtext: "Talvek – die stille Welt der Tiefen",
    kurzprofil: [
        "Talvek ist der vierte Hauptplanet des Terev-Systems und umkreist den orangegelben Zwerg Terev in 1,57 AE Abstand – außerhalb der habitablen Zone. Mit 10.194 Kilometern Durchmesser und 0,5 Erdmassen ist er kleiner als die Erde; die Schwerkraft beträgt 0,78 g. Die dünne Kohlendioxid-Atmosphäre hat nur 0,12 bar, die Oberfläche liegt im Mittel bei etwa −75 °C.",
        "In seiner Frühgeschichte war Talvek wärmer und besaß mehr Wasser nahe der Oberfläche. Mit der Abkühlung verlagerten sich geeignete Lebensräume in den Untergrund, wo Salzlösungen, hydrothermale Bruchzonen und chemische Energiequellen eine Tiefenbiosphäre tragen. Dort entstand die Zivilisation der Lithonetzwerke.",
    ],
    farben: { nacht: "#07070a", tiefe: "#111117", akzent: "#c98a5a", sand: "#b9a28a", moos: "#8fb0a8", ozean: "#5a86a8", glas: "rgba(17, 17, 23, .8)", "glas-hell": "rgba(28, 28, 36, .86)", linie: "rgba(201, 138, 90, .16)", "linie-hell": "rgba(210, 170, 130, .36)", text: "#efecea", leise: "#aba49c", "aporia-page-tint": "#4a3324" },
    werte: {
        temperatur: "ca. −75 °C (Arbeitsmodell)", temperaturMittel: -75, ozeane: "Keine offenen Meere; Polareis, Eisschichten und tiefe Salzlösungen",
        atmosphaere: [["Kohlendioxid", 72], ["Stickstoff", 25], ["Argon", 2.5], ["Sonstige Gase", 0.5]],
        atmoKurz: "Dünn, kalt, nicht atembar, ca. 0,12 bar",
        atmoText: "Talvek besitzt eine dünne, kalte und für Menschen nicht atembare Atmosphäre von etwa 0,12 bar – vorgeschlagen sind 72 % Kohlendioxid, 25 % Stickstoff, 2,5 % Argon und 0,5 % sonstige Gase. Die genaue Zusammensetzung kann bei der späteren Planetensimulation angepasst werden.",
        druck: "ca. 0,12 bar", druckMittel: 0.12,
        rotationH: 31, rotationText: "ca. 31 h", achsneigung: 19, jahreszeiten: "Stark – große regionale und jahreszeitliche Schwankungen",
        treibhausText: "Die dünne Kohlendioxid-Atmosphäre hebt die Oberflächentemperatur nur um rund 15 K über die Gleichgewichtstemperatur von etwa −90 °C.",
        magnetfeldFaktor: 0.3,
        physikExtra: [["Zusammensetzung", "Überwiegend Silikate, Eisenverbindungen, metallische Minerale"], ["Krustendicke", "ca. 35–70 km"]],
        extra: [["Archiv-ID", "AP-283A636FC0"], ["Hauptlebensraum", "Planetare Kruste, 2–15 km (regional bis ca. 25 km)"], ["Oberflächenbiosphäre", "Nicht vorausgesetzt"], ["Fraktionszugehörigkeit", "Offen"]],
        zonen: { einheit: "°C", min: -130, max: 60, bereiche: [["Polare Frostgebiete", -125, -95], ["Oberfläche (Mittel)", -95, -55], ["Geothermische Regionen", -30, 10], ["Lebenstiefen der Lithonetzwerke", 0, 60]] },
        zonenText: "Die Oberfläche ist kalt, trocken und weit lebensfeindlicher als die geeigneten Tiefenregionen. Polare Frostgebiete sind dauerhaft gefroren, regionale Staubstürme häufig, Niederschlag selten. Mit der Tiefe steigen Wärme und Flüssigkeitsangebot – Lithonetzwerke meiden dabei Regionen mit zu hohen Temperaturen.",
        rekorde: [["Lebenstiefe", "2–15 km, regional bis ca. 25 km"], ["Größte Lebensformen", "Lithonetzwerke – ganze Gebirge als Lebensraum"], ["Kleinster Mond", "Nemi, ca. 16 km"]],
    },
    kapitel: {
        "Allgemeines": { intro: "Talvek auf einen Blick: leblos an der Oberfläche, lebendig im Gestein.", abschnitte: [
            { titel: "Hauptmerkmale", karten: [{ titel: "Kalte Gesteinswelt", text: "Dunkle Gebirge, eisenhaltige Hochländer und gefrorene Salzebenen." }, { titel: "Leben in der Kruste", text: "Die Biosphäre liegt fast vollständig unter der Oberfläche." }, { titel: "Verborgene Zivilisation", text: "Die sichtbare Besiedlung entspricht nicht der wahren Größe der Zivilisation." }, { titel: "Zwei kleine Monde", text: "Rusk und Nemi." }] },
            { titel: "Einordnung", daten: [["Sternenkarten-ID", "nerath-talvek"], ["Position", "Vierter Hauptplanet"], ["Heimatspezies", "Lithonetzwerke (Gigantische Lebensformen)"], ["Nachbarwelt", "Nerath, Heimat der Synaptoiden"]] }] },
        "Astronomie": { intro: "Der vierte Planet des Terev-Systems.", abschnitte: [
            { titel: "Bahndaten", daten: [["Bahnneigung", "1,6°"], ["Bestehende Umlaufbahn", "unverändert übernommen"]] },
            { titel: "Monde", karten: [{ titel: "Rusk", text: "Kleiner, unregelmäßiger, stark verkraterter Gesteinsmond von etwa 28 km; Umlauf in rund 0,35 Tagen." }, { titel: "Nemi", text: "Kleiner äußerer Mond von etwa 16 km mit dunkler mineralischer Oberfläche; Umlauf in rund 1,4 Tagen." }] }] },
        "Physik": { abschnitte: [{ titel: "Kleiner Gesteinsplanet", text: ["Talvek besteht überwiegend aus Silikaten, Eisenverbindungen und weiteren metallischen Mineralien. Mit 0,78 g ist die Schwerkraft etwas geringer als auf der Erde."] }] },
        "Planetare Struktur": { abschnitte: [{ titel: "Aufbau", text: ["Ein eisenreicher Kern, ein silikatreicher Mantel und eine regional unterschiedlich mächtige Kruste von durchschnittlich 35–70 km bilden den Planeten. Alte Hochländer, umfangreiche Bruchsysteme, mineralreiche Tiefenformationen und regional erhaltene geothermische Wärmequellen prägen die Kruste."], schichten: [["Oberfläche", "Gefroren, trocken, Staubstürme"], ["Lebenszone (2–15 km)", "Lithonetzwerke, Salzlösungen, Bruchzonen"], ["Tiefe Kruste (bis ca. 25 km)", "Regionale Lebenstiefen, hydrothermale Zonen"], ["Untere Kruste", "35–70 km mächtig"], ["Mantel", "Silikatreich"], ["Kern", "Eisenreich"]] }] },
        "Geografie": { intro: "Gebirge, Schluchten und Salzebenen.", abschnitte: [
            { titel: "Landschaften", liste: ["Gewaltige dunkle Gebirge", "Eisenhaltige Hochländer", "Tiefe tektonische Schluchten", "Ausgetrocknete Flussläufe und alte Sedimentbecken", "Gefrorene Salzebenen", "Große Einschlagskrater", "Freiliegende mineralische Schichtformationen", "Unterirdische Kristallhöhlen"] },
            { titel: "Bevorzugte Lebensräume", liste: ["Alte kontinentale Gesteinsformationen und eisenreiche Gebirge", "Unterirdische Salzreservoire", "Hydrothermale Bruchzonen", "Mineralreiche Sedimentschichten", "Geologisch stabile Hochländer und tiefe Gesteinsbecken", "Übergänge zwischen unterschiedlichen Mineralformationen"] },
            { titel: "Ungeeignete Lebensräume", liste: ["Flüssiges Magma und zu heiße Regionen", "Dauerhaft gefrorene Schichten ohne nutzbare Flüssigkeiten", "Chemisch ungeeignete Mineralformationen", "Extrem instabile tektonische Regionen", "Isolierte Schichten ohne Energieversorgung"] }] },
        "Klima": { abschnitte: [{ titel: "Klima", liste: ["Überwiegend kalt und trocken", "Dauerhafte polare Frostgebiete", "Regionale Staubstürme", "Geringe Niederschläge", "Lokale Erwärmung in geothermischen Regionen"] }] },
        "Gewässer": { abschnitte: [{ titel: "Wasser im Untergrund", text: ["Offene Oberflächenmeere gibt es nicht. Wasser findet sich in den Polarregionen, in unterirdischen Eisschichten, porösem Gestein, gefrorenen ehemaligen Becken, tiefen Salzlösungsreservoiren und geothermisch erwärmten Flüssigkeitssystemen. Die unterirdischen Reservoire sind besonders wichtig für die Biosphäre."] }] },
        "Geologie": { abschnitte: [
            { titel: "Alte, stabile Kruste", liste: ["Langfristig stabile Bruchsysteme", "Metallreiche Mineraladern", "Tief liegende Salzlagerstätten", "Hydrothermale Reaktionszonen", "Überreste früherer vulkanischer Aktivität", "Gigantische kristalline Formationen", "Biologisch veränderte Gesteinsbereiche"] },
            { titel: "Einfluss der Lithonetzwerke", text: ["Lithonetzwerke lagern Minerale um, verändern Flüssigkeitsströme, bilden neue Ablagerungen, stabilisieren oder schwächen Gestein und verändern dessen chemische Zusammensetzung. So entstehen biologisch geprägte Tiefenlandschaften – die Plattentektonik des Planeten kontrollieren sie jedoch nicht."] }] },
        "Biosphäre": { intro: "Leben aus chemischer Energie.", abschnitte: [
            { titel: "Tiefenbiosphäre", text: ["Die komplexe Biosphäre liegt nahezu vollständig unter der Oberfläche und basiert überwiegend auf chemischen Energiequellen. Klassische Wälder und tierische Ökosysteme fehlen weitgehend; die spätere Ausarbeitung konzentriert sich auf unterirdische Organismen mit mineralischen und chemischen Lebensgrundlagen."] },
            { titel: "Lebensformen", liste: ["Mineralverarbeitende und mineralisch-biologische Mikroorganismen", "Chemosynthetische Kolonien und Tiefenorganismen", "Salzlösungsbewohnende Kleinstlebewesen", "Kristallbildende Organismen", "Parasitäre mineralische Lebensformen", "Symbiotische Reaktionsorganismen", "Gigantische Lithonetzwerke"] },
            { titel: "Hinweis", text: ["Neben den Lithonetzwerken gibt es keine weiteren intelligenten Spezies."] }] },
        "Spezies": { intro: "Die Lithonetzwerke – Intelligenz im Gestein.", abschnitte: [
            { titel: "Lithonetzwerke", text: ["Die Lithonetzwerke leben in geeigneten Gesteinsformationen verschiedener Tiefen. Die meisten Individuen haben keinen sichtbaren Körperbereich an der Oberfläche; natürliche Körperstrukturen zeigen sich höchstens in tiefen Schluchten und Höhlen."], daten: [["Natürliche Lebenstiefe", "2–15 km"], ["Maximale Lebenstiefe", "ca. 25 km"], ["Lebensraum", "Planetare Kruste"]] },
            { titel: "Außerplanetare Ansiedlung", text: ["Nachkommen können mit technischen Transportsystemen auf geeigneten Planeten angesiedelt werden; ein ausgewachsenes Individuum lässt sich dagegen nicht ohne Weiteres von seinem Heimatgestein trennen. Eine Ansiedlung erfordert umfangreiche geologische Untersuchungen, geeignete Minerale, verfügbare Flüssigkeiten und langfristig nutzbare Energiequellen."] }] },
        "Zivilisation": { abschnitte: [
            { titel: "Was man sieht", liste: ["Geologische Messstationen", "Automatisierte Förderanlagen", "Kommunikationsantennen", "Forschungseinrichtungen", "Transportzugänge und geschützte Wartungsschächte"] },
            { titel: "Was darunter liegt", liste: ["Unterirdische Lebensgebiete", "Geologische Forschungszentren", "Automatisierte Industrieanlagen", "Technische Transportsysteme und planetare Kommunikation", "Geschützte Nachwuchsregionen", "Raumfahrtanlagen für automatisierte Missionen"] }] },
        "Geschichte": { abschnitte: [{ titel: "Zeitleiste", zeitleiste: [["Frühgeschichte", "Wärmer, mit größeren oberflächennahen Wasservorkommen"], ["Abkühlung", "Geeignete Lebensräume verlagern sich in den Untergrund"], ["Gegenwart", "Intelligente Zivilisation der Lithonetzwerke in der Kruste"]] }] },
        "Fraktionen": { abschnitte: [{ titel: "Fraktionen", text: ["Eine verbindliche planetare Großfraktionszugehörigkeit bleibt bis zur weiteren politischen und historischen Ausarbeitung offen."] }] },
        "Rohstoffe": { abschnitte: [{ titel: "Rohstoffe", karten: [{ titel: "Metalle", text: "Eisen, Kupfer, Nickel, Spurenelemente." }, { titel: "Minerale", text: "Magnesiumverbindungen, Silikate, Schwefelverbindungen, Salzlagerstätten." }, { titel: "Kristalle", text: "Funktionelle Kristallminerale." }, { titel: "Biologisch", text: "Biologisch erzeugte Mineralverbünde." }] },
            { titel: "Hinweis", text: ["Seltene APORIA-Rohstoffe werden später mit dem Rohstoffarchiv abgeglichen."] }] },
        "Besonderheiten": { abschnitte: [
            { titel: "Besonderheiten", liste: ["Wirkt bei oberflächlicher Untersuchung leblos", "Ausgedehnte intelligente Zivilisation unter der Oberfläche", "Ein Gebirge kann mehrere eigenständige Lithonetzwerke beherbergen"] },
            { titel: "Im Spiel", liste: ["Tiefenerkundung und unterirdische Missionen", "Geologische Forschung und Bergbau", "Diplomatie mit den Lithonetzwerken", "Lebende mineralische Strukturen erkunden", "Medizinische und technische Reparaturaufgaben", "Vergangene Zivilisationsphasen erforschen"] }] },
        "Medienarchiv": { abschnitte: [] },
    },
};
