export type Theme = { forest: string; forestDeep: string; leaf: string; gold: string; glow: string; label: string };

const themes: Record<string, Theme> = {
  'SPEC-0001': { forest: '#153b27', forestDeep: '#07150f', leaf: '#a8c66c', gold: '#ddc879', glow: '#73a74f', label: 'Waldfeen von Orvaya' },
};

export const themeFor = (id?: string): Theme => themes[id ?? ''] ?? {
  forest: '#263447', forestDeep: '#0c121a', leaf: '#91b8c7', gold: '#d8c990', glow: '#6399a8', label: 'Aporia – Enzyklopädie der Welten',
};
