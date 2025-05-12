import React from 'react';
import PropTypes from 'prop-types';

const Checkbox = ({ 
  checked, 
  onChange, 
  label, 
  id, 
  name,
  disabled = false,
  className = '',
  ...props 
}) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative flex items-center">
        <input
          type="checkbox"
          id={checkboxId}
          name={name}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="opacity-0 absolute h-4 w-4 cursor-pointer"
          {...props}
        />
        <div 
          className={`w-4 h-4 rounded flex items-center justify-center border ${
            checked 
              ? 'bg-[#652995] border-[#652995]' 
              : 'border-[#e9eaef] bg-white'
          } ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          {checked && (
            <svg 
              width="10" 
              height="8" 
              viewBox="0 0 10 8" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M1 4L3.5 6.5L9 1" 
                stroke="white" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>
      {label && (
        <label 
          htmlFor={checkboxId} 
          className={`ml-2 text-sm ${disabled ? 'text-gray-400 cursor-not-allowed' : 'text-[#232323] cursor-pointer'}`}
        >
          {label}
        </label>
      )}
    </div>
  );
};

Checkbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.node,
  id: PropTypes.string,
  name: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default Checkbox;