import React from 'react';
import FileItem from './FileItem';

interface FileListProps {
  files: File[];
  conversionResults: Record<string, any>;
  previewResults: Record<string, any>;
  aiFileNames: Record<string, string>;
  isNaming: string | null;
  namingTimer: number;
  convertingFile: string | null;
  handleAiRename: (file: File) => void;
}

const FileList: React.FC<FileListProps> = ({ 
  files, 
  conversionResults, 
  previewResults, 
  aiFileNames, 
  isNaming, 
  namingTimer, 
  convertingFile, 
  handleAiRename 
}) => (
  <div className="space-y-4 max-h-72 file-list-container">
    {files.map(file => (
      <FileItem
        key={file.name}
        file={file}
        result={conversionResults[file.name]}
        preview={previewResults[file.name]}
        aiFileName={aiFileNames[file.name]}
        isNaming={isNaming}
        namingTimer={namingTimer}
        convertingFile={convertingFile}
        handleAiRename={handleAiRename}
      />
    ))}
  </div>
);

export default FileList;
