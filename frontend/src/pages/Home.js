import Navbar from '../components/Navbar';

export default function Films() {
  return (
    <div>
      <Navbar />
      <div className='text-center list-none text-[25px] mt-5 mb-5 font-artistic font-[900]'>
        <li><a href="/albums">Albums</a></li>
        <li><a href="/books">Books</a></li>
        <li><a href="/films">Films</a></li>
        <li><a href="/series">Series</a></li>
        <li><a href="/anime">Anime</a></li>
        <li><a href="/bingo">2025 Bingo</a></li>
        <br></br>
        <li><a href="/new-entry" className='font-light text-[15px]'>+new entry</a></li>
      </div>
    </div>
  );
}