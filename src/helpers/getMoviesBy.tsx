import movies from '../movies.json';

export function getMoviesBy({ sort_by = 'popularity' } = { sort_by: 'popularity'}) {
  const sorted = [...movies];
  if (sort_by === 'year') {
    sorted.sort((a, b) => b.year - a.year);
  } else if (sort_by === 'title') {
    sorted.sort((a, b) => {
      const titleA = (a.title_lat || a.title_cas || a.title_en).toLowerCase();
      const titleB = (b.title_lat || b.title_cas || b.title_en).toLowerCase();
      return titleA.localeCompare(titleB);
    });
  } else if (sort_by === 'popularity') {
    sorted.sort((a, b) => b.popularity - a.popularity);
  } else {
    // Por defecto, ordenar por id descendente (más reciente)
    sorted.sort((a, b) => b.id - a.id);
  }
  return sorted;
}