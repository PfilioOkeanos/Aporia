import { requestWithMetadata } from '@tinacms/astro/data';
import client from '../../tina/__generated__/client';

export const getSpecies = (slug: string) =>
  requestWithMetadata(client.queries.species({ relativePath: `${slug}.json` }), { priority: 'primary' });

export async function listSpecies() {
  const result = await client.queries.speciesConnection();
  return (result.data.speciesConnection.edges ?? [])
    .flatMap((edge) => edge?.node ? [edge.node] : [])
    .sort((a, b) => a.title.localeCompare(b.title, 'de'));
}
