import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function BookList() {
  const [albums, setAlbums] = useState([]);
  const [albumCovers, setAlbumCovers] = useState({}); // Store fetched covers

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await fetch("http://localhost:5000/books");
        const data = await response.json();
        setAlbums(data.rows);
      } catch (error) {
        console.error("Error fetching albums:", error);
      }
    };

    fetchAlbums();
  }, []);

  // Function to fetch album cover from iTunes API
  const fetchAlbumCover = async (album, artist) => {
    const query = `${artist} ${album}`;
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=album&limit=1`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.resultCount > 0) {
        const artworkUrl = data.results[0].artworkUrl100.replace("100x100", "1000x1000"); // Get highest quality
        setAlbumCovers((prev) => ({ ...prev, [`${album}-${artist}`]: artworkUrl }));
      } else {
        setAlbumCovers((prev) => ({ ...prev, [`${album}-${artist}`]: null }));
      }
    } catch (error) {
      console.error(`Error fetching cover for ${album} by ${artist}:`, error);
      setAlbumCovers((prev) => ({ ...prev, [`${album}-${artist}`]: null }));
    }
  };

  useEffect(() => {
    albums.forEach((album) => {
      const key = `${album.name}-${album.artist}`;
      if (!albumCovers[key]) {
        fetchAlbumCover(album.name, album.artist);
      }
    });
  }, [albums]);

  const sortedAlbums = albums.sort((a, b) => new Date(b.listened_date) - new Date(a.listened_date));

  // Group albums by year and month
  const groupedAlbums = sortedAlbums.reduce((groups, album) => {
    const listenedDate = new Date(album.listened_date);
    const year = listenedDate.getFullYear();
    const month = listenedDate.toLocaleString("default", { month: "long" });
    const groupKey = `${year} • ${month}`;

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(album);
    return groups;
  }, {});

  return (
    <>
      <div className="overflow-x-auto">
        {Object.keys(groupedAlbums).map((groupKey) => (
          <div key={groupKey}>
            <h2 className="ml-1 font-artistic">{groupKey}</h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 mb-5">
              {groupedAlbums[groupKey].map((album) => {
                const key = `${album.name}-${album.artist}`;
                const cover = albumCovers[key];

                return (
                  <div key={album.id} className="cursor-pointer">
                    <Link to={`/albums/${album.id}`}>
                      {cover ? (
                        <img src={cover} alt={album.name} className="aspect-square p-1" />
                      ) : (
                        <div className="w-full aspect-square bg-gray-300 flex items-center justify-center">
                          No Cover
                        </div>
                      )}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
