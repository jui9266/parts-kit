import React from 'react'
import Image from 'next/image'
import { useS3Image } from '@/hooks/useS3Image'
import DefaultImage from '@/assets/images/part-default-image.jpg'

interface S3ImageProps {
  src?: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  sizes?: string
  priority?: boolean
  quality?: number
  fallbackImage?: string
  onError?: () => void
}

const S3Image: React.FC<S3ImageProps> = ({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  sizes,
  priority = false,
  quality = 75,
  fallbackImage,
  onError,
}) => {
  const { imageSrc, isLoading, handleImageError } = useS3Image(src, {
    fallbackImage: fallbackImage || DefaultImage.src,
    onError,
  })

  const imageProps = {
    src: imageSrc,
    alt,
    className: `${className} ${isLoading ? 'opacity-50' : ''}`,
    onError: handleImageError,
    priority,
    quality,
    ...(fill
      ? {
          fill: true,
          sizes: sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
        }
      : {
          width: width || 300,
          height: height || 200,
        }),
  }

  return <Image {...imageProps} />
}

export default S3Image
