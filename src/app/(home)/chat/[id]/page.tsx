'use client'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import MessagesContainer from '@/feature/chat/MessagesContainer'
import { IChatMessageModel } from '@/models/ChatMessage'
import ChattingInput from '@/feature/chat/ChattingInput'
import { chatAction } from '@/actions/chat'

const ChatPage = () => {
  const { id } = useParams()
  const [messages, setMessages] = useState<IChatMessageModel[]>([])
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState<File | undefined>(undefined)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const scrollToBottom = () => {
    console.log('scrollToBottom')
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!id) return
    const fetchMessages = async () => {
      const res = await fetch(`/api/chat/${id}`)
      const data = await res.json()
      setMessages(data)
    }
    fetchMessages()
  }, [id])

  const handleSubmit = async () => {
    const userMessage = message.trim()
    setMessage('')
    setIsLoading(true)

    await setMessages(prev => [...prev, { role: 'user', content: userMessage } as IChatMessageModel])

    try {
      // 대화 히스토리와 함께 API 호출
      const result = await chatAction({
        message: userMessage,
        roomId: id as string,
        file,
        history: messages as IChatMessageModel[],
      })

      await setMessages(prev => [...prev, { role: 'assistant', content: result.content || '' } as IChatMessageModel])
    } catch (error) {
      console.error('Chat error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* <Header title="Parts Kit AI" description="이미지를 React 컴포넌트로 변환" /> */}
      <MessagesContainer
        messages={messages}
        isLoading={isLoading}
        copied={false}
        copyToClipboard={() => {}}
        messagesEndRef={messagesEndRef}
      />
      <ChattingInput
        handleSubmit={handleSubmit}
        file={undefined}
        setFile={() => {}}
        message={message}
        setMessage={setMessage}
      />
    </div>
  )
}

export default ChatPage
