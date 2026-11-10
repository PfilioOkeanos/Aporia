import type { IslandRegistry } from '@tinacms/astro/experimental';
import SpeciesIsland from '../components/islands/SpeciesIsland.astro';
import { getSpecies } from './data';

export const islands: IslandRegistry = {
  species: {
    fetch: (_request, params) => getSpecies(params.get('slug') ?? 'waldfeen'),
    component: SpeciesIsland,
    wrapper: { tag: 'main' },
    propsFromData: (result) => ({ species: (result as any).data?.species }),
  },
};
