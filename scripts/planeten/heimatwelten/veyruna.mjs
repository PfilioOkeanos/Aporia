// Veyruna · Heimatwelt der Echonoiden (Quellen: Info_material/…/Echonoiden/05_Heimatwelt/heimatwelt-referenz.md und
// Sternensystem/SternenSystem.md, Orelis-System). Ergänzt: Monde von Jandor (Ithel, Orrund, Vasch) und Veltos (Nimra), Ringe, Komet Ilvaren.
const H = "assets/bilder/Alle Spezies+Übersicht/Mentale Spezies/Echonoiden/Heimatplanet/";
const E = "assets/bilder/Alle Spezies+Übersicht/Mentale Spezies/Echonoiden/entwicklungsstadien/";
const B = { kueste: H + "Echonoiden_welt-A1.png", hoehle: H + "Echonoiden_welt-A2.png", mirael: H + "Echonoiden_welt-A3.png", becken: H + "Echonoiden_welt-A4.png", spalten: H + "Echonoiden_welt-A5.png" };
export default {
    systemseite: "inhalte/himmelskoerper/sternensysteme/details/orelis-system/hauptseite/index.html",
    ordner: "veyruna", system: "veyruna-system", planetId: "veyruna-planet",
    name: "Veyruna", genitiv: "von Veyruna", klasse: "Gesteinsplanet", klasseLang: "Felsiger, wasserreicher terrestrischer Planet",
    spezies: { name: "Echonoiden", gruppe: "Mentale Spezies", ordner: "Echonoiden", seite: "inhalte/spezies/Mentale Spezies/Echonoiden/hauptseite/Spezies.html" },
    intro: "Veyruna ist die Heimatwelt der Echonoiden. Ein felsiger, wasserreicher Planet mit dichter Atmosphäre, gezeitengeprägten Küsten, vulkanischen Inselbögen und Höhlenlandschaften – eine Welt, deren vielfältige Schallräume die Entwicklung einer Wahrnehmung aus mechanischen Schwingungen begünstigten.",
    bildtext: "Veyruna – Ozeane, Inselbögen und Schelfmeere",
    kurzprofil: [
        "Veyruna umkreist den orangegelben K1-Stern Orelis in 0,68 AE Abstand und empfängt rund 91 % der Sternstrahlung, die die Erde erhält. Etwa 62 % der Oberfläche sind von Wasser bedeckt; die dichte Atmosphäre mit 1,45 bar beeinflusst Wind, Wetter und Schallausbreitung.",
        "Der große Mond Talar und der kleinere Sivem erzeugen wechselnde Gezeitenkonstellationen. Wechselnde Wasserstände, komplexe Felslandschaften, dichte Küstenökosysteme und schwierige Sichtbedingungen formten die mechanische Sensorik der Echonoiden.",
    ],
    farben: { nacht: "#060a0b", tiefe: "#0c1517", akzent: "#67d1c8", sand: "#d8cfb4", moos: "#7fa98e", ozean: "#2e8fa6", glas: "rgba(8, 15, 17, .8)", "glas-hell": "rgba(15, 26, 29, .86)", linie: "rgba(103, 209, 200, .16)", "linie-hell": "rgba(168, 140, 240, .34)", text: "#eef2f1", leise: "#a2b3b2", "aporia-page-tint": "#2c5258" },
    werte: {
        temperatur: "ca. 15 °C", temperaturMittel: 15, ozeane: "ca. 62 % (Ozeanbecken, Schelfmeere, Gezeitenbecken)",
        atmosphaere: [["Stickstoff", 78.0], ["Sauerstoff", 19.0], ["Argon", 2.7], ["Kohlendioxid", 0.06], ["Weitere Spurengase", 0.24]],
        atmoKurz: "Stickstoff-Sauerstoff, 1,45 bar",
        atmoText: "Die Atmosphäre besteht vorwiegend aus Stickstoff und Sauerstoff. Ihre erhöhte Dichte beeinflusst Windströmungen, Schallausbreitung und Wetterprozesse. Der Sauerstoffpartialdruck liegt höher als auf der Erde; für menschliche Besucher ist die Atmosphäre daher nicht automatisch unbedenklich.",
        druck: "ca. 1,45 bar", druckMittel: 1.45, druckDaten: [["Mittlerer Meeresspiegeldruck", "ca. 1,45 bar"], ["Sauerstoffanteil", "19,0 %"], ["Argonanteil", "2,7 %"]],
        rotationH: 30.5, rotationText: "30,5 h (siderisch)", achsneigung: 19, jahreszeiten: "Gemäßigte globale Durchschnittsbedingungen mit starken regionalen Unterschieden",
        treibhausText: "Ohne Atmosphäre läge die Gleichgewichtstemperatur bei einer Albedo von 0,30 um −24 °C. Die dichte Atmosphäre und die großen Wassermassen heben die geschätzte globale Mitteltemperatur auf etwa 15 °C.",
        magnetfeldFaktor: 1,
        physikExtra: [["Radius", "1,08 Erdradien"], ["Oberflächengravitation", "10,26 m/s²"], ["Fluchtgeschwindigkeit", "ca. 11,9 km/s"], ["Exzentrizität", "ca. 0,025"]],
        extra: [["Landbedeckung", "ca. 38 %"], ["Monde", "Talar (ca. 3.400 km), Sivem (ca. 430 km)"], ["Besondere Regionen", "Mirael-Bögen, Ihsarek-Spalten, Norrat-Becken, Talarküste, Khavyr-Hochländer"], ["Siedlungsräume", "Geschützte Küsten, Hochflächen, gesicherte Höhlensysteme"]],
        vergleichExtra: [["Wasserbedeckung", 62, 71, "%"], ["Luftdruck am Meeresspiegel", 1.45, 1.01, "bar"]],
        zonen: { einheit: "°C", min: -30, max: 40, bereiche: [["Hochlagen und Gebirge", -20, 6], ["Khavyr-Hochländer (trocken)", -4, 24], ["Gemäßigte Küsten", 6, 20], ["Gezeitenküsten und Schelfe", 10, 24], ["Warme Inselbögen", 20, 32]] },
        zonenText: "Große Ozeane, Hochländer und tektonisch entstandene Inselketten erzeugen zahlreiche Klimazonen. Es gibt weder einen globalen Dauernebel noch ununterbrochenes Sturmwetter.",
        rekorde: [["Größter Mond", "Talar, ca. 3.400 km"], ["Stärkste Gezeiten", "Einzelne Buchten der Talarküste"], ["Tektonisch aktivste Zone", "Ihsarek-Spalten"], ["Größtes Meeresbecken", "Norrat-Becken"]],
    },
    bilder: { medien: [["Talarküste im Abendlicht", B.kueste], ["Küstenhöhlen der Mirael-Bögen", B.hoehle], ["Vulkanische Inselbögen", B.mirael], ["Gezeitenbecken", B.becken], ["Ihsarek-Spalten", B.spalten], ["Echonoid im Küstenwald", E + "Echonoid_ent_A5.png"]] },
    kapitel: {
        "Allgemeines": { intro: "Veyruna auf einen Blick: Gezeiten, Höhlen und Schallräume.", kopfbild: B.kueste, abschnitte: [
            { titel: "Planetare Identität", daten: [["Zentralstern", "Orelis"], ["Planetenposition", "Dritter Planet"], ["Planetentyp", "Felsiger, wasserreicher terrestrischer Planet"], ["Biologischer Status", "Eigenständige Biosphäre mit intelligenten Echonoiden"]] },
            { titel: "Hauptmerkmale", karten: [{ titel: "Dichte Atmosphäre", text: "1,45 bar – mit Folgen für Wetter und Schall." }, { titel: "Zwei Monde", text: "Talar und Sivem prägen wechselnde Gezeiten." }, { titel: "Akustische Landschaften", text: "Gestein, Hohlräume und Wasser formen eigene Schallräume." }, { titel: "Aktive Tektonik", text: "Inselbögen, Bruchzonen und hydrothermale Gebiete." }] }] },
        "Astronomie": { intro: "Ein wasserreicher Planet im Orelis-System.", abschnitte: [
            { titel: "Zeitrechnung", daten: [["Rotation (siderisch)", "30,5 Erdstunden"], ["Jahr", "ca. 229 Erdtage"], ["Talar", "ca. 17 Tage, 300.000 km"], ["Sivem", "ca. 3,8 Tage, 110.000 km"]] },
            { titel: "Himmelsereignisse", karten: [{ titel: "Mondfinsternisse", text: "Talar oder Sivem wandern durch Veyrunas Schatten." }, { titel: "Doppelmond-Konstellationen", text: "Die verschieden schnellen Monde stehen wiederkehrend besonders." }, { titel: "Meteorschauer", text: "Staubströme von Kometen wie Ilvaren." }, { titel: "Magnetische Stürme", text: "Stellare Aktivität beeinflusst Technik und Magnetosphäre." }] }] },
        "Physik": { abschnitte: [
            { titel: "Etwas höhere Schwerkraft", text: ["Mit 1,22 Erdmassen und 1,08 Erdradien liegt die Oberflächengravitation bei 10,26 m/s². Die Rotation ist nicht gebunden; Veyruna besitzt einen normalen Tag-Nacht-Wechsel."] }] },
        "Planetare Struktur": { abschnitte: [
            { titel: "Schalenbau", text: ["Veyruna besitzt eine differenzierte feste Kruste, einen silikatischen Mantel und einen metallreichen Kern; das Modell nimmt eine aktive Plattentektonik an."], schichten: [["Kruste", "Kontinentalränder, Inselbögen und ozeanische Kruste"], ["Mantel", "Silikatisch"], ["Kern", "Metallreich"]] }] },
        "Geografie": { intro: "Inselbögen, Spalten, Becken und Hochländer.", kopfbild: B.mirael, abschnitte: [
            { titel: "Besondere Regionen", karten: [
                { titel: "Mirael-Bögen", text: "Vulkanische, teils erodierte Inselbögen mit zahlreichen Küstenhöhlen." },
                { titel: "Ihsarek-Spalten", text: "Tektonische Bruchzonen unter sorgfältiger seismischer Überwachung." },
                { titel: "Norrat-Becken", text: "Großes Meeresbecken mit besonderen Schallausbreitungsbedingungen." },
                { titel: "Talarküste", text: "Stark gezeitengeprägte Flachwasserlandschaften." },
                { titel: "Khavyr-Hochländer", text: "Trockene Felslandschaften mit besonderen Kontaktvibrationen." }] },
            { titel: "Küstenhöhlen", bild: B.hoehle, bildtext: "Küstenhöhlen der Mirael-Bögen", text: ["In den Küstenhöhlen der Mirael-Bögen treffen Brandung, Hohlraumgeometrie und Wasserstand aufeinander – nahe beieinanderliegende Räume können völlig unterschiedliche Schallcharakteristika besitzen."] }] },
        "Atmosphäre": { abschnitte: [
            { titel: "Wolken und Stürme", text: ["Große Wasserflächen fördern Verdunstung und Wolkenbildung. Starke Küstenstürme steigern Brandungsenergie und Geräuschbelastung; Gewitter und mechanisch intensive Stürme sind für Echonoiden besonders belastend – sie entwickelten früh meteorologische Warnsysteme."] }] },
        "Klima": { abschnitte: [
            { titel: "Naturereignisse", karten: [{ titel: "Gezeitenfluten", text: "Starke Wasserstandsänderungen bei passender Mond- und Sternenstellung." }, { titel: "Resonanzstürme", text: "Wind, Brandung und Landschaft erzeugen intensive Schwingungsmuster." }, { titel: "Tektonische Erschütterungen", text: "Seismische Aktivität an Plattengrenzen." }, { titel: "Hydrothermale Ausbrüche", text: "Unterirdische Wärme und Fluidbewegungen." }, { titel: "Küstenabsenkungen", text: "Langfristige Veränderungen besiedelter Regionen." }, { titel: "Tsunamis", text: "Selten, aber potenziell verheerend." }] }] },
        "Gewässer": { kopfbild: B.becken, abschnitte: [
            { titel: "Gewässerformen", karten: [{ titel: "Schelfmeere", text: "Flache, biologisch produktive Meeresgebiete." }, { titel: "Gezeitenbecken", text: "Regelmäßig überflutete Küstenräume." }, { titel: "Brackwasserhöhlen", text: "Teilweise abgeschlossen, mit wechselndem Salzgehalt." }, { titel: "Tiefseegräben", text: "Tektonisch aktive Tiefwasserregionen." }, { titel: "Binnengewässer", text: "Seen, Flusssysteme und Süßwasserbecken." }] },
            { titel: "Gezeiten", text: ["Talar und die verhältnismäßig nahe Bahn um Orelis erzeugen bedeutende Gezeitenkräfte. Die tatsächlichen Wasserstandsschwankungen hängen von Küstenform, Meerestiefe und den Resonanzeigenschaften der Becken ab – einzelne Buchten zeigen außergewöhnlich große Unterschiede."] }] },
        "Geologie": { kopfbild: B.spalten, abschnitte: [
            { titel: "Geologische Prozesse", liste: ["Subduktion und Gebirgsbildung", "Vulkanische Inselbildung", "Kontinentale Bruchzonen", "Meeresbodenspreizung", "Hydrothermale Aktivität", "Verwitterung und Küstenerosion", "Regionale Erdbeben"] }] },
        "Biosphäre": { intro: "Ein Wettlauf der Sinne.", abschnitte: [
            { titel: "Sensorische Konkurrenz", text: ["Viele Tiergruppen Veyrunas besitzen Berührungs-, Druck- oder Schallrezeptoren; einige nutzen aktive Signale zur Beutesuche, andere tarnen ihre mechanischen Signaturen. Diese Konkurrenz beeinflusste die Evolution zahlreicher Organismen."] },
            { titel: "Flora", text: ["Photosynthetisch aktive Lebensformen besiedeln Meer und Land. Küstenpflanzen besitzen widerstandsfähige Verankerungen und an wechselnde Wasserstände angepasste Gewebe; in manchen Regionen bilden kleinere Primärproduzenten dichte Matten."] }] },
        "Spezies": { intro: "Die Echonoiden – Wahrnehmung aus Schwingungen.", abschnitte: [
            { titel: "Echonoiden (Esharin)", bild: E + "Echonoid_ent_A5.png", bildtext: "Echonoid", text: ["Die Echonoiden sind intelligente, vielzellige Lebewesen mit flachem, breitem Körper, vier Laufextremitäten, drei Greiffortsätzen und drei Resonanzlappen. Sie rekonstruieren ihre Umgebung als „Schwingungsbild“ aus mechanischen Schwingungen – ohne Telepathie."], verweise: [["Zum Speziesdossier", "inhalte/spezies/Mentale Spezies/Echonoiden/hauptseite/Spezies.html"]] }] },
        "Zivilisation": { abschnitte: [
            { titel: "Siedlungsräume", text: ["Typische Siedlungen liegen an geschützten Küsten, auf stabilen Hochflächen und in technisch gesicherten Höhlensystemen. Moderne Architektur berücksichtigt Erdbebenrisiken, Wasserstände, biologische Bedürfnisse und akustische Belastungen."] }] },
        "Geschichte": { abschnitte: [
            { titel: "Bedeutung für die Spezies", text: ["Veyruna erklärt die Evolution der echonoidischen Wahrnehmung: Wechselnde Gezeiten, Felslandschaften, dichte Küstenökosysteme und schwierige Sichtbedingungen begünstigten mechanische Sensorik. Die Echonoiden sind das Ergebnis einer natürlichen Umwelt, nicht einer künstlichen Resonanzquelle."] }] },
        "Fraktionen": { abschnitte: [
            { titel: "Beziehungen", text: ["Eine feste Zuordnung der Echonoiden zu Konföderation, Konsortium, Protektorat, Synaptorat oder Ätherwanderern ist noch nicht beschlossen."] }] },
        "Rohstoffe": { abschnitte: [
            { titel: "Rohstoffe", text: ["Wirtschaftlich relevant sind Metallerze, Silikatgesteine, keramische Ausgangsstoffe, organische Biomasse und Energieressourcen. Bestimmte kristalline oder faserige Materialien eignen sich besonders für Präzisionsresonatoren – ohne exotische Energie, allein durch messbare mechanische Eigenschaften."] }] },
        "Erforschung": { abschnitte: [
            { titel: "Offene Planetendaten", liste: ["Räumliche Temperaturverteilung", "Ozeanzirkulation", "Genaue Gezeitenkarten", "Magnetfeld und Kernentwicklung", "Plattenbewegungen", "Wasserchemie und Salzgehalte", "Vollständige Artenvielfalt"] }] },
        "Besonderheiten": { abschnitte: [
            { titel: "Einzigartige Welt", liste: ["Akustische Landschaften aus Gestein, Hohlraum und Wasser", "Zwei Monde mit wechselnden Gezeitenkonstellationen", "Dichte Atmosphäre mit veränderter Schallausbreitung", "Heimat einer Spezies, die Schwingungen sieht"] },
            { titel: "Hinweise für Besucher", liste: ["Erhöhten Sauerstoffpartialdruck beachten", "Gezeitenfluten an der Talarküste einplanen", "Akustischen Datenschutz respektieren", "Ihsarek-Spalten nur mit seismischer Freigabe"] }] },
        "Medienarchiv": { abschnitte: [] },
    },
};
