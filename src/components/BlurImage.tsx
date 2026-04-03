import React, { useState } from 'react';
import { cn } from '../lib/utils';

interface BlurImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  onLoad?: React.ReactEventHandler<HTMLImageElement>;
}

export function BlurImage({ src, alt, className, onLoad, ...props }: BlurImageProps) {
  const [isLoading, setLoading] = useState(true);

  return (
    <div className={cn("overflow-hidden bg-gray-100 dark:bg-neutral-800", className)}>
      <img
        {...props}
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={(e) => {
          setLoading(false);
          if (onLoad) onLoad(e);
        }}
        className={cn(
          "w-full h-full object-cover duration-700 ease-in-out",
          isLoading
            ? "scale-110 blur-xl grayscale"
            : "scale-100 blur-0 grayscale-0",
          className
        )}
      />
    </div>
  );
}
