import React from 'react';


// --- SVG Icon for a file ---
const FileIcon = ({ className, label, style }: { className?: string; label: string; style?: React.CSSProperties }) => (
  <div className={`relative w-20 h-24 bg-zinc-700 rounded-lg shadow-md flex flex-col justify-between p-2 ${className}`} style={style}>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-zinc-400">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
    </svg>
    <span className="text-white font-bold text-xs text-right">{label}</span>
  </div>
);

// --- SVG Icon for the conversion arrow ---
const ArrowIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </svg>
);


const ConversionAnimation: React.FC = () => {
  return (
    <>
      {/* We define the custom CSS animations here for Tailwind to use */}
      <style>
        {`
          @keyframes fly-and-shrink {
            0% { transform: translate(0, 0) scale(1); opacity: 1; }
            40% { transform: translate(140px, 0) scale(1); opacity: 1; }
            50% { transform: translate(160px, 0) scale(0.6); opacity: 1; }
            60% { transform: translate(180px, 0) scale(0.6); opacity: 0; }
            100% { transform: translate(180px, 0) scale(0.6); opacity: 0; }
          }
          @keyframes appear-as-webp {
            0% { transform: translate(0,0) scale(0.6); opacity: 0; }
            60% { transform: translate(0,0) scale(0.6); opacity: 0; }
            70% { transform: translate(0,0) scale(0.6); opacity: 1; }
            100% { transform: translate(0,0) scale(1); opacity: 1; }
          }
        `}
      </style>

      <div className="relative w-full max-w-md h-48 mx-auto flex justify-between items-center bg-zinc-900 rounded-xl p-8 overflow-hidden">

        {/* Left Side: JPEG Stack */}
        <div className="relative w-20 h-24">
          <p className="absolute -top-6 text-zinc-400 text-sm font-semibold">JPEGs</p>
          {/* These are the animating files */}
          <FileIcon label="JPEG" className="absolute top-0 left-0 animate-[fly-and-shrink_4s_ease-in-out_infinite]" style={{ animationDelay: '0s' }} />
          
        </div>

        {/* Center: Arrow */}
        <div className="text-zinc-500">
            <ArrowIcon className="w-10 h-10" />
        </div>

        {/* Right Side: WebP Stack */}
        <div className="relative w-20 h-24 ">
          <p className="absolute -top-6 right-0 text-zinc-400 text-sm font-semibold">WebPs</p>
           {/* These are the appearing files */}
          <FileIcon label="WebP" className=" absolute top-0 left-0 animate-[appear-as-webp_4s_ease-in-out_infinite]" style={{ animationDelay: '0s' }} />
         
        </div>
      </div>
    </>
  );
};

export default ConversionAnimation;