import { getAporiaMedia } from "../../aporia-media.js";

export async function ladeSternenkartenMedium(art) {
    const schluessel = "sternenkarte." + art;
    const [original, platzhalter] = await Promise.all([
        getAporiaMedia(schluessel + ".original"),
        getAporiaMedia(schluessel + ".platzhalter")
    ]);

    return { original, platzhalter };
}
