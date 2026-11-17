
/* =========================================================
   APORIA - ZENTRALE MEDIENVERWALTUNG
   Version 1.0
   ========================================================= */


/* =========================================================
   01 - KONFIGURATION
   ========================================================= */

// Zentrale JSON-Datei
const MEDIA_CONFIG_URL = new URL(
    "../../inhalte/medien/medien.json",
    import.meta.url
);
const ASSET_CATALOG_URL = new URL("../../assets/asset-catalog.json", import.meta.url);
const PROJECT_ROOT_URL = new URL("../../", import.meta.url);

// Zwischenspeicher für die Medienkonfiguration
let mediaConfigPromise = null;
let assetCatalogPromise = null;

// Bereits gemeldete Fehler nicht mehrfach ausgeben
const reportedWarnings = new Set();


/* =========================================================
   02 - MEDIENKONFIGURATION LADEN
   ========================================================= */

async function loadMediaConfig(forceReload = false) {

    if (forceReload) {
        mediaConfigPromise = null;
    }

    if (!mediaConfigPromise) {

        mediaConfigPromise = (async () => {

            const response = await fetch(
                MEDIA_CONFIG_URL,
                {
                    cache: "no-store"
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Medienkonfiguration konnte nicht geladen werden: HTTP ${response.status}`
                );
            }

            const config = await response.json();

            if (
                !config ||
                typeof config.media !== "object"
            ) {
                throw new Error(
                    "Ungültige Medienkonfiguration."
                );
            }

            return config;

        })().catch(error => {

            mediaConfigPromise = null;
            throw error;

        });

    }

    return mediaConfigPromise;
}


/* =========================================================
   03 - MEDIEN ÜBER SCHLÜSSEL FINDEN
   ========================================================= */

function findMediaEntry(config, key) {

    if (!key) return null;

    const entry = key
        .split(".")
        .reduce(
            (current, part) => current?.[part],
            config.media
        );

    // Auch einfache Pfadangaben unterstützen
    if (typeof entry === "string") {
        return { src: entry };
    }

    return entry ?? null;
}

/* =========================================================
   04 - MEDIENPFAD AUFLÖSEN
   ========================================================= */

function resolveMediaPath(path) {

    if (
        typeof path !== "string" ||
        !path.trim()
    ) {
        return null;
    }

    try {

        return new URL(
            path,
            MEDIA_CONFIG_URL
        ).href;

    } catch (error) {

        console.error(
            "APORIA: Ungültiger Medienpfad:",
            path,
            error
        );

        return null;

    }
}


/* =========================================================
   05 - WARNUNGEN
   ========================================================= */

function warnOnce(message) {

    if (reportedWarnings.has(message)) return;

    reportedWarnings.add(message);

    console.warn("APORIA MEDIA:", message);
}


/* =========================================================
   06 - ELEMENTE FINDEN
   ========================================================= */

function findElements(root, selector) {

    const elements = [];

    if (
        root instanceof Element &&
        root.matches(selector)
    ) {
        elements.push(root);
    }

    elements.push(
        ...root.querySelectorAll(selector)
    );

    return elements;
}


/* =========================================================
   07 - BILDER EINSETZEN
   ========================================================= */

function applyImages(root, config) {

    const images = findElements(
        root,
        "[data-media-image]"
    );

    images.forEach(image => {

        const key = image.dataset.mediaImage;

        const media = findMediaEntry(
            config,
            key
        );

        if (!media || !media.src) {

            warnOnce(
                `Bild nicht gefunden: ${key}`
            );

            return;
        }

        const src = resolveMediaPath(media.src);

        if (!src) return;

        if (image.getAttribute("src") !== src) {
            image.src = src;
        }

        if (media.alt) {
            image.alt = media.alt;
        }

        if (media.title) {
            image.title = media.title;
        }

    });

}


/* =========================================================
   08 - VIDEOS EINSETZEN
   ========================================================= */

function applyVideos(root, config) {

    const videos = findElements(
        root,
        "video[data-media-video]"
    );

    videos.forEach(video => {

        const key = video.dataset.mediaVideo;

        const media = findMediaEntry(
            config,
            key
        );

        if (!media || !media.src) {

            warnOnce(
                `Video nicht gefunden: ${key}`
            );

            return;
        }

        const src = resolveMediaPath(media.src);

        if (!src) return;

        if (media.poster) {

            video.poster = resolveMediaPath(
                media.poster
            );

        }

        if (video.getAttribute("src") !== src) {

            video.src = src;

            video.load();

        }

    });

}


/* =========================================================
   09 - HINTERGRUNDBILDER EINSETZEN
   ========================================================= */

function applyBackgrounds(root, config) {

    const backgrounds = findElements(
        root,
        "[data-media-background]"
    );

    backgrounds.forEach(element => {

        const key = element.dataset.mediaBackground;

        const media = findMediaEntry(
            config,
            key
        );

        if (!media || !media.src) {

            warnOnce(
                `Hintergrundbild nicht gefunden: ${key}`
            );

            return;
        }

        const src = resolveMediaPath(media.src);

        if (!src) return;

        element.style.backgroundImage =
            `url("${src}")`;

    });

}

/* =========================================================
   09A - MEDIEN AUF EIN ELEMENT ANWENDEN
   ========================================================= */

function applyMediaToRoot(root, config) {

    applyImages(root, config);

    applyVideos(root, config);

    applyBackgrounds(root, config);

}


/* =========================================================
   09B - DYNAMISCHE ELEMENTE ÜBERWACHEN
   ========================================================= */

let mediaObserver = null;

function observeDynamicMedia() {

    if (
        mediaObserver ||
        !document.documentElement ||
        typeof MutationObserver === "undefined"
    ) {
        return;
    }

    mediaObserver = new MutationObserver(records => {

        const targets = new Set();

        records.forEach(record => {

            if (record.type === "childList") {

                record.addedNodes.forEach(node => {

                    if (node.nodeType === 1) {
                        targets.add(node);
                    }

                });

            }

            if (
                record.type === "attributes" &&
                record.target.nodeType === 1
            ) {
                targets.add(record.target);
            }

        });

        if (targets.size === 0) return;

        loadMediaConfig()
            .then(config => {

                targets.forEach(element => {

                    applyMediaToRoot(element, config);

                });

            })
            .catch(error => {

                console.error(
                    "APORIA MEDIA: Dynamische Medien konnten nicht geladen werden.",
                    error
                );

            });

    });

    mediaObserver.observe(
        document.documentElement,
        {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: [
                "data-media-image",
                "data-media-video",
                "data-media-background"
            ]
        }
    );

}


/* =========================================================
   10 - MEDIEN AUF SEITE ANWENDEN
   ========================================================= */

export async function applyAporiaMedia(
    root = document
) {

    try {

        const config = await loadMediaConfig();

        applyImages(root, config);

        applyVideos(root, config);

        applyBackgrounds(root, config);

        console.log(
            "APORIA MEDIA: Medien erfolgreich angewendet."
        );

        return true;

    } catch (error) {

        console.error(
            "APORIA MEDIA FEHLER:",
            error
        );

        return false;

    }

}


/* =========================================================
   11 - EINZELNES MEDIUM ABRUFEN
   ========================================================= */

export async function getAporiaMedia(key) {

    try {

        const config = await loadMediaConfig();

        const media = findMediaEntry(
            config,
            key
        );

        if (!media) return null;

        return {
            ...media,
            url: resolveMediaPath(media.src),
            posterUrl: media.poster
                ? resolveMediaPath(media.poster)
                : null
        };

    } catch (error) {

        console.error(
            "APORIA MEDIA: Abruf fehlgeschlagen.",
            error
        );

        return null;

    }

}


/* =========================================================
   12 - MEDIEN NEU LADEN
   ========================================================= */


export async function reloadAporiaMedia(root = document) {

    try {

        const config = await loadMediaConfig(true);

        applyMediaToRoot(root, config);

        return true;

    } catch (error) {

        console.error(
            "APORIA MEDIA FEHLER:",
            error
        );

        return false;

    }

}

/* =========================================================
   13 - GLOBALE SCHNITTSTELLE
   ========================================================= */

window.AporiaMedia = Object.freeze({

    apply: applyAporiaMedia,

    get: getAporiaMedia,

    reload: reloadAporiaMedia

});




/* =========================================================
   14 - AUTOMATISCHER START
   ========================================================= */

function initializeAporiaMedia() {

    // Zukünftige Änderungen erkennen
    observeDynamicMedia();

    // Bereits vorhandene Medien einsetzen
    applyAporiaMedia();

}

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initializeAporiaMedia,
        { once: true }
    );

} else {

    initializeAporiaMedia();

}

export async function getAporiaMediaCollection(key) {
    const config = await loadMediaConfig();
    const entry = findMediaEntry(config, key);
    return (entry?.items ?? []).map(item => ({
        ...item,
        url: resolveMediaPath(item.src),
    })).filter(item => item.url);
}

export async function getAporiaAssetCatalog(forceReload = false) {
    if (forceReload) assetCatalogPromise = null;
    if (!assetCatalogPromise) {
        assetCatalogPromise = fetch(ASSET_CATALOG_URL, { cache: "no-store" })
            .then(response => {
                if (!response.ok) throw new Error(`Asset-Katalog konnte nicht geladen werden: HTTP ${response.status}`);
                return response.json();
            })
            .then(catalog => {
                if (!catalog?.roots || typeof catalog.roots !== "object") {
                    throw new Error("Ungültiger Asset-Katalog.");
                }
                const resolveNode = node => ({
                    name: node.name,
                    files: (node.files ?? []).map(file => ({
                        ...file,
                        url: new URL(file.src, PROJECT_ROOT_URL).href
                    })),
                    children: Object.fromEntries(
                        Object.entries(node.children ?? {}).map(([name, child]) => [name, resolveNode(child)])
                    )
                });
                return {
                    version: catalog.version,
                    roots: Object.fromEntries(Object.entries(catalog.roots).map(([name, node]) => [name, resolveNode(node)]))
                };
            })
            .catch(error => {
                assetCatalogPromise = null;
                throw error;
            });
    }
    return assetCatalogPromise;
}
