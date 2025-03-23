import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function FilmList() {
  const [films, setFilms] = useState([]);
  const [sortOption, setSortOption] = useState("date"); // Sorting option: "date", "ratingHigh", "ratingLow", "releaseYear", "releaseYearDesc"
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const [releaseYears, setReleaseYears] = useState({}); // Store fetched release years
  const tmdbApiKey = process.env.REACT_APP_TMDB_API_KEY;

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const response = await fetch("http://localhost:5000/films");
        const data = await response.json();
        console.log("🎥 Films fetched from database:", data.rows);

        // Fetch posters and release years for each film
        const filmsWithDetails = await Promise.all(
          data.rows.map(async (film) => {
            if (!film.name || !film.director) {
              console.warn("⚠️ Skipping fetch due to missing data:", film);
              return { ...film, poster: null, releaseYear: null };
            }

            try {
              const { posterUrl, releaseYear } = await fetchFilmDetails(film.name, film.director);
              setReleaseYears((prev) => ({ ...prev, [film.id]: releaseYear }));
              return { ...film, poster: posterUrl, releaseYear };
            } catch (error) {
              console.error(`🚨 Error fetching details for ${film.name}:`, error);
              return { ...film, poster: null, releaseYear: null };
            }
          })
        );

        setFilms(filmsWithDetails);
      } catch (error) {
        console.error("🚨 Error fetching films:", error);
      }
    };

    fetchFilms();
  }, []);

  // 🔍 Fetch the movie poster and release year by name and director
  const fetchFilmDetails = async (title, director) => {
    const searchResponse = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
        title
      )}&api_key=${tmdbApiKey}`
    );
    const searchData = await searchResponse.json();

    if (!searchData.results || searchData.results.length === 0) {
      console.warn(`⚠️ No search results for ${title}`);
      return { posterUrl: null, releaseYear: null };
    }

    for (const movie of searchData.results) {
      const detailsResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${tmdbApiKey}&append_to_response=credits`
      );
      const detailsData = await detailsResponse.json();

      const directors = detailsData.credits.crew.filter(
        (member) => member.job === "Director"
      );

      if (directors.some((d) => d.name.toLowerCase() === director.toLowerCase())) {
        const posterUrl = movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : null;
        const releaseYear = new Date(movie.release_date).getFullYear();
        return { posterUrl, releaseYear };
      }
    }

    return { posterUrl: null, releaseYear: null };
  };

  // Filter films based on the search query
  const filteredFilms = films.filter(
    (film) =>
      film.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      film.director.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort films based on the selected sorting option
  const sortedFilms = [...filteredFilms].sort((a, b) => {
    const releaseYearA = releaseYears[a.id] || 0;
    const releaseYearB = releaseYears[b.id] || 0;

    switch (sortOption) {
      case "ratingHigh":
        return b.rating - a.rating; // Sort by rating (highest to lowest)
      case "ratingLow":
        return a.rating - b.rating; // Sort by rating (lowest to highest)
      case "releaseYear":
        return releaseYearA - releaseYearB; // Sort by release year (ascending)
      case "releaseYearDesc":
        return releaseYearB - releaseYearA; // Sort by release year (descending)
      default:
        return new Date(b.watched_date) - new Date(a.watched_date); // Default sort by watched date (descending)
    }
  });

  // Group films based on the selected sorting option
  const groupedFilms = sortedFilms.reduce((groups, film) => {
    let groupKey;

    switch (sortOption) {
      case "ratingHigh":
      case "ratingLow":
        groupKey = `Rating: ${film.rating}`; // Group by rating
        break;
      case "releaseYear":
      case "releaseYearDesc":
        const releaseYear = releaseYears[film.id];
        groupKey = releaseYear ? `Release Year: ${releaseYear}` : "Release Year: Unknown"; // Group by release year
        break;
      default:
        const watchedDate = new Date(film.watched_date);
        groupKey = `${watchedDate.getFullYear()} • ${watchedDate.toLocaleString("default", { month: "long" })}`; // Group by year and month
        break;
    }

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(film);
    return groups;
  }, {});

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search by film or director..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 rounded bg-gray-200 text-black w-1/2"
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="px-4 py-2 rounded bg-gray-200 text-black"
        >
          <option value="date">Sort by Date</option>
          <option value="ratingHigh">Rating: High to Low</option>
          <option value="ratingLow">Rating: Low to High</option>
          <option value="releaseYear">Release Year: Oldest to Newest</option>
          <option value="releaseYearDesc">Release Year: Newest to Oldest</option>
        </select>
      </div>
      {Object.keys(groupedFilms).map((groupKey) => (
        <div key={groupKey}>
          <h2 className="ml-1 font-artistic">{groupKey}</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 mb-5">
            {groupedFilms[groupKey].map((film) => (
              <div key={film.id} className="cursor-pointer">
                <Link to={`/films/${film.id}`}>
                  {film.poster ? (
                    <img src={film.poster} alt={film.name} className="p-1" />
                  ) : (
                    <div className="w-full bg-gray-300 flex items-center justify-center">
                      No Poster
                    </div>
                  )}
                </Link>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}