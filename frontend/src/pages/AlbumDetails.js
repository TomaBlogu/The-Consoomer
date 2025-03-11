import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function AlbumDetails() {
  const { id } = useParams(); // Get album id from URL
  const [album, setAlbum] = useState(null);
  const [albumCover, setAlbumCover] = useState(null); // Store the fetched cover
  const [albumDetails, setAlbumDetails] = useState({
    releaseDate: null,
    genres: null,
    nrTracks: null,
  }); // Store additional album details excluding duration
  const [duration, setDuration] = useState(null); // Separate duration state
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const response = await fetch(`http://localhost:5000/albums/${id}`);
        if (!response.ok) throw new Error("Album not found");
        const data = await response.json();
        setAlbum(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAlbum();
  }, [id]);

  // Function to fetch album cover and details from iTunes API
  const fetchAlbumDetails = async (album, artist) => {
    const query = `${artist} ${album}`;
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=album&limit=5`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log('iTunes API Response:', data); // Debug log

      // Check if results exist and ensure correct format
      if (data.resultCount > 0) {
        const matchedAlbum = data.results.find((result) =>
          result.collectionName.toLowerCase() === album.toLowerCase()
        );

        if (matchedAlbum) {
          const artworkUrl = matchedAlbum.artworkUrl100.replace("100x100", "1000x1000");
          setAlbumCover(artworkUrl);
        } else {
          setAlbumCover(null);
        }

        // Extract additional details
        const releaseDate = matchedAlbum.releaseDate ? new Date(matchedAlbum.releaseDate) : null;
        const genres = matchedAlbum.primaryGenreName || null;
        const nrTracks = matchedAlbum.trackCount || null;

        // Fetch tracks to calculate the total duration
        await fetchAlbumTracks(matchedAlbum.collectionId);

        setAlbumDetails({
          releaseDate,
          genres,
          nrTracks,
        });
      } else {
        setAlbumCover(null);
        setAlbumDetails({
          releaseDate: null,
          genres: null,
          nrTracks: null,
        });
      }
    } catch (error) {
      console.error(`Error fetching album details:`, error);
      setError("Error fetching album details");
      setAlbumDetails({
        releaseDate: null,
        genres: null,
        nrTracks: null,
      });
    }
  };

  // Function to fetch album tracks and calculate total duration
  const fetchAlbumTracks = async (collectionId) => {
    const url = `https://itunes.apple.com/lookup?id=${collectionId}&entity=song`;

    try {
      console.log('Fetching album tracks...'); // Debug log
      const response = await fetch(url);
      console.log('Response:', response); // Log the response object

      const data = await response.json();
      console.log('iTunes API Response:', data); // Log the parsed JSON response

      // Ensure there are results in the response
      if (data.results && data.results.length > 1) { // Skip the first result (album metadata)
        console.log('Track data:', data.results.slice(1)); // Log the track data

        // Sum the track durations (in milliseconds)
        const totalDurationMs = data.results.slice(1).reduce((sum, track) => {
          console.log('Track:', track.trackName, 'Duration (ms):', track.trackTimeMillis); // Log each track's name and duration
          return sum + track.trackTimeMillis;
        }, 0);

        console.log('Total duration in ms:', totalDurationMs); // Log total duration in ms

        // Convert milliseconds to minutes and seconds
        const totalDurationSecs = totalDurationMs / 1000;
        const minutes = Math.floor(totalDurationSecs / 60);
        const seconds = Math.round(totalDurationSecs % 60);
        console.log('Formatted duration:', `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`); // Log the formatted duration

        // Update the separate duration state with the calculated duration
        setDuration(`${minutes}:${seconds < 10 ? '0' + seconds : seconds}`);
      } else {
        console.log('No tracks found or invalid response'); // Log if no tracks are found
        setDuration("No tracks found");
      }
    } catch (error) {
      console.error('Error fetching album tracks:', error); // Log any error
      setDuration("Error fetching duration");
    }
  };

  useEffect(() => {
    if (album) {
      fetchAlbumDetails(album.name, album.artist);
    }
  }, [album]);

  // Log album details for debugging
  useEffect(() => {
    console.log("Album details:", albumDetails); // Debug log
  }, [albumDetails]);

  if (error) return <p>{error}</p>;
  if (!album) return <p>No album found.</p>;

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
    <div className="grid grid-cols-1">
      <div className="text-center font-artistic mt-5">
        <p className="text-[25px] -mb-2">{album.name}</p>
        <p>by {album.artist}</p>
      </div>

      <img
        src={albumCover}
        alt={album.name}
        className="p-5 mx-auto"
      />

      <div className="grid grid-cols-2 mx-5">
        <p>Released: </p>
        <p>
        {(() => {
          const date = new Date(albumDetails.releaseDate).toLocaleDateString("en-GB", {
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
        <p>{albumDetails.genres || "N/A"}</p>
      </div>
      <div className="grid grid-cols-2 mx-5">
        <p>Nr of Tracks:</p>
        <p>{albumDetails.nrTracks || "N/A"}</p>
      </div>
      <div className="grid grid-cols-2 mx-5">
        <p>Duration:</p>
        <p>{duration || "N/A"}</p>
      </div>
      <div className="grid grid-cols-2 mx-5">
        <p>Listened:</p>
        <p>{new Date(album.listened_date).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric"
        })}</p>
      </div>
      <div className="grid grid-cols-2 mx-5" style={{ backgroundColor: getRatingColor(album.rating) }}>
        <p>Rating:</p>
        <p>{album.rating}</p>
      </div>

      <div className="border-b border-gray-300 my-10 "></div>

      <p className="mx-5">Thoughts:</p>
      <p className="mx-5">{album.review}</p>
    </div>
  );
}
