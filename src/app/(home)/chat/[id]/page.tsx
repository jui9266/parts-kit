'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import MessagesContainer from '@/feature/chat/MessagesContainer'
import Header from '@/components/comon/Header'
import { IChatMessageModel } from '@/models/ChatMessage'
import ChattingInput from '@/feature/chat/ChattingInput'

const ChatPage = () => {
  const { id } = useParams()
  const [messages, setMessages] = useState<IChatMessageModel[]>([])

  useEffect(() => {
    if (!id) return
    const fetchMessages = async () => {
      const res = await fetch(`/api/chat/${id}`)
      const data = await res.json()
      setMessages(data)
    }
    fetchMessages()
  }, [id])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* <Header title="Parts Kit AI" description="이미지를 React 컴포넌트로 변환" /> */}
      <MessagesContainer messages={messages} isLoading={false} copied={false} copyToClipboard={() => {}} />
      <ChattingInput />
    </div>
  )
}

export default ChatPage
