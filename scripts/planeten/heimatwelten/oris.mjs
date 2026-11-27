// Oris · Heimatwelt der Gravanten (Quelle: Info_material/…/Gigantische Lebensformen/Gravanten/05_Heimatwelt/heimatwelt-referenz.md
// und Sternensystem/Sternensystem.md) – Mond Nalvyrs: 1.520 km, 0,65 Mondmassen, Umlauf 19,9 Tage (297.706 km) wie in der Sternenkarte; Albedo 0,13
export default {
    ordner: "monde/oris", system: "nalvyr-system", planetId: "nalvyr-oris", kapitelErgaenzen: true,
    systemseite: "inhalte/himmelskoerper/sternensysteme/details/saelon-system/hauptseite/index.html",
    name: "Oris", genitiv: "von Oris", klasse: "Terrestrischer Mond", globusKlasse: "Organisch geprägte Mondwelt",
    klasseLang: "Terrestrischer Mond · biologisch aktive Niedriggravitationswelt",
    spezies: { name: "Gravanten", gruppe: "Gigantische Lebensformen", ordner: "Gravanten" },
    intro: "Oris – die Welt der wandernden Giganten. Auf diesem kleinen Mond Nalvyrs beträgt die Schwerkraft nur 14 % der irdischen. Über tausende Kilometer lange Steppen ziehen die Gravanten: intelligente, vier- bis sechsbeinige Riesen von 100 bis 300 Metern Länge, getragen von mineralisch-organischen Skeletten.",
    bildtext: "Oris – Welt der wandernden Giganten",
    kurzprofil: [
        "Oris ist ein terrestrischer Mond von 3.040 Kilometern Durchmesser und etwa 0,65 Erdmondmassen. Er umläuft Nalvyr in 297.706 km Abstand alle 19,9 Tage und zeigt ihm stets dieselbe Seite; ein Sonnentag dauert rund 21,5 Erdtage. Auf der zugewandten Seite steht Nalvyr als gewaltiger Himmelskörper am Himmel.",
        "Eine biologisch aktive Stickstoff-Sauerstoff-Atmosphäre von 0,8 bar reicht wegen der geringen Schwerkraft weit hinauf. Geologische und biologische Gasnachlieferung sowie ein atmosphärenstabilisierender APORIA-Effekt in den äußeren Schichten gleichen Verluste aus. 75 % der Oberfläche sind Land; die mittlere Temperatur liegt bei etwa 6 °C.",
    ],
    farben: { nacht: "#060906", tiefe: "#0e140d", akzent: "#d8c27a", sand: "#d9c9a0", moos: "#9cc47a", ozean: "#4f86a6", glas: "rgba(14, 20, 13, .8)", "glas-hell": "rgba(24, 32, 22, .86)", linie: "rgba(216, 194, 122, .16)", "linie-hell": "rgba(220, 210, 150, .36)", text: "#f1f2e8", leise: "#b0b49c", "aporia-page-tint": "#4f5a28" },
    werte: {
        temperatur: "ca. 6 °C", temperaturMittel: 6, ozeane: "ca. 25 % Gewässer und permanente Eisflächen",
        atmosphaere: [["Stickstoff", 74], ["Sauerstoff", 23], ["Argon", 2], ["Weitere Gase", 0.8], ["Kohlendioxid", 0.2]],
        atmoKurz: "Stickstoff-Sauerstoff, ca. 0,8 bar, weit ausgedehnt",
        atmoText: "Oris besitzt eine biologisch aktive Stickstoff-Sauerstoff-Atmosphäre mit etwa 0,8 bar: 74 % Stickstoff, 23 % Sauerstoff, 2 % Argon, rund 0,2 % Kohlendioxid und 0,8 % weitere Gase, dazu wechselnder Wasserdampf. Wegen der geringen Schwerkraft reicht sie sehr weit hinauf. Die geringe Fluchtgeschwindigkeit führt zu langfristigen Verlusten, die durch geologische und biologische Nachlieferung und einen zusätzlichen APORIA-Effekt in den äußeren Schichten ausgeglichen werden – dessen Herkunft wird noch erforscht.",
        druck: "ca. 0,8 bar", druckMittel: 0.8,
        rotationH: 477.6, rotationText: "19,9 Erdtage (gebunden; Sonnentag ca. 21,5 Erdtage)", achsneigung: 0, jahreszeiten: "Lange Tag- und Nachtphasen statt ausgeprägter Jahreszeiten",
        treibhausText: "Die Atmosphäre hebt die mittlere Temperatur von rund −7 °C (Gleichgewicht) auf etwa 6 °C; Wärmespeicherung und Luftströmungen dämpfen die Gegensätze zwischen langem Tag und langer Nacht.",
        magnetfeldFaktor: 0.1,
        physikExtra: [["Masse in Erdmondmassen", "ca. 0,65"], ["Masse in Kilogramm", "ca. 4,78 · 10²² kg"], ["Gesamtoberfläche", "ca. 29 Mio. km²"]],
        extra: [["Beiname", "Welt der wandernden Giganten"], ["Archiv-ID", "AP-6944D04CBF"], ["Rotation", "Gebunden an Nalvyr"], ["Landmassen", "Drei große zusammenhängende"], ["Fraktionszugehörigkeit", "Noch nicht festgelegt"]],
        vergleichExtra: [["Landfläche", 75, 29, "%"]],
        zonen: { einheit: "°C", min: -40, max: 30, bereiche: [["Polar- und Hochregionen", -35, -5], ["Nachtseite der Ebenen", -10, 5], ["Gemäßigte Regionen", 5, 25]] },
        zonenText: "Während des langen Sonnentages erwärmen sich die Ebenen lange, in der langen Nacht kühlen sie deutlich ab. Wandernde Wettersysteme ziehen über die Steppen, bodennahe Nebelfelder sind häufig, regional gibt es Frostperioden. Niederschlag fällt als Regen, Nebelkondensation und regionaler Schnee.",
        rekorde: [["Schwerkraft", "nur 0,14 g"], ["Größte Lebensformen", "Gravanten, 100–300 m Körperlänge"], ["Lebensdauer der Gravanten", "ca. 1.500–3.500 Jahre"]],
        umbenennen: { "Rotationsperiode": "Rotation (gebunden)" },
    },
    kapitel: {
        "Allgemeines": { intro: "Oris auf einen Blick: leichter Mond, weite Steppen, wandernde Riesen.", abschnitte: [
            { titel: "Hauptmerkmale", karten: [{ titel: "Niedrige Schwerkraft", text: "0,14 g – ideale Bedingungen für gigantische Landlebewesen." }, { titel: "Endlose Steppen", text: "Tausende Kilometer lange Wanderlandschaften." }, { titel: "Stabilisierte Atmosphäre", text: "0,8 bar, weit ausgedehnt, mit APORIA-Effekt." }, { titel: "Nalvyr am Himmel", text: "Der Mutterplanet beherrscht die zugewandte Seite." }] },
            { titel: "Einordnung", daten: [["Sternenkarten-ID", "nalvyr-oris"], ["Mutterplanet", "Nalvyr, Heimat der Regeneranten"], ["Himmelskörpertyp", "Terrestrischer Mond"], ["Heimatspezies", "Gravanten (Gigantische Lebensformen)"]] }] },
        "Astronomie": { intro: "Ein Mond mit eigener Zivilisation.", abschnitte: [
            { titel: "Bahn um Nalvyr", daten: [["Exzentrizität der Mondbahn", "0,03"], ["Bahnneigung", "2,2°"], ["Gebundene Rotation", "Ja – gegenüber Nalvyr"]] },
            { titel: "Am Himmel von Oris", text: ["Auf der Nalvyr zugewandten Seite füllt der Mutterplanet einen großen Teil des Himmels. Mit der Umlaufbewegung ändert sich die Beleuchtung regelmäßig, und gelegentlich verfinstert Nalvyr die Sonne Saelon. Im Spiegelbecken spiegelt sich Nalvyr auf der Wasseroberfläche."] }] },
        "Physik": { abschnitte: [{ titel: "Kleiner, leichter Mond", text: ["Mit einer Fallbeschleunigung von nur 1,38 m/s², einer mittleren Dichte von etwa 3,25 g/cm³ und einer Fluchtgeschwindigkeit von rund 2,05 km/s bietet Oris außergewöhnlich günstige mechanische Bedingungen für gigantische terrestrische Lebensformen."] }] },
        "Planetare Struktur": { abschnitte: [{ titel: "Aufbau", text: ["Die überwiegend silikatische Kruste mit eisen- und magnesiumhaltigen Formationen bildet weiträumige, stabile Gesteinsplatten. Regionale geothermische Aktivität und Entgasung aus tieferen Schichten liefern Gase nach; langfristig wirkt Nalvyrs Gezeitenkraft auf das Innere."], schichten: [["Atmosphäre", "0,8 bar, weit ausgedehnt"], ["Kruste", "Silikatisch, stabile Platten, Sedimentbecken"], ["Mantel", "Gesteinsmantel mit regionaler Wärme"], ["Kern", "Klein"]] }] },
        "Geografie": { intro: "Steppen, Hochebenen und flache Binnenmeere.", abschnitte: [
            { titel: "Oberfläche", balken: { werte: [["Land", 75], ["Gewässer und Eis", 25]] }, liste: ["Drei große zusammenhängende Landmassen", "Gewaltige mineralreiche Hochebenen", "Tausende Kilometer lange Steppen", "Vegetationsreiche Senken und flache Binnenmeere", "Breite Flusslandschaften und Wanderkorridore", "Gigantische alte Einschlagsbecken", "Landschaften mit geringer Hangneigung, Gesteinsbögen und Schluchten"] },
            { titel: "Besondere Regionen", karten: [
                { titel: "Die Ewigen Wanderfelder", text: "Steppen mit über Jahrtausende entstandenen Wanderrouten und regenerierenden Vegetationsmatten." },
                { titel: "Die Tragenden Ebenen", text: "Kompakte, besonders tragfähige Gesteinsschichten – Ruhe- und Versammlungsgebiete." },
                { titel: "Das Spiegelbecken", text: "Flaches Binnenmeer mit mineralreicher Ufervegetation, in dem sich Nalvyr spiegelt." },
                { titel: "Die Alten Knochenfelder", text: "Ablagerungsgebiete verstorbener Gravanten – mineralisierte Skelettbögen als neue Lebensräume und Fundstätten." },
                { titel: "Die Nebelterrassen", text: "Stufenförmiges, feuchtes Hochland – Lebensraum jüngerer Gravanten." },
                { titel: "Die Tiefenbrüche", text: "Spaltensysteme mit hydrothermalen Quellen – gefährlich für besonders große Individuen." }] }] },
        "Gewässer": { abschnitte: [{ titel: "Gewässer", liste: ["Mehrere große Binnenmeere und flache mineralreiche Seen", "Weitverzweigte Flüsse und breite Feuchtgebiete", "Unterirdische Reservoire und geothermale Quellen", "Dauerhafte polare Eisvorkommen", "Geringere Druckzunahme in der Tiefe als auf der Erde", "Wasserstände schwanken durch Klima und Gezeiten"] }] },
        "Geologie": { abschnitte: [{ titel: "Gesteine", liste: ["Überwiegend silikatische Kruste", "Eisen- und magnesiumhaltige Formationen", "Mineralreiche Sedimentbecken", "Überreste früher Einschläge", "Regionale geothermische Aktivität und Entgasung", "Mineralien für den Aufbau biologischer Skelette", "Erosion durch Wind, Wasser und biologische Aktivität"] }] },
        "Biosphäre": { intro: "Leichte Pflanzen, schwere Wanderer.", abschnitte: [
            { titel: "Biosphäre", text: ["Die eigenständig entstandene, kohlenstoffbasierte Biosphäre ist in den gemäßigten Regionen sehr produktiv. Pflanzen sind leicht und flexibel, an geringe Schwerkraft und lange Hell- und Dunkelphasen angepasst und speichern tagsüber Energie. Beanspruchte Vegetationsflächen regenerieren sich schnell."] },
            { titel: "Flora", karten: [{ titel: "Tragwurzelgewächse", text: "Verzweigte Verankerungen stabilisieren den Boden der Wanderrouten." }, { titel: "Flächengräser", text: "Dichte Decken, die nach dem Abweiden schnell nachwachsen." }, { titel: "Membranbäume", text: "Hohe, leichte Pflanzen mit großen photosynthetischen Membranen." }, { titel: "Mineralpolster", text: "Mineralstoffreiche Nahrung für den Skelettaufbau der Gravanten." }, { titel: "Leuchtsenkenflora", text: "Biolumineszent in feuchten Senken während der langen Nacht." }] },
            { titel: "Fauna", liste: ["Kleinere und mittelgroße Landtiere", "Großdimensionierte Pflanzenfresser", "Flugorganismen mit außergewöhnlichen Spannweiten", "Begleitorganismen auf den Körpern der Gravanten", "Aasfresser und Zersetzer in den Knochenfeldern", "Raubtiere für kleinere und junge Großlebewesen – gesunde erwachsene Gravanten haben keine natürlichen Feinde"] }] },
        "Spezies": { intro: "Die Gravanten – die wandernden Giganten.", abschnitte: [
            { titel: "Gravanten", text: ["Die Gravanten entstanden natürlich auf Oris. Sie tragen ihre gewaltigen Körper auf vier bis sechs Beinen und mineralisch-organischen Skelettstrukturen, ernähren sich überwiegend von Pflanzen und Mikroorganismen und folgen ausgedehnten Wanderrouten. Wegen ihres hohen Ressourcenbedarfs leben sie in geringer Dichte und organisieren sich dezentral."], daten: [["Körperlänge", "100–300 m"], ["Beine", "Vier bis sechs"], ["Lebensdauer", "ca. 1.500–3.500 Jahre"], ["Bewusstsein", "Individuell, eigenständig"]] }] },
        "Zivilisation": { abschnitte: [
            { titel: "Offene Landschaften statt Städte", text: ["Für ausgewachsene Gravanten gibt es keine dicht bebauten Großstädte. Ihre Zivilisation besteht aus offenen Versammlungslandschaften, natürlichen und künstlichen Ruheformationen und mechanisch stabilisierten Wanderwegen; Infrastruktur konzentriert sich auf ausgewählte Bereiche."] },
            { titel: "Einrichtungen und Technologien", liste: ["Großdimensionierte medizinische Einrichtungen und Stützsysteme", "Seismische Kommunikationsmasten und Schwingungsübersetzer", "Forschungsstationen für biologische Statik", "Adaptive Tragwerksbrücken und Bodenstabilisierung", "Biomechanische Gelenkorthesen und Mehrbeinfahrwerke", "Biologische Verbundwerkstoffdrucker", "Kontaktanlagen und kleine Siedlungen für Besucher"] }] },
        "Geschichte": { abschnitte: [{ titel: "Zeitleiste", zeitleiste: [["Entstehung", "Bildung des Mondes während der Entwicklung Nalvyrs"], ["Kreisläufe", "Geologische und atmosphärische Kreisläufe, erste Mikroben"], ["Evolution", "Photosynthese, mehrzellige Landlebewesen, immer größere Körper, adaptive Skelette"], ["Intelligenz", "Individuelle Intelligenz und Wanderkultur der Gravanten"], ["Technik", "Biomechanische Technologien"], ["Gegenwart", "Kontakt mit anderen Spezies, Beziehungen zu Nalvyr"]] }] },
        "Fraktionen": { abschnitte: [{ titel: "Politik", liste: ["Dezentrale Selbstverwaltung", "Schutz natürlicher Wanderrouten", "Politisch unabhängig von Nalvyr", "Mögliche Forschungsabkommen mit den Regeneranten", "Regulierung außerplanetarer Infrastruktur", "Fraktionszugehörigkeit noch nicht festgelegt"] }] },
        "Rohstoffe": { abschnitte: [{ titel: "Rohstoffe", karten: [{ titel: "Gesteine und Minerale", text: "Silikate, Eisen-, Magnesium- und Calciumminerale, Phosphate, Sedimente." }, { titel: "Biologisch", text: "Verbundmaterialien, organische Fasern, elastische Materialien." }, { titel: "Wasser", text: "Wassereis." }] }] },
        "Erforschung": { abschnitte: [{ titel: "Forschungsfelder", liste: ["Biologische Statik gigantischer Organismen", "Niedriggravitationsbiologie", "Atmosphärenerhaltung kleiner Himmelskörper und der APORIA-Effekt von Oris", "Regenerative Skelettmedizin", "Hochbelastbare organische Verbundwerkstoffe", "Seismische Kommunikation", "Ökologische Wirkung großer Wanderer"] }] },
        "Besonderheiten": { abschnitte: [
            { titel: "Einzigartige Welt", liste: ["Nur 14 % der Erdgravitation", "Intelligente Landlebewesen bis 300 m Länge", "Gigantische natürliche Skelettformationen", "Lange Hell- und Dunkelphasen", "Gewaltiger Mutterplanet am Himmel", "Ungewöhnlich ausgedehnte, stabilisierte Atmosphäre"] },
            { titel: "Im Spiel", liste: ["Begegnungen mit wandernden Gravanten", "Kilometerlange Wanderkorridore und Versammlungsplätze", "Expeditionen zu den Alten Knochenfeldern", "Mineralreiche Tiefenbrüche erkunden"] }] },
        "Medienarchiv": { abschnitte: [] },
    },
};
