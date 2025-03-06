import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AlbumList() {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await fetch("https://the-consoomer.onrender.com/albums");
        const data = await response.json();
        setAlbums(data.rows); // Use data.rows since your query returns an object with a "rows" key
      } catch (error) {
        console.error("Error fetching albums:", error);
      }
    };

    fetchAlbums();
  }, []);

  return (
    <>
    <div className="overflow-x-auto mt-10">
      <div className="grid grid-cols-3 justify-around gap-2 sm:gap-5 sm:grid-cols-6">
        {albums.map((album) => (
          <div key={album.id} className="cursor-pointer">
            <Link to={`/albums/${album.id}`}>
              {album.cover_url ? (
                <img
                  src={album.cover_url}
                  alt={album.name}
                  className="aspect-square"
                />
              ) : (
                "No Cover"
              )}
            </Link>
            <div className="text-center">
              <p><b>{album.name}</b> ({new Date(album.release_date).getFullYear()})</p>
              <p>{album.artist}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
