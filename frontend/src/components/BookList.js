import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [bookCovers, setBookCovers] = useState({});

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("http://localhost:5000/books");
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
      // If there's already a cover_url in the database, use it directly
      setBookCovers((prev) => ({ ...prev, [key]: coverUrl }));
    } else {
      // Fetch from Open Library if no cover URL is found
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
    }
  };

  useEffect(() => {
    books.forEach((book) => {
      const key = `${book.name}-${book.author}`;
      if (!bookCovers[key]) {
        // Fetch cover if it's not already in state
        fetchBookCover(book.name, book.author, book.cover_url);
      }
    });
  }, [books, bookCovers]);

  const sortedBooks = books.sort((a, b) => new Date(b.read_date) - new Date(a.read_date));

  const groupedBooks = sortedBooks.reduce((groups, book) => {
    const readDate = new Date(book.read_date);
    const year = readDate.getFullYear();
    const month = readDate.toLocaleString("default", { month: "long" });
    const groupKey = `${year} • ${month}`;

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(book);
    return groups;
  }, {});

  return (
    <div className="overflow-x-auto">
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
                      <img src={cover} alt={book.name} className="p-1" />
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
  );
}
