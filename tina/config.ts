import { defineConfig } from 'tinacms';

const dossierFields = [
  { type: 'string', name: 'identitaet', label: 'A – Identität und Evolution', ui: { component: 'textarea' } },
  { type: 'string', name: 'oekosystem', label: 'B – Heimatwelt und Ökosystem', ui: { component: 'textarea' } },
  { type: 'string', name: 'ressourcen', label: 'C – Ressourcen', ui: { component: 'textarea' } },
  { type: 'string', name: 'biologie', label: 'D – Körper und Biologie', ui: { component: 'textarea' } },
  { type: 'string', name: 'gesellschaft', label: 'E – Intelligenz und Gesellschaft', ui: { component: 'textarea' } },
  { type: 'string', name: 'zivilisation', label: 'F – Entwicklung und Zivilisation', ui: { component: 'textarea' } },
  { type: 'string', name: 'gameplay', label: 'G – Beziehungen und Spielintegration', ui: { component: 'textarea' } },
] as const;

export default defineConfig({
  branch: process.env.GITHUB_BRANCH || process.env.HEAD || 'main',
  clientId: process.env.PUBLIC_TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,
  build: { outputFolder: 'admin', publicFolder: 'public' },
  media: {
    tina: {
      // Keep Tina uploads in the same existing folder Pages CMS already uses.
      publicFolder: '.',
      mediaRoot: 'assets/bilder',
    },
  },
  schema: {
    collections: [
      {
        name: 'species',
        label: 'Spezies',
        path: 'inhalte/spezies',
        format: 'json',
        match: { include: '*' },
        ui: {
          router: ({ document }) => `/spezies/${document._sys.filename}`,
          filename: { readonly: true },
          allowedActions: { create: false, delete: false, createNestedFolder: false },
        },
        fields: [
          { type: 'string', name: 'title', label: 'Speziesname', required: true, isTitle: true },
          { type: 'string', name: 'spezies_id', label: 'Spezies-ID' },
          { type: 'string', name: 'heimatwelt', label: 'Heimatwelt' },
          { type: 'image', name: 'titelbild', label: 'Titelbild', required: true, clearable: true, uploadDir: () => 'assets/bilder' },
          { type: 'image', name: 'galerie', label: 'Galerie', list: true, clearable: true, uploadDir: () => 'assets/bilder' },
          ...dossierFields,
        ],
      },
    ],
  },
});
