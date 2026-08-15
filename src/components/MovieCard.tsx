interface MovieCardProps {
  id: number;
  title_en: string;
  title_cas?: string | null;
  title_lat?: string | null;
  year: number;
  language_cas: boolean;
  language_lat: boolean;
  poster: string;
  description: string;
}

export default function MovieCard({
  id,
  title_en,
  title_cas,
  title_lat,
  year,
  language_cas,
  language_lat,
  poster,
  description,
}: MovieCardProps) {
  // Título principal: latino > castellano > inglés
  const mainTitle = title_lat || title_cas || title_en;
  // Descripción corta (120 caracteres)
  const shortDesc = description.length > 120
    ? description.slice(0, 120) + '…'
    : description;

  return (
    <div className="movie-card group bg-[#141414] rounded-xl overflow-hidden border border-white/5 hover:border-orange-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 flex flex-col h-full">
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden bg-black/50">
        <img
          src={poster}
          alt={mainTitle}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full border border-white/10">
          {year}
        </span>
      </div>

      {/* Información */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-white leading-tight line-clamp-2">
          {mainTitle}
        </h3>

        {/* Títulos alternativos */}
        <div className="mt-1 space-y-0.5 text-xs text-gray-400">
          {title_lat && (
            <p className="truncate">🌎 <span className="font-medium">Lat:</span> {title_lat}</p>
          )}
          {title_cas && (
            <p className="truncate">🇪🇸 <span className="font-medium">Cas:</span> {title_cas}</p>
          )}
          {title_en && title_en !== mainTitle && (
            <p className="truncate text-gray-500">🇬🇧 <span className="font-medium">Eng:</span> {title_en}</p>
          )}
        </div>

        {/* Badges de idioma */}
        <div className="flex flex-wrap gap-2 mt-3">
          {language_lat && (
            <span className="inline-flex items-center gap-1 text-xs font-medium bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/20">
              <span>🌎</span> Latino
            </span>
          )}
          {language_cas && (
            <span className="inline-flex items-center gap-1 text-xs font-medium bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20">
              <span>🇪🇸</span> Castellano
            </span>
          )}
          {!language_lat && !language_cas && (
            <span className="text-xs text-gray-500">Solo inglés</span>
          )}
        </div>

        {/* Descripción */}
        <p className="mt-3 text-sm text-gray-400 line-clamp-3 flex-1">
          {shortDesc}
        </p>

        {/* Enlace a detalles (opcional) */}
        <a
          href={`/cinerat-web/peliculas/${id}`}
          className="mt-4 text-orange-400 hover:text-orange-300 text-sm font-medium inline-flex items-center gap-1 transition group-hover:gap-2"
        >
          Ver detalles
          <span className="text-base transition-transform group-hover:translate-x-1">→</span>
        </a>
      </div>
    </div>
  );
}