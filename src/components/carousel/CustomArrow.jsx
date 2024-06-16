import React from 'react';
import './arrow.css'

const CustomArrow = ({ className, style, onClick, direction }) => {
  return (
    <div
      className={`${className} custom-arrow ${direction === 'next' ? 'next-arrow' : 'prev-arrow'}`}
      style={{ ...style, display: 'block' }}
      onClick={onClick}
    />
  );
};

export default CustomArrow;
