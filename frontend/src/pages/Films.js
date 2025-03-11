import Navbar from '../components/Navbar';
import FilmList from '../components/FilmList';

export default function Films() {
  return (
    <div>
      <Navbar />
      <p className="text-center text-[25px] mt-5 font-artistic font-[900] underline">Films</p>
      <li className='list-none text-center mb-5'>
        <a href="/new-entry-film" className="text-[20px] ml-1 font-artistic">
          +
        </a>
      </li>
      <FilmList />
    </div>
  );
}