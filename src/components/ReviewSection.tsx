import { useState, FormEvent, useEffect } from 'react';
import { Star, User, ThumbsUp, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  serverTimestamp, 
  increment,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';

interface Review {
  id: string;
  userName: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: any;
  likes: number;
  likedBy: string[];
}

interface ReviewSectionProps {
  productId: string;
  onAuthRequired?: () => void;
}

export function ReviewSection({ productId, onAuthRequired }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');

  // Fetch reviews from Firestore
  useEffect(() => {
    const reviewsRef = collection(db, 'reviews');
    const q = query(
      reviewsRef, 
      where('productId', '==', productId),
      orderBy(sortBy === 'recent' ? 'createdAt' : 'likes', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reviewsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];
      setReviews(reviewsData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'reviews');
    });

    return () => unsubscribe();
  }, [productId, sortBy]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !comment.trim()) return;
    if (!auth.currentUser) {
      if (onAuthRequired) onAuthRequired();
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        productId,
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || 'Utilisateur Prestige',
        rating,
        comment,
        likes: 0,
        likedBy: [],
        createdAt: serverTimestamp(),
      });
      setRating(0);
      setComment('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'reviews');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (reviewId: string, likedBy: string[]) => {
    if (!auth.currentUser) {
      if (onAuthRequired) onAuthRequired();
      return;
    }

    const isLiked = likedBy.includes(auth.currentUser.uid);
    const reviewRef = doc(db, 'reviews', reviewId);

    try {
      await updateDoc(reviewRef, {
        likes: increment(isLiked ? -1 : 1),
        likedBy: isLiked ? arrayRemove(auth.currentUser.uid) : arrayUnion(auth.currentUser.uid)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `reviews/${reviewId}`);
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl font-bold tracking-tighter mb-2">Avis Clients</h3>
          <div className="flex items-center space-x-2">
            <div className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={16} fill="currentColor" />
              ))}
            </div>
            <span className="text-sm font-bold">
              {reviews.length > 0 
                ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
                : '0'} / 5
            </span>
            <span className="text-sm text-gray-400">({reviews.length} avis)</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
            <button 
              onClick={() => setSortBy('recent')}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all",
                sortBy === 'recent' ? "bg-white dark:bg-neutral-800 shadow-sm" : "text-gray-400"
              )}
            >
              Récents
            </button>
            <button 
              onClick={() => setSortBy('popular')}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all",
                sortBy === 'popular' ? "bg-white dark:bg-neutral-800 shadow-sm" : "text-gray-400"
              )}
            >
              Populaires
            </button>
          </div>
        </div>
      </div>

      {/* Add Review Form */}
      <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-white/5 p-8 rounded-3xl space-y-6">
        <div className="space-y-4">
          <label className="text-sm font-bold uppercase tracking-widest text-gray-400">Votre Note</label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="transition-transform hover:scale-110"
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  size={24}
                  className={cn(
                    "transition-colors",
                    (hover || rating) >= star ? "text-amber-400 fill-current" : "text-gray-300"
                  )}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-bold uppercase tracking-widest text-gray-400">Votre Commentaire</label>
          <textarea
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Partagez votre expérience avec cette pièce d'exception..."
            className="w-full bg-white dark:bg-neutral-800 border border-transparent focus:border-black dark:focus:border-white rounded-2xl p-4 text-sm min-h-[120px] outline-none transition-all resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || rating === 0}
          className="bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-2xl text-sm font-bold hover:opacity-80 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <MessageSquare size={18} />
              <span>Publier l'avis</span>
            </>
          )}
        </button>
      </form>

      {/* Reviews List */}
      <div className="space-y-8">
        <AnimatePresence mode="popLayout">
          {reviews.map((review) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={review.id}
              className="border-b border-gray-100 dark:border-white/5 pb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center">
                    <User size={20} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{review.userName}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                      {review.createdAt?.toDate 
                        ? `${review.createdAt.toDate().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} à ${review.createdAt.toDate().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
                        : 'À l\'instant'}
                    </p>
                  </div>
                </div>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      fill={i < review.rating ? "currentColor" : "none"}
                      className={i < review.rating ? "" : "text-gray-200"}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                {review.comment}
              </p>
              <button 
                onClick={() => handleLike(review.id, review.likedBy)}
                className={cn(
                  "flex items-center space-x-2 text-xs font-bold uppercase tracking-widest transition-colors group",
                  auth.currentUser && review.likedBy.includes(auth.currentUser.uid) 
                    ? "text-amber-600" 
                    : "text-gray-400 hover:text-black dark:hover:text-white"
                )}
              >
                <ThumbsUp size={14} className={cn(
                  "transition-transform group-hover:-translate-y-0.5",
                  auth.currentUser && review.likedBy.includes(auth.currentUser.uid) ? "fill-current" : ""
                )} />
                <span>Utile ({review.likes})</span>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {reviews.length === 0 && (
          <div className="text-center py-12 bg-gray-50 dark:bg-white/5 rounded-[2rem]">
            <p className="text-gray-400 italic text-sm">Soyez le premier à laisser un avis sur cette pièce.</p>
          </div>
        )}
      </div>
    </div>
  );
}
