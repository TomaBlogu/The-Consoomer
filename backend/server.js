const express = require("express");
const cors = require("cors");
const pool = require("./database");

const app = express();
app.use(cors());
app.use(express.json());

//Routes

app.post("/new-entry", async (req, res) => {
    try {
        const { name, artist, genres, release_date, nr_tracks, duration, listened_date, rating, cover_url } = req.body;
        const newEntry = await pool.query("INSERT INTO album (name, artist, genres, release_date, nr_tracks, duration, listened_date, rating, cover_url) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)",
            [name, artist, genres, release_date, nr_tracks, duration, listened_date, rating, cover_url]
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});