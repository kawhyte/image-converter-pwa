import React, { useState, useRef, useEffect, useCallback } from 'react';

interface ImageCompareSliderProps {
  beforeImage: string;
  afterImage: string;
}

const ImageCompareSlider: React.FC<ImageCompareSliderProps> = ({ beforeImage, afterImage }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  }, []);

  const handleMouseDown = () => { isDragging.current = true; };
  const handleMouseUp = () => { isDragging.current = false; };
  const handleMouseLeave = () => { isDragging.current = false; };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const handleTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [handleMove]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-2xl mx-auto aspect-[4/3] overflow-hidden rounded-xl select-none cursor-ew-resize"
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      onMouseLeave={handleMouseLeave}
    >
      {/* After Image (Bottom Layer) */}
      <img
        src={afterImage}
        alt="After"
        className="absolute top-0 left-0 w-full h-full object-cover"
        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => e.currentTarget.src = 'https://placehold.co/800x600/18181b/white?text=Image+Not+Found'}
        draggable={false}
      />
      {/* Before Image (Top Layer, clipped) */}
      <div
        className="absolute top-0 left-0 h-full w-full overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={beforeImage}
          alt="Before"
          className="absolute top-0 left-0 w-full h-full object-cover"
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => e.currentTarget.src = 'https://placehold.co/800x600/6366f1/white?text=Image+Not+Found'}
          draggable={false}
        />
      </div>
      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-full h-10 w-10 grid place-items-center shadow-lg">
          <svg className="w-6 h-6 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>
        </div>
      </div>
      {/* Labels */}
      <div className="absolute top-2 left-2 bg-black/50 text-white text-xs font-semibold px-2 py-1 rounded">JPEG (528KB)</div>
      <div className="absolute top-2 right-2 bg-black/50 text-white text-xs font-semibold px-2 py-1 rounded">WebP (70KB)</div>
    </div>
  );
};

export default ImageCompareSlider;
