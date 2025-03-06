export default function AlbumList() {

    const albums = [
        {id: "1", name: "Filantropica", directors: "Nae Caranfil", genres: "Satire, Comedy", release_date:"2002", duration:"14m:49s", watched_date:"3/17/2024", rating:"7,0"},
        {id: "2", name: "Repulsion", directors: "Roman Polanski", genres: "Drama", release_date:"1965", duration:"1h:45m", watched_date:"3/17/2024", rating:"7,0"}
    ]

    return (
        <>
        <div className="overflow-x-auto mt-10">
        <table className="table">
            {/* head */}
            <thead>
            <tr>
                <th></th>
                <th>Name</th>
                <th>Directors</th>
                <th>Genres</th>
                <th>Release date</th>
                <th>Duration</th>
                <th>Watched date</th>
                <th>Rating</th>
            </tr>
            </thead>
            <tbody>
            {albums.map((album) => (
                <tr>
                <th>{album.id}</th>
                <td>{album.name}</td>
                <td>{album.directors}</td>
                <td>{album.genres}</td>
                <td>{album.release_date}</td>
                <td>{album.duration}</td>
                <td>{album.watched_date}</td>
                <td>{album.rating}</td>
                <td>
                    <button className="btn btn-secondary">Change</button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
        </>
    )
}