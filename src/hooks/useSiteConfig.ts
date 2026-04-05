import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, collection } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';

export interface ProductOverride {
  name?: string;
  description?: string;
  price?: string;
  imageUrl?: string;
  category?: string;
  subcategory?: string;
}

export interface SiteConfig {
  customImages: Record<string, string>;
  updatedAt: string;
}

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [productOverrides, setProductOverrides] = useState<Record<string, ProductOverride>>({});
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'config', 'site'), (docSnap) => {
      if (docSnap.exists()) {
        setConfig(docSnap.data() as SiteConfig);
      } else {
        setConfig({ 
          customImages: {}, 
          updatedAt: new Date().toISOString() 
        });
      }
    }, (error) => {
      console.error('SiteConfig error:', error);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'productOverrides'), (snapshot) => {
      const overrides: Record<string, ProductOverride> = {};
      snapshot.forEach((doc) => {
        overrides[doc.id] = doc.data() as ProductOverride;
      });
      setProductOverrides(overrides);
    }, (error) => {
      console.error('ProductOverrides error:', error);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const checkAdmin = () => {
      const user = auth.currentUser;
      if (user && user.email?.toLowerCase() === 'aboussouemmanuel.webdev@gmail.com') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged(checkAdmin);
    return () => unsubscribe();
  }, []);

  const updateImage = async (key: string, url: string) => {
    if (!isAdmin) return;

    const configRef = doc(db, 'config', 'site');
    try {
      await setDoc(configRef, {
        customImages: {
          ...config?.customImages,
          [key]: url
        },
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'config/site');
    }
  };

  const updateProduct = async (productId: string, override: ProductOverride) => {
    if (!isAdmin) return;

    const overrideRef = doc(db, 'productOverrides', productId);
    try {
      await setDoc(overrideRef, {
        ...override,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `productOverrides/${productId}`);
    }
  };

  const getImageUrl = (key: string, defaultUrl: string) => {
    return config?.customImages?.[key] || defaultUrl;
  };

  const getProductData = (productId: string, defaultData: any) => {
    const override = productOverrides[productId];
    if (!override) return defaultData;
    
    const defaultImages = defaultData.images || [];
    
    return {
      ...defaultData,
      name: override.name || defaultData.name,
      description: override.description || defaultData.description,
      price: override.price || defaultData.price,
      category: override.category || defaultData.category,
      subcategory: override.subcategory || defaultData.subcategory,
      images: override.imageUrl 
        ? [override.imageUrl, ...defaultImages.slice(1)] 
        : defaultImages
    };
  };

  return { config, isAdmin, updateImage, updateProduct, getImageUrl, getProductData };
}
