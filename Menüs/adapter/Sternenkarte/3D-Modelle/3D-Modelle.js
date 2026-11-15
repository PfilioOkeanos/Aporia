const assetOrdner = new URL("../../../../assets/Modelle/Sternenkarte/", import.meta.url);
const formate = /\.(glb|fbx|obj)$/i;

export function istModelldatei(name) {
    return typeof name === "string" && !/[\\/:?#\x00-\x1f]/.test(name) && formate.test(name);
}

export function modellURL(name) {
    if (!istModelldatei(name)) throw new Error("Ungültiger Modellpfad.");
    return new URL(encodeURIComponent(name), assetOrdner);
}

export function erstelleModellDateiname(name) {
    if (!istModelldatei(name)) throw new Error("Unterstützt werden GLB, FBX und OBJ.");
    const endung = name.match(formate)[0].toLowerCase();
    const stamm = name.slice(0, -endung.length).normalize("NFKD").replace(/[^a-z0-9_-]/gi, "-").slice(0, 80);
    return (stamm || "modell") + "-" + crypto.randomUUID() + endung;
}

export async function parseModell(datei) {
    const { LoadingManager } = await import("three");
    const manager = new LoadingManager();
    // Imports are self-contained. Resolve embedded textures without contacting external hosts.
    manager.setURLModifier(url => /^(data:|blob:)/i.test(url) ? url : "data:,");
    switch (datei.name.split(".").pop().toLowerCase()) {
        case "glb": {
            const { GLTFLoader } = await import("three/addons/loaders/GLTFLoader.js");
            return (await new GLTFLoader(manager).parseAsync(await datei.arrayBuffer(), "")).scene;
        }
        case "fbx": {
            const { FBXLoader } = await import("three/addons/loaders/FBXLoader.js");
            return new FBXLoader(manager).parse(await datei.arrayBuffer(), "");
        }
        case "obj": {
            const { OBJLoader } = await import("three/addons/loaders/OBJLoader.js");
            return new OBJLoader(manager).parse(await datei.text());
        }
        default:
            throw new Error("Unterstützt werden GLB, FBX und OBJ.");
    }
}
