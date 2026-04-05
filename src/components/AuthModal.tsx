import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, LogIn, UserPlus, LogOut } from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Create user profile in Firestore if it doesn't exist
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          name: user.displayName || 'Utilisateur Prestige',
          email: user.email,
          role: 'user',
          wishlist: [],
          createdAt: serverTimestamp(),
        });
      }
      onClose();
    } catch (err: any) {
      console.error("Auth Error:", err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError("La fenêtre de connexion a été fermée avant la fin. Veuillez réessayer sans fermer la fenêtre surgissante.");
      } else if (err.code === 'auth/popup-blocked') {
        setError("La fenêtre de connexion a été bloquée par votre navigateur. Veuillez autoriser les popups pour ce site.");
      } else if (err.code === 'auth/cancelled-popup-request') {
        setError("Une demande de connexion est déjà en cours.");
      } else if (err.code === 'auth/unauthorized-domain') {
        setError("Ce domaine n'est pas autorisé dans la console Firebase. Veuillez ajouter 'luxe26.netlify.app' aux domaines autorisés dans l'authentification Firebase.");
      } else if (err.code === 'auth/operation-not-allowed') {
        setError("La connexion avec Google n'est pas activée dans votre console Firebase. Veuillez l'activer dans la section Authentication > Sign-in method.");
      } else {
        setError("Une erreur est survenue lors de la connexion avec Google. Veuillez réessayer.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;
        
        // Create user profile in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          name: name || 'Utilisateur Prestige',
          email: user.email,
          role: 'user',
          wishlist: [],
          createdAt: serverTimestamp(),
        });
      }
      onClose();
    } catch (err: any) {
      console.error("Auth Error:", err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError("Email ou mot de passe incorrect.");
      } else if (err.code === 'auth/email-already-in-use') {
        setError("Cet email est déjà utilisé par un autre compte.");
      } else if (err.code === 'auth/weak-password') {
        setError("Le mot de passe doit contenir au moins 6 caractères.");
      } else if (err.code === 'auth/invalid-email') {
        setError("L'adresse email n'est pas valide.");
      } else if (err.code === 'auth/operation-not-allowed') {
        setError("La connexion par Email/Mot de passe n'est pas activée dans votre console Firebase. Veuillez l'activer dans la section Authentication > Sign-in method.");
      } else if (err.message?.includes('permission-denied') || err.code === 'permission-denied') {
        setError("Erreur de permission Firestore. Veuillez vérifier que votre base de données Firestore est bien créée et que les règles sont déployées.");
      } else {
        setError(`Erreur: ${err.message || "Une erreur est survenue. Veuillez vérifier vos informations."}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white dark:bg-neutral-900 w-full max-w-md rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 bg-gray-100 dark:bg-white/5 rounded-full hover:scale-110 transition-transform"
            >
              <X size={18} />
            </button>

            {auth.currentUser ? (
              <div className="space-y-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                    {auth.currentUser.photoURL ? (
                      <img src={auth.currentUser.photoURL} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User size={40} className="text-gray-400" />
                    )}
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter mb-2">Votre Profil</h2>
                  <p className="text-sm text-gray-500">Gérez vos informations et votre wishlist.</p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Nom</p>
                    <p className="text-sm font-medium">{auth.currentUser.displayName || 'Utilisateur Prestige'}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Email</p>
                    <p className="text-sm font-medium">{auth.currentUser.email}</p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 bg-red-50 text-red-600 py-4 rounded-2xl text-sm font-bold hover:bg-red-100 transition-colors"
                >
                  <LogOut size={18} />
                  <span>Se déconnecter</span>
                </button>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold tracking-tighter mb-2">
                    {isLogin ? 'Bon retour' : 'Rejoindre LUXE26'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {isLogin 
                      ? 'Connectez-vous pour accéder à votre wishlist.' 
                      : 'Créez un compte pour sauvegarder vos favoris.'}
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs rounded-2xl font-medium">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nom complet"
                        className="w-full bg-gray-50 dark:bg-white/5 border border-transparent focus:border-black dark:focus:border-white rounded-2xl py-4 pl-12 pr-4 text-sm outline-none transition-all"
                      />
                    </div>
                  )}
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      className="w-full bg-gray-50 dark:bg-white/5 border border-transparent focus:border-black dark:focus:border-white rounded-2xl py-4 pl-12 pr-4 text-sm outline-none transition-all"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mot de passe"
                      className="w-full bg-gray-50 dark:bg-white/5 border border-transparent focus:border-black dark:focus:border-white rounded-2xl py-4 pl-12 pr-4 text-sm outline-none transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center space-x-2 bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
                        <span>{isLogin ? 'Se connecter' : "S'inscrire"}</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100 dark:border-white/5"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold text-gray-400">
                    <span className="bg-white dark:bg-neutral-900 px-4">Ou</span>
                  </div>
                </div>

                <button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center space-x-3 bg-gray-50 dark:bg-white/5 py-4 rounded-2xl text-sm font-bold hover:bg-gray-100 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      <span>Continuer avec Google</span>
                    </>
                  )}
                </button>

                <p className="mt-4 text-[10px] text-center text-gray-400 uppercase tracking-widest font-bold">
                  Une fenêtre surgissante s'ouvrira pour la connexion.
                </p>

                <div className="mt-8 text-center">
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                  >
                    {isLogin 
                      ? "Pas encore de compte ? S'inscrire" 
                      : "Déjà un compte ? Se connecter"}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
