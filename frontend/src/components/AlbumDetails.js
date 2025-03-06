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
        const response = await fetch(`http://localhost:5000/albums/${id}`);
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
    <div className="flex items-center gap-6">
      <img
        src={album.cover_url || "https://via.placeholder.com/300"}
        alt={album.name}
        className="w-60 h-60 object-cover rounded-md"
      />
      <div>
        <h2 className="text-xl font-bold">{album.name}</h2>
        <p><strong>Artist:</strong> {album.artist}</p>
        <p><strong>Genres:</strong> {album.genres}</p>
        <p><strong>Release Date:</strong> {new Intl.DateTimeFormat("en-GB").format(new Date(album.release_date))}</p>
        <p><strong>Number of Tracks:</strong> {album.nr_tracks}</p>
        <p><strong>Duration:</strong> {album.duration}</p>
        <p><strong>Listened Date:</strong> {album.listened_date ? new Intl.DateTimeFormat("en-GB").format(new Date(album.listened_date)) : "Not listened yet"}</p>
        <p><strong>Rating:</strong> {album.rating}</p>
      </div>
    </div>
  );
}
