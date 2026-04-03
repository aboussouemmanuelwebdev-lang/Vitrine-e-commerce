import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

interface SpecificationsProps {
  specs: { label: string; value: string }[];
}

export function Specifications({ specs }: SpecificationsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-t border-gray-100 dark:border-white/5">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between group"
      >
        <span className="text-sm font-bold uppercase tracking-widest text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">Spécifications Techniques</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown size={20} className="text-gray-400" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-8 space-y-4">
              {specs.map((spec, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-white/5 last:border-0">
                  <span className="text-sm text-gray-500">{spec.label}</span>
                  <span className="text-sm font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
