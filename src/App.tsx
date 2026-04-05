import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navbar } from './components/Navbar';
import { BentoGrid } from './components/BentoGrid';
import { ProductCard } from './components/ProductCard';
import { Testimonials } from './components/Testimonials';
import { ProductModal } from './components/ProductModal';
import { AuthModal } from './components/AuthModal';
import { Chatbot } from './components/Chatbot';
import { products } from './data/products';
import { Product } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles, Globe, ShieldCheck, Instagram, Heart, ShieldAlert } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { cn, scrollToSection } from './lib/utils';
import { useSiteConfig } from './hooks/useSiteConfig';

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);
  const { isAdmin } = useSiteConfig();

  // Listen for Auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthReady(true);
      if (!user) {
        setWishlist([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Listen for User Profile changes (Wishlist)
  useEffect(() => {
    if (!auth.currentUser) return;

    const userDocRef = doc(db, 'users', auth.currentUser.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setWishlist(userData.wishlist || []);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${auth.currentUser?.uid}`);
    });

    return () => unsubscribe();
  }, [isAuthReady]);

  const toggleWishlist = async (productId: string) => {
    if (!auth.currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    const userDocRef = doc(db, 'users', auth.currentUser.uid);
    const isAdding = !wishlist.includes(productId);

    try {
      await updateDoc(userDocRef, {
        wishlist: isAdding ? arrayUnion(productId) : arrayRemove(productId)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${auth.currentUser.uid}`);
    }
  };

  // SEO JSON-LD Generation
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    const jsonLd = {
      "@context": "https://schema.org/",
      "@type": "ItemList",
      "itemListElement": products.map((p, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "item": {
          "@type": "Product",
          "name": p.name,
          "description": p.description,
          "image": p.images[0],
          "offers": {
            "@type": "Offer",
            "price": p.price.replace('FCFA', '').replace(/\s/g, ''),
            "priceCurrency": "XAF",
            "availability": "https://schema.org/InStock"
          }
        }
      }))
    };
    script.innerHTML = JSON.stringify(jsonLd);
    document.head.appendChild(script);
    return () => {
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) document.head.removeChild(existingScript);
    };
  }, []);

  const filteredProducts = showWishlistOnly 
    ? products.filter(p => wishlist.includes(p.id))
    : products;

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-500">
      <Helmet>
        <title>LUXE26 | La Collection Exclusive 2026</title>
        <meta name="description" content="Découvrez la première vitrine numérique mondiale pour les innovations lifestyle de luxe. Redéfinir l'excellence depuis 2026." />
      </Helmet>
      
      <Navbar 
        onLoginClick={() => setIsAuthModalOpen(true)} 
        onProductClick={(product) => setSelectedProduct(product)}
      />

      {/* Admin Mode Indicator */}
      <AnimatePresence>
        {isAdmin && (
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed top-24 right-6 z-[50] bg-amber-500 text-white px-4 py-2 rounded-full shadow-2xl flex items-center space-x-2 border-2 border-white animate-pulse"
          >
            <ShieldAlert size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Mode Admin Actif</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto space-y-32">
        {/* Hero Section */}
        <section id="hero">
          <BentoGrid 
            onAuthClick={() => setIsAuthModalOpen(true)}
            onScrollToCollection={() => {
              const el = document.getElementById('collection');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </section>

        {/* Nouveautés 2026 Section */}
        <section id="nouveautes">
          <div className="mb-12">
            <div className="flex items-center space-x-2 text-amber-600 mb-4">
              <Sparkles size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">Nouveautés 2026</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight">
              L'Avenir du Luxe, <br />Déjà à Votre Portée.
            </h2>
          </div>

          <div className="flex overflow-x-auto gap-6 pb-8 scrollbar-hide snap-x snap-mandatory">
            {products
              .filter(p => p.availability === 'Coming Soon')
              .slice(0, 5)
              .map((product) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  key={product.id} 
                  className="flex-shrink-0 w-[85vw] md:w-[400px] snap-center cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <ProductCard 
                    product={product} 
                    isWishlisted={wishlist.includes(product.id)}
                    onWishlistToggle={() => toggleWishlist(product.id)}
                  />
                </motion.div>
              ))}
          </div>
        </section>

        {/* Collection Section */}
        <section id="collection">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-6 md:space-y-0">
            <div>
              <div className="flex items-center space-x-2 text-gray-400 mb-4">
                <Sparkles size={16} />
                <span className="text-xs font-bold uppercase tracking-widest">La Collection 2026</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight">
                {showWishlistOnly ? 'Votre Wishlist' : 'Conçu pour l\'Avant-Garde.'}
              </h2>
            </div>
            <div className="flex items-center space-x-6">
              <button 
                onClick={() => setShowWishlistOnly(!showWishlistOnly)}
                className={cn(
                  "flex items-center space-x-2 text-sm font-bold uppercase tracking-widest transition-colors",
                  showWishlistOnly ? "text-red-500" : "text-gray-400 hover:text-black dark:hover:text-white"
                )}
              >
                <Heart size={16} className={showWishlistOnly ? "fill-current" : ""} />
                <span>{showWishlistOnly ? 'Voir Tout' : `Wishlist (${wishlist.length})`}</span>
              </button>
              <button className="flex items-center space-x-2 text-sm font-bold uppercase tracking-widest group">
                <span>Voir toutes les pièces</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Horizontal Scroll on Mobile, Grid on Desktop */}
          <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8 md:pb-0 scrollbar-hide snap-x snap-mandatory">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={product.id} 
                  className="flex-shrink-0 w-[85vw] md:w-auto snap-center cursor-pointer h-full"
                  onClick={() => setSelectedProduct(product)}
                >
                  <ProductCard 
                    product={product} 
                    isWishlisted={wishlist.includes(product.id)}
                    onWishlistToggle={() => toggleWishlist(product.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
            {showWishlistOnly && filteredProducts.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <p className="text-gray-400 italic">Votre wishlist est vide pour le moment.</p>
              </div>
            )}
          </div>
        </section>

        {/* Reassurance Section */}
        <section id="reassurance" className="bg-neutral-50 dark:bg-neutral-900/50 -mx-6 px-6 py-32 rounded-[4rem]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">Approuvé par l'Élite.</h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                Notre communauté mondiale de collectionneurs et d'innovateurs définit le nouveau standard du luxe.
              </p>
            </div>
            <Testimonials />
            
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: Globe, title: 'Conciergerie Mondiale', desc: 'Service Personnel 24/7' },
                { icon: ShieldCheck, title: 'Garantie à Vie', desc: 'Protection Inégalée' },
                { icon: Sparkles, title: 'Options Sur Mesure', desc: 'Adapté à Vos Besoins' },
                { icon: ArrowRight, title: 'Visites Privées', desc: 'Accès Exclusif' },
              ].map((item, i) => (
                <div key={i} className="text-center space-y-4">
                  <div className="w-12 h-12 bg-white dark:bg-neutral-800 rounded-2xl shadow-sm flex items-center justify-center mx-auto">
                    <item.icon size={20} className="text-gray-400" />
                  </div>
                  <h4 className="font-bold text-sm">{item.title}</h4>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-20 border-t border-gray-100 dark:border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-2">
              <div className="text-3xl font-bold tracking-tighter mb-8 cursor-pointer" onClick={() => scrollToSection('hero')}>LUXE<span className="text-gray-400">26</span></div>
              <p className="text-gray-500 max-w-sm mb-8">
                La première vitrine numérique mondiale pour les innovations lifestyle de luxe. Redéfinir l'excellence depuis 2026.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer">
                  <Instagram size={18} />
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer">
                  <Globe size={18} />
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-bold uppercase text-[10px] tracking-widest text-gray-400 mb-6">Collection</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li onClick={() => scrollToSection('collection')} className="hover:text-gray-500 cursor-pointer">Horlogerie</li>
                <li onClick={() => scrollToSection('collection')} className="hover:text-gray-500 cursor-pointer">Systèmes Audio</li>
                <li onClick={() => scrollToSection('collection')} className="hover:text-gray-500 cursor-pointer">Smart Living</li>
                <li onClick={() => scrollToSection('collection')} className="hover:text-gray-500 cursor-pointer">Sur Mesure</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold uppercase text-[10px] tracking-widest text-gray-400 mb-6">Entreprise</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li onClick={() => scrollToSection('reassurance')} className="hover:text-gray-500 cursor-pointer">Notre Héritage</li>
                <li onClick={() => scrollToSection('reassurance')} className="hover:text-gray-500 cursor-pointer">Durabilité</li>
                <li onClick={() => scrollToSection('reassurance')} className="hover:text-gray-500 cursor-pointer">Carrières</li>
                <li onClick={() => scrollToSection('reassurance')} className="hover:text-gray-500 cursor-pointer">Contact</li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center py-8 border-t border-gray-50 dark:border-white/5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            <p>© 2026 LUXE CATALOGUE. TOUS DROITS RÉSERVÉS.</p>
            <div className="flex space-x-8 mt-4 md:mt-0">
              <span className="hover:text-black dark:hover:text-white cursor-pointer">Politique de Confidentialité</span>
              <span className="hover:text-black dark:hover:text-white cursor-pointer">Conditions d'Utilisation</span>
            </div>
          </div>
        </footer>
      </main>

      <ProductModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        isWishlisted={selectedProduct ? wishlist.includes(selectedProduct.id) : false}
        onWishlistToggle={() => selectedProduct && toggleWishlist(selectedProduct.id)}
        onAuthRequired={() => setIsAuthModalOpen(true)}
      />

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />

      <Chatbot />
    </div>
  );
}
