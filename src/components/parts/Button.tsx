//해당 컴포넌트는 AI를 이용하여 만든 테스트 컴포넌트입니다.
import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'contained' | 'outlined' | 'disabled'
  fullWidth?: boolean
  onClick?: () => void
  disabled?: boolean
  className?: string
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'contained',
  fullWidth = false,
  onClick,
  disabled = false,
  className = '',
}) => {
  const baseClasses =
    'px-6 py-3 sm:px-8 sm:py-4 rounded-full font-medium text-base sm:text-lg transition-all duration-200'

  const variantClasses = {
    contained: 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md ',
    outlined: 'bg-transparent border-2 border-orange-400 text-orange-400 ',
    disabled: 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none',
  }

  const widthClass = fullWidth ? 'w-full' : 'w-auto'

  const currentVariant = disabled ? 'disabled' : variant

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[currentVariant]} ${widthClass} ${className}`}
      aria-disabled={disabled}
      type="button"
    >
      {children}
    </button>
  )
}

export default Button
