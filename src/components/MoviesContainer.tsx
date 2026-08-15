import { useState, useEffect, type ChangeEvent } from 'react';
import MovieCard from './MovieCard.tsx';
import SearchInput from './SearchBar.tsx';

export default function MoviesContainer({allMovies, moviesToRender}) {
  const [ filter, setFilter ] = useState({})
  const [ filteredMovies, setFilteredMovies ] = useState(moviesToRender)

  useEffect(() => {
    if (!filter.title) {
      setFilteredMovies(moviesToRender)
    }

    if (filter.title) {
      const term = filter.title.toLowerCase().trim()

      const filtered = allMovies.filter(movie => {
        return movie.title_en?.toLowerCase().includes(term) ||
        movie.title_cas?.toLowerCase().includes(term) ||
        movie.title_lat?.toLowerCase().includes(term)
      })
      setFilteredMovies(filtered)
    }
  }, [filter, filteredMovies])

   function onChangeEventHandler (event: ChangeEvent) {
    event.preventDefault()
    const titleFilter = event.target.value

    const filter =  { title: titleFilter }
    setFilter(filter)
  }

  return (
    <div>
    <SearchInput onChange={onChangeEventHandler}/>
      {moviesToRender.length > 0 ? (
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
