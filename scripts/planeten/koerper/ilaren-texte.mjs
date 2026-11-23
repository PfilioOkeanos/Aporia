// Runde 2–4 der Fragenroutine liegt in ilaren-routine.md. Diese Antworten
// ergänzen den vorhandenen automatischen Dossieraufbau, ohne dessen Vorlage zu ersetzen.
export default {
  "ilaren-stern": {
    name: "Ilaren",
    intro: "Ilaren ist ein einzelner K3-V-Stern mittleren Alters. Seine ruhige orange Strahlung prägt ein kompaktes System mit einer gemäßigten Zone zwischen ungefähr 0,49 und 0,85 AE.",
    kapitel: {
      "Spektralklasse": { abschnitte: [{ titel: "K3-V-Hauptreihe", text: ["Die Oberflächentemperatur von etwa 4.750 K und die orange Farbe passen zur Spektralklasse K3 V. Ilaren fusioniert Wasserstoff im Kern und ist kein roter M-Zwerg."] }] },
      "Leuchtkraft": { abschnitte: [{ titel: "Energieabgabe", daten: [["Leuchtkraft", "0,26 L☉"], ["Masse", "0,78 M☉"], ["Radius", "0,76 R☉"], ["Effektivtemperatur", "ca. 4.750 K"], ["Habitable Zone", "ca. 0,49–0,85 AE"]], text: ["Die Leuchtkraft ist mit Masse und Temperatur konsistent; dadurch kann Khaluun bei 0,52 AE annähernd erdähnliche Einstrahlung erhalten."] }] },
      "Lebenszyklus": { abschnitte: [{ titel: "Langlebiger Einzelstern", text: ["Das Modellalter von rund 5,6 Milliarden Jahren liegt weit innerhalb der langen Hauptreihenphase eines K-Sterns. Es bleibt über Milliarden Jahre Zeit für eine stabile planetare Entwicklung."] }] },
      "Umgebung": { abschnitte: [{ titel: "Magnetische Aktivität", text: ["Ilaren wird als mäßig aktiv angesetzt. Einzelne Flares und Sternwind verändern die Weltraumwetterlage, doch das System wird nicht von einer extremen Dauereruption dominiert. Ein stellarer Begleiter ist nicht vorhanden."] }] }
    }
  },
  "ilaren-harrek": {
    name: "Harrek",
    intro: "Harrek ist eine kompakte, stark bestrahlte Gesteinswelt. Seine alte Krateroberfläche und thermisch beanspruchte Kruste unterscheiden ihn von der trockenen Wüstenwelt Vosan.",
    kapitel: {
      "Allgemeines": { abschnitte: [{ titel: "Innerste Welt", text: ["Harrek umläuft Ilaren in 0,15 AE Entfernung. Das Bahnmodell ergibt rund 24 Erdtage und eine Einstrahlung von etwa 11,6 Erden. Die Gleichgewichtstemperatur von rund 216 °C ist ein globaler Strahlungswert, kein einheitlicher Oberflächenmesswert."] }] },
      "Physik": { abschnitte: [{ titel: "Kompakter Gesteinskörper", daten: [["Masse", "0,36 Erdmassen"], ["Radius", "4.700 km"], ["Mittlere Dichte", "ca. 4,95 g/cm³"], ["Oberflächengravitation", "ca. 6,5 m/s²"]], text: ["Die Dichte ist für einen differenzierten Silikat- und Metallkörper plausibel. Die geringere Gravitation als auf der Erde erschwert das langfristige Halten einer dichten Atmosphäre."] }] },
      "Geologie": { abschnitte: [{ titel: "Thermisch geprägte Kruste", text: ["Alte Einschlagsbecken, glasige Schmelzflächen und ausgedehnte Schrumpfungsrisse kennzeichnen Harreks Oberfläche. Starke Temperaturwechsel verursachen mechanische Verwitterung; aktive globale Plattentektonik wird nicht vorausgesetzt."] }] },
      "Atmosphäre": { abschnitte: [{ titel: "Dünne Exosphäre", text: ["Als Arbeitsmodell gilt eine sehr dünne, durch Sonnenwind und Einschläge ständig erneuerte Exosphäre. Eine dichte, atembare Atmosphäre ist mit Größe, Hitze und Sternwind nicht vereinbar."] }] }
    }
  },
  "ilaren-vosan": {
    name: "Vosan",
    intro: "Vosan ist eine trockene, staubige Gesteinswelt mit ausgedehnten Ebenen und alten Abflussformen. Anders als Harrek besitzt sie genug Abstand zu Ilaren für ein kühleres, geologisch ruhigeres Oberflächenregime.",
    kapitel: {
      "Allgemeines": { abschnitte: [{ titel: "Innere Wüstenwelt", text: ["Vosan liegt bei 0,31 AE. Die Einstrahlung erreicht etwa 2,7 Erden; die berechnete Gleichgewichtstemperatur beträgt rund 59 °C. Große Tag-Nacht-Spannen entstehen durch den dünnen Luftmantel."] }] },
      "Physik": { abschnitte: [{ titel: "Masse und Schwerkraft", daten: [["Masse", "0,72 Erdmassen"], ["Radius", "6.500 km"], ["Abgeleitete Dichte", "ca. 3,7 g/cm³"], ["Oberflächengravitation", "ca. 6,8 m/s²"]], text: ["Die relativ niedrige Gesteinsdichte ist ein Modellwert und spricht für einen silikatreichen, weniger metallreichen Aufbau als bei Harrek."] }] },
      "Geografie": { abschnitte: [{ titel: "Erosionsbecken und alte Flussrinnen", text: ["Windgeschliffene Plateaus, Kiesebenen und verzweigte Reliefrinnen bestimmen die Landschaft. Die Rinnen gelten als Relikte früherer episodischer Abflüsse; heute bestehen dort keine offenen Flüsse."] }] },
      "Atmosphäre": { abschnitte: [{ titel: "Dünner Kohlendioxidmantel", text: ["Die Arbeitsannahme ist eine dünne, überwiegend aus Kohlendioxid bestehende Restatmosphäre mit Stickstoffanteilen und Staub. Ihr Druck und die genaue Zusammensetzung sind noch nicht gemessen und werden im Dossier als Modellwerte markiert."] }] },
      "Erforschung": { abschnitte: [{ titel: "Offene Messungen", liste: ["Druck und jahreszeitliche Staubfracht der Atmosphäre bestimmen.", "Nach unterirdischem Eis und salzhaltigen Reststoffen suchen.", "Die Mineralogie der alten Abflussrinnen kartieren."] }] }
    }
  },
  "ilaren-deyra": {
    name: "Deyra",
    intro: "Deyra ist der innere, größere der beiden Khaluun-Monde. Seine kompakte Gesteinszusammensetzung und stärkere Gezeitenwirkung prägen ihn stärker als den weiter außen kreisenden Orim.",
    kapitel: {
      "Allgemeines": { abschnitte: [{ titel: "Innerer Mond", text: ["Deyra umrundet Khaluun in durchschnittlich rund 185.500 km Entfernung. Ein Umlauf dauert 8,84 Tage. Die Bahn ist nahezu kreisförmig und liegt deutlich innerhalb der Hill-Sphäre Khaluuns."] }] },
      "Mutterplanet": { abschnitte: [{ titel: "Khaluun als Bezugskörper", text: ["Khaluun ist Deyras Zentral- und Mutterplanet. Seine größere Masse hält Deyra gravitativ gebunden; die beiden Körper sind keine Doppelplaneten."] }] },
      "Gezeiten": { abschnitte: [{ titel: "Gezeitenkopplung", text: ["Deyras größere Masse und kürzere Entfernung machen ihn zum stärkeren Einzelbeitrag zu den Khaluun-Gezeiten. Die regelmäßige Bahn erzeugt wiederkehrende Küstenzyklen, aber keine planetenweite Katastrophenflut."] }] },
      "Geologie": { abschnitte: [{ titel: "Differenzierter Kratermond", text: ["Bei 1.010 km Radius und 0,004 Erdmassen ergibt sich eine mittlere Dichte von etwa 5,5 g/cm³. Das passt zu einem kompakten, teilweise differenzierten Silikatkörper mit metallreicherem Inneren. Alte Einschlagsbecken und jüngere Bruchzonen werden als Oberflächenmerkmale angenommen."] }] }
    }
  },
  "ilaren-orim": {
    name: "Orim",
    intro: "Orim ist der kleinere äußere Mond Khaluuns. Seine lange Umlaufzeit und lokal begrenzten salzigen Tiefenbrüche unterscheiden ihn von Deyra.",
    kapitel: {
      "Allgemeines": { abschnitte: [{ titel: "Äußerer Mond", text: ["Orim kreist im Mittel rund 335.100 km von Khaluun entfernt und vollendet einen Umlauf in etwa 21,48 Tagen. Die Bahn liegt innerhalb des gravitativen Einflussbereichs Khaluuns."] }] },
      "Mutterplanet": { abschnitte: [{ titel: "Gebundener Begleiter", text: ["Khaluun ist Orims Mutterplanet. Orim ist kleiner und weiter entfernt als Deyra und beeinflusst die Gezeiten deshalb schwächer."] }] },
      "Gezeiten": { abschnitte: [{ titel: "Schwacher zusätzlicher Gezeitenrhythmus", text: ["Orims Beitrag überlagert Deyras stärkeren Zyklus mit einer zweiten, langsameren Komponente. Eine starke innere Erwärmung durch die Bahn wird nicht angenommen."] }] },
      "Biosphäre": { abschnitte: [{ titel: "Mikrobielle Nischen als Modellannahme", text: ["Für die Darstellung des freien Archivmotivs wird Orim als biologisch interessant, aber nicht als global lebendig geführt: Kleine mikrobielle Matten könnten in salzigen, zeitweise warmen Tiefenbrüchen vorkommen. Eine eigenständige intelligente Spezies oder flächendeckende Biosphäre gibt es nicht."] }] },
      "Geologie": { abschnitte: [{ titel: "Kompakter kleiner Mond", daten: [["Radius", "790 km"], ["Masse", "0,002 Erdmassen"], ["Abgeleitete Dichte", "ca. 5,8 g/cm³"]], text: ["Die hohe Modell-Dichte deutet auf einen kompakten silikatischen Körper mit metallreichem Kern. Oberflächenmerkmale sind dunkle Krater und einzelne salzhaltige Bruchzonen."] }] }
    }
  },
  "ilaren-meyt": {
    name: "Meyt",
    intro: "Meyt ist eine kalte Gesteinswelt außerhalb der gemäßigten Zone Ilarens. Oberflächeneis und mögliche salzige Tiefenreservoire unterscheiden sie von Vosans trockener Wüste.",
    kapitel: {
      "Allgemeines": { abschnitte: [{ titel: "Kalte Außenwelt", text: ["Meyt kreist in 0,92 AE Entfernung. Bei rund 31 Prozent der Erdbestrahlung beträgt seine Gleichgewichtstemperatur etwa −92 °C. Die Umlaufzeit liegt bei 364,9 Tagen."] }] },
      "Physik": { abschnitte: [{ titel: "Kompakter Gesteinsplanet", daten: [["Masse", "0,78 Erdmassen"], ["Radius", "6.000 km"], ["Abgeleitete Dichte", "ca. 5,1 g/cm³"], ["Oberflächengravitation", "ca. 9,7 m/s²"]] }] },
      "Klima": { abschnitte: [{ titel: "Dauerfrost und saisonale Reifzonen", text: ["Der globale Energieeintrag reicht für dauerhaft flüssiges Oberflächenwasser nicht aus. Frost und Eis lagern sich in Becken und Hochbreiten ab; ein dünner Restluftmantel kann Staub zeitweise bewegen."] }] },
      "Geologie": { abschnitte: [{ titel: "Eis über mineralischem Untergrund", text: ["Die Oberfläche besteht aus Silikatgestein, Frost und lokal salzhaltigen Ablagerungen. Unterirdische Sole oder ein tiefer Restwasserleiter sind Suchziele, keine bestätigten globalen Ozeane."] }] },
      "Erforschung": { abschnitte: [{ titel: "Messziele", liste: ["Dicke und Verteilung der Eisablagerungen vermessen.", "Salzgehalt möglicher Tiefenreservoire bestimmen.", "Atmosphärenreste und ihre jahreszeitliche Veränderung erfassen."] }] }
    }
  },
  "ilaren-asteroidenguertel": {
    name: "Ilaren-Asteroidengürtel",
    intro: "Der Ilaren-Asteroidengürtel ist eine verteilte Population kleiner Körper zwischen Meyt und Daran, kein einzelner Himmelskörper.",
    kapitel: {
      "Bahnen": { abschnitte: [{ titel: "Ausgedehnte Gürtelzone", daten: [["Innere Grenze", "1,3 AE"], ["Äußere Grenze", "1,9 AE"], ["Größter angenommener Brocken", "bis ca. 320 km"]], text: ["Die 240 in der Sternenkarte dargestellten Brocken sind eine Visualisierung und keine Zählung der realen Population."] }] },
      "Zusammensetzung": { abschnitte: [{ titel: "Ursprüngliches Baumaterial", liste: ["Silikatische Fragmente aus der frühen Akkretionsscheibe.", "Metallreiche Körper aus differenzierten Vorläufern.", "Kohlenstoffhaltige Brocken mit gebundenen flüchtigen Stoffen."] }] },
      "Stabilität": { abschnitte: [{ titel: "Resonanzen am äußeren Rand", text: ["Daran formt durch gravitative Resonanzen den äußeren Gürtelrand. Die Verteilung besitzt Lücken und Verdichtungen, aber keine zusätzliche planetengroße Masse."] }] },
      "Erforschung": { abschnitte: [{ titel: "Rohstoff- und Forschungsregion", text: ["Fernerkundung trennt metallische, silikatische und kohlenstoffreiche Familien. Abbau muss kleine Körper einzeln erfassen; das Gürtelmodell selbst hat keine feste Oberfläche."] }] }
    }
  },
  "ilaren-daran": {
    name: "Daran",
    intro: "Daran ist ein wasserstoffreicher Gasriese und der massereichste Planet des Ilaren-Systems. Seine Gravitation ordnet die äußeren Kleinkörper, ohne den inneren Gürtel aufzulösen.",
    kapitel: {
      "Allgemeines": { abschnitte: [{ titel: "Äußerer Gasriese", text: ["Daran umläuft Ilaren in 2,45 AE Entfernung; ein Jahr dauert rund 1.586 Erdtage. Seine Gleichgewichtstemperatur liegt bei ungefähr −159 °C, während tiefe Atmosphärenschichten durch innere Wärme deutlich wärmer sind."] }] },
      "Physik": { abschnitte: [{ titel: "Leichter als Wasser", daten: [["Masse", "85 Erdmassen"], ["Radius", "53.000 km"], ["Abgeleitete mittlere Dichte", "ca. 0,81 g/cm³"]], text: ["Die mittlere Dichte passt zu einer ausgedehnten Wasserstoff-Helium-Hülle. Der Radius und die Masse liegen unterhalb der typischen Werte eines stark aufgeblähten heißen Jupiters."] }] },
      "Atmosphäre": { abschnitte: [{ titel: "Bänder, Wolken und tiefe Druckschichten", text: ["Schnelle Rotation ordnet die Atmosphäre in breite Jetstreams und Wolkenbänder. Mit der Tiefe steigen Druck und Temperatur; feste Oberfläche gibt es nicht."] }] },
      "Besonderheiten": { abschnitte: [{ titel: "Wärme und Magnetfeld", text: ["Daran strahlt gespeicherte Entstehungswärme ab. Ein ausgedehntes Magnetfeld und ein schwaches Ringsystem sind plausible Modellmerkmale, deren genaue Stärke noch offen ist."] }] },
      "Monde": { abschnitte: [{ titel: "Satellitensystem", text: ["Daran dürfte kleinere Monde besitzen. Da noch keine belastbaren Einzelbahnen in der Systemdatei vorliegen, werden sie hier nicht benannt oder als Kartenkörper erfunden."] }] }
    }
  },
  "ilaren-ulmar": {
    name: "Ulmar",
    intro: "Ulmar ist der weit außen kreisende Eisriese des Systems. Seine kalte Methanwolken-Atmosphäre und flüchtigenreichen Tiefenschichten unterscheiden ihn vom wasserstoffreichen Gasriesen Daran.",
    kapitel: {
      "Allgemeines": { abschnitte: [{ titel: "Äußerer Eisriese", text: ["Ulmar liegt bei 5,9 AE und benötigt rund 5.927 Erdtage für einen Umlauf. Die geringe Einstrahlung ergibt eine Gleichgewichtstemperatur um −199 °C."] }] },
      "Physik": { abschnitte: [{ titel: "Ausgedehnte Hülle", daten: [["Masse", "16 Erdmassen"], ["Radius", "24.500 km"], ["Abgeleitete mittlere Dichte", "ca. 1,55 g/cm³"], ["Oberflächengravitation", "ca. 10,6 m/s²"]], text: ["Die mittlere Dichte passt zu einem neptunähnlichen Eisriesen mit flüchtigenreichen inneren Schichten. Ulmar besitzt keine feste Oberfläche, auf der gelandet werden könnte."] }] },
      "Atmosphäre": { abschnitte: [{ titel: "Methan und Hochdruckwolken", text: ["Wasserstoff und Helium bilden den äußeren Atmosphärenmantel; Methan absorbiert rotes Licht und prägt die blaue Farbe. Wasser, Ammoniak und Methan liegen tiefer als Hochdruckgemische vor."] }] },
      "Besonderheiten": { abschnitte: [{ titel: "Dynamische äußere Atmosphäre", text: ["Lange Umlaufzeiten und geringe Sonnenwärme erzeugen kalte Wolkenschichten. Starke interne Wärme oder ein großflächiges Ringsystem werden nicht ohne Beobachtungsdaten behauptet."] }] },
      "Erforschung": { abschnitte: [{ titel: "Fernerkundung", liste: ["Wolkenbewegung und Rotationsdauer bestimmen.", "Magnetfeld und mögliche Auroren kartieren.", "Größe und Bahnen der tatsächlich nachgewiesenen Monde erfassen."] }] }
    }
  },
  "ilaren-komet": {
    name: "Seyran",
    intro: "Seyran ist ein langperiodischer, eisig-staubiger Kleinkörper auf einer stark elliptischen und geneigten Bahn. Seine Aktivität nimmt erst in Sonnennähe zu.",
    kapitel: {
      "Kern": { abschnitte: [{ titel: "Poröser Mischkörper", daten: [["Radius", "ca. 7 km"], ["Durchmesser", "ca. 14 km"]], text: ["Der Kern besteht modellhaft aus Wassereis, weiteren flüchtigen Stoffen, Staub und silikatischem Material. Hohlräume und lose Bruchstücke ergeben eine geringere mittlere Dichte als massives Gestein."] }] },
      "Umlaufbahn": { abschnitte: [{ titel: "Langgestreckte Bahn", daten: [["Halbachse", "24 AE"], ["Exzentrizität", "0,72"], ["Perihel", "6,72 AE"], ["Aphel", "41,28 AE"], ["Bahnneigung", "14°"], ["Umlaufzeit", "ca. 133 Jahre"]], text: ["Seyrans Perihel liegt außerhalb von Ulmars modelliertem Aphel bei rund 6,17 AE. Die Bahnradien überschneiden sich daher nicht."] }] },
      "Koma": { abschnitte: [{ titel: "Aktivität nahe dem Perihel", text: ["Bei Annäherung an Ilaren sublimieren oberflächennahe Eise. Eine temporäre Koma aus Gas und Staub entsteht; in großer Entfernung bleibt Seyran überwiegend inaktiv."] }] },
      "Schweif": { abschnitte: [{ titel: "Zwei vom Stern geformte Schweife", text: ["Gas wird durch ultraviolette Strahlung ionisiert und vom Sternwind weggetragen. Größere Staubteilchen folgen stärker der Bahn und bilden einen gekrümmten Staubschweif. Beide richten sich nicht dauerhaft entlang derselben Linie aus."] }] },
      "Herkunft": { abschnitte: [{ titel: "Äußere Reservoirregion", text: ["Seyran stammt im Arbeitsmodell aus einem kalten äußeren Reservoir. Eine frühe gravitative Störung lenkte ihn auf die langgestreckte Bahn; ein konkreter Störer ist nicht festgelegt."] }] }
    }
  }
};
