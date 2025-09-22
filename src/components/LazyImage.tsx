'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  onLoad?: () => void;
  placeholder?: string;
  sizes?: string;
  quality?: number;
  fill?: boolean;
  style?: React.CSSProperties;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  onLoad,
  placeholder = '/images/placeholder.jpg',
  sizes,
  quality = 75,
  fill = false,
  style,
  objectFit = 'cover'
}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) {
      setIsIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsIntersecting(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.01
      }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [priority]);

  const handleError = () => {
    setHasError(true);
  };

  const imageSrc = hasError ? placeholder : src;

  if (!isIntersecting && !priority) {
    return (
      <div
        ref={imageRef}
        className={className}
        style={{
          width: fill ? '100%' : width,
          height: fill ? '100%' : height,
          backgroundColor: '#f0f0f0',
          position: fill ? 'relative' : undefined,
          ...style
        }}
      />
    );
  }

  if (fill) {
    return (
      <div ref={imageRef} style={{ position: 'relative', width: '100%', height: '100%', ...style }}>
        <Image
          src={imageSrc}
          alt={alt}
          className={className}
          fill
          sizes={sizes || '100vw'}
          quality={quality}
          onLoad={onLoad}
          onError={handleError}
          style={{ objectFit }}
          priority={priority}
        />
      </div>
    );
  }

  return (
    <div ref={imageRef} style={style}>
      <Image
        src={imageSrc}
        alt={alt}
        className={className}
        width={width || 300}
        height={height || 200}
        sizes={sizes}
        quality={quality}
        onLoad={onLoad}
        onError={handleError}
        priority={priority}
      />
    </div>
  );
};

export default LazyImage;