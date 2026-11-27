// Veshkara · Heimatwelt der Chitinoiden (Quelle: Info_material/…/Chitinnoiden, 4. Heimatwelt V2.1)
const B = "assets/bilder/Alle Spezies+Übersicht/Biologische Spezies/Chitinnoiden/";
const G = B + "gesamtdarstellung/", E = B + "entwicklungsstadien/";
export default {
    ordner: "veshkara", system: "veshkara-system", planetId: "veshkara-planet",
    name: "Veshkara", genitiv: "Veshkaras", klasse: "Gesteinsplanet", klasseLang: "Terrestrischer Planet mit Ozeanen und Kontinenten",
    intro: "Veshkara ist die Heimatwelt der Chitinoiden: ein terrestrischer Planet mit Ozeanen, den Kontinenten Sereth und Vaul, großen Flusssystemen, Küstendeltas und Wurzelwäldern, in denen sich gepanzerte, vielgliedrige Wesen zu einer technischen Zivilisation entwickelten.",
    bildtext: "Veshkara – tiefblauer Ozeanplanet unter weißen Wolken",
    kurzprofil: ["Veshkara umkreist den Stern Khelar in 0,78 AE Abstand und erhält damit fast genau so viel Licht wie die Erde. Rund 57 % der Oberfläche sind von offenen Meeren bedeckt, die mittlere Temperatur liegt bei etwa 18 °C, die Luft enthält 22,4 % Sauerstoff.", "Die Chitinoiden entstanden in Feuchtgebieten mit großflächigen Wurzelsystemen. Die unregelmäßigen Oberflächen begünstigten stabile Gliedmaßen und feine mechanische Sinne – heute leben drei biologische Entwicklungsformen gemeinsam auf dem ganzen Planeten."],
    spezies: { name: "Chitinoiden", gruppe: "Biologische Spezies", ordner: "Chitinnoiden" },
    farben: { nacht: "#060b0e", tiefe: "#0d171c", akzent: "#7fd0ff", sand: "#e7b96a", moos: "#8fbf7a", ozean: "#3f86c8", glas: "rgba(12, 24, 30, .74)", "glas-hell": "rgba(22, 40, 50, .8)", linie: "rgba(150, 205, 235, .17)", "linie-hell": "rgba(165, 215, 245, .36)", text: "#edf4f8", leise: "#a3b5bf", "aporia-page-tint": "#2a6a8f" },
    werte: {
        temperatur: "ca. 18 °C", temperaturMittel: 18, ozeane: "ca. 57 % offene Meere",
        atmosphaere: [["Stickstoff", 76.3], ["Sauerstoff", 22.4], ["Argon", 1.1], ["CO₂ und Spurengase", 0.2]],
        atmoKurz: "Stickstoff-Sauerstoff mit erhöhtem Sauerstoffanteil",
        atmoText: "Die trockene Atmosphäre enthält 76,3 % Stickstoff, 22,4 % Sauerstoff, 1,1 % Argon und Spuren von Kohlendioxid. Der erhöhte Sauerstoffanteil unterstützt den Stoffwechsel größerer Organismen. Ob sie für fremde Spezies verträglich ist, muss trotzdem einzeln geprüft werden.",
        druck: "ca. 1,16 bar", druckMittel: 1.16,
        rotationH: 26, rotationText: "ca. 26 h", achsneigung: 17, jahreszeiten: "Regelmäßige Jahreszeiten, in gemäßigten Gebieten deutlich",
        treibhausText: "Eine erdähnliche Treibhauswirkung von rund 37 K hebt die mittlere Temperatur auf etwa 18 °C.",
        magnetfeldFaktor: 0.85,
        extra: [["Wasser/Land", "57 % / 43 %"], ["Sauerstoffanteil", "22,4 %"], ["Kontinente", "Sereth, Vaul und kleinere Landmassen"], ["Bevölkerung", "ca. 2,9 Mrd. Chitinoiden"]],
        vergleichExtra: [["Sauerstoffanteil", 22.4, 20.9, "%"]],
        zonen: { einheit: "°C", min: -35, max: 45, bereiche: [["Polare Regionen", -30, -2], ["Hochländer", -8, 18], ["Gemäßigte Landschaften", 4, 26], ["Trockengebiete", 12, 42], ["Feuchtwarme Tiefländer", 22, 34]] },
        zonenText: "Regionale Klimaunterschiede entstehen durch Höhenlage, Meeresnähe und die atmosphärische Zirkulation.",
        rekorde: [["Größter Kontinent", "Sereth"], ["Größtes Delta", "Mündung des Vaurh auf Vaul"], ["Größter Wurzelwald", "Wurzelwälder von Ithkar"], ["Höchstes Gebirge", "Kammgebirge von Sereth, ca. 9.800 m"]],
    },
    bilder: { medien: [["Chitinoiden von Veshkara – Sumpfkolonie und Anatomie", G + "Chitinoiden von Veshkara_ Sumpfkolonie und Anatomie-2.png"], ["Weltenarchiv der Chitinoiden", B + "Design/APORIA Weltenarchiv_ Chitinoiden.png"], ["Entwicklungsformen", E + "Chitinnoiden_design_charactercharacter.png"], ["Junge Chitinoiden", E + "Chitinnoiden_design_cute_character.png"]] },
    kapitel: {
        "Allgemeines": { intro: "Veshkara auf einen Blick: Meere, Deltas und Wurzelwälder.", abschnitte: [
            { titel: "Hauptmerkmale", karten: [{ titel: "Zwei Kontinente", text: "Sereth und Vaul mit Gebirgen, Flussebenen und Hochländern." }, { titel: "Küstendeltas", text: "Weitläufige Mündungsgebiete großer Flüsse." }, { titel: "Wurzelwälder", text: "Wälder aus Säulenwurzlern – Ursprung der Chitinoiden." }, { titel: "Sauerstoffreiche Luft", text: "22,4 % Sauerstoff begünstigen große Organismen." }] },
            { titel: "Name und Einordnung", text: ["Veshkara und Khelar sind Entwurfsnamen. Der Planet zählt im Archiv zu den Gesteinsplaneten."] }] },
        "Astronomie": { abschnitte: [
            { titel: "Himmel über Veshkara", text: ["Khelar erscheint etwas kleiner und wärmer im Farbton als die Sonne von der Erde. Der große Mond Rhaum zieht in 29 Tagen über den Himmel; alle 34 Jahre kehrt der dunkle Panzerkomet zurück."] },
            { titel: "Zeitrechnung", daten: [["Ortstag", "ca. 26 h"], ["Ortsjahr", "276 Erdtage ≈ 255 Ortstage"], ["Mondmonat (Rhaum)", "29 Erdtage"], ["Jahreszeiten", "Vier deutliche Jahreszeiten in gemäßigten Breiten"]] }] },
        "Physik": { abschnitte: [
            { titel: "Schwerkraft und Körperbau", text: ["Mit rund 92 % der Erdschwere (9,0 m/s²) tragen die horizontal gebauten, vielgliedrigen Körper der Chitinoiden ihr Panzerkleid leicht. Der höhere Sauerstoffanteil unterstützt große Körper mit hohem Energiebedarf."] }] },
        "Planetare Struktur": { abschnitte: [
            { titel: "Schalenbau", text: ["Veshkara ist ein erdähnlicher Gesteinsplanet mit aktiver Tektonik, die Gebirge und Küstenbecken formt."], schichten: [["Kruste", "Kontinental 28–40 km, ozeanisch 6–8 km"], ["Oberer Mantel", "Plattentektonik"], ["Unterer Mantel", "Silikatgestein"], ["Äußerer Kern", "Flüssiges Eisen-Nickel"], ["Innerer Kern", "Fester Eisen-Nickel-Kern"]] }] },
        "Geografie": { intro: "Sereth, Vaul, Inseln und Deltas.", kopfbild: G + "Chitinnoiden im Sumpfdelta-1.png", abschnitte: [
            { titel: "Kontinente", karten: [{ titel: "Sereth", text: "Größter Kontinent mit dem Kammgebirge und weiten Flussebenen." }, { titel: "Vaul", text: "Zweiter großer Kontinent mit Deltas und trockenen Binnenregionen." }, { titel: "Inselgruppen", text: "Kleinere Inseln und Kontinentalfragmente." }] },
            { titel: "Landschaften", karten: [{ titel: "Gebirge", text: "Junge Faltengebirge an Plattengrenzen." }, { titel: "Flussebenen", text: "Fruchtbare Auen großer Ströme." }, { titel: "Küstenbecken", text: "Geschützte Buchten und Lagunen." }, { titel: "Hochländer", text: "Kühlere Plateaus mit großen Temperaturschwankungen." }, { titel: "Trockene Binnenregionen", text: "Steppen und Halbwüsten im Kontinentinneren." }, { titel: "Wurzelwälder", text: "Feuchtwälder mit tragenden Wurzelsystemen." }] },
            { titel: "Oberflächenanteile", balken: { werte: [["Offene Meere", 57], ["Tiefland und Deltas", 15], ["Wälder und Hügelland", 12], ["Hochländer und Gebirge", 9], ["Trockengebiete", 7]] } }] },
        "Atmosphäre": { abschnitte: [
            { titel: "Wetter", karten: [{ titel: "Küstenstürme", text: "Starke Stürme an den Deltaküsten." }, { titel: "Monsunregen", text: "Saisonale Niederschläge füllen die Flüsse." }, { titel: "Überschwemmungen", text: "Gezeiten und Hochwasser wirken zusammen." }, { titel: "Dürren", text: "Regional in den Binnenregionen." }] }] },
        "Klima": { abschnitte: [
            { titel: "Klimazonen", karten: [{ titel: "Feuchtwarme Tiefländer", text: "Große Wasserläufe und ausgedehnte Pflanzenbestände." }, { titel: "Gemäßigte Landschaften", text: "Wechselnde Jahreszeiten und regionale Niederschläge." }, { titel: "Hochländer", text: "Kühlere Nächte und größere Schwankungen." }, { titel: "Trockengebiete", text: "Weniger Vegetation, lange Trockenzeiten." }, { titel: "Polare Regionen", text: "Niedrige Temperaturen, saisonales Eis." }] }] },
        "Gewässer": { intro: "Meere, Ströme und Deltas.", kopfbild: G + "Chitinoiden im sumpfigen Wurzeldorf-3.png", abschnitte: [
            { titel: "Wasserverteilung", text: ["Rund 57 % der Oberfläche sind von offenen Meeren bedeckt. Große Flusssysteme tragen Wasser und Sedimente an die Küsten, viele Mündungen bilden weitläufige Deltas."] },
            { titel: "Gezeiten und Fluten", text: ["Rhaums Gezeiten und saisonale Überschwemmungen wirken an den Küsten zusammen. Städte stehen deshalb auf erhöhten Plattformen; Wasserbauanlagen regulieren das Hochwasser."] },
            { titel: "Wasserrecht", text: ["Wasserrechte waren in der Geschichte häufiger Streitpunkt und sind bis heute ein zentrales Thema des Bundes der Strombecken."] }] },
        "Geologie": { abschnitte: [
            { titel: "Naturgefahren", liste: ["Überschwemmungen", "Küstenstürme", "Uferabbrüche", "Sedimentverlagerungen", "Regionale Dürren", "Tektonische Ereignisse", "Krankheitserreger in belasteten Gewässern"] },
            { titel: "Folgen der Zivilisation", text: ["Staudämme und Flussumleitungen verändern die Sedimentversorgung anderer Regionen, Industrie belastet Wasser und Boden. Umweltschutz und Ressourcenverwaltung sind deshalb wichtige politische Themen."] }] },
        "Biosphäre": { intro: "Wurzelwälder, Deltas und gepanzerte Tiere.", abschnitte: [
            { titel: "Pflanzenwelt", karten: [{ titel: "Säulenwurzler", text: "Große Pflanzen mit tragenden Wurzelsystemen – sie bilden die Wurzelwälder." }, { titel: "Fächerrohr", text: "Faserreiches Gewächs der Uferbereiche." }, { titel: "Harzkelch", text: "Liefert organische Harze für Technik und Kultur." }] },
            { titel: "Tierwelt", karten: [{ titel: "Schlammfiltrierer", text: "Kleine Organismen, die Partikel aus Wasser und Sediment filtern." }, { titel: "Wurzelgleiter", text: "Tiere mit spezialisierten Haftorganen." }, { titel: "Plattenräuber", text: "Gepanzerte Beutegreifer mittlerer Größe." }, { titel: "Flussweider", text: "Große Pflanzenfresser der Ufer." }] },
            { titel: "Mikroorganismen", text: ["Mikroorganismen zersetzen, treiben Nährstoffkreisläufe an und beeinflussen die Sedimentbildung; manche leben in Symbiose, andere verursachen Krankheiten. Die Chitinoiden betreiben deshalb umfangreiche Hygiene- und Umweltforschung."] }] },
        "Spezies": { intro: "Die Chitinoiden – drei Entwicklungsformen, eine Spezies.", kopfbild: G + "Chitinoiden von Veshkara_ Sumpfkolonie und Anatomie-2.png", abschnitte: [
            { titel: "Chitinoiden", bild: E + "Chitinnoiden_design_character.png", bildtext: "Chitinoid", text: ["Die Chitinoiden sind intelligente, gepanzerte Wesen mit stabilen Gliedmaßen und feinen mechanischen Sinnesorganen. Ihre Körper sind horizontal gebaut; Verkehrswege und Gebäude sind darauf ausgelegt."], verweise: [["Zum Speziesdossier", "inhalte/spezies/Biologische Spezies/Chitinnoiden/hauptseite/Spezies.html"]] },
            { titel: "Entwicklungsformen", karten: [{ titel: "Basalformen", text: "Kräftige Gliedmaßen für unebene Oberflächen; Wurzelwälder, Deltas, Felslandschaften." }, { titel: "Übergangsformen", text: "Vielseitig beweglich; Flussauen, Hügelland, Küsten." }, { titel: "Hochdifferenzierte Formen", text: "Erleichtern den Umgang mit komplexer Technik; in Städten stark vertreten." }] },
            { titel: "Zusammenleben", text: ["Alle drei Formen können in denselben Gesellschaften leben. Die biologische Entwicklung beeinflusst den Körperbau, nicht aber Bildung, Beruf oder politischen Status. Die gemeinsame Anerkennung als eine Spezies ist Grundlage moderner Gesellschaften."] }] },
        "Zivilisation": { intro: "Städte auf Plattformen an Flüssen und Küsten.", kopfbild: G + "Chitinoiden im sumpfigen Wurzeldorf-3.png", abschnitte: [
            { titel: "Bevölkerung", daten: [["Chitinoiden", "ca. 2,9 Milliarden"], ["Größte Siedlungen", "An Flüssen und geschützten Küsten"], ["Staaten", "Mehrere, 17 Gebiete im Bund der Strombecken"]], balken: { werte: [["Hochdifferenzierte Formen", 46], ["Übergangsformen", 33], ["Basalformen", 21]] } },
            { titel: "Städte", text: ["Gebäude stehen auf tragfähigen Fundamenten oder erhöhten Plattformen, Wasserbauanlagen regulieren Überschwemmungen. Verkehrswege berücksichtigen horizontale Körperformen; gemischte Gemeinschaften nutzen unterschiedliche Türbreiten, Rampen und Arbeitsplätze."] },
            { titel: "Kunst und Kultur", liste: ["Reliefstrukturen und geometrische Muster", "Kunst aus Harzmaterialien", "Mechanisch bewegte Werke", "Klangskulpturen, die Töne und Schwingungen zugleich erzeugen", "Architektur als Ausdrucksform"] }] },
        "Geschichte": { abschnitte: [
            { titel: "Planetare Frühgeschichte", zeitleiste: [["Entstehung", "Bildung Veshkaras vor rund 4,7 Mrd. Jahren"], ["Ozeane und Kontinente", "Bildung von Sereth und Vaul"], ["Sauerstoffanreicherung", "Photosynthese verändert die Atmosphäre"], ["Wurzelwälder", "Feuchtwälder an Küsten und Deltas"]] },
            { titel: "Geschichte der Chitinoiden", zeitleiste: [["Vorzeitliche Evolution", "Entstehung der Entwicklungsformen"], ["Früher Werkzeuggebrauch", "Erste Werkzeuge und Gemeinschaften"], ["Symbolische Aufzeichnungen", "Erste Schrift"], ["Frühe Zivilisationen", "Größere Siedlungen an Flüssen"], ["Wasserwirtschaft", "Dämme, Kanäle und Deltabauten"], ["Konflikte", "Streit um Wasserrechte, Land und Handelswege"], ["Größere Staaten", "Vorläufer des Bundes der Strombecken"], ["Industrialisierung", "Technik und Erforschung der eigenen Evolution"], ["Raumfahrt und Erstkontakt", "Interstellare Beziehungen"], ["Verfassungsreformen", "Heutige politische Ordnung"]] }] },
        "Fraktionen": { abschnitte: [
            { titel: "Bund der Strombecken", text: ["Der Bund besteht aus 17 regionalen Mitgliedsgebieten und koordiniert Infrastruktur, Wirtschaft und überregionale Sicherheit. Die Mitglieder behalten eigene Zuständigkeiten; nicht alle Staaten Veshkaras gehören dazu."], karten: [{ titel: "Volksvertretung", text: "Gewählte Vertretung der Mitgliedsgebiete." }, { titel: "Regierung", text: "Führt die gemeinsamen Aufgaben aus." }, { titel: "Beteiligung der Entwicklungsformen", text: "Sichert gleiche politische Rechte aller Körperformen." }, { titel: "Wasserrechte", text: "Regeln Nutzung und Schutz von Flüssen und Deltas." }] },
            { titel: "Beziehungen zu den großen Fraktionen", daten: [["Konföderation", "Diplomatische Zusammenarbeit"], ["Konsortium", "Handel mit Werkstoffen und Industrieprodukten, teils umstritten"], ["Protektorat", "Sicherheitskontakte"], ["Synaptorat", "Forschungsinteresse"], ["Ätherwanderer", "Einzelne Kontakte"]] }] },
        "Rohstoffe": { abschnitte: [
            { titel: "Rohstoffvorkommen", karten: [{ titel: "Pflanzenfasern", text: "Aus Fächerrohr und Wurzelwäldern." }, { titel: "Organische Harze", text: "Aus dem Harzkelch, für Technik und Kunst." }, { titel: "Erze", text: "Eisen- und kupferhaltige Lagerstätten." }, { titel: "Sedimente", text: "Tonminerale, Silikate, Karbonate, Phosphate." }, { titel: "Biologische Verbundstoffe", text: "Natürlich erzeugte Werkstoffe." }] }] },
        "Erforschung": { abschnitte: [
            { titel: "Offene Fragen", liste: ["Wie entstanden die drei Entwicklungsformen?", "Welche Arten leben noch unentdeckt in den Wurzelwäldern?", "Was formte die Adern des Wurzelsteins?", "Wie wirken Staudämme langfristig auf die Deltas?"] }] },
        "Besonderheiten": { abschnitte: [
            { titel: "Einzigartige Welt", liste: ["Drei biologische Entwicklungsformen in einer Spezies", "Städte auf Plattformen in Deltas", "Klangskulpturen aus Harz und Panzermaterial", "Sauerstoffreiche Luft für große Organismen"] },
            { titel: "Hinweise für Besucher", liste: ["Atembare, sauerstoffreiche Luft – Verträglichkeit trotzdem prüfen", "Hochwasserwarnungen beachten", "Wurzelwälder nur auf ausgewiesenen Wegen", "Belastete Gewässer meiden"] }] },
        "Medienarchiv": { abschnitte: [] },
    },
};
