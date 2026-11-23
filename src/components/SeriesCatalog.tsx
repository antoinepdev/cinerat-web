import { useEffect, useMemo, useState } from 'react';
import MoviesContainer from './MoviesContainer.tsx';
import SeriesCart from './SeriesCart.tsx';
import type { FilterFacets, Movie } from '../helpers/movieFilters.ts';

interface Props {
  allSeries: Movie[];
  seriesToRender: Movie[];
  facets: FilterFacets;
}

const STORAGE_KEY = 'cinerat:series-cart';

function readStoredIds(): number[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id): id is number => typeof id === 'number') : [];
  } catch {
    return [];
  }
}

export default function SeriesCatalog({ allSeries, seriesToRender, facets }: Props) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    setSelectedIds(readStoredIds());

    function syncFromStorage(event: StorageEvent) {
      if (event.key === STORAGE_KEY) setSelectedIds(readStoredIds());
    }

    window.addEventListener('storage', syncFromStorage);
    return () => window.removeEventListener('storage', syncFromStorage);
  }, []);

  const selected = useMemo(() => allSeries.filter((item) => selectedIds.includes(item.id)), [allSeries, selectedIds]);
  const totalEpisodes = useMemo(
    () => selected.reduce((total, item) => total + (item.episodes_count ?? 0), 0),
    [selected]
  );

  function toggle(id: number) {
    setSelectedIds((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // El carrito sigue funcionando en memoria si localStorage no está disponible.
      }
      return next;
    });
  }

  function clear() {
    setSelectedIds([]);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignorado: ver comentario en toggle().
    }
  }

  return (
    <div>
      <SeriesCart selected={selected} totalEpisodes={totalEpisodes} onClear={clear} />
      <MoviesContainer
        allMovies={allSeries}
        moviesToRender={seriesToRender}
        facets={facets}
        kind="series"
        selectable
        selectedIds={selectedIds}
        onToggleSelect={toggle}
        itemLabel="series"
      />
    </div>
  );
}
