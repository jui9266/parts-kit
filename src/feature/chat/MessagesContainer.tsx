import { Paperclip, Check, Copy, Loader2 } from 'lucide-react'
import React from 'react'

type MessagesContainerProps = {
  messages: {
    role: string
    content: string
    image?: string
  }[]
  isLoading: boolean
  copied: boolean
  copyToClipboard: (text: string) => void
  messagesEndRef: React.RefObject<HTMLDivElement | null>
}

const MessagesContainer = ({
  messages,
  isLoading,
  copied,
  copyToClipboard,
  messagesEndRef,
}: MessagesContainerProps) => {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {messages.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Paperclip size={32} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-800 mb-2">시작하기</h2>
            <p className="text-slate-600">UI 이미지를 업로드하면 React 컴포넌트로 변환해드립니다</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] ${
                  msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-slate-800 border border-slate-200'
                } rounded-2xl p-4 shadow-sm`}
              >
                {msg.image && (
                  <img src={msg.image} alt="Uploaded" className="rounded-lg mb-3 max-h-64 object-contain" />
                )}
                {msg.content && <div className="whitespace-pre-wrap break-words">{msg.content}</div>}
                {msg.role === 'assistant' && msg.content.includes('```') && (
                  <button
                    onClick={() => copyToClipboard(msg.content)}
                    className="mt-2 flex items-center gap-1 text-sm text-slate-600 hover:text-slate-800"
                  >
                    {copied ? (
                      <>
                        <Check size={14} />
                        <span>복사됨</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>코드 복사</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Loader2 size={18} className="animate-spin" />
                <span>코드 생성 중...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}

export default MessagesContainer
