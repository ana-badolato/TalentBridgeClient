import searchImg from "../assets/icons/search.svg"

function SearchBar(props) {
  const { searchValue, setSearchValue } = props;

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <div className="search-container">
      <label htmlFor="">Search</label>
      <div className="searchBar custom-width">
        <input
          placeholder="Introduce your search here"
          className="filter"
          onChange={handleSearchChange}
          value={searchValue}
        />
        <div className="search-icon">
          <img src={searchImg} alt="search icon" />
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
