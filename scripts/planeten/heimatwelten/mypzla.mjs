// Mypzla · Ursprungswelt der Mykonoiden (Quelle: Info_material/…/Mykonoiden – nur Name festgelegt; Planetenwerte aus der Speziesbiologie abgeleitet)
const M = "assets/bilder/Alle Spezies+Übersicht/Biologische Spezies/Mykonoiden/";
const G = M + "Gesamtdarstellung/", B = M + "Biologie/";
export default {
    ordner: "lebender-goldplanet-mit-pilzplateaus", system: "mypzla-system", planetId: "mypzla-planet",
    name: "Mypzla", genitiv: "von Mypzla", klasse: "Gesteinsplanet", klasseLang: "Feuchtwarme Super-Erde mit Myzelbiosphäre",
    spezies: { name: "Mykonoiden", gruppe: "Biologische Spezies", ordner: "Mykonoiden", seite: "inhalte/spezies/Biologische Spezies/Mykonoiden/hauptseite/hauptseite.html" },
    intro: "Mypzla ist die Ursprungswelt der Mykonoiden: eine warme, feuchte Welt, deren Kontinente von goldfarbenen Myzelteppichen und riesigen Pilzplateaus überzogen sind. Ein feiner Sporendunst lässt den Himmel golden schimmern.",
    bildtext: "Mypzla – lebender Goldplanet mit Pilzplateaus",
    kurzprofil: ["Mypzla ist eine Super-Erde im Ombrys-System, etwas größer und schwerer als die Erde. Unter dem orangefarbenen Licht ihres Sterns herrscht ein feuchtwarmes Klima; eine dichte, wasserdampfreiche Atmosphäre hält die Wärme fest.", "Statt Wäldern bestimmen Pilze und Myzelnetze das Leben: Myzelteppiche bedecken weite Ebenen, Pilzplateaus wachsen zu gewaltigen Stufenlandschaften heran. Hier entstanden die ersten stationären Myzelgemeinschaften der Mykonoiden."],
    farben: { nacht: "#0c0905", tiefe: "#1a140a", akzent: "#f0c04a", sand: "#e6cf98", moos: "#b8a05a", ozean: "#7aa8a0", glas: "rgba(30, 22, 10, .74)", "glas-hell": "rgba(48, 36, 16, .8)", linie: "rgba(240, 200, 110, .17)", "linie-hell": "rgba(250, 215, 130, .36)", text: "#f6f0e2", leise: "#b9ad92", "aporia-page-tint": "#7a5a1a" },
    werte: {
        temperatur: "ca. 26 °C", temperaturMittel: 26, ozeane: "flache Binnenmeere, Sümpfe und Feuchtsenken (ca. 45 %)",
        atmosphaere: [["Stickstoff", 74], ["Sauerstoff", 18], ["Wasserdampf", 4], ["Kohlendioxid", 2.5], ["Argon", 1], ["Spurengase und Sporenaerosole", 0.5]],
        atmoKurz: "Dicht, feucht, mit goldfarbenem Sporendunst",
        atmoText: "Die Atmosphäre ist dicht und sehr feucht. Neben Stickstoff und Sauerstoff enthält sie viel Wasserdampf, etwas mehr Kohlendioxid als die Erde und ständig schwebende Pilzsporen. Dieser Sporendunst streut das orangefarbene Sternlicht und färbt den Himmel golden.",
        druck: "ca. 1,6 bar", druckMittel: 1.6, druckDaten: [["Mittlerer Oberflächendruck", "ca. 1,6 bar"], ["Pilztiefländer", "ca. 1,8 bar"], ["Plateauhöhen", "ca. 1,2 bar"]],
        rotationH: 31, rotationText: "ca. 31 h", achsneigung: 9, jahreszeiten: "Schwach ausgeprägt; Wechsel von Regen- und Sporenzeiten",
        treibhausText: "Die dichte, wasserdampf- und kohlendioxidreiche Atmosphäre erzeugt eine Treibhauswirkung von rund 58 K und heizt die Oberfläche auf etwa 26 °C auf.",
        magnetfeldFaktor: 1.1,
        physikExtra: [["Durchmesser im Vergleich", "ca. 108 % der Erde"]],
        extra: [["Luftfeuchtigkeit", "meist über 85 %"], ["Prägende Lebensform", "Pilze und Myzelnetze"], ["Lichtfarbe", "orange-golden"]],
        vergleichExtra: [["Luftfeuchtigkeit (Mittel)", 88, 60, "%"]],
        zonen: { einheit: "°C", min: 0, max: 45, bereiche: [["Polare Moorsteppen", 5, 15], ["Plateauhöhen", 14, 22], ["Myzelebenen", 20, 30], ["Pilztiefländer", 24, 34], ["Äquatoriale Dampfsümpfe", 30, 40]] },
        zonenText: "Fast der ganze Planet ist warm und feucht. Mykonoiden bevorzugen die Myzelebenen und Pilztiefländer mit hoher Feuchtigkeit und reichem Substrat; zu trockene oder zu heiße Gebiete meiden sie.",
        rekorde: [["Größtes Myzelnetz", "Myzelebene von Thaurum, über 2.000 km Ausdehnung"], ["Höchstes Pilzplateau", "Goldstufen, ca. 1.800 m über den Tiefländern"], ["Ältester Myzelorganismus", "Mehrere zehntausend Jahre alt (geschätzt)"], ["Dichtester Sporendunst", "Äquatoriale Dampfsümpfe zur Sporenzeit"]],
    },
    bilder: { medien: [["Biolumineszente Mykonoidin im Pilzwald", G + "Biolumineszente Mykonoidin im Pilzwald.png"], ["Mykonoid", G + "Mykonoid_1.png"], ["Mykonoid – Ganzkörper", G + "Mykonoid_2 (1080 x 1620 px).png"], ["Körperaufbau", B + "koerperaufbau.png"], ["Körpervarianten", B + "koerpervarianten.png"], ["Lebenskern", B + "lebenskern.png"]] },
    kapitel: {
        "Allgemeines": { intro: "Mypzla auf einen Blick: Myzel, Pilzplateaus und goldener Himmel.", abschnitte: [
            { titel: "Hauptmerkmale", karten: [{ titel: "Myzelbiosphäre", text: "Pilze und Myzelnetze statt Wälder." }, { titel: "Pilzplateaus", text: "Gewaltige, stufenförmige Pilzlandschaften." }, { titel: "Feuchtwarm", text: "Rund 26 °C und meist über 85 % Luftfeuchtigkeit." }, { titel: "Goldener Himmel", text: "Sporendunst streut das orangefarbene Licht." }] },
            { titel: "Name und Einordnung", text: ["Mypzla ist der Name der Ursprungswelt der Mykonoiden. Für sie ist der Planet vor allem als Herkunftswelt von wissenschaftlicher Bedeutung; die persönliche Bindung an ihn ist unterschiedlich stark ausgeprägt."] }] },
        "Astronomie": { intro: "Eine warme Welt im Licht eines orangefarbenen Sterns.", abschnitte: [
            { titel: "Zeitrechnung", daten: [["Ortstag", "ca. 31 h"], ["Umlauf", "222 Erdtage ≈ 172 Ortstage"], ["Mondzyklus", "Vael: 19 Tage"]] },
            { titel: "Am Himmel von Mypzla", text: ["Ombrys erscheint größer als die Sonne von der Erde, aber orangefarben und weniger grell. Durch den Sporendunst wirkt er oft wie eine verschwommene goldene Scheibe. Nachts ist der Mond Vael deutlich zu sehen."] }] },
        "Physik": { abschnitte: [
            { titel: "Etwas höhere Schwerkraft", text: ["Mit rund 1,1 g ist die Schwerkraft etwas höher als auf der Erde. Pilzstrukturen wachsen deshalb eher breit und stufenförmig in die Fläche als schlank in die Höhe – daraus entstehen die typischen Plateaus."] }] },
        "Planetare Struktur": { abschnitte: [
            { titel: "Schalenbau", text: ["Mypzla ist ein erdähnlich aufgebauter Gesteinsplanet. Seine Böden sind außergewöhnlich tief verwittert und von organischem Material durchzogen."], schichten: [["Myzelboden", "Tiefe, organisch durchwachsene Bodenschicht"], ["Kruste", "Verwittertes Gestein, mineralreich"], ["Mantel", "Silikatgestein, aktive Plattentektonik"], ["Kern", "Eisen-Nickel-Kern, Magnetfeld etwas stärker als das der Erde"]] }] },
        "Geografie": { intro: "Myzelebenen, Pilzplateaus und Feuchtsenken.", kopfbild: G + "Biolumineszente Mykonoidin im Pilzwald.png", abschnitte: [
            { titel: "Landschaften", karten: [{ titel: "Myzelebenen", text: "Weite, von goldenen Myzelteppichen bedeckte Flächen." }, { titel: "Pilzplateaus", text: "Stufenlandschaften aus verholzten Riesenpilzen." }, { titel: "Pilztiefländer", text: "Feuchte Senken mit dichtem Bewuchs." }, { titel: "Binnenmeere", text: "Flache, warme Gewässer mit Algen- und Pilzrändern." }, { titel: "Dampfsümpfe", text: "Heiße, nebelreiche Äquatorgebiete." }, { titel: "Moorsteppen", text: "Kühlere Polargebiete." }] },
            { titel: "Flächennutzung", balken: { werte: [["Binnenmeere und Sümpfe", 45], ["Myzelebenen", 24], ["Pilzplateaus", 14], ["Pilztiefländer", 10], ["Gebirge und Ödland", 7]] } }] },
        "Atmosphäre": { abschnitte: [
            { titel: "Sporendunst", text: ["Zu den Sporenzeiten steigt die Sporendichte der Luft stark an. Mykonoiden können die Freisetzung ihrer eigenen Sporen weitgehend bewusst steuern – die natürlichen Sporenwolken der Pilzlandschaften jedoch nicht."] }] },
        "Klima": { abschnitte: [
            { titel: "Wetter", karten: [{ titel: "Warmer Dauerregen", text: "Häufige, milde Niederschläge." }, { titel: "Nebel", text: "Morgendlicher Dunst über Ebenen und Senken." }, { titel: "Sporenzeiten", text: "Dichter goldener Dunst, oft wochenlang." }, { titel: "Gewitter", text: "Heftige Gewitter über den Dampfsümpfen." }] }] },
        "Gewässer": { abschnitte: [
            { titel: "Gewässer", text: ["Mypzla besitzt keine tiefen Ozeane, aber zahlreiche flache Binnenmeere, Sümpfe und Feuchtsenken, die zusammen fast die Hälfte der Oberfläche bedecken. Myzelnetze transportieren Wasser auch weit in trockenere Gebiete."] }] },
        "Geologie": { abschnitte: [
            { titel: "Geologie", text: ["Eine aktive Plattentektonik liefert über vulkanische Böden immer neue Mineralien – die Grundlage für die nährstoffreichen Substrate, auf die Pilze und Mykonoiden angewiesen sind."] },
            { titel: "Gefahren", liste: ["Schwere Krankheiten und Schäden an Myzelgemeinschaften", "Austrocknung einzelner Regionen", "Dichte Sporenwolken für andere Lebensformen", "Gewitter und Überschwemmungen in den Tiefländern"] }] },
        "Biosphäre": { intro: "Eine Welt, die von Pilzen getragen wird.", kopfbild: G + "bild4.png", abschnitte: [
            { titel: "Myzelbiosphäre", text: ["Auf Mypzla übernehmen Pilze die Rolle, die auf der Erde Wälder spielen. Unterirdische Myzelnetze verbinden ganze Landschaften, tauschen Wasser und Nährstoffe aus und zersetzen abgestorbenes Material."] },
            { titel: "Lebensformen", karten: [{ titel: "Riesenpilze", text: "Verholzte Fruchtkörper bilden die Plateaus." }, { titel: "Leuchtpilze", text: "Biolumineszenz in den Pilzwäldern." }, { titel: "Myzelteppiche", text: "Goldfarbene Netze über weiten Ebenen." }, { titel: "Sporenfresser", text: "Kleine Tiere, die sich von Sporen ernähren." }] }] },
        "Spezies": { intro: "Die Mykonoiden – intelligente Myzelwesen.", abschnitte: [
            { titel: "Mykonoiden", bild: G + "Mykonoid_1.png", bildtext: "Mykonoid", text: ["Die Mykonoiden sind eine alte intelligente Spezies, deren Geschichte mit dauerhaften Myzelgemeinschaften begann. Ihre Körper sind beweglich; geeignete Myzelverbindungen können sie zeitweise mit einem Substrat oder mit anderen Individuen verbinden."], verweise: [["Zum Speziesdossier", "inhalte/spezies/Biologische Spezies/Mykonoiden/hauptseite/hauptseite.html"]] },
            { titel: "Biologische Bedürfnisse", liste: ["Geeignete Nährstoffquellen", "Feuchtigkeit", "Nutzbares Substrat für Myzelanschlüsse", "Kontrollierte Sporenfreisetzung"] },
            { titel: "Kommunikation", text: ["Ihre Sprache beruht auf Berührung, Vibration und chemischen Signalen. Kompatible Myzelverbindungen können Wasser, Nährstoffe und einfache Signale übertragen – ohne Pflicht zur Verbindung und ohne Gedankenlesen."] }] },
        "Zivilisation": { intro: "Von stationären Myzelgemeinschaften zur Zivilisation.", abschnitte: [
            { titel: "Entwicklung", karten: [{ titel: "Stationäre Gemeinschaften", text: "Feste Versorgungsgebiete für die frühen Mykonoiden." }, { titel: "Familiengruppen", text: "Zusammenschluss zu größeren Siedlungen." }, { titel: "Bildung", text: "Systematische Weitergabe von Wissen." }, { titel: "Biotechnik", text: "Nährstoffgewinnung, Landwirtschaft, Medizin." }] },
            { titel: "Mypzla heute", text: ["Viele Mykonoiden leben heute auf anderen Welten und in eigenen Kolonien. Auf Mypzla bestehen weiterhin Gemeinschaften; die Bindung an die Herkunftswelt ist von Gemeinschaft zu Gemeinschaft unterschiedlich stark."] }] },
        "Geschichte": { abschnitte: [
            { titel: "Zeitleiste", zeitleiste: [["Frühzeit", "Entstehung stationärer Myzelgemeinschaften"], ["Frühe Zivilisation", "Familiengruppen schließen sich zu Siedlungen zusammen"], ["Wissensentwicklung", "Bildung und Forschung werden zentral"], ["Biologische Verfahren", "Landwirtschaft, Kultivierung und Medizin"], ["Erstkontakt", "Fremde Spezies entdecken die Mykonoiden"], ["Interstellare Reisen", "Mit fremden Raumschiffen ins All"], ["Kolonisation", "Gemeinschaften und Kolonien auf anderen Welten"], ["Biologische Krisen", "Krankheiten und Schäden an Myzelgemeinschaften, Umsiedlungen"], ["Gegenwart", "Verschiedene Gemeinschaften mit gemeinsamer Herkunft"]] }] },
        "Fraktionen": { abschnitte: [
            { titel: "Beziehungen zu den Großmächten", daten: [["Konföderation", "Viele mykonoidische Gemeinschaften gehören ihr an"], ["Konsortium", "Von Zusammenarbeit bis zu Konflikten"], ["Protektorat", "Nur einzelne Mykonoiden in Gilden"], ["Synaptorat", "Bewusst keine Mitgliedschaft"], ["Ätherwanderer", "Keine Beziehungen"]] }] },
        "Rohstoffe": { abschnitte: [
            { titel: "Rohstoffe", karten: [{ titel: "Biologische Materialien", text: "Kultivierte Pilzstoffe für Bau und Handwerk." }, { titel: "Medizinische Wirkstoffe", text: "Grundlage mykonoidischer Biomedizin." }, { titel: "Nährsubstrate", text: "Mineralreiche vulkanische Böden." }, { titel: "Wasser", text: "Reichlich in Binnenmeeren und Sümpfen." }] }] },
        "Erforschung": { abschnitte: [
            { titel: "Offene Fragen", liste: ["Wie alt sind die ältesten Myzelnetze?", "Wo lagen die ersten stationären Gemeinschaften?", "Brachten Kometen wie der Goldschweif organische Bausteine?", "Welche Erreger verursachten die historischen Krisen?"] }] },
        "Besonderheiten": { abschnitte: [
            { titel: "Einzigartige Welt", liste: ["Pilze statt Wälder als tragende Lebensform", "Goldener Himmel durch Sporendunst", "Ursprung einer weit verbreiteten Spezies", "Kontinentweite Myzelnetze"] },
            { titel: "Hinweise für Besucher", liste: ["Atemfilter gegen Sporen empfohlen", "Myzelnetze nicht beschädigen", "Hohe Luftfeuchtigkeit belastet Technik", "Myzelkontakte nur mit Einwilligung"] }] },
        "Medienarchiv": { abschnitte: [] },
    },
};
