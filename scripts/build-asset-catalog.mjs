import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const assetsRoot = path.join(projectRoot, "assets");
const outputPath = path.join(assetsRoot, "asset-catalog.json");

const roots = [
    { label: "Bilder", folder: "bilder", type: "image", extensions: new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif", ".svg"]) },
    { label: "Videos", folder: "videos", type: "video", extensions: new Set([".mp4", ".webm", ".mov", ".m4v"]) }
];

function buildDirectory(directoryPath, relativePath, root) {
    const node = { name: path.basename(directoryPath), children: {}, files: [] };
    const entries = fs.readdirSync(directoryPath, { withFileTypes: true })
        .sort((a, b) => a.name.localeCompare(b.name, "de", { numeric: true, sensitivity: "base" }));

    for (const entry of entries) {
        const absolutePath = path.join(directoryPath, entry.name);
        if (entry.isDirectory()) {
            node.children[entry.name] = buildDirectory(
                absolutePath,
                path.posix.join(relativePath, entry.name),
                root
            );
            continue;
        }

        const extension = path.extname(entry.name).toLowerCase();
        if (!entry.isFile() || !root.extensions.has(extension)) continue;
        node.files.push({
            name: entry.name,
            title: entry.name,
            type: root.type,
            src: path.posix.join("assets", relativePath, entry.name)
        });
    }
    return node;
}

const catalog = { version: 1, roots: {} };
for (const root of roots) {
    const directory = path.join(assetsRoot, root.folder);
    if (fs.existsSync(directory)) {
        catalog.roots[root.label] = buildDirectory(directory, root.folder, root);
    }
}

fs.writeFileSync(outputPath, JSON.stringify(catalog), "utf8");
console.log(`Asset-Katalog erstellt: ${path.relative(projectRoot, outputPath)}`);
