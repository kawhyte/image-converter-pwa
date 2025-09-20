# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm test` - Run utility tests

## Project Architecture

This is a Next.js PWA (Progressive Web App) for bulk image conversion to WebP format called "ImageRocket".

### Key Technologies
- **Next.js 14** with TypeScript and React 18
- **Tailwind CSS** for styling with custom dark theme
- **next-pwa** for Progressive Web App functionality
- **Radix UI** components for accessible UI primitives
- **Lucide React** for icons

### Project Structure
- `/pages/` - Next.js pages (App Router not used)
- `/components/` - React components organized by feature
  - `/converter/` - Core conversion functionality components
  - `/layout/` - Layout components like Navbar
- `/hooks/` - Custom React hooks for business logic
- `/lib/` - Utility functions and helpers

### Core Features Implementation
- **Bulk image processing** via custom hooks in `/hooks/`
- **WebP conversion** handled in browser using Canvas API
- **AI-powered file naming** using Gemini API (configured via `NEXT_PUBLIC_GEMINI_API_KEY`)
- **PWA functionality** configured in `next.config.js` (disabled in development)

### Custom Hooks Architecture
The app uses a simplified hook system:
- `useImageConverter.ts` - Main hook containing all conversion logic, file management, AI naming, and state management with performance optimizations (memoization, cleanup, abort controllers)
- `useDebounce.ts` - Utility hook for debouncing user input

### Performance Features
- **Memory management** with proper URL cleanup and AbortController for canceling operations
- **Memoized calculations** for resize options and expensive computations
- **Error boundaries** for graceful error handling
- **Optimized re-renders** with useCallback and useMemo hooks

### Environment Variables
- `NEXT_PUBLIC_GEMINI_API_KEY` - Required for AI naming functionality

### PWA Configuration
The PWA is configured via `next-pwa` with service worker files generated to `/public/`. PWA functionality is disabled in development mode for easier debugging.