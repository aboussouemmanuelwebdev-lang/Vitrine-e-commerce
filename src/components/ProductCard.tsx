import { useState } from 'react';
import type { MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, ChevronRight, Info, Heart, CheckCircle2, Share2, Mail, Pencil } from 'lucide-react';
import { Product } from '../types';
import { cn, formatPrice } from '../lib/utils';
import { BlurImage } from './BlurImage';
import { useSiteConfig } from '../hooks/useSiteConfig';
import { ProductEditModal } from './ProductEditModal';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onWishlistToggle: () => void;
}

export function ProductCard({ product: initialProduct, isWishlisted, onWishlistToggle }: ProductCardProps) {
  const [wishlistMessage, setWishlistMessage] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [isNotified, setIsNotified] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { isAdmin, getProductData, updateProduct } = useSiteConfig();

  const product = getProductData(initialProduct.id, initialProduct);

  const handleWishlistClick = (e: MouseEvent) => {
    e.stopPropagation();
    onWishlistToggle();
    setWishlistMessage(isWishlisted ? 'Retiré de la wishlist' : 'Ajouté à la wishlist');
    setTimeout(() => setWishlistMessage(null), 2000);
  };

  const handleShare = (e: MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}?product=${product.id}`;
    navigator.clipboard.writeText(url);
    setWishlistMessage('Lien copié !');
    setTimeout(() => setWishlistMessage(null), 2000);
  };

  const handleNotifyMe = (e: MouseEvent) => {
    e.stopPropagation();
    if (!email || !email.includes('@')) return;
    setIsNotified(true);
    setWishlistMessage('Inscription réussie !');
    setTimeout(() => setWishlistMessage(null), 2000);
  };

  const handleEditClick = (e: MouseEvent) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  return (
    <>
      <motion.div 
        whileHover={{ y: -5 }}
        className="group relative bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 dark:border-white/5 flex flex-col h-full"
      >
        <div className="aspect-[4/5] overflow-hidden relative flex-shrink-0">
          <div className="w-full h-full group-hover:scale-110 transition-transform duration-700 ease-in-out relative">
            <BlurImage 
              src={product.images[0]} 
              imageKey={`product_${product.id}_0`}
              alt={product.name}
              className="w-full h-full"
            />
            {/* Subtle Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 pointer-events-none" />
          </div>

          <div className="absolute top-4 left-4 flex flex-col space-y-2 z-20">
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              className={cn(
                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm",
                product.availability === 'In Stock' ? "bg-green-100 text-green-700" :
                product.availability === 'Limited Edition' ? "bg-amber-100 text-amber-700" :
                "bg-blue-100 text-blue-700"
              )}
            >
              {product.availability === 'In Stock' ? 'En Stock' : 
               product.availability === 'Limited Edition' ? 'Édition Limitée' : 
               'Bientôt Disponible'}
            </motion.span>
          </div>
          
          <div className="absolute top-4 right-4 flex flex-col space-y-2 z-20">
            <button 
              onClick={handleWishlistClick}
              aria-label={isWishlisted ? "Retirer de la wishlist" : "Ajouter à la wishlist"}
              title={isWishlisted ? "Retirer de la wishlist" : "Ajouter à la wishlist"}
              className={cn(
                "p-2 bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-full shadow-lg hover:scale-110 transition-transform focus:ring-2 focus:ring-red-500 outline-none",
                isWishlisted ? "text-red-500" : "text-gray-400 hover:text-red-500"
              )}
            >
              <Heart size={18} className={isWishlisted ? "fill-current" : ""} />
            </button>
            <button 
              onClick={handleShare}
              aria-label="Partager ce produit"
              title="Partager ce produit"
              className="p-2 bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-full shadow-lg hover:scale-110 transition-transform text-gray-400 hover:text-black dark:hover:text-white focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
            >
              <Share2 size={18} />
            </button>
            {isAdmin && (
              <button 
                onClick={handleEditClick}
                aria-label="Modifier l'article"
                title="Modifier l'article"
                className="p-2 bg-amber-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform focus:ring-2 focus:ring-white outline-none animate-pulse"
              >
                <Pencil size={18} />
              </button>
            )}
          </div>

          <AnimatePresence>
            {wishlistMessage && (
              <motion.div
                initial={{ opacity: 0, y: 10, x: '-50%' }}
                animate={{ opacity: 1, y: 0, x: '-50%' }}
                exit={{ opacity: 0, y: -10, x: '-50%' }}
                className="absolute bottom-4 left-1/2 z-30 bg-black/90 dark:bg-white/90 text-white dark:text-black px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center space-x-2 backdrop-blur-md whitespace-nowrap"
              >
                <CheckCircle2 size={12} className="text-green-500" />
                <span>{wishlistMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="p-6 flex-1 flex flex-col overflow-y-auto scrollbar-hide">
          {/* Breadcrumbs */}
          <div className="flex items-center space-x-1 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
            <span>{product.category}</span>
            <ChevronRight size={10} />
            <span className="text-gray-300">{product.subcategory}</span>
          </div>

          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold tracking-tight">{product.name}</h3>
            <p className="text-sm font-medium text-gray-500">{formatPrice(product.price)}</p>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {product.description}
          </p>
          
          <div className="mt-auto sticky bottom-0 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm pt-4 pb-2 -mx-2 px-2 z-10 border-t border-gray-50 dark:border-white/5">
            {product.availability === 'Coming Soon' && !isNotified ? (
              <div className="space-y-3 mb-4" onClick={(e) => e.stopPropagation()}>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input 
                    type="email" 
                    placeholder="Votre email..." 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-black dark:focus:border-white rounded-xl text-xs outline-none transition-all"
                  />
                </div>
                <button 
                  onClick={handleNotifyMe}
                  className="w-full bg-amber-500 text-white py-2 rounded-xl text-xs font-bold hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20"
                >
                  M'avertir de la disponibilité
                </button>
              </div>
            ) : product.availability === 'Coming Soon' && isNotified ? (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-500/10 rounded-xl flex items-center space-x-2 text-[10px] font-bold text-green-600 uppercase tracking-widest">
                <CheckCircle2 size={14} />
                <span>Vous serez averti par email</span>
              </div>
            ) : null}

            <div className="flex items-center space-x-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(product.calendlyUrl, '_blank');
                }}
                aria-label="Demander des informations sur ce produit"
                title="Demander des informations"
                className="flex-1 flex items-center justify-center space-x-2 bg-black dark:bg-white text-white dark:text-black py-3 rounded-2xl text-sm font-bold hover:bg-neutral-800 dark:hover:bg-neutral-200 hover:scale-[1.02] transition-all shadow-xl active:scale-95 focus:ring-4 focus:ring-black/20 dark:focus:ring-white/20 outline-none"
              >
                <Info size={16} />
                <span>Demander des informations</span>
              </button>
              <button className="p-3 rounded-2xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <ProductEditModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        productId={product.id}
        currentData={{
          name: product.name,
          description: product.description,
          price: product.price,
          imageUrl: product.images[0],
          category: product.category,
          subcategory: product.subcategory
        }}
        onSave={async (override) => {
          try {
            await updateProduct(product.id, override);
          } catch (error) {
            console.error('Failed to update product:', error);
            alert('Erreur lors de la sauvegarde. L\'image est peut-être trop lourde ou vous n\'avez pas les permissions nécessaires.');
          }
        }}
      />
    </>
  );
}
