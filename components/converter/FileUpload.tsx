
import React from 'react';
import { Input } from "@/components/ui/input";

interface Props {
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    addFiles: (files: FileList | null) => void;
}

const FileUpload: React.FC<Props> = ({ fileInputRef, addFiles }) => {
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); e.stopPropagation();
        e.currentTarget.classList.remove('border-primary');
        if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
    };
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); };
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); e.currentTarget.classList.add('border-primary'); };
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); e.currentTarget.classList.remove('border-primary'); };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files) addFiles(e.target.files); };

    return (
        <div
            className="w-full border-2 border-dashed border-border rounded-xl p-10 sm:p-14 text-center cursor-pointer transition-all duration-200 hover:border-primary/60 hover:bg-primary/5 bg-card/50"
            onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
        >
            <Input type="file" ref={fileInputRef} className="hidden" accept="image/jpeg,image/png,image/gif,image/bmp,image/webp" onChange={handleFileChange} multiple {...({} as any)} />
            <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-muted-foreground/50 mb-5" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
            <p className="text-muted-foreground text-sm sm:text-base"><span className="font-semibold text-foreground">Click to upload</span> or drag and drop files</p>
            <p className="text-xs text-muted-foreground/70 mt-1.5">JPEG · PNG · GIF · BMP · WebP &nbsp;·&nbsp; Bulk conversion supported</p>
        </div>
    );
};

export default FileUpload;