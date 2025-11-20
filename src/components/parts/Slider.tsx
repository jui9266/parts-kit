'use client'

import React, { useState, useRef, useEffect } from 'react'

interface SliderProps {
  value?: number
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  label?: string
  onChange?: (value: number) => void
  onChangeCommitted?: (value: number) => void
  className?: string
}

const Slider: React.FC<SliderProps> = ({
  value: controlledValue,
  defaultValue = 50,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  label = 'pretto.fr',
  onChange,
  onChangeCommitted,
  className = '',
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const [isDragging, setIsDragging] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)

  const value = controlledValue !== undefined ? controlledValue : internalValue

  const percentage = ((value - min) / (max - min)) * 100

  const updateValue = (clientX: number) => {
    if (!sliderRef.current || disabled) return

    const rect = sliderRef.current.getBoundingClientRect()
    const offsetX = clientX - rect.left
    const newPercentage = Math.max(0, Math.min(100, (offsetX / rect.width) * 100))
    const rawValue = (newPercentage / 100) * (max - min) + min
    const steppedValue = Math.round(rawValue / step) * step
    const clampedValue = Math.max(min, Math.min(max, steppedValue))

    if (controlledValue === undefined) {
      setInternalValue(clampedValue)
    }

    onChange?.(clampedValue)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return
    setIsDragging(true)
    updateValue(e.clientX)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return
    setIsDragging(true)
    updateValue(e.touches[0].clientX)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        updateValue(e.clientX)
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        updateValue(e.touches[0].clientX)
      }
    }

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false)
        onChangeCommitted?.(value)
      }
    }

    const handleTouchEnd = () => {
      if (isDragging) {
        setIsDragging(false)
        onChangeCommitted?.(value)
      }
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleTouchMove)
      document.addEventListener('touchend', handleTouchEnd)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isDragging, value])

  return (
    <div className={`w-full max-w-md px-4 py-6 ${className}`}>
      {label && <label className="block mb-4 text-sm font-medium text-gray-700">{label}</label>}

      <div className="relative flex items-center">
        <div
          ref={sliderRef}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          className={`relative w-full h-1 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onKeyDown={e => {
            if (disabled) return
            let newValue = value
            if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
              e.preventDefault()
              newValue = Math.min(max, value + step)
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
              e.preventDefault()
              newValue = Math.max(min, value - step)
            }
            if (newValue !== value) {
              if (controlledValue === undefined) {
                setInternalValue(newValue)
              }
              onChange?.(newValue)
              onChangeCommitted?.(newValue)
            }
          }}
        >
          {/* Track Background */}
          <div className="absolute w-full h-1 bg-teal-200 rounded-full" />

          {/* Active Track */}
          <div className="absolute h-1 bg-teal-500 rounded-full transition-all" style={{ width: `${percentage}%` }} />

          {/* Thumb */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2" style={{ left: `${percentage}%` }}>
            <div
              className={`w-5 h-5 bg-white border-2 border-teal-500 rounded-full shadow-md transition-transform ${
                isDragging ? 'scale-125' : 'scale-100'
              } ${
                disabled ? 'opacity-50' : 'hover:scale-110'
              } focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Slider
