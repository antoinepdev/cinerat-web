import type { Movie } from './movieFilters.ts';

export type SortBy = 'popularity' | 'year' | 'title' | 'id';

function titleOf(item: Movie) {
  return (item.title_lat || item.title_cas || item.title_en).toLowerCase();
}

/** Orden compartido por el catálogo de películas y el de series. */
export function sortCatalog<T extends Movie>(items: readonly T[], sort_by: SortBy = 'popularity'): T[] {
  const sorted = [...items];

  if (sort_by === 'year') {
    return sorted.sort((a, b) => b.year - a.year);
  }
  if (sort_by === 'title') {
    return sorted.sort((a, b) => titleOf(a).localeCompare(titleOf(b)));
  }
  if (sort_by === 'id') {
    return sorted.sort((a, b) => b.id - a.id);
  }
  return sorted.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
}
