import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import MovieCard from './MovieCard.tsx';
import SearchInput from './SearchBar.tsx';
import MovieFilters from './MovieFilters.tsx';
import {
  EMPTY_FILTERS,
  filterMovies,
  filtersToSearchParams,
  hasActiveFilters,
  parseFiltersFromSearch,
  type FilterFacets,
  type Movie,
  type MovieFilters as MovieFilterState,
} from '../helpers/movieFilters.ts';

interface Props {
  allMovies?: Movie[];
  moviesToRender: Movie[];
  facets?: FilterFacets;
}

export default function MoviesContainer({ allMovies, moviesToRender, facets }: Props) {
  const [filters, setFilters] = useState<MovieFilterState>(EMPTY_FILTERS);
  const searchable = allMovies !== undefined && facets !== undefined;
  const filtering = searchable && hasActiveFilters(filters);

  // Los filtros llegan en la URL: se recuperan tras hidratar para que el HTML
  // del servidor y el primer render del cliente coincidan.
  useEffect(() => {
    if (!window.location.search || !facets) return;
    setFilters(parseFiltersFromSearch(window.location.search, facets));
  }, [facets]);

  // Sin filtros se mantiene la página paginada del servidor; con filtros se
  // busca sobre todo el catálogo (los resultados abarcan todas las páginas).
  const filteredMovies = useMemo(() => {
    if (!searchable || !hasActiveFilters(filters)) return moviesToRender;
    return filterMovies(allMovies, filters);
  }, [allMovies, filters, moviesToRender, searchable]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('catalog:filters', {
        detail: { active: filtering, count: filteredMovies.length },
      })
    );
  }, [filtering, filteredMovies]);

  function onChangeEventHandler(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    onChange({ title: event.target.value });
  }

  function onChange(patch: Partial<MovieFilterState>) {
    const next = { ...filters, ...patch };
    setFilters(next);

    const params = filtersToSearchParams(next);
    const query = params.toString();
    window.history.replaceState(
      window.history.state,
      '',
      `${window.location.pathname}${query ? `?${query}` : ''}`
    );
  }

  return (
    <div>
      {searchable && <SearchInput onChange={onChangeEventHandler} value={filters.title} />}
      {searchable && (
        <MovieFilters
          facets={facets}
          filters={filters}
          onChange={onChange}
        />
      )}

      {filteredMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} {...movie} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No se encontraron películas con esos filtros.</p>
        </div>
      )}

      <style>{`
        .pagination-btn {
          padding: 0.5rem 1.2rem;
          border-radius: 9999px;
          font-weight: 600;
          transition: all 0.2s;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          cursor: pointer;
          display: inline-block;
        }
        .pagination-btn:hover:not(:disabled) {
          background: rgba(249, 115, 22, 0.2);
          border-color: #f97316;
          transform: scale(1.05);
        }
        .pagination-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
          transform: none;
        }
        .pagination-btn.active {
          background: #f97316;
          border-color: #f97316;
          color: white;
        }
      `}</style>
    </div>
  );
}
