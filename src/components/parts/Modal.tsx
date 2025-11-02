//해당 컴포넌트는 AI를 이용하여 만든 테스트 컴포넌트입니다.

import { Bell } from 'lucide-react'
import React from 'react'

interface PriceAlertModalProps {
  open: boolean
  onClose: () => void
  onCreateAlert: () => void
  title?: string
  description?: string
  createButtonText?: string
  cancelButtonText?: string
}

const Modal: React.FC<PriceAlertModalProps> = ({
  open,
  onClose,
  onCreateAlert,
  title = 'Want to know when prices change?',
  description = "Create a Price Alert and we'll let you know when prices change for this route.",
  createButtonText = 'Create',
  cancelButtonText = 'No thanks',
}) => {
  if (!open) return null

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleCreateClick = () => {
    onCreateAlert()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative w-full max-w-md">
        {/* Icon - Absolute positioned outside modal */}
        <div className="absolute left-1/2 top-0 z-10 flex -translate-x-1/2 -translate-y-1/2 transform">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-500 shadow-lg">
            <Bell className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Modal Content */}
        <div className="rounded-lg bg-white shadow-xl animate-in fade-in zoom-in duration-200">
          {/* Content */}
          <div className="px-6 pb-6 pt-14 text-center sm:px-8">
            <h2 id="modal-title" className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl">
              {title}
            </h2>
            <p className="mb-6 text-base text-gray-600 sm:text-lg">{description}</p>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleCreateClick}
                className="w-full rounded-md bg-teal-500 px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 active:bg-teal-700"
                aria-label={createButtonText}
              >
                {createButtonText}
              </button>
              <button
                onClick={onClose}
                className="w-full rounded-md bg-transparent px-6 py-3 text-lg font-semibold text-blue-600 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label={cancelButtonText}
              >
                {cancelButtonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal
