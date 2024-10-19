import React from 'react'

function Filter(props) {

  const {categoryFilter, setCategoryFilter} = props
  const categories = ["All", "Technology & Innovation", "Sustainability & Environment", "Art & Creativity", "Health & Wellness", "Education & Training", "Community & Social Impact" ]

  const handleSelect = (event) =>{
    setCategoryFilter(event.target.value)
  }

  return (
    <div>
      <select value={categoryFilter} onChange={handleSelect}>
        {categories.map((eachCategory, i) =>(
          <option key={i} value={eachCategory}>
              {eachCategory}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Filter