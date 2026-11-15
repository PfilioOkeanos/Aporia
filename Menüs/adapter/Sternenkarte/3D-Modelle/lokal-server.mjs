import { createServer } from "node:http";
import { createHash, randomUUID } from "node:crypto";
import { createReadStream } from "node:fs";
import { readFile, realpath, rename, rm, stat, writeFile } from "node:fs/promises";
import { extname, relative, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { leseObjekte } from "../Kartendaten/Kartendaten.js";
import { istModelldatei } from "./3D-Modelle.js";

const projekt = await realpath(fileURLToPath(new URL("../../../../", import.meta.url)));
const kartenDatei = resolve(projekt, "Menüs/adapter/Sternenkarte/Kartendaten/objekte.json");
const modellOrdner = resolve(projekt, "assets/Modelle/Sternenkarte");
const threeOrdner = resolve(projekt, "node_modules/three");
const host = "127.0.0.1:8787";
const origin = "http://" + host;
const api = "/api/sternenkarte/objekte";
const limitJSON = 2 * 1024 * 1024;
const limitModell = 128 * 1024 * 1024;
const token = randomUUID();
let schreibvorgang = Promise.resolve();

const mime = {
    ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8", ".json": "application/json",
    ".txt": "text/plain; charset=utf-8", ".md": "text/plain; charset=utf-8",
    ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
    ".webp": "image/webp", ".gif": "image/gif", ".svg": "image/svg+xml",
    ".mp4": "video/mp4", ".webm": "video/webm", ".mp3": "audio/mpeg",
    ".wav": "audio/wav", ".ogg": "audio/ogg", ".glb": "model/gltf-binary",
    ".fbx": "application/octet-stream", ".obj": "text/plain"
};

function fehler(status, message) {
    return Object.assign(new Error(message), { status });
}

function sende(response, status, data, headers = {}) {
    response.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...headers });
    response.end(JSON.stringify(data));
}

function revision(text) {
    return createHash("sha256").update(text).digest("hex");
}

async function ladeStand() {
    const text = await readFile(kartenDatei, "utf8");
    return { text, version: revision(text) };
}

async function sichereJSON(text) {
    const temp = kartenDatei + "." + randomUUID() + ".tmp";
    try {
        await writeFile(temp, text, { flag: "wx" });
        await rename(temp, kartenDatei);
    } finally {
        await rm(temp, { force: true }).catch(() => {});
    }
}

async function leseBody(request, limit) {
    if (Number(request.headers["content-length"]) > limit) throw fehler(413, "Datei ist zu groß.");
    let groesse = 0;
    const chunks = [];
    for await (const chunk of request.iterator({ destroyOnReturn: false })) {
        groesse += chunk.length;
        if (groesse > limit) {
            request.resume();
            throw fehler(413, "Datei ist zu groß.");
        }
        chunks.push(chunk);
    }
    return Buffer.concat(chunks, groesse);
}

function liesImport(body) {
    if (body.length < 5) throw fehler(400, "Modelldaten fehlen.");
    const ende = 4 + body.readUInt32LE(0);
    if (ende <= 4 || ende > limitJSON || ende >= body.length) throw fehler(400, "Ungültige Importdaten.");
    let daten;
    try { daten = JSON.parse(body.toString("utf8", 4, ende)); }
    catch { throw fehler(400, "Ungültige Importdaten."); }
    if (!daten || !istModelldatei(daten.dateiname) ||
        !/^[a-z0-9_-]+-[a-f0-9-]{36}\.(glb|fbx|obj)$/i.test(daten.dateiname)) {
        throw fehler(400, "Ungültiger Modellname.");
    }
    if (body.length - ende > limitModell) throw fehler(413, "Modelldatei ist zu groß.");
    return { ...daten, datei: body.subarray(ende) };
}

