import MarkdownIt from 'markdown-it';

// Raw HTML is disabled. markdown-it also rejects dangerous URL schemes by default.
const parser = new MarkdownIt({ html: false, linkify: true, breaks: false, typographer: false });

export function renderMarkdown(markdown?: string | null): string {
  if (!markdown) return '';
  return parser.render(markdown);
}

export function dossierStatus(markdown: string) {
  const statuses: string[] = [];
  if (/\bNoch offen\b|\bOffene biologische Frage\b|\bNoch auszuarbeiten\b|\bZu bestimmen sind\b/i.test(markdown)) statuses.push('Offene Punkte');
  if (/\bMögliche\b|\bErster Entwurf\b|\bKulturvorschlag\b|\bErste Designrichtung\b|\bVorgesehene\b/i.test(markdown)) statuses.push('Vorschläge');
  return statuses;
}
