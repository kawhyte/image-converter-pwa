import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { Rocket, Sparkles, Zap, Lock, Globe } from 'lucide-react';

const AboutSection: React.FC = React.memo(() => {
	return (
		<Card
			className='w-full transition-all duration-150 ease-in-out rounded-3xl border border-muted-foreground/50 text-base shadow-xl bg-slate-900'
			aria-label='About ImageRocket information'
		>
			<CardHeader className='text-center pb-4'>
				<CardTitle className='text-2xl md:text-3xl'>
					About ImageRocket
				</CardTitle>
			</CardHeader>

			<CardContent className='px-4 md:px-6 pb-6'>
				<Accordion
					type='single'
					collapsible
					className='w-full space-y-3'
					defaultValue='how-it-works'
				>
					{/* How It Works */}
					<AccordionItem
						value='how-it-works'
						className='border border-muted-foreground/20 rounded-xl px-4 data-[state=open]:bg-slate-800/50'
					>
						<AccordionTrigger className='hover:no-underline py-4'>
							<div className='flex items-center gap-3 text-left'>
								<Rocket className='h-5 w-5 text-blue-400 flex-shrink-0' />
								<span className='font-medium text-base md:text-lg'>
									How It Works
								</span>
							</div>
						</AccordionTrigger>
						<AccordionContent className='pb-4 pt-2 text-sm md:text-base leading-relaxed text-foreground/80'>
							<p className='mb-4'>
								Transform your images into optimized WebP files in three simple
								steps:
							</p>
							<ol className='space-y-3 ml-4'>
								<li className='flex gap-3'>
									<span className='font-semibold text-blue-400 flex-shrink-0'>
										1.
									</span>
									<div>
										<strong className='text-foreground'>Upload</strong> - Drag
										and drop your images or click to browse
									</div>
								</li>
								<li className='flex gap-3'>
									<span className='font-semibold text-blue-400 flex-shrink-0'>
										2.
									</span>
									<div>
										<strong className='text-foreground'>Customize</strong> -
										Choose from preset options or set custom dimensions and
										quality
									</div>
								</li>
								<li className='flex gap-3'>
									<span className='font-semibold text-blue-400 flex-shrink-0'>
										3.
									</span>
									<div>
										<strong className='text-foreground'>Download</strong> - Get
										your optimized images individually or as a zip file
									</div>
								</li>
							</ol>
							<p className='mt-4 text-xs md:text-sm italic text-foreground/60'>
								Everything happens right in your browser—no uploads, no waiting,
								no server processing.
							</p>
						</AccordionContent>
					</AccordionItem>

					{/* Features & Benefits */}
					<AccordionItem
						value='features'
						className='border border-muted-foreground/20 rounded-xl px-4 data-[state=open]:bg-slate-800/50'
					>
						<AccordionTrigger className='hover:no-underline py-4'>
							<div className='flex items-center gap-3 text-left'>
								<Sparkles className='h-5 w-5 text-purple-400 flex-shrink-0' />
								<span className='font-medium text-base md:text-lg'>
									Features & Benefits
								</span>
							</div>
						</AccordionTrigger>
						<AccordionContent className='pb-4 pt-2 text-sm md:text-base leading-relaxed text-foreground/80'>
							<ul className='space-y-3'>
								<li className='flex gap-3'>
									<span className='text-purple-400 flex-shrink-0'>•</span>
									<div>
										<strong className='text-foreground'>Bulk Processing</strong>{' '}
										- Convert multiple images at once
									</div>
								</li>
								<li className='flex gap-3'>
									<span className='text-purple-400 flex-shrink-0'>•</span>
									<div>
										<strong className='text-foreground'>
											AI-Powered Naming
										</strong>{' '}
										- Smart file naming using artificial intelligence
									</div>
								</li>
								<li className='flex gap-3'>
									<span className='text-purple-400 flex-shrink-0'>•</span>
									<div>
										<strong className='text-foreground'>
											One-Click Presets
										</strong>{' '}
										- Quick optimization with curated settings
									</div>
								</li>
								<li className='flex gap-3'>
									<span className='text-purple-400 flex-shrink-0'>•</span>
									<div>
										<strong className='text-foreground'>Custom Settings</strong>{' '}
										- Fine-tune quality and dimensions to your needs
									</div>
								</li>
								<li className='flex gap-3'>
									<span className='text-purple-400 flex-shrink-0'>•</span>
									<div>
										<strong className='text-foreground'>100% Private</strong> -
										All processing happens locally in your browser
									</div>
								</li>
								<li className='flex gap-3'>
									<span className='text-purple-400 flex-shrink-0'>•</span>
									<div>
										<strong className='text-foreground'>Lightning Fast</strong>{' '}
										- No server uploads means instant results
									</div>
								</li>
								<li className='flex gap-3'>
									<span className='text-purple-400 flex-shrink-0'>•</span>
									<div>
										<strong className='text-foreground'>Works Offline</strong> -
										Progressive Web App technology keeps you productive anywhere
									</div>
								</li>
							</ul>
						</AccordionContent>
					</AccordionItem>

					{/* Why WebP */}
					<AccordionItem
						value='why-webp'
						className='border border-muted-foreground/20 rounded-xl px-4 data-[state=open]:bg-slate-800/50'
					>
						<AccordionTrigger className='hover:no-underline py-4'>
							<div className='flex items-center gap-3 text-left'>
								<Zap className='h-5 w-5 text-yellow-400 flex-shrink-0' />
								<span className='font-medium text-base md:text-lg'>
									Why WebP?
								</span>
							</div>
						</AccordionTrigger>
						<AccordionContent className='pb-4 pt-2 text-sm md:text-base leading-relaxed text-foreground/80'>
							<p className='mb-4'>
								WebP is a modern image format that provides superior compression
								for images on the web. Compared to JPEG and PNG:
							</p>
							<ul className='space-y-3'>
								<li className='flex gap-3'>
									<span className='text-yellow-400 flex-shrink-0'>•</span>
									<div>
										<strong className='text-foreground'>
											30% smaller file sizes
										</strong>{' '}
										on average
									</div>
								</li>
								<li className='flex gap-3'>
									<span className='text-yellow-400 flex-shrink-0'>•</span>
									<div>
										<strong className='text-foreground'>Faster page loads</strong>{' '}
										for better user experience
									</div>
								</li>
								<li className='flex gap-3'>
									<span className='text-yellow-400 flex-shrink-0'>•</span>
									<div>
										<strong className='text-foreground'>
											Better SEO rankings
										</strong>{' '}
										from improved site speed
									</div>
								</li>
								<li className='flex gap-3'>
									<span className='text-yellow-400 flex-shrink-0'>•</span>
									<div>
										<strong className='text-foreground'>
											Same visual quality
										</strong>{' '}
										with significantly less data
									</div>
								</li>
							</ul>
							<p className='mt-4 text-xs md:text-sm italic text-foreground/60'>
								Support for WebP is now available in all modern browsers, making
								it the ideal choice for web optimization.
							</p>
						</AccordionContent>
					</AccordionItem>

					{/* Privacy & Security */}
					<AccordionItem
						value='privacy'
						className='border border-muted-foreground/20 rounded-xl px-4 data-[state=open]:bg-slate-800/50'
					>
						<AccordionTrigger className='hover:no-underline py-4'>
							<div className='flex items-center gap-3 text-left'>
								<Lock className='h-5 w-5 text-green-400 flex-shrink-0' />
								<span className='font-medium text-base md:text-lg'>
									Privacy & Security
								</span>
							</div>
						</AccordionTrigger>
						<AccordionContent className='pb-4 pt-2 text-sm md:text-base leading-relaxed text-foreground/80'>
							<p className='mb-4'>Your privacy is our priority:</p>
							<ul className='space-y-3'>
								<li className='flex gap-3'>
									<span className='text-green-400 flex-shrink-0'>•</span>
									<div>
										<strong className='text-foreground'>No uploads</strong> -
										Images never leave your device
									</div>
								</li>
								<li className='flex gap-3'>
									<span className='text-green-400 flex-shrink-0'>•</span>
									<div>
										<strong className='text-foreground'>No tracking</strong> - We
										don't collect or store your data
									</div>
								</li>
								<li className='flex gap-3'>
									<span className='text-green-400 flex-shrink-0'>•</span>
									<div>
										<strong className='text-foreground'>No accounts</strong> -
										Use ImageRocket without signing up
									</div>
								</li>
								<li className='flex gap-3'>
									<span className='text-green-400 flex-shrink-0'>•</span>
									<div>
										<strong className='text-foreground'>Open source</strong> -
										Our code is transparent and auditable
									</div>
								</li>
							</ul>
							<p className='mt-4 text-xs md:text-sm italic text-foreground/60'>
								All image processing happens directly in your browser using the
								latest web technologies.
							</p>
						</AccordionContent>
					</AccordionItem>

					{/* Browser Compatibility */}
					<AccordionItem
						value='compatibility'
						className='border border-muted-foreground/20 rounded-xl px-4 data-[state=open]:bg-slate-800/50'
					>
						<AccordionTrigger className='hover:no-underline py-4'>
							<div className='flex items-center gap-3 text-left'>
								<Globe className='h-5 w-5 text-cyan-400 flex-shrink-0' />
								<span className='font-medium text-base md:text-lg'>
									Browser Compatibility
								</span>
							</div>
						</AccordionTrigger>
						<AccordionContent className='pb-4 pt-2 text-sm md:text-base leading-relaxed text-foreground/80'>
							<p className='mb-4'>
								ImageRocket works best on modern browsers:
							</p>
							<ul className='space-y-3'>
								<li className='flex gap-3'>
									<span className='text-cyan-400 flex-shrink-0'>✓</span>
									<div>
										<strong className='text-foreground'>Chrome/Edge</strong> -
										Full support (recommended)
									</div>
								</li>
								<li className='flex gap-3'>
									<span className='text-cyan-400 flex-shrink-0'>✓</span>
									<div>
										<strong className='text-foreground'>Firefox</strong> - Full
										support
									</div>
								</li>
								<li className='flex gap-3'>
									<span className='text-cyan-400 flex-shrink-0'>✓</span>
									<div>
										<strong className='text-foreground'>Safari</strong> - Full
										support (iOS 14+, macOS 11+)
									</div>
								</li>
								<li className='flex gap-3'>
									<span className='text-cyan-400 flex-shrink-0'>✓</span>
									<div>
										<strong className='text-foreground'>Opera</strong> - Full
										support
									</div>
								</li>
							</ul>
							<p className='mt-4 text-xs md:text-sm italic text-foreground/60'>
								For the best experience, we recommend using the latest version of
								your browser.
							</p>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</CardContent>
		</Card>
	);
});

AboutSection.displayName = 'AboutSection';

export default AboutSection;
