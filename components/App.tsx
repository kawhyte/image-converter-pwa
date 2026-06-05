import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useImageConverter } from "../hooks/useImageConverter";
import { ErrorBoundary } from "./ErrorBoundary";

import FileUpload from "./converter/FileUpload";
import Settings from "./converter/Settings";
import FileList from "./converter/FileList";
import Actions from "./converter/Actions";


const App: React.FC = () => {
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
		cropToFit,
		isConverting,
		conversionProgress,
		convertingFile,
		downloadReady,
		error,
		isZipping,
		fileInputRef,
		addFiles,
		handlePresetSelect,
		handleQualitySliderChange,
		handleWidthChange,
		handleHeightChange,
		handleAspectRatioChange,
		handleCropToggle,
		resetState,
		handleBulkConvert,
		handleDownloadAll,
		handleAiRename,
		allFilesConverted,
	} = useImageConverter();

	return (
		<>
		<ErrorBoundary>
			<TooltipProvider>
				<div className='text-foreground min-h-screen w-full flex flex-col items-center justify-center px-4 py-10 sm:py-14 transition-colors duration-300'>
					<div className='mb-8 sm:mb-10 flex flex-col items-center text-center'>
						<h1 className='font-grotesk mb-4 flex items-center gap-3 text-5xl font-bold leading-none tracking-tight text-foreground sm:text-6xl md:text-7xl'>
							<span>ImageRocket</span>
							<div className='hidden sm:flex'>
								<Image
									src='/icons/Rocket.gif'
									unoptimized
									alt='Logo'
									width={80}
									height={48}
								/>
							</div>
						</h1>
						<p className='max-w-md text-center text-lg font-normal leading-relaxed text-foreground/50 sm:text-xl'>
							Shrink your images. Speed up your site.
						</p>
					</div>

					<div className='background-gradient-container'>
						<div className='blur-filter'>
							<div className='ellipse ellipse-1'></div>

							<div className='ellipse ellipse-2'></div>
							<div className='ellipse ellipse-3'></div>
							<div className='ellipse ellipse-4'></div>
						</div>
					</div>
					<div className='w-full max-w-4xl mx-auto relative'>
						<Card className='w-full transition-all duration-150 ease-in-out rounded-3xl border border-muted-foreground/20 text-base shadow-xl focus-within:border-foreground/20 hover:border-foreground/10 focus-within:hover:border-foreground/20 bg-slate-900'>
							<CardContent className='pt-6'>
								<FileUpload fileInputRef={fileInputRef} addFiles={addFiles} />

								{error && (
									<p className='text-destructive text-sm mt-4 text-center whitespace-pre-wrap'>
										{error}
									</p>
								)}

								{files.length > 0 && (
									<div className='mt-6'>
										<Settings
											selectedPreset={selectedPreset}
											handlePresetSelect={handlePresetSelect}
											quality={quality}
											handleQualitySliderChange={handleQualitySliderChange}
											customWidth={customWidth}
											handleWidthChange={handleWidthChange}
											customHeight={customHeight}
											handleHeightChange={handleHeightChange}
											handleAspectRatioChange={handleAspectRatioChange}
											cropToFit={cropToFit}
											handleCropToggle={handleCropToggle}
										/>

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
										{isConverting && (
											<Progress value={conversionProgress} className='mt-4' />
										)}
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

		
		</ErrorBoundary>



	</>
	);
};

export default App;
