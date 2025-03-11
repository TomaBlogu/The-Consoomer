const express = require("express");
const cors = require("cors");
const pool = require("./database");

const app = express();
app.use(cors());
app.use(express.json());

//Routes

app.post("/new-entry-album", async (req, res) => {
    try {
        const { name, artist, genres, listened_date, rating, review} = req.body;
        const newEntry = await pool.query("INSERT INTO album (name, artist, genres, listened_date, rating, review) VALUES($1, $2, $3, $4, $5, $6)",
            [name, artist, genres, listened_date, rating, review]
        );
    } catch (err) {
        console.error(err.message);
    }
})

app.post("/new-entry-film", async (req, res) => {
    try {
        const { name, director, genres, watched_date, rating, review} = req.body;
        const newEntry = await pool.query("INSERT INTO film (name, director, genres, watched_date, rating, review) VALUES($1, $2, $3, $4, $5, $6)",
            [name, director, genres, watched_date, rating, review]
        );
    } catch (err) {
        console.error(err.message);
    }
})

app.post("/new-entry-book", async (req, res) => {
    try {
        const { name, author, genres, read_date, rating, review} = req.body;
        const newEntry = await pool.query("INSERT INTO book (name, author, genres, read_date, rating, review) VALUES($1, $2, $3, $4, $5, $6)",
            [name, author, genres, read_date, rating, review]
        );
    } catch (err) {
        console.error(err.message);
    }
})

const password = process.env.REACT_APP_PASSWORD;
app.post('/login', (req, res) => {
    const { password } = req.body;
    if (password === process.env.REACT_APP_PASSWORD) {
        res.status(200).json({ success: true });
    } else {
        res.status(401).json({ success: false });
    }
});

app.get("/albums", async(req, res) => {
    try {
        const allTest = await pool.query("SELECT * FROM album");
        res.json(allTest);
    } catch (err) {
        console.error(err.message);
    }
})

app.get("/films", async(req, res) => {
    try {
        const allTest = await pool.query("SELECT * FROM film");
        res.json(allTest);
    } catch (err) {
        console.error(err.message);
    }
})

app.get("/books", async(req, res) => {
    try {
        const allTest = await pool.query("SELECT * FROM book");
        res.json(allTest);
    } catch (err) {
        console.error(err.message);
    }
})

app.get("/albums/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const album = await pool.query("SELECT * FROM album WHERE id = $1", [id]);
        
        if (album.rows.length === 0) {
            return res.status(404).json({ message: "Album not found" });
        }

        res.json(album.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

app.get("/films/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const film = await pool.query("SELECT * FROM film WHERE id = $1", [id]);
        
        if (film.rows.length === 0) {
            return res.status(404).json({ message: "Film not found" });
        }

        res.json(film.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

app.get("/books/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const book = await pool.query("SELECT * FROM book WHERE id = $1", [id]);
        
        if (book.rows.length === 0) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.json(book.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});