'use client';

import React, { useEffect, useMemo, useState } from 'react';
import NextImage from 'next/image';

interface Props {
  src: string;
  size?: number;
  alt?: string;
  isSquare?: boolean;
  aspectRatio?: string | null;
  width?: number | null;
  height?: number | null;
  maxHeight?: number | null;
  rounded?: number;
  roundedPill?: boolean;
  className?: string | null;
  uploading?: boolean;
}

const brokenPath = '';

export const AppImage: React.FC<Props> = ({
  src = '',
  size = 400,
  alt = '',
  aspectRatio = null,
  isSquare = false,
  width = null,
  height = null,
  maxHeight = null,
  rounded = 0,
  roundedPill = false,
  className = null,
  uploading = false,
}) => {
  const imagePath = useMemo(() => {
    return src;
  }, [src]);

  const isQueryStr = useMemo(() => {
    return imagePath.includes('unsplash');
  }, [imagePath]);

  const imgSize = useMemo(() => {
    let w = size;
    w = Math.min(w, 1200);
    return `w=${w}` + (isSquare ? `&h=${w}` : '');
  }, [size, isSquare]);

  const imgSize2 = useMemo(() => {
    let width = size * 2 > 600 ? size * 1.5 : size * 2
    width = Math.min(width, 1600)
    return `w=${width}` + (isSquare ? `&h=${width}` : '')
  }, [size, isSquare])

  const imgSizeSmall = useMemo(() => {
    return isQueryStr
      ? `url('${imagePath}?w=${size / 20}${isSquare ? `&h=${size / 20}` : ''}')`
      : `url('${imagePath}')`;
  }, [imagePath, isQueryStr, isSquare, size]);

  const srcAttr = useMemo(() => {
    return isQueryStr ? `${imagePath}?${imgSize}` : imagePath;
  }, [imagePath, imgSize, isQueryStr]);

  const srcsetAttr = useMemo(() => {
    return isQueryStr
      ? `${imagePath}?${imgSize} 1x, ${imagePath}?${imgSize2} 2x`
      : ''
  }, [imagePath, imgSize, imgSize2, isQueryStr]);

  const [currentSrc, setCurrentSrc] = useState<string>(srcAttr);
  const [isLoaded, setIsLoaded] = useState(false);

  // Reset when src changes
  useEffect(() => {
    setCurrentSrc(srcAttr);
    // 當 currentSrc 變動時才重設 isLoaded
    // 這樣可避免 effect 內同步 setState
  }, [srcAttr]);

  useEffect(() => {
    setIsLoaded(false);
  }, [currentSrc]);

  const wrapperClasses = useMemo(() => {
    const classes: string[] = [];
    if (className) classes.push(className);
    if (!width) classes.push('w-full');
    if (!height) classes.push('h-full');
    if (roundedPill) { classes.push('rounded-full') }
    return classes.join(' ');
  }, [className, width, height, roundedPill]);

  const wrapperStyle: React.CSSProperties = useMemo(() => {
    const style: React.CSSProperties = { position: 'relative', overflow: 'hidden' };
    if (aspectRatio) style.aspectRatio = aspectRatio as React.CSSProperties['aspectRatio'];
    if (width) style.width = `${width}px`;
    if (height) style.height = `${height}px`;
    if (maxHeight) style.maxHeight = `${maxHeight}px`;
    if (rounded && rounded > 0) style.borderRadius = `${rounded}px`;
    return style;
  }, [aspectRatio, width, height, maxHeight, rounded]);

  const imgStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: isLoaded ? 1 : 0,
    transition: 'opacity 0.5s',
  };

  const onError: React.ReactEventHandler<HTMLImageElement> = () => {
    setCurrentSrc(brokenPath);
  };

  const ImageElement = (
    <NextImage
      src={currentSrc}
      alt={alt}
      sizes={srcsetAttr}
      fill
      style={imgStyle}
      onLoad={() => setIsLoaded(true)}
      onError={onError}
      unoptimized={!isQueryStr}
      priority={uploading}
    />
  );

  return (
    <figure
      style={wrapperStyle}
      className={`m-0 flex items-center ${wrapperClasses}`}
    >
      {!isLoaded && (
        <div
          className="absolute inset-0"
          style={{
            filter: 'blur(10px)',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundImage: imgSizeSmall,
            pointerEvents: 'none',
          }}
        />
      )}
      {ImageElement}
    </figure>
  );
};

export default AppImage;

