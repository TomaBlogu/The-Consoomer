import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function FilmDetails() {
  const { id } = useParams(); // Get film id from URL
  const [film, setFilm] = useState(null);
  const [posterUrl, setPosterUrl] = useState(null);
  const [error, setError] = useState(null);
  const [releaseDate, setReleaseDate] = useState(null);
  const [genres, setGenres] = useState(null);
  const [duration, setDuration] = useState(null);
  const [allGenres, setAllGenres] = useState([]);  // State to store all genres
  const tmdbApiKey = '20e344c70ff88ae672ca22132f5e72e5';  // Replace with your actual TMDb API key

  useEffect(() => {
    // Fetch all available genres
    const fetchGenres = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${tmdbApiKey}&language=en-US`
        );
        const data = await response.json();
        setAllGenres(data.genres);
      } catch (err) {
        setError("Failed to fetch genres");
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchFilm = async () => {
      try {
        const response = await fetch(`http://localhost:5000/films/${id}`);
        if (!response.ok) throw new Error("Film not found");
        const data = await response.json();
        setFilm(data);
  
        console.log('Fetched Film Data:', data);
  
        const searchResponse = await fetch(
          `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(data.name)}&api_key=${tmdbApiKey}`
        );
        const searchData = await searchResponse.json();
  
        console.log('TMDb Search Response:', searchData);
  
        if (searchData.results.length > 0) {
          const movie = searchData.results[0];
          const posterPath = movie.poster_path;
          if (posterPath) {
            setPosterUrl(`https://image.tmdb.org/t/p/w500${posterPath}`);
          }
  
          setReleaseDate(movie.release_date);
  
          const genreNames = movie.genre_ids
            .map((id) => allGenres.find((genre) => genre.id === id)?.name)
            .filter(Boolean)
            .join(', ') || 'N/A';
          setGenres(genreNames);
  
          // Fetch movie details (including runtime)
          const movieDetailsResponse = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${tmdbApiKey}`
          );
          const movieDetails = await movieDetailsResponse.json();
          console.log('TMDb Movie Details:', movieDetails);
  
          setDuration(movieDetails.runtime); // Set the movie duration
        }
      } catch (err) {
        setError(err.message);
      }
    };
  
    fetchFilm();
  }, [id, allGenres]);

  if (error) return <p>{error}</p>;
  if (!film) return <p>No film found.</p>;

  const getRatingColor = (rating) => {
    if (rating <= 5) {
      const red = 255;
      const green = Math.round((rating / 5) * 255);
      return `rgba(${red}, ${green}, 0, 0.3)`;
    } else {
      const red = Math.round((1 - (rating - 5) / 5) * 255);
      const green = 255;
      return `rgba(${red}, ${green}, 0, 0.3)`;
    }
  };

  return (
    <div>
      <div className="text-center font-artistic mt-5">
        <p className="text-[25px] -mb-2">{film.name}</p>
        <p>directed by {film.director}</p>
      </div>
      
      {posterUrl && (
        <div>
          <img src={posterUrl} alt={film.name} className="p-5 mx-auto" />
        </div>
      )}

      <div className="grid grid-cols-2 mx-5">
        <p>Release date:</p>
        <p>
        {(() => {
          const date = new Date(releaseDate).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });
          const parts = date.split(" "); // Splitting the formatted date into parts
          return (
            <>
              {parts.slice(0, -1).join(" ")} <strong>{parts[parts.length - 1]}</strong>
            </>
          );
        })()}
        </p>
      </div>
      <div className="grid grid-cols-2 mx-5">
        <p>Genres:</p>
        {genres}
      </div>
      <div className="grid grid-cols-2 mx-5">
        <p>Duration:</p>
        <p>{duration ? `${duration} minutes` : "N/A"}</p>
      </div>

      <div className="grid grid-cols-2 mx-5">
        <p>Watched:</p>
        <p>{new Date(film.watched_date).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric"
        })}</p>
      </div>
      <div className="grid grid-cols-2 mx-5" style={{ backgroundColor: getRatingColor(film.rating) }}>
        <p>Rating:</p>
        <p>{film.rating}</p>
      </div>

      <div className="border-b border-gray-300 my-10 "></div>

      <p className="mx-5">Thoughts:</p>
      <p className="mx-5">{film.review}</p>
    </div>
  );
}
