// Dravelon · Ursprungsplanet der Dendroarchen (Quelle: Info_material/…/Dendroarchen/Heimatwelt – Name und Planetendaten waren offen;
// Werte aus den Vorgaben abgeleitet: feuchte Wald- und Sumpflandschaften, Wasser, Mineralien, geringe Schwerkraft begünstigt riesige Strukturen, Symbiosen)
const G = "assets/bilder/Alle Spezies+Übersicht/Gigantische Lebensformen/Dendroarchen/gesamtdarstellung/";
export default {
    ordner: "lebender-jadeplanet-mit-flussbecken", system: "dravelon-system", planetId: "dravelon-planet",
    name: "Dravelon", genitiv: "von Dravelon", klasse: "Gesteinsplanet", klasseLang: "Feuchte Wald- und Sumpfwelt mit geringer Schwerkraft",
    spezies: { name: "Dendroarchen", gruppe: "Gigantische Lebensformen", ordner: "Dendroarchen", seite: "inhalte/spezies/Gigantische Lebensformen/Dendroarchen/hauptseite/Spezies.html" },
    intro: "Dravelon ist der Ursprungsplanet der Dendroarchen: eine feuchte, grüne Welt aus endlosen Wäldern, Sumpfbecken und weit verzweigten Flussdeltas. Die geringe Schwerkraft ließ hier Lebensformen von mehr als zehn Kilometern Ausdehnung entstehen.",
    bildtext: "Dravelon – grüne Welt der Flussbecken",
    kurzprofil: [
        "Dravelon ist kleiner und deutlich leichter als die Erde; die Schwerkraft beträgt nur rund 0,72 g. Eine dichte, feuchte Atmosphäre hält die Wärme fest, und gewaltige Flusssysteme verbinden Wälder, Sümpfe und flache Meere.",
        "Vor mehreren Millionen Jahren entwickelten sich hier die Vorfahren der Dendroarchen in feuchten Wald- und Sumpflandschaften – bereits damals in enger Symbiose mit anderen Organismen. Heute prägen die Giganten Wasserkreisläufe und Klima ganzer Regionen.",
    ],
    farben: { nacht: "#050b07", tiefe: "#0b170f", akzent: "#8ee07a", sand: "#d9cf8a", moos: "#6fbf6a", ozean: "#3f8a8a", glas: "rgba(10, 22, 14, .78)", "glas-hell": "rgba(18, 34, 22, .84)", linie: "rgba(142, 224, 122, .16)", "linie-hell": "rgba(160, 230, 140, .36)", text: "#eef6ec", leise: "#a8b8a4", "aporia-page-tint": "#2f6a2a" },
    werte: {
        temperatur: "ca. 21 °C", temperaturMittel: 21, ozeane: "ca. 38 % flache Meere, dazu ca. 20 % Sümpfe und Flussdeltas",
        atmosphaere: [["Stickstoff", 73], ["Sauerstoff", 23], ["Wasserdampf (Mittel)", 2.6], ["Argon", 1], ["Kohlendioxid und Spurengase", 0.4]],
        atmoKurz: "Dicht, feucht, sauerstoffreich, 1,45 bar",
        atmoText: "Die Atmosphäre ist dicht, sehr feucht und etwas sauerstoffreicher als die der Erde – eine Folge der riesigen Pflanzen- und Dendroarchenmassen. Trotz der geringen Schwerkraft hält Dravelon sie dank ausreichender Fluchtgeschwindigkeit dauerhaft fest.",
        druck: "ca. 1,45 bar", druckMittel: 1.45,
        rotationH: 26, rotationText: "ca. 26 h", achsneigung: 11, jahreszeiten: "Schwach; Wechsel von Regen- und Nebelzeiten",
        treibhausText: "Wasserdampf und die dichte Atmosphäre erzeugen eine Treibhauswirkung von rund 41 K.",
        magnetfeldFaktor: 0.7,
        physikExtra: [["Durchmesser im Vergleich", "ca. 88 % der Erde"], ["Größte Lebensform", "Dendroarchen mit über 10 km Ausdehnung"]],
        extra: [["Sümpfe und Deltas", "ca. 20 % der Oberfläche"], ["Luftfeuchtigkeit", "meist über 80 %"], ["Prägende Lebensform", "Dendroarchen und Urwälder"]],
        vergleichExtra: [["Luftfeuchtigkeit (Mittel)", 84, 60, "%"]],
        zonen: { einheit: "°C", min: -10, max: 40, bereiche: [["Polare Moore", -5, 8], ["Kühle Nebelwälder", 6, 16], ["Gemäßigte Urwälder", 12, 24], ["Sumpfbecken", 18, 30], ["Tropische Deltas", 24, 34]] },
        zonenText: "Fast der ganze Planet ist feucht und mild. Die größten Dendroarchen wachsen in den Nebeltälern und Sumpfbecken, wo Wasser, Mineralien und Symbiosepartner reichlich vorhanden sind.",
        rekorde: [["Größter Dendroarch", "über 10 km Gesamtausdehnung (Nebeltäler)"], ["Größtes Flussbecken", "Jadebecken von Ilvanor"], ["Älteste biologische Ruine", "Gestürzter Gigant im Tal von Sorreth"]],
    },
    bilder: { medien: [["Kolossaler Dendroarch im Nebeltal", G + "Kolossaler Dendroarch im Nebeltal.png"], ["Der kolossale Dendroarch im Tal", G + "Der kolossale Dendroarchen im Tal-2.png"], ["Lebende Kathedrale im goldenen Morgenlicht", G + "Lebende Kathedrale im goldenen Morgenlicht-5.png"], ["Weltenbaum-Landschaft", G + "Gigantische lebende Weltenbaum-Landschaft-12.png"], ["Leuchtende Dendroarch-Landschaft", G + "Leuchtende Dendroarch-Landschaft-8.png"], ["Dendroarchen-Speziesdossier", G + "APORIA_ Dendroarchen-Speziesdossier-1.png"]] },
    kapitel: {
        "Allgemeines": { intro: "Dravelon auf einen Blick: Wälder, Sümpfe und Giganten.", abschnitte: [
            { titel: "Hauptmerkmale", karten: [{ titel: "Geringe Schwerkraft", text: "Rund 0,72 g – Grundlage des Gigantismus." }, { titel: "Wald- und Sumpfwelt", text: "Urwälder, Nebeltäler und Sumpfbecken." }, { titel: "Flussbecken", text: "Weit verzweigte Deltas und Auen." }, { titel: "Ursprung der Dendroarchen", text: "Seit mehreren Millionen Jahren." }] }] },
        "Astronomie": { intro: "Eine grüne Welt um den orangefarbenen Zwerg Halvorn.", abschnitte: [
            { titel: "Zeitrechnung", daten: [["Ortstag", "ca. 26 h"], ["Umlauf", "ca. 253 Erdtage ≈ 233 Ortstage"], ["Mondzyklus", "Thessil: 16 Tage"]] },
            { titel: "Am Himmel von Dravelon", text: ["Halvorn erscheint als warme, orangefarbene Scheibe, oft hinter Dunst und Nebel. Nachts ist Thessil über den Wäldern zu sehen; seine Gezeiten heben und senken das Wasser in den Deltas."] }] },
        "Physik": { abschnitte: [{ titel: "Leichte Welt, große Körper", text: ["Mit rund 0,72 g ist die Schwerkraft deutlich geringer als auf der Erde. Tragende Strukturen werden weniger belastet – das begünstigt besonders weitreichende Körper. So konnten Dendroarchen mit mehr als zehn Kilometern Gesamtausdehnung entstehen."] }] },
        "Planetare Struktur": { abschnitte: [{ titel: "Schalenbau", text: ["Dravelon besitzt einen relativ kleinen Eisenkern und einen Silikatmantel. Tief verwitterte, mineralreiche Böden liefern die Nährstoffe, die Dendroarchen benötigen."], schichten: [["Boden", "Tief verwittert, wasserreich, mineralhaltig"], ["Kruste", "Granit und Sedimente, mechanisch gut tragfähig"], ["Mantel", "Silikatgestein, mäßige Tektonik"], ["Kern", "Kleiner Eisenkern, schwächeres Magnetfeld"]] }] },
        "Geografie": { intro: "Nebeltäler, Urwälder und Flussdeltas.", abschnitte: [
            { titel: "Landschaften", karten: [{ titel: "Nebeltäler", text: "Feuchte Täler – Heimat der größten Dendroarchen." }, { titel: "Urwälder", text: "Dichte Wälder auf allen Kontinenten." }, { titel: "Sumpfbecken", text: "Weite, flache Feuchtgebiete." }, { titel: "Flussdeltas", text: "Riesige, verzweigte Mündungsgebiete." }, { titel: "Biologische Ruinen", text: "Überreste gestürzter Giganten." }, { titel: "Flache Meere", text: "Warme Schelfmeere zwischen den Kontinenten." }] },
            { titel: "Oberfläche", balken: { werte: [["Flache Meere", 38], ["Wälder", 28], ["Sümpfe und Deltas", 20], ["Hochländer", 9], ["Moore und Tundra", 5]] } }] },
        "Atmosphäre": { abschnitte: [{ titel: "Feuchte Luft", text: ["Große Dendroarchen verdunsten erhebliche Mengen Wasser. Ihre Körper lenken Winde und Niederschläge; in den Tälern entstehen dadurch beständige Nebel- und Wolkendecken."] }] },
        "Klima": { abschnitte: [{ titel: "Wetter", karten: [{ titel: "Dauernebel", text: "In den großen Tälern fast ganzjährig." }, { titel: "Starkregen", text: "Häufig in den Regenzeiten." }, { titel: "Lokales Klima", text: "Riesige Dendroarchen prägen Wind und Regen ganzer Regionen." }, { titel: "Gewitter", text: "Über den warmen Deltas." }] }] },
        "Gewässer": { abschnitte: [{ titel: "Wasserkreislauf", text: ["Flache Meere, Flüsse, Sümpfe und Deltas bedecken mehr als die Hälfte Dravelons. Dendroarchen speichern gewaltige Wassermengen in ihren Körpern und transportieren sie zwischen Regionen – so entstehen neue Feuchtgebiete und veränderte Wasserkreisläufe."] }] },
        "Geologie": { abschnitte: [
            { titel: "Landschaftsveränderung", text: ["Die Wurzelsysteme der Dendroarchen bewegen große Gesteinsmassen und können lokale Erschütterungen auslösen. Über lange Zeiträume formen sie Täler und Flussläufe mit."] },
            { titel: "Naturgefahren", liste: ["Zusammenbrechende Giganten", "Wurzelbeben", "Überschwemmungen", "Erdrutsche an Talhängen", "Sumpfgase in stehenden Becken"] }] },
        "Biosphäre": { intro: "Eine Welt aus Symbiosen.", abschnitte: [
            { titel: "Symbiosen", text: ["Symbiosen sind auf Dravelon seit den Anfängen der Dendroarchen allgegenwärtig. Symbiosepartner versorgen die Giganten, speichern Erinnerungen und tragen Samen; viele Organismen leben unabhängig in ihren Strukturen."] },
            { titel: "Lebensräume", karten: [{ titel: "Lebende Lebensräume", text: "Ein einzelner Dendroarch beherbergt ein ganzes Ökosystem." }, { titel: "Biologische Ruinen", text: "Gestürzte Giganten werden zu neuen Ökosystemen." }, { titel: "Sumpfwälder", text: "Artenreiche Feuchtwälder." }, { titel: "Trägerorganismen", text: "Lebewesen, an denen Samen haften und weite Strecken reisen." }] }] },
        "Spezies": { intro: "Die Dendroarchen – gigantische, baumartige Intelligenzen.", abschnitte: [
            { titel: "Dendroarchen", bild: G + "Kolossaler Dendroarch im Nebeltal.png", bildtext: "Dendroarch", text: ["Dendroarchen sind gewaltige, baumartige Lebensformen aus holzähnlichen Fasern, verzweigten Körperachsen und komplexen Wurzelsystemen. Junge Individuen können ihren Standort mit beweglichen Wurzeln ändern; sehr alte entwickeln komplexe Bewusstseinszustände und leben hunderttausende Jahre. Sie kommunizieren über mechanische Schwingungen."], verweise: [["Zum Speziesdossier", "inhalte/spezies/Gigantische Lebensformen/Dendroarchen/hauptseite/Spezies.html"]] },
            { titel: "Ausbreitung", text: ["Von Dravelon aus verbreiteten sich Dendroarchen auf mehrere Planeten – zuerst natürlich durch Trägerorganismen, später auch durch organisierten Raumtransport."] }] },
        "Zivilisation": { abschnitte: [{ titel: "Leben auf Giganten", text: ["Siedlungen anderer Spezies entstehen in und auf Dendroarchen: in ihren Hohlräumen, auf Gliedmaßen und in biologischen Ruinen. Biologisch integrierter Siedlungsbau ist ein Forschungsfeld des Synaptorats."] }] },
        "Geschichte": { abschnitte: [{ titel: "Zeitleiste", zeitleiste: [["Vor Millionen Jahren", "Vorfahren in feuchten Wald- und Sumpflandschaften, erste Symbiosen"], ["Frühe Ausbreitung", "Samen reisen an Trägerorganismen zu anderen Welten"], ["Kontakt", "Beziehungen zu Konföderation und Synaptorat"], ["Gegenwart", "Natürliche und gezielt angesiedelte Vorkommen auf mehreren Planeten"]] }] },
        "Fraktionen": { abschnitte: [{ titel: "Beziehungen", daten: [["Konföderation", "Zusammenarbeit bei der Symbioseforschung"], ["Synaptorat", "Biologisch integrierter Siedlungsbau, Wachstumsforschung"], ["Mitgliedschaft", "Keine automatische Fraktionszugehörigkeit"]] }] },
        "Rohstoffe": { abschnitte: [{ titel: "Rohstoffe", karten: [{ titel: "Wasser", text: "Reichlich in Meeren, Flüssen und Sümpfen." }, { titel: "Mineralische Nährstoffe", text: "Tief verwitterte Böden." }, { titel: "Samen", text: "Gezielt transportiert – unter Schutzauflagen." }, { titel: "Biomaterialien", text: "Aus biologischen Ruinen, nur eingeschränkt nutzbar." }] }] },
        "Erforschung": { abschnitte: [{ titel: "Offene Fragen", liste: ["Welche Organismen dienten als erste Samenträger?", "Wie speichern Symbiosepartner Erinnerungen?", "Wie verändern Giganten das Klima ganzer Kontinente?", "Wie unterscheiden sich die Populationen anderer Planeten?"] }] },
        "Besonderheiten": { abschnitte: [
            { titel: "Einzigartige Welt", liste: ["Ursprung der größten bekannten Lebensformen", "Geringe Schwerkraft als Voraussetzung für Gigantismus", "Lebende Lebensräume für ganze Ökosysteme", "Biologische Ruinen gestürzter Giganten"] },
            { titel: "Hinweise für Besucher", liste: ["Dendroarchen besitzen eigene Rechte", "Samen nicht ohne Genehmigung mitnehmen", "Wurzelbeben-Warnungen beachten"] }] },
        "Medienarchiv": { abschnitte: [] },
    },
};
