import React from 'react';
import { FileItem } from './FileItem';

export const FileList = ({ files, conversionResults, previewResults, aiFileNames, isNaming, namingTimer, convertingFile, handleAiRename }) => (
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