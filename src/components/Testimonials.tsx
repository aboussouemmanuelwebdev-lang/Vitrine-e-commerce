import { motion } from 'motion/react';
import { Instagram, Music2 } from 'lucide-react';
import { testimonials } from '../data/products';
import { BlurImage } from './BlurImage';

export function Testimonials() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {testimonials.map((t, i) => (
        <motion.div 
          key={t.id}
          initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-neutral-900 p-8 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <BlurImage src={t.avatar} alt={t.author} className="w-12 h-12 rounded-full" />
              <div>
                <p className="font-bold">{t.author}</p>
                <p className="text-xs text-gray-400">{t.handle}</p>
              </div>
            </div>
            {t.platform === 'instagram' ? (
              <Instagram size={20} className="text-pink-500" />
            ) : (
              <Music2 size={20} className="text-cyan-500" />
            )}
          </div>
          <p className="text-lg font-medium leading-relaxed text-gray-700 dark:text-gray-300 italic">
            "{t.content}"
          </p>
          <div className="mt-6 pt-6 border-t border-gray-50 dark:border-white/5 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Client Vérifié</span>
            <div className="flex space-x-1">
              {[1,2,3,4,5].map(s => (
                <div key={s} className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
