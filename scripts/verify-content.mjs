import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const sourcePath = new URL('../inhalte/spezies/waldfeen.json', import.meta.url);
const species = JSON.parse(readFileSync(sourcePath, 'utf8'));
const sections = ['identitaet', 'oekosystem', 'ressourcen', 'biologie', 'gesellschaft', 'zivilisation', 'gameplay'];
assert.equal(species.spezies_id, 'SPEC-0001');
assert.equal(species.heimatwelt, 'Orvaya');
assert.equal(species.titelbild, '/assets/bilder/spiezes2.png');
assert.ok(existsSync(new URL(`../assets/bilder/${species.titelbild.split('/').at(-1)}`, import.meta.url)), 'existing title image is present');
for (const key of sections) assert.equal(typeof species[key], 'string', `${key} must remain a Markdown string`);
const numbers = sections.flatMap((key) => [...species[key].matchAll(/^#{1,6}\s+(\d{2})\s+[–—-]/gm)].map((match) => Number(match[1]))).sort((a, b) => a - b);
assert.deepEqual(numbers, Array.from({ length: 28 }, (_, index) => index + 1), 'all 28 dossier points must render from the existing seven fields');
console.log(`OK: ${sections.length} existing Markdown fields, all 28 dossier points, image path ${species.titelbild}`);
