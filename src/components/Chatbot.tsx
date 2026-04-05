import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Sparkles, User, Bot, Loader2, Phone } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { cn } from '../lib/utils';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Bonjour. Je suis votre Concierge Luxe. Comment puis-je vous assister dans votre quête d\'excellence aujourd\'hui ? Vous pouvez aussi me contacter directement sur WhatsApp via l\'icône en haut à droite.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: `Tu es le Concierge Luxe pour LUXE26 à Abidjan, Côte d’Ivoire. Ton ton est sophistiqué, exclusif et extrêmement serviable. 

CONTEXTE OBLIGATOIRE :
- Localisation : Abidjan uniquement.
- Pays : Côte d’Ivoire.
- Devise : Franc CFA (XOF) uniquement. Ne jamais utiliser Euro (€) ou Dollar ($).
- Livraison : Disponible uniquement à Abidjan (Cocody, Yopougon, Abobo, Marcory, Treichville, etc.) sous 24h à 72h. Demande toujours la commune pour la livraison.
- Paiement : Mobile Money (MTN, Orange, Moov) et PayDunya.

RÈGLES STRICTES :
- Tu ignores toute autre localisation incorrecte. Si un client mentionne un autre pays ou une livraison internationale, refuse poliment et ramène la conversation à Abidjan.
- Convertis systématiquement toute autre devise mentionnée en FCFA.
- Tu guides le client vers la commande et simplifies le processus d'achat.
- Tu connais parfaitement la collection LUXE26 (horlogerie, audio, smart living).`,
        },
        // Pass history to maintain context
        history: messages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }))
      });

      const response = await chat.sendMessage({ message: userMessage });
      const text = response.text;

      if (text) {
        setMessages(prev => [...prev, { role: 'model', text }]);
      }
    } catch (error) {
      console.error('Chatbot Error:', error);
      setMessages(prev => [...prev, { role: 'model', text: "Je m'excuse, mais je rencontre une difficulté technique. Pourriez-vous reformuler votre demande ?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-8 right-8 z-[90] w-16 h-16 bg-black dark:bg-white text-white dark:text-black rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform group",
          isOpen && "scale-0 opacity-0 pointer-events-none"
        )}
      >
        <MessageCircle size={24} className="group-hover:rotate-12 transition-transform" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-black animate-pulse" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-8 right-8 z-[100] w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] bg-white dark:bg-neutral-900 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.2)] border border-gray-100 dark:border-white/5 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-black text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <Sparkles size={20} className="text-gray-400" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight">Concierge Luxe</h3>
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] uppercase tracking-widest font-bold opacity-50">En ligne</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <a 
                  href="https://wa.me/2250104427006" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center hover:scale-110 transition-transform"
                  title="Contacter sur WhatsApp"
                >
                  <MessageCircle size={16} className="fill-current" />
                </a>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {messages.map((m, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i}
                  className={cn(
                    "flex items-start space-x-3",
                    m.role === 'user' ? "flex-row-reverse space-x-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                    m.role === 'user' ? "bg-gray-100 dark:bg-white/5" : "bg-black text-white"
                  )}>
                    {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className={cn(
                    "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed",
                    m.role === 'user' 
                      ? "bg-black text-white rounded-tr-none" 
                      : "bg-gray-50 dark:bg-white/5 text-gray-800 dark:text-gray-200 rounded-tl-none"
                  )}>
                    {m.text}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center">
                    <Bot size={14} />
                  </div>
                  <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl rounded-tl-none">
                    <Loader2 size={16} className="animate-spin text-gray-400" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-6 pt-0">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Votre message..."
                  className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl py-4 pl-6 pr-14 text-sm focus:ring-2 focus:ring-black dark:focus:ring-white transition-all outline-none"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black dark:bg-white text-white dark:text-black rounded-xl flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100"
                >
                  <Send size={16} />
                </button>
              </div>
              <p className="text-[10px] text-center text-gray-400 mt-4 uppercase tracking-widest font-bold">
                Propulsé par l'IA LUXE26
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
