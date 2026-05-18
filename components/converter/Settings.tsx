import React from "react";
import { presets, aspectRatios, PRESET_GROUPS } from "../../lib/utils";
import type { PresetGroup } from "../../lib/utils";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
	selectedPreset: string;
	handlePresetSelect: (key: string) => void;
	quality: number;
	handleQualitySliderChange: (values: number[]) => void;
	customWidth: number | "";
	handleWidthChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	customHeight: number | "";
	handleHeightChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	handleAspectRatioChange: (ratio: number) => void;
}

function presetDimensionLabel(key: string): string {
	const p = presets[key];
	if (!p) return '';
	if (p.cropMode === 'exact' && p.width && p.height) {
		return `${p.width} × ${p.height}`;
	}
	if (p.cropMode === 'resize' && p.maxEdge) {
		return `max ${p.maxEdge}px`;
	}
	return 'Custom';
}

const Settings: React.FC<Props> = ({
	selectedPreset,
	handlePresetSelect,
	quality,
	handleQualitySliderChange,
	customWidth,
	handleWidthChange,
	customHeight,
	handleHeightChange,
	handleAspectRatioChange,
}) => {
	const currentPreset = presets[selectedPreset];
	const isCustom = selectedPreset === 'custom';

	return (
		<TooltipProvider>
			<div className="p-5 border rounded-2xl mb-6 bg-card space-y-5">

				{/* Preset Groups */}
				<div>
					<Label className="text-muted-foreground mb-3 block text-sm font-semibold uppercase tracking-wide">
						Optimization Preset
					</Label>
					<div className="space-y-4">
						{PRESET_GROUPS.map(({ key: groupKey, label }) => {
							const groupPresets = Object.entries(presets).filter(
								([, p]) => p.group === (groupKey as PresetGroup)
							);
							if (groupPresets.length === 0) return null;
							return (
								<div key={groupKey}>
									<p className="text-sm text-muted-foreground mb-2 font-semibold">{label}</p>
									<div className="flex flex-wrap gap-2">
										{groupPresets.map(([key, preset]) => {
											const isSelected = selectedPreset === key;
											const isPng = preset.outputFormat === 'png';
											return (
												<Tooltip key={key}>
													<TooltipTrigger asChild>
														<button
															onClick={() => handlePresetSelect(key)}
															className={`inline-flex flex-col items-start px-3 py-2.5 rounded-lg border text-left transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
																isSelected
																	? 'border-primary bg-primary/10 text-foreground'
																	: 'border-border bg-card/50 text-muted-foreground hover:border-primary/50 hover:text-foreground'
															}`}
														>
															<span className="font-semibold text-sm leading-snug">{preset.name}</span>
															<span className="flex items-center gap-1.5 mt-1">
																<span className="text-xs opacity-80">{presetDimensionLabel(key)}</span>
																<span className={`text-[11px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wide ${isPng ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>
																	{preset.outputFormat}
																</span>
															</span>
														</button>
													</TooltipTrigger>
													<TooltipContent side="bottom" className="max-w-[220px] text-sm">
														<p>{preset.description}</p>
													</TooltipContent>
												</Tooltip>
											);
										})}
									</div>
								</div>
							);
						})}
					</div>
				</div>

				{/* Quality Slider — always visible */}
				<div>
					<Label className="mb-2 block text-sm" htmlFor="quality">
						Quality:{" "}
						<span className="font-bold text-foreground text-base">{quality}</span>
						{!isCustom && (
							<span className="text-sm text-muted-foreground ml-2">(preset — switch to Custom to adjust)</span>
						)}
					</Label>
					<Slider
						id="quality"
						min={10}
						max={100}
						step={1}
						value={[quality]}
						onValueChange={(value: number[]) => handleQualitySliderChange(value)}
						className={`w-full ${!isCustom ? "opacity-40 pointer-events-none" : ""}`}
						disabled={!isCustom}
						defaultValue={[quality]}
					/>
				</div>

				{/* Output summary badge */}
				{currentPreset && (
					<div className="flex items-center gap-2 text-sm text-muted-foreground border border-border/50 rounded-lg px-3 py-2.5 bg-card/30">
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-primary"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
						<span>
							Output:{" "}
							<strong className="text-foreground">{presetDimensionLabel(selectedPreset)}</strong>
							{" · "}
							<strong className="text-foreground uppercase">{currentPreset.outputFormat}</strong>
							{" · "}
							<strong className="text-foreground">{quality}% quality</strong>
							{currentPreset.cropMode === 'exact' && (
								<span className="ml-1 text-muted-foreground/70">— center-cropped to fit</span>
							)}
							{currentPreset.cropMode === 'resize' && (
								<span className="ml-1 text-muted-foreground/70">— aspect ratio preserved</span>
							)}
						</span>
					</div>
				)}

				{/* Custom dimensions */}
				{isCustom && (
					<div className="pt-2 border-t border-border/50 text-muted-foreground">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label className="mb-2 block" htmlFor="width">
									Width (px)
								</Label>
								<Input
									type="number"
									id="width"
									value={customWidth}
									onChange={handleWidthChange}
									min={1}
									max={8000}
									{...({} as any)}
								/>
							</div>
							<div>
								<Label className="mb-2 block" htmlFor="height">
									Height (px)
								</Label>
								<Input
									type="number"
									id="height"
									value={customHeight}
									onChange={handleHeightChange}
									min={1}
									max={8000}
									{...({} as any)}
								/>
							</div>
						</div>
						<div className="flex flex-wrap gap-2 mt-4">
							{Object.entries(aspectRatios).map(([name, { ratio, tip }]) => (
								<Tooltip key={name}>
									<TooltipTrigger asChild>
										<Button
											size="sm"
											variant="outline"
											onClick={() => handleAspectRatioChange(ratio as number)}
											{...({} as any)}
										>
											{name}
										</Button>
									</TooltipTrigger>
									<TooltipContent className="">
										<p>{tip as string}</p>
									</TooltipContent>
								</Tooltip>
							))}
						</div>
					</div>
				)}
			</div>
		</TooltipProvider>
	);
};

export default Settings;
