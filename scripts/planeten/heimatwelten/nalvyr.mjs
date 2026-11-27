// Nalvyr · Heimatwelt der Regeneranten (Quelle: Info_material/…/Regeneranten/05_Heimatwelt/heimatwelt-referenz.md, Dossier 4.0)
// Ergänzt: übrige Körper des Saelon-Systems (Weißer Zwerg Saelon B, Doppelplanet, Ringriese …) und Teshra als kleiner Zweitmond.
const G = "assets/bilder/Alle Spezies+Übersicht/Biologische Spezies/Regeneranten/gesamtdarstellung/";
const E = "assets/bilder/Alle Spezies+Übersicht/Biologische Spezies/Regeneranten/entwicklungsstadien/";
export default {
    systemseite: "inhalte/himmelskoerper/sternensysteme/details/saelon-system/hauptseite/index.html",
    ordner: "nalvyr", system: "nalvyr-system", planetId: "nalvyr-planet",
    name: "Nalvyr", genitiv: "von Nalvyr", klasse: "Gesteinsplanet", klasseLang: "Alte, biologisch vielfältige terrestrische Welt",
    spezies: { name: "Regeneranten", gruppe: "Biologische Spezies", ordner: "Regeneranten", seite: "inhalte/spezies/Biologische Spezies/Regeneranten/hauptseite/Spezies.html" },
    intro: "Nalvyr ist die Heimatwelt der Regeneranten – der Narethi. Eine alte, biologisch vielfältige Welt mit zwei großen Kontinenten, dem Tessal-Archipel, großen Flussdeltas und Gezeitenküsten, in denen sich zahlreiche Tierlinien mit erstaunlichen Regenerationsfähigkeiten entwickelten.",
    bildtext: "Nalvyr – Meere, Schelfgebiete und Kontinente",
    kurzprofil: [
        "Nalvyr umkreist den alten K2-Stern Saelon in 0,76 AE Abstand und erhält rund 95 % der Einstrahlung der Erde. Mit 43 % Landfläche besitzt der Planet ausgeprägte kontinentale Klimazonen – von feuchten Küstenwäldern über Grasländer bis zu trockenen Hochländern und kalten Hochbreiten.",
        "Eine Besonderheit der Biosphäre sind mehrere Tierlinien mit unterschiedlichen Regenerationsfähigkeiten. Aus einer sechsstrahligen Linie gingen vor rund zwei Millionen Jahren die intelligenten Narethi hervor.",
    ],
    farben: { nacht: "#070a09", tiefe: "#0d1513", akzent: "#d68b52", sand: "#d7b98a", moos: "#7fa874", ozean: "#3e8a86", glas: "rgba(10, 16, 14, .78)", "glas-hell": "rgba(18, 28, 25, .84)", linie: "rgba(214, 139, 82, .16)", "linie-hell": "rgba(226, 160, 108, .36)", text: "#eef1ec", leise: "#a9b3ab", "aporia-page-tint": "#3f5a48" },
    werte: {
        temperatur: "ca. 15 °C", temperaturMittel: 15, ozeane: "ca. 57 % (Nemor- und Kaleth-Becken)",
        atmosphaere: [["Stickstoff", 79.5], ["Sauerstoff", 19.5], ["Argon", 0.94], ["Kohlendioxid", 0.05], ["Weitere Spurengase", 0.01]],
        atmoKurz: "Stickstoff-Sauerstoff, 1,05 bar",
        atmoText: "Die Atmosphäre ist stickstoffdominiert; der Sauerstoffpartialdruck liegt mit rund 0,205 bar im irdischen Vergleichsbereich. Für die Regeneranten ist sie geeignet – andere Spezies müssen biologische Aerosole, lokale Giftstoffe und unbekannte organische Partikel gesondert prüfen.",
        druck: "ca. 1,05 bar", druckMittel: 1.05, druckDaten: [["Mittlerer Oberflächendruck", "ca. 1,05 bar"], ["Sauerstoffpartialdruck", "ca. 0,205 bar"], ["Tropopause", "8–11 km (polar) bis 14–17 km (tropisch)"]],
        rotationH: 26, rotationText: "26 h (siderisch ca. 25,9 h)", achsneigung: 18, jahreszeiten: "Vier Jahresabschnitte zu je etwa 61,7 lokalen Tagen; in den Tropen Regen- und Trockenzeiten",
        treibhausText: "Bei einer Bond-Albedo von rund 0,29 liegt die effektive Strahlungstemperatur bei etwa 253 K; der Wärmehaushalt von Atmosphäre und Oberfläche hebt die Mitteltemperatur um rund 35 K auf etwa 288 K (15 °C).",
        magnetfeldFaktor: 0.7,
        physikExtra: [["Radius im Vergleich", "0,98 Erdradien"], ["Magnetfeld", "ca. 25–45 Mikrotesla"], ["Höchste Erhebung", "ca. 7,6 km"]],
        extra: [["Landfläche", "ca. 43 % (Vaelor, Ishkar, Tessal-Archipel)"], ["Bevölkerung", "ca. 1,2 Milliarden Narethi"], ["Politische Koordination", "Nalvyr-Konvent"], ["Begleitstern am Himmel", "Saelon B (Weißer Zwerg)"]],
        vergleichExtra: [["Landfläche", 43, 29, "%"], ["Gezeitenhub in Trichterbuchten", 9, 16, "m"]],
        zonen: { einheit: "°C", min: -30, max: 40, bereiche: [["Hohe Breiten und Kältesteppen", -25, 0], ["Gebirgsregionen", -15, 8], ["Trockene Hochländer (Dovar)", 2, 24], ["Gemäßigte Küsten und Wälder", 8, 20], ["Graslandschaften", 10, 26], ["Tropische Küsten", 22, 32]] },
        zonenText: "Der große Landanteil erzeugt ausgeprägte kontinentale Klimazonen: Vaelor ist feuchter und waldreicher, Ishkar trockener und kontinentaler. Ozeane gleichen die Küstenregionen aus.",
        rekorde: [["Größter Kontinent", "Vaelor, ca. 101 Mio. km²"], ["Höchste Erhebung", "ca. 7,6 km"], ["Größter Gezeitenhub", "6–9 m in Trichterbuchten"], ["Größte Stadt", "Lethar, ca. 11 Millionen Einwohner"]],
    },
    bilder: { medien: [["Sechsbeiniger Narethi im Kupferlicht", G + "Sechsbeiniger Narethi im Kupferlicht-6.png"], ["Narethi-Kartograf im vermessenen Höhlensaal", G + "Narethi-Kartograf im vermessenen Höhlensaal-5.png"], ["Sechsbeiniger Narethi durchquert die Salzdünen", G + "Sechsbeiniger Narethi durchquert die Salzdünen-10.png"], ["Moosgrüne Wanderin im Farnnebel", E + "Moosgrüne Wanderin im Farnnebel-4.png"], ["Sechsbeiniger Narethi über der Felsspalte", E + "Sechsbeiniger Narethi-Regenerant über der Felsspalte-2.png"], ["Kupferner Sechsbeiner über schwarzem Wasser", E + "Kupferner Sechsbeiner über schwarzem Wasser-5.png"]] },
    kapitel: {
        "Allgemeines": { intro: "Nalvyr auf einen Blick: Deltas, Gezeiten und regenerative Tierlinien.", abschnitte: [
            { titel: "Hauptmerkmale", karten: [{ titel: "Zwei Kontinente", text: "Das feuchte Vaelor und das trockenere Ishkar." }, { titel: "Tessal-Archipel", text: "Inselwelt mit Lagunen, Gezeitenwäldern und Vulkanen." }, { titel: "Regenerative Biosphäre", text: "Viele Tierlinien können Gewebe wiederherstellen." }, { titel: "Alte Welt", text: "Rund 6 Milliarden Jahre alt, um einen alten K-Stern." }] }] },
        "Astronomie": { intro: "Eine Welt um den alten Stern Saelon – mit einem Weißen Zwerg am Himmel.", abschnitte: [
            { titel: "Zeitrechnung", daten: [["Mittlerer Sonnentag", "26 Erdstunden"], ["Jahr", "267,24 Erdtage ≈ 246,68 lokale Tage"], ["Jahresabschnitt", "ca. 61,7 lokale Tage"], ["Mondzyklus Oris", "19,9 Tage (synodisch 21,5 Tage)"], ["Umlauf von Saelon B", "rund 2.000 Jahre"]] },
            { titel: "Der weiße Begleiter", text: ["Saelon B, ein Weißer Zwerg in rund 180 AE Abstand, erscheint am Himmel Nalvyrs als heller, elfenbeinfarbener Stern. Er ist der Rest eines einst massereicheren Sterns, dessen Riesenphase das junge System mit schweren Elementen anreicherte – eine Ursache für den Metallreichtum des Saumgürtels."] },
            { titel: "Gezeiten", text: ["Oris und Saelon erzeugen halbtägige Gezeiten mit etwa 13,7 Stunden zwischen zwei Hochwassern. Gewöhnlich steigt das Wasser um 1–3 Meter, in Trichterbuchten um 6–9 Meter. Diese wechselnden Belastungen prägten die Evolution regenerativer Tierlinien."] }] },
        "Physik": { abschnitte: [
            { titel: "Etwas geringere Schwerkraft", text: ["Mit rund 0,92 g ist die Schwerkraft etwas schwächer als auf der Erde. Das verringert die mechanische Belastung von Organismen – für den flachen, sechsstrahligen Körper der Narethi mit 70–200 kg ein Vorteil beim Klettern und auf schwierigem Gelände."] }] },
        "Planetare Struktur": { abschnitte: [
            { titel: "Schalenbau", text: ["Nalvyr ist differenziert aufgebaut. Sieben größere Platten – Vaelor-, Ishkar-, Nemor-, Kaleth-, Tessal-, Sirak- und Dovanplatte – sowie Mikroplatten bewegen die Kruste."], schichten: [["Kruste", "Tektonische Platten und Mikroplatten"], ["Mantel", "Mächtige Silikatschicht mit Wärme- und Stofftransport"], ["Äußerer Kern", "Elektrisch leitfähig, erzeugt das Magnetfeld"], ["Innerer Kern", "Dicht, überwiegend metallisch"]] }] },
        "Geografie": { intro: "Vaelor, Ishkar und das Tessal-Archipel.", abschnitte: [
            { titel: "Landgebiete", karten: [
                { titel: "Vaelor (101 Mio. km²)", text: "Küstenwälder, Flussdeltas, gemäßigte Wälder, Vulkanküsten; Stadt Lethar." },
                { titel: "Ishkar (89 Mio. km²)", text: "Flussebenen, Grasländer, Plateaus, Riftzonen, Kältesteppen; Stadt Darsen." },
                { titel: "Tessal-Archipel", text: "Vulkanische und alte erodierte Inseln mit Lagunen und Gezeitenwäldern." },
                { titel: "Kleinere Landmassen", text: "Zusammen rund 20,6 Mio. km²." }] },
            { titel: "Bedeutende Regionen", daten: [["Elarin-Delta", "Flussarme, Feuchtwälder, Gezeitenzonen – Fossilien regenerativer Tierlinien"], ["Velar-Waldgürtel", "Feuchte Wälder mit dunklen Fächerbäumen"], ["Kethrin-Vulkangürtel", "Basaltküsten und geothermische Gebiete"], ["Sarn-Einzugsgebiet", "Fluss- und Binnenlandschaften Ishkars"], ["Dovar-Hochland", "Trockenes Hochland mit Salzsenken"], ["Sareth-Riftsystem", "Gedehnte Senken, Felswände, saisonale Seen"], ["Ishkar-Kältesteppen", "Kalte Gras- und Felslandschaften"]] }] },
        "Atmosphäre": { abschnitte: [
            { titel: "Wolken und Nebel", text: ["Über feuchten Küsten, Wäldern und Meeren entstehen Schicht- und Quellwolken, in großer Höhe dünne Eiswolken, bei starker Konvektion mächtige Gewittertürme. Morgennebel ist in Tälern, Wäldern und an Küsten häufig – aber kein weltweit dauerhaftes Merkmal."] }] },
        "Klima": { abschnitte: [
            { titel: "Wetter", karten: [{ titel: "Kaleth-Wirbel", text: "Tropische Wirbelstürme im warmen Kaleth-Becken." }, { titel: "Ishkar-Staubfronten", text: "Staubstürme in trockenen Binnenregionen." }, { titel: "Tessal-Sturmfluten", text: "Wind, Tiefdruck und Gezeiten überlagern sich gefährlich." }, { titel: "Gewitter", text: "Starke Konvektion über Kontinenten." }, { titel: "Gebirgswinde", text: "Fall- und Höhenwinde." }, { titel: "Starkregen", text: "Saisonale Starkregenereignisse." }] }] },
        "Gewässer": { abschnitte: [
            { titel: "Ozeane und Flüsse", text: ["Zwei große Ozeanbecken prägen den Planeten: das Nemor-Becken mit nährstoffreichen Auftriebszonen und das warme Kaleth-Becken mit wichtigen Handelsrouten. Der mittlere Salzgehalt beträgt etwa 3,2 %. An Land sind Elarin- und Sarn-Flusssystem die bedeutendsten Wasserläufe, dazu Binnenmeere, Seen, Sümpfe, Lagunen und Grundwassersysteme."] }] },
        "Geologie": { abschnitte: [
            { titel: "Tektonik und Vulkanismus", text: ["Die sieben großen Platten erzeugen Gebirge, Tiefseegräben, Vulkan- und Erdbebenzonen sowie Riftgebiete. Der Kethrin-Vulkangürtel gehört zu den aktivsten Regionen; die höchste bekannte Erhebung erreicht etwa 7,6 km."] },
            { titel: "Naturgefahren", liste: ["Tropische Wirbelstürme", "Sturmfluten im Tessal-Archipel", "Staubstürme auf Ishkar", "Erdbeben und Vulkanausbrüche", "Saisonale Überschwemmungen"] }] },
        "Biosphäre": { intro: "Eine Biosphäre voller Regeneration – und ihrer Kosten.", abschnitte: [
            { titel: "Evolution", zeitleiste: [["vor ca. 6,05 Mrd. Jahren", "Entstehung Nalvyrs"], ["vor ca. 3,5 Mrd. Jahren", "Älteste biologische Spuren"], ["vor ca. 900 Mio. Jahren", "Komplexere mehrzellige Organismen"], ["vor ca. 240 Mio. Jahren", "Wichtige sechsstrahlige Tierlinien"], ["vor ca. 2 Mio. Jahren", "Anatomisch moderne Narethi"]] },
            { titel: "Flora", karten: [{ titel: "Velar-Fächerbäume", text: "12–35 m hohe Waldorganismen mit flexiblen Assimilationsflächen." }, { titel: "Rysal-Schilf", text: "2–5 m hoch, stabilisiert Fluss- und Küstensedimente." }, { titel: "Tamaru-Wurzelstöcke", text: "Trockenheitsangepasst, mit unterirdischen Wasserreserven." }, { titel: "Salaris-Saumgras", text: "Grasähnliche Flächen, Nahrung für Pflanzenfresser." }, { titel: "Oris-Kelptürme", text: "Marine Organismen bis etwa 20 m Länge." }, { titel: "Ishkar-Krustenmatten", text: "Bodenstabilisierende Lebensgemeinschaften." }] },
            { titel: "Fauna", karten: [{ titel: "Kelariden", text: "Sechsstrahlige Küstenläufer – Vergleichsorganismen für die Evolution der Narethi." }, { titel: "Tavrik", text: "Räuberische Fels- und Küstenbewohner, 1,5–2,8 m." }, { titel: "Harsik", text: "Große Pflanzenfresser der Ebenen, 3–5 m." }, { titel: "Nemor-Kammschweber", text: "Marine Filtrierer bis 6 m." }, { titel: "Sarn-Spaltenläufer", text: "Allesfresser trockener Felslandschaften." }, { titel: "Tessal-Schwebegleiter", text: "Gleitende Tiere der Inselwälder." }] },
            { titel: "Kosten der Regeneration", text: ["Regeneration braucht zusätzliche Energie und Baustoffe. Nicht jede Tierlinie entwickelte deshalb maximale Regenerationsfähigkeit – Gezeitengebiete, Wälder, Trockenräume und Gebirge förderten jeweils andere Lösungen."] }] },
        "Spezies": { intro: "Die Regeneranten – sechs Glieder, erstaunliche Heilung.", abschnitte: [
            { titel: "Regeneranten (Narethi)", bild: G + "Sechsbeiniger Narethi im Kupferlicht-6.png", bildtext: "Narethi", text: ["Die Regeneranten sind eine intelligente, sechsstrahlige Spezies mit flachem Kranzkörper, sechs Extremitäten, einem ringförmigen Gehirn und zwölf optischen Sinnesfeldern. Sie können Gliedmaßen, Organe, Sinnesorgane und teilweise Nervengewebe wiederherstellen – begrenzt durch Zeit, Energie und Baustoffe."], verweise: [["Zum Speziesdossier", "inhalte/spezies/Biologische Spezies/Regeneranten/hauptseite/Spezies.html"]] },
            { titel: "Bevölkerung", daten: [["Narethi auf Nalvyr", "ca. 1,2 Milliarden"], ["Außerhalb der Heimatwelt", "ca. 28 Millionen"], ["Städtisch lebend", "ca. 62 %"]] }] },
        "Zivilisation": { intro: "Städte der Medizin und Wissenschaft.", abschnitte: [
            { titel: "Städte", karten: [{ titel: "Lethar (Vaelor)", text: "Ca. 11 Millionen Einwohner; medizinische Forschung, Handel, Institut für Gewebearchitektur." }, { titel: "Darsen (Ishkar)", text: "Ca. 7 Millionen Einwohner; neurologische Forschung, Ringneurozentrum." }, { titel: "Tessal-Standorte", text: "Forschungs- und Hafenstandorte für Gezeiten- und Meeresbiologie." }] },
            { titel: "Politische Geografie", text: ["Nalvyr besitzt regionale Staaten und autonome Gemeinschaften, deren Grenzen nicht den Kontinenten folgen. Der Nalvyr-Konvent koordiniert Diplomatie, Handel, medizinische Standards, Umweltpolitik, Katastrophenschutz und wissenschaftliche Programme."] }] },
        "Geschichte": { abschnitte: [
            { titel: "Zivilisationsgeschichte", zeitleiste: [["vor mehr als 18.000 Jahren", "Komplexe Gemeinschaften in Fluss- und Küstenregionen"], ["vor ca. 10.000–3.500 Jahren", "Stadtgesellschaften"], ["vor ca. 3.200 Jahren", "Gewebekartierungsdurchbruch"], ["vor ca. 2.430–2.360 Jahren", "Gewebekrise"], ["vor ca. 2.310 Jahren", "Charta der Unversehrtheit"], ["vor ca. 1.900 Jahren", "Heutiger Nalvyr-Konvent"], ["seit ca. 640 Jahren", "Größere interstellare Kontakte"]] }] },
        "Fraktionen": { abschnitte: [
            { titel: "Beziehungen", text: ["Die Regeneranten sind keiner einzelnen APORIA-Fraktion exklusiv zugeordnet. Der Nalvyr-Konvent unterhält Beziehungen zu Konföderation, Konsortium, Protektorat, Synaptorat und Ätherwanderern; die Charta der Unversehrtheit setzt dabei die Grenzen für medizinische Zusammenarbeit."] }] },
        "Rohstoffe": { abschnitte: [
            { titel: "Rohstoffe", karten: [{ titel: "Mineralisch", text: "Metallerze, Silikate, kalzium- und phosphathaltige Minerale, Industriesalze." }, { titel: "Energetisch", text: "Geothermie und weitere technisch nutzbare Quellen." }, { titel: "Biologisch", text: "Landwirtschaft, Biomasse, medizinische Ausgangsstoffe." }] },
            { titel: "Hinweis", text: ["Die Regeneration der Narethi hängt nicht von einem einzigen besonderen Rohstoff ab."] }] },
        "Erforschung": { abschnitte: [
            { titel: "Schutzgebiete", daten: [["Elarin-Auenreservat", "Fossile Tierlinien, Feuchtwälder, Evolution der Regeneration"], ["Tessal-Gezeitenschutzraum", "Gezeitenorganismen und marine Lebensräume"], ["Kethrin-Basaltrefugien", "Besiedlung junger Gesteine"], ["Sarn-Hochlandkorridor", "Wanderungen und genetischer Austausch"]] },
            { titel: "Forschungsrichtungen", liste: ["Astronomie: Saelon und die Planetenbahn", "Planetologie und Geologie", "Atmosphärenphysik und Ozeanografie", "Ökologie und Evolutionsbiologie", "Paläontologie regenerativer Tierlinien", "Xenobiologie im Vergleich mit fremden Welten"] }] },
        "Besonderheiten": { abschnitte: [
            { titel: "Einzigartige Welt", liste: ["Viele Tierlinien mit unterschiedlicher Regenerationsfähigkeit", "Heimat einer Spezies, die Gliedmaßen und Organe nachbildet", "Weißer Zwerg als Begleitstern am Himmel", "Starke Gezeiten in Trichterbuchten"] },
            { titel: "Hinweise für Besucher", liste: ["Atemluft vorher auf Verträglichkeit prüfen", "Schutzgebiete nur mit Genehmigung", "Sturmfluten im Tessal-Archipel beachten", "Charta der Unversehrtheit gilt auch für Gäste"] }] },
        "Medienarchiv": { abschnitte: [] },
    },
};
