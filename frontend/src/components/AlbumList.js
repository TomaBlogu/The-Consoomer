import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AlbumList() {
  const [albums, setAlbums] = useState([]);
  const [albumCovers, setAlbumCovers] = useState({}); // Store fetched covers
  const [releaseYears, setReleaseYears] = useState({}); // Store fetched release years
  const [sortOption, setSortOption] = useState("date"); // Sorting option: "date", "ratingHigh", "ratingLow", "releaseYear", "releaseYearDesc"
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to toggle dropdown visibility

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await fetch("https://the-consoomer-backend.onrender.com/albums");
        const data = await response.json();
        setAlbums(data.rows);
      } catch (error) {
        console.error("Error fetching albums:", error);
      }
    };

    fetchAlbums();
  }, []);

  // Function to fetch album cover and release year from Last.fm API
  const fetchAlbumDetails = async (album, artist, coverUrlFromDb) => {
    if (coverUrlFromDb) {
      // Use the cover URL from the database if available
      setAlbumCovers((prev) => ({ ...prev, [`${album}-${artist}`]: coverUrlFromDb }));
      return;
    }

    const apiKey = "d10adc92abe0cdb5e3b1458b7d506f6c"; // Replace with your Last.fm API key
    const url = `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${apiKey}&artist=${encodeURIComponent(
      artist
    )}&album=${encodeURIComponent(album)}&format=json`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.album) {
        // Fetch and store the album cover
        const artworkUrl = data.album.image.find((img) => img.size === "extralarge")?.["#text"];
        setAlbumCovers((prev) => ({ ...prev, [`${album}-${artist}`]: artworkUrl || null }));

        // Fetch and store the release year
        const releaseYear = data.album.wiki?.published
          ? new Date(data.album.wiki.published).getFullYear()
          : null;
        setReleaseYears((prev) => ({ ...prev, [`${album}-${artist}`]: releaseYear }));
      } else {
        console.warn(`No album details found for ${album} by ${artist}`);
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
        fetchAlbumDetails(album.name, album.artist, album.cover_url); // Pass cover_url from the database
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
        <div className="flex justify-between mb-5 mx-1">
          <input
            type="text"
            placeholder="Search by album or artist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 bg-gray-200 flex-grow mr-1"
          />
          <div className="relative">
            <img
              src="/sort.png"
              alt="Sort"
              className="cursor-pointer w-10"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            />
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-gray-200 shadow-lg w-48">
                <ul className="w-full">
                  <li
                    className="px-4 py-2 cursor-pointer hover:bg-gray-300"
                    onClick={() => {
                      setSortOption("date");
                      setIsDropdownOpen(false);
                    }}
                  >
                    Recently Listened
                  </li>
                  <li
                    className="px-4 py-2 cursor-pointer hover:bg-gray-300"
                    onClick={() => {
                      setSortOption("ratingHigh");
                      setIsDropdownOpen(false);
                    }}
                  >
                    Rating: High to Low
                  </li>
                  <li
                    className="px-4 py-2 cursor-pointer hover:bg-gray-300"
                    onClick={() => {
                      setSortOption("ratingLow");
                      setIsDropdownOpen(false);
                    }}
                  >
                    Rating: Low to High
                  </li>
                  <li
                    className="px-4 py-2 cursor-pointer hover:bg-gray-300"
                    onClick={() => {
                      setSortOption("releaseYear");
                      setIsDropdownOpen(false);
                    }}
                  >
                    Release: Oldest to Newest
                  </li>
                  <li
                    className="px-4 py-2 cursor-pointer hover:bg-gray-300"
                    onClick={() => {
                      setSortOption("releaseYearDesc");
                      setIsDropdownOpen(false);
                    }}
                  >
                    Release: Newest to Oldest
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        
        {Object.keys(groupedAlbums).map((groupKey) => (
          <div key={groupKey}>
            <h2 className="ml-1 font-artistic">{groupKey}</h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 mb-5 gap-1 mx-1">
              {groupedAlbums[groupKey].map((album) => {
                const key = `${album.name}-${album.artist}`;
                const cover = albumCovers[key];

                return (
                  <div key={album.id} className="cursor-pointer">
                    <Link to={`/albums/${album.id}`}>
                      {cover ? (
                        <img src={cover} className="aspect-square" />
                      ) : (
                        <div className="w-full aspect-square bg-gray-300 flex items-center justify-center">
                          <p className="text-center font-artistic">{album.name}</p>
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