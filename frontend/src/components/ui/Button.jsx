import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  className = '',
  type = 'button',
  animate = false, // Added animation prop
  ...props 
}) => {
  const baseClasses = 'font-medium rounded-lg transition-colors duration-200 focus:outline-none';

  const variants = {
  primary: 'border border-[#652995] text-[#652995] hover:border-[#4e1d73] disabled:border-[#a78eba] bg-transparent',
  secondary: 'border border-[#e9eaef] text-[#232323] hover:border-[#f7f7f7] disabled:border-[#a0a0a0] bg-transparent',
  outline: 'border border-[#652995] text-[#652995] hover:bg-[#f9f5fc] disabled:border-[#a78eba] bg-transparent',
};

  const sizes = {
    small: 'px-3 py-1 text-xs',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base',
  };

  // Add animation effect if enabled
  const animationClass = animate ? 'transition-all duration-200 transform hover:scale-105' : '';

  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${
    disabled ? 'cursor-not-allowed' : ''
  } ${animationClass} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  animate: PropTypes.bool, // Added animation prop validation
};

export default Button;
