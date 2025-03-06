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
    <div className="grid gap-2 grid-cols-1">
      <div className="text-center">
        <p>
          <b>{album.name}</b> ({new Date(album.release_date).getFullYear()})
        </p>
        <p>{album.artist}</p>
      </div>
      <img
        src={album.cover_url || "https://via.placeholder.com/300"}
        alt={album.name}
        className="object-cover rounded-md"
      />
      <div>
        <p><strong>Genres:</strong> {album.genres}</p>
        <p><strong>Release Date:</strong> {new Date(album.release_date).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric"
          })}
        </p>
        <p><strong>Number of Tracks:</strong> {album.nr_tracks}</p>
        <p><strong>Duration:</strong> {album.duration} mins</p>
        <p><strong>Listened Date:</strong> {new Date(album.listened_date).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric"
          })}
        </p>
        <p><strong>Rating:</strong> {album.rating}</p>
      </div>

      <p className="text-center mt-5"><b>Thoughts</b></p>
      <p>{album.review}</p>
    </div>
  );
}
