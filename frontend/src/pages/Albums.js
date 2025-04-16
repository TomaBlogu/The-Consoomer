import Navbar from '../components/Navbar';
import AlbumList from '../components/AlbumList';

export default function Albums() {
  return (
    <div>
      <Navbar />
      <p className="text-center text-[25px] mt-5 font-artistic font-[900] underline">Albums</p>
      <li className='list-none text-center mb-2'>
        <a href="/new-entry-album" className="text-[20px] ml-1 font-artistic">
          +
        </a>
      </li>
      <AlbumList />
    </div>
  );
}