import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, ShieldCheck, Globe, Info, CheckCircle2, Heart, Star } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Product } from '../types';
import { ProductGallery } from './ProductGallery';
import { Specifications } from './Specifications';
import { ReviewSection } from './ReviewSection';
import { cn } from '../lib/utils';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  isWishlisted: boolean;
  onWishlistToggle: () => void;
  onAuthRequired: () => void;
}

export function ProductModal({ product, onClose, isWishlisted, onWishlistToggle, onAuthRequired }: ProductModalProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!product) return null;

  const handleBookAppointment = () => {
    window.open(product.calendlyUrl, '_blank');
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 3000);
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <Helmet>
          <title>{`${product.name} - ${product.category} de Luxe | LUXE26`}</title>
          <meta name="description" content={`Découvrez le ${product.name}, une pièce d'exception de notre collection ${product.category}. ${product.description.substring(0, 150)}...`} />
          <meta name="keywords" content={`${product.name}, ${product.category}, luxe, innovation, 2026, design, exclusif, prestige`} />
          
          {/* Open Graph / Facebook */}
          <meta property="og:type" content="product" />
          <meta property="og:url" content={window.location.href} />
          <meta property="og:title" content={`${product.name} | Excellence LUXE26`} />
          <meta property="og:description" content={product.description} />
          <meta property="og:image" content={product.images[0]} />

          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:url" content={window.location.href} />
          <meta name="twitter:title" content={`${product.name} | Excellence LUXE26`} />
          <meta name="twitter:description" content={product.description} />
          <meta name="twitter:image" content={product.images[0]} />

          <link rel="canonical" href={window.location.href} />
        </Helmet>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white dark:bg-neutral-900 w-full max-w-5xl max-h-[90vh] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Confirmation Message */}
          <AnimatePresence>
            {showConfirmation && (
              <motion.div 
                initial={{ opacity: 0, y: -50, x: '-50%' }}
                animate={{ opacity: 1, y: 0, x: '-50%' }}
                exit={{ opacity: 0, y: -50, x: '-50%' }}
                className="absolute top-8 left-1/2 z-[110] bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex items-center space-x-4 border border-white/10 dark:border-black/10 ring-1 ring-white/20 dark:ring-black/20"
              >
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/20">
                  <CheckCircle2 size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold leading-none mb-1 tracking-tight">Rendez-vous programmé</p>
                  <p className="text-[10px] opacity-60 uppercase tracking-[0.2em] font-black">Consultez vos e-mails</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-10 p-2 bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-full shadow-lg hover:scale-110 transition-transform"
          >
            <X size={20} />
          </button>

          {/* Wishlist Button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onWishlistToggle();
            }}
            className={cn(
              "absolute top-6 right-20 z-10 p-2 bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-full shadow-lg hover:scale-110 transition-transform",
              isWishlisted ? "text-red-500" : "text-gray-400 hover:text-red-500"
            )}
          >
            <Heart size={20} className={isWishlisted ? "fill-current" : ""} />
          </button>

          {/* Left: Gallery */}
          <div className="w-full md:w-1/2 p-6 md:p-10 bg-gray-50 dark:bg-neutral-800/50 overflow-y-auto">
            <ProductGallery images={product.images} />
            <div className="mt-12 hidden md:block">
              <ReviewSection productId={product.id} onAuthRequired={onAuthRequired} />
            </div>
          </div>

          {/* Right: Content */}
          <div className="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto">
            <div className="space-y-8">
              <div>
                <div className="flex items-center space-x-2 text-gray-400 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest">{product.category}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600">
                    {product.availability === 'In Stock' ? 'En Stock' : 
                     product.availability === 'Limited Edition' ? 'Édition Limitée' : 
                     'Bientôt Disponible'}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">{product.name}</h2>
                <p className="text-2xl font-light text-gray-400">{product.price}</p>
              </div>

              <p className="text-gray-500 leading-relaxed">
                {product.description}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center space-x-3">
                  <ShieldCheck size={18} className="text-gray-400" />
                  <span className="text-xs font-medium">Authenticité Garantie</span>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center space-x-3">
                  <Globe size={18} className="text-gray-400" />
                  <span className="text-xs font-medium">Livraison Mondiale</span>
                </div>
              </div>

              <Specifications specs={product.specifications} />

              <div className="pt-6 border-t border-gray-100 dark:border-white/5 space-y-3">
                <button 
                  onClick={() => window.open(product.calendlyUrl, '_blank')}
                  className="w-full flex items-center justify-center space-x-3 bg-black dark:bg-white text-white dark:text-black py-5 rounded-[1.5rem] text-sm font-bold hover:opacity-90 transition-opacity shadow-lg"
                >
                  <Info size={18} />
                  <span>Demander des informations</span>
                </button>
                <button 
                  onClick={handleBookAppointment}
                  className="w-full flex items-center justify-center space-x-3 bg-amber-500 text-white py-5 rounded-[1.5rem] text-sm font-bold hover:bg-amber-600 transition-colors shadow-lg"
                >
                  <Calendar size={18} />
                  <span>Prendre Rendez-vous</span>
                </button>
                <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-widest font-bold">
                  Aucun paiement requis • Consultation d'expert
                </p>
              </div>

              <div className="md:hidden">
                <ReviewSection productId={product.id} onAuthRequired={onAuthRequired} />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

