import Image from 'next/image';

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
    ? `object-cover ${className}`
    : `${className}`;

  return (
    <Image
      src={src}
      alt={alt}
      className={imgClassName}
      fill={fill}
      {...rest}
    />
  );
} 