function NewEvent() {
  return (
    <div>
      <form action="">
        <div>
          <label htmlFor="">Title</label>
          <input type="text" />
        </div>

        <div>
          <label htmlFor="">Main Objective</label>
          <textarea type="text" maxLength={250} />
        </div>

        <div>
          <label htmlFor="">Description</label>
          <textarea maxLength={2000} />
        </div>

        <div>
          <label htmlFor="">Date</label>
          <input type="date" />
        </div>

        <div>
          <label htmlFor="">Time</label>
          <input type="time" />
        </div>

        <div>
          <label htmlFor="">Adress</label>
          <input type="text" />
        </div>

        <div>
          <label htmlFor="">Location</label>
          <input type="text" />
        </div>

        <div>
          <label htmlFor="">Category</label>
          <select>
            <option value="" disabled>Select a Category</option>
            <option value="Technology & Innovation">Technology & Innovation</option>
            <option value="Sustainability & Environment">Sustainability & Environment</option>
            <option value="Art & Creativity">Art & Creativity</option>
            <option value="Health & Wellness">Health & Wellness</option>
            <option value="Education & Training">Education & Training</option>
            <option value="Community & Social Impact">Community & Social Impact</option>
          </select>
        </div>

        <div>
          <label htmlFor="">Capacity</label>
          <input type="number" />
        </div>

        <div>
          <label htmlFor="">Price</label>
          <input type="number" />
        </div>

        <div>
          <label htmlFor="">Poster image</label>
          <input type="text" />
        </div>

        <div>
          <label htmlFor="">Add a lecturer</label>
          <input type="text" />
        </div>

      <button>Create event</button>

      </form>
    </div>
  );
}

export default NewEvent;
