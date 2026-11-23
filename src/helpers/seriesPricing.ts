export interface SeriesPriceTier {
  min: number;
  max: number | null;
  range: string;
  price: string;
  amount: number | null;
}

/** Tramos acordados: 1000 episodios entra en el de $15. */
export const SERIES_PRICE_TIERS: SeriesPriceTier[] = [
  { min: 0, max: 499, range: 'Menos de 500 episodios', price: '$5', amount: 5 },
  { min: 500, max: 999, range: '500 – 999 episodios', price: '$10', amount: 10 },
  { min: 1000, max: 1500, range: '1000 – 1500 episodios', price: '$15', amount: 15 },
  { min: 1501, max: null, range: 'Más de 1500 episodios', price: 'Consultar', amount: null },
];

export interface SeriesPrice {
  amount: number | null;
  price: string;
  range: string;
}

export function getSeriesPrice(totalEpisodes: number): SeriesPrice {
  if (!Number.isFinite(totalEpisodes) || totalEpisodes <= 0) {
    return { amount: 0, price: '—', range: 'Sin series seleccionadas' };
  }

  const tier = SERIES_PRICE_TIERS.find((item) => totalEpisodes >= item.min && (item.max === null || totalEpisodes <= item.max));
  if (!tier) return { amount: null, price: 'Consultar', range: 'Más de 1500 episodios' };

  return { amount: tier.amount, price: tier.price, range: tier.range };
}

interface SelectableSeries {
  title_en: string;
  title_cas?: string | null;
  title_lat?: string | null;
}

function displayTitle(item: SelectableSeries) {
  return item.title_lat || item.title_cas || item.title_en;
}

export function buildSeriesTelegramMessage(selected: SelectableSeries[], totalEpisodes: number) {
  const price = getSeriesPrice(totalEpisodes);
  return [
    'Hola Antoine, me interesa el pack de series:',
    ...selected.map((item) => `• ${displayTitle(item)}`),
    `Total: ${selected.length} series · ${totalEpisodes} episodios`,
    `Precio estimado: ${price.price} (${price.range}).`,
  ].join('\n');
}

export function buildSeriesTelegramUrl(selected: SelectableSeries[], totalEpisodes: number) {
  return `https://t.me/antoinepdev?text=${encodeURIComponent(buildSeriesTelegramMessage(selected, totalEpisodes))}`;
}
