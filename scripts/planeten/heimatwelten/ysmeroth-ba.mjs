// Ysmeroth Ba · Heimatwelt der Ozeaniden (Quelle: Info_material/…/Gigantische Lebensformen/Ozeaniden/05_Heimatwelt/heimatwelt-referenz.md
// und Sternensystem/Sternensystem.md) – Planet des Begleitsterns Ysmeroth B: 0,08 AE, 6.600 km, 1,1 Erdmassen, gebunden; Bahn unverändert.
// Atmosphäre, Druck und Mitteltemperatur sind im Infomaterial noch nicht festgelegt und werden als offen ausgewiesen.
export default {
    ordner: "ysmeroth-ba", system: "karynth-system", planetId: "karynth-ysmeroth-ba",
    name: "Ysmeroth Ba", genitiv: "von Ysmeroth Ba", klasse: "Ozeanplanet", globusKlasse: "Ozeanwelt",
    klasseLang: "Gebunden rotierender Ozeanplanet eines Roten Zwergs",
    spezies: { name: "Ozeaniden", gruppe: "Gigantische Lebensformen", ordner: "Ozeaniden" },
    intro: "Ysmeroth Ba ist eine gebunden rotierende Wasserwelt um den Roten Zwerg Ysmeroth B, den fernen Begleiter des Hauptsterns Ysmeroth. Eine Seite liegt in ewigem rötlichem Licht, die andere unter Eis. In den offenen Meeren und den Dämmerungsozeanen dazwischen leben die Ozeaniden – gigantische aquatische Lebewesen mit eigener mariner Zivilisation.",
    bildtext: "Ysmeroth Ba – Ozeane unter rotem Licht",
    kurzprofil: [
        "Ysmeroth Ba ist der einzige Planet des Roten Zwergs Ysmeroth B, der den Hauptstern Ysmeroth in rund 310 AE Abstand umkreist. Der Planet umläuft seinen Stern in 0,08 AE Abstand alle 18 Tage – innerhalb der habitablen Zone – und zeigt ihm stets dieselbe Seite. Die Gleichgewichtstemperatur liegt bei etwa −20 °C.",
        "Mit 13.200 Kilometern Durchmesser und 1,1 Erdmassen ist Ba etwas größer als die Erde; die Schwerkraft beträgt rund 1,02 g. Zusammenhängende Ozeane bedecken die Welt, auf der Tagseite offen, auf der Nachtseite unter Eis. Atmosphärische und ozeanische Zirkulation tragen Wärme zwischen den Hemisphären.",
    ],
    farben: { nacht: "#0a0508", tiefe: "#160a12", akzent: "#e0607a", sand: "#d8b0a8", moos: "#a05a8a", ozean: "#3a5aa8", glas: "rgba(22, 10, 18, .8)", "glas-hell": "rgba(36, 18, 30, .86)", linie: "rgba(224, 96, 122, .16)", "linie-hell": "rgba(230, 150, 170, .36)", text: "#f6eef2", leise: "#bfa6b2", "aporia-page-tint": "#5a2240" },
    werte: {
        temperatur: "Gleichgewicht ca. −20 °C · Mittelwert noch nicht festgelegt", temperaturMittel: -20, ozeane: "Nahezu global – offene Meere auf der Tagseite, Eis auf der Nachtseite",
        atmosphaere: [["Zusammensetzung noch nicht festgelegt", 100]],
        atmoKurz: "Noch nicht festgelegt",
        atmoText: "Zusammensetzung und Druck der Atmosphäre sind im Infomaterial noch nicht festgelegt. Bekannt ist, dass atmosphärische und ozeanische Zirkulation Wärme von der Tag- zur Nachtseite tragen, über offenen Meeren viel Wasser verdunstet und sich regional Wolken bilden.",
        druck: "Noch nicht festgelegt", druckMittel: 1,
        druckDaten: [["Oberflächendruck", "Noch nicht festgelegt"]],
        rotationH: 433, rotationText: "ca. 18 Erdtage (gebunden)", achsneigung: 0, jahreszeiten: "Keine – dauerhafte Tag-, Dämmerungs- und Nachtregionen",
        treibhausText: "Wie stark die Atmosphäre die Temperatur über das Gleichgewicht hebt, ist noch nicht festgelegt.",
        magnetfeldFaktor: null,
        physikExtra: [["Rotation", "Gebunden an Ysmeroth B"]],
        extra: [["Archiv-ID", "AP-2485917560"], ["Zentralstern", "Ysmeroth B (Begleitstern, M4 V)"], ["Systemtyp", "Weites Doppelsternsystem"], ["Nachbarspezies", "Metamorphen auf Karynth (um Ysmeroth A)"]],
        vergleichExtra: [],
        zonen: { einheit: "°C", min: -60, max: 30, bereiche: [["Nachtseite (Eis)", -60, -10], ["Dämmerungsozeane", -10, 10], ["Offene Meere der Tagseite", 5, 25]] },
        zonenText: "Die Temperaturbereiche sind eine vorläufige Darstellung der drei Klimaregionen; konkrete Werte sind noch nicht festgelegt. Die sternzugewandte Seite liegt in permanentem rötlichem Tageslicht, die Nachtseite in dauerhafter Dunkelheit; dazwischen erstrecken sich ausgedehnte Dämmerungsregionen mit starken Temperaturunterschieden.",
        rekorde: [["Größte Lebewesen", "Ozeaniden – Körperregionen gleichzeitig in mehreren Wasserschichten"], ["Abstand zum Hauptstern", "ca. 310 AE (über Ysmeroth B)"]],
        umbenennen: { "Rotationsperiode": "Rotation (gebunden)", "Luftdruck (Mittel)": "Luftdruck (nicht festgelegt)" },
    },
    kapitel: {
        "Allgemeines": { intro: "Ysmeroth Ba auf einen Blick: Licht, Eis und Riesen im Meer.", abschnitte: [
            { titel: "Hauptmerkmale", karten: [{ titel: "Gebundene Rotation", text: "Ewiges rötliches Licht auf der einen, Eis auf der anderen Seite." }, { titel: "Globaler Ozean", text: "Offene Meere, Tiefseegräben und unterseeische Gebirge." }, { titel: "Dämmerungsozeane", text: "Nährstoffreiche Übergänge zwischen Licht und Eis." }, { titel: "Doppelstern", text: "Ein zweites Sonnensystem 310 AE vom Hauptstern entfernt." }] },
            { titel: "Einordnung", daten: [["Sternenkarten-ID", "karynth-ysmeroth-ba"], ["Heimatspezies", "Ozeaniden (Gigantische Lebensformen)"], ["Bahn", "Unverändert übernommen"]] }] },
        "Astronomie": { intro: "Der Planet des Begleitsterns.", abschnitte: [
            { titel: "Zwei Sterne", text: ["Ysmeroth B ist ein Roter Zwerg mit 21 % der Sonnenmasse und umläuft den Hauptstern Ysmeroth A auf einer weiten, exzentrischen Bahn (rund 310 AE, Exzentrizität 0,38) in etwa 5.400 Jahren. Wegen der großen Entfernung konnten sich die Ozeaniden und die Metamorphen auf Karynth unabhängig voneinander entwickeln. Von Ysmeroth Ba aus erscheint Ysmeroth A als besonders heller Stern."] },
            { titel: "Am Himmel von Ysmeroth Ba", text: ["Über der Tagseite steht Ysmeroth B unbeweglich als große, rote Scheibe. In der Dämmerungsregion verharrt sie am Horizont, auf der Nachtseite ist sie nie zu sehen."] }] },
        "Geografie": { abschnitte: [
            { titel: "Meereslandschaften", liste: ["Großflächige zusammenhängende Ozeane", "Dauerhaft offene Meere auf der Tagseite", "Ausgedehnte Eisflächen und schwimmende Eisformationen auf der Nachtseite", "Tiefseegräben und unterseeische Gebirgsketten", "Hydrothermale Quellen", "Flüssige Reservoire unter Teilen der Eiskruste"] },
            { titel: "Besondere Naturlandschaften", karten: [{ titel: "Untereislandschaften", text: "Gigantische Räume unter der Eiskruste." }, { titel: "Leuchtende Tiefsee", text: "Biolumineszente Ökosysteme und Planktonfelder." }, { titel: "Eisabbrüche", text: "Kilometerlange Abbruchkanten an der Eisgrenze." }, { titel: "Schlotfelder", text: "Hydrothermale Quellen in der Tiefe." }, { titel: "Schwebende Körperlandschaften", text: "Die gewaltigen Körper der Ozeaniden im Wasser." }] }] },
        "Klima": { abschnitte: [{ titel: "Klima", liste: ["Permanentes rötliches Tageslicht auf der Sternseite", "Dauerhafte Dunkelheit auf der Nachtseite", "Ausgedehnte Dämmerungsregionen", "Starke Temperaturunterschiede zwischen den Hemisphären", "Wärmetransport durch Luft- und Meeresströmungen", "Wechselwirkung zwischen Strömungen und Eisflächen"] }] },
        "Gewässer": { abschnitte: [{ titel: "Lebensräume im Meer", liste: ["Nährstoffreiche Oberflächengewässer", "Tiefere sauerstoffreiche Strömungen", "Offene Meere unter rotem Licht", "Dämmerungsozeane", "Sauerstoffreiche Untereisregionen", "Hydrothermal beeinflusste Tiefsee", "Geschützte Fortpflanzungsgebiete"] }] },
        "Biosphäre": { abschnitte: [{ titel: "Biosphäre", liste: ["Lichtangepasste marine Mikroorganismen", "Rötlich und dunkelviolett pigmentierte Wasserpflanzen und Algen", "Biolumineszierende Tiefseeorganismen", "Kälteresistente Meereslebewesen", "Filternde Großorganismen und wandernde Arten", "Chemosynthetische Lebensformen", "Eigenständige Ökosysteme unter der Eiskruste"] }] },
        "Spezies": { intro: "Die Ozeaniden – Riesen der Dämmerungsozeane.", abschnitte: [{ titel: "Ozeaniden", text: ["Ozeaniden bewohnen überwiegend die offenen Ozeane und die Übergänge zwischen beleuchteter und vereister Seite. Besonders große Individuen folgen nährstoffreichen Strömungen zwischen den Temperaturzonen; einzelne Körperregionen können sich gleichzeitig in verschiedenen Wasserschichten und Klimabereichen befinden. Ysmeroth Ba ist ihre natürliche Entstehungs- und Heimatwelt."] }] },
        "Zivilisation": { abschnitte: [{ titel: "Marine Zivilisation", text: ["Die Ozeaniden besitzen keine Landstädte. Technische Einrichtungen liegen überwiegend unter Wasser, auf schwimmenden Plattformen oder am Rand der Eisflächen; Meeresströmungen verbinden Individuen, Forschungsanlagen und gemeinsam genutzte Regionen."] }] },
        "Fraktionen": { abschnitte: [{ titel: "Beziehungen", text: ["Ozeaniden und Metamorphen entwickelten sich unabhängig voneinander in unterschiedlichen Lebensräumen desselben Doppelsternsystems. Der Zeitpunkt ihrer ersten Begegnung sowie diplomatische und wirtschaftliche Beziehungen werden später im Rahmen der Storyentwicklung festgelegt."] }] },
        "Besonderheiten": { abschnitte: [{ titel: "Besonderheit des Systems", text: ["Das Ysmeroth-System beherbergt zwei grundlegend verschiedene intelligente Lebensformen, die jeweils einen anderen Stern des Doppelsterns umkreisen: die Metamorphen auf der wasserreichen Gesteinswelt Karynth und die Ozeaniden in den Meeren einer gebunden rotierenden Welt um Ysmeroth B."] }] },
        "Medienarchiv": { abschnitte: [] },
    },
};
