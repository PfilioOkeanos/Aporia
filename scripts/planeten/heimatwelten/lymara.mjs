// Lymara · Heimatwelt der Plasmoiden (Quelle: Info_material/…/Plasmoiden, Heimatwelt)
const B = "assets/bilder/Alle Spezies+Übersicht/Biologische Spezies/Plasmoiden/";
const G = B + "gesamtdarstellung/";
export default {
    ordner: "biolumineszente-ozeanwelt-im-all", system: "lymara-system", planetId: "lymara-planet",
    name: "Lymara", genitiv: "Lymaras", klasse: "Ozeanwelt", klasseLang: "Terrestrischer, wasserreicher Planet",
    intro: "Lymara ist die Heimatwelt der Plasmoiden: ein wasserreicher Planet mit Flusslandschaften, Seen, Lagunen, Höhlengewässern und nebelreichen Hochländern, auf dem aus gelbildenden Organismen formbare, denkende Wesen wurden.",
    bildtext: "Lymara – biolumineszente Ozeanwelt",
    kurzprofil: ["Lymara ist ein terrestrischer, wasserreicher Planet im Narev-System. Rund 62 % der Oberfläche sind von Wasser bedeckt, das Klima ist gemäßigt bis warm, die mittlere Temperatur liegt bei etwa 19 °C.", "Komplexe Wasserkreisläufe, Nebelfelder und starke Regenzeiten prägen den Planeten. Hier entwickelten sich die Plasmoiden – Lebewesen aus biologischem Hydrogel, deren Leben ebenso von der Chemie wie von der Menge des Wassers abhängt."],
    spezies: { name: "Plasmoiden", gruppe: "Biologische Spezies", ordner: "Plasmoiden" },
    farben: { nacht: "#040c14", tiefe: "#091726", akzent: "#7ff0e8", sand: "#e8d79a", moos: "#86c9b0", ozean: "#4a8fe0", glas: "rgba(10, 24, 40, .74)", "glas-hell": "rgba(18, 40, 64, .8)", linie: "rgba(140, 220, 235, .17)", "linie-hell": "rgba(150, 232, 245, .36)", text: "#eaf6fa", leise: "#9fb7c2", "aporia-page-tint": "#1f6f8f" },
    werte: {
        temperatur: "ca. 19 °C", temperaturMittel: 19, ozeane: "ca. 62 % der Oberfläche",
        atmosphaere: [["Stickstoff", 77], ["Sauerstoff", 21], ["Wasserdampf", 1.2], ["Argon und Spurengase", 0.8]],
        atmoKurz: "Stickstoff-Sauerstoff, atembar",
        atmoText: "Die Stickstoff-Sauerstoff-Atmosphäre ermöglicht wasserbasiertes Leben und trägt große Feuchtigkeitskreisläufe. Regional entstehen ausgedehnte Nebelfelder; der Wasserdampfanteil ist höher als auf der Erde.",
        druck: "ca. 1,1 bar", druckMittel: 1.1,
        rotationH: 26, rotationText: "ca. 26 h", achsneigung: 18, jahreszeiten: "Ausgeprägte Regen- und Trockenzeiten",
        treibhausText: "Eine Treibhauswirkung von rund 54 K – verstärkt durch viel Wasserdampf – hebt die Temperatur auf etwa 19 °C.",
        magnetfeldFaktor: 0.85,
        extra: [["Wasser/Land", "62 % / 38 %"], ["Bevölkerung", "ca. 1,7 Mrd. Plasmoiden"]],
        vergleichExtra: [["Wasserfläche", 62, 71, "%"]],
        zonen: { einheit: "°C", min: -15, max: 45, bereiche: [["Nebelreiche Hochländer", -5, 16], ["Gemäßigte Flusslandschaften", 10, 26], ["Lagunen und Deltas", 18, 30], ["Kontinentale Trockengebiete", 15, 40], ["Höhlengewässer", 12, 18]] },
        zonenText: "Starke Regenzeiten können kurzfristige Überschwemmungen auslösen, in einzelnen Kontinentalregionen treten regelmäßig Trockenperioden auf.",
        rekorde: [["Größtes Seengebiet", "Konfluenz von Aleth, über 2.000 verbundene Seen"], ["Größtes Höhlengewässer", "Tiefsee von Morr, ca. 9.000 km²"], ["Höchste Nebelfelder", "Hochland von Seyra"], ["Längster Fluss", "Vael, ca. 7.200 km"]],
    },
    bilder: { medien: [["Plasmoiden – Form im Fluss", B + "Designs/Plasmoiden – Form im Fluss.png"], ["Plasmoid", G + "Plasmoiden_design_charactercharacter(5).png"], ["Plasmoid in Rüstung", G + "Plasmoiden_designPirat_charactercharacter(2).png"], ["Plasmoid – Studie", G + "Plasmoiden_design_charactercharacter(11).png"]] },
    kapitel: {
        "Allgemeines": { intro: "Lymara auf einen Blick: Wasser, Nebel und formbares Leben.", abschnitte: [
            { titel: "Hauptmerkmale", karten: [{ titel: "Wasserkreisläufe", text: "Flüsse, Seen und Lagunen verbinden fast alle Regionen." }, { titel: "Nebelhochländer", text: "Ausgedehnte Nebelfelder über den Höhenzügen." }, { titel: "Höhlengewässer", text: "Große unterirdische Seen und Flüsse." }, { titel: "Gelbildendes Leben", text: "Die Plasmoiden bestehen aus biologischem Hydrogel." }] },
            { titel: "Name und Einordnung", text: ["Im Archiv zählt Lymara zu den Ozeanwelten. Sein Stern heißt Narev."] }] },
        "Astronomie": { abschnitte: [
            { titel: "Himmel über Lymara", text: ["Narev erscheint als warmgoldene Scheibe, oft gedämpft durch Nebel. Der helle Mond Ithe und – alle 31 Jahre – der grünlich leuchtende Komet Glimmspur sind feste Bestandteile der Kultur."] },
            { titel: "Zeitrechnung", daten: [["Ortstag", "ca. 26 h"], ["Ortsjahr (lymarisches Jahr)", "310 Erdtage ≈ 286 Ortstage"], ["Amtsperiode im Konfluenzrat", "5 lymarische Jahre"], ["Mondzyklus (Ithe)", "18 Erdtage"]] }] },
        "Physik": { abschnitte: [
            { titel: "Schwerkraft und Gelkörper", text: ["Mit 0,88 g ist die Schwerkraft geringer als auf der Erde. Für die Plasmoiden, deren Körper keine starren Segmente besitzen, erleichtert das Formwechsel und Fortbewegung an Land."] }] },
        "Planetare Struktur": { abschnitte: [
            { titel: "Schalenbau", text: ["Lymara ist ein differenzierter Gesteinsplanet. Silikatgesteine, Tonminerale und wasserreiche Sedimente prägen die Kruste und beeinflussen die Chemie vieler Gewässer."], schichten: [["Kruste", "Silikatgestein mit Tonmineralen und Sedimenten"], ["Oberer Mantel", "Plastisches Gestein"], ["Unterer Mantel", "Dichtes Silikatgestein"], ["Äußerer Kern", "Flüssiges Eisen, Magnetfeld"], ["Innerer Kern", "Fester Eisenkern"]] }] },
        "Geografie": { intro: "Flusslandschaften, Seen, Lagunen und Nebelhochländer.", kopfbild: B + "Designs/Plasmoiden – Form im Fluss.png", abschnitte: [
            { titel: "Landschaften", karten: [{ titel: "Feuchte Ebenen", text: "Weite Niederungen mit vielen Gewässern." }, { titel: "Flussdeltas", text: "Große Mündungsgebiete." }, { titel: "Sedimentgebiete", text: "Mineralreiche Ablagerungen." }, { titel: "Höhlengewässer", text: "Ausgedehnte unterirdische Seen." }, { titel: "Nebelhochländer", text: "Kühle Höhenzüge im Nebel." }, { titel: "Sumpfzonen", text: "Sumpfartige Vegetationsgebiete." }] },
            { titel: "Oberflächenanteile", balken: { werte: [["Ozeane und Meere", 49], ["Seen, Flüsse und Lagunen", 13], ["Feuchte Ebenen und Deltas", 17], ["Hochländer", 12], ["Kontinentale Trockengebiete", 9]] } },
            { titel: "Bedeutende Orte", karten: [{ titel: "Konfluenz von Aleth", text: "Über 2.000 verbundene Seen, Sitz des Konfluenzrats." }, { titel: "Tiefsee von Morr", text: "Größtes Höhlengewässer." }, { titel: "Hochland von Seyra", text: "Region der dichtesten Nebel." }, { titel: "Becken von Tash", text: "Trockengebiet der Großen Trockenperiode." }] }] },
        "Atmosphäre": { abschnitte: [
            { titel: "Wetter", karten: [{ titel: "Nebelfelder", text: "Ausgedehnte Nebel über Hochländern und Seen." }, { titel: "Regenzeiten", text: "Starke Regen mit kurzfristigen Überschwemmungen." }, { titel: "Trockenperioden", text: "Regelmäßig in einzelnen Kontinentalregionen." }, { titel: "Gewitter", text: "Häufige Gewitter über den Feuchtgebieten." }] }] },
        "Klima": { abschnitte: [
            { titel: "Klimaausgleich", text: ["Die Plasmoiden entwickelten zahlreiche kulturelle und technische Maßnahmen, um gefährliche Schwankungen zwischen Regen- und Trockenzeiten auszugleichen – von Speicherbecken bis zu gemeinschaftlich verwaltetem Wasserrecht."] }] },
        "Gewässer": { intro: "Wasser – und seine Chemie – als Lebensgrundlage.", kopfbild: G + "Plasmoiden_design_charactercharacter(3).png", abschnitte: [
            { titel: "Gewässerchemie", text: ["Für Plasmoiden zählt nicht nur die Wassermenge, sondern auch die chemische Zusammensetzung. Zu hohe oder zu niedrige Salzkonzentrationen stören die osmotische Regulation."], liste: ["Verträgliche Ionenkonzentrationen", "Ausreichend gelöster Sauerstoff", "Geeignete Temperaturbereiche", "Verfügbare organische Nährstoffe", "Begrenzte Schadstoffkonzentrationen"] },
            { titel: "Wasserkreislauf", zeitleiste: [["Verdunstung", "Aus Meeren und Seen"], ["Nebel und Wolken", "Über Hochländern und Ebenen"], ["Regenzeiten", "Starke Niederschläge"], ["Flüsse und Seen", "Sammeln und verteilen das Wasser"], ["Höhlengewässer", "Speichern Wasser unterirdisch"]] }] },
        "Geologie": { abschnitte: [
            { titel: "Geologisches Profil", text: ["Silikatgesteine, Tonminerale und wasserreiche Sedimente prägen die Oberfläche. Erosion und Sedimenttransport erzeugen ein weitläufiges Netz aus Flussrinnen und Becken. Diese Bedingungen begünstigten die Entstehung früher gelbildender Organismen."] },
            { titel: "Naturgefahren", liste: ["Anhaltende Trockenperioden", "Chemisch belastete Gewässer", "Plötzliche Salzkonzentrationsänderungen", "Starke Strömungen und Überschwemmungen", "Krankheitserreger und räuberische Organismen", "Instabile Sedimentlandschaften"] }] },
        "Biosphäre": { intro: "Produzenten, Wasserlebewesen und gelbildende Organismen.", abschnitte: [
            { titel: "Lebensformen", text: ["Lymara besitzt eine vielfältige Biosphäre mit pflanzenähnlichen Produzenten, Mikroorganismen, wasserlebenden Tieren und anderen Lebensformen. Die Vorfahren der Plasmoiden konkurrierten mit anderen gelbildenden Organismen um Nährstoffe."] },
            { titel: "Nahrungsnetz", zeitleiste: [["Produzenten", "Pflanzenähnliche Organismen in Wasser und Sumpf"], ["Mikroorganismen", "Grundlage vieler Ketten"], ["Wasserlebewesen", "Konsumenten aller Größen"], ["Gelbildende Organismen", "Bewegliche Nahrungssuche, veränderbare Körper"], ["Räuber", "Auch Plasmoiden sind Teil natürlicher Nahrungsketten"]] },
            { titel: "Lebensräume", karten: [{ titel: "Lagunen", text: "Warme, nährstoffreiche Flachgewässer." }, { titel: "Sümpfe", text: "Dichte Vegetationszonen." }, { titel: "Höhlenseen", text: "Stabile, lichtarme Gewässer." }, { titel: "Nebelwälder", text: "Feuchte Wälder der Hochländer." }] }] },
        "Spezies": { intro: "Die Plasmoiden – Form im Fluss.", kopfbild: G + "Plasmoiden_design_charactercharacter.png", abschnitte: [
            { titel: "Plasmoiden", bild: G + "Plasmoiden_design_charactercharacter(1).png", bildtext: "Plasmoid", text: ["Der Körper der Plasmoiden besteht aus biologischem Hydrogel ohne dauerhaft starre Segmente. Koordinierte Verkürzung und Entspannung verändern Druck und Form; ein Netz aus Transportkanälen bewegt Flüssigkeiten, Nährstoffe und Gase durch den Körper."], verweise: [["Zum Speziesdossier", "inhalte/spezies/Biologische Spezies/Plasmoiden/hauptseite/Spezies.html"]] },
            { titel: "Lebensbedingungen", text: ["Plasmoiden brauchen permanente Feuchtigkeit und chemisch geeignetes Wasser. Außerhalb Lymaras überleben sie nur mit geschlossener Feuchtigkeitsversorgung, Wasseraufbereitung und lebensunterstützenden Transportbehältern."] }] },
        "Zivilisation": { intro: "Städte mit Wasserwegen und Versammlungsbecken.", kopfbild: G + "Plasmoiden_designPirat_charactercharacter.png", abschnitte: [
            { titel: "Bevölkerung", daten: [["Plasmoiden", "ca. 1,7 Milliarden"], ["Siedlungsräume", "Wasserreiche Regionen"], ["Ordnung", "Konfluenzbund mit regionalen Beckenverbänden"]] },
            { titel: "Städte", liste: ["Flache, wasserführende Verkehrswege", "Regulierbare Feuchtigkeitskammern", "Große gemeinschaftliche Versammlungsbecken", "Chemisch kontrollierte Wohnbereiche", "Flüssigkeitsreinigungsanlagen", "Flexible Zugänge für kompakte und ausgedehnte Körperformen"] },
            { titel: "Kunst und Kultur", karten: [{ titel: "Flüssigkeitskunst", text: "Vergängliche Formen, die sich langsam verändern." }, { titel: "Lichtkunst", text: "Kompositionen aus Pigmentierung und Biolumineszenz." }, { titel: "Resonanzmusik", text: "Schwingungen über Gelkörper, Flüssigkeiten und Resonanzflächen." }, { titel: "Bewegungsrituale", text: "Gemeinsame Darstellungen mit koordinierten Körperformen." }] }] },
        "Geschichte": { abschnitte: [
            { titel: "Planetare Frühgeschichte", zeitleiste: [["Entstehung", "Bildung Lymaras vor rund 4,3 Mrd. Jahren"], ["Meere und Sedimente", "Tonminerale prägen die Wasserchemie"], ["Gelbildende Organismen", "Erste formbare Lebensformen"], ["Komplexe Ökosysteme", "Produzenten, Wasserlebewesen, Räuber"]] },
            { titel: "Geschichte der Plasmoiden", zeitleiste: [["Intelligente Gemeinschaften", "Gruppen an stabilen Gewässern"], ["Dauerhafte Siedlungen", "In wasserreichen Regionen"], ["Wasserbau", "Speicher, Kanäle und Becken"], ["Große Trockenperiode", "Vor rund 4.500 Jahren schrumpfen viele Gewässer"], ["Regionale Rechtsordnungen", "Wasserrecht als Grundlage"], ["Technologische Entwicklung", "Industrie und Wissenschaft"], ["Raumfahrt und Erstkontakt", "Interstellare Beziehungen"], ["Konfluenzbund", "Vor rund 110 Jahren gegründet"]] },
            { titel: "Die Große Trockenperiode", text: ["Vor ungefähr 4.500 Erdenjahren traf eine schwere Trockenperiode mehrere dicht besiedelte Regionen. Gewässer schrumpften, Siedlungen wurden aufgegeben, andere bauten umfangreiche Versorgungssysteme. Die Krise prägt das politische Denken bis heute."] }] },
        "Fraktionen": { intro: "Der Konfluenzbund.", kopfbild: G + "Plasmoiden_designPirat_charactercharacter(1).png", abschnitte: [
            { titel: "Konfluenzbund", text: ["Vor etwa 110 Jahren formierte sich aus regionalen Zusammenschlüssen der Konfluenzbund – mit gemeinsamen Grundlagen für Diplomatie, interstellaren Handel und den Schutz biologischer Rechte. Die Regionen behielten bedeutende Selbstverwaltungsrechte."], karten: [{ titel: "Konfluenzrat", text: "Gewählte Vertretungen der Beckenverbände, Amtszeit fünf lymarische Jahre." }, { titel: "Regionale Selbstverwaltung", text: "Beckenverbände regeln ihre eigenen Belange." }, { titel: "Wasserrecht", text: "Essenzielle Wasserressourcen werden gemeinschaftlich verwaltet; Verunreinigung ist strafbar." }] },
            { titel: "Beziehungen zu den großen Fraktionen", daten: [["Konföderation", "Diplomatische Zusammenarbeit"], ["Konsortium", "Interesse an Gelmaterialien, Selbstreparatur und Sensorik; Streit um Patente und Probenentnahme"], ["Protektorat", "Sicherheitskontakte"], ["Synaptorat", "Forschung zu Gelbiologie"], ["Ätherwanderer", "Einzelne Kontakte"]] }] },
        "Rohstoffe": { abschnitte: [
            { titel: "Rohstoffgruppen", karten: [{ titel: "Wasser", text: "Gemeinschaftlich verwaltete Lebensgrundlage." }, { titel: "Gelmaterialien", text: "Biologisch inspirierte Werkstoffe – begehrtes Exportgut." }, { titel: "Tonminerale", text: "Aus den Sedimentgebieten." }, { titel: "Organische Nährstoffe", text: "Aus Landwirtschaft und Gewässern." }] }] },
        "Erforschung": { abschnitte: [
            { titel: "Offene Fragen", liste: ["Wie entstanden die ersten gelbildenden Organismen?", "Was löste die Große Trockenperiode aus?", "Wie weit reichen die Höhlengewässer?", "Woher stammt das Wasser des Schwammsteins?"] }] },
        "Besonderheiten": { abschnitte: [
            { titel: "Einzigartige Welt", liste: ["Lebewesen ohne starre Körperteile", "Wasserrecht als Grundlage der Politik", "Kunst aus vergänglichen Flüssigkeitsformen", "Nebelhochländer und riesige Höhlenseen"] },
            { titel: "Hinweise für Besucher", liste: ["Atembare Luft, feuchtes Klima", "Gewässer nicht verunreinigen – das ist strafbar", "Keine biologischen Proben ohne Genehmigung", "Bei Regenzeiten Überschwemmungen beachten"] }] },
        "Medienarchiv": { abschnitte: [] },
    },
};
