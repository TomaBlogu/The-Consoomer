import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function AlbumDetails() {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [albumCover, setAlbumCover] = useState(null);
  const [albumDetails, setAlbumDetails] = useState({
    releaseDate: null,
    nrTracks: null,
  });
  const [duration, setDuration] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://the-consoomer-backend.onrender.com/albums/${id}`);
        if (!response.ok) throw new Error("Album not found");
        const data = await response.json();
        setAlbum(data);

        setAlbumDetails({
          releaseDate: data.release_date || null,
          nrTracks: data.nr_tracks || null,
        });

        if (data.duration && !isNaN(parseInt(data.duration, 10))) {
          const totalSeconds = parseInt(data.duration, 10);
          setDuration(totalSeconds);
        } else {
          setDuration(null);
        }

        if (data.cover_url) {
          setAlbumCover(data.cover_url);
        } else {
          fetchAlbumCoverFromLastFm(data.name, data.artist);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [id]);

  const fetchAlbumCoverFromLastFm = async (album, artist) => {
    const apiKey = "d10adc92abe0cdb5e3b1458b7d506f6c"; // Replace with your Last.fm API key
    const url = `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${apiKey}&artist=${encodeURIComponent(
      artist
    )}&album=${encodeURIComponent(album)}&format=json`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.album) {
        const artworkUrl = data.album.image.find((img) => img.size === "extralarge")?.["#text"];
        setAlbumCover(artworkUrl || null);
      } else {
        console.warn(`No album cover found for ${album} by ${artist}`);
        setAlbumCover(null);
      }
    } catch (error) {
      console.error(`Error fetching album cover for ${album} by ${artist}:`, error);
      setAlbumCover(null);
    }
  };

  const fetchAlbumDetailsFromiTunes = async (album, artist) => {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(
      artist + " " + album
    )}&entity=album&limit=50`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        // Refine search to match the exact album and artist
        const matchedAlbum = data.results.find(
          (result) =>
            result.collectionName.toLowerCase() === album.toLowerCase() &&
            result.artistName.toLowerCase() === artist.toLowerCase()
        );

        if (matchedAlbum) {
          // Validate the matched album further by checking release date and track count
          const releaseDate = matchedAlbum.releaseDate
            ? new Date(matchedAlbum.releaseDate)
            : null;
          const nrTracks = matchedAlbum.trackCount || "N/A";

          // If the matched album passes validation, update the details
          setAlbumDetails((prevDetails) => ({
            releaseDate: prevDetails.releaseDate || releaseDate,
            nrTracks: prevDetails.nrTracks || nrTracks,
          }));

          // Fetch tracks to calculate duration
          const tracksUrl = `https://itunes.apple.com/lookup?id=${matchedAlbum.collectionId}&entity=song`;
          const tracksResponse = await fetch(tracksUrl);
          const tracksData = await tracksResponse.json();

          if (tracksData.results && tracksData.results.length > 1) {
            const totalDurationMs = tracksData.results
              .slice(1) // Skip the first result, which is the album itself
              .reduce((sum, track) => sum + (track.trackTimeMillis || 0), 0);

            if (totalDurationMs > 0) {
              const totalSeconds = Math.floor(totalDurationMs / 1000);
              setDuration(totalSeconds);
            } else {
              setDuration(null);
            }
          }
        } else {
          console.warn(`No exact match found for ${album} by ${artist} on iTunes`);
        }
      } else {
        console.warn(`No albums found for ${album} by ${artist} on iTunes`);
      }
    } catch (error) {
      console.error(`Error fetching album details for ${album} by ${artist} from iTunes:`, error);
    }
  };

  useEffect(() => {
    if (album) {
      if (!album.release_date || !album.nr_tracks || !album.duration) {
        fetchAlbumDetailsFromiTunes(album.name, album.artist);
      }
    }
  }, [album]);

  if (loading) return <p>Loading...</p>;
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

      {albumCover && (
        <img
          src={albumCover}
          alt={album.name}
          className="p-5 mx-auto w-[300px] h-[300px] object-cover"
        />
      )}

      <div className="grid grid-cols-2 mx-5">
        <p>Released:</p>
        <p>
          {albumDetails.releaseDate
            ? new Date(albumDetails.releaseDate).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "N/A"}
        </p>
      </div>
      <div className="grid grid-cols-2 mx-5">
        <p>Genres:</p>
        <p>{album.genres || "N/A"}</p>
      </div>
      <div className="grid grid-cols-2 mx-5">
        <p>Nr of Tracks:</p>
        <p>{albumDetails.nrTracks || "N/A"}</p>
      </div>
      <div className="grid grid-cols-2 mx-5">
        <p>Duration:</p>
        <p>
          {duration !== null
            ? (() => {
                const minutes = Math.floor(duration / 60);
                const seconds = duration % 60;
                return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
              })()
            : "N/A"}
        </p>
      </div>
      <div className="grid grid-cols-2 mx-5">
        <p>Listened:</p>
        <p>
          {album.listened_date
            ? new Date(album.listened_date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "N/A"}
        </p>
      </div>
      
      <div
        className="grid grid-cols-2 mx-5"
        style={{ backgroundColor: getRatingColor(album.rating) }}
      >
        <p>Rating:</p>
        <p>{album.rating}</p>
      </div>

      <div className="border-b border-gray-300 my-10"></div>

      <p className="mx-5">Thoughts:</p>
      <p className="mx-5">{album.review}</p>
    </div>
  );
}
