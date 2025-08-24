import React from 'react';

export const ProgressBar = ({ progress }) => (
    <div className="w-full bg-muted rounded-full h-2.5 mb-4">
        <div className="bg-primary h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
    </div>
);