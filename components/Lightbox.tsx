'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

interface LightboxProps {
  images: string[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

export default function Lightbox({ images, isOpen, onClose, initialIndex = 0 }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);

  // Update current index when initialIndex changes
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Reset zoom when changing images
  useEffect(() => {
    setZoom(1);
    setIsZoomed(false);
  }, [currentIndex]);

  // Navigate to previous image
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  // Navigate to next image
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case '+':
        case '=':
          handleZoomIn();
          break;
        case '-':
        case '_':
          handleZoomOut();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, goToPrevious, goToNext]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 3));
    setIsZoomed(true);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 0.5, 1);
    setZoom(newZoom);
    if (newZoom === 1) setIsZoomed(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
        <div className="text-white font-semibold">
          {currentIndex + 1} / {images.length}
        </div>
        
        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            disabled={zoom <= 1}
            className="p-2 text-white hover:text-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Zoom Out (-))"
          >
            <ZoomOut className="w-6 h-6" />
          </button>
          <span className="text-white text-sm min-w-[60px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            disabled={zoom >= 3}
            className="p-2 text-white hover:text-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Zoom In (+)"
          >
            <ZoomIn className="w-6 h-6" />
          </button>
        </div>

        <button
          onClick={onClose}
          className="p-2 text-white hover:text-gold transition-colors"
          title="Close (ESC)"
        >
          <X className="w-8 h-8" />
        </button>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all hover:scale-110"
        title="Previous (←)"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all hover:scale-110"
        title="Next (→)"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Image Container */}
      <div className="relative w-full h-full flex items-center justify-center p-4 overflow-hidden">
        <div 
          className="relative max-w-7xl max-h-full transition-transform duration-300 ease-out"
          style={{ 
            transform: `scale(${zoom})`,
            cursor: isZoomed ? 'zoom-out' : 'zoom-in'
          }}
          onClick={() => {
            if (isZoomed) {
              setZoom(1);
              setIsZoomed(false);
            } else {
              setZoom(2);
              setIsZoomed(true);
            }
          }}
        >
          {/* Placeholder image - replace with real images */}
          <div className="w-full h-full min-h-[60vh] max-h-[85vh] rounded-lg overflow-hidden bg-gradient-to-br from-amber-300 to-stone-400" />
          
          {/* Use this for real images: */}
          {/* 
          <Image
            src={images[currentIndex]}
            alt={`Gallery image ${currentIndex + 1}`}
            width={1920}
            height={1080}
            className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
            priority
          />
          */}
        </div>
      </div>

      {/* Thumbnail Strip */}
      <div className="absolute bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-black/50 to-transparent">
        <div className="flex justify-center gap-2 overflow-x-auto pb-2 px-4 scrollbar-thin scrollbar-thumb-gold scrollbar-track-transparent">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`
                flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all
                ${currentIndex === index 
                  ? 'border-gold scale-110' 
                  : 'border-white/30 hover:border-white/60 opacity-60 hover:opacity-100'
                }
              `}
            >
              {/* Placeholder thumbnails */}
              <div className="w-full h-full bg-gradient-to-br from-stone-300 to-stone-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Keyboard Hints */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 text-white/60 text-sm text-center space-y-1">
        <p>Use arrow keys ← → to navigate</p>
        <p>Press ESC to close • Click image to zoom</p>
      </div>
    </div>
  );
}

// Export hook for easy usage
export function useLightbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number = 0) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeLightbox = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    currentIndex,
    openLightbox,
    closeLightbox,
  };
}

// Usage example:
/*
import Lightbox, { useLightbox } from './Lightbox';

function Gallery() {
  const images = ['/img1.jpg', '/img2.jpg', '/img3.jpg'];
  const { isOpen, currentIndex, openLightbox, closeLightbox } = useLightbox();

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            onClick={() => openLightbox(index)}
            className="cursor-pointer"
          />
        ))}
      </div>

      <Lightbox
        images={images}
        isOpen={isOpen}
        onClose={closeLightbox}
        initialIndex={currentIndex}
      />
    </>
  );
}
*/
