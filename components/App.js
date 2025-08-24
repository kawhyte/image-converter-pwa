import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useImageConverter } from '../hooks/useImageConverter';
import { Header } from './converter/Header';
import { FileUpload } from './converter/FileUpload';
import { Settings } from './converter/Settings';
import { FileList } from './converter/FileList';
import { Actions } from './converter/Actions';

export function App() {
  const {
    files,
    aiFileNames,
    isNaming,
    namingTimer,
    conversionResults,
    previewResults,
    selectedPreset,
    quality,
    customWidth,
    customHeight,
    isConverting,
    conversionProgress,
    convertingFile,
    downloadReady,
    error,
    isZipping,
    fileInputRef,
    addFiles,
    handlePresetChange,
    handleQualitySliderChange,
    handleWidthChange,
    handleHeightChange,
    handleAspectRatioChange,
    resetState,
    handleBulkConvert,
    handleDownloadAll,
    handleAiRename,
    allFilesConverted,
  } = useImageConverter();

  return (
    <TooltipProvider>
      <div className="text-foreground min-h-screen w-full flex items-center justify-center p-4 transition-colors duration-300">
        <div className="background-gradient-container">
            <div className="blur-filter">
                <div className="ellipse ellipse-1"></div>
                <div className="ellipse ellipse-2"></div>
                <div className="ellipse ellipse-3"></div>
                <div className="ellipse ellipse-4"></div>
            </div>
        </div>
        <div className="w-full max-w-4xl mx-auto relative">
          <Card className="w-full transition-all duration-150 ease-in-out rounded-3xl border border-muted-foreground bg-muted text-base shadow-xl focus-within:border-foreground/20 hover:border-foreground/10 focus-within:hover:border-foreground/20">
            <Header />
            <CardContent>
              <FileUpload fileInputRef={fileInputRef} addFiles={addFiles} />

              {error && <p className="text-destructive text-sm mt-4 text-center whitespace-pre-wrap">{error}</p>}

              {files.length > 0 && (
                <div className="mt-6">
                  <Settings
                      selectedPreset={selectedPreset}
                      handlePresetChange={handlePresetChange}
                      quality={quality}
                      handleQualitySliderChange={handleQualitySliderChange}
                      customWidth={customWidth}
                      handleWidthChange={handleWidthChange}
                      customHeight={customHeight}
                      handleHeightChange={handleHeightChange}
                      handleAspectRatioChange={handleAspectRatioChange}
                  />

                  {isConverting && <Progress value={conversionProgress} />}

                  <FileList
                      files={files}
                      conversionResults={conversionResults}
                      previewResults={previewResults}
                      aiFileNames={aiFileNames}
                      isNaming={isNaming}
                      namingTimer={namingTimer}
                      convertingFile={convertingFile}
                      handleAiRename={handleAiRename}
                  />
                  <Actions
                      handleBulkConvert={handleBulkConvert}
                      isConverting={isConverting}
                      files={files}
                      conversionProgress={conversionProgress}
                      allFilesConverted={allFilesConverted}
                      handleDownloadAll={handleDownloadAll}
                      isZipping={isZipping}
                      downloadReady={downloadReady}
                      resetState={resetState}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}