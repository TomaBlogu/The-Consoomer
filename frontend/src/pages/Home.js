import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

export default function Films() {
  return (
    <div>
      <Navbar />
      <ul className="text-center list-none text-[25px] mt-5 mb-5 font-artistic font-[900]">
        {[
          { name: "Albums", path: "/albums" },
          { name: "Books", path: "/books" },
          { name: "Films", path: "/films" },
          { name: "Series", path: "/series" },
          { name: "Anime", path: "/anime" },
          { name: "2025 Bingo", path: "/bingo" },
        ].map((item, index) => (
          <motion.li
            key={index}
            className="flex justify-center items-center"
            whileHover="hovered"
          >
            <motion.a
              href={item.path}
              className="flex items-center gap-2 transition-colors duration-200 hover:text-blue-500"
              initial="default"
              whileHover="hovered"
            >
              <motion.span
                variants={{
                  default: { opacity: 0, x: -10 },
                  hovered: { opacity: 1, x: 0 },
                }}
                transition={{ duration: 0.2 }}
                className="text-blue-500"
              >
                ➤
              </motion.span>
              {item.name}
            </motion.a>
          </motion.li>
        ))}
        <br />
        <li>
          <a href="/new-entry" className="font-light text-[15px]">
            +new entry
          </a>
        </li>
      </ul>
    </div>
  );
}
