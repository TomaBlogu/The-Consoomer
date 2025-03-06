import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Albums from './pages/Albums';
import Books from './pages/Books';
import Films from './pages/Films';
import NoPage from './pages/NoPage';
import NewEntry from './pages/NewEntry';
import NewEntryTest from './pages/NewEntryTest';
import Album from "./pages/Album";
import './styles/App.css';

export default function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/albums" element={<Albums />} />
          <Route path="/albums/:id" element={<Album />} />
          <Route path="/books" element={<Books />} />
          <Route path="/films" element={<Films />} />
          <Route path="/new-entry" element={<NewEntryTest />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
