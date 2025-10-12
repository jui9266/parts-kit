import { useState, useEffect } from 'react'
import DefaultImage from '@/assets/images/part-default-image.jpg'

interface UseS3ImageOptions {
  fallbackImage?: string
  onError?: () => void
}

export function useS3Image(imageUrl?: string, options: UseS3ImageOptions = {}) {
  const [imageSrc, setImageSrc] = useState<string>(imageUrl || DefaultImage.src)
  const [isLoading, setIsLoading] = useState(!!imageUrl)
  const [hasError, setHasError] = useState(false)

  const { fallbackImage = DefaultImage.src, onError } = options

  useEffect(() => {
    if (!imageUrl) {
      setImageSrc(fallbackImage)
      setIsLoading(false)
      setHasError(false)
      return
    }

    setIsLoading(true)
    setHasError(false)

    // 이미지 로드 테스트
    const img = new Image()
    img.onload = () => {
      setImageSrc(imageUrl)
      setIsLoading(false)
      setHasError(false)
    }
    img.onerror = () => {
      setImageSrc(fallbackImage)
      setIsLoading(false)
      setHasError(true)
      onError?.()
    }
    img.src = imageUrl

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [imageUrl, fallbackImage, onError])

  const handleImageError = () => {
    if (!hasError) {
      setImageSrc(fallbackImage)
      setHasError(true)
      onError?.()
    }
  }

  return {
    imageSrc,
    isLoading,
    hasError,
    handleImageError,
  }
}
