// Iravelle · Heimatwelt der Oneiroiden (Quellen: Info_material/…/Oneiroiden/05_Heimatwelt/heimatwelt-referenz.md und
// sternensystem/sternensystem.md, Darynth-System). Ergänzt: Monde von Torad (Valen, Ithra, Moradh), Olyss (Pheris, Ondra), Umbrel (Ysel), Komet Velmora.
// Hinweis: „Avarin“ war im Archiv vergeben (Asteroidengürtel) → im Infomaterial zu „Avareth“ umbenannt.
const H = "assets/bilder/Alle Spezies+Übersicht/Mentale Spezies/Oneiroiden/heimatwelt/";
const E = "assets/bilder/Alle Spezies+Übersicht/Mentale Spezies/Oneiroiden/entwicklungsstadien/";
const B = {
    leuchtend: H + "Traumwelt der leuchtenden Oneiroiden-1.png", baum: H + "Traumwelt mit leuchtendem Lebensbaum-2.png", traum3: H + "Traumwelt der Oneiroiden-3.png",
    ringe: H + "Traumwelt der leuchtenden Ringe-4.png", traum5: H + "Traumwelt der Oneiroiden-5.png", spire: H + "Traumwelt der Oneiroiden mit Dreamspire-6.png",
    monde: H + "Biolumineszente Stadt unter fremden Monden-7.png", heiligtum: H + "Oneiroiden-Traumheiligtum unter fremden Sternen-8.png",
    stadt: H + "Biolumineszente Stadt der Oneiroiden-9.png", neon: H + "Traumwelt der Oneiroids im Neonlicht-10.png",
};
export default {
    systemseite: "inhalte/himmelskoerper/sternensysteme/details/darynth-system/hauptseite/index.html",
    ordner: "teilvereister-planet-mit-dunklen-ozeanen", system: "iravelle-system", planetId: "iravelle-planet",
    name: "Iravelle", genitiv: "von Iravelle", klasse: "Gesteinsplanet", klasseLang: "Terrestrischer Gesteinsplanet mit Terrassensenken, Feuchtgebieten und zwei Monden",
    spezies: { name: "Oneiroiden", gruppe: "Mentale Spezies", ordner: "Oneiroiden", seite: "inhalte/spezies/Mentale Spezies/Oneiroiden/hauptseite/Spezies.html" },
    intro: "Iravelle ist die Heimatwelt der Oneiroiden – der Arunai. Ein terrestrischer Gesteinsplanet mit fünf großen Landmassen, Terrassensenken, Feuchtgebieten, Ozeanen und polaren Eisfeldern. Lange Nächte, geschützte Bodenlandschaften und nachtaktive Fressfeinde begünstigten hier das gemeinsame Schlafen – den Ursprung koordinierten Träumens.",
    bildtext: "Iravelle – Kontinente, Ozeane und polare Eisfelder",
    kurzprofil: [
        "Iravelle umkreist den K3-Stern Darynth in 0,65 AE Abstand und erhält trotz dessen geringer Leuchtkraft rund 87,6 % der Strahlungsleistung der Erde. Etwa 54 % der Oberfläche sind Wasser; die Atmosphäre mit rund 1,15 bar gleicht die geringere Einstrahlung teilweise aus.",
        "Die beiden Monde Nethis und Ruva erzeugen kombinierte Gezeiten. Die außergewöhnliche Traumfähigkeit der Oneiroiden stammt aus ihrer Biologie – die Atmosphäre enthält keine planetenweit wirksamen natürlichen Traumstoffe.",
    ],
    farben: { nacht: "#09070f", tiefe: "#120e1b", akzent: "#c39cf2", sand: "#dcc3a0", moos: "#8aa880", ozean: "#4a86b0", glas: "rgba(14, 10, 22, .8)", "glas-hell": "rgba(24, 18, 36, .86)", linie: "rgba(195, 156, 242, .16)", "linie-hell": "rgba(227, 176, 122, .36)", text: "#f1eef5", leise: "#b0a8bd", "aporia-page-tint": "#3e3058" },
    werte: {
        temperatur: "ca. 12 °C", temperaturMittel: 12, ozeane: "ca. 54 % (Ozeane, Binnenmeere, Seen)",
        atmosphaere: [["Stickstoff", 77], ["Sauerstoff", 20], ["Argon", 2], ["Kohlendioxid", 0.07], ["Weitere Bestandteile inkl. Wasserdampf", 0.93]],
        atmoKurz: "Stickstoff-Sauerstoff, 1,15 bar",
        atmoText: "Die Atmosphäre besitzt eine für Oneiroiden gut geeignete Sauerstoffkonzentration. Ihre Zusammensetzung schwankt mit Höhe, Wetter, Region und Jahreszeit; in Feuchtgebieten sind Wasserdampf und biologische Aerosole deutlich stärker vertreten. Planetenweit wirksame natürliche Traumstoffe enthält sie nicht.",
        druck: "ca. 1,15 bar", druckMittel: 1.15, druckDaten: [["Mittlerer Oberflächendruck", "ca. 1,15 bar"], ["Sauerstoffanteil", "ca. 20 %"], ["Argonanteil", "ca. 2 %"]],
        rotationH: 30, rotationText: "30 Erdstunden (nicht gebunden)", achsneigung: 19, jahreszeiten: "Ausgeprägte Jahreszeiten, die wegen des kurzen Umlaufjahres auf irdischer Zeitskala schneller verlaufen",
        treibhausText: "Bei einer Albedo von rund 0,30 läge die Gleichgewichtstemperatur bei etwa −27 °C. Atmosphäre und Treibhausgase heben die mittlere Oberflächentemperatur auf etwa 12 °C und ermöglichen langfristig flüssiges Oberflächenwasser.",
        magnetfeldFaktor: 1,
        physikExtra: [["Radius", "1,04 Erdradien"], ["Oberflächengravitation", "ca. 10,16 m/s²"], ["Rotation", "30 Erdstunden"], ["Landoberfläche", "ca. 46 %"]],
        extra: [["Landmassen", "Fünf Kontinente und zahlreiche Inselgruppen"], ["Monde", "Nethis, Ruva"], ["Bedeutende Regionen", "Sorel-Terrassen, Veyran-Hochländer, Avareth-Küsten, Stillbecken"], ["Politische Koordination", "Konvent der Zwei Zustände"]],
        vergleichExtra: [["Wasserbedeckung", 54, 71, "%"], ["Tageslänge", 30, 24, "h"]],
        zonen: { einheit: "°C", min: -35, max: 38, bereiche: [["Polare Regionen", -30, -2], ["Kontinentale Hochländer (Veyran)", -12, 18], ["Trockene Binnenbecken", 2, 32], ["Gemäßigte Terrassenlandschaften (Sorel)", 6, 22], ["Äquatoriale Feuchtgebiete", 20, 30]] },
        zonenText: "Die großen Landgebiete erzeugen erhebliche regionale Klimaunterschiede – von äquatorialen Feuchtgebieten mit häufigen Gewittern bis zu polaren Küsten mit saisonalen Eisfeldern.",
        rekorde: [["Bedeutendste Ursprungsregion", "Sorel-Terrassen"], ["Forschungsstädte", "Veyran-Hochländer"], ["Raumfahrtinfrastruktur", "Avareth-Küsten"], ["Innerer Mond", "Nethis, ca. 210.000 km"]],
    },
    bilder: { medien: [["Traumwelt der leuchtenden Oneiroiden", B.leuchtend], ["Traumwelt mit leuchtendem Lebensbaum", B.baum], ["Traumwelt der Oneiroiden", B.traum3], ["Traumwelt der leuchtenden Ringe", B.ringe], ["Traumwelt der Oneiroiden", B.traum5], ["Traumwelt mit Traumturm", B.spire], ["Biolumineszente Stadt unter fremden Monden", B.monde], ["Traumheiligtum unter fremden Sternen", B.heiligtum], ["Biolumineszente Stadt der Oneiroiden", B.stadt], ["Traumwelt im Neonlicht", B.neon], ["Erwachsener Oneiroid", E + "oneiroid-ent.a11.png"]] },
    kapitel: {
        "Allgemeines": { intro: "Iravelle auf einen Blick: Terrassen, Feuchtgebiete und zwei Monde.", kopfbild: B.leuchtend, abschnitte: [
            { titel: "Planetare Identität", daten: [["Sternensystem", "Darynth"], ["Planetentyp", "Terrestrischer Gesteinsplanet"], ["Position", "Dritter Planet"], ["Tektonische Aktivität", "Aktiv"], ["Globales Magnetfeld", "Vorhanden"], ["Einheimische intelligente Spezies", "Oneiroiden"]] },
            { titel: "Hauptmerkmale", karten: [{ titel: "Fünf Landmassen", text: "Hochländer, Sedimentbecken und weitläufige Flusssysteme." }, { titel: "Terrassensenken", text: "Gestufte Becken – Ursprung früher Siedlungen." }, { titel: "Zwei Monde", text: "Nethis und Ruva erzeugen komplexe Gezeiten." }, { titel: "Lange Nächte", text: "30-Stunden-Tag – Grundlage gemeinsamer Ruhephasen." }] }] },
        "Astronomie": { intro: "Eine Welt im lebensfreundlichen Bereich des Darynth-Systems.", kopfbild: B.monde, abschnitte: [
            { titel: "Zeitrechnung", daten: [["Rotationsperiode", "30 Erdstunden"], ["Umlaufzeit", "216,7 Erdtage"], ["Nethis", "ca. 10,4 Tage, 210.000 km"], ["Ruva", "ca. 22,9 Tage, 355.000 km"]] },
            { titel: "Himmelsereignisse", karten: [{ titel: "Mondkonjunktionen", text: "Nethis und Ruva stehen scheinbar nahe beieinander." }, { titel: "Finsternisse", text: "Sonnen- und Mondfinsternisse je nach Bahnneigung." }, { titel: "Kometen", text: "Gelegentlich langschweifige Kometen wie Velmora." }, { titel: "Meteorströme", text: "Staubspuren von Kometen." }] }] },
        "Physik": { kopfbild: B.neon, abschnitte: [
            { titel: "Magnetfeld und Polarlichter", text: ["Ein planetarer Dynamo erzeugt ein Magnetfeld. Geladene Teilchen lösen in hohen Breiten grüne, rote und violette Polarlichter aus; starke stellare Aktivität kann Funkverbindungen und empfindliche Geräte beeinträchtigen."] }] },
        "Planetare Struktur": { abschnitte: [
            { titel: "Schalenbau", text: ["Iravelle besitzt einen differenzierten Aufbau; die innere Wärme ermöglicht langfristige geologische Aktivität."], schichten: [["Kruste", "Ozeanische und kontinentale Gesteinsbereiche"], ["Mantel", "Silikatreiches Gestein mit konvektiven Bewegungen"], ["Äußerer Kern", "Teilweise flüssig, elektrisch leitfähig"], ["Innerer Kern", "Überwiegend metallisch, hoher Eisenanteil"]] }] },
        "Geografie": { intro: "Fünf Landmassen und ihre Landschaftsräume.", kopfbild: B.traum3, abschnitte: [
            { titel: "Bedeutende Landschaftsräume", karten: [
                { titel: "Sorel-Terrassen", text: "Gestufte Becken, Flüsse, Seen – historische Ursprungsregion." },
                { titel: "Veyran-Hochländer", text: "Gebirge, Thermalzonen, Rohstoffe und Forschungsstädte." },
                { titel: "Avareth-Küsten", text: "Buchten, Mündungen, Häfen und Raumfahrtinfrastruktur." },
                { titel: "Die Stillbecken", text: "Bewaldete Senken mit Nebelschichten – Orte traditioneller Schlafgemeinschaften." },
                { titel: "Nördliche Bruchfelder", text: "Verwerfungen, Geothermalquellen und Vulkanzentren." },
                { titel: "Südliche Trockenplateaus", text: "Saisonale Niederschläge, widerstandsfähige Vegetation." }] }] },
        "Atmosphäre": { abschnitte: [
            { titel: "Keine Traumstoffe", text: ["Die außergewöhnliche Traumfähigkeit der Oneiroiden stammt aus ihrer Biologie, nicht aus der Atmosphäre ihrer Heimatwelt."] }] },
        "Klima": { abschnitte: [
            { titel: "Naturereignisse", liste: ["Saisonale Sturmzüge", "Küstensturmfluten", "Überschwemmungen von Terrassenbecken", "Dichte Strahlungsnebel bei Temperaturinversionen", "Erdbeben und Vulkaneruptionen", "Polarlichtstürme", "Regionale Trockenperioden und Vegetationsbrände", "Erdrutsche und Schlammlawinen"] }] },
        "Gewässer": { kopfbild: B.traum5, abschnitte: [
            { titel: "Gezeiten", text: ["Die beiden Monde erzeugen kombinierte Gezeitenbewegungen, deren Stärke sich zwischen offenen Küsten, engen Buchten und abgeschlossenen Binnengewässern deutlich unterscheidet. Die ungleichmäßige Landverteilung erzeugt örtlich starke Meeresströmungen."] }] },
        "Geologie": { abschnitte: [
            { titel: "Aktive Plattentektonik", liste: ["Erdbeben", "Vulkanismus", "Hydrothermale Aktivität", "Mineralische Ausfällungen", "Erosion und Sedimentation", "Verkarstung geeigneter Gesteine", "Regionale Bodenhebung und Absenkung"] }] },
        "Biosphäre": { intro: "Terrassenfächer, Nebelwurzler und Dämmerjäger.", kopfbild: B.baum, abschnitte: [
            { titel: "Flora", karten: [{ titel: "Terrassenfächer", text: "Breite, flächige Lichtaufnahmeorgane." }, { titel: "Nebelwurzler", text: "Wasseraufnahme über ausgedehnte Oberflächen." }, { titel: "Speicherknollengewächse", text: "Unterirdische Nährstoffreserven." }, { titel: "Hochlandfaserpflanzen", text: "Langsames Wachstum, feste Stützstrukturen." }, { titel: "Ufermatten", text: "Dichte Gemeinschaften an flachen Gewässern." }] },
            { titel: "Fauna", karten: [{ titel: "Ufergräber", text: "Nahrungssuche in feuchten Sedimenten." }, { titel: "Dämmerjäger", text: "Nacht- und dämmerungsaktive Räuber." }, { titel: "Terrassenläufer", text: "Pflanzenfresser offener Feuchtlandschaften." }, { titel: "Membrangleiter", text: "Kleine Flug- und Gleitorganismen." }, { titel: "Sedimentfilterer", text: "Aquatische Filterorganismen." }, { titel: "Nachtkauer", text: "Kleine Allesfresser der Uferwälder." }] }] },
        "Spezies": { intro: "Die Oneiroiden – eine zweite Form gesellschaftlicher Zusammenarbeit.", abschnitte: [
            { titel: "Oneiroiden (Arunai)", bild: E + "oneiroid-ent.a11.png", bildtext: "Erwachsener Oneiroid", text: ["Die Oneiroiden sind eine biologische, nicht humanoide, sechsbeinige Spezies mit faltbarer Schlafkrone auf dem Rücken. Im Schlaf stimmen sie komplexe Erinnerungs- und Vorstellungsmuster mit anderen Individuen ab – ohne übergeordnetes Bewusstsein und ohne Telepathie."], verweise: [["Zum Speziesdossier", "inhalte/spezies/Mentale Spezies/Oneiroiden/hauptseite/Spezies.html"]] },
            { titel: "Biologische Bedeutung", text: ["Die lange Nachtphase, geschützte Bodenlandschaften und nachtaktive Fressfeinde begünstigten das gemeinsame Schlafen früher Vorfahren. In den Ruhegemeinschaften entwickelten sich soziale Schlafsignale – der evolutionäre Ausgangspunkt der Traumkoordination."] }] },
        "Zivilisation": { kopfbild: B.stadt, abschnitte: [
            { titel: "Besiedlung und Umwelt", text: ["Die heutige Zivilisation besitzt Landwirtschaft, Industrie, Verkehrsnetze, Städte und Raumfahrtanlagen. Historische Schlafplätze und ursprüngliche Feuchtgebiete besitzen biologischen und kulturellen Schutzstatus."] }] },
        "Geschichte": { kopfbild: B.heiligtum, abschnitte: [
            { titel: "Frühe Siedlungen", text: ["Viele frühe Oneiroiden-Siedlungen liegen in den Terrassensenken, die durch Tektonik, Erosion, Sedimentablagerung und langfristige Klimaveränderungen entstanden. Die Sorel-Terrassen gelten als eine der wichtigsten Ursprungsregionen früher Kulturen."] }] },
        "Fraktionen": { abschnitte: [
            { titel: "Beziehungen", text: ["Die Herkunftszivilisation der Oneiroiden ist zunächst politisch eigenständig. Kontakte zu Konföderation, Konsortium, Protektorat, Synaptorat und Ätherwanderern sind möglich, ohne vollständige Zugehörigkeit zu einer dieser Fraktionen."] }] },
        "Rohstoffe": { abschnitte: [
            { titel: "Rohstoffe", text: ["In den Veyran-Hochländern liegen mineralische Rohstofflagerstätten und Thermalzonen; der Asteroidengürtel des Systems ist eine bedeutende Rohstoffregion."] }] },
        "Erforschung": { kopfbild: B.spire, abschnitte: [
            { titel: "Offene Fragen", liste: ["Langfristige tektonische Entwicklung", "Regionale Ozeanzirkulation", "Stabilität einzelner Ökosysteme", "Früheste Schritte der Oneiroiden-Evolution", "Quantitative Klimasimulation"] }] },
        "Besonderheiten": { kopfbild: B.ringe, abschnitte: [
            { titel: "Einzigartige Welt", liste: ["Terrassensenken als Wiege einer Zivilisation", "Zwei Monde mit komplexen Gezeitenmustern", "Nebelreiche Stillbecken der Schlafgemeinschaften", "Heimat koordinierten Träumens"] },
            { titel: "Hinweise für Besucher", liste: ["Schlafzeiten und Ruhegemeinschaften respektieren", "Traumrecht der Oneiroiden beachten", "Strahlungsnebel in den Stillbecken einplanen", "Geschützte Schlafplätze nicht betreten"] }] },
        "Medienarchiv": { abschnitte: [] },
    },
};
