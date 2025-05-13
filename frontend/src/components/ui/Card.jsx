import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl p-6 border border-[#e9eaef] ${className}`}>
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Card;
