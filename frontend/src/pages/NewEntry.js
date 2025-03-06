import "cally";
import Navbar from '../components/Navbar';

function SetContent() {
    if (document.getElementById('album').checked) {
      document.getElementById('form').innerHTML = `
      <p>Name:</p>
      <input type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
      <p>Artist:</p>
      <input type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
      <p>Genres:</p>
      <input type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
      <p>Release date:</p>
      <input type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
      <p>Nr of tracks:</p>
      <input type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
      <p>Duration:</p>
      <input type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
      <p>Listened date:</p>
      <input type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
      <p>Rating:</p>
      <div class="rating rating-lg rating-half">
      <input type="radio" name="rating-11" class="rating-hidden" />
      <input type="radio" name="rating-11" class="mask mask-star-2 mask-half-1 bg-green-500" aria-label="0.5 star" />
      <input type="radio" name="rating-11" class="mask mask-star-2 mask-half-2 bg-green-500" aria-label="1 star" />
      <input type="radio" name="rating-11" class="mask mask-star-2 mask-half-1 bg-green-500" aria-label="1.5 star" defaultChecked />
      <input type="radio" name="rating-11" class="mask mask-star-2 mask-half-2 bg-green-500" aria-label="2 star" />
      <input type="radio" name="rating-11" class="mask mask-star-2 mask-half-1 bg-green-500" aria-label="2.5 star" />
      <input type="radio" name="rating-11" class="mask mask-star-2 mask-half-2 bg-green-500" aria-label="3 star" />
      <input type="radio" name="rating-11" class="mask mask-star-2 mask-half-1 bg-green-500" aria-label="3.5 star" />
      <input type="radio" name="rating-11" class="mask mask-star-2 mask-half-2 bg-green-500" aria-label="4 star" />
      <input type="radio" name="rating-11" class="mask mask-star-2 mask-half-1 bg-green-500" aria-label="4.5 star" />
      <input type="radio" name="rating-11" class="mask mask-star-2 mask-half-2 bg-green-500" aria-label="5 star" />
      <input type="radio" name="rating-11" class="mask mask-star-2 mask-half-1 bg-green-500" aria-label="5.5 star" />
      <input type="radio" name="rating-11" class="mask mask-star-2 mask-half-2 bg-green-500" aria-label="6 star" />
      <input type="radio" name="rating-11" class="mask mask-star-2 mask-half-1 bg-green-500" aria-label="6.5 star"/>
      <input type="radio" name="rating-11" class="mask mask-star-2 mask-half-2 bg-green-500" aria-label="7 star" />
      <input type="radio" name="rating-11" class="mask mask-star-2 mask-half-1 bg-green-500" aria-label="7.5 star" />
      <input type="radio" name="rating-11" class="mask mask-star-2 mask-half-2 bg-green-500" aria-label="8 star" />
      <input type="radio" name="rating-11" class="mask mask-star-2 mask-half-1 bg-green-500" aria-label="8.5 star" />
      <input type="radio" name="rating-11" class="mask mask-star-2 mask-half-2 bg-green-500" aria-label="9 star" />
      <input type="radio" name="rating-11" class="mask mask-star-2 mask-half-1 bg-green-500" aria-label="9.5 star" />
      <input type="radio" name="rating-11" class="mask mask-star-2 mask-half-2 bg-green-500" aria-label="10 star" />
      </div>
      `;
    } else if (document.getElementById('film').checked) {
      document.getElementById('form').innerHTML = "Key Element I-A is met.";
    }
  }

export default function NewEntry() {
  return (
    <>
        <Navbar />
        <p className="text-center">New Entry</p>
        <p>What type of media did u consume?</p>
        <br></br>
        <div className="mb-3">
            <input type="radio" name="radio-10" className="radio align-middle" id="album" onChange={SetContent}/>
            <span className="label-text ml-3">Album</span>
        </div>
        <div className="mb-3">
            <input type="radio" name="radio-10" className="radio align-middle" id="film" onChange={SetContent}/>
            <span className="label-text ml-3">Film</span>
        </div>
        <div className="mb-3">
            <input type="radio" name="radio-10" className="radio align-middle" id="book" onChange={SetContent}/>
            <span className="label-text ml-3">Book</span>
        </div>
        <div id="form"></div>
    </>
  );
}