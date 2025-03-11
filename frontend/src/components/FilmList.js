import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function FilmList() {
  const [films, setFilms] = useState([]);

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const response = await fetch("http://localhost:5000/films");
        const data = await response.json();
        console.log("🎥 Films fetched from database:", data.rows);

        // Fetch posters for each film
        const filmsWithPosters = await Promise.all(
          data.rows.map(async (film) => {
            if (!film.name || !film.director) {
              console.warn("⚠️ Skipping poster fetch due to missing data:", film);
              return { ...film, poster: null };
            }

            try {
              const posterUrl = await fetchFilmPoster(film.name, film.director);
              return { ...film, poster: posterUrl };
            } catch (error) {
              console.error(`🚨 Error fetching poster for ${film.name}:`, error);
              return { ...film, poster: null };
            }
          })
        );

        setFilms(filmsWithPosters);
      } catch (error) {
        console.error("🚨 Error fetching films:", error);
      }
    };

    fetchFilms();
  }, []);

  const fetchFilmPoster = async (title, director) => {
    const apiUrl = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(title)}&api_key=20e344c70ff88ae672ca22132f5e72e5`;

    console.log(`🔍 Fetching poster for: ${title} by ${director}`);

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      return `https://image.tmdb.org/t/p/w500${data.results[0].poster_path}`;
    }

    console.warn(`⚠️ No poster found for ${title}`);
    return null;
  };

  // 🗂 Group films by year & month like in albums list
  const groupFilmsByDate = () => {
    const grouped = {};

    films.forEach((film) => {
      if (!film.watched_date) return;

      const date = new Date(film.watched_date);
      const year = date.getFullYear();
      const month = date.toLocaleString("en-US", { month: "long" });

      const key = `${year} • ${month}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(film);
    });

    return grouped;
  };

  const groupedFilms = groupFilmsByDate();

  return (
    <>
      <div className="overflow-x-auto">
        {Object.keys(groupedFilms).map((groupKey) => (
          <div key={groupKey}>
            <h2 className="ml-1 font-artistic">{groupKey}</h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 mb-5">
              {groupedFilms[groupKey].map((film) => {
                const poster = film.poster;
  
                return (
                  <div key={film.id} className="cursor-pointer">
                    <Link to={`/films/${film.id}`}>
                      {poster ? (
                        <img src={poster} alt={film.name} className="p-1" />
                      ) : (
                        <div className="w-full bg-gray-300 flex items-center justify-center">
                          No Poster
                        </div>
                      )}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );  
}
