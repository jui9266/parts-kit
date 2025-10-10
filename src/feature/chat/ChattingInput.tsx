import React, { useState } from 'react'
import { Loader2, Paperclip, Send, X } from 'lucide-react'

interface ChattingInputProps {
  handleSubmit: () => void
  file: File | undefined
  setFile: (file: File) => void
  message: string
  setMessage: (message: string) => void
}

const ChattingInput = ({ handleSubmit, file, setFile, message, setMessage }: ChattingInputProps) => {
  const [previewUrl, setPreviewUrl] = useState<string>('')

  const [isLoading, setIsLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  return (
    <div className="bg-white border-t border-slate-200 px-4 py-4 sticky bottom-0">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
          <div className="space-y-3">
            {file && previewUrl && (
              <div className="relative inline-block">
                <img src={previewUrl} alt="Preview" className="max-h-32 rounded-lg border border-slate-300" />
                <button
                  onClick={() => {}}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-lg"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            <div className="flex gap-2 items-center">
              <label className="flex-shrink-0 flex items-center gap-2 px-3 py-2.5 text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-xl cursor-pointer transition">
                <Paperclip size={18} />
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>

              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="메시지를 입력하세요..."
                rows={1}
                className="flex-1 p-3 bg-white border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={handleSubmit}
                disabled={(!message.trim() && !file) || isLoading}
                className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition font-medium"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>전송 중</span>
                  </>
                ) : (
                  <>
                    <span>전송</span>
                    <Send size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-2">Enter로 전송 • Shift + Enter로 줄바꿈</p>
      </div>
    </div>
  )
}

export default ChattingInput
