import React, {useState} from "react";

export default function NewEntryAlbum() {
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
      };

    const handleLogin = async () => {
        const response = await fetch('https://the-consoomer-backend.onrender.com/login', {
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
    const [listened_date, setListenedDate] = useState("");
    const [rating, setRating] = useState("");
    const [review, setReview] = useState("");

    const onSubmitForm = async(e) => {
        e.preventDefault();

        try {

            const body = {name, artist, listened_date, rating, review};
            console.log("Request body:", body);

            const response = await fetch("https://the-consoomer-backend.onrender.com/new-entry-album", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            });

            console.log("Full response:", response); // Log the entire response object
            console.log("Response status:", response.status); // Log the response status

            if (response.ok) {
                setName("");
                setArtist("");
                setListenedDate("");
                setRating("");
                setReview("");
    
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
            <div className='text-center'>
            <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter password"
                className='input input-bordered w-full max-w-xs my-5'
            />
            <br></br>
            <button onClick={handleLogin} >Submit</button>
            </div>
        );
        }

    return (
        <>
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
            <p>Listened date:</p>
            <input
                className ="input input-bordered w-full max-w-xs"
                type="date"
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
            <p>Review:</p>
            <input
                className ="input input-bordered w-full max-w-xs"
                type="text"
                value={review}
                onChange={e => setReview(e.target.value)}>
            </input>
            <br />
            <button className="btn btn-success">Add</button>
        </form>
        </>
    )
}