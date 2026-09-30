export interface Movie {
  id: number;
  title_en: string;
  title_cas?: string | null;
  title_lat?: string | null;
  year: number;
  language_cas: boolean | null;
  language_lat: boolean | null;
  poster: string;
  description: string;
  genres: string[];
}

export type MovieLanguage = 'lat' | 'cas';

export interface GenreFacet {
  slug: string;
  label: string;
}

export interface FilterFacets {
  years: number[];
  genres: GenreFacet[];
}

export interface MovieFilters {
  title: string;
  genres: string[];
  languages: MovieLanguage[];
  yearFrom: number | null;
  yearTo: number | null;
}

export const EMPTY_FILTERS: MovieFilters = {
  title: '',
  genres: [],
  languages: [],
  yearFrom: null,
  yearTo: null,
};

export const LANGUAGES: { value: MovieLanguage; label: string; emoji: string }[] = [
  { value: 'lat', label: 'Latino', emoji: '🌎' },
  { value: 'cas', label: 'Castellano', emoji: '🇪🇸' },
];

/** "Ciencia ficción" -> "ciencia-ficcion" (los URLs no admiten acentos). */
export function slugifyGenre(label: string) {
  return label
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getFacetOptions(movies: Movie[]): FilterFacets {
  const years = new Set<number>();
  const genres = new Map<string, string>();

  for (const movie of movies) {
    years.add(movie.year);

    for (const genre of movie.genres ?? []) {
      const slug = slugifyGenre(genre);
      if (slug && !genres.has(slug)) {
        genres.set(slug, genre);
      }
    }
  }

  return {
    years: [...years].sort((a, b) => a - b),
    genres: [...genres].map(([slug, label]) => ({ slug, label })),
  };
}

export function hasActiveFilters(filters: MovieFilters) {
  return (
    filters.title.trim() !== '' ||
    filters.genres.length > 0 ||
    filters.languages.length > 0 ||
    filters.yearFrom !== null ||
    filters.yearTo !== null
  );
}

function matchesTitle(movie: Movie, term: string) {
  return (
    movie.title_en?.toLowerCase().includes(term) ||
    movie.title_cas?.toLowerCase().includes(term) ||
    movie.title_lat?.toLowerCase().includes(term)
  );
}

export function filterMovies(movies: Movie[], filters: MovieFilters): Movie[] {
  const term = filters.title.trim().toLowerCase();
  const selectedGenres = filters.genres;
  const wantsLat = filters.languages.includes('lat');
  const wantsCas = filters.languages.includes('cas');
  const { yearFrom, yearTo } = normalizeYearRange(filters.yearFrom, filters.yearTo);

  return movies.filter((movie) => {
    if (term && !matchesTitle(movie, term)) return false;

    // Géneros: intersección (AND) — la película debe tener todos los elegidos.
    if (selectedGenres.length > 0) {
      const own = (movie.genres ?? []).map(slugifyGenre);
      if (!selectedGenres.every((slug) => own.includes(slug))) return false;
    }

    // Idiomas: unión (OR) — son flags de disponibilidad, no categorías excluyentes.
    if (wantsLat || wantsCas) {
      const available =
        (wantsLat && movie.language_lat) || (wantsCas && movie.language_cas);
      if (!available) return false;
    }

    if (yearFrom !== null && movie.year < yearFrom) return false;
    if (yearTo !== null && movie.year > yearTo) return false;

    return true;
  });
}

function normalizeYearRange(from: number | null, to: number | null) {
  if (from !== null && to !== null && from > to) {
    return { yearFrom: to, yearTo: from };
  }
  return { yearFrom: from, yearTo: to };
}

function formatYearRange(from: number | null, to: number | null) {
  const { yearFrom, yearTo } = normalizeYearRange(from, to);
  if (yearFrom === null || yearTo === null) return null;
  return yearFrom === yearTo ? `${yearFrom}` : `${yearFrom}-${yearTo}`;
}

export function filtersToSearchParams(filters: MovieFilters) {
  const params = new URLSearchParams();

  if (filters.title.trim()) params.set('q', filters.title.trim());
  if (filters.genres.length > 0) params.set('genero', filters.genres.join(','));
  if (filters.languages.length > 0) params.set('idioma', filters.languages.join(','));

  const yearRange = formatYearRange(filters.yearFrom, filters.yearTo);
  if (yearRange) params.set('anio', yearRange);

  return params;
}

/** Tolera parámetros inválidos: descarta lo que no exista en las facetas. */
export function parseFiltersFromSearch(search: string, facets: FilterFacets): MovieFilters {
  const params = new URLSearchParams(search);
  const validGenres = new Set(facets.genres.map((genre) => genre.slug));
  const validYears = new Set(facets.years);
  const validLanguages = new Set(LANGUAGES.map((language) => language.value));

  const languages = (params.get('idioma') ?? '')
    .split(',')
    .filter((value): value is MovieLanguage =>
      validLanguages.has(value as MovieLanguage)
    );

  const genres = (params.get('genero') ?? '')
    .split(',')
    .filter((value) => validGenres.has(value));

  const [rawFrom, rawTo] = (params.get('anio') ?? '').split('-');
  const from = Number(rawFrom);
  const to = rawTo === undefined ? from : Number(rawTo);

  const { yearFrom, yearTo } = normalizeYearRange(
    validYears.has(from) ? from : null,
    validYears.has(to) ? to : null
  );

  return {
    title: params.get('q') ?? '',
    genres,
    languages,
    yearFrom,
    yearTo,
  };
}
