// Seyrath · Heimatwelt der Chronoiden (Quelle: Info_material/…/Chronoiden/05_Heimatwelt/heimatwelt-referenz.md, Abschlussdossier V2.0)
// Ergänzt: übrige Körper des Kelira-Systems (siebengliedrige Resonanzkette ohne Gasriesen, Trojaner Tivar, Keliras Schleier, Komet Lichtfuge).
// Hinweis: „Seyrath“ heißt auch die Hauptstadt der Bioluminoiden (Nhalyss) – der Planet hier ist laut Infomaterial die Chronoiden-Heimatwelt.
const H = "assets/bilder/Alle Spezies+Übersicht/Mentale Spezies/Chronoiden/Heimatwelt/";
const G = "assets/bilder/Alle Spezies+Übersicht/Mentale Spezies/Chronoiden/gesamtdarstellung/";
const B = {
    portale: H + "Kosmische Ringportale im türkisfarbenen Tal-1.png",
    tal: H + "Außerirdisches Tal mit leuchtenden Ringportalen-2.png",
    sturm: H + "Chronoidenwelt unter dem Ringsturm-3.png",
    resonanz: H + "Chronoid-Resonanz im Kristalltal-4.png",
    ruinen: H + "APORIA_ Ruinenstadt unter zwei Monden-5.png",
    monolith: H + "Could Alien Relics or Ancient Human Artifacts Be Hiding on the Moon_ _ The Galactic Mind.jpg",
    quellen: H + "Ethiopia – Lalibela, Aksum, the Simien Mountains, the Danakil & the Birthplace of Coffee _ Kaufmann World Travel Factbook.jpg",
    eryd: H + "Explore Alien Species SciFi Art.jpg",
    kueste: H + "How AI is Bringing Realistic Space Phenomena to Life in Games _ by Metrinegaming _ Medium.jpg",
    polar: H + "Proxima Centauri b — Exocosmia.jpg",
    rift: H + "Серия постов «Sci fi landscapes».jpg",
};
export default {
    systemseite: "inhalte/himmelskoerper/sternensysteme/details/kelira-system/hauptseite/index.html",
    ordner: "seyrath", system: "seyrath-system", planetId: "seyrath-planet",
    name: "Seyrath", genitiv: "von Seyrath", klasse: "Gesteinsplanet", klasseLang: "Wasserführender, geologisch aktiver terrestrischer Gesteinsplanet",
    spezies: { name: "Chronoiden", gruppe: "Mentale Spezies", ordner: "Chronoiden", seite: "inhalte/spezies/Mentale Spezies/Chronoiden/hauptseite/Spezies.html" },
    intro: "Seyrath ist die Heimatwelt der Chronoiden – der Eshari. Ein wasserführender, geologisch aktiver Gesteinsplanet mit vier Kontinenten, mineralreichen hydrothermalen Gewässern und natürlichen mineralischen Resonanzsystemen, aus denen nichtbiologisches Bewusstsein hervorging.",
    bildtext: "Seyrath – mineralreiche Meere, Küsten und Eisränder",
    kurzprofil: [
        "Seyrath umkreist den orangefarbenen K3-Stern Kelira in 0,66 AE Abstand und erhält rund 89,5 % der Einstrahlung der Erde. Etwa 42 % der Oberfläche sind von Wasser bedeckt; Küsten-, Binnen-, Hochland-, geothermische und polare Klimaregionen gehen fließend ineinander über.",
        "Seyrath ist kein künstlicher Planet und keine aus Bewusstsein bestehende Welt. Die Entstehung der Chronoiden ist ein außergewöhnlicher, aber natürlicher Vorgang innerhalb seiner planetaren Entwicklung – neben einer eigenständigen organischen Biosphäre.",
    ],
    farben: { nacht: "#06090b", tiefe: "#0c1417", akzent: "#e0a24e", sand: "#d9c08e", moos: "#6fb2a4", ozean: "#2f8f96", glas: "rgba(9, 15, 18, .8)", "glas-hell": "rgba(16, 26, 30, .86)", linie: "rgba(224, 162, 78, .16)", "linie-hell": "rgba(96, 214, 206, .34)", text: "#edf2f1", leise: "#a4b4b3", "aporia-page-tint": "#2f5458" },
    werte: {
        temperatur: "ca. 10 °C", temperaturMittel: 10, ozeane: "ca. 42 % (Meeresbecken, Binnenmeere, Seen)",
        atmosphaere: [["Stickstoff", 79.0], ["Sauerstoff", 17.0], ["Argon", 3.6], ["Kohlendioxid", 0.12], ["Weitere Spurengase", 0.28]],
        atmoKurz: "Stickstoff-Sauerstoff, 1,18 bar",
        atmoText: "Der Sauerstoffpartialdruck liegt näherungsweise bei 0,20 bar; unter geeigneten lokalen Bedingungen ist die Atmosphäre für Menschen grundsätzlich atembar. Reaktive Mineralaerosole, vulkanische Schadgase, Mikroorganismen und örtliche Umweltgefahren müssen dennoch berücksichtigt werden. Der erhöhte Argonanteil geht auf geologische Ausgasung zurück.",
        druck: "ca. 1,18 bar", druckMittel: 1.18, druckDaten: [["Mittlerer Oberflächendruck", "ca. 1,18 bar"], ["Sauerstoffpartialdruck", "ca. 0,20 bar"], ["Wasserdampf", "räumlich und zeitlich schwankend"]],
        rotationH: 29.16, rotationText: "29,16 h Sonnentag (siderisch ca. 29 h)", achsneigung: 14, jahreszeiten: "Gemäßigte astronomische Jahreszeiten; ca. 178 Sonnentage je Jahr",
        treibhausText: "Bei einer planetaren Albedo von rund 0,29 läge die Gleichgewichtstemperatur bei etwa −24 °C. Ein wirksamer atmosphärischer Treibhauseffekt von rund 34 K hebt die globale Mitteltemperatur auf ungefähr 10 °C; Wolken, Wasserverteilung und Oberflächenmaterialien bestimmen die genaue Wärmebilanz.",
        magnetfeldFaktor: 1.2,
        physikExtra: [["Radius im Vergleich", "0,95 Erdradien"], ["Oberflächengravitation", "ca. 9,34 m/s² (0,95 g)"], ["Fluchtgeschwindigkeit", "ca. 10,64 km/s"], ["Magnetfeld", "ca. 35–75 Mikrotesla, mit lokalen Anomalien"]],
        extra: [["Kontinente", "Varenn, Oshavar, Telyss, Eryd"], ["Bevölkerung", "ca. 4,8 Millionen Chronoiden (+ ca. 300.000 außerhalb)"], ["Politische Koordination", "Intervallversammlung, regionale Ankerräte"], ["Mond", "Vesh (ca. 2.600 km Durchmesser)"]],
        vergleichExtra: [["Wasserbedeckung", 42, 71, "%"], ["Argonanteil der Luft", 3.6, 0.93, "%"]],
        zonen: { einheit: "°C", min: -45, max: 50, bereiche: [["Polarklima", -40, -5], ["Hochlandklima (Eryd)", -20, 8], ["Kontinentales Binnenklima", -8, 28], ["Küstenklima (Telyss)", 4, 18], ["Geothermisch beeinflusstes Klima (Oshavar)", 12, 45]] },
        zonenText: "Die Klimazonen sind keine dauerhaft scharf begrenzten Streifen. Ihre Übergänge hängen von Meeresnähe, Höhe und geographischer Lage ab; die geringe Achsneigung von 14° hält die Jahreszeiten gemäßigt.",
        rekorde: [["Bedeutendste Ursprungsregion", "Arel-Tor"], ["Bedeutende Stadt", "Tiral"], ["Älteste Archive", "Kristallines Grundgebirge von Varenn"], ["Mond Vesh", "ca. 335.000 km mittlere Entfernung"]],
    },
    bilder: { medien: [
        ["Kosmische Ringportale im türkisfarbenen Tal", B.portale], ["Tal mit leuchtenden Ringportalen", B.tal], ["Chronoidenwelt unter dem Ringsturm", B.sturm], ["Chronoid-Resonanz im Kristalltal", B.resonanz], ["Ruinenstadt unter zwei Monden", B.ruinen],
        ["Resonanzmonolith in einer Kontaktzone", B.monolith], ["Hydrothermalfeld in Oshavar", B.quellen], ["Staubresistente Lebensformen in Eryd", B.eryd], ["Leitende Adern an der Küste von Telyss", B.kueste], ["Polarlichter über einer Bruchebene", B.polar], ["Basaltrift in Oshavar", B.rift],
        ["Chronoiden-Gesamtdarstellung", G + "CHronoid_designA1.png"], ["Chronoiden-Gesamtdarstellung", G + "Chronoid_design_A6.png"]] },
    kapitel: {
        "Allgemeines": { intro: "Seyrath auf einen Blick: Kristall, Wasser und natürliches nichtbiologisches Bewusstsein.", kopfbild: B.portale, abschnitte: [
            { titel: "Planetare Identität", daten: [["Sternsystem", "Kelira"], ["Planetentyp", "Terrestrischer Gesteinsplanet"], ["Intelligente Heimatspezies", "Chronoiden / Eshari"], ["Organische Biosphäre", "Vorhanden"], ["Nichtbiologische natürliche Lebensformen", "Chronoiden und ihre noch nicht vollständig erforschten Vorläufer"], ["Politischer Status", "Eigenständige planetare Zivilisation"]] },
            { titel: "Hauptmerkmale", karten: [{ titel: "Vier Kontinente", text: "Varenn, Oshavar, Telyss und Eryd." }, { titel: "Mineralische Resonanzsysteme", text: "Natürliche Informationsnetzwerke in besonderen Lagerstätten." }, { titel: "Zwei Lebensformen", text: "Organische Biosphäre und nichtbiologische Chronoiden mit getrennten Ursprüngen." }, { titel: "Kelira-Kette", text: "Seyrath ist das vierte von sieben Gliedern einer Bahnresonanzkette." }] }] },
        "Astronomie": { intro: "Eine Welt im Takt – mitten in Keliras siebengliedriger Resonanzkette.", abschnitte: [
            { titel: "Zeitrechnung", daten: [["Siderische Rotation", "ca. 29 Erdstunden"], ["Mittlerer Sonnentag", "ca. 29,16 Erdstunden"], ["Jahr", "ca. 216,3 Erdtage ≈ 178 Sonnentage"], ["Mondzyklus Vesh", "ca. 24,1 Tage"], ["Großer Takt der Kette", "24 Seyrath-Jahre (ca. 14,2 Erdjahre)"]] },
            { titel: "Die Kelira-Kette", text: ["Sieben Planeten umkreisen Kelira in einer geschlossenen Bahnresonanz: Arun, Velth, Isaru, Seyrath und Doran folgen jeweils im Periodenverhältnis 3:2 aufeinander, Doran, Ombrel und Halvek im Verhältnis 4:3. Alle 24 Seyrath-Jahre stehen die sieben Welten wieder in derselben Anordnung – ein natürlicher Gleichtakt, den chronoidische Astronomen als „Großen Takt“ bezeichnen.", "Einen Gasriesen besitzt das System nicht. Deshalb blieb die äußere Trümmerscheibe – Keliras Schleier – weitgehend ungestört, und das Innere wird nur selten von Kometen getroffen."] },
            { titel: "Gezeiten", text: ["Vesh beeinflusst die Gezeiten und langfristige mechanische Belastungszyklen der Kruste. Für die Entstehung der Chronoiden ist er ein möglicher zusätzlicher Umweltfaktor, jedoch keine zwingende alleinige Voraussetzung."] }] },
        "Physik": { abschnitte: [
            { titel: "Erdähnliche Schwerkraft", text: ["Mit rund 0,95 g ist die Schwerkraft mit der Erde vergleichbar. Seyrath besitzt daher keine extrem niedrige Gravitation, die seine Atmosphäre oder Oberflächengewässer grundsätzlich anders organisieren würde; die Entstehung der Chronoiden hängt nicht von ungewöhnlich geringer Schwerkraft ab."] },
            { titel: "Magnetfeld", text: ["Seyrath besitzt ein globales Magnetfeld mit häufig 35–75 Mikrotesla an der Oberfläche. Lokale mineralische Lagerstätten erzeugen zusätzliche Anomalien. Das Feld ist jedoch kein unbegrenzter Energievorrat für Chronoiden – wichtig sind lokale Energieumwandlungen und stabile Materialstrukturen."] }] },
        "Planetare Struktur": { abschnitte: [
            { titel: "Schalenbau", text: ["Seyrath besitzt eine differenzierte innere Struktur. Seine tektonische Entwicklung ähnelt grundsätzlich den Prozessen terrestrischer Gesteinsplaneten; ungewöhnlich ist die räumliche Häufung bestimmter mineralischer Verbundsysteme."], schichten: [["Kruste", "Feste äußere Kruste mit aktiven Plattengrenzen und mineralischen Verbundsystemen"], ["Mantel", "Silikatischer Mantel"], ["Kern", "Metallischer Kern, erzeugt das globale Magnetfeld"]] }] },
        "Geografie": { intro: "Varenn, Oshavar, Telyss und Eryd.", kopfbild: B.tal, abschnitte: [
            { titel: "Die vier Hauptkontinente", karten: [
                { titel: "Varenn", text: "Alter, stabiler Kontinent mit kristallinem Grundgebirge; Verwaltung, historische Archive, Präzisionsfertigung." },
                { titel: "Oshavar", text: "Riftzonen und geothermische Gebiete; Ursprungsforschung, geochemische Energiegewinnung." },
                { titel: "Telyss", text: "Küstenregionen, Sedimentbecken, Grundwassersysteme; Lebensraum ursprünglicher Küstenleiter." },
                { titel: "Eryd", text: "Kristalline Hochländer, trockene Binnenbecken, tiefe Täler; Heimat der Hochlandcluster." }] },
            { titel: "Bedeutende Regionen", daten: [["Arel-Tor", "Bedeutendste bekannte Ursprungsregion, unter besonderem Schutz"], ["Tiral", "Politisches und kulturelles Zentrum"], ["Riftgebiete Oshavars", "Hydrothermale Systeme und mineralische Kontaktzonen"], ["Küsten von Telyss", "Mineralische Gewässer und ionische Leitungsstrukturen"], ["Hochlandarchive Eryds", "Trockene Resonanzregionen und Beobachtungsstandorte"]] },
            { titel: "Küsten von Telyss", bild: B.kueste, bildtext: "Leitende Adern an der Küste von Telyss", text: ["Die chemische Vielfalt der Küsten und Sedimentbecken von Telyss ist besonders relevant für die Entwicklung ursprünglicher Küstenleiter – Individuen aus salzhaltigen Sedimenten und Grundwassersystemen."] }] },
        "Atmosphäre": { abschnitte: [
            { titel: "Atmungsbedingungen", text: ["Die Atmosphäre ist nicht überall ohne Schutzmaßnahmen sicher: Reaktive Mineralaerosole, vulkanische Schadgase, biologische Mikroorganismen und örtliche Umweltgefahren müssen berücksichtigt werden."] }] },
        "Klima": { kopfbild: B.sturm, abschnitte: [
            { titel: "Wetter und Stürme", karten: [{ titel: "Elektrische Gewitter", text: "Starke lokale elektrische Felder und Entladungen." }, { titel: "Mineralstaubstürme", text: "Vor allem in trockenen Binnengebieten; belasten empfindliche Technik." }, { titel: "Polare Leuchterscheinungen", text: "Magnetosphärische und atmosphärische Prozesse." }, { titel: "Geothermische Dampfgebiete", text: "Heiße Quellen und Gasaustritte verändern Wetter und Sicht." }] },
            { titel: "Polarklima", bild: B.polar, bildtext: "Polarlichter über einer Bruchebene", text: ["Kalte Regionen mit saisonaler Schnee- und Eisbedeckung und sichtbaren Polarlichtern."] }] },
        "Gewässer": { abschnitte: [
            { titel: "Wasserhaushalt", liste: ["Mehrere Meeresbecken", "Große Binnenmeere", "Fluss- und Seensysteme", "Unterirdische Aquifere", "Mineralreiche hydrothermale Gewässer", "Regionale Eis- und Schneereservoire"] },
            { titel: "Mineralreiche Flüssigkeitssysteme", bild: B.quellen, bildtext: "Hydrothermalfeld in Oshavar", text: ["Für die frühe Entwicklung der Chronoiden waren besonders mineralreiche Flüssigkeitssysteme bedeutend: Sie transportierten Ionen, ermöglichten chemische Reaktionen und beeinflussten die Bildung leitfähiger mineralischer Strukturen. Chronoiden sind dadurch nicht grundsätzlich aquatische Lebewesen."] }] },
        "Geologie": { kopfbild: B.resonanz, abschnitte: [
            { titel: "Mineralische Resonanzsysteme", text: ["Die komplexen natürlichen Informationsnetzwerke sind Seyraths außergewöhnlichstes planetologisches Merkmal. Geeignete Lagerstätten müssen stabile Speicherzustände, Energiezufuhr, Rückkopplungen und hinreichende physikalische Verbindungen ermöglichen. Nicht jede magnetische, leitfähige oder piezoelektrische Formation besitzt diese Eigenschaften."] },
            { titel: "Riftgebiete", bild: B.rift, bildtext: "Basaltrift in Oshavar", text: ["Aktive Plattengrenzen, Bruchzonen, Vulkanfelder und hydrothermale Gebiete prägen die Oberfläche – besonders auf Oshavar, wo wichtige Fundstellen früher Informationsnetzwerke liegen."] },
            { titel: "Planetare Gefahren", liste: ["Erdbeben", "Vulkanische Ausbrüche", "Instabile Hohlräume", "Überspannungen und induzierte elektrische Ströme", "Korrosion", "Reaktive Mineralstäube", "Lokale giftige Gasfreisetzungen", "Überhitzung empfindlicher Träger", "Zerstörung geologischer Informationsarchive"] }] },
        "Biosphäre": { intro: "Organisches Leben – unabhängig von den Chronoiden.", abschnitte: [
            { titel: "Ökologische Gruppen", karten: [{ titel: "Mineralmattenbildner", text: "Gemeinschaften in mineralreichen Feuchtgebieten und Gewässern." }, { titel: "Bodenorganismen", text: "Angepasst an wechselnde chemische und thermische Bedingungen." }, { titel: "Gewässerfiltrierer", text: "Flache Meeres- und Binnenwasserbereiche." }, { titel: "Staubresistente Pflanzenanaloga", text: "Niedrige, sessile Lebewesen trockener Mineralböden." }, { titel: "Hochlandorganismen", text: "Anpassungen an Kälte, Wind und mineralische Oberflächen." }] },
            { titel: "Trockene Lebensräume", bild: B.eryd, bildtext: "Staubresistente Lebensformen in Eryd", text: ["Die organischen Ökosysteme verändern durch mikrobielle Stoffwechselprozesse die mineralischen Bedingungen und beeinflussen damit indirekt auch natürliche Resonanzregionen. Chronoiden benötigen diese Organismen jedoch nicht als Wirte – beide Lebensformen besitzen getrennte evolutionäre Ursprünge."] }] },
        "Spezies": { intro: "Die Chronoiden – Bewusstsein in mineralischen Resonanzsystemen.", abschnitte: [
            { titel: "Chronoiden (Eshari)", bild: G + "CHronoid_designA1.png", bildtext: "Chronoiden", text: ["Die Chronoiden sind mentale, nichtbiologische Lebensformen: materiell gebundene Resonanz- und Informationssysteme mit typischerweise 0,5–5 Meter Kernabmessung und ohne feste biologische Lebensgrenze. Ihre Hauptbesonderheit ist eine extrem veränderliche subjektive Zeitwahrnehmung – sie manipulieren die Zeit jedoch nicht physikalisch."], verweise: [["Zum Speziesdossier", "inhalte/spezies/Mentale Spezies/Chronoiden/hauptseite/Spezies.html"]] },
            { titel: "Natürliche Formgruppen", karten: [{ titel: "Rissanker", text: "Tief gelegene geothermische Resonanzindividuen (Oshavar)." }, { titel: "Küstenleiter", text: "Individuen aus salzhaltigen Sedimenten und Grundwassersystemen (Telyss)." }, { titel: "Hochlandcluster", text: "Individuen aus stabilen kristallinen Gesteinsformationen (Eryd)." }] },
            { titel: "Bevölkerung", daten: [["Chronoiden auf Seyrath", "ca. 4,8 Millionen"], ["Außerhalb des Planeten", "ca. 300.000"]] }] },
        "Zivilisation": { intro: "Trägerbereiche, Archive und Resonanzkammern.", kopfbild: B.ruinen, abschnitte: [
            { titel: "Tiral", text: ["Tiral ist eines der wichtigsten politischen und kulturellen Zentren Seyraths. Die Stadt besteht nicht hauptsächlich aus Wohnhäusern, sondern aus verbundenen Trägerbereichen, Kommunikationsanlagen, Energiezentren, wissenschaftlichen Instituten und geschützten Archivsystemen. Für fremde Besucher gibt es gesonderte Einrichtungen mit geeigneten atmosphärischen, thermischen und technischen Bedingungen."] },
            { titel: "Architektur", liste: ["Geschützte Resonanzkammern", "Energieverteilungszentren", "Kühl- und Wärmespeicheranlagen", "Archive und Kommunikationsknoten", "Trägerwerkstätten und mobile Trägerstationen", "Wissenschaftliche Messanlagen", "Einrichtungen zur sicheren Entstehung neuer Individuen"] },
            { titel: "Politische Ordnung", text: ["Die Intervallversammlung koordiniert überregionale Fragen, lokale Ankerräte verwalten regionale Gemeinschaften und Einrichtungen. Die politische Ordnung ist nicht vollständig zentralisiert."] }] },
        "Geschichte": { abschnitte: [
            { titel: "Planetare und chronoidische Geschichte", zeitleiste: [["vor ca. 1,4 Mio. Jahren", "Vorläufer mineralischer Informationsnetzwerke"], ["vor ca. 420.000 Jahren", "Erste bewusste Chronoiden"], ["vor ca. 96.000 Jahren", "Erste größere Gemeinschaftsstrukturen"], ["vor ca. 40.000 Jahren", "Große Resonanzzentren"], ["vor ca. 25.000 Jahren", "Älteste erhaltene systematische Archive"], ["vor ca. 8.600 Jahren", "Der Große Versatz"], ["vor ca. 3.200 Jahren", "Die Stille Fuge"], ["vor ca. 1.300 Jahren", "Beginn der Orbitalraumfahrt"], ["vor ca. 480 Jahren", "Interstellarer Erstkontakt"]] },
            { titel: "Zwei Katastrophen", text: ["Der Große Versatz betraf wichtige Kommunikations- und Resonanzregionen; die Stille Fuge führte zu einer großen technischen und gesellschaftlichen Synchronisationskrise. Beide Ereignisse prägten den Umgang mit gemeinsamer Infrastruktur und personenbezogenen Informationssystemen."] }] },
        "Fraktionen": { abschnitte: [
            { titel: "Beziehungen", text: ["Seyrath ist eine eigenständige Heimatwelt. Die Chronoiden unterhalten Beziehungen zu Konföderation (Forschung, Vermittlung, Rechtsstandards), Konsortium (Trägertechnologie, Speichertechnik, Resonanzmaterialien), Protektorat (begrenzte Sicherheits- und Forschungsabkommen), Synaptorat (gemeinsame Forschungsinteressen – die Chronoiden sind jedoch keine Erzeugnisse des Synaptorats) und den Ätherwanderern."] }] },
        "Rohstoffe": { abschnitte: [
            { titel: "Lagerstätten", liste: ["Eisenoxide und andere Eisenminerale", "Kupferhaltige Erze", "Nickelsulfide", "Magnetisch aktive Minerale", "Quarz und weitere Silikate", "Piezoelektrisch geeignete Materialphasen", "Hydrothermal gebildete Mineralverbände", "Technisch nutzbare Keramikrohstoffe"] },
            { titel: "Wirtschaft", text: ["Wichtige Exportbereiche sind spezialisierte Kommunikationssysteme, Präzisionssensorik, Speichertechnik und einzelne Resonanzmaterialien. Die wirtschaftliche Nutzung darf geschützte Bewusstseinsregionen nicht unkontrolliert beschädigen."] }] },
        "Erforschung": { kopfbild: B.tal, abschnitte: [
            { titel: "Schutzgebiete", liste: ["Historische Resonanzregionen", "Aktive natürliche Chronoidenkerne", "Potenziell bewusstseinsfähige neue Strukturen", "Geologische Archive", "Organische Ökosysteme", "Ungewöhnlich seltene Mineralbildungsgebiete"] },
            { titel: "Schutzstatus Arel-Tors", bild: B.monolith, bildtext: "Resonanzstruktur in einer Kontaktzone", text: ["In Arel-Tor sind tiefgreifender Rohstoffabbau, starke elektromagnetische Eingriffe und die unkontrollierte Entfernung bedeutender Mineralstrukturen eingeschränkt. Forschung braucht unabhängige Genehmigungen – zum Schutz des wissenschaftlichen Erbes und möglicher lebender Resonanzsysteme."] },
            { titel: "Wissenschaftliche Bedeutung", text: ["Seyrath ist eine der wichtigsten bekannten Forschungswelten für natürliche nichtbiologische Intelligenz. Raumhäfen liegen bevorzugt außerhalb besonders empfindlicher Resonanzregionen."] }] },
        "Besonderheiten": { abschnitte: [
            { titel: "Einzigartige Welt", liste: ["Natürlich entstandenes nichtbiologisches Bewusstsein", "Mineralische Resonanzsysteme als planetologisches Merkmal", "Organische Biosphäre mit getrenntem Ursprung", "Mittleres Glied einer siebenfachen Resonanzkette"] },
            { titel: "Hinweise für Besucher", liste: ["Atemluft lokal prüfen – Mineralaerosole und Schadgase", "Arel-Tor nur mit Genehmigung betreten", "Elektrische Gewitter und Überspannungen beachten", "Besuchereinrichtungen in Tiral nutzen"] }] },
        "Medienarchiv": { abschnitte: [] },
    },
};
