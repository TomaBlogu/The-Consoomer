import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function AlbumDetails() {
  const { id } = useParams(); // Get album id from URL
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const response = await fetch(`https://the-consoomer.onrender.com/albums/${id}`);
        if (!response.ok) throw new Error("Album not found");
        const data = await response.json();
        setAlbum(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [id]);

  if (loading) return <p>Loading album details...</p>;
  if (error) return <p>{error}</p>;
  if (!album) return <p>No album found.</p>;

  return (
    <div className="grid grid-cols-1">
      <div className="text-center font-artistic">
        <p className="text-[25px] -mb-2">{album.name}</p>
        <p>by {album.artist}</p>
      </div>

      <img
        src={album.cover_url || "https://via.placeholder.com/300"}
        alt={album.name}
        className="p-5"
      />

      <div className="grid grid-cols-2 mx-5">
        <p>Released: </p>
        <p>
            {(() => {
              const date = new Date(album.release_date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric"
              }).split(" "); // Split the date into parts

              return (
                <>
                  {date.slice(0, -1).join(" ")}{" "}
                  <b>{date[date.length - 1]}</b>
                </>
              );
            })()}
          </p>
      </div>
      <div className="grid grid-cols-2 mx-5">
        <p>Genres:</p>
        <p className="block">{album.genres}</p>
      </div>
      <div className="grid grid-cols-2 mx-5">
        <p>Nr of Tracks:</p>
        <p>{album.nr_tracks}</p>
      </div>
      <div className="grid grid-cols-2 mx-5">
        <p>Duration:</p>
        <p>{album.duration} mins</p>
      </div>
      <div className="grid grid-cols-2 mx-5">
        <p>Listened:</p>
        <p>{new Date(album.listened_date).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric"
          })}
        </p>
      </div>
      <div className="grid grid-cols-2 mx-5">
        <p>Rating:</p>
        <p>{album.rating}</p>
      </div>

      <div className="border-b border-gray-300 my-10"></div>

      <p className="mx-5">Thoughts:</p>
      <p className="mx-5">{album.review}</p>
    </div>
  );
}
