import React from 'react';

export const Tooltip = ({ children, text, className }) => (
    <div className={`tooltip ${className || ''}`}>
        {children}
        <span className="tooltiptext">{text}</span>
    </div>
);