// Orvaya · Heimatwelt der Waldfeen (Quellen: orvaya.html-Weltenbaudaten, Info_material/…/WaldFeen V1.1; Planetenwerte abgeleitet)
const F = "assets/bilder/Alle Spezies+Übersicht/Biologische Spezies/WaldFeen/";
const H = F + "hauptseite/", BIO = F + "Unterseite/biologie/assets/bilder/", GS = F + "Unterseite/Gesellschaft/Waldfeen_Gesellschaft_NUR_NEUE_BILDER_SPEC-0001/", GE = F + "Unterseite/Geschichte/";
export default {
    ordner: "orvaya", system: "orvaya-system", planetId: "orvaya-planet",
    name: "Orvaya", genitiv: "von Orvaya", klasse: "Gesteinsplanet", klasseLang: "Gesteinsplanet (Waldwelt ohne Ozeane)",
    spezies: { name: "Waldfeen", gruppe: "Biologische Spezies", ordner: "WaldFeen", unterordner: "Unterseite" },
    intro: "Orvaya ist die Heimat der Waldfeen: ein herbstlich geprägter Waldplanet mit drei Kontinenten, unzähligen Seen und Flüssen, Nebelwäldern und einer besonders sauerstoffreichen Atmosphäre – aber ohne Ozeane.",
    bildtext: "Orvaya – Waldwelt der Waldfeen",
    kurzprofil: ["Orvaya ist ein Gesteinsplanet mit rund 80 % des Erddurchmessers und 0,85 g Schwerkraft. Er umkreist den einzelnen, sonnenähnlichen Stern Aelyra; ein Tag dauert exakt 20 Stunden. Zwei Monde – Silvaine und Neth – begleiten ihn.", "Wasser bedeckt 40 % der Oberfläche, verteilt auf sehr viele Seen und Flusssysteme statt auf Ozeane. Riesenbaumwälder mit mehreren Kronenschichten, Farn-, Moos- und Pilzlandschaften und leuchtende Pflanzen prägen die Lebensräume der Waldfeen."],
    farben: { nacht: "#060d08", tiefe: "#0d1a10", akzent: "#e8b05a", sand: "#e9cf98", moos: "#8fbf6a", ozean: "#6aa9b8", glas: "rgba(14, 26, 16, .74)", "glas-hell": "rgba(26, 42, 28, .8)", linie: "rgba(220, 190, 120, .17)", "linie-hell": "rgba(235, 205, 140, .36)", text: "#f3efe2", leise: "#b0aa94", "aporia-page-tint": "#5a6a2a" },
    werte: {
        temperatur: "ca. 12 °C (Waldfeenregionen 10–20 °C)", temperaturMittel: 12, ozeane: "keine; 40 % Wasserfläche aus Seen und Flüssen",
        atmosphaere: [["Stickstoff", 66.8], ["Sauerstoff", 31], ["Argon", 0.9], ["Wasserdampf (im Mittel)", 1.2], ["Kohlendioxid und Spurengase", 0.1]],
        atmoKurz: "Besonders sauerstoffreich (ca. 31 % O₂)",
        atmoText: "Orvaya besitzt eine besonders sauerstoffreiche Atmosphäre, die an die Umweltbedingungen der irdischen Urzeit erinnert. Der hohe Sauerstoffanteil begünstigt große Pflanzen und Tiere – erhöht aber auch die Brandgefahr in trockenen Zeiten.",
        druck: "ca. 1,15 bar", druckMittel: 1.15, druckDaten: [["Mittlerer Oberflächendruck", "ca. 1,15 bar"], ["Tiefe Schluchten", "ca. 1,2 bar"], ["Kühles Hochland", "ca. 0,9 bar"]],
        rotationH: 20, rotationText: "exakt 20 h", achsneigung: 13, jahreszeiten: "Gering ausgeprägt; regional unterschiedlich, nicht auf allen Kontinenten gleich",
        treibhausText: "Wasserdampf und Spurengase heben die mittlere Temperatur um rund 36 K auf etwa 12 °C; in den Waldfeenregionen liegen die üblichen Werte zwischen 10 und 20 °C.",
        magnetfeldFaktor: 0.8,
        physikExtra: [["Durchmesser im Vergleich", "ca. 80 % der Erde"]],
        extra: [["Wasserbedeckung", "40 % (keine Ozeane)"], ["Kontinente", "drei, ungefähr gleich groß"], ["Landschaftsbild", "herbstlich, häufig leichter Nebel"]],
        vergleichExtra: [["Sauerstoffanteil", 31, 21, "%"], ["Wasserbedeckung", 40, 71, "%"]],
        zonen: { einheit: "°C", min: -20, max: 35, bereiche: [["Polargebiete", -15, 0], ["Kühles Hochland", -2, 10], ["Waldfeenregionen", 10, 20], ["Nebelwälder", 8, 16], ["Warme Tieflandwälder", 16, 28]] },
        zonenText: "Die Temperaturunterschiede zwischen den Jahreszeiten sind in vielen Regionen gering. Die Lebensräume der Waldfeen liegen fast alle im milden Bereich zwischen 10 und 20 °C – extreme Klimaregionen meiden sie.",
        rekorde: [["Größte Bäume", "Bewohnbare Großbäume, Referenzwert ca. 500 m Höhe"], ["Bekanntester Wasserfall", "Fall des großen Flusses aus der Schlucht ins Waldgebiet"], ["Lebensfeindlichste Region", "Kerngebiet des Bruchs"], ["Höchste Region", "Gebirge des kühlen Hochlandkontinents"]],
    },
    bilder: { medien: [["Weltenbaum-Panorama", H + "weltenbaum_panorama.jpg"], ["Wasserfälle und Täler", H + "orvaya_wasserfaelle_und_taeler.jpg"], ["Leuchtpilze und weiße Blüten", H + "leuchtpilze_weisse_blueten.jpg"], ["Traditioneller Wald", H + "gemeinschaft_01_traditioneller_wald.jpg"], ["Fluss- und Feuchtgebiet", H + "gemeinschaft_03_fluss_feuchtgebiet.jpg"], ["Ruinen des Bruchs", H + "der_bruch_ruinen.jpg"], ["Waldfee", H + "waldfee_portraet_hero.jpg"]] },
    kapitel: {
        "Allgemeines": { intro: "Orvaya auf einen Blick: Wälder, Seen, Nebel – und die Narben des Bruchs.", abschnitte: [
            { titel: "Hauptmerkmale", karten: [{ titel: "Waldwelt", text: "Riesenbaumwälder mit mehreren Kronenschichten." }, { titel: "Keine Ozeane", text: "40 % Wasser – verteilt auf Seen und Flüsse." }, { titel: "Sauerstoffreich", text: "Rund 31 % Sauerstoff in der Luft." }, { titel: "Herbstlich", text: "Milde Temperaturen und häufiger Nebel." }] },
            { titel: "Name und Einordnung", text: ["Orvaya ist der Name, den die Waldfeen ihrer Welt geben. Im Archiv zählt der Planet zu den Gesteinsplaneten; Stern und System wurden nach den Sternkatalogen als Aelyra und Orvaya-System verzeichnet."] }] },
        "Astronomie": { intro: "Ein sonnenähnlicher Stern und zwei Monde.", abschnitte: [
            { titel: "Zeitrechnung", daten: [["Ortstag", "exakt 20 h"], ["Umlauf", "375 Erdtage ≈ 449 Ortstage"], ["Mondzyklus", "Silvaine: 27 Tage · Neth: 6,5 Tage"]] },
            { titel: "Am Himmel von Orvaya", text: ["Aelyra erscheint ähnlich groß und hell wie die Sonne von der Erde. Nachts dominiert der helle Mond Silvaine; Neth zieht als kleiner, unregelmäßiger Lichtpunkt schnell über den Himmel. Der Nebelkomet erscheint etwa alle 76 Jahre."] }] },
        "Physik": { abschnitte: [
            { titel: "Geringere Schwerkraft", text: ["Mit 0,85 g ist die Schwerkraft etwas geringer als auf der Erde. Das erleichtert das Klettern, Balancieren und Gleiten der Waldfeen und begünstigt sehr hohe Bäume."] }] },
        "Planetare Struktur": { abschnitte: [
            { titel: "Schalenbau", text: ["Orvaya ist ein erdähnlich aufgebauter Gesteinsplanet mit Eisenkern, Mantel und einer Kruste, die von unterirdischen Wasserreservoirs und Höhlensystemen durchzogen ist."], schichten: [["Kruste", "Fruchtbare Böden, Höhlen und Wasserreservoirs"], ["Mantel", "Silikatgestein"], ["Äußerer Kern", "Flüssiges Eisen, schwächeres Magnetfeld als die Erde"], ["Innerer Kern", "Fester Eisen-Nickel-Kern"]] }] },
        "Geografie": { intro: "Drei Kontinente, viele Seen – und kein Ozean.", kopfbild: H + "orvaya_wasserfaelle_und_taeler.jpg", abschnitte: [
            { titel: "Kontinente", karten: [{ titel: "Zwei Waldkontinente", text: "Großflächig bewaldet und durch eine Landbrücke verbunden." }, { titel: "Hochlandkontinent", text: "Getrennt, kühl, mit Gebirgen und Hochflächen; Schnee ist selten." }, { titel: "Seen und Flüsse", text: "Sehr viele Gewässer, teils durch saisonales Überwasser verbunden." }] },
            { titel: "Landschaftsformen", liste: ["Ausgedehnte Waldgebiete und mehrschichtige Riesenbaumwälder", "Hügelige Wälder", "Täler und kleinere Schluchten", "Natürliche Höhlensysteme", "Weitläufige Wurzellandschaften", "Flüsse und Wasserfälle", "Seen und Feuchtgebiete", "Nebelwälder"] },
            { titel: "Fluss, Schlucht und Wasserfall", text: ["Ein großer Fluss entspringt in einem unterirdischen System und tritt vor einer Schlucht an die Oberfläche, die er über lange Zeit geformt hat. Von den Klippen stürzt er als Wasserfall in das Waldgebiet und verzweigt sich dahinter in Seitenarme und Becken."] },
            { titel: "Flächennutzung", balken: { werte: [["Wälder", 46], ["Seen und Flüsse", 40], ["Hochland und Gebirge", 9], ["Feuchtgebiete", 3], ["Zerstörte Gebiete des Bruchs", 2]] } }] },
        "Atmosphäre": { abschnitte: [
            { titel: "Nebel", text: ["In zahlreichen Waldregionen tritt regelmäßig leichter Nebel auf – durch die Verdunstung großer Wasserflächen, Seen, Flüsse und Wasserfälle sowie durch Temperaturunterschiede zwischen Tälern und höher gelegenen Landschaften."] }] },
        "Klima": { abschnitte: [
            { titel: "Wetter und Jahreszeiten", karten: [{ titel: "Dauerherbst", text: "Die Waldfeenregionen wirken das ganze Jahr herbstlich." }, { titel: "Regionale Jahreszeiten", text: "Nicht auf allen Kontinenten gleich." }, { titel: "Niederschlag", text: "Unterscheidet sich zwischen den Regionen erheblich." }, { titel: "Nebel", text: "Häufig in Tälern und an Gewässern." }] }] },
        "Gewässer": { abschnitte: [
            { titel: "Wasser ohne Ozeane", text: ["Etwa 40 % der Oberfläche sind von Wasser bedeckt – anders als auf der Erde gibt es jedoch keine Ozeane. Das Wasser verteilt sich auf zahlreiche Seen und ausgedehnte Flusssysteme."] },
            { titel: "Wasserkreislauf", liste: ["Höher gelegene Quellgebiete", "Berge des Hochlandkontinents", "Unterirdische Wasserreservoirs", "Große Seen", "Verbundene Flusssysteme und saisonal überlaufende Becken"] }] },
        "Geologie": { abschnitte: [
            { titel: "Geologie", text: ["Orvaya ist geologisch ruhig. Flüsse haben Schluchten und Täler geformt, Wasser hat weitläufige Höhlensysteme ausgewaschen. Gebirge finden sich vor allem auf dem Hochlandkontinent."] },
            { titel: "Umweltgefahren", liste: ["Unkontrollierte biologische Ausbreitungen und ökologische Kettenreaktionen", "Regionen mit großen Raubtieren", "Instabile und geschädigte Gebiete aus der Zeit des Bruchs", "Extreme Klimaregionen außerhalb der Waldfeenlebensräume"] }] },
        "Biosphäre": { intro: "Vielschichtige Wälder, leuchtende Pflanzen und spezialisierte Bestäuber.", kopfbild: H + "leuchtpilze_weisse_blueten.jpg", abschnitte: [
            { titel: "Pflanzenwelt", karten: [{ titel: "Riesenbaumwälder", text: "Mehrere Kronenschichten übereinander." }, { titel: "Farn, Moos und Pilze", text: "Dichte Landschaften am Waldboden." }, { titel: "Biolumineszenz", text: "Leuchtende Pflanzen zur Warnung und Signalgebung." }, { titel: "Gefährliche Pflanzen", text: "Fleischfressende und giftige Arten." }, { titel: "Ufervegetation", text: "Besondere Pflanzen der Feuchtgebiete." }] },
            { titel: "Bekannte Arten", daten: [["Mädesüß", "Heilpflanze der Nebelwälder mit keimhemmendem Saft"], ["Ulmaäde", "Kleiner fliegender Bestäuber, ernährt sich von Mädesüß"]] },
            { titel: "Biologische Vernetzung", text: ["Die Ökosysteme besitzen mehrere biologische Netzwerksysteme. Spezialisierte symbiotische Mikroorganismen unterstützen die Beziehungen zwischen Lebewesen – ein einziges planetenweites Netzwerk gibt es jedoch nicht zwingend."] },
            { titel: "Tierwelt", liste: ["Große landlebende Raubtiere", "Giftige, parasitische oder krankheitsübertragende Kleintiere", "Spezialisierte Bestäubertiere", "Komplexe Nahrungsketten mit vielen spezialisierten Arten"] }] },
        "Spezies": { intro: "Die Waldfeen – eng mit den Wäldern Orvayas verbunden.", abschnitte: [
            { titel: "Waldfeen", bild: H + "waldfee_portraet_hero.jpg", bildtext: "Waldfee", text: ["Die Waldfeen sind die intelligente Spezies Orvayas. Ihre Zivilisation reicht vermutlich Hunderttausende Jahre zurück. Ihre verstärkte Regeneration hängt von geeigneter Vegetation ab – in oder nahe dichten Wäldern unterstützen biologische Signale ihre Heilung."], verweise: [["Zum Speziesdossier", "inhalte/spezies/Biologische Spezies/WaldFeen/hauptseite/Spezies.html"]] },
            { titel: "Grenzen der Ausbreitung", liste: ["Fehlende geeignete Vegetation", "Extreme Temperaturen und ungeeignete Klimazonen", "Gefährliche Tiere und Pflanzen", "Krankheitserreger", "Schwer zugängliche Landschaften", "Begrenzte natürliche Ressourcen"] }] },
        "Zivilisation": { intro: "Siedlungen in lebenden Strukturen.", kopfbild: GS + "01_Hero/gesellschaft_weltbaum_terrassen_wasserfaelle.jpg", abschnitte: [
            { titel: "Die drei Gemeinschaften", bild: GS + "02_Inhalte/gesellschaft_drei_gemeinschaften_triptychon.png", bildtext: "Die drei Gemeinschaften", karten: [{ titel: "Abgelegene Waldgemeinschaft", text: "Hügeliges Waldgebiet; Siedlungen in verschiedenen Baumhöhen, verbunden durch schwer zugängliche Naturwege." }, { titel: "Weltenbaumgemeinschaft", text: "Eine große Baumstruktur mit Wohnbereichen im Stamm, in Ästen und Wurzelregionen." }, { titel: "Fluss- und Feuchtgebietsgemeinschaft", text: "Alltag und Wirtschaft eng mit den Wasserlandschaften verbunden." }] },
            { titel: "Bewohnbare Großbäume", text: ["Auf Orvaya gibt es mehrere außergewöhnlich große Bäume, die von Waldfeengemeinschaften bewohnt werden können. Ihre Wohnräume entstehen aus natürlichen Hohlräumen, gezielter biologischer Formung und teils künstlich gestalteten Räumen."], liste: ["Außergewöhnlich stabile Holzstrukturen", "Zusätzliche innere Hohlräume", "Veränderte Wasser- und Nährstoffversorgung", "Spezialisierte Wohn- und Wirtschaftsbereiche"] },
            { titel: "Verkehrswege", liste: ["Natürliche Waldpfade und Kletterwege", "Ausgebaute Wege und Brücken", "Flüsse und Wasserwege"] }] },
        "Geschichte": { kopfbild: H + "der_bruch_ruinen.jpg", abschnitte: [
            { titel: "Zeitleiste", zeitleiste: [["Frühzeit", "Älteste Spuren der Waldfeen – vermutlich Hunderttausende Jahre alt"], ["Erste Gemeinschaften", "Familien- und Siedlungsverbände entstehen"], ["Großbäume", "Große Baumstrukturen werden zu Siedlungszentren"], ["Vor 1.000–1.500 Jahren", "Der Bruch: Konflikt um Forschungsfreiheit und Naturschutz"], ["Erste Katastrophe", "Ein freigesetzter, veränderter Organismus löst eine Kettenreaktion aus"], ["Zweite Katastrophe", "Eine Naturkatastrophe beendet den Konflikt"], ["Wiederbesiedlung", "Rückkehr, Aufnahme Geflüchteter, Schutzvereinbarungen"], ["Gegenwart", "Drei Gemeinschaften, fortbestehendes Misstrauen"]] },
            { titel: "Das Katastrophengebiet", text: ["Das zentrale Gebiet des Bruchs ist bis heute weitgehend zerstört; Leben ist dort kaum möglich. Biologische Wiederherstellungsmaßnahmen haben einzelne Randgebiete verändert oder geheilt, andere Regionen blieben dauerhaft geschädigt."] }] },
        "Fraktionen": { abschnitte: [
            { titel: "Politische Ordnung", text: ["Auf Orvaya gibt es keine gemeinsame Regierung. Jede Gemeinschaft organisiert sich selbst; nach dem Bruch entstanden Vereinbarungen zum Schutz empfindlicher Ökosysteme und eigene Regeln für biologische Technologien – ein einheitliches Kontrollsystem jedoch nicht."] },
            { titel: "Beziehungen", daten: [["Zwischen den Gemeinschaften", "Gemeinsame Projekte, Tauschhandel, Austausch ökologischen Wissens"], ["Konfliktlinien", "Forschungsfreiheit, Traditionen, Erinnerung an den Bruch"], ["Außerirdische Spezies", "Keine bestätigten Kenntnisse"], ["Interstellare Großmächte", "Den Waldfeen bisher unbekannt"]] }] },
        "Rohstoffe": { abschnitte: [
            { titel: "Natürliche Ressourcen", karten: [{ titel: "Heilpflanzen", text: "Biologisch wirksame Stoffe wie aus dem Mädesüß." }, { titel: "Wasser", text: "Reichlich in Seen und Flüssen." }, { titel: "Fruchtbare Böden", text: "Grundlage für Nahrungspflanzen." }, { titel: "Holz und Fasern", text: "Pflanzliche Werkstoffe." }] },
            { titel: "Bewirtschaftung", text: ["Gemeinschaften züchten und fördern nützliche Pflanzen gezielt und steuern einzelne Lebensräume mit biologischen oder künstlichen Maßnahmen. Empfindliche Ökosysteme werden nur eingeschränkt genutzt."] }] },
        "Erforschung": { abschnitte: [
            { titel: "Offene Fragen", liste: ["Namen und Formen der drei Kontinente", "Lage des Katastrophengebiets", "Wer veränderte die großen Bäume – und wann?", "Wie funktionieren die biologischen Netzwerke?", "Was löste die zweite Katastrophe aus?"] }] },
        "Besonderheiten": { abschnitte: [
            { titel: "Einzigartige Welt", liste: ["Viel Wasser, aber keine Ozeane", "Sauerstoffreiche Luft und riesige Bäume", "Biolumineszente Wälder", "Narben eines biologischen Krieges"] },
            { titel: "Hinweise für Besucher", liste: ["Kein bestätigter Kontakt zu Außenweltlern – Begegnungen vorsichtig angehen", "Offenes Feuer meiden (hoher Sauerstoffanteil)", "Katastrophengebiet nicht betreten", "Gefährliche Pflanzen und Raubtiere außerhalb der Siedlungen"] }] },
        "Medienarchiv": { abschnitte: [] },
    },
};
