function Filter(props) {
  const { categoryFilter, setCategoryFilter } = props;
  const categories = [
    "All Categories",
    "Technology & Innovation",
    "Sustainability & Environment",
    "Art & Creativity",
    "Health & Wellness",
    "Education & Training",
    "Community & Social Impact"
  ];

  const handleSelect = (event) => {
    setCategoryFilter(event.target.value);
  };

  return (
    <div className="filter-container">
      <label htmlFor="">Filter by Category</label>
      <select
        className="filter"
        value={categoryFilter}
        onChange={handleSelect}
      >
        {categories.map((eachCategory, i) => (
          <option key={i} value={eachCategory}>
            {eachCategory}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Filter;
