import Navbar from '../components/Navbar';
import React, {useState} from "react";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://epiwfgsrhgdkouwprbdv.supabase.co', 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwaXdmZ3NyaGdka291d3ByYmR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3NTEyODUsImV4cCI6MjA1NDMyNzI4NX0.7vc1zCiyz-_1BOBz8Ovuh8dV_VlBDfDT3LZFtnN7cRo'
  );

export default function NewEntryTest() {
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
      };

    const handleLogin = async () => {
        const response = await fetch('https://the-consoomer.onrender.com/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        });

        if (response.ok) {
            setIsAuthenticated(true);
        } else {
            alert("Incorrect password");
        }
    };

    const [name, setName] = useState("");
    const [artist, setArtist] = useState("");
    const [genres, setGenres] = useState("");
    const [release_date, setReleaseDate] = useState("");
    const [nr_tracks, setNrTracks] = useState("");
    const [duration, setDuration] = useState("");
    const [listened_date, setListenedDate] = useState("");
    const [rating, setRating] = useState("");
    const [coverFile, setCoverFile] = useState(null);

    // Upload image to Supabase Storage
    const uploadCoverImage = async (file) => {
        const sanitizedFileName = file.name.replace(/\s+/g, "_"); 
        const filePath = `albums/${Date.now()}-${sanitizedFileName}`;

        console.log("Uploading file:", filePath);

        const { data, error } = await supabase.storage
            .from('album-covers')
            .upload(filePath, file);

        if (error) {
        console.error('Image upload failed:', error.message);
        return null;
        }

        console.log("Upload response data:", supabase.storage.from('album-covers').getPublicUrl(data.path));

        if (!data || !data.path) {
            console.error("Upload successful, but no path returned!");
            return null;
        }

        // Extract the correct public URL from the returned object
        const { data: publicUrlData } = supabase.storage.from('album-covers').getPublicUrl(data.path);
        console.log("Generated public URL:", publicUrlData.publicUrl);

        return publicUrlData.publicUrl; // Return just the URL string
    };

    const onSubmitForm = async(e) => {
        e.preventDefault();

        try {
            let cover_url = '';

            // If the user uploaded a file, upload it to Supabase
            if (coverFile) {
            cover_url = await uploadCoverImage(coverFile);
            console.log("Uploaded image URL:", cover_url); // Debugging
            }

            const body = {name, artist, genres, release_date, nr_tracks, duration, listened_date, rating, cover_url};
            console.log("Request body:", body);

            const response = await fetch("https://the-consoomer.onrender.com/new-entry", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            });

            console.log("Full response:", response); // Log the entire response object
            console.log("Response status:", response.status); // Log the response status

            if (response.ok) {
                setName("");
                setArtist("");
                setGenres("");
                setReleaseDate("");
                setNrTracks("");
                setDuration("");
                setListenedDate("");
                setRating("");
                setCoverFile(null);
    
                // Refresh the page if necessary
                window.location.reload();
            }

            console.log("Form reset successfully!");
        } catch (err) {
            console.error('Error adding album:', err.message);
        }
    }

    if (!isAuthenticated) {
        return (
            <div>
            <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter password"
            />
            <button onClick={handleLogin}>Submit</button>
            </div>
        );
        }

    return (
        <>
        <Navbar />
        <p className="text-center">New Entry</p>
        <p>What type of media did u consume?</p>
        <form onSubmit={onSubmitForm}>
            <p>Name:</p>
            <input 
                className ="input input-bordered w-full max-w-xs"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}>
            </input>
            <p>Artist:</p>
            <input
                className ="input input-bordered w-full max-w-xs"
                type="text"
                value={artist}
                onChange={e => setArtist(e.target.value)}>
            </input>
            <p>Genres:</p>
            <input
                className ="input input-bordered w-full max-w-xs"
                type="text"
                value={genres}
                onChange={e => setGenres(e.target.value)}>
            </input>
            <p>Release date:</p>
            <input
                className ="input input-bordered w-full max-w-xs"
                type="text"
                value={release_date}
                onChange={e => setReleaseDate(e.target.value)}>
            </input>
            <p>Nr of tracks:</p>
            <input
                className ="input input-bordered w-full max-w-xs"
                type="text"
                value={nr_tracks}
                onChange={e => setNrTracks(e.target.value)}>
            </input>
            <p>Duration:</p>
            <input
                className ="input input-bordered w-full max-w-xs"
                type="text"
                value={duration}
                onChange={e => setDuration(e.target.value)}>
            </input>
            <p>Listened date:</p>
            <input
                className ="input input-bordered w-full max-w-xs"
                type="text"
                value={listened_date}
                onChange={e => setListenedDate(e.target.value)}>
            </input>
            <p>Rating:</p>
            <input
                className ="input input-bordered w-full max-w-xs"
                type="text"
                value={rating}
                onChange={e => setRating(e.target.value)}>
            </input>
            <p>Album Cover:</p>
            <input
                className="input input-bordered w-full max-w-xs"
                type="file"
                accept="image/*"
                onChange={(e) => setCoverFile(e.target.files[0])}>
            </input>
            <br />
            <button className="btn btn-success">Add</button>
        </form>
        </>
    )
}