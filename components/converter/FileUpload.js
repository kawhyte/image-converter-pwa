import React from 'react';
import { Input } from "@/components/ui/input";

export const FileUpload = ({ fileInputRef, addFiles }) => {
    const handleDrop = (e) => {
        e.preventDefault(); e.stopPropagation();
        e.currentTarget.classList.remove('border-primary');
        if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
    };
    const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
    const handleDragEnter = (e) => { e.preventDefault(); e.stopPropagation(); e.currentTarget.classList.add('border-primary'); };
    const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); e.currentTarget.classList.remove('border-primary'); };
    const handleFileChange = (e) => { if (e.target.files) addFiles(e.target.files); };

    return (
        <div
            className="w-full border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 hover:border-primary/80 bg-card"
            onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current.click()}
        >
            <Input type="file" ref={fileInputRef} className="hidden" accept="image/jpeg,image/png,image/gif,image/bmp" onChange={handleFileChange} multiple />
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-muted-foreground mb-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
            <p className="text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop files</p>
            <p className="text-xs text-muted-foreground mt-1">Bulk conversion is supported</p>
        </div>
    );
};