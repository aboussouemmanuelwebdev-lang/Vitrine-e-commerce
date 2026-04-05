import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  className?: string;
}

export function WhatsAppButton({ 
  phoneNumber = '2250104427006', // User's WhatsApp number
  message = 'Bonjour LUXE26, je souhaiterais avoir des informations sur vos produits.',
  className 
}: WhatsAppButtonProps) {
  
  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleWhatsAppClick}
      className={cn(
        "fixed bottom-28 right-8 z-[90] w-16 h-16 bg-[#25D366] text-white rounded-full shadow-2xl flex items-center justify-center transition-transform group",
        className
      )}
      title="Discuter sur WhatsApp"
    >
      <MessageCircle size={28} className="fill-current" />
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full border-2 border-[#25D366] flex items-center justify-center">
        <div className="w-2 h-2 bg-[#25D366] rounded-full animate-pulse" />
      </div>
      
      {/* Tooltip */}
      <div className="absolute right-20 bg-white dark:bg-neutral-900 text-black dark:text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-gray-100 dark:border-white/5">
        Besoin d'aide ? Contactez-nous
      </div>
    </motion.button>
  );
}
