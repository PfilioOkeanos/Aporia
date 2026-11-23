// Nerath · Heimatwelt der Synaptoiden/Tavari (Quellen: Info_material/…/Synaptoiden/05_Heimatwelt/heimatwelt-referenz.md, Version 2.0,
// und SternenSystem/SternenSystem.md, Terev-System Version 1.0). Das Sternsystem ist im Infomaterial vollständig ausgearbeitet;
// ergänzt wurden nur nicht festgelegte Bahnwerte kleiner Monde und Zwergplaneten.
const H = "assets/bilder/Alle Spezies+Übersicht/Mentale Spezies/Synaptoiden/Heimatwelt/";
const G = "assets/bilder/Alle Spezies+Übersicht/Mentale Spezies/Synaptoiden/gesamtdarstellung/";
const B = {
    marschen: H + "Heimatwelt_Synaptoriden-A1.png", abend: H + "Heimatwelt_Synaptoriden-A2.png", sturm: H + "Heimatwelt_Synaptoriden-A3.png",
    varkal: H + "Heimatwelt_Synaptoriden-A4.png", nebel: H + "Heimatwelt_Synaptoriden-A5.png",
};
export default {
    systemseite: "inhalte/himmelskoerper/sternensysteme/details/terev-system/hauptseite/index.html",
    ordner: "turkisfarbene-flachmeerwelt-im-all", system: "nerath-system", planetId: "nerath-planet",
    name: "Nerath", genitiv: "von Nerath", klasse: "Gesteinsplanet", klasseLang: "Gezeitengeprägte Binnenmeer-, Flachwasser- und Feuchtgebietswelt",
    spezies: { name: "Synaptoiden", gruppe: "Mentale Spezies", ordner: "Synaptoiden", seite: "inhalte/spezies/Mentale Spezies/Synaptoiden/hauptseite/Spezies.html" },
    intro: "Nerath ist die Heimatwelt der Synaptoiden – der Tavari. Eine geologisch aktive, langfristig bewohnbare Welt mit zwei großen Kontinenten, zahlreichen Inselgruppen, flachen Binnenmeeren und ausgedehnten Feuchtgebieten, deren Übergänge zwischen Land und Wasser durch Gezeiten ständig verändert werden.",
    bildtext: "Nerath – Binnenmeere, Flachwasser und Inselgruppen",
    kurzprofil: [
        "Nerath umkreist den orangegelben K0-Stern Terev in 0,93 AE Abstand und erhält rund 71,5 % der Strahlungsleistung, die die Erde von der Sonne empfängt. Etwa 58 % der Oberfläche sind mit Wasser bedeckt – Ozeanbecken, flache Binnenmeere, Marschen und zeitweise überflutete Flächen.",
        "Der große Mond Ivera erzeugt rund 2,7-mal so starke Gezeitenkräfte wie der Erdmond. In den dichten, sichtarmen Feuchtgebieten des Silven-Beckens und der Schalenmarschen entstanden die neuronalen Kontaktorgane der Tavari.",
    ],
    farben: { nacht: "#080a09", tiefe: "#0e1513", akzent: "#e3984c", sand: "#d8bf92", moos: "#86a868", ozean: "#3c9a96", glas: "rgba(10, 15, 13, .8)", "glas-hell": "rgba(18, 26, 23, .86)", linie: "rgba(227, 152, 76, .16)", "linie-hell": "rgba(190, 150, 230, .34)", text: "#eef1ec", leise: "#a8b2aa", "aporia-page-tint": "#3a5048" },
    werte: {
        temperatur: "ca. 15 °C", temperaturMittel: 15, ozeane: "ca. 58 % (Ozeane, Binnenmeere, Marschen)",
        atmosphaere: [["Stickstoff", 77.2], ["Sauerstoff", 20.5], ["Argon und weitere Edelgase", 1.8], ["Kohlendioxid", 0.06], ["Weitere Spurengase", 0.44]],
        atmoKurz: "Stickstoff-Sauerstoff, 1,08 bar",
        atmoText: "Nerath besitzt eine stickstoffdominierte Sauerstoffatmosphäre. Wasserdampf tritt abhängig von Temperatur und Wetter zusätzlich auf; die Streuung des Sternenlichts erzeugt bläuliche Tageshimmel und gelblich-orangefarbene Sonnenuntergänge.",
        druck: "ca. 1,08 bar", druckMittel: 1.08, druckDaten: [["Mittlerer Atmosphärendruck", "1,08 bar"], ["Sauerstoffanteil", "20,5 %"], ["Wasserdampf", "regional stark wechselnd"]],
        rotationH: 27, rotationText: "27 h (ca. 312,9 lokale Sonnentage je Jahr)", achsneigung: 18, jahreszeiten: "Saisonale Unterschiede durch 18° Achsneigung; regional starke Monsun- und Niederschlagssysteme",
        treibhausText: "Bei einer vorläufigen Bond-Albedo von 0,20 ergibt sich eine effektive Strahlungstemperatur von ungefähr −31 °C. Die angestrebte globale Mitteltemperatur von 15 °C setzt einen vergleichsweise starken natürlichen Treibhauseffekt voraus, der durch eine spätere Klimasimulation geprüft werden soll.",
        magnetfeldFaktor: 1,
        physikExtra: [["Radius", "ca. 6.563 km (1,03 Erdradien)"], ["Gravitation", "ca. 9,43 m/s²"], ["Mittlere Dichte", "ca. 5,14 g/cm³"], ["Fluchtgeschwindigkeit", "ca. 11,1 km/s"]],
        extra: [["Kontinente", "Eshar, Varethis"], ["Bedeutende Regionen", "Silven-Becken, Schalenmarschen, Varkal-Archipel, Nebelrücken"], ["Mond", "Ivera (Gezeiten ca. 2,7 × Erdmond)"], ["Politische Koordination", "Rat der Becken"]],
        vergleichExtra: [["Wasserbedeckung", 58, 71, "%"], ["Lunare Gezeitenkraft", 2.7, 1, "×"]],
        zonen: { einheit: "°C", min: -30, max: 40, bereiche: [["Subpolare Regionen", -25, 2], ["Gebirgsregionen (Nebelrücken)", -10, 12], ["Kontinentale Binnenregionen (Varethis)", -5, 28], ["Gemäßigte Küstenregionen", 6, 20], ["Feuchtwarme Äquatorialregionen", 22, 32], ["Vulkanische Regionen (Varkal)", 15, 38]] },
        zonenText: "Die Achsneigung von 18° erzeugt saisonale Veränderungen; Breitengrad, Landverteilung und Meeresnähe bestimmen die Unterschiede. Regionale Niederschlags- und Zirkulationssysteme können dennoch stark ausgeprägt sein.",
        rekorde: [["Größter Kontinent", "Eshar (westlich)"], ["Bedeutendstes Ursprungsgebiet", "Silven-Becken"], ["Springtiden", "etwa alle 10,6 Erdtage"], ["Mond Ivera", "ca. 315.000 km, 1.975 km Radius"]],
    },
    bilder: { medien: [["Schalenmarschen unter Ivera", B.marschen], ["Abend über dem Silven-Becken", B.abend], ["Sturm über den Marschen", B.sturm], ["Varkal-Archipel", B.varkal], ["Nebelrücken", B.nebel], ["Synaptoid in den Marschen", G + "SynaptoidA6.png"], ["Synaptoid an der Küste", G + "SynaptoidA14.png"]] },
    kapitel: {
        "Allgemeines": { intro: "Nerath auf einen Blick: Gezeiten, Binnenmeere und Feuchtgebiete.", kopfbild: B.marschen, abschnitte: [
            { titel: "Planetare Identität", daten: [["Sternsystem", "Terev"], ["Position", "Dritter Planet"], ["Planetentyp", "Terrestrischer Gesteinsplanet"], ["Grundcharakter", "Gezeitengeprägte Binnenmeer-, Flachwasser- und Feuchtgebietswelt"], ["Bewohnbarkeit", "Sauerstoffhaltige Atmosphäre, ausgedehnte Flüssigwasservorkommen und komplexe Biosphäre"]] },
            { titel: "Hauptmerkmale", karten: [{ titel: "Zwei Kontinente", text: "Das westliche Eshar und das hochlandreiche Varethis." }, { titel: "Silven-Becken", text: "Flache Binnenmeere – Ursprungsgebiet der Tavari." }, { titel: "Starker Mond", text: "Ivera prägt Gezeiten, Finsternisse und Kalender." }, { titel: "Aktive Geologie", text: "Plattentektonik und Vulkanismus im Varkal-Archipel." }] }] },
        "Astronomie": { intro: "Eine Gezeitenwelt im Terev-System.", kopfbild: B.abend, abschnitte: [
            { titel: "Zeitrechnung", daten: [["Rotationsdauer", "27 Erdstunden"], ["Jahr", "352 Erdtage ≈ 312,9 lokale Sonnentage"], ["Mondzyklus Ivera", "20 Tage (Phasenzyklus 21,2 Tage)"], ["Springtiden", "etwa alle 10,6 Erdtage"], ["Urakan-Opposition", "etwa alle 390 Erdtage"]] },
            { titel: "Finsternisse", text: ["Da Ivera am Himmel relativ groß erscheint, sind vollständige Sonnenfinsternisse möglich – die „Dunklen Tage“. In geeigneten Regionen wird dann die Korona Terevs sichtbar. Mondfinsternisse entstehen, wenn Ivera durch den Schatten Neraths zieht."] },
            { titel: "Am Himmel", text: ["Von Nerath aus erscheint Terev als heller Stern mit etwas wärmerem Licht als die Sonne. Die Atmosphäre streut das Licht zu bläulichen Tageshimmeln und gelblich-orangefarbenen Sonnenuntergängen. Wiederkehrende Silven-Meteore entstehen beim Durchqueren von Kometenstaubströmen."] }] },
        "Physik": { abschnitte: [
            { titel: "Erdähnliche Grundwerte", text: ["Mit 1,02 Erdmassen, rund 9,43 m/s² Gravitation und einer mittleren Dichte von 5,14 g/cm³ entsprechen die physikalischen Grundwerte ungefähr einer erdähnlichen Gesteinswelt. Ein aktiver planetarer Dynamo erzeugt das Magnetfeld; in polaren Regionen entstehen Polarlichter – die „Terev-Lichter“."] }] },
        "Planetare Struktur": { abschnitte: [
            { titel: "Schalenbau", text: ["Nerath entstand vor ungefähr 5,4 Milliarden Jahren. Schwere metallische Materialien sanken in den Kern, silikatische Materialien bildeten Mantel und Kruste. Ein großer Einschlag in der Frühzeit gilt als wahrscheinlicher Ursprung des Mondes Ivera."], schichten: [["Kruste", "Kontinentale und ozeanische Bereiche"], ["Mantel", "Silikatgestein, das über geologische Zeiträume plastisch fließt"], ["Äußerer Kern", "Teilweise flüssig, elektrisch leitfähig – Ursprung des Magnetfelds"], ["Innerer Kern", "Vorwiegend metallisch, sehr hoher Druck"]] }] },
        "Geografie": { intro: "Eshar, Varethis und die großen Wasserlandschaften.", kopfbild: B.marschen, abschnitte: [
            { titel: "Kontinente", karten: [
                { titel: "Eshar", text: "Größere westliche Landmasse mit Küstenebenen, Flussdeltas und Feuchtgebieten; älteste Siedlungen auf Uferterrassen." },
                { titel: "Varethis", text: "Hochländer, alte Gebirge, vulkanische Plateaus und trockenere Binnenregionen." }] },
            { titel: "Bedeutende Regionen", daten: [["Silven-Becken", "Flache Binnenmeere mit Meerengen und Inselgruppen"], ["Schalenmarschen", "Weiche Ufer, verzweigte Wasserläufe, dichte Vegetation"], ["Varkal-Archipel", "Vulkanische Inseln, hydrothermale Quellen"], ["Nebelrücken", "Gebirgskette mit Nebelwäldern und Steigungsregen"]] },
            { titel: "Varkal-Archipel", bild: B.varkal, bildtext: "Varkal-Archipel", text: ["Die Inseln des Varkal-Archipels besitzen unterschiedliche Entwicklungsstadien: Einige zeigen aktive vulkanische Landschaften, andere sind stärker verwittert, mit fruchtbaren Böden, dichter Vegetation und hydrothermalen Quellen."] }] },
        "Atmosphäre": { kopfbild: B.abend, abschnitte: [
            { titel: "Strahlungsbilanz", text: ["Nerath erhält ungefähr 71,5 % der Strahlungsleistung der Erde. Die gegenwärtigen Klimawerte sind ein physikalisch begründeter Arbeitsansatz und noch kein vollständig validiertes Klimamodell."] }] },
        "Klima": { kopfbild: B.sturm, abschnitte: [
            { titel: "Wetter und Naturereignisse", karten: [{ titel: "Große Springtiden", text: "Etwa zweimal pro Mondphasenzyklus." }, { titel: "Schalenfluten", text: "Hohe Tide, Sturm und Küstenform treffen zusammen." }, { titel: "Nebelwanderungen", text: "Saisonale Nebelbänke mit eingeschränkter Sicht." }, { titel: "Rote Wasser", text: "Massenvermehrung von Mikroorganismen." }, { titel: "Aschensommer", text: "Folgen großer Vulkanausbrüche." }, { titel: "Magnetische Sturmnächte", text: "Polarlichter und technische Störungen." }] },
            { titel: "Nebelrücken", bild: B.nebel, bildtext: "Nebelrücken", text: ["Feuchte Luftmassen steigen an den Hängen der Nebelrücken auf, kühlen ab und bilden Wolken, intensive Niederschläge und häufigen Nebel. An tieferen Hängen wachsen feuchtigkeitsliebende Wälder."] }] },
        "Gewässer": { abschnitte: [
            { titel: "Wasserverteilung", liste: ["Größere Ozeanbecken", "Flache Binnenmeere", "Küstengewässer und Seen", "Flussnetze und Süßwassermarschen", "Brackwasserlandschaften", "Zeitweise überflutete Flächen"] },
            { titel: "Gezeiten", text: ["Ivera erzeugt einen Gezeitenbeitrag von etwa dem 2,7-Fachen des Erdmondes. Flache und trichterförmige Küsten entwickeln große Gezeitenunterschiede, andere Regionen deutlich schwächere. Die Springtiden sind ein wichtiger Bestandteil der traditionellen Tavari-Kalender."] }] },
        "Geologie": { kopfbild: B.varkal, abschnitte: [
            { titel: "Tektonik und Vulkanismus", text: ["Mehrere große tektonische Platten führen zu Gebirgsbildung, Vulkanismus, Erdbeben und langfristigen Veränderungen der Meeresbecken. Untermeerische Beben können Tsunamis auslösen; über Jahrhunderte bis Jahrmillionen wandern ganze Binnenmeere."] },
            { titel: "Planetare Gefahren", liste: ["Wasserstandsschwankungen, Stürme und Überflutungen", "Vulkanausbrüche", "Erdbeben und Tsunamis", "Biologische Krankheiten", "Extreme Wetterbedingungen"] }] },
        "Biosphäre": { intro: "Tiefrote, braune und dunkelgrüne Pflanzen im warmen Licht Terevs.", kopfbild: B.nebel, abschnitte: [
            { titel: "Feuchtlandflora", text: ["Viele Pflanzenanaloge besitzen dunkelgrüne, braune oder tiefrote Pigmentkombinationen, angepasst an das Spektrum von Terev."], liste: ["Schilfartige Großgewächse", "Schwimmende Vegetationsmatten", "Verzahnte Wurzelgeflechte", "Salzverträgliche Küstenpflanzen", "Unterwasserpflanzen"] },
            { titel: "Fauna", karten: [{ titel: "Rinnenjäger", text: "Größere räuberische Ufertiere." }, { titel: "Trosskrabbler", text: "Kleine bis mittelgroße Sedimentbewohner." }, { titel: "Schimmersegler", text: "Gleit- oder flugfähige Tiere der Feuchtgebiete." }, { titel: "Schalenfilterer", text: "Aquatische Filterorganismen." }, { titel: "Tiefenschlucker", text: "Räuber der tiefen Binnenmeerbecken." }] }] },
        "Spezies": { intro: "Die Synaptoiden – Individuen, die ihre Nervensysteme verbinden können.", abschnitte: [
            { titel: "Synaptoiden (Tavari)", bild: G + "SynaptoidA7.png", bildtext: "Zwei Tavari im Kontakt", text: ["Die Synaptoiden sind eine biologische, nicht humanoide Spezies mit sichelförmigem Körper, vier Laufgliedmaßen und zwei Manipulatoren. Mit ihren Kontaktfächern verbinden sie ausgewählte Teile ihrer Nervensysteme – ohne Schwarmbewusstsein und ohne Telepathie. Sie stammen aus amphibischen Tiergruppen der flachen Küstenlandschaften."], verweise: [["Zum Speziesdossier", "inhalte/spezies/Mentale Spezies/Synaptoiden/hauptseite/Spezies.html"]] }] },
        "Zivilisation": { kopfbild: B.marschen, abschnitte: [
            { titel: "Städte und Architektur", text: ["Die großen Tavari-Städte sind an die örtlichen Wasserbedingungen angepasst: erhöhte Wohnbereiche, Wasserstraßen, Flutschutzanlagen, Kontaktzentren, Forschungseinrichtungen und große Archive. Einige historische Städte sind heute überflutet, andere wurden auf höher gelegene Terrassen verlegt."] },
            { titel: "Energieversorgung", liste: ["Sonnenenergie", "Windenergie", "Wasserkraft", "Gezeitenenergie", "Geothermie", "Industrielle Reaktortechnologien"] }] },
        "Geschichte": { abschnitte: [
            { titel: "Historische Regionen", text: ["Besonders wichtige archäologische Gebiete liegen in ehemaligen Küstenregionen. Viele frühe Siedlungen wurden von Sedimenten bedeckt oder durch Flussverlagerungen aufgegeben – ihre Entdeckung kann neue Informationen über die Geschichte der Tavari liefern."] }] },
        "Fraktionen": { abschnitte: [
            { titel: "Beziehungen", text: ["Die Tavari sind eine eigenständige Zivilisation ohne automatische Zugehörigkeit zum Synaptorat. Der Rat der Becken koordiniert überregionale Fragen; Beziehungen bestehen zu Konföderation, Konsortium, Protektorat, Synaptorat und Ätherwanderern."] }] },
        "Rohstoffe": { abschnitte: [
            { titel: "Rohstoffe", karten: [{ titel: "Biologisch", text: "Kulturpflanzen, aquatische Nahrung, Fasern, medizinische Naturstoffe." }, { titel: "Mineralisch", text: "Eisen- und Kupfererze, aluminiumhaltige Minerale, Salze, Phosphate." }, { titel: "Baustoffe", text: "Silikatische Baustoffe und technisch relevante Spurenelemente." }] }] },
        "Erforschung": { abschnitte: [
            { titel: "Forschungsstandort", liste: ["Ozeanografie und Gezeitenphysik", "Plattentektonik und Klimawissenschaft", "Feuchtgebietsökologie", "Neuroevolution und Neurobiologie", "Archäologie", "Katastrophenschutz", "Planetare Astrophysik"] }] },
        "Besonderheiten": { abschnitte: [
            { titel: "Einzigartige Welt", liste: ["Gezeitenwelt mit 2,7-fach stärkerem Mond", "Wandernde Binnenmeere und überflutete Siedlungen", "Tiefrote Vegetation im warmen Terev-Licht", "Ursprung neuronal kontaktfähiger Lebewesen"] },
            { titel: "Hinweise für Besucher", liste: ["Gezeiten- und Springtidenkalender beachten", "Schalenfluten und Nebelwanderungen meiden", "Kontaktetikette der Tavari respektieren", "Vulkanzonen im Varkal-Archipel nur mit Führung"] }] },
        "Medienarchiv": { abschnitte: [] },
    },
};
