import Navbar from '../components/Navbar';
import FilmList from '../components/FilmList';

export default function Films() {
  return (
    <div>
      <Navbar />
      <p className="text-center">Films</p>
      <FilmList />
    </div>
  );
}