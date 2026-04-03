export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  images: string[];
  specifications: {
    label: string;
    value: string;
  }[];
  availability: 'In Stock' | 'Limited Edition' | 'Coming Soon';
  calendlyUrl: string;
}

export interface Testimonial {
  id: string;
  author: string;
  handle: string;
  content: string;
  platform: 'instagram' | 'tiktok';
  avatar: string;
}
