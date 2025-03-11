import Navbar from '../components/Navbar';
import BookList from '../components/BookList';

export default function Books() {
  return (
    <div>
      <Navbar />
      <p className="text-center text-[25px] mt-5 font-artistic font-[900] underline">Books</p>
      <li className='list-none text-center mb-5'>
        <a href="/new-entry-book" className="text-[20px] ml-1 font-artistic">
          +
        </a>
      </li>
      <BookList />
    </div>
  );
}