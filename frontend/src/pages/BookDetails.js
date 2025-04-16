import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Updated the rating color logic to match AlbumDetails
const getRatingColor = (rating) => {
  if (rating <= 5) {
    const red = 255;
    const green = Math.round((rating / 5) * 255);
    return `rgba(${red}, ${green}, 0, 0.3)`;
  } else {
    const red = Math.round((1 - (rating - 5) / 5) * 255);
    const green = 255;
    return `rgba(${red}, ${green}, 0, 0.3)`;
  }
};

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [coverUrl, setCoverUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`https://the-consoomer-backend.onrender.com/books/${id}`);
        if (!response.ok) throw new Error("Book not found");
        const data = await response.json();
        setBook(data);

        console.log("Fetched Book Data:", data);

        // Ensure genres are fetched and displayed
        if (!data.genres || data.genres.length === 0) {
          console.warn("Genres not found in API response");
        }

        // Use cover_url from database if available
        if (data.cover_url) {
          setCoverUrl(data.cover_url);
        } else {
          console.log(`Fetching cover for ${data.name} by ${data.author}`);
          
          const openLibraryUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(
            data.name
          )}&author=${encodeURIComponent(data.author)}`;
          const olResponse = await fetch(openLibraryUrl);
          const olData = await olResponse.json();

          if (olData.docs.length > 0 && olData.docs[0].cover_i) {
            setCoverUrl(`https://covers.openlibrary.org/b/id/${olData.docs[0].cover_i}-L.jpg`);
          }
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBook();
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!book) return <p>No book found.</p>;

  return (
    <div>
      <div className="text-center font-artistic mt-5">
        <p className="text-[25px] -mb-2">{book.name}</p>
        <p>by {book.author}</p>
      </div>

      {coverUrl && (
        <div>
          <img src={coverUrl} alt={book.name} className="p-5 mx-auto" />
        </div>
      )}

      <div className="grid grid-cols-2 mx-5">
        <p>Genres:</p>
        <p>{book.genres}</p>
      </div>

      <div className="grid grid-cols-2 mx-5">
        <p>Read on:</p>
        <p>
          {new Date(book.read_date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="grid grid-cols-2 mx-5" style={{ backgroundColor: getRatingColor(book.rating) }}>
        <p>Rating:</p>
        <p>{book.rating}</p>
      </div>

      <div className="border-b border-gray-300 my-10"></div>

      <p className="mx-5">Thoughts:</p>
      <p className="mx-5">{book.review}</p>
    </div>
  );
}
