
function Pagination({ currentPage, totalPages, onPageChange, nextLabel = "Next", prevLabel = "Previous", className }) {
  const goToNextPage = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  return (
    <div style={{marginTop:"32px", marginBottom:"48px"}}>

    <div className={`pagination-controls ${className}`}>
      <button onClick={goToPreviousPage} disabled={currentPage === 1}>
        <p>{prevLabel}</p>

      </button>

      <div style={{marginTop:"2px"}}>
      <p style={{fontSize:"16px"}}>Page <span style={{color:"#ff7b00", fontWeight:"600", fontSize:"16px"}}>{currentPage}</span> of {totalPages}</p>
      </div>

      <button onClick={goToNextPage} disabled={currentPage === totalPages}>
        <p>{nextLabel}</p>

      </button>
    </div>
    </div>
  );
}

export default Pagination;
