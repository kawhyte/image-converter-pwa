import React from 'react';
import { formatBytes } from '../../lib/utils';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export const FileItem = ({ file, result, preview, aiFileName, isNaming, namingTimer, convertingFile, handleAiRename }) => {
    const displaySize = result ? result.convertedSize : (preview ? preview.convertedSize : null);
    const displayName = aiFileName ? `${aiFileName}.webp` : file.name;
    const objectUrl = URL.createObjectURL(file);

    return (
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3 overflow-hidden">
                <img src={objectUrl} alt={file.name} className="w-12 h-12 object-cover rounded-md shrink-0" onLoad={() => URL.revokeObjectURL(objectUrl)} />
                <div className="overflow-hidden">
                    <p className="text-sm font-medium truncate">{displayName}</p>
                    <p className="text-xs text-muted-foreground">
                        {formatBytes(file.size)}
                        {displaySize !== null && (
                            <>
                                <span className="mx-1">→</span>
                                <span className={result ? 'font-bold' : ''}>
                                    {result ? '' : 'Est. '}{formatBytes(displaySize)}
                                </span>
                            </>
                        )}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                {isNaming === file.name && (
                    <div className="flex items-center justify-center h-8 w-24 text-sm text-green-500 font-semibold tabular-nums">
                        ✨ {namingTimer}s
                    </div>
                )}
                {convertingFile === file.name && !result && (
                    <div className="flex items-center justify-center h-8 w-24 text-sm text-primary font-semibold">
                        Converting...
                    </div>
                )}
                {isNaming !== file.name && convertingFile !== file.name && (
                    <>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button size="icon" variant="ghost" onClick={() => handleAiRename(file)} disabled={isNaming !== null} className="h-8 w-8">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/><path d="m15 5 3 3"/></svg>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Rename with AI</p>
                            </TooltipContent>
                        </Tooltip>
                        {result && (
                            <a href={result.webpDataUrl} download={`${displayName.split('.').slice(0, -1).join('.')}.webp`}>
                                <Button size="sm" variant="outline">Save</Button>
                            </a>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};