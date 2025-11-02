//해당 컴포넌트는 AI를 이용하여 만든 테스트 컴포넌트입니다.
import React from 'react'

interface FormFieldProps {
  label: string
  placeholder?: string
  helperText?: string
  error?: boolean
  disabled?: boolean
  required?: boolean
  value?: string
  onChange?: (value: string) => void
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  placeholder = '',
  helperText = '',
  error = false,
  disabled = false,
  required = false,
  value = '',
  onChange,
}) => {
  const handleClear = () => {
    if (onChange && !disabled) {
      onChange('')
    }
  }

  const inputClasses = `
    w-full px-4 py-3 rounded-lg border transition-colors
    ${
      error
        ? 'border-red-500 bg-red-50 text-red-900 focus:outline-none focus:ring-2 focus:ring-red-500'
        : disabled
        ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
        : 'border-blue-400 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500'
    }
  `

  const helperTextClasses = `
    mt-2 text-sm
    ${error ? 'text-red-500' : 'text-gray-500'}
  `

  return (
    <div className="w-full max-w-2xl mx-auto">
      <label className="block">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-base font-semibold text-gray-900">{label}</span>
          {required && <span className="text-red-500">*</span>}
        </div>
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={e => onChange?.(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={error}
            aria-describedby={helperText ? `helper-text-${label}` : undefined}
            className={inputClasses}
          />
          {value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear input"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-gray-400 hover:bg-gray-500 transition-colors"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </label>
      {helperText && (
        <p id={`helper-text-${label}`} className={helperTextClasses}>
          {helperText}
        </p>
      )}
    </div>
  )
}

const FormFieldDemo: React.FC = () => {
  const [value, setValue] = React.useState('Typing')
  const [isError, setIsError] = React.useState(false)
  const [isDisabled, setIsDisabled] = React.useState(false)

  return (
    <div className="bg-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Form Field */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <FormField
            label="Title"
            placeholder="Enter text"
            helperText={isError ? 'Please enter a Error description.' : 'Please enter a Guide description.'}
            required
            error={isError}
            disabled={isDisabled}
            value={value}
            onChange={setValue}
          />
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">State Controls</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isError}
                onChange={e => setIsError(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">Error State</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isDisabled}
                onChange={e => setIsDisabled(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">Disabled State</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormFieldDemo
