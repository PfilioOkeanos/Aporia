const planetary = "https://nssdc.gsfc.nasa.gov/planetary/factsheet/";
const satellite = "https://ssd.jpl.nasa.gov/sats/phys_par/";
const orbits = "https://ssd.jpl.nasa.gov/sats/elem/sep.html";
const photo = (pia, page, credit) => ({
    url: "https://assets.science.nasa.gov/content/dam/science/psd/photojournal/pia/" +
        pia.slice(0, 5).toLowerCase() + "/" + pia.toLowerCase() + "/" + pia + ".jpg",
    page: "https://science.nasa.gov/photojournal/" + page + "/",
    credit
});

function moon(theme, image) {
    return { theme, image, sources: [["JPL · Physikalische Daten", satellite], ["JPL · Umlaufbahnen", orbits]] };
}

export const solarReferences = {
    mars: {
        theme: "mars",
        image: photo("PIA00003", "valles-marineris-hemisphere", "NASA/JPL/USGS"),
        sources: [["NASA · Planetary Fact Sheet", planetary]],
        facts: { Masse: "6,42 × 10²³ kg", Äquatordurchmesser: "6.792 km",
            Rotation: "24,6 Stunden", Sonnentag: "24,7 Stunden", "Mittlere Temperatur": "ca. −65 °C" }
    },
    jupiter: {
        theme: "jupiter",
        image: photo("PIA04866", "cassini-jupiter-portrait", "NASA/JPL/Space Science Institute"),
        sources: [["NASA · Planetary Fact Sheet", planetary]],
        facts: { Masse: "1,90 × 10²⁷ kg", Äquatordurchmesser: "142.984 km",
            Rotation: "9,9 Stunden", "Temperatur am 1-bar-Niveau": "ca. −110 °C" }
    },
    orvaya: { theme: "orvaya" },
    mimas: moon("saturnmond", {
        ...photo("PIA12568", "examining-herschel-crater", "NASA/JPL/Space Science Institute"),
        url: "https://assets.science.nasa.gov/dynamicimage/assets/science/psd/photojournal/pia/pia12/pia12568/PIA12568.jpg?crop=faces%2Cfocalpoint&fit=clip&h=1536&w=1536"
    }),
    dione: moon("saturnmond", photo("PIA07746", "dione-in-full-view", "NASA/JPL/Space Science Institute")),
    rhea: moon("saturnmond", photo("PIA21354", "above-rhea", "NASA/JPL-Caltech/Space Science Institute")),
    miranda: moon("uranusmond", photo("PIA00043", "miranda-high-resolution-mosaic", "NASA/JPL"))
};
