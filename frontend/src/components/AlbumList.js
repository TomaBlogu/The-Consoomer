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
      <div className="grid grid-cols-6 justify-around gap-5">
        {albums.map((album) => (
          <div key={album.id} className="cursor-pointer">
            <Link to={`/albums/${album.id}`}>
              {album.cover_url ? (
                <img
                  src={album.cover_url}
                  alt={album.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    maxHeight: "300px",
                    maxWidth: "300px",
                    objectFit: "cover",
                    borderRadius: "5px",
                  }}
                />
              ) : (
                "No Cover"
              )}
            </Link>
            <h2 className="text-xl font-bold text-center">{album.name} - {album.artist}</h2>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
