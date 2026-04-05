import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BlurImage } from './BlurImage';

interface ProductGalleryProps {
  images: string[];
  productId?: string;
}

export function ProductGallery({ images, productId }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextImage, prevImage]);

  return (
    <div className="space-y-4">
      <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-100 dark:bg-neutral-800">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <BlurImage 
              src={images[currentIndex]} 
              imageKey={productId ? `product_${productId}_${currentIndex}` : undefined}
              alt="Product"
              className="w-full h-full"
            />
          </motion.div>
        </AnimatePresence>
        
        <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 hover:opacity-100 transition-opacity">
          <button 
            onClick={prevImage}
            className="p-2 bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-full shadow-lg hover:scale-110 transition-transform"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={nextImage}
            className="p-2 bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-full shadow-lg hover:scale-110 transition-transform"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
        {images.map((img, i) => (
          <div 
            key={i}
            role="button"
            tabIndex={0}
            onClick={() => setCurrentIndex(i)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setCurrentIndex(i);
              }
            }}
            className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${currentIndex === i ? 'border-black dark:border-white' : 'border-transparent opacity-50 hover:opacity-100'}`}
          >
            <BlurImage 
              src={img} 
              imageKey={productId ? `product_${productId}_${i}` : undefined}
              alt={`Thumb ${i}`} 
              className="w-full h-full" 
            />
          </div>
        ))}
      </div>
    </div>
  );
}
