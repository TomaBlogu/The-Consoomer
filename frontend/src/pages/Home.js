import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div>
      <Navbar />
      <p className="text-center font-artistic">Fuck consumerism. <br /> Create more, consume thoughtfully. <br /> Your hours are diamonds. <br /> Anyway, here's my artistic diet:</p>
      <ul className="text-center list-none text-[25px] mt-5 mb-5 font-artistic font-[900]">
        <a href="/albums">Albums</a>
        <br />
        <a href="/films">Films</a>
        <br />
        <a href="/books">Books</a>
      </ul>
    </div>
  );
}
