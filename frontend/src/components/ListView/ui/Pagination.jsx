import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const Pagination = ({ apiEndpoint, onPageChange, className = '', ...props }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPaginationData = async () => {
      try {
        const response = await fetch(`${apiEndpoint}?page=${currentPage}&limit=5`);
        if (!response.ok) throw new Error('Failed to fetch pagination data');
        const data = await response.json();
        
        setTotalPages(data.totalPages); // Ensure API returns total pages
      } catch (error) {
        console.error('Error fetching pagination data:', error);
      }
    };

    fetchPaginationData();
  }, [apiEndpoint, currentPage]);

  const getPageNumbers = () => {
    const pageNumbers = [];
    pageNumbers.push(1);

    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    if (startPage > 2) pageNumbers.push('...');
    for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
    if (endPage < totalPages - 1) pageNumbers.push('...');
    if (totalPages > 1) pageNumbers.push(totalPages);

    return pageNumbers;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center ${className}`} {...props}>
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={`p-1 rounded-lg ${currentPage === 1 ? 'text-[#a0a0a0] cursor-not-allowed' : 'text-[#232323] hover:bg-[#f7f2fb]'}`}
        aria-label="Previous page"
      >
        <img src="/images/img_actions_arrowdown.svg" alt="Previous" className="w-4 h-4 transform rotate-90" />
      </button>
      
      <div className="flex items-center mx-2">
        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="px-2 text-[#6d7194]">...</span>
            ) : (
              <button
                onClick={() => {
                  setCurrentPage(page);
                  onPageChange(page);
                }}
                className={`w-8 h-8 mx-1 rounded-lg text-sm ${currentPage === page ? 'bg-[#652995] text-white' : 'text-[#232323] hover:bg-[#f7f2fb]'}`}
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
        className={`p-1 rounded-lg ${currentPage === totalPages ? 'text-[#a0a0a0] cursor-not-allowed' : 'text-[#232323] hover:bg-[#f7f2fb]'}`}
        aria-label="Next page"
      >
        <img src="/images/img_actions_arrowdown_16x16.svg" alt="Next" className="w-4 h-4 transform -rotate-90" />
      </button>
    </div>
  );
};

Pagination.propTypes = {
  apiEndpoint: PropTypes.string.isRequired, // API URL
  onPageChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default Pagination;
