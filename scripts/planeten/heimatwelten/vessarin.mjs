// Vessarin · Heimatwelt der Thalassoiden (Quelle: Info_material/…/Thalassoiden/05_Heimatwelt – Name und Planetendaten waren offen;
// Werte aus den Vorgaben abgeleitet: aquatische Evolution, Süß-/Salzwasser und mineralisierte/saure Gewässer, Druck- und Tiefenzonen, unterseeische Täler, Felsformationen, Höhlen, Geothermie)
const G = "assets/bilder/Alle Spezies+Übersicht/Biologische Spezies/Thalassoiden/gesamtdarstellung/Designvorschläge/";
export default {
    ordner: "hydrothermale-ozeanwelt-im-all", system: "vessarin-system", planetId: "vessarin-planet",
    name: "Vessarin", genitiv: "von Vessarin", klasse: "Ozeanplanet", klasseLang: "Ozeanwelt mit globalem Tiefenmeer und Hydrothermalfeldern",
    spezies: { name: "Thalassoiden", gruppe: "Biologische Spezies", ordner: "Thalassoiden", seite: "inhalte/spezies/Biologische Spezies/Thalassoiden/hauptseite/Spezies.html" },
    intro: "Vessarin ist die Heimatwelt der Thalassoiden: ein Planet, dessen Oberfläche fast vollständig von einem kilometertiefen Ozean bedeckt ist. Am Meeresboden ziehen sich unterseeische Täler, Felsformationen, Höhlensysteme und leuchtende Hydrothermalfelder entlang – die Wiege der thalassoiden Entwicklungslinien.",
    bildtext: "Vessarin – Ozeanwelt mit Hydrothermalfeldern",
    kurzprofil: [
        "Vessarin ist eine etwas größere und schwerere Welt als die Erde im Celeun-System. Rund 96 % der Oberfläche sind von Wasser bedeckt; nur vulkanische Inselbögen ragen aus dem Meer. Der Ozean ist im Mittel etwa 6 Kilometer tief und erreicht in den tiefsten Gräben über 20 Kilometer.",
        "Geschichtete Wassermassen, Süßwasserlinsen unter den Inselbögen, salzige Tiefenbecken und saure, mineralreiche Quellfelder schaffen sehr unterschiedliche Lebensräume. Diese Vielfalt erklärt die außergewöhnlich verschiedenen Entwicklungslinien der Thalassoiden.",
    ],
    farben: { nacht: "#040a0e", tiefe: "#081620", akzent: "#3fd6c4", sand: "#e0c48a", moos: "#5ab8a0", ozean: "#2a78b0", glas: "rgba(6, 18, 26, .78)", "glas-hell": "rgba(12, 30, 42, .84)", linie: "rgba(63, 214, 196, .16)", "linie-hell": "rgba(90, 225, 210, .36)", text: "#ecf6f8", leise: "#a2b6bc", "aporia-page-tint": "#145a6a" },
    werte: {
        temperatur: "ca. 19 °C (Oberflächenwasser)", temperaturMittel: 19, ozeane: "ca. 96 % (globaler Ozean, mittlere Tiefe ca. 6 km)",
        atmosphaere: [["Stickstoff", 77], ["Sauerstoff", 19], ["Wasserdampf (Mittel)", 2.4], ["Argon", 1.2], ["Kohlendioxid und Spurengase", 0.4]],
        atmoKurz: "Feucht, Stickstoff-Sauerstoff, 1,3 bar",
        atmoText: "Die Atmosphäre ist feucht und etwas dichter als die der Erde. Über dem globalen Ozean verdunstet viel Wasser; Wolkenbänder und Sturmsysteme ziehen ungehindert um den Planeten.",
        druck: "ca. 1,3 bar", druckMittel: 1.3, druckDaten: [["Meeresoberfläche", "ca. 1,3 bar"], ["Mittlere Ozeantiefe (6 km)", "ca. 650 bar"], ["Tiefste Gräben (über 20 km)", "über 2.200 bar"]],
        rotationH: 30, rotationText: "ca. 30 h", achsneigung: 14, jahreszeiten: "Mild; der Ozean gleicht Temperaturunterschiede weitgehend aus",
        treibhausText: "Wasserdampf und eine etwas dichtere Atmosphäre erzeugen eine Treibhauswirkung von rund 39 K.",
        magnetfeldFaktor: 1.1,
        umbenennen: {},
        physikExtra: [["Durchmesser im Vergleich", "ca. 116 % der Erde"], ["Größte Meerestiefe", "über 20 km (Abyssalgraben von Nhael)"]],
        extra: [["Landfläche", "ca. 4 % (vulkanische Inselbögen)"], ["Größte Meerestiefe", "über 20 km"], ["Hydrothermalfelder", "über den ganzen Meeresboden verteilt"]],
        vergleichExtra: [["Mittlere Ozeantiefe", 6, 3.7, "km"]],
        zonen: { einheit: "°C", min: -5, max: 400, bereiche: [["Polare Oberflächenmeere", -2, 8], ["Tiefenwasser", 2, 6], ["Gemäßigte Oberflächenmeere", 10, 22], ["Tropische Inselmeere", 20, 30], ["Hydrothermalquellen", 60, 380]] },
        zonenText: "Unterhalb weniger hundert Meter ist das Wasser kalt und gleichmäßig temperiert; nur an den Hydrothermalfeldern tritt bis zu mehrere hundert Grad heißes, mineralreiches Wasser aus.",
        rekorde: [["Tiefster Graben", "Abyssalgraben von Nhael, über 20 km"], ["Größtes Hydrothermalfeld", "Glutfelder von Orrhaen"], ["Größtes Höhlensystem", "Unterseeisches Labyrinth der Vhaurak-Klippen"]],
    },
    bilder: { medien: [["Haus Nerevar – Wissen und Weite", G + "Haus Nerevar – Wissen und Weite.png"], ["Haus Nerevar – Abyssale Bastion", G + "Haus Nerevar_ Abyssale Bastion-7.png"], ["Haus Thalak – Macht unter Wasser", G + "Haus Thalak_ Macht unter Wasser-1.png"], ["Haus Vhaurak – Unterseeisches Reich", G + "Haus Vhaurak_ Unterseeisches Reich-3.png"], ["Biolumineszenter Garten von Haus Vhaurak", G + "Biolumineszenter Garten von Haus Vhaurak-8.png"], ["Haus Thalak – Zentrum Nereith", G + "Haus Thalak_ Zentrum Nereith-11.png"]] },
    kapitel: {
        "Allgemeines": { intro: "Vessarin auf einen Blick: ein Ozean voller Tiefenzonen.", abschnitte: [
            { titel: "Hauptmerkmale", karten: [{ titel: "Globaler Ozean", text: "Rund 96 % Wasser, im Mittel 6 km tief." }, { titel: "Tiefenzonen", text: "Getrennte Lebensräume mit eigenem Druck." }, { titel: "Hydrothermalfelder", text: "Heiße, mineralreiche Quellen am Meeresboden." }, { titel: "Wechselnde Gewässerchemie", text: "Süß, salzig, mineralisiert oder sauer." }] }] },
        "Astronomie": { intro: "Eine Ozeanwelt im Licht des gelben Zwergs Celeun.", abschnitte: [
            { titel: "Zeitrechnung", daten: [["Ortstag", "ca. 30 h"], ["Umlauf", "ca. 336 Erdtage ≈ 269 Ortstage"], ["Mondzyklen", "Lirae: 9,5 Tage · Oun: 34 Tage"]] },
            { titel: "Gezeiten", text: ["Der große, nahe Mond Lirae erzeugt kräftige Gezeiten. Sie treiben Tiefenströmungen an, durchmischen das Wasser an den Inselbögen und versorgen die Ökosysteme der unterseeischen Täler mit Nährstoffen."] }] },
        "Physik": { abschnitte: [{ titel: "Druck und Tiefe", text: ["Etwas höhere Schwerkraft und große Wassertiefen erzeugen gewaltige Drücke: Schon in mittlerer Tiefe herrschen rund 650 bar, in den tiefsten Gräben über 2.200 bar. Entwicklungslinien der Thalassoiden haben sich an unterschiedliche Tiefenzonen angepasst – manche wechseln sie langsam, andere bleiben spezialisiert."] }] },
        "Planetare Struktur": { abschnitte: [{ titel: "Schalenbau", text: ["Unter dem Ozean liegt eine basaltische Kruste mit aktiven Spreizungsrücken, darunter ein Silikatmantel und ein Eisen-Nickel-Kern."], schichten: [["Ozean", "Globales Meer, geschichtet nach Temperatur und Salzgehalt"], ["Meeresboden", "Basalt, Spreizungsrücken, Hydrothermalfelder"], ["Mantel", "Silikatgestein mit kräftiger Konvektion"], ["Kern", "Eisen-Nickel-Kern, Magnetfeld etwa wie das der Erde"]] }] },
        "Geografie": { intro: "Unterwasserlandschaften statt Kontinente.", abschnitte: [
            { titel: "Unterwasserlandschaften", karten: [{ titel: "Unterseeische Täler", text: "Weite Talsysteme zwischen den Rücken – bevorzugte Lebensräume großer Gemeinschaften." }, { titel: "Felsformationen", text: "Ausgedehnte Klippen und Pfeilerfelder." }, { titel: "Unterwasserhöhlen", text: "Verzweigte Höhlensysteme in den Klippen." }, { titel: "Hydrothermalfelder", text: "Heiße Quellen mit eigenen Ökosystemen." }, { titel: "Abyssalgräben", text: "Tiefste Zonen mit extremem Druck." }, { titel: "Inselbögen", text: "Vulkanische Inseln mit Süßwasserlinsen und Lagunen." }] },
            { titel: "Tiefenzonen", balken: { werte: [["Lichtzone (0–200 m)", 4], ["Dämmerzone (bis 1 km)", 12], ["Mitternachtszone (bis 4 km)", 30], ["Abyssal (bis 8 km)", 42], ["Hadal (unter 8 km)", 12]] } }] },
        "Atmosphäre": { abschnitte: [{ titel: "Ozean und Luft", text: ["Fast überall grenzt die Atmosphäre direkt an das Meer. Für luftatmende Entwicklungslinien der Thalassoiden ist die Oberfläche deshalb überall erreichbar; ausschließlich kiemenatmende Formen bleiben im Wasser."] }] },
        "Klima": { abschnitte: [{ titel: "Wetter", karten: [{ titel: "Ozeanstürme", text: "Große Wirbelstürme ziehen ungebremst über das Meer." }, { titel: "Wolkenbänder", text: "Breite, beständige Bänder über den Tropen." }, { titel: "Ausgeglichenes Klima", text: "Der Ozean dämpft Jahreszeiten stark." }, { titel: "Polares Meereis", text: "Nur in strengen Wintern dünne Eisdecken." }] }] },
        "Gewässer": { abschnitte: [
            { titel: "Gewässerchemie", text: ["Vessarins Ozean ist nicht einheitlich. Unter den Inselbögen schwimmen Süßwasserlinsen, die Tiefenbecken sind salzig und teils stark mineralisiert, an den Hydrothermalfeldern tritt saures, metallreiches Wasser aus. Thalassoide Entwicklungslinien sind an Süßwasser, Salzwasser oder unterschiedliche Salz- und Säuregrade angepasst."] },
            { titel: "Wasserzonen", daten: [["Süßwasserlinsen", "Unter Inselbögen, wenig Salz"], ["Oberflächenmeer", "Salzig, sauerstoffreich"], ["Tiefenbecken", "Kalt, stark salzhaltig"], ["Quellfelder", "Heiß, sauer, metall- und mineralreich"]] }] },
        "Geologie": { abschnitte: [
            { titel: "Geothermie", text: ["Aktive Spreizungsrücken durchziehen den Meeresboden. Hier tritt heißes, mineralreiches Wasser aus und liefert die geothermische Energie, die thalassoide Zivilisationen für ihre technischen Einrichtungen nutzen."] },
            { titel: "Naturgefahren", liste: ["Seebeben und Tsunamis", "Unterseeische Vulkanausbrüche", "Plötzliche Druckwechsel in Strömungen", "Giftige Quellwässer", "Ozeanstürme an der Oberfläche"] }] },
        "Biosphäre": { intro: "Komplexe aquatische Ökosysteme in allen Tiefen.", abschnitte: [
            { titel: "Lebensräume", karten: [{ titel: "Lichtzone", text: "Photosynthetisches Plankton und Tangwälder an den Inselbögen." }, { titel: "Quellgemeinschaften", text: "Chemosynthetische Ökosysteme an den Hydrothermalfeldern." }, { titel: "Höhlenleben", text: "Spezialisierte Arten in den Klippenhöhlen." }, { titel: "Tiefseejäger", text: "Große Räuber in Mitternachts- und Abyssalzone." }] },
            { titel: "Symbiosen", text: ["Biologische Symbiosen sind verbreitet – etwa mit giftproduzierenden Mikroorganismen. Manche thalassoide Gemeinschaften halten oder nutzen andere Wasserlebewesen."] }] },
        "Spezies": { intro: "Die Thalassoiden – eine Spezies, viele Entwicklungslinien.", abschnitte: [
            { titel: "Thalassoiden", bild: G + "Haus Nerevar – Wissen und Weite.png", bildtext: "Thalassoiden", text: ["Die Thalassoiden sind eine natürlich entstandene, intelligente aquatische Spezies mit außergewöhnlich großer Vielfalt an Größe, Körperbau, Gliedmaßen und Organsystemen – bei gemeinsamer genetischer Grundlage. Flossen, Tentakel, Arme mit Fingern sowie Kiemen- oder kombinierte Wasser- und Luftatmung kommen in verschiedenen Kombinationen vor."], verweise: [["Zum Speziesdossier", "inhalte/spezies/Biologische Spezies/Thalassoiden/hauptseite/Spezies.html"]] },
            { titel: "Verteilung der Entwicklungslinien", text: ["Verschiedene Entwicklungslinien besiedeln verschiedene Regionen derselben Welt – von flachen Inselmeeren bis zu den Abyssalgräben. Dadurch entstanden biologisch und gesellschaftlich voneinander getrennte Lebensräume."] }] },
        "Zivilisation": { abschnitte: [
            { titel: "Unterwasserstädte", text: ["Die ersten größeren Siedlungen entstanden aus Handels- und Produktionszentren. Heutige Städte verbinden mineralische, künstliche und biologisch erzeugte Bauteile und berücksichtigen verschiedene Körpergrößen und Umweltzonen. Verkehrsnetze und Transportfahrzeuge verbinden sie; manche Anlagen reichen bis an die Oberfläche und in den Orbit."] },
            { titel: "Herrschaftshäuser", text: ["Mächtige Häuser wie Haus Vhaurak prägen Politik, Forschung und Wirtschaft der Thalassoiden."] }] },
        "Geschichte": { abschnitte: [{ titel: "Zeitleiste", zeitleiste: [["Evolution", "Aquatische Vorfahren in den Ozeanen Vessarins"], ["Entwicklungslinien", "Anpassung an verschiedene Tiefen und Gewässer"], ["Frühe Siedlungen", "Handels- und Produktionszentren"], ["Zivilisationen", "Zusammenarbeit, Handel und Konflikte der Linien"], ["Technik", "Geothermie, Reaktoren, besondere Energiequelle"], ["Gegenwart", "Verbindungen zu Oberfläche, Orbit und anderen Welten"]] }] },
        "Fraktionen": { abschnitte: [{ titel: "Beziehungen", text: ["Die Beziehungen der Thalassoiden zu den fünf Großfraktionen – Konföderation, Konsortium, Protektorat, Synaptorat und Ätherwanderer – sind noch nicht verbindlich festgelegt. Die thalassoiden Herrschaftssysteme werden nicht automatisch mit einer Großfraktion gleichgesetzt."] }] },
        "Rohstoffe": { abschnitte: [{ titel: "Rohstoffe", karten: [{ titel: "Geothermische Energie", text: "Aus den Hydrothermalfeldern." }, { titel: "Metallsulfide", text: "Ablagerungen an den Quellschloten." }, { titel: "Biologische Stoffe", text: "Aus Tangwäldern und Symbiosen." }, { titel: "Besondere Energiequelle", text: "Ob natürliche Vorkommen auf Vessarin liegen, ist offen." }] }] },
        "Erforschung": { abschnitte: [{ titel: "Offene Fragen", liste: ["Wo entstanden die ersten aquatischen Vorfahren?", "Wie verteilen sich die Entwicklungslinien genau?", "Gibt es natürliche Vorkommen der besonderen Energiequelle?", "Welche Lebensformen bewohnen die Abyssalgräben?"] }] },
        "Besonderheiten": { abschnitte: [
            { titel: "Einzigartige Welt", liste: ["Globaler, kilometertiefer Ozean", "Sehr unterschiedliche Gewässerchemie auf einem Planeten", "Druckzonen als natürliche Grenzen zwischen Lebensräumen", "Heimat einer Spezies mit vielen Entwicklungslinien"] },
            { titel: "Hinweise für Besucher", liste: ["Tauchgänge nur mit Druckanpassung", "Quellfelder sind giftig und heiß", "Herrschaftsgebiete der Häuser respektieren"] }] },
        "Medienarchiv": { abschnitte: [] },
    },
};
