import React from 'react';

export const Slider = ({ className, ...props }) => <input type="range" className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 ${className}`} {...props} />;