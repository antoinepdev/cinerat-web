import series from '../series.json';
import { sortCatalog, type SortBy } from './catalogSort.ts';
import type { Movie } from './movieFilters.ts';

export interface SeriesItem extends Movie {
  episodes_count: number;
  telegram_poster_id?: number;
  tmdb_id?: number;
  backdrop_path?: string;
  created_at?: string;
  updated_at?: string;
}

export const allSeries: SeriesItem[] = series.map((item) => ({ ...item, kind: 'series' as const }));

export function getSeriesBy({ sort_by = 'popularity' }: { sort_by?: SortBy } = {}): SeriesItem[] {
  return sortCatalog(allSeries, sort_by);
}
