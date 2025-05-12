import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const Pagination = ({ 
  apiEndpoint, 
  onPageChange, 
  className = '', 
  itemsPerPageOptions = [5, 8, 10, 15],
  ...props 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaginationData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${apiEndpoint}?page=${currentPage}&limit=${itemsPerPage}`);
        if (!response.ok) throw new Error('Failed to fetch pagination data');
        const data = await response.json();
        
        setTotalPages(data.totalPages);
        if (currentPage > data.totalPages) {
          setCurrentPage(Math.max(1, data.totalPages));
        }
      } catch (err) {
        console.error('Error fetching pagination data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaginationData();
  }, [apiEndpoint, currentPage, itemsPerPage]);

  const handleItemsPerPageChange = (e) => {
    const value = Number(e.target.value);
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    if (totalPages <= 1) return [1];
    
    const pageNumbers = [];
    const visiblePages = 3; // Number of pages to show around current page
    
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
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      onPageChange(newPage);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      onPageChange(newPage);
    }
  };

  if (totalPages <= 1 && !isLoading) return null;

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between ${className}`} {...props}>
      {error && (
        <div className="text-red-500 text-sm mb-2 sm:mb-0">
          {error}
        </div>
      )}
      
      <div className="flex items-center mb-2 sm:mb-0">
        <select 
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className="mr-4 p-1 border rounded text-sm"
          disabled={isLoading}
        >
          {itemsPerPageOptions.map(option => (
            <option key={option} value={option}>
              {option} per page
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex items-center">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1 || isLoading}
          className={`p-2 rounded-lg ${currentPage === 1 || isLoading ? 'text-gray-400 cursor-not-allowed' : 'text-[#232323] hover:bg-[#f7f2fb]'}`}
          aria-label="Previous page"
        >
          {/* Consider using an inline SVG or imported icon */}
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
                  onClick={() => {
                    if (!isLoading) {
                      setCurrentPage(page);
                      onPageChange(page);
                    }
                  }}
                  disabled={isLoading}
                  className={`w-8 h-8 mx-1 rounded-lg text-sm ${currentPage === page 
                    ? 'bg-[#652995] text-white' 
                    : 'text-[#232323] hover:bg-[#f7f2fb]'} ${isLoading ? 'opacity-50' : ''}`}
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
          disabled={currentPage === totalPages || isLoading}
          className={`p-2 rounded-lg ${currentPage === totalPages || isLoading ? 'text-gray-400 cursor-not-allowed' : 'text-[#232323] hover:bg-[#f7f2fb]'}`}
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
  apiEndpoint: PropTypes.string.isRequired,
  onPageChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  itemsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
};

export default Pagination;
