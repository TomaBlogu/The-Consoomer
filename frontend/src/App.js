import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Albums from './pages/Albums';
import Films from './pages/Films';
import Books from './pages/Books';
import NoPage from './pages/NoPage';
import NewEntryAlbum from './pages/NewEntryAlbum';
import NewEntryBook from './pages/NewEntryBook';
import NewEntryFilm from './pages/NewEntryFilm';
import AlbumDetails from "./pages/AlbumDetails";
import FilmDetails from "./pages/FilmDetails";
import Book from "./pages/Book";
import Bingo from './pages/Bingo';
import './styles/App.css';

export default function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/albums" element={<Albums />} />
          <Route path="/albums/:id" element={<AlbumDetails />} />
          <Route path="/films" element={<Films />} />
          <Route path="/films/:id" element={<FilmDetails />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/:id" element={<Book />} />
          <Route path="/new-entry-album" element={<NewEntryAlbum />} />
          <Route path="/new-entry-film" element={<NewEntryFilm />} />
          <Route path="/new-entry-book" element={<NewEntryBook />} />
          <Route path="/2025-bingo" element={<Bingo />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
