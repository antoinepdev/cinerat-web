import type { Movie } from '../helpers/movieFilters.ts';
import { buildSeriesTelegramUrl, getSeriesPrice, SERIES_PRICE_TIERS } from '../helpers/seriesPricing.ts';

interface Props {
  selected: Movie[];
  totalEpisodes: number;
  onClear: () => void;
}

function displayTitle(item: Movie) {
  return item.title_lat || item.title_cas || item.title_en;
}

export default function SeriesCart({ selected, totalEpisodes, onClear }: Props) {
  const price = getSeriesPrice(totalEpisodes);

  return (
    <section className="mb-6 rounded-xl border border-orange-500/20 bg-[#141414] p-4 md:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white">🧺 Tu selección de series</h2>
          <p className="mt-1 text-sm text-gray-400">
            Elige las series que te interesen: se suman todos los episodios de cada una.
          </p>
        </div>
        {selected.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-gray-300 transition hover:border-orange-500/40 hover:text-white"
          >
            Vaciar selección
          </button>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
        {SERIES_PRICE_TIERS.map((tier) => (
          <div key={tier.range} className="rounded-lg border border-white/5 bg-black/30 px-3 py-2">
            <span className="block text-base font-bold text-orange-400">{tier.price}</span>
            <span className="text-xs text-gray-400">{tier.range}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-4">
        <div className="text-sm text-gray-300">
          {selected.length === 0 ? (
            <p>Aún no has añadido ninguna serie.</p>
          ) : (
            <>
              <p>
                <strong className="text-white">{selected.length}</strong> series ·{' '}
                <strong className="text-white">{totalEpisodes}</strong> episodios
              </p>
              <p className="mt-1 font-semibold text-orange-400">
                {price.price} · {price.range}
              </p>
            </>
          )}
        </div>

        {selected.length > 0 ? (
          <a
            href={buildSeriesTelegramUrl(selected, totalEpisodes)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary-sm"
          >
            💬 Consultar mi selección
          </a>
        ) : (
          <span className="btn-primary-sm pointer-events-none opacity-40">💬 Consultar mi selección</span>
        )}
      </div>

      {selected.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {selected.map((item) => (
            <li
              key={item.id}
              className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs text-orange-200"
            >
              {displayTitle(item)} · {item.episodes_count ?? 0} epis.
            </li>
          ))}
        </ul>
      )}

      <p className="mt-3 text-xs text-gray-500">
        El precio es orientativo. Te confirmo el total final por Telegram antes de cualquier pago.
      </p>
    </section>
  );
}
