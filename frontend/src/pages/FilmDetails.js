import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function FilmDetails() {
  const { id } = useParams();
  const [film, setFilm] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [error, setError] = useState(null);
  const tmdbApiKey = process.env.REACT_APP_TMDB_API_KEY;

  useEffect(() => {
    const fetchFilm = async () => {
      try {
        const response = await fetch(`http://localhost:5000/films/${id}`);
        if (!response.ok) throw new Error("Film not found");
        const data = await response.json();
        setFilm(data);

        console.log("Fetched Film Data:", data);

        // Step 1: Search for the movie
        const movieSearchResponse = await fetch(
          `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
            data.name
          )}&api_key=${tmdbApiKey}`
        );
        const movieSearchData = await movieSearchResponse.json();
        console.log("TMDb Movie Search Response:", movieSearchData);

        if (movieSearchData.results.length === 0) {
          throw new Error("Movie not found on TMDb.");
        }

        // Step 2: Loop through results and find the correct director
        let matchedMovie = null;
        for (const movie of movieSearchData.results) {
          // Fetch full movie details to get the director
          const movieDetailsResponse = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${tmdbApiKey}&append_to_response=credits`
          );
          const movieDetails = await movieDetailsResponse.json();

          console.log("Checking movie:", movie.title, movieDetails);

          // Find director in the credits
          const directors = movieDetails.credits.crew.filter(
            (member) => member.job === "Director"
          );

          if (directors.some((d) => d.name.toLowerCase() === data.director.toLowerCase())) {
            matchedMovie = movieDetails;
            break;
          }
        }

        if (!matchedMovie) {
          throw new Error("No exact match found with the correct director.");
        }

        console.log("Matched Movie:", matchedMovie);

        setSelectedMovie({
          title: matchedMovie.title,
          posterPath: matchedMovie.poster_path,
          releaseDate: matchedMovie.release_date,
          duration: matchedMovie.runtime,
          genres: matchedMovie.genres.map((g) => g.name).join(", ") || "N/A",
        });
      } catch (err) {
        setError(err.message);
      }
    };

    fetchFilm();
  }, [id]);

  function getRatingColor(rating) {
    if (rating >= 8) return "text-green-500";
    if (rating >= 5) return "text-yellow-500";
    return "text-red-500";
  }

  if (error) return <p>{error}</p>;
  if (!film) return <p>No film found.</p>;
  if (!selectedMovie) return <p>Loading movie data...</p>;

  return (
    <div>
      <div className="text-center font-artistic mt-5">
        <p className="text-[25px] -mb-2">{film.name}</p>
        <p>directed by {film.director}</p>
      </div>

      {selectedMovie.posterPath && (
        <div>
          <img
            src={`https://image.tmdb.org/t/p/w500${selectedMovie.posterPath}`}
            alt={selectedMovie.title}
            className="p-5 mx-auto"
          />
        </div>
      )}

      <div className="grid grid-cols-2 mx-5">
        <p>Release date:</p>
        <p>
          {new Date(selectedMovie.releaseDate).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="grid grid-cols-2 mx-5">
        <p>Genres:</p>
        <p>{selectedMovie.genres}</p>
      </div>

      <div className="grid grid-cols-2 mx-5">
        <p>Duration:</p>
        <p>{selectedMovie.duration ? `${selectedMovie.duration} minutes` : "N/A"}</p>
      </div>

      <div className="grid grid-cols-2 mx-5">
        <p>Watched on:</p>
        <p>
          {new Date(film.watched_date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="grid grid-cols-2 mx-5">
        <p>Rating:</p>
        <p className={getRatingColor(film.rating)}>{film.rating}</p>
      </div>

      <div className="border-b border-gray-300 my-10"></div>

      <p className="mx-5">Thoughts:</p>
      <p className="mx-5">{film.review}</p>
    </div>
  );
}