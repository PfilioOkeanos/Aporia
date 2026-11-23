// Iskara – Heimatwelt der Solitiden (Quellen: Solitiden-Dossiers V2.0).
const H = "assets/bilder/Alle Spezies+Übersicht/Mentale Spezies/Solitiden/Heimatplanet/";
const B = { kluft: H + "Heimat_a1.png", becken: H + "Heimat_a2.png", terrassen: H + "Heimat_a3.png", kueste: H + "Heimat_a4.png", hochland: H + "Heimat_a5.png" };
export default {
    systemseite: "inhalte/himmelskoerper/sternensysteme/details/teryn-system/hauptseite/index.html",
    ordner: "aporia-die-blaue-ozeanwelt", system: "teryn-system", planetId: "teryn-iskara",
    name: "Iskara", genitiv: "von Iskara", klasse: "Silikat-Gesteinsplanet",
    klasseLang: "Terrestrischer, geologisch aktiver Silikat-Gesteinsplanet mit 48 % Wasserflächen",
    spezies: { name: "Solitiden", gruppe: "Mentale Spezies", ordner: "Solitiden", seite: "inhalte/spezies/Mentale Spezies/Solitiden/hauptseite/Spezies.html" },
    intro: "Iskara ist die Heimatwelt der Solitiden: eine aktive Silikatwelt mit Ozeanen, mineralischen Hochländern, Salzbecken und hydrothermalen Bruchsystemen. In seltenen geochemischen Nischen entstanden natürlich mineralisch-elektrochemische Bewusstseine. Die gewöhnliche kohlenstoffbasierte Biosphäre lebt unabhängig neben ihnen.",
    bildtext: "Iskara aus dem Orbit – Silikatwelt mit Ozeanen und mineralischen Hochländern",
    kurzprofil: [
        "Iskara umkreist den K4V-Stern Teryn in 0,61 AE Entfernung und erhält rund 86 Prozent der mittleren Erdbestrahlung. Der Planet besitzt 1,12 Erdmassen, einen Radius von etwa 6.690 km und zwei Monde: Thenn und Elvar.",
        "Etwa 48 Prozent der Oberfläche sind wasserbedeckt. Aktive Tektonik und Hydrothermalquellen schaffen seltene mineralische Reaktionsräume. Die angesetzte globale Mitteltemperatur von 12 °C ist ein Modellwert; dafür wird eine atmosphärische Treibhauswirkung von ungefähr 40 K benötigt."
    ],
    farben: { nacht: "#080d14", tiefe: "#111d25", akzent: "#b79bda", sand: "#c9b89d", moos: "#81917e", ozean: "#287f91", glas: "rgba(9, 15, 22, .84)", "glas-hell": "rgba(16, 27, 36, .9)", linie: "rgba(183, 155, 218, .22)", "linie-hell": "rgba(214, 192, 235, .42)", text: "#edf0f3", leise: "#aeb9c0", "aporia-page-tint": "#644b7b" },
    werte: {
        temperatur: "ca. 12 °C (Modellwert)", temperaturMittel: 12, ozeane: "ca. 48 % (Ozeane, Binnenmeere, Seen)",
        atmosphaere: [["Stickstoff", 78.5], ["Sauerstoff", 19.5], ["Argon", 1.4], ["Kohlendioxid", 0.15], ["Weitere Spurengase", 0.45]],
        atmoKurz: "Stickstoff-Sauerstoff, ca. 1,3 bar", atmoText: "Als trockene Arbeitszusammensetzung gelten 78,5 % Stickstoff, 19,5 % Sauerstoff, 1,4 % Argon, 0,15 % Kohlendioxid und 0,45 % weitere Spurengase. Wasserdampf variiert regional. Hydrothermale Gasfreisetzungen können lokal gefährlich sein.",
        druck: "ca. 1,3 bar", druckMittel: 1.3, druckDaten: [["Mittlerer Bodendruck", "ca. 1,3 bar"], ["Wasserbedeckung", "ca. 48 %"], ["Kohlendioxid", "ca. 0,15 %"]],
        rotationH: 31.2, rotationText: "31 Stunden siderisch; mittlerer Sonnentag ca. 31,20 Stunden", achsneigung: 18,
        jahreszeiten: "Jahreszeiten durch 18° Achsenneigung; regionale Ausprägung durch Ozeane, Hochländer und tektonische Becken.",
        treibhausText: "Bei einer Albedo von 0,30 liegt die berechnete Gleichgewichtstemperatur ohne Atmosphäre etwa 40 K unter dem angenommenen globalen Mittelwert. 12 °C ist ein Modellwert und keine vollständige Klimasimulation.",
        extra: [["Siderisches Jahr", "ca. 197,04 Erdtage"], ["Achsneigung", "18°"], ["Aktive Geologie", "Tektonik und Hydrothermalsysteme"], ["Intelligente Spezies", "Solitiden"], ["Geschätzte aktive Heimatpopulation", "ca. 210.000"]],
        bahnExtra: [["Bahnposition", "Dritter Hauptplanet von sechs"], ["Exzentrizität", "0,035"]],
        physikExtra: [["Masse", "1,12 Erdmassen"], ["Radius", "ca. 6.690 km"], ["Oberflächengravitation", "ca. 9,97 m/s²"], ["Fluchtgeschwindigkeit", "ca. 11,55 km/s"]],
        zonen: { einheit: "°C", min: -35, max: 48, bereiche: [["Kühle Gebirge", -35, 8], ["Gemäßigte Mineralhochländer", 2, 24], ["Feuchte hydrothermale Täler", 10, 35], ["Trockene Salz- und Kristallregionen", 8, 48]] },
        zonenText: "Die Klimazonen sind grobe Arbeitsbereiche, keine flächendeckende Klimakarte. Ozeane puffern Temperaturschwankungen; Gebirge, Vulkanbecken, Salzregionen und saisonale Frostzonen erzeugen lokale Extreme.",
        rekorde: [["Besondere Entstehungsräume", "Seltene elektrochemisch aktive Mineralformationen"], ["Wasserflächen", "ca. 48 %"], ["Aktive natürliche Lebensdauer", "500–2.000 Jahre"]]
    },
    bilder: { medien: [["Vahr-Kluft – hydrothermaler Denkraum", B.kluft], ["Mineralische Becken", B.becken], ["Schwarze Terrassen", B.terrassen], ["Küsten- und Salzlandschaften", B.kueste], ["Mineralisches Hochland", B.hochland]] },
    kapitel: {
        "Allgemeines": { intro: "Iskara vereint eine gewöhnliche Biosphäre mit seltenen natürlichen Mineralnetzwerken, in denen solitidisches Bewusstsein entstehen kann.", abschnitte: [
            { titel: "Planetare Identität", daten: [["Name", "Iskara"], ["System", "Teryn-System"], ["Position", "Dritter von sechs Hauptplaneten"], ["Planetentyp", "Terrestrischer Silikat-Gesteinsplanet"], ["Heimische Intelligenz", "Solitiden"]] },
            { titel: "Solitidische Denkräume", text: ["Solitiden entstehen nicht überall auf dem Planeten. Geeignete mineralische Formationen benötigen seltene, langfristig stabile geochemische Bedingungen. Gemeinschaftliche Infrastruktur schützt einzelne, räumlich getrennte Denkräume."] }
        ] },
        "Geografie": { intro: "Ozeane, mineralische Hochländer und hydrothermal aktive Bruchsysteme bestimmen Iskaras Landschaft.", kopfbild: B.kluft, abschnitte: [
            { titel: "Vahr-Kluft", text: ["Das weitläufige hydrothermale Bruchsystem enthält komplexe Ablagerungen und gilt als bedeutendes Forschungsgebiet für die natürliche Entstehung mineralischer Denknetze. Stationen und Sensorfelder überwachen geschützte Zonen."] },
            { titel: "Neun Becken von Othun", text: ["Vor etwa 4.100 Jahren veränderten tektonische Prozesse die Versorgung mehrerer hydrothermaler Gebiete. Die Katastrophe verursachte zahlreiche Todesfälle. Heute liegen dort Überwachungs- und archäologische Forschungsstätten."] },
            { titel: "Silan-Salzmeer und Schwarze Terrassen", text: ["Das flache Silan-Salzmeer besitzt elektrochemisch aktive Grenzflächen und saisonale Verdunstungsflächen. Die Schwarzen Terrassen bestehen aus porösem Basalt, enthalten historische Denkräume und stehen teilweise unter Schutz."] },
            { titel: "Eryth-Graben", text: ["Der tektonisch aktive Eryth-Graben enthält geothermische Quellen und unterirdische Flüssigkeitswege. Er ist mineralreich, wird aber durch Erdbeben und vulkanische Gase gefährlich."] }
        ] },
        "Spezies": { intro: "Iskara ist Ursprungswelt der Solitiden.", abschnitte: [{ titel: "Natürliche Entstehung und Lebensraum", text: ["Neue Solitiden entstehen spontan in seltenen geeigneten Mineralformationen; Eltern, Geschlechter und genetische Vererbung gibt es nicht. Die geschätzte aktive Heimatpopulation beträgt etwa 210.000 Individuen. Die gewöhnliche kohlenstoffbasierte Biosphäre bildet kein gemeinsames Bewusstsein mit ihnen."], verweise: [["Zum Solitiden-Dossier", "inhalte/spezies/Mentale Spezies/Solitiden/hauptseite/Spezies.html"]] }] },
        "Geschichte": { intro: "Iskaras geologische Geschichte prägte die seltenen Lebensräume der Solitiden.", abschnitte: [{ titel: "Katastrophe der Neun Becken", text: ["Vor ungefähr 4.100 Jahren führte eine Veränderung tektonischer und hydrothermaler Versorgung zum Ausfall mehrerer Lebensräume. Die Erinnerung daran prägt Überwachung, Schutzrecht und Langzeitplanung."] }] },
        "Besonderheiten": { intro: "Die Besonderheiten Iskaras beruhen auf geologischen und geochemischen Prozessen, nicht auf übernatürlichen Ursachen.", abschnitte: [{ titel: "Seltene aktive Mineralnetzwerke", text: ["Bewusste Formationen sind außergewöhnlich selten. Ihre chemischen Energiequellen müssen langfristig erneuert werden; aktive Denkräume können unter günstigen Bedingungen 500 bis 2.000 Jahre erhalten bleiben."] }, { titel: "Offene Klimamodellierung", text: ["Die angenommene globale Mitteltemperatur von etwa 12 °C erfordert eine atmosphärische Treibhauswirkung. Ein vollständiges Klima- oder Zirkulationsmodell liegt nicht vor; regionale Angaben sind deshalb Arbeitswerte."] }] }
    }
};
