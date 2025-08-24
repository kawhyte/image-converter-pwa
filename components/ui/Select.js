import React from 'react';

export const Select = ({ className, children, ...props }) => (
    <div className="relative w-full">
        <select className={`appearance-none h-9 w-full rounded-md border border-input bg-transparent pl-3 pr-8 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props}>{children}</select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-foreground"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg></div>
    </div>
);