import { useState, useEffect } from 'react';
import { Search, Menu, X, Calendar, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, scrollToSection } from '../lib/utils';
import { products } from '../data/products';
import { Product } from '../types';
import { BlurImage } from './BlurImage';

interface NavbarProps {
  onLoginClick: () => void;
  onProductClick: (product: Product) => void;
}

export function Navbar({ onLoginClick, onProductClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchQuery.length > 1) {
      const filtered = products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [searchQuery]);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
      isScrolled ? "bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-sm" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-2xl font-bold tracking-tighter text-black dark:text-white">
          LUXE<span className="text-gray-400">26</span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <button onClick={() => scrollToSection('collection')} className="text-sm font-medium hover:text-gray-500 transition-colors">Collection</button>
          <button onClick={() => scrollToSection('hero')} className="text-sm font-medium hover:text-gray-500 transition-colors">Sur Mesure</button>
          <button onClick={() => scrollToSection('reassurance')} className="text-sm font-medium hover:text-gray-500 transition-colors">Héritage</button>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
          >
            <Search size={20} />
          </button>
          <button 
            onClick={onLoginClick}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
          >
            <User size={20} />
          </button>
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
          >
            <Menu size={20} />
          </button>
          <button 
            onClick={() => scrollToSection('collection')}
            className="hidden md:flex items-center space-x-2 bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
          >
            <Calendar size={16} />
            <span>Prendre Rendez-vous</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                closed: { x: '100%' },
                open: { 
                  x: 0,
                  transition: {
                    type: 'spring',
                    damping: 25,
                    stiffness: 200,
                    staggerChildren: 0.1,
                    delayChildren: 0.2
                  }
                }
              }}
              className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white dark:bg-neutral-900 z-[70] shadow-2xl p-8 flex flex-col"
            >
              <div className="flex justify-between items-center mb-12">
                <div className="text-xl font-bold tracking-tighter text-black dark:text-white">
                  LUXE<span className="text-gray-400">26</span>
                </div>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex flex-col space-y-8">
                {[
                  { label: 'Collection', id: 'collection' },
                  { label: 'Sur Mesure', id: 'hero' },
                  { label: 'Héritage', id: 'reassurance' }
                ].map((item) => (
                  <motion.button 
                    key={item.id}
                    variants={{
                      closed: { opacity: 0, x: 20 },
                      open: { opacity: 1, x: 0 }
                    }}
                    onClick={() => { scrollToSection(item.id); setIsMenuOpen(false); }} 
                    className="text-2xl font-bold tracking-tight hover:text-gray-500 transition-colors text-left"
                  >
                    {item.label}
                  </motion.button>
                ))}
              </div>

              <div className="mt-auto space-y-4">
                <motion.button 
                  variants={{
                    closed: { opacity: 0, y: 20 },
                    open: { opacity: 1, y: 0 }
                  }}
                  onClick={() => { onLoginClick(); setIsMenuOpen(false); }}
                  className="w-full flex items-center justify-center space-x-3 border border-gray-200 dark:border-white/10 py-4 rounded-2xl font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  <User size={18} />
                  <span>Mon Compte</span>
                </motion.button>
                <motion.button 
                  variants={{
                    closed: { opacity: 0, y: 20 },
                    open: { opacity: 1, y: 0 }
                  }}
                  onClick={() => { scrollToSection('collection'); setIsMenuOpen(false); }}
                  className="w-full flex items-center justify-center space-x-3 bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl font-bold hover:opacity-90 transition-opacity"
                >
                  <Calendar size={18} />
                  <span>Prendre Rendez-vous</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 w-full bg-white dark:bg-neutral-900 shadow-2xl p-6 z-50"
          >
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div className="flex-1 flex items-center space-x-4">
                  <Search className="text-gray-400" />
                  <input 
                    autoFocus
                    type="text"
                    placeholder="Rechercher dans notre collection 2026..."
                    className="w-full bg-transparent border-none focus:ring-0 text-xl font-light"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button onClick={() => setIsSearchOpen(false)} className="p-2">
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Suggestions</h3>
                  <div className="space-y-4">
                    {results.length > 0 ? results.map(product => (
                      <div 
                        key={product.id} 
                        className="flex items-center space-x-4 group cursor-pointer"
                        onClick={() => {
                          onProductClick(product);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                      >
                        <BlurImage src={product.images[0]} alt={product.name} className="w-12 h-12 rounded-lg" />
                        <div>
                          <p className="font-medium group-hover:text-gray-500 transition-colors">{product.name}</p>
                          <p className="text-xs text-gray-400">{product.category}</p>
                        </div>
                      </div>
                    )) : (
                      <p className="text-sm text-gray-500">Commencez à taper pour voir les résultats...</p>
                    )}
                  </div>
                </div>
                <div className="hidden md:block border-l border-gray-100 dark:border-white/10 pl-8">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Tendances</h3>
                  <div className="space-y-2">
                    <p className="text-sm hover:underline cursor-pointer">Chronos Elite X1</p>
                    <p className="text-sm hover:underline cursor-pointer">Aura Soundscape</p>
                    <p className="text-sm hover:underline cursor-pointer">Lumina Smart Desk</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
