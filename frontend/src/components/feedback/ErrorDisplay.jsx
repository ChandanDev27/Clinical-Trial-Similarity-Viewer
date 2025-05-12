import React from 'react';
import PropTypes from 'prop-types';

const ErrorDisplay = ({ message }) => (
  <div className="min-h-screen bg-[#f7f2fb] flex items-center justify-center">
    <div className="text-red-500">
      <svg className="h-8 w-8 mr-3 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {message || 'An error occurred while loading trials'}
    </div>
  </div>
);

ErrorDisplay.propTypes = {
  message: PropTypes.string
};

export default ErrorDisplay;
