import { motion } from 'motion/react';
import { Calendar, ChevronRight, Info, Heart } from 'lucide-react';
import { Product } from '../types';
import { cn } from '../lib/utils';
import { BlurImage } from './BlurImage';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onWishlistToggle: () => void;
}

export function ProductCard({ product, isWishlisted, onWishlistToggle }: ProductCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group relative bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 dark:border-white/5"
    >
      <div className="aspect-[4/5] overflow-hidden relative">
        <BlurImage 
          src={product.images[0]} 
          alt={product.name}
          className="w-full h-full"
        />
        <div className="absolute top-4 left-4 flex flex-col space-y-2">
          <span className={cn(
            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
            product.availability === 'In Stock' ? "bg-green-100 text-green-700" :
            product.availability === 'Limited Edition' ? "bg-amber-100 text-amber-700" :
            "bg-blue-100 text-blue-700"
          )}>
            {product.availability === 'In Stock' ? 'En Stock' : 
             product.availability === 'Limited Edition' ? 'Édition Limitée' : 
             'Bientôt Disponible'}
          </span>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onWishlistToggle();
          }}
          className={cn(
            "absolute top-4 right-4 p-2 bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-full shadow-lg hover:scale-110 transition-transform",
            isWishlisted ? "text-red-500" : "text-gray-400 hover:text-red-500"
          )}
        >
          <Heart size={18} className={isWishlisted ? "fill-current" : ""} />
        </button>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold tracking-tight">{product.name}</h3>
          <p className="text-sm font-medium text-gray-500">{product.price}</p>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-6">
          {product.description}
        </p>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              window.open(product.calendlyUrl, '_blank');
            }}
            className="flex-1 flex items-center justify-center space-x-2 bg-black dark:bg-white text-white dark:text-black py-3 rounded-2xl text-sm font-bold hover:opacity-90 transition-opacity"
          >
            {product.availability === 'Coming Soon' ? (
              <>
                <Calendar size={16} />
                <span>Notify Me</span>
              </>
            ) : (
              <>
                <Info size={16} />
                <span>Demander des informations</span>
              </>
            )}
          </button>
          <button className="p-3 rounded-2xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
