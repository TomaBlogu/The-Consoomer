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

  const sortedAlbums = albums.sort((a, b) => {
    // Since listened_date is of type date in your database, it's likely a string in the format "YYYY-MM-DD"
    return new Date(b.listened_date) - new Date(a.listened_date); // Sort in descending order
  });

  // Group albums by year and month
  const groupedAlbums = sortedAlbums.reduce((groups, album) => {
    const listenedDate = new Date(album.listened_date);
    const year = listenedDate.getFullYear();
    const month = listenedDate.toLocaleString("default", { month: "long" }); // Get month name

    // Create a key for each year-month group
    const groupKey = `${year} - ${month}`;

    // Add album to the corresponding group
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(album);

    return groups;
  }, {});

  // Render the albums grouped by year and month
  return (
    <>
      <p className="text-center text-[25px] mt-5 mb-5"><b>Consumed Albums</b></p>
      <div className="overflow-x-auto">
        {Object.keys(groupedAlbums).map((groupKey) => (
          <div key={groupKey}>
            <h2 className="text-xl font-bold mt-5 mb-5">{groupKey}</h2>
            <div className="grid grid-cols-3 justify-around gap-2 sm:gap-5 sm:grid-cols-6">
              {groupedAlbums[groupKey].map((album) => (
                <div key={album.id} className="cursor-pointer">
                  <Link to={`/albums/${album.id}`}>
                    {album.cover_url ? (
                      <img
                        src={album.cover_url}
                        alt={album.name}
                        className="aspect-square rounded-md"
                      />
                    ) : (
                      "No Cover"
                    )}
                  </Link>
                  <div className="text-center">
                    <p>
                      <b>{album.name}</b> ({new Date(album.release_date).getFullYear()})
                    </p>
                    <p>{album.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}