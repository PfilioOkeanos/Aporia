// Nhalora · Heimatwelt der Symbionten (Quelle: Info_material/…/Symbionten, 04 Heimatwelt; Planetenwerte abgeleitet)
const B = "assets/bilder/Alle Spezies+Übersicht/Biologische Spezies/Symbionten/";
const G = B + "gesamtdarstellung/";
export default {
    ordner: "planet-der-blauen-binnenmeere", system: "nhalora-system", planetId: "nhalora-planet",
    name: "Nhalora", genitiv: "Nhaloras", klasse: "Gesteinsplanet", klasseLang: "Terrestrischer Lebensplanet",
    intro: "Nhalora ist die Heimatwelt der Symbionten: ein warmer, feuchter Lebensplanet mit Binnenmeeren, Feuchtgebieten, Sümpfen und dicht bewachsenen Ufern, in deren Mikrohabitaten winzige intelligente Wesen lernten, mit größeren Lebewesen zu leben.",
    bildtext: "Nhalora – Planet der blauen Binnenmeere",
    kurzprofil: ["Nhalora ist ein terrestrischer Lebensplanet unter dem gelben Stern Velhar. Umfangreiche Gewässer, flache Binnenmeere und ausgedehnte Feuchtlandschaften prägen die Oberfläche; das Klima ist überwiegend warm und feucht.", "In organischen Sediment- und Uferlandschaften entstanden die ältesten Symbionten – kleine Vielzeller zwischen Pflanzenresten, weichen Böden und Hohlräumen. Die wiederkehrende Nähe größerer Tiere schuf die Voraussetzung für ihre körpergebundene Lebensweise."],
    spezies: { name: "Symbionten", gruppe: "Biologische Spezies", ordner: "Symbionten" },
    farben: { nacht: "#060f0c", tiefe: "#0d1d18", akzent: "#8ff0b8", sand: "#e8cf8a", moos: "#6fcf8f", ozean: "#4fa8c8", glas: "rgba(12, 30, 24, .74)", "glas-hell": "rgba(22, 48, 40, .8)", linie: "rgba(150, 230, 190, .17)", "linie-hell": "rgba(165, 240, 200, .36)", text: "#ecf7f0", leise: "#a1b9ad", "aporia-page-tint": "#2a7a55" },
    werte: {
        temperatur: "ca. 22 °C", temperaturMittel: 22, ozeane: "ca. 68 % der Oberfläche, viele Binnenmeere",
        atmosphaere: [["Stickstoff", 74], ["Sauerstoff", 23], ["Wasserdampf", 1.6], ["Argon und Spurengase", 1.4]],
        atmoKurz: "Stickstoff-Sauerstoff, warm und feucht – atembar",
        atmoText: "Die Atmosphäre ist sauerstoffreich und sehr feucht. Über den Feuchtgebieten liegt fast immer dichter Dunst; der Wasserdampf verstärkt die Treibhauswirkung.",
        druck: "ca. 1,25 bar", druckMittel: 1.25,
        rotationH: 22, rotationText: "ca. 22 h", achsneigung: 12, jahreszeiten: "Schwach; Regen- und Trockenphasen bestimmen den Jahreslauf",
        treibhausText: "Eine feuchte, wasserdampfreiche Atmosphäre erzeugt eine Treibhauswirkung von rund 48 K und hält Nhalora mit etwa 22 °C warm.",
        magnetfeldFaktor: 1.1,
        extra: [["Wasser/Land", "68 % / 32 %"], ["Sauerstoffanteil", "ca. 23 %"], ["Bevölkerung", "ca. 14 Mrd. Symbionten"]],
        vergleichExtra: [["Wasserfläche", 68, 71, "%"]],
        zonen: { einheit: "°C", min: -10, max: 45, bereiche: [["Hochländer", -5, 18], ["Gemäßigte Ufer", 12, 26], ["Feuchtgebiete und Sümpfe", 20, 34], ["Warme Mikrohabitate", 26, 38], ["Trockengebiete", 18, 42]] },
        zonenText: "Die warmen und feuchten Mikrohabitate einiger Regionen ermöglichten die frühe Entwicklung der Symbionten. Austrocknung ist für ihre Brutgebiete die größte Gefahr.",
        rekorde: [["Größtes Binnenmeer", "Meer von Ilvass, ca. 620.000 km²"], ["Größtes Feuchtgebiet", "Sümpfe von Orrhane"], ["Älteste Brutlandschaft", "Ufer von Thessa"], ["Höchste Artenvielfalt", "Uferwälder des Südkontinents"]],
    },
    bilder: { medien: [["Symbionten im Weltenarchiv", B + "Design/Symbionten im Weltenarchiv.png"], ["Biolumineszente Glasglocke über dem Tiefseewirt", G + "Biolumineszente Glasglocke über dem Tiefseewirt-1.png"], ["Nachtsegel des großen Flugwirts", G + "Nachtsegel des großen Flugwirts-23.png"], ["Orgelkiemen im Rücken des Musikers", G + "Orgelkiemen im Rücken des Musikers-15.png"]] },
    kapitel: {
        "Allgemeines": { intro: "Nhalora auf einen Blick: Wasser, Wärme und Leben in Gemeinschaft.", abschnitte: [
            { titel: "Hauptmerkmale", karten: [{ titel: "Binnenmeere", text: "Große, flache Meere im Inneren der Kontinente." }, { titel: "Feuchtgebiete", text: "Sümpfe, Ufer und Sedimentlandschaften." }, { titel: "Wirtsbeziehungen", text: "Viele Tiere besitzen Gewebetaschen für Symbionten." }, { titel: "Mikrozivilisation", text: "Städte im Kleinstmaßstab mit Räumen für große Besucher." }] },
            { titel: "Name und Einordnung", text: ["Der Name Nhalora gilt im Archiv als vorläufig. Der Planet zählt zu den Gesteinsplaneten; sein Stern heißt Velhar."] }] },
        "Astronomie": { abschnitte: [
            { titel: "Himmel über Nhalora", text: ["Velhar erscheint fast wie die Sonne von der Erde, oft hinter feuchtem Dunst. Der große Mond Orra steuert die Gezeiten, der kleine, dunkle Pell zieht in wenigen Stunden als schneller Punkt über den Himmel."] },
            { titel: "Zeitrechnung", daten: [["Ortstag", "ca. 22 h"], ["Ortsjahr", "347 Erdtage ≈ 379 Ortstage"], ["Gezeitenzyklus (Orra)", "20 Erdtage"], ["Brutkalender", "Nach Regenzeit und Orras Gezeiten"]] }] },
        "Physik": { abschnitte: [
            { titel: "Größenverhältnisse", text: ["Für die winzigen Symbionten bestimmen Oberflächenspannung, Feuchtigkeit und Temperatur den Alltag stärker als die Schwerkraft. Ihre Technik arbeitet im mikroskopischen Maßstab, ihre Siedlungen müssen zugleich große Wirte und Besucher aufnehmen."] }] },
        "Planetare Struktur": { abschnitte: [
            { titel: "Schalenbau", text: ["Nhalora ist ein etwas größerer, erdähnlicher Gesteinsplanet mit aktiver Plattentektonik und kräftigem Magnetfeld."], schichten: [["Kruste", "Kontinental 30–45 km, ozeanisch 6–8 km"], ["Oberer Mantel", "Plattentektonik"], ["Unterer Mantel", "Silikatgestein"], ["Äußerer Kern", "Flüssiges Eisen, starkes Magnetfeld"], ["Innerer Kern", "Fester Eisenkern"]] }] },
        "Geografie": { intro: "Binnenmeere, Sümpfe und Uferwälder.", kopfbild: G + "Nebelwiege des jungen Symbionten-16.png", abschnitte: [
            { titel: "Landschaften", karten: [{ titel: "Feuchtgebiete", text: "Ausgedehnte, flache Feuchtlandschaften." }, { titel: "Sumpflandschaften", text: "Dichte Sümpfe voller Leben." }, { titel: "Uferregionen", text: "Dicht bewachsene Ufer an Meeren und Flüssen." }, { titel: "Sedimentlandschaften", text: "Organische Ablagerungen – Ursprung der Symbionten." }, { titel: "Hochländer", text: "Kühlere, trockenere Höhenzüge." }, { titel: "Trockengebiete", text: "Gefahr für Brutgebiete." }] },
            { titel: "Oberflächenanteile", balken: { werte: [["Ozeane", 48], ["Binnenmeere und Seen", 20], ["Feuchtgebiete und Sümpfe", 14], ["Wälder und Tiefland", 10], ["Hochländer und Trockengebiete", 8]] } },
            { titel: "Bedeutende Orte", karten: [{ titel: "Ufer von Thessa", text: "Älteste bekannte Brutlandschaft, streng geschützt." }, { titel: "Meer von Ilvass", text: "Größtes Binnenmeer." }, { titel: "Sümpfe von Orrhane", text: "Größtes Feuchtgebiet, reich an Wirtsarten." }, { titel: "Kammerstadt Vel-Nhar", text: "Sitz der Kammer der Doppelstimmen." }] }] },
        "Atmosphäre": { abschnitte: [
            { titel: "Wetter", karten: [{ titel: "Dunst", text: "Dichter, warmer Dunst über den Feuchtgebieten." }, { titel: "Regenzeiten", text: "Kräftige Regen füllen Sümpfe und Becken." }, { titel: "Gewitter", text: "Häufige Gewitter in den Tropen." }, { titel: "Trockenphasen", text: "Gefährden die Brutgebiete." }] }] },
        "Klima": { abschnitte: [
            { titel: "Klima und Leben", text: ["Das Klima ist regional unterschiedlich, überwiegend aber warm und feucht. Stabile Feuchtigkeit und organische Nährstoffe sind die Voraussetzungen für Brutgebiete – ihr Verlust durch Austrocknung ist eine der größten Gefahren."] }] },
        "Gewässer": { intro: "Meere, Binnenmeere und Feuchtbiotope.", kopfbild: G + "Biolumineszente Glasglocke über dem Tiefseewirt-1.png", abschnitte: [
            { titel: "Wasserreiche Ökosysteme", text: ["Nhalora besitzt zahlreiche wasserreiche Ökosysteme: ausgedehnte Feuchtgebiete, flache Gewässer, Sumpflandschaften und dicht bewachsene Uferregionen. Dort leben Gemeinschaften unterschiedlich großer Organismen."] },
            { titel: "Wasserchemie", text: ["Veränderungen der lokalen Wasserchemie und Verschmutzung empfindlicher Feuchtbiotope bedrohen Brutgebiete und Wirtsarten gleichermaßen."] }] },
        "Geologie": { abschnitte: [
            { titel: "Naturgefahren", liste: ["Austrocknung natürlicher Brutgebiete", "Verschmutzung empfindlicher Feuchtbiotope", "Rückgang geeigneter Wirtsarten", "Veränderungen der Wasserchemie", "Krankheiten in Wirtsbeständen", "Invasive Organismen", "Zerstörung geschützter Brutlandschaften"] }] },
        "Biosphäre": { intro: "Eine Welt der Wechselbeziehungen.", kopfbild: G + "Dämmerkragen am amphibischen Wirt-27.png", abschnitte: [
            { titel: "Natürliche Wirtsarten", text: ["Mehrere Tiergruppen Nhaloras entwickelten spezialisierte Gewebetaschen, die symbiotischen Organismen Schutz boten. Im Gegenzug erhielten die Wirte Vorteile durch die Stoffwechselleistungen ihrer Bewohner. Nicht alle Wirtsarten sind kompatibel."] },
            { titel: "Ökologische Rolle", text: ["Symbionten sind keine allgemeinen Regulatoren der Natur. Sie stehen mit einzelnen Wirtsarten in spezialisierten Wechselbeziehungen, die Gesundheit und Überleben der Wirte beeinflussen – und sind selbst von der Stabilität dieser Beziehungen abhängig."] },
            { titel: "Wirtsbeispiele", karten: [{ titel: "Amphibische Wirte", text: "Wechseln zwischen Wasser und Land." }, { titel: "Flugwirte", text: "Große fliegende Tiere mit Rückenkammern." }, { titel: "Hornträger", text: "Kräftige Landtiere mit Gewebetaschen." }, { titel: "Tiefseewirte", text: "Meeresbewohner der Binnenmeere." }] },
            { titel: "Natürliche Feinde", text: ["Freilebende Jungtiere sind kleinen Räubern, Konkurrenten und ungünstigen Bedingungen ausgesetzt. Erwachsene sind in Wirtskammern besser geschützt, bleiben aber vom Wohl ihres Wirts abhängig."] }] },
        "Spezies": { intro: "Die Symbionten – klein, intelligent, verbunden.", kopfbild: G + "Knochenweber am Hornträger-3.png", abschnitte: [
            { titel: "Symbionten", bild: G + "Faltenstern am grauen Ellbogen-26.png", bildtext: "Faltenstern am grauen Ellbogen", text: ["Die Symbionten sind sehr kleine intelligente Lebewesen, die als Erwachsene meist in Verbindung mit einem Wirt leben. Sie kommunizieren über chemische und mechanische Signale und bilden Brut-, Wirts- und Freigemeinschaften."], verweise: [["Zum Speziesdossier", "inhalte/spezies/Biologische Spezies/Symbionten/hauptseite/Spezies.html"]] },
            { titel: "Lebenszyklus", zeitleiste: [["Ei", "Entwicklung in geschützten, feuchten Brutgebieten"], ["Freilebendes Jungtier", "Zeit größter Gefahr"], ["Wirtsfindung", "Junge Symbionten gelangen in geeignete Wirte"], ["Erwachsenenleben", "In Wirtskammern, zeitweise auch außerhalb aktiv"]] },
            { titel: "Gemeinschaftsformen", karten: [{ titel: "Brutgemeinschaften", text: "Fortpflanzung, Entwicklung und Versorgung junger Individuen." }, { titel: "Wirtsgemeinschaften", text: "Erwachsene in dauerhaften Verbindungen mit Wirten." }, { titel: "Freigemeinschaften", text: "Symbionten, die ohne Wirt leben und arbeiten." }] }] },
        "Zivilisation": { intro: "Eine Mikrozivilisation in Kleinraumkomplexen.", kopfbild: G + "Eisennaht – Symbiont der Bergungsmaschine-12.png", abschnitte: [
            { titel: "Entstehung einer Mikrozivilisation", text: ["Die ersten Siedlungen entstanden in geschützten Brutgebieten. Natürliche Hohlräume wurden erweitert, aus Pflanzenfasern, Harzen, Mineralpartikeln und biologischen Bindestoffen entstand eine eigene Mikroarchitektur. Die Begegnung mit anderen Spezies beschleunigte die Entwicklung erheblich."] },
            { titel: "Bevölkerung", daten: [["Symbionten", "ca. 14 Milliarden"], ["Siedlungsform", "Kleinraumkomplexe in Feucht- und Ufergebieten"], ["Außerhalb", "In Wirtsgemeinschaften mit anderen Spezies"]] },
            { titel: "Moderne Siedlungen", liste: ["Feuchtigkeits- und Temperaturkontrolle", "Künstliche Bruträume", "Medizinische Versorgungsstationen", "Biologische Kommunikationssysteme", "Mikroskopische Produktionsanlagen", "Transportkapseln", "Räume für Besucher größerer Spezies"] },
            { titel: "Kunst", liste: ["Rhythmische Vibrationsfolgen", "Komplexe chemische Kompositionen", "Mikrostrukturierte Skulpturen"] }] },
        "Geschichte": { abschnitte: [
            { titel: "Planetare Frühgeschichte", zeitleiste: [["Entstehung", "Bildung Nhaloras vor rund 4,9 Mrd. Jahren"], ["Feuchte Welt", "Meere, Ufer und organische Sedimente"], ["Kleine Vielzeller", "Leben zwischen Pflanzenresten und Hohlräumen"], ["Wirtsverbindungen", "Lange Koevolution mit größeren Tieren"]] },
            { titel: "Geschichte der Symbionten", zeitleiste: [["Frühe Intelligenz", "Entwicklung in Brutgebieten"], ["Erste Gemeinschaften", "Organisierte Brutgemeinschaften"], ["Kommunikation", "Chemische und mechanische Signale"], ["Erste Siedlungen", "Mikroarchitektur"], ["Politische Strukturen", "Gemeinsame Regeln"], ["Erstkontakt", "Begegnung mit größeren intelligenten Spezies"], ["Technische Zusammenarbeit", "Neue medizinische und technische Möglichkeiten"], ["Zeit der Doppelstimmen", "Kampf um Anerkennung als intelligente Personen"], ["Politische Anerkennung", "Eigene Rechte und die Kammer der Doppelstimmen"], ["Interstellare Ausbreitung", "Symbionten in vielen Zivilisationen"]] },
            { titel: "Die Zeit der Doppelstimmen", text: ["Einige fremde Zivilisationen betrachteten Symbionten zunächst als medizinische Organismen oder biologische Hilfsmittel. Die Symbionten forderten die Anerkennung ihrer Intelligenz und persönlichen Rechte – aus diesen Auseinandersetzungen ging die Zeit der Doppelstimmen hervor."] }] },
        "Fraktionen": { intro: "Die Kammer der Doppelstimmen.", kopfbild: G + "Donnerlot – Drucksymbiont auf amphibischem Wirt-22.png", abschnitte: [
            { titel: "Kammer der Doppelstimmen", text: ["Die Kammer vertritt die Interessen der Symbionten und behandelt Fragen der biologischen Zusammenarbeit mit anderen Spezies. Sie ist keine galaktische Großfraktion."], liste: ["Gemeinsame Rechtsgrundsätze", "Schutz individueller Selbstbestimmung", "Regelungen zu Wirtsbindungen", "Biologische Notfälle", "Politische Mitbestimmung"] },
            { titel: "Freiwillige Wirtsbindung", text: ["Die Aufnahme eines Symbionten durch einen intelligenten Wirt setzt dessen Zustimmung voraus, bei erwachsenen Symbionten auch die eigene. Eine Wirtsvereinbarung regelt Versorgung, biologische Leistungen, medizinische Verantwortung und Trennung."] },
            { titel: "Beziehungen zu den großen Fraktionen", daten: [["Konföderation", "Zusammenarbeit und Anerkennung"], ["Konsortium", "Interesse an Biotechnologie; Konflikte um Patente und Selbstbestimmung"], ["Protektorat", "Fragen militärischer Verwendung"], ["Synaptorat", "Forschung zur Kommunikation"], ["Ätherwanderer", "Einzelne Kontakte"]] }] },
        "Rohstoffe": { abschnitte: [
            { titel: "Rohstoffe", karten: [{ titel: "Organische Nährstoffe", text: "Grundlage der Brutgebiete." }, { titel: "Pflanzenfasern und Harze", text: "Baustoffe der Mikroarchitektur." }, { titel: "Biologische Bindestoffe", text: "Aus Organismen gewonnen." }, { titel: "Biotechnologie", text: "Begehrtes Wissen für Medizin anderer Spezies." }] }] },
        "Erforschung": { abschnitte: [
            { titel: "Offene Fragen", liste: ["Wann genau begann die Koevolution mit den Wirten?", "Welche Wirtsarten sind noch unentdeckt?", "Enthält der Sporengürtel Hinweise auf den Ursprung des Lebens?", "Wie lassen sich bedrohte Brutgebiete langfristig sichern?"] }] },
        "Besonderheiten": { abschnitte: [
            { titel: "Einzigartige Welt", liste: ["Intelligente Wesen im Kleinstmaßstab", "Koevolution von Symbionten und Wirten", "Wirtsbindung nur mit Zustimmung beider Seiten", "Städte für winzige Bewohner und große Gäste zugleich"] },
            { titel: "Hinweise für Besucher", liste: ["Atembare Luft, feuchtwarmes Klima", "Brutgebiete nicht betreten", "Wirtstiere nicht berühren oder stören", "Wirtsbindung nie ohne Vereinbarung"] }] },
        "Medienarchiv": { abschnitte: [] },
    },
};
