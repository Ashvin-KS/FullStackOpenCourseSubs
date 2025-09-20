const Filter = ({ searchQuery, handleSearchQueryChange }) => {
  return (
    <div>
      filter shown with <input value={searchQuery} onChange={handleSearchQueryChange} />
    </div>
  )
}

export default Filter