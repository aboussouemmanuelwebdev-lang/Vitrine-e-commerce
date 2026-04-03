import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BlurImage } from './BlurImage';

interface ProductGalleryProps {
  images: string[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

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
              alt="Product"
              className="w-full h-full"
            />
          </motion.div>
        </AnimatePresence>
        
        <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 hover:opacity-100 transition-opacity">
          <button 
            onClick={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
            className="p-2 bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-full shadow-lg"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
            className="p-2 bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-full shadow-lg"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
        {images.map((img, i) => (
          <button 
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${currentIndex === i ? 'border-black dark:border-white' : 'border-transparent opacity-50 hover:opacity-100'}`}
          >
            <BlurImage src={img} alt={`Thumb ${i}`} className="w-full h-full" />
          </button>
        ))}
      </div>
    </div>
  );
}
