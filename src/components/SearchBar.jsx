
function SearchBar(props) {
  
  const { searchValue, setSearchValue } = props

   const handleSearchChange = (e) =>{
     setSearchValue(e.target.value)
   }
  
  return (
    <div>
      <input onChange={handleSearchChange} value={searchValue}/>
    </div>
  )
}

export default SearchBar