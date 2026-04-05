import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: string | number) {
  const numericPrice = typeof price === 'string' 
    ? parseInt(price.replace(/[^0-9]/g, ''), 10) 
    : price;
  
  if (isNaN(numericPrice)) return price.toString();
  
  return new Intl.NumberFormat('fr-FR').format(numericPrice) + ' FCFA';
}

export function scrollToSection(id: string) {
  const element = document.getElementById(id);
  if (element) {
    const offset = 100;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}
