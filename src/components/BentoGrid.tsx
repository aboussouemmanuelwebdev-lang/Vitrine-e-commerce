import { motion } from 'motion/react';
import { ArrowUpRight, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { BlurImage } from './BlurImage';
import { useSiteConfig } from '../hooks/useSiteConfig';

interface BentoGridProps {
  onAuthClick: () => void;
  onScrollToCollection: () => void;
}

export function BentoGrid({ onAuthClick, onScrollToCollection }: BentoGridProps) {
  const { isAdmin, getImageUrl } = useSiteConfig();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[800px] md:h-[600px]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="md:col-span-2 md:row-span-2 bg-neutral-900 rounded-[2.5rem] p-10 flex flex-col justify-between text-white relative overflow-hidden group"
      >
        <BlurImage 
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200" 
          imageKey="hero_main"
          className="absolute inset-0 w-full h-full opacity-40 group-hover:scale-105 transition-transform duration-1000"
          alt="Hero"
        />
        <div className="relative z-10">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
            <Sparkles className="text-white" />
          </div>
          <h2 className="text-5xl font-bold tracking-tighter leading-tight">
            Le Futur du <br /> Luxe au Quotidien.
          </h2>
        </div>
        <div className="relative z-10 flex items-end justify-between">
          <p className="text-neutral-400 max-w-[250px]">
            Une sélection exclusive des innovations lifestyle les plus prestigieuses de 2026.
          </p>
          <button 
            onClick={onScrollToCollection}
            className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-black hover:rotate-45 transition-transform duration-500 shadow-xl"
          >
            <ArrowUpRight />
          </button>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="md:col-span-2 bg-neutral-100 dark:bg-neutral-800 rounded-[2.5rem] p-8 flex items-center justify-between group cursor-pointer"
        onClick={() => {
          const el = document.getElementById('reassurance');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <div>
          <div className="flex items-center space-x-2 text-amber-600 mb-2">
            <Zap size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Performance</span>
          </div>
          <h3 className="text-2xl font-bold tracking-tight">Livraison Ultra-Rapide</h3>
          <p className="text-neutral-500 mt-2">Service gants blancs dans toute l'Afrique.</p>
        </div>
        <div className="w-24 h-24 bg-white dark:bg-neutral-700 rounded-3xl shadow-sm flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform duration-500 relative">
          <BlurImage 
            src="https://cdn-icons-png.flaticon.com/512/726/726455.png"
            imageKey="delivery_icon"
            className="w-12 h-12 grayscale bg-transparent" 
            alt="Delivery" 
          />
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-neutral-100 dark:bg-neutral-800 rounded-[2.5rem] p-8 flex flex-col justify-between"
      >
        <ShieldCheck className="text-neutral-400" size={32} />
        <div>
          <h3 className="text-xl font-bold tracking-tight">Sécurisé</h3>
          <p className="text-sm text-neutral-500">Authenticité vérifiée par Blockchain.</p>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onClick={onAuthClick}
        className="bg-black rounded-[2.5rem] p-8 flex flex-col justify-between text-white cursor-pointer group hover:bg-neutral-900 transition-colors"
      >
        <div className="flex -space-x-2">
          {[1,2,3].map(i => (
            <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} className="w-8 h-8 rounded-full border-2 border-black" alt="User" />
          ))}
          <div className="w-8 h-8 rounded-full bg-neutral-800 border-2 border-black flex items-center justify-center text-[10px] font-bold">+12k</div>
        </div>
        <div>
          <h3 className="text-xl font-bold tracking-tight group-hover:text-amber-400 transition-colors">Communauté</h3>
          <p className="text-sm text-neutral-400">Rejoignez le cercle privé.</p>
        </div>
      </motion.div>
    </div>
  );
}
