interface SimpleImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
}

export default function SimpleImage({ 
  src, 
  alt, 
  className = "",
  fill,
  ...rest 
}: SimpleImageProps) {
  const imgClassName = fill 
    ? `w-full h-full object-cover ${className}`
    : `${className}`;

  return (
    <img
      src={src}
      alt={alt}
      className={imgClassName}
    />
  );
} 