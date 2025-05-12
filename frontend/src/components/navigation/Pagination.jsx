import React from 'react';
import PropTypes from 'prop-types';

const Pagination = ({ 
  currentPage,
  itemsPerPage,
  totalPages,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
  className = '',
  itemsPerPageOptions = [5, 8, 10, 15]
}) => {
  const handleItemsPerPageChange = (e) => {
    onItemsPerPageChange(Number(e.target.value));
  };

  const getPageNumbers = () => {
    if (totalPages <= 1) return [1];
    
    const pageNumbers = [];
    const visiblePages = 3;
    
    pageNumbers.push(1);

    let startPage = Math.max(2, currentPage - Math.floor(visiblePages/2));
    let endPage = Math.min(totalPages - 1, currentPage + Math.floor(visiblePages/2));

    if (startPage > 2) pageNumbers.push('...');
    for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
    if (endPage < totalPages - 1) pageNumbers.push('...');
    if (totalPages > 1) pageNumbers.push(totalPages);

    return pageNumbers;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between ${className}`}>
      <div className="flex items-center mb-2 sm:mb-0">
        <select 
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className="mr-4 p-1 border rounded text-sm"
        >
          {itemsPerPageOptions.map(option => (
            <option key={option} value={option}>
              {option} per page
            </option>
          ))}
        </select>
        <span className="text-sm text-[#6d7194]">
          Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
        </span>
      </div>
      
      <div className="flex items-center">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-[#232323] hover:bg-[#f7f2fb]'}`}
          aria-label="Previous page"
        >
          <svg className="w-4 h-4 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        
        <div className="flex items-center mx-2">
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-2 text-[#6d7194]">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page)}
                  className={`w-8 h-8 mx-1 rounded-lg text-sm ${currentPage === page 
                    ? 'bg-[#652995] text-white' 
                    : 'text-[#232323] hover:bg-[#f7f2fb]'}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
        
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-[#232323] hover:bg-[#f7f2fb]'}`}
          aria-label="Next page"
        >
          <svg className="w-4 h-4 transform -rotate-90" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onItemsPerPageChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  itemsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
};

export default Pagination;
