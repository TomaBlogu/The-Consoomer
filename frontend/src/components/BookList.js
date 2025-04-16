import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [bookCovers, setBookCovers] = useState({});
  const [sortOption, setSortOption] = useState("date"); // Sorting option
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown visibility

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("https://the-consoomer-backend.onrender.com/books");
        const data = await response.json();
        setBooks(data.rows);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  const fetchBookCover = async (title, author, coverUrl) => {
    const key = `${title}-${author}`;
    if (coverUrl) {
      setBookCovers((prev) => ({ ...prev, [key]: coverUrl }));
      return;
    }

    if (bookCovers[key] !== undefined) return; // Prevent duplicate fetches

    const openLibraryUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}`;

    try {
      const olResponse = await fetch(openLibraryUrl);
      const olData = await olResponse.json();

      if (olData.docs.length > 0) {
        const matchedBook = olData.docs[0];

        if (matchedBook.cover_i) {
          const coverUrl = `https://covers.openlibrary.org/b/id/${matchedBook.cover_i}-L.jpg`;
          setBookCovers((prev) => ({ ...prev, [key]: coverUrl }));
        } else {
          setBookCovers((prev) => ({ ...prev, [key]: null }));
        }
      } else {
        setBookCovers((prev) => ({ ...prev, [key]: null }));
      }
    } catch (error) {
      console.error(`Error fetching cover for ${title} by ${author}:`, error);
      setBookCovers((prev) => ({ ...prev, [key]: null }));
    }
  };

  useEffect(() => {
    books.forEach((book) => {
      const key = `${book.name}-${book.author}`;
      if (bookCovers[key] === undefined) {
        fetchBookCover(book.name, book.author, book.cover_url);
      }
    });
  }, [books]);

  // Filter books based on the search query
  const filteredBooks = books.filter(
    (book) =>
      book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort books based on the selected sorting option
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortOption) {
      case "ratingHigh":
        return b.rating - a.rating;
      case "ratingLow":
        return a.rating - b.rating;
      default:
        return new Date(b.read_date) - new Date(a.read_date);
    }
  });

  // Group books based on the selected sorting option
  const groupedBooks = sortedBooks.reduce((groups, book) => {
    let groupKey;

    switch (sortOption) {
      case "ratingHigh":
      case "ratingLow":
        groupKey = `Rating: ${book.rating}`;
        break;
      default:
        const readDate = new Date(book.read_date);
        groupKey = `${readDate.getFullYear()} • ${readDate.toLocaleString("default", { month: "long" })}`;
        break;
    }

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(book);
    return groups;
  }, {});

  return (
    <>
      <div className="overflow-x-auto">
        <div className="flex justify-between mb-5 mx-1">
          <input
            type="text"
            placeholder="Search by book or author..."
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
                    Recently Read
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
                </ul>
              </div>
            )}
          </div>
        </div>

        {Object.keys(groupedBooks).map((groupKey) => (
          <div key={groupKey}>
            <h2 className="ml-1 font-artistic">{groupKey}</h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 mb-5">
              {groupedBooks[groupKey].map((book) => {
                const key = `${book.name}-${book.author}`;
                const cover = bookCovers[key];

                return (
                  <div key={book.id} className="cursor-pointer">
                    <Link to={`/books/${book.id}`}>
                      {cover ? (
                        <img src={cover} alt={book.name} className="p-1 w-full h-48 object-cover" />
                      ) : (
                        <div className="w-full bg-gray-300 flex items-center justify-center">
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
