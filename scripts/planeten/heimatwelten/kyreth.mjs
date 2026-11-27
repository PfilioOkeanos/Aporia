// Kyreth · Heimatwelt der Elektrozoiden (Quelle: Info_material/…/Elektrozoiden/05_Heimatwelt – Name und Planetendaten waren offen;
// Werte aus den Vorgaben abgeleitet: terrestrisch, mineralisch vielfältige und unterschiedlich leitfähige Böden, feuchte Gebiete, Flora, elektrische Umweltreize)
const G = "assets/bilder/Alle Spezies+Übersicht/Biologische Spezies/Elektrozoiden/gesamtdarstellung/";
const D = (n) => G + `Elektrozoiden _designA2${n ? `(${n})` : ""}.png`;
export default {
    ordner: "kyreth", system: "kyreth-system", planetId: "kyreth-planet",
    name: "Kyreth", genitiv: "von Kyreth", klasse: "Gesteinsplanet", klasseLang: "Feuchtwarme terrestrische Welt mit leitfähigen Böden",
    spezies: { name: "Elektrozoiden", gruppe: "Biologische Spezies", ordner: "Elektrozoiden", seite: "inhalte/spezies/Biologische Spezies/Elektrozoiden/hauptseite/Spezies.html" },
    intro: "Kyreth ist die Heimatwelt der Elektrozoiden: eine feuchtwarme Landwelt, deren Böden aus Erzen, Salzen, Tonen und Graphitschiefern elektrisch völlig unterschiedlich leiten. Gewitter ziehen fast täglich über die grünen Ebenen – eine Welt voller elektrischer Felder.",
    bildtext: "Kyreth – grüne Kontinente unter Gewitterwirbeln",
    kurzprofil: [
        "Kyreth ist eine etwas größere und schwerere Schwester der Erde im Ixar-System. Rund die Hälfte der Oberfläche ist Land: weite, feuchte Ebenen, Flussniederungen und Mineralhochländer mit stark wechselnden Bodenarten.",
        "Die unterschiedliche Leitfähigkeit der Böden, häufige Gewitter und ein kräftiges Magnetfeld erzeugen ein dichtes Mosaik elektrischer Umweltreize. In diesem Umfeld entwickelten die Elektrozoiden ihre zwei elektrischen Sinne und ihre bioelektrische Sprache.",
    ],
    farben: { nacht: "#060a0c", tiefe: "#0d1518", akzent: "#7fd8ff", sand: "#d8e48a", moos: "#7cc47a", ozean: "#3f86b8", glas: "rgba(10, 20, 24, .76)", "glas-hell": "rgba(18, 32, 38, .82)", linie: "rgba(127, 216, 255, .16)", "linie-hell": "rgba(150, 225, 255, .36)", text: "#eef6f4", leise: "#a6b8b6", "aporia-page-tint": "#2a6a7a" },
    werte: {
        temperatur: "ca. 17 °C", temperaturMittel: 17, ozeane: "ca. 52 % (zwei große Ozeane und viele Binnenmeere)",
        atmosphaere: [["Stickstoff", 76.5], ["Sauerstoff", 21], ["Argon", 1.1], ["Wasserdampf (Mittel)", 1.2], ["Kohlendioxid und Spurengase", 0.2]],
        atmoKurz: "Stickstoff-Sauerstoff, feucht, 1,2 bar",
        atmoText: "Die Atmosphäre ist atembar, feucht und etwas dichter als die der Erde. Starke Aufwinde über den warmen Ebenen trennen in den Wolken Ladungen – daher die ungewöhnlich hohe Gewitterhäufigkeit. Die atmosphärischen Felder liefern zusätzliche Umweltinformationen, eignen sich aber nicht als verlässliches planetenweites Kommunikationssystem.",
        druck: "ca. 1,2 bar", druckMittel: 1.2,
        rotationH: 21, rotationText: "ca. 21 h", achsneigung: 24, jahreszeiten: "Deutlich; Regen- und Trockenzeiten mit wechselnder Bodenleitfähigkeit",
        treibhausText: "Wasserdampf und eine etwas dichtere Atmosphäre erzeugen eine Treibhauswirkung von rund 38 K.",
        magnetfeldFaktor: 1.4,
        physikExtra: [["Durchmesser im Vergleich", "ca. 104 % der Erde"], ["Gewitterhäufigkeit", "rund dreimal so hoch wie auf der Erde"]],
        extra: [["Besonderheit", "Mosaik unterschiedlich leitfähiger Böden"], ["Gewitter", "fast täglich in den Tropen"]],
        vergleichExtra: [["Gewittertage pro Jahr (Tropen)", 260, 80, "Tage"]],
        zonen: { einheit: "°C", min: -25, max: 40, bereiche: [["Polare Tundren", -20, 0], ["Mineralhochländer", -5, 14], ["Gemäßigte Ebenen", 8, 22], ["Feuchte Flussniederungen", 16, 30], ["Tropische Gewittergürtel", 24, 36]] },
        zonenText: "Elektrozoiden bevorzugen die feuchten Ebenen und Flussniederungen: Feuchte Böden erleichtern ihre Kontaktkommunikation. Trockenzeiten verändern die Leitfähigkeit ganzer Landstriche.",
        rekorde: [["Größtes Gewittersystem", "Tropischer Gewittergürtel über dem Kontinent Saevra"], ["Leitfähigster Untergrund", "Graphitschiefer der Kalvenschwelle"], ["Stärkste Feldstörungen", "Polarlichtzonen bei Sternaktivität"]],
    },
    bilder: { medien: [["Elektrozoid – Entwurf A2", D(0)], ["Entwurf A2 · 2", D(1)], ["Entwurf A2 · 3", D(2)], ["Entwurf A2 · 4", D(3)], ["Entwurf A2 · 5", D(4)], ["Entwurf A2 · 6", D(5)]] },
    kapitel: {
        "Allgemeines": { intro: "Kyreth auf einen Blick: leitfähige Böden, Gewitter und grüne Ebenen.", abschnitte: [
            { titel: "Hauptmerkmale", karten: [{ titel: "Bodenmosaik", text: "Erze, Salze, Tone und Schiefer mit stark wechselnder Leitfähigkeit." }, { titel: "Gewitterwelt", text: "Fast tägliche Gewitter in den Tropen." }, { titel: "Feuchte Ebenen", text: "Ursprünglicher Lebensraum der Elektrozoiden." }, { titel: "Starkes Magnetfeld", text: "Rund 1,4-mal so stark wie das der Erde." }] }] },
        "Astronomie": { intro: "Eine Erdzwillingsbahn um den gelben Zwerg Ixar.", abschnitte: [
            { titel: "Zeitrechnung", daten: [["Ortstag", "ca. 21 h"], ["Umlauf", "ca. 290 Erdtage ≈ 330 Ortstage"], ["Mondzyklen", "Ressa: 22 Tage · Ulm: 5,5 Tage"]] },
            { titel: "Am Himmel von Kyreth", text: ["Ixar erscheint etwa so groß wie die Sonne von der Erde, mit etwas wärmerem Licht. Ressa ist ein großer, heller Mond; der kleine Ulm zieht als schneller Lichtpunkt über den Himmel."] }] },
        "Physik": { abschnitte: [{ titel: "Etwas höhere Schwerkraft", text: ["Mit rund 1,1 g ist die Schwerkraft etwas höher als auf der Erde. Der breite, flache Körper der Elektrozoiden mit sechs Laufgliedern hält den Schwerpunkt niedrig und verteilt die Last."] }] },
        "Planetare Struktur": { abschnitte: [{ titel: "Schalenbau", text: ["Kyreth besitzt einen großen, teilweise flüssigen Eisen-Nickel-Kern. Seine kräftige Konvektion erzeugt das starke Magnetfeld."], schichten: [["Böden", "Mosaik aus Erz-, Salz-, Ton- und Graphitböden"], ["Kruste", "Kontinental und ozeanisch, mineralreich"], ["Mantel", "Silikatgestein, aktive Plattentektonik"], ["Kern", "Großer Eisen-Nickel-Kern, starkes Magnetfeld"]] }] },
        "Geografie": { intro: "Feuchte Ebenen, Flussniederungen und Mineralhochländer.", abschnitte: [
            { titel: "Landschaften", karten: [{ titel: "Feuchte Ebenen", text: "Gut leitende, wasserreiche Böden – Kernland der Elektrozoiden." }, { titel: "Flussniederungen", text: "Breite Auen mit Schwemmlandböden." }, { titel: "Mineralhochländer", text: "Erzreiche, trockene Plateaus mit schlecht leitenden Gesteinen." }, { titel: "Salzpfannen", text: "Stark leitende Krusten in Trockengebieten." }, { titel: "Graphitschwellen", text: "Dunkle Schieferzüge mit extremer Leitfähigkeit." }, { titel: "Küstensümpfe", text: "Salzwassermarschen mit wechselnder Leitfähigkeit." }] },
            { titel: "Kontinente", daten: [["Saevra", "Größter Kontinent, tropische Ebenen und Gewittergürtel"], ["Kalven", "Erzreiche Hochländer und Graphitschwellen"], ["Orrun", "Gemäßigte Flusslandschaften"], ["Tessk", "Kühler Südkontinent mit Salzpfannen"]] },
            { titel: "Oberfläche", balken: { werte: [["Ozeane und Binnenmeere", 52], ["Ebenen und Auen", 21], ["Wälder", 12], ["Hochländer und Gebirge", 10], ["Salzpfannen und Wüsten", 5]] } }] },
        "Atmosphäre": { abschnitte: [{ titel: "Elektrisches Wetter", text: ["Über den warmen Ebenen steigen feuchte Luftmassen auf; Eiskristalle und Graupel trennen dabei Ladungen. Das luftelektrische Feld schwankt deshalb stark – für Elektrozoiden ein ständig wechselndes Wetterbild, das sie über ihre Feldhaare wahrnehmen."] }] },
        "Klima": { abschnitte: [{ titel: "Wetter", karten: [{ titel: "Gewittergürtel", text: "Tropische Dauergewitter in der Regenzeit." }, { titel: "Trockenzeiten", text: "Böden verlieren Leitfähigkeit, Kontaktkommunikation wird schwerer." }, { titel: "Überschwemmungen", text: "Regenzeiten setzen Auen weiträumig unter Wasser." }, { titel: "Vegetationsbrände", text: "Blitzschlag entzündet trockene Ebenen." }] }] },
        "Gewässer": { abschnitte: [{ titel: "Gewässer", text: ["Zwei große Ozeane trennen die Kontinente; dazu kommen viele Binnenmeere, Seen und weit verzweigte Flusssysteme. Die Leitfähigkeit des Wassers reicht von nahezu salzfreien Hochlandseen bis zu stark salzigen Küstenlagunen."] }] },
        "Geologie": { abschnitte: [
            { titel: "Mineralische Vielfalt", text: ["Eine aktive Plattentektonik hat Erzgänge, Salzlager und Schieferzüge eng nebeneinander gelegt. Daraus entsteht das kleinräumige Mosaik unterschiedlich leitfähiger Untergründe, das für Wahrnehmung und Kommunikation der Elektrozoiden eine ökologische Rolle spielt."] },
            { titel: "Naturgefahren", liste: ["Extreme Wetterereignisse und Blitzschlag", "Trockenperioden", "Überschwemmungen", "Erdrutsche", "Wald- und Vegetationsbrände", "Umweltgifte aus Erzböden", "Elektrische Störungen bei Sternaktivität"] }] },
        "Biosphäre": { intro: "Leben in einer Welt voller elektrischer Reize.", abschnitte: [
            { titel: "Flora", text: ["Pflanzenähnliche Produzenten bedecken Ebenen und Auen. Manche tragen durch Oberflächenladungen zu den elektrischen Reizen der Umgebung bei – eine elektrische Kommunikation sämtlicher Pflanzen gibt es nicht."] },
            { titel: "Fauna", text: ["Die Elektrozoiden teilen Kyreth mit vielen Tiergruppen. Einige besitzen einfache elektrische Wahrnehmung, andere nutzen ganz andere Sinne. Elektrozoiden sind Teil der natürlichen Nahrungsketten."] }] },
        "Spezies": { intro: "Die Elektrozoiden – intelligente Wesen mit elektrischen Sinnen.", abschnitte: [
            { titel: "Elektrozoiden", bild: D(0), bildtext: "Elektrozoid", text: ["Die Elektrozoiden besitzen einen dreistrahligen, nicht humanoiden Körper mit drei Körperlappen, sechs Laufgliedern und drei Manipulationsorganen. Ein System erkennt elektrostatische Felder in der Luft, ein zweites misst Potentialunterschiede über Kontaktflächen; ein eigenes Organ erzeugt bioelektrische Kommunikationssignale."], verweise: [["Zum Speziesdossier", "inhalte/spezies/Biologische Spezies/Elektrozoiden/hauptseite/Spezies.html"]] },
            { titel: "Ursprüngliche Lebensräume", liste: ["Feuchte Ebenen mit gut leitenden Böden", "Flussniederungen und Auen", "Übergänge zwischen Boden- und Gesteinsarten", "Siedlungen mit Nahrung, Wasser und guten Kommunikationsbedingungen"] }] },
        "Zivilisation": { abschnitte: [{ titel: "Siedlungen", text: ["Frühe Siedlungen entstanden in Regionen mit Nahrung, Wasser und günstigen Kommunikationsbedingungen – oft auf feuchten, gut leitenden Schwemmlandböden. Mit der Technik nahm die Abhängigkeit von den natürlichen Bodeneigenschaften ab; heute verbinden technische Kontaktflächen und Kommunikationsnetze die Städte."] }] },
        "Geschichte": { abschnitte: [{ titel: "Zeitleiste", zeitleiste: [["Frühzeit", "Entstehung der Bodensensorik"], ["Evolution", "Ursprung elektrischer Signale und der Intelligenz"], ["Frühe Gemeinschaften", "Symbolische elektrische Sprache, Sesshaftigkeit"], ["Kulturen", "Frühe politische Systeme"], ["Neuzeit", "Technologische Kommunikation, Industrialisierung, Medizin"], ["Raumfahrt", "Entwicklung der Raumfahrt und interstellare Expansion"]] }] },
        "Fraktionen": { abschnitte: [{ titel: "Beziehungen", text: ["Die Zugehörigkeit der Elektrozoiden zu den Großfraktionen ist noch offen. Mögliche Beziehungen bestehen zu Konföderation, Konsortium, Protektorat, Synaptorat und Ätherwanderern."] }] },
        "Rohstoffe": { abschnitte: [{ titel: "Rohstoffe", karten: [{ titel: "Erze", text: "Eisen-, Kupfer- und Nickelerze der Hochländer." }, { titel: "Graphit", text: "Mächtige Schieferzüge der Kalvenschwelle." }, { titel: "Salze", text: "Salzpfannen und Lagunen des Südens." }, { titel: "Wasser", text: "Reichlich in Flüssen, Seen und Ozeanen." }] }] },
        "Erforschung": { abschnitte: [{ titel: "Offene Fragen", liste: ["Welche Böden prägten die Evolution der Kontaktkommunikation am stärksten?", "Wie beeinflussen Gewitterzyklen die Signalqualität?", "Welche anderen Tiergruppen nutzen elektrische Reize?", "Wie verändert Ixars Aktivität die atmosphärischen Felder?"] }] },
        "Besonderheiten": { abschnitte: [
            { titel: "Einzigartige Welt", liste: ["Kleinräumiges Mosaik leitfähiger Böden", "Gewitterreichste bekannte Heimatwelt einer Spezies", "Starkes Magnetfeld mit häufigen Polarlichtern", "Heimat einer Spezies mit zwei elektrischen Sinnen"] },
            { titel: "Hinweise für Besucher", liste: ["Bei Gewittern Schutzräume aufsuchen", "Elektrische Geräte gegen Feldstörungen absichern", "Kontaktflächen in Siedlungen nicht blockieren"] }] },
        "Medienarchiv": { abschnitte: [] },
    },
};
