import React, { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

interface FileUploadProps {
  onUpload: (url: string, key: string) => void
  onRemove?: () => void
  currentImage?: string
  className?: string
  accept?: string
  maxSizeInMB?: number
}

const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  onRemove,
  currentImage,
  className = '',
  accept = 'image/*',
  maxSizeInMB = 10,
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    if (!file) return

    // 파일 크기 검증
    if (file.size > maxSizeInMB * 1024 * 1024) {
      setError(`파일 크기는 ${maxSizeInMB}MB를 초과할 수 없습니다.`)
      return
    }

    // 이미지 파일인지 확인
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드 가능합니다.')
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'images')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        onUpload(result.url, result.key)
      } else {
        setError(result.error || '업로드에 실패했습니다.')
      }
    } catch (err) {
      setError('업로드 중 오류가 발생했습니다.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemove = () => {
    onRemove?.()
    setError(null)
  }

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
        disabled={isUploading}
      />

      {currentImage ? (
        <div className="relative group">
          <div className="w-full h-48 border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
            <img src={currentImage} alt="업로드된 이미지" className="w-full h-full object-cover" />
          </div>
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            disabled={isUploading}
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          className={`w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
            dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          {isUploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-sm text-gray-600">업로드 중...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <ImageIcon size={48} className="text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-1">클릭하거나 파일을 드래그하여 업로드</p>
              <p className="text-xs text-gray-500">최대 {maxSizeInMB}MB, 이미지 파일만 가능</p>
            </div>
          )}
        </div>
      )}

      {error && <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">{error}</div>}
    </div>
  )
}

export default FileUpload
