import {
  LANGUAGES,
  type FilterFacets,
  type MovieFilters as MovieFilterState,
  type MovieLanguage,
} from '../helpers/movieFilters.ts';

interface Props {
  facets: FilterFacets;
  filters: MovieFilterState;
  onChange: (patch: Partial<MovieFilterState>) => void;
}

const CHIP_BASE =
  'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors';
const CHIP_IDLE = `${CHIP_BASE} border-white/10 bg-white/5 text-gray-300 hover:border-orange-500/40 hover:text-white`;
const CHIP_ACTIVE = `${CHIP_BASE} border-orange-500/50 bg-orange-500/20 text-orange-400`;

const SELECT =
  'bg-[#141414] border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 focus:border-orange-500 focus:outline-none';

const LABEL = 'block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2';

export default function MovieFilters({ facets, filters, onChange }: Props) {
  function toggleGenre(slug: string) {
    const genres = filters.genres.includes(slug)
      ? filters.genres.filter((genre) => genre !== slug)
      : [...filters.genres, slug];

    onChange({ genres });
  }

  function toggleLanguage(language: MovieLanguage) {
    const languages = filters.languages.includes(language)
      ? filters.languages.filter((item) => item !== language)
      : [...filters.languages, language];

    onChange({ languages });
  }

  // Si el "desde" supera al "hasta" actual, se arrastra el otro extremo.
  function changeYearFrom(value: string) {
    const yearFrom = value === '' ? null : Number(value);
    const yearTo =
      yearFrom !== null && filters.yearTo !== null && yearFrom > filters.yearTo
        ? yearFrom
        : filters.yearTo;

    onChange({ yearFrom, yearTo });
  }

  function changeYearTo(value: string) {
    const yearTo = value === '' ? null : Number(value);
    const yearFrom =
      yearTo !== null && filters.yearFrom !== null && yearTo < filters.yearFrom
        ? yearTo
        : filters.yearFrom;

    onChange({ yearFrom, yearTo });
  }

  return (
    <div className="mb-8 rounded-xl border border-white/5 bg-[#141414] p-4 md:p-5">
      <div className="flex flex-wrap gap-x-6 gap-y-4">
        <fieldset className="flex items-end gap-3">
          <legend className="sr-only">Filtrar por año</legend>
          <div>
            <label className={LABEL} htmlFor="filter-year-from">
              Año desde
            </label>
            <select
              id="filter-year-from"
              className={SELECT}
              value={filters.yearFrom ?? ''}
              onChange={(event) => changeYearFrom(event.target.value)}
            >
              <option value="">Todos</option>
              {facets.years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={LABEL} htmlFor="filter-year-to">
              Año hasta
            </label>
            <select
              id="filter-year-to"
              className={SELECT}
              value={filters.yearTo ?? ''}
              onChange={(event) => changeYearTo(event.target.value)}
            >
              <option value="">Todos</option>
              {facets.years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </fieldset>

        <fieldset>
          <legend className={LABEL}>Idioma</legend>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map(({ value, label, emoji }) => {
              const active = filters.languages.includes(value);
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleLanguage(value)}
                  className={active ? CHIP_ACTIVE : CHIP_IDLE}
                >
                  <span className="mr-1">{emoji}</span>
                  {label}
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>

      <fieldset className="mt-5">
        <legend className={LABEL}>Género</legend>
        <div className="flex flex-wrap gap-2">
          {facets.genres.map(({ slug, label }) => {
            const active = filters.genres.includes(slug);
            return (
              <button
                key={slug}
                type="button"
                aria-pressed={active}
                onClick={() => toggleGenre(slug)}
                className={active ? CHIP_ACTIVE : CHIP_IDLE}
              >
                {label}
              </button>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
