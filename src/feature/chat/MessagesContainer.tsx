import { Loader2 } from 'lucide-react'
import React from 'react'
import { AssistantMessage } from './AssistantMessage'
import NewCahtContainer from './NewCahtContainer'

type MessagesContainerProps = {
  isNewChat?: boolean
  messages: {
    role: string
    content: string
    type: 'text' | 'image'
  }[]
  isLoading: boolean
  messagesEndRef: React.RefObject<HTMLDivElement | null>
}

const MessagesContainer = ({ isNewChat, messages, isLoading, messagesEndRef }: MessagesContainerProps) => {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {isNewChat && messages.length === 0 ? (
          <NewCahtContainer />
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] ${
                  msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-slate-800 border border-slate-200'
                } rounded-2xl p-4`}
              >
                {msg.type === 'image' && (
                  <img src={msg.content} alt="Uploaded" className="rounded-lg mb-3 max-h-64 object-contain" />
                )}
                {msg.role === 'user' && msg.type === 'text' && <span>{msg.content}</span>}
                {msg.role === 'assistant' && <AssistantMessage msg={msg} />}
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl p-4">
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
