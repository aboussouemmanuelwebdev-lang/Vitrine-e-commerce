import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Package, Check, AlertCircle, Type, AlignLeft, Tag, Image as ImageIcon, Upload, Trash2, Layers, ChevronRight } from 'lucide-react';
import { ProductOverride } from '../hooks/useSiteConfig';
import { cn } from '../lib/utils';

interface ProductEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  currentData: {
    name: string;
    description: string;
    price: string;
    imageUrl: string;
    category: string;
    subcategory: string;
  };
  onSave: (override: ProductOverride) => void;
}

const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1526170315870-ef68971ef532?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1585333127302-d2921105b9f4?auto=format&fit=crop&q=80&w=800"
];

export function ProductEditModal({ isOpen, onClose, productId, currentData, onSave }: ProductEditModalProps) {
  const [formData, setFormData] = useState(currentData);
  const [previewError, setPreviewError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(currentData);
      setPreviewError(false);
    }
  }, [isOpen, currentData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 500KB for Firestore safety)
    if (file.size > 500 * 1024) {
      alert("L'image est trop lourde (max 500KB). Veuillez utiliser une image plus petite.");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, imageUrl: reader.result as string });
      setIsUploading(false);
      setPreviewError(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      description: formData.description,
      price: formData.price,
      imageUrl: formData.imageUrl,
      category: formData.category,
      subcategory: formData.subcategory
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white dark:bg-neutral-900 w-full max-w-2xl rounded-[2.5rem] p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto scrollbar-hide"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 bg-gray-100 dark:bg-white/5 rounded-full hover:scale-110 transition-transform"
            >
              <X size={18} />
            </button>

            <div className="mb-8">
              <div className="flex items-center space-x-2 text-amber-500 mb-2">
                <Package size={20} />
                <span className="text-xs font-bold uppercase tracking-widest">Éditeur de Produit</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tighter">Modifier l'article</h2>
              <p className="text-xs text-gray-500 mt-1 font-mono opacity-60">ID: {productId}</p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <Type size={12} />
                    <span>Nom de l'article</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-white/5 border border-transparent focus:border-amber-500 rounded-2xl py-4 px-6 text-sm outline-none transition-all"
                  />
                </div>

                <div className="space-y-4">
                  <label className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <Tag size={12} />
                    <span>Prix (ex: 150 000 FCFA)</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-white/5 border border-transparent focus:border-amber-500 rounded-2xl py-4 px-6 text-sm outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <Layers size={12} />
                    <span>Catégorie</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-white/5 border border-transparent focus:border-amber-500 rounded-2xl py-4 px-6 text-sm outline-none transition-all"
                  />
                </div>

                <div className="space-y-4">
                  <label className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <ChevronRight size={12} />
                    <span>Sous-catégorie</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-white/5 border border-transparent focus:border-amber-500 rounded-2xl py-4 px-6 text-sm outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  <AlignLeft size={12} />
                  <span>Description</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-white/5 border border-transparent focus:border-amber-500 rounded-2xl py-4 px-6 text-sm outline-none transition-all resize-none"
                />
              </div>

              <div className="space-y-4">
                <label className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  <ImageIcon size={12} />
                  <span>Image de l'article</span>
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-video rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center justify-center space-y-2 cursor-pointer hover:border-amber-500 hover:bg-amber-500/5 transition-all group"
                  >
                    <div className="p-3 bg-gray-100 dark:bg-white/5 rounded-full group-hover:bg-amber-500 group-hover:text-white transition-colors">
                      <Upload size={20} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Charger une image</span>
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleFileChange}
                    />
                  </div>

                  <div className="aspect-video rounded-2xl overflow-hidden bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center relative">
                    {formData.imageUrl && !previewError ? (
                      <>
                        <img 
                          src={formData.imageUrl} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                          onError={() => setPreviewError(true)}
                        />
                        <button 
                          type="button"
                          onClick={() => setFormData({ ...formData, imageUrl: '' })}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center text-gray-400 space-y-2">
                        <AlertCircle size={24} />
                        <span className="text-xs font-medium">Aucune image</span>
                      </div>
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Ou choisir dans la galerie</label>
                  <div className="grid grid-cols-6 gap-2">
                    {SAMPLE_IMAGES.map((img, i) => (
                      <div 
                        key={i}
                        onClick={() => {
                          setFormData({ ...formData, imageUrl: img });
                          setPreviewError(false);
                        }}
                        className={cn(
                          "aspect-square rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform border-2",
                          formData.imageUrl === img ? "border-amber-500" : "border-transparent"
                        )}
                      >
                        <img src={img} alt={`Sample ${i}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-4 rounded-2xl text-sm font-bold bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 py-4 rounded-2xl text-sm font-bold bg-amber-500 text-white hover:bg-amber-600 transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Check size={18} />
                  <span>Enregistrer les modifications</span>
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
