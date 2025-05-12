import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const Dropdown = ({
  apiEndpoint, // Backend URL passed as a prop
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  className = '',
  dropdownIcon = '/images/img_fichevrondown.svg',
  ...props
}) => {
  const [options, setOptions] = useState([]); // Stores fetched options
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch(apiEndpoint);
        if (!response.ok) throw new Error('Failed to fetch options');
        const data = await response.json();
        setOptions(data);
      } catch (error) {
        console.error('Error fetching dropdown options:', error);
      }
    };

    fetchOptions();
  }, [apiEndpoint]);

  const selectedOption = options.find(option => option.value === value);

  const toggleDropdown = () => {
    if (!disabled) setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`} {...props}>
      <div
        onClick={toggleDropdown}
        className={`flex items-center justify-between px-3 py-2 bg-white border ${
          isOpen ? 'border-[#652995]' : 'border-[#e9eaef]'
        } rounded-lg cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span className={`text-sm ${selectedOption ? 'text-[#232323]' : 'text-[#6d7194]'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <img src={dropdownIcon} alt="Dropdown" className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-[#e9eaef] rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleOptionClick(option)}
              className={`px-3 py-2 text-sm cursor-pointer hover:bg-[#f7f2fb] ${
                option.value === value ? 'bg-[#f7f2fb] text-[#652995]' : 'text-[#232323]'
              }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

Dropdown.propTypes = {
  apiEndpoint: PropTypes.string.isRequired, // API URL
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  dropdownIcon: PropTypes.string,
};

export default Dropdown;
