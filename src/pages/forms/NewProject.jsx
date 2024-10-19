import Autocomplete from "../../components/Autocomplete";

function NewProject() {
  return (
    <div>
      <form action="">
        <div>
          <label htmlFor="">Title</label>
          <input type="text"/>
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
          <label htmlFor="">Location</label>
          <input type="text" />
        </div>

        <div>
          <label htmlFor="">Starting date</label>
          <input type="date" />
        </div>

        <div>
          <label htmlFor="">Image</label>
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
          <label htmlFor="">Owner</label>
          <input type="text" />
        </div>

        <div>
          {<Autocomplete/>}
        </div>

      <button>New project</button>

      </form>
    </div>
  );
}

export default NewProject;