async function apiAntwort(request, response) {
    if (request.method === "GET") return sende(response, 200, { ...await ladeStand(), token });
    if (!["PUT", "POST"].includes(request.method)) throw fehler(405, "Methode wird nicht unterstützt.");
    if (request.headers.origin !== origin || request.headers["x-aporia-token"] !== token) {
        throw fehler(403, "Speichern ist nur aus der lokalen Aporia-Ansicht möglich.");
    }

    const importiert = request.method === "POST";
    const body = await leseBody(request, importiert ? limitJSON + limitModell : limitJSON);
    const daten = importiert ? liesImport(body) : { text: body.toString("utf8") };
    if (typeof daten.text !== "string") throw fehler(400, "Kartendaten fehlen.");
    let objekte;
    try { objekte = leseObjekte(daten.text); } catch { throw fehler(400, "Ungültige Kartendaten."); }
    if (importiert && !objekte.some(objekt => objekt.modell === daten.dateiname)) {
        throw fehler(400, "Modell fehlt in den Kartendaten.");
    }

    const vorgang = schreibvorgang.then(async () => {
        const stand = await ladeStand();
        if (request.headers["if-match"] !== stand.version) throw fehler(409, "Kartendatei wurde geändert. Lade die Karte neu oder sichere deine Änderungen als JSON.");
        if (await realpath(kartenDatei) !== kartenDatei || await realpath(modellOrdner) !== modellOrdner) {
            throw fehler(403, "Kartendatei und Modellordner müssen direkt im Projekt liegen.");
        }
        for (const name of new Set(objekte.map(objekt => objekt.modell).filter(Boolean))) {
            if (importiert && name === daten.dateiname) continue;
            const pfad = resolve(modellOrdner, name);
            if (await realpath(pfad).catch(() => null) !== pfad || !(await stat(pfad)).isFile()) {
                throw fehler(409, "Modelldatei fehlt im Projekt: " + name);
            }
        }
        let modellPfad;
        if (importiert) {
            const ziel = resolve(modellOrdner, daten.dateiname);
            await writeFile(ziel, daten.datei, { flag: "wx" });
            modellPfad = ziel;
        }
        try { await sichereJSON(daten.text); }
        catch (error) {
            if (modellPfad) await rm(modellPfad, { force: true }).catch(() => {});
            throw error;
        }
        return { version: revision(daten.text) };
    });
    schreibvorgang = vorgang.catch(() => {});
    return sende(response, 200, await vorgang);
}

function imOrdner(pfad, ordner) {
    const name = relative(ordner, pfad);
    return name !== ".." && !name.startsWith(".." + sep) && resolve(ordner, name) === pfad;
}

async function statischeDatei(request, response, pathname) {
    if (!["GET", "HEAD"].includes(request.method)) throw fehler(405, "Methode wird nicht unterstützt.");
    const name = decodeURIComponent(pathname);
    if (/[\\:\x00]/.test(name) || name.split("/").some(teil => teil.startsWith("."))) throw fehler(404, "Datei nicht gefunden.");
    const bibliothek = name.startsWith("/_aporia/three/");
    const pfad = bibliothek
        ? resolve(threeOrdner, name.slice("/_aporia/three/".length))
        : resolve(projekt, "." + (name === "/" ? "/index.html" : name));
    const erlaubt = bibliothek ? ["build", "examples"].some(teil => imOrdner(pfad, resolve(threeOrdner, teil)))
        : ["Menüs", "assets", "inhalte", "Info_material"].some(teil => imOrdner(pfad, resolve(projekt, teil))) ||
            ["index.html", "Hauptseite.html", "Waldfeen.html"].some(teil => pfad === resolve(projekt, teil));
    const typ = mime[extname(pfad).toLowerCase()];
    if (!erlaubt || !typ || await realpath(pfad).catch(() => null) !== pfad) {
        if (bibliothek) throw fehler(404, "Lokales Three.js fehlt. Führe einmal npm install aus.");
        throw fehler(404, "Datei nicht gefunden.");
    }
    const datei = await stat(pfad);
    if (!datei.isFile()) throw fehler(404, "Datei nicht gefunden.");
    if (pfad === resolve(projekt, "Menüs/Sternenkarte/Sternenkarte.html")) {
        response.setHeader("Content-Security-Policy",
            "default-src 'self'; script-src 'self' 'unsafe-inline' blob:; style-src 'self' 'unsafe-inline'; " +
            "img-src 'self' blob: data:; media-src 'self' blob: data:; connect-src 'self' data: blob:; " +
            "object-src 'none'; base-uri 'self'; frame-ancestors 'none'");
    }
    response.writeHead(200, { "Content-Type": typ, "Content-Length": datei.size, "Cache-Control": "no-cache" });
    if (request.method === "HEAD") response.end();
    else createReadStream(pfad).on("error", () => response.destroy()).pipe(response);
}

export async function bearbeiteAnfrage(request, response) {
    response.setHeader("X-Content-Type-Options", "nosniff");
    if (request.headers.host !== host) return sende(response, 403, { fehler: "Verwende " + origin });
    try {
        const { pathname } = new URL(request.url, origin);
        if (pathname === api) await apiAntwort(request, response);
        else await statischeDatei(request, response, pathname);
    } catch (error) {
        if (!error.status) console.error(error);
        if (!response.headersSent) sende(response, error.status ?? 500, {
            fehler: error.status ? error.message : "Lokaler Server konnte die Anfrage nicht ausführen."
        });
        else response.destroy();
    }
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
    const server = createServer(bearbeiteAnfrage);
    server.listen(8787, "127.0.0.1", () => console.log(origin + "/Men%C3%BCs/Sternenkarte/Sternenkarte.html"));
}
