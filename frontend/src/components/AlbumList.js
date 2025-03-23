import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AlbumList() {
  const [albums, setAlbums] = useState([]);
  const [albumCovers, setAlbumCovers] = useState({}); // Store fetched covers
  const [releaseYears, setReleaseYears] = useState({}); // Store fetched release years
  const [sortOption, setSortOption] = useState("date"); // Sorting option: "date", "ratingHigh", "ratingLow", "releaseYear", "releaseYearDesc"
  const [searchQuery, setSearchQuery] = useState(""); // Search query

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await fetch("http://localhost:5000/albums");
        const data = await response.json();
        setAlbums(data.rows);
      } catch (error) {
        console.error("Error fetching albums:", error);
      }
    };

    fetchAlbums();
  }, []);

  // Function to fetch album cover and release year from iTunes API
  const fetchAlbumDetails = async (album, artist) => {
    const query = `${artist} ${album}`;
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=album&limit=5`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.resultCount > 0) {
        const matchedAlbum = data.results.find((result) =>
          result.collectionName.toLowerCase() === album.toLowerCase()
        );

        if (matchedAlbum) {
          // Fetch and store the album cover
          const artworkUrl = matchedAlbum.artworkUrl100.replace("100x100", "1000x1000");
          setAlbumCovers((prev) => ({ ...prev, [`${album}-${artist}`]: artworkUrl }));

          // Fetch and store the release year
          const releaseYear = new Date(matchedAlbum.releaseDate).getFullYear();
          setReleaseYears((prev) => ({ ...prev, [`${album}-${artist}`]: releaseYear }));
        } else {
          setAlbumCovers((prev) => ({ ...prev, [`${album}-${artist}`]: null }));
          setReleaseYears((prev) => ({ ...prev, [`${album}-${artist}`]: null }));
        }
      } else {
        setAlbumCovers((prev) => ({ ...prev, [`${album}-${artist}`]: null }));
        setReleaseYears((prev) => ({ ...prev, [`${album}-${artist}`]: null }));
      }
    } catch (error) {
      console.error(`Error fetching details for ${album} by ${artist}:`, error);
      setAlbumCovers((prev) => ({ ...prev, [`${album}-${artist}`]: null }));
      setReleaseYears((prev) => ({ ...prev, [`${album}-${artist}`]: null }));
    }
  };

  useEffect(() => {
    albums.forEach((album) => {
      const key = `${album.name}-${album.artist}`;
      if (!albumCovers[key] || !releaseYears[key]) {
        fetchAlbumDetails(album.name, album.artist);
      }
    });
  }, [albums]);

  // Filter albums based on the search query
  const filteredAlbums = albums.filter(
    (album) =>
      album.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      album.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort albums based on the selected sorting option
  const sortedAlbums = [...filteredAlbums].sort((a, b) => {
    const releaseYearA = releaseYears[`${a.name}-${a.artist}`];
    const releaseYearB = releaseYears[`${b.name}-${b.artist}`];

    switch (sortOption) {
      case "ratingHigh":
        return b.rating - a.rating; // Sort by rating (highest to lowest)
      case "ratingLow":
        return a.rating - b.rating; // Sort by rating (lowest to highest)
      case "releaseYear":
        return (releaseYearA || 0) - (releaseYearB || 0); // Sort by release year (ascending)
      case "releaseYearDesc":
        return (releaseYearB || 0) - (releaseYearA || 0); // Sort by release year (descending)
      default:
        return new Date(b.listened_date) - new Date(a.listened_date); // Default sort by listened date (descending)
    }
  });

  // Group albums based on the selected sorting option
  const groupedAlbums = sortedAlbums.reduce((groups, album) => {
    let groupKey;

    switch (sortOption) {
      case "ratingHigh":
      case "ratingLow":
        groupKey = `Rating: ${album.rating}`; // Group by rating
        break;
      case "releaseYear":
      case "releaseYearDesc":
        const releaseYear = releaseYears[`${album.name}-${album.artist}`];
        groupKey = releaseYear ? `Release Year: ${releaseYear}` : "Release Year: Unknown"; // Group by release year
        break;
      default:
        const listenedDate = new Date(album.listened_date);
        groupKey = `${listenedDate.getFullYear()} • ${listenedDate.toLocaleString("default", { month: "long" })}`; // Group by year and month
        break;
    }

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(album);
    return groups;
  }, {});

  return (
    <>
      <div className="overflow-x-auto">
        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Search by album or artist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 rounded bg-gray-200 text-black w-1/2"
          />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="px-4 py-2 rounded bg-gray-200 text-black"
          >
            <option value="date">Sort by Date</option>
            <option value="ratingHigh">Rating: High to Low</option>
            <option value="ratingLow">Rating: Low to High</option>
            <option value="releaseYear">Release Year: Oldest to Newest</option>
            <option value="releaseYearDesc">Release Year: Newest to Oldest</option>
          </select>
        </div>
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