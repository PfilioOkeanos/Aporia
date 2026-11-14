export function getCelestialTopics(group = '') {
    const topics = [
        ["uebersicht", "Übersicht", "Typ, Größe, Sternsystem, Tages- und Jahreslänge, Erkundungsstand"],
        ["landung", "Anflug & Landung", "Anflugrouten, Landezonen, Sperrgebiete"],
        ["gravitation", "Gravitation & Bewegung", "Schwerkraft, Traglast, Fahrzeuge und Fortbewegung"],
        ["atmosphaere", "Atmosphäre & Überleben", "Atembarkeit, Druck, Temperatur, Strahlung und Ausrüstung"],
        ["wetter", "Wetter & Wind", "Wind, Stürme, Sichtweite und sichere Zeitfenster"],
        ["gelaende", "Karte & Gelände", "Biome, Gewässer, Höhen, Höhlen und Routen"],
        ["rohstoffe", "Rohstoffe", "Vorkommen, Fundorte und Abbau"],
        ["lebensformen", "Flora & Fauna", "Arten, Lebensräume, Verhalten und Spuren"],
        ["siedlungen", "Siedlungen & Fraktionen", "Bewohner, Zutritt, Handel und Versorgung"],
        ["gefahren", "Gefahren & Rückzug", "Risiken, Schutzräume und Rückwege"],
        ["entdeckungen", "Entdeckungen", "Signale, Ruinen, Anomalien und Erkundungsfortschritt"],
        ["orbit", "Orbit & Monde", "Umlaufbahnen, Begleiter, Stationen und Gezeiten"],
    ];
    if (/lebend|biolog|kollektiv|synthetisch|symbio/i.test(group)) {
        topics.push(["reaktionen", "Reaktionen der Welt", "Reaktionen auf Landung, Lärm und Rohstoffabbau"]);
    }

    return topics;
}
